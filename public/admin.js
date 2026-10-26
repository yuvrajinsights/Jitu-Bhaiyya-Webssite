const loginPanel = document.getElementById('login-panel');
const editorPanel = document.getElementById('editor-panel');
const loginForm = document.getElementById('login-form');
const profileForm = document.getElementById('profile-form');
const loginMessage = document.getElementById('login-message');
const saveMessage = document.getElementById('save-message');

function showMessage(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle('is-error', isError);
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'विनंती पूर्ण करता आली नाही.');
  return data;
}

function setEditorVisible(isAuthenticated) {
  loginPanel.classList.toggle('is-hidden', isAuthenticated);
  editorPanel.classList.toggle('is-hidden', !isAuthenticated);
}

function populateForm(profile) {
  profileForm.elements.fullNameMr.value = profile.fullNameMr || '';
  profileForm.elements.fullNameEn.value = profile.fullNameEn || '';
  profileForm.elements.designationMr.value = profile.designationMr || '';
  document.getElementById('admin-profile-name').textContent = profile.fullNameMr || '';
}

async function checkSession() {
  try {
    const publicProfile = await requestJson('/api/profile');
    document.getElementById('admin-profile-name').textContent = publicProfile.fullNameMr || '';
    const session = await requestJson('/api/session');
    if (!session.authenticated) return;
    const profile = await requestJson('/api/profile');
    populateForm(profile);
    setEditorVisible(true);
  } catch {
    setEditorVisible(false);
  }
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  showMessage(loginMessage, 'लॉगिन तपासत आहोत…');
  const password = loginForm.elements.password.value;
  try {
    await requestJson('/api/login', { method: 'POST', body: JSON.stringify({ password }) });
    loginForm.reset();
    const profile = await requestJson('/api/profile');
    populateForm(profile);
    setEditorVisible(true);
    showMessage(saveMessage, 'लॉगिन यशस्वी. बदल जतन करण्यापूर्वी तपासा.');
  } catch (error) {
    showMessage(loginMessage, error.message, true);
  }
});

profileForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  showMessage(saveMessage, 'बदल जतन करत आहोत…');
  const profile = {
    fullNameMr: profileForm.elements.fullNameMr.value,
    fullNameEn: profileForm.elements.fullNameEn.value,
    designationMr: profileForm.elements.designationMr.value
  };
  try {
    const savedProfile = await requestJson('/api/profile', { method: 'PUT', body: JSON.stringify(profile) });
    populateForm(savedProfile);
    showMessage(saveMessage, 'बदल जतन झाले. सार्वजनिक पृष्ठ पुन्हा उघडल्यावर अद्ययावत नाव दिसेल.');
  } catch (error) {
    showMessage(saveMessage, error.message, true);
  }
});

document.getElementById('logout-button').addEventListener('click', async () => {
  try { await requestJson('/api/logout', { method: 'POST', body: '{}' }); } catch {}
  setEditorVisible(false);
  showMessage(loginMessage, 'तुम्ही लॉगआउट झाला आहात.');
});

checkSession();
