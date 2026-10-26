const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const PROFILE_FILE = path.join(ROOT, 'data', 'profile.json');
const PORT = Number(process.env.PORT || 3000);
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const MAX_BODY_BYTES = 16 * 1024;
const sessions = new Map();
const loginAttempts = new Map();
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml'
};

const DEFAULT_PROFILE = {
  fullNameMr: 'जितेंद्र बाळासाहेब बडेकर',
  fullNameEn: 'Jitendra Balasaheb Badekar',
  designationMr: 'सभापती, समाज कल्याण विभाग, पुणे जिल्हा परिषद'
};

function readProfile() {
  try {
    const parsed = JSON.parse(fs.readFileSync(PROFILE_FILE, 'utf8'));
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

function sendJson(res, statusCode, payload, headers = {}) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers
  });
  res.end(JSON.stringify(payload));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function renderHtml(filePath, pageTitle, pageSlug = '') {
  let html = fs.readFileSync(filePath, 'utf8');
  const profile = readProfile();
  const description = `${profile.fullNameMr} — ${profile.designationMr}. वैयक्तिक प्रोफाइल, सार्वजनिक कार्य आणि पडताळलेली माहिती.`;
  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.fullNameMr,
    alternateName: profile.fullNameEn,
    jobTitle: profile.designationMr
  }).replace(/</g, '\\u003c');

  html = html
    .replaceAll('<!-- PAGE_TITLE -->', escapeHtml(`${profile.fullNameMr} | ${pageTitle}`))
    .replaceAll('<!-- PAGE_LABEL -->', escapeHtml(pageTitle))
    .replaceAll('<!-- PAGE_SLUG -->', escapeHtml(pageSlug))
    .replaceAll('<!-- PAGE_DESCRIPTION -->', escapeHtml(description))
    .replaceAll('<!-- PAGE_AUTHOR -->', escapeHtml(profile.fullNameEn))
    .replaceAll('<!-- STRUCTURED_DATA -->', structuredData);
  return html;
}

function getCookie(req, cookieName) {
  const header = req.headers.cookie || '';
  const part = header.split(';').map((item) => item.trim()).find((item) => item.startsWith(`${cookieName}=`));
  return part ? decodeURIComponent(part.slice(cookieName.length + 1)) : '';
}

function currentSession(req) {
  const sid = getCookie(req, 'profile_admin');
  const expiresAt = sessions.get(sid);
  if (!sid || !expiresAt || expiresAt < Date.now()) {
    sessions.delete(sid);
    return null;
  }
  return sid;
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error('payload too large'), { statusCode: 413 }));
        req.destroy();
        return;
      }
      body += chunk;
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function validString(value, maxLength) {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLength;
}

function loginAllowed(ip) {
  const state = loginAttempts.get(ip);
  if (!state || state.resetAt <= Date.now()) return true;
  return state.count < 10;
}

function recordLoginFailure(ip) {
  const current = loginAttempts.get(ip);
  if (!current || current.resetAt <= Date.now()) {
    loginAttempts.set(ip, { count: 1, resetAt: Date.now() + 15 * 60 * 1000 });
  } else {
    current.count += 1;
  }
}

