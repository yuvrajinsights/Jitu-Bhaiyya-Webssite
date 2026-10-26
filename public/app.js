function siteUrl(path) {
  const basePath = window.SITE_BASE_PATH || '/';
  return `${basePath.replace(/\/?$/, '/')}${String(path).replace(/^\/+/, '')}`;
}

window.siteUrl = siteUrl;

const menuButton = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');

if (menuButton && primaryNav) {
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    primaryNav.classList.toggle('is-open', !expanded);
  });
  primaryNav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      menuButton.setAttribute('aria-expanded', 'false');
      primaryNav.classList.remove('is-open');
    }
  });
}

function initializeCarousel(carousel) {
  const slides = [...carousel.querySelectorAll('[data-slide]')];
  const dots = [...carousel.querySelectorAll('[data-carousel-to]')];
  const status = carousel.querySelector('[data-carousel-status]');
  if (slides.length < 2) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
  let timer;
  let hovered = false;
  let focused = false;

  function showSlide(nextIndex, announce = false) {
    activeIndex = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      const active = index === activeIndex;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      slide.toggleAttribute('inert', !active);
    });
    dots.forEach((dot, index) => {
      const active = index === activeIndex;
      dot.classList.toggle('is-active', active);
      if (active) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    if (status && announce) {
      status.textContent = `एकूण ${slides.length} पैकी चित्र ${activeIndex + 1}`;
      status.setAttribute('aria-live', 'polite');
    } else if (status) {
      status.setAttribute('aria-live', 'off');
    }
  }

  function stopTimer() {
    window.clearInterval(timer);
    timer = undefined;
  }

  function startTimer() {
    stopTimer();
    if (hovered || focused || reducedMotion.matches || document.hidden) return;
    timer = window.setInterval(() => showSlide(activeIndex + 1), 5000);
  }

  carousel.querySelector('[data-carousel-prev]')?.addEventListener('click', () => {
    showSlide(activeIndex - 1, true);
    startTimer();
  });
  carousel.querySelector('[data-carousel-next]')?.addEventListener('click', () => {
    showSlide(activeIndex + 1, true);
    startTimer();
  });
  dots.forEach((dot) => dot.addEventListener('click', () => {
    showSlide(Number(dot.dataset.carouselTo), true);
    startTimer();
  }));

  carousel.addEventListener('pointerenter', () => { hovered = true; stopTimer(); });
  carousel.addEventListener('pointerleave', () => { hovered = false; startTimer(); });
  carousel.addEventListener('focusin', () => { focused = true; stopTimer(); });
  carousel.addEventListener('focusout', (event) => {
    if (!carousel.contains(event.relatedTarget)) {
      focused = false;
      startTimer();
    }
  });
  document.addEventListener('visibilitychange', startTimer);
  reducedMotion.addEventListener?.('change', startTimer);

  slides.forEach((slide) => {
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
  });
  showSlide(activeIndex);
  startTimer();
}

document.querySelectorAll('[data-carousel]').forEach(initializeCarousel);

async function loadProfile() {
  try {
    let profile = window.PUBLIC_PROFILE;
    if (!profile) {
      const response = await fetch(siteUrl('/api/profile'), { headers: { Accept: 'application/json' } });
      if (!response.ok) return;
      profile = await response.json();
    }
    document.querySelectorAll('[data-bind]').forEach((element) => {
      const field = element.dataset.bind;
      if (typeof profile[field] === 'string') element.textContent = profile[field];
    });
    document.querySelectorAll('[data-template]').forEach((element) => {
      element.textContent = element.dataset.template.replaceAll('{{nameMr}}', profile.fullNameMr);
    });
    const pageTitle = document.body.dataset.page === 'about'
      ? 'माझ्याविषयी'
      : document.body.dataset.page === 'content'
        ? document.body.dataset.pageTitle
        : 'मुख्यपृष्ठ';
    document.title = `${profile.fullNameMr} | ${pageTitle}`;
    const description = `${profile.fullNameMr} — ${profile.designationMr}. वैयक्तिक प्रोफाइल, सार्वजनिक कार्य आणि पडताळलेली माहिती.`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    const structuredData = document.querySelector('script[type="application/ld+json"]');
    if (structuredData) {
      structuredData.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: profile.fullNameMr,
        alternateName: profile.fullNameEn,
        jobTitle: profile.designationMr
      }).replace(/</g, '\\u003c');
    }
  } catch {
    // The HTML defaults remain readable if the local profile service is unavailable.
  }
}

const year = document.getElementById('current-year');
if (year) year.textContent = new Intl.DateTimeFormat('mr-IN', { year: 'numeric' }).format(new Date());

loadProfile();
