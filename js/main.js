/* ========================================
   VE-Moment 薇拾光 — Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Navbar scroll effect ---
  const navbar = document.getElementById('navbar');

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // --- Mobile menu toggle ---
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when clicking a non-dropdown link
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (!link.classList.contains('nav-link-dropdown')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  });

  // --- Nav dropdown (mobile toggle) ---
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.nav-link-dropdown');
    if (!toggle) return;
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdown.classList.toggle('active');
      }
    });
  });

  // --- Active nav link on scroll ---
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -60% 0px',
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // --- FAQ accordion ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Open clicked (if it wasn't already open)
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // --- Knowledge Carousel ---
  const carousel = document.getElementById('knowledgeCarousel');
  const dotsContainer = document.getElementById('carouselDots');

  if (carousel && dotsContainer) {
    const cards = carousel.querySelectorAll('.knowledge-card');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    let currentIndex = 0;
    let visibleCards = 3;

    const updateVisibleCards = () => {
      if (window.innerWidth <= 768) visibleCards = 1;
      else if (window.innerWidth <= 1024) visibleCards = 2;
      else visibleCards = 3;
    };

    const totalSlides = () => Math.max(1, cards.length - visibleCards + 1);

    const buildDots = () => {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalSlides(); i++) {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `第 ${i + 1} 頁`);
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    };

    const updateCarousel = () => {
      if (window.innerWidth <= 768) return; // mobile uses scroll
      const card = cards[0];
      const gap = 24;
      const cardWidth = card.offsetWidth + gap;
      carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

      dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    };

    const goTo = (index) => {
      currentIndex = Math.max(0, Math.min(index, totalSlides() - 1));
      updateCarousel();
    };

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    updateVisibleCards();
    buildDots();
    updateCarousel();

    window.addEventListener('resize', () => {
      updateVisibleCards();
      buildDots();
      currentIndex = Math.min(currentIndex, totalSlides() - 1);
      updateCarousel();
    });
  }

  // --- Scroll fade-in animations ---
  const fadeElements = document.querySelectorAll(
    '.story-grid, .story-block, .story-closing, .treatment-card, .process-step, .info-card, .booking-map, .knowledge-card, .knowledge-layout'
  );

  fadeElements.forEach(el => el.classList.add('fade-in'));

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1,
  });

  fadeElements.forEach(el => fadeObserver.observe(el));

  // --- Smooth scroll for anchor links (fallback) ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId.includes('LINE_OA')) return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
