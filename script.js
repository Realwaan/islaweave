/* =============================================
   IslaWeave — Interactivity
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Scroll Reveal (Intersection Observer) --- */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger the animation by adding a delay based on sibling position
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        let siblingIndex = 0;
        siblings.forEach((sib, i) => {
          if (sib === entry.target) siblingIndex = i;
        });

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, siblingIndex * 100);

        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


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

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);

    // Animate hamburger to X
    const spans = navToggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close mobile nav when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
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


  /* --- Smooth Page Transitions --- */
  // Add fade-out effect before navigating to new page
  const links = document.querySelectorAll('a[href*=".html"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Skip if external link or current page
      if (!href || href.startsWith('http') || href === '#') return;
      
      // Skip if opening in new tab
      if (e.ctrlKey || e.shiftKey || e.metaKey || e.button === 1) return;

      e.preventDefault();
      
      // Add fade-out effect
      document.body.style.transition = 'opacity 0.3s ease';
      document.body.style.opacity = '0';
      
      // Navigate after animation
      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
  });

  // Fade in on page load
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 50);


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

  // Add card ripple animation
  if (!document.getElementById('card-ripple-animation')) {
    const style = document.createElement('style');
    style.id = 'card-ripple-animation';
    style.textContent = `
      @keyframes cardRipple {
        from {
          transform: scale(0);
          opacity: 1;
        }
        to {
          transform: scale(30);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

});
