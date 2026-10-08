(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-one-showcase]').forEach((showcase) => {
    const slides = [...showcase.querySelectorAll('[data-one-slide]')];
    const tabs = [...showcase.querySelectorAll('[data-one-tab]')];
    const current = showcase.querySelector('[data-one-current]');
    const title = showcase.querySelector('[data-one-title]');
    const copy = showcase.querySelector('[data-one-copy]');
    const progress = showcase.querySelector('[data-one-progress]');
    const autoplay = showcase.dataset.autoplay === 'true' && !reduceMotion;
    let index = 0;
    let timer = null;
    let paused = false;

    const resetProgress = () => {
      if (!progress) return;
      showcase.classList.remove('is-playing');
      void progress.offsetWidth;
      if (autoplay && !paused) showcase.classList.add('is-playing');
    };

    const schedule = () => {
      window.clearTimeout(timer);
      if (!autoplay || paused) return;
      timer = window.setTimeout(() => show(index + 1), 4800);
      resetProgress();
    };

    const show = (next, focusTab = false) => {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === index;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
      });
      tabs.forEach((tab, tabIndex) => {
        const active = tabIndex === index;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      const activeSlide = slides[index];
      if (current) current.textContent = String(index + 1).padStart(2, '0');
      if (title) title.textContent = activeSlide.dataset.title || '';
      if (copy) copy.textContent = activeSlide.dataset.copy || '';
      if (focusTab) tabs[index]?.focus();
      schedule();
    };

    tabs.forEach((tab, tabIndex) => {
      tab.addEventListener('click', () => show(tabIndex));
      tab.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') { event.preventDefault(); show(index + 1, true); }
        if (event.key === 'ArrowLeft') { event.preventDefault(); show(index - 1, true); }
      });
    });
    showcase.querySelector('[data-one-prev]')?.addEventListener('click', () => show(index - 1));
    showcase.querySelector('[data-one-next]')?.addEventListener('click', () => show(index + 1));
    showcase.addEventListener('mouseenter', () => { paused = true; window.clearTimeout(timer); showcase.classList.remove('is-playing'); });
    showcase.addEventListener('mouseleave', () => { paused = false; schedule(); });
    showcase.addEventListener('focusin', () => { paused = true; window.clearTimeout(timer); showcase.classList.remove('is-playing'); });
    showcase.addEventListener('focusout', (event) => {
      if (showcase.contains(event.relatedTarget)) return;
      paused = false;
      schedule();
    });
    document.addEventListener('visibilitychange', () => {
      paused = document.hidden;
      schedule();
    });
    show(0);
  });
})();
