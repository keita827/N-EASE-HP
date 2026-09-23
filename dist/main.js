(() => {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-nav]');
  const form = document.querySelector('[data-contact-form]');
  const status = document.querySelector('[data-form-status]');
  const dialog = document.querySelector('[data-privacy-dialog]');
  const privacyOpen = document.querySelector('[data-privacy-open]');
  const privacyClose = document.querySelector('[data-privacy-close]');
  const intro = document.querySelector('[data-brand-intro]');

  if (document.documentElement.classList.contains('intro-pending') && intro) {
    requestAnimationFrame(() => {
      document.documentElement.classList.replace('intro-pending', 'intro-running');
    });
    window.setTimeout(() => {
      document.documentElement.classList.remove('intro-pending', 'intro-running');
      intro.remove();
      if (window.__neaseIntroFailSafe) window.clearTimeout(window.__neaseIntroFailSafe);
    }, 5400);
  } else {
    intro?.remove();
    document.documentElement.classList.remove('intro-pending', 'intro-running');
    if (window.__neaseIntroFailSafe) window.clearTimeout(window.__neaseIntroFailSafe);
  }

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const closeMenu = () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'メニューを開く');
    nav?.classList.remove('open');
    document.body.classList.remove('menu-open');
  };

  menuButton?.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'メニューを開く' : 'メニューを閉じる');
    nav?.classList.toggle('open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
  });

  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    revealItems.forEach((item) => observer.observe(item));
  }

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    form.querySelectorAll('[aria-invalid="true"]').forEach((field) => field.removeAttribute('aria-invalid'));
    if (!form.checkValidity()) {
      form.querySelectorAll(':invalid').forEach((field) => field.setAttribute('aria-invalid', 'true'));
      status.textContent = '未入力または入力内容に誤りがある項目をご確認ください。';
      form.querySelector(':invalid')?.focus();
      return;
    }
    status.textContent = 'フォームの入力を確認しました。送信機能は公開前に接続予定です。';
  });

  privacyOpen?.addEventListener('click', () => dialog?.showModal());
  privacyClose?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
})();
