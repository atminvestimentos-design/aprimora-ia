/* =========================================
   APRIMORA IA — Main JS
   ========================================= */

(function () {
  'use strict';

  // --- Sticky header ---
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // --- Mobile menu toggle ---
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // --- IntersectionObserver fade-in ---
  const fadeEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  // --- Active nav link on scroll ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const activateNavLink = () => {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${section.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', activateNavLink, { passive: true });

  // --- Counter animation for hero stats ---
  function animateCounter(el, target, duration = 1800) {
    let start = 0;
    const increment = target / (duration / 16);
    const isDecimal = String(target).includes('.');
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = isDecimal
        ? start.toFixed(1)
        : Math.floor(start).toLocaleString('pt-BR');
    }, 16);
  }

  const statsSection = document.getElementById('hero');
  let statsAnimated = false;
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !statsAnimated) {
        statsAnimated = true;
        document.querySelectorAll('[data-counter]').forEach(el => {
          const value = parseFloat(el.getAttribute('data-counter'));
          animateCounter(el, value);
        });
      }
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  }

})();
