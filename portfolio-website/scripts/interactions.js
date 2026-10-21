(() => {
  const progress = document.getElementById('scroll-progress-bar');
  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-navigation');
  const closeMenu = () => {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    nav.classList.remove('is-open');
  };
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
      nav.classList.toggle('is-open', !isOpen);
    });
    nav.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
    document.addEventListener('click', event => {
      if (!nav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
  }

  const updateProgress = () => {
    if (!progress) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    progress.style.width = Math.min(100, Math.max(0, percent)) + '%';
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  const revealTargets = document.querySelectorAll('.about-grid, .project-card, .skill-item, .contact-section .section-kicker, .contact-section h2, .contact-section > p');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealTargets.forEach(el => el.setAttribute('data-reveal', ''));
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(el => revealObserver.observe(el));
  }

  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-25% 0px -60% 0px' });
    sections.forEach(section => navObserver.observe(section));
  }

  const shareButton = document.getElementById('share-portfolio');
  const shareStatus = document.getElementById('share-status');
  if (shareButton && shareStatus) {
    shareButton.addEventListener('click', async () => {
      const shareData = { title: document.title, text: 'Check out my developer portfolio.', url: window.location.href };
      shareStatus.textContent = '';
      try {
        if (navigator.share) {
          await navigator.share(shareData);
          shareStatus.textContent = 'Thanks for sharing!';
        } else if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(shareData.url);
          shareStatus.textContent = 'Portfolio link copied to clipboard.';
        } else {
          shareStatus.textContent = 'Copy this link from your browser address bar to share it.';
        }
      } catch (error) {
        if (error && error.name !== 'AbortError') {
          shareStatus.textContent = 'Sharing was not available. You can copy the link from the address bar.';
        }
      }
    });
  }
})();