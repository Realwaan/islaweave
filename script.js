/* =============================================
   IslaWeave — Interactivity
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Scroll Reveal (Intersection Observer) --- */
  const revealElements = document.querySelectorAll('.reveal');
  if (prefersReducedMotion) {
    revealElements.forEach((el) => el.classList.add('visible'));
  } else if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el, idx) => {
      el.style.setProperty('--reveal-delay', `${Math.min(idx * 40, 320)}ms`);
      revealObserver.observe(el);
    });
  }


  /* --- Navbar Scroll Effect --- */
  const nav = document.getElementById('site-nav');

  const handleScroll = () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // initial check


  /* --- Mobile Navigation Toggle --- */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');
  let lastFocusedElement = null;

  const closeMobileNav = () => {
    if (!navToggle || !navLinks) return;
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  };

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('nav-open', isOpen);
      if (isOpen) {
        lastFocusedElement = document.activeElement;
      }
    });
  }

  // Close mobile nav when clicking a link
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMobileNav();
    }
  });

  document.addEventListener('click', (event) => {
    if (!navLinks || !navToggle) return;
    const navIsOpen = navLinks.classList.contains('open');
    if (!navIsOpen) return;
    const clickedInsideNav = navLinks.contains(event.target) || navToggle.contains(event.target);
    if (!clickedInsideNav) {
      closeMobileNav();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileNav();
    }
  });


  /* --- Smooth Scroll for Anchor Links --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = nav.offsetHeight + 16;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* --- Lightweight Page Fade-In --- */
  if (!prefersReducedMotion) {
    document.body.classList.add('page-ready');
  }


  /* --- Product Card Click Enhancement --- */
  document.querySelectorAll('.product-card[onclick*="shop.html"]').forEach(card => {
    card.style.cursor = 'pointer';
    
    // Add ripple effect on click
    card.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(192, 133, 82, 0.3);
        width: 20px;
        height: 20px;
        animation: cardRipple 0.8s ease-out;
        pointer-events: none;
        z-index: 10;
      `;
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      card.style.position = 'relative';
      card.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 800);
    });
  });

});