function secretsMatch(candidate, expected) {
  const left = Buffer.from(candidate);
  const right = Buffer.from(expected);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

async function handleApi(req, res, url) {
  if (req.method === 'GET' && url.pathname === '/api/profile') {
    return sendJson(res, 200, readProfile());
  }

  if (req.method === 'GET' && url.pathname === '/api/session') {
    return sendJson(res, 200, { authenticated: Boolean(currentSession(req)) });
  }

  if (req.method === 'POST' && url.pathname === '/api/login') {
    if (!sameOrigin(req)) return sendJson(res, 403, { error: 'विनंतीचा स्रोत तपासता आला नाही.' });
    const expectedPassword = process.env.ADMIN_PASSWORD;
    if (!expectedPassword || expectedPassword.startsWith('replace-with-')) {
      return sendJson(res, 503, { error: 'प्रशासकाचा पासवर्ड सर्व्हरवर सेट केलेला नाही. .env फाइलमधील ADMIN_PASSWORD सेट करा.' });
    }
    const ip = req.socket.remoteAddress || 'unknown';
    if (!loginAllowed(ip)) return sendJson(res, 429, { error: 'अनेक प्रयत्न झाले. १५ मिनिटांनी पुन्हा प्रयत्न करा.' });
    let body;
    try { body = JSON.parse(await readBody(req)); } catch { return sendJson(res, 400, { error: 'लॉगिन माहिती वाचता आली नाही.' }); }
    if (!secretsMatch(String(body.password || ''), expectedPassword)) {
      recordLoginFailure(ip);
      return sendJson(res, 401, { error: 'पासवर्ड जुळत नाही.' });
    }
    loginAttempts.delete(ip);
    const sid = crypto.randomBytes(32).toString('base64url');
    sessions.set(sid, Date.now() + SESSION_TTL_MS);
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    return sendJson(res, 200, { authenticated: true }, {
      'Set-Cookie': `profile_admin=${encodeURIComponent(sid)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${secure}`
    });
  }

  if (req.method === 'POST' && url.pathname === '/api/logout') {
    if (!sameOrigin(req)) return sendJson(res, 403, { error: 'विनंतीचा स्रोत तपासता आला नाही.' });
    sessions.delete(currentSession(req));
    return sendJson(res, 200, { authenticated: false }, {
      'Set-Cookie': 'profile_admin=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'
    });
  }

  if (req.method === 'PUT' && url.pathname === '/api/profile') {
    if (!sameOrigin(req)) return sendJson(res, 403, { error: 'विनंतीचा स्रोत तपासता आला नाही.' });
    if (!currentSession(req)) return sendJson(res, 401, { error: 'बदल करण्यासाठी प्रशासक म्हणून लॉगिन करा.' });
    let body;
    try { body = JSON.parse(await readBody(req)); } catch { return sendJson(res, 400, { error: 'माहितीचे स्वरूप योग्य नाही.' }); }
    const profile = {
      fullNameMr: String(body.fullNameMr || '').trim(),
      fullNameEn: String(body.fullNameEn || '').trim(),
      designationMr: String(body.designationMr || '').trim()
    };
    if (!validString(profile.fullNameMr, 100) || !validString(profile.fullNameEn, 120) || !validString(profile.designationMr, 180)) {
      return sendJson(res, 422, { error: 'नाव आणि पदाचे तपशील भरा. नावासाठी १००/१२० आणि पदासाठी १८० अक्षरांची मर्यादा आहे.' });
    }
    const temporaryFile = `${PROFILE_FILE}.${process.pid}.tmp`;
    try {
      fs.mkdirSync(path.dirname(PROFILE_FILE), { recursive: true });
      fs.writeFileSync(temporaryFile, `${JSON.stringify(profile, null, 2)}\n`, { mode: 0o600 });
      fs.renameSync(temporaryFile, PROFILE_FILE);
    } catch {
      try { fs.rmSync(temporaryFile, { force: true }); } catch {}
      return sendJson(res, 500, { error: 'माहिती जतन करता आली नाही. सर्व्हरवरील data फोल्डर तपासा.' });
    }
    return sendJson(res, 200, profile);
  }

  return sendJson(res, 404, { error: 'विनंती केलेली सेवा सापडली नाही.' });
}

function handleStatic(req, res, url) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    return res.end();
  }

  const routeMap = {
    '/': ['index.html', 'मुख्यपृष्ठ'],
    '/about': ['about.html', 'माझ्याविषयी'],
    '/admin': ['admin.html', 'प्रशासक डॅशबोर्ड']
  };
  const sectionPages = {
    '/political-journey': 'राजकीय प्रवास',
    '/party-work': 'पक्षाचे कार्य',
    '/social-work': 'सामाजिक कार्य',
    '/department': 'समाज कल्याण विभाग',
    '/schemes': 'शासकीय योजना',
    '/activities': 'कार्यक्रम व दौरे',
    '/news': 'बातम्या व माध्यमे',
    '/gallery': 'छायाचित्रे व व्हिडिओ',
    '/reports': 'अहवाल व दस्तऐवज',
    '/contact': 'जनसंपर्क',
    '/privacy-policy': 'गोपनीयता धोरण',
    '/accessibility': 'सुलभता निवेदन'
  };
  const route = routeMap[url.pathname];
  let filePath;
  let body;

  if (route) {
    filePath = path.join(PUBLIC_DIR, route[0]);
    body = renderHtml(filePath, route[1]);
  } else if (sectionPages[url.pathname]) {
    filePath = path.join(PUBLIC_DIR, 'content.html');
    body = renderHtml(filePath, sectionPages[url.pathname], url.pathname.slice(1));
  } else {
    const requestedPath = decodeURIComponent(url.pathname);
    filePath = path.resolve(PUBLIC_DIR, `.${requestedPath}`);
    if (!filePath.startsWith(`${PUBLIC_DIR}${path.sep}`) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('पृष्ठ सापडले नाही.');
    }
    body = fs.readFileSync(filePath);
  }

  const type = mimeTypes[path.extname(filePath)] || 'application/octet-stream';
  res.writeHead(200, {
    'Content-Type': type,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'DENY',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  });
  res.end(req.method === 'HEAD' ? undefined : body);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  try {
    if (url.pathname.startsWith('/api/')) return await handleApi(req, res, url);
    return handleStatic(req, res, url);
  } catch (error) {
    if (res.headersSent || res.destroyed) return;
    return sendJson(res, error.statusCode || 500, { error: 'सर्व्हर विनंती पूर्ण करू शकला नाही.' });
  }
});

server.listen(PORT, () => {
  console.log(`वेबसाइट http://localhost:${PORT} येथे सुरू आहे.`);
});
