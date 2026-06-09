/* ============================================================
   CreatedInCode — script.js
   ============================================================ */

/* ─── CURSOR GLOW (desktop only) ─── */
(function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;

  // Hide on touch devices
  if ('ontouchstart' in window) {
    glow.style.display = 'none';
    return;
  }

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
})();


/* ─── NAVBAR: scroll shadow ─── */
(function initNavScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
})();


/* ─── MOBILE MENU TOGGLE ─── */
(function initMobileMenu() {
  const btn        = document.getElementById('mobileMenuBtn');
  const menu       = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  if (!btn || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    btn.textContent = 'Close';
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('open');
    btn.textContent = 'Menu';
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => {
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close when a nav link is tapped
  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
})();


/* ─── SMOOTH SCROLL for all anchor links ─── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();


/* ─── SCROLL REVEAL (IntersectionObserver) ─── */
(function initScrollReveal() {
  const options = { threshold: 0.12 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after first reveal so it stays visible
        observer.unobserve(entry.target);
      }
    });
  }, options);

  document.querySelectorAll('.fade-up, .stagger-children').forEach((el) => {
    observer.observe(el);
  });
})();


/* ─── CONTACT FORM SUBMIT ─── */
(function initContactForm() {
  const btn = document.getElementById('submitBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    // Basic validation
    const name     = document.getElementById('name');
    const email    = document.getElementById('email');
    const service  = document.getElementById('service');

    const fields = [name, email, service];
    let valid = true;

    fields.forEach((field) => {
      if (!field) return;
      if (!field.value.trim()) {
        field.style.borderColor = 'rgba(255,123,26,0.8)';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    if (!valid) {
      shakeBtn(btn);
      return;
    }

    // Success state
    btn.textContent = '✓ Message Sent! We\'ll be in touch shortly.';
    btn.style.background = 'linear-gradient(135deg, #00e5ff, #00b8cc)';
    btn.style.color       = '#060d1f';
    btn.disabled          = true;
  });

  function shakeBtn(el) {
    el.style.animation = 'none';
    // Force reflow
    void el.offsetWidth;
    el.style.animation = 'shake 0.4s ease';
  }

  // Inject shake keyframes once
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%     { transform: translateX(-8px); }
      40%     { transform: translateX(8px); }
      60%     { transform: translateX(-5px); }
      80%     { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
})();


/* ─── ACTIVE NAV LINK on scroll ─── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function setActive() {
    const scrollY = window.scrollY;

    sections.forEach((section) => {
      const top    = section.offsetTop - 120;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach((link) => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + id) {
            link.style.color = 'var(--cyan)';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive(); // run once on load
})();