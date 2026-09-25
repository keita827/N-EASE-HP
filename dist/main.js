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
  const caseTriggers = document.querySelectorAll('[data-case-open]');
  const caseDialogs = document.querySelectorAll('[data-case-dialog]');
  const serviceTriggers = document.querySelectorAll('[data-service-open]');
  const serviceDialogs = document.querySelectorAll('[data-service-dialog]');
  let lastCaseTrigger = null;
  let lastServiceTrigger = null;

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

  const getFocusableItems = (container) => [...container.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )].filter((item) => !item.hidden && item.getClientRects().length);

  const closeCaseDialog = (caseDialog, { restoreFocus = true, afterClose } = {}) => {
    if (!caseDialog?.open || caseDialog.classList.contains('is-closing')) return;
    caseDialog.classList.remove('is-open');
    caseDialog.classList.add('is-closing');

    window.setTimeout(() => {
      caseDialog.close();
      caseDialog.classList.remove('is-closing');
      document.body.classList.remove('case-dialog-open');
      if (restoreFocus) lastCaseTrigger?.focus();
      afterClose?.();
    }, reduceMotion ? 0 : 210);
  };

  caseTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const caseDialog = document.querySelector(`[data-case-dialog="${trigger.dataset.caseOpen}"]`);
      if (!caseDialog) return;
      lastCaseTrigger = trigger;
      document.body.classList.add('case-dialog-open');
      caseDialog.showModal();
      requestAnimationFrame(() => {
        caseDialog.classList.add('is-open');
        caseDialog.querySelector('[data-case-close]')?.focus();
      });
    });
  });

  caseDialogs.forEach((caseDialog) => {
    caseDialog.querySelector('[data-case-close]')?.addEventListener('click', () => closeCaseDialog(caseDialog));

    caseDialog.addEventListener('click', (event) => {
      if (event.target === caseDialog) closeCaseDialog(caseDialog);
    });

    caseDialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      closeCaseDialog(caseDialog);
    });

    caseDialog.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      const focusableItems = getFocusableItems(caseDialog);
      if (!focusableItems.length) return;
      const firstItem = focusableItems[0];
      const lastItem = focusableItems[focusableItems.length - 1];
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    });

    caseDialog.querySelector('[data-case-contact]')?.addEventListener('click', () => {
      closeCaseDialog(caseDialog, {
        restoreFocus: false,
        afterClose: () => document.querySelector('#contact')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
      });
    });
  });

  const closeServiceDialog = (serviceDialog, { restoreFocus = true, afterClose } = {}) => {
    if (!serviceDialog?.open || serviceDialog.classList.contains('is-closing')) return;
    serviceDialog.classList.remove('is-open');
    serviceDialog.classList.add('is-closing');

    window.setTimeout(() => {
      serviceDialog.close();
      serviceDialog.classList.remove('is-closing');
      document.body.classList.remove('case-dialog-open');
      if (restoreFocus) lastServiceTrigger?.focus();
      afterClose?.();
    }, reduceMotion ? 0 : 210);
  };

  serviceTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const serviceDialog = document.querySelector(`[data-service-dialog="${trigger.dataset.serviceOpen}"]`);
      if (!serviceDialog) return;
      lastServiceTrigger = trigger;
      document.body.classList.add('case-dialog-open');
      serviceDialog.showModal();
      requestAnimationFrame(() => {
        serviceDialog.classList.add('is-open');
        serviceDialog.querySelector('[data-service-close]')?.focus();
      });
    });
  });

  serviceDialogs.forEach((serviceDialog) => {
    serviceDialog.querySelector('[data-service-close]')?.addEventListener('click', () => closeServiceDialog(serviceDialog));

    serviceDialog.addEventListener('click', (event) => {
      if (event.target === serviceDialog) closeServiceDialog(serviceDialog);
    });

    serviceDialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      closeServiceDialog(serviceDialog);
    });

    serviceDialog.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      const focusableItems = getFocusableItems(serviceDialog);
      if (!focusableItems.length) return;
      const firstItem = focusableItems[0];
      const lastItem = focusableItems[focusableItems.length - 1];
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    });

    serviceDialog.querySelector('[data-service-contact]')?.addEventListener('click', () => {
      closeServiceDialog(serviceDialog, {
        restoreFocus: false,
        afterClose: () => document.querySelector('#contact')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
      });
    });
  });

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    form.querySelectorAll('[aria-invalid="true"]').forEach((field) => field.removeAttribute('aria-invalid'));
    if (!form.checkValidity()) {
      form.querySelectorAll(':invalid').forEach((field) => field.setAttribute('aria-invalid', 'true'));
      status.textContent = '未入力または入力内容に誤りがある項目をご確認ください。';
      form.querySelector(':invalid')?.focus();
      return;
    }

    if (window.location.hostname.endsWith('.chatgpt.site')) {
      status.textContent = '現在の公開環境ではフォーム送信を利用できません。office@n-ease.comまでご連絡ください。';
      return;
    }

    const submitButton = form.querySelector('[type="submit"]');
    submitButton.disabled = true;
    submitButton.setAttribute('aria-busy', 'true');
    status.textContent = '送信しています…';

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      });
      if (!response.ok) throw new Error('Form submission failed');
      form.reset();
      status.textContent = 'お問い合わせを受け付けました。内容を確認のうえ、ご連絡いたします。';
    } catch (_) {
      status.textContent = '送信できませんでした。時間をおいて再度お試しいただくか、office@n-ease.comまでご連絡ください。';
    } finally {
      submitButton.disabled = false;
      submitButton.removeAttribute('aria-busy');
    }
  });

  privacyOpen?.addEventListener('click', () => dialog?.showModal());
  privacyClose?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
})();
