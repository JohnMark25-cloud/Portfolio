/* ============================================================
   JOHN MARK C. DE LOS SANTOS — PORTFOLIO
   Interactivity: typing effect, scroll reveal, nav, form
   ============================================================ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     Footer year
     ---------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------
     Hero role typing effect
     ---------------------------------------------------------- */
  const roles = [
    'Computer Science Graduate',
    'Web Developer',
    'Aspiring Cloud Solutions Engineer'
  ];

  const typedEl = document.getElementById('typed-role');

  function typeLoop() {
    if (!typedEl) return;

    if (prefersReducedMotion) {
      typedEl.textContent = roles.join(' · ');
      return;
    }

    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const current = roles[roleIndex];

      if (!deleting) {
        charIndex++;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1600);
          return;
        }
        setTimeout(tick, 55);
      } else {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(tick, 300);
          return;
        }
        setTimeout(tick, 30);
      }
    }

    tick();
  }

  typeLoop();

  /* ----------------------------------------------------------
     Scroll reveal via IntersectionObserver
     ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ----------------------------------------------------------
     Mobile nav toggle
     ---------------------------------------------------------- */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ----------------------------------------------------------
     Active nav link highlighting on scroll
     ---------------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navAnchors.forEach((a) => {
              a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--accent-bright)' : '';
            });
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );

    sections.forEach((s) => navObserver.observe(s));
  }

  /* ----------------------------------------------------------
     Contact form validation (client-side, no backend wired up)
     ---------------------------------------------------------- */
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');

  if (form) {
    const fields = {
      name: { el: document.getElementById('name'), err: document.getElementById('err-name') },
      email: { el: document.getElementById('email'), err: document.getElementById('err-email') },
      message: { el: document.getElementById('message'), err: document.getElementById('err-message') }
    };

    function validateField(key) {
      const { el, err } = fields[key];
      const value = el.value.trim();
      let message = '';

      if (!value) {
        message = 'This field is required.';
      } else if (key === 'email') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) message = 'Enter a valid email address.';
      } else if (key === 'message' && value.length < 10) {
        message = 'Message should be at least 10 characters.';
      }

      err.textContent = message;
      el.classList.toggle('has-error', Boolean(message));
      el.setAttribute('aria-invalid', message ? 'true' : 'false');
      return !message;
    }

    Object.keys(fields).forEach((key) => {
      fields[key].el.addEventListener('blur', () => validateField(key));
      fields[key].el.addEventListener('input', () => {
        if (fields[key].err.textContent) validateField(key);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const results = Object.keys(fields).map((key) => validateField(key));
      const allValid = results.every(Boolean);

      if (!allValid) {
        statusEl.style.color = '#f87171';
        statusEl.textContent = 'Please fix the highlighted fields.';
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const btnText = submitBtn.querySelector('.btn-text');
      const originalText = btnText.textContent;

      submitBtn.disabled = true;
      btnText.textContent = 'Sending…';

      // No backend is wired up yet — this simulates a send so the
      // form is fully usable once connected to a real endpoint
      // (e.g. Formspree, EmailJS, or a custom API route).
      setTimeout(() => {
        statusEl.style.color = 'var(--success)';
        statusEl.textContent = "Thanks for reaching out! I'll get back to you soon.";
        form.reset();
        submitBtn.disabled = false;
        btnText.textContent = originalText;
      }, 900);
    });
  }

  /* ----------------------------------------------------------
     Nav background intensifies after scrolling past hero
     ---------------------------------------------------------- */
  const navEl = document.getElementById('nav');
  if (navEl) {
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
      lastScrollY = window.scrollY;
      navEl.style.boxShadow = lastScrollY > 40 ? '0 10px 30px -20px rgba(0,0,0,0.6)' : 'none';
    }, { passive: true });
  }
})();
