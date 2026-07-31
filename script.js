/* =========================================================
   GreenLeaf Café — Script
   Handles: loading screen, sticky nav, scroll progress,
   dark mode, mobile menu, scroll reveal, counters,
   menu filtering, ripple effect, forms, back-to-top.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loading Screen ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 500);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => loader.classList.add('hidden'), 2500);

  /* ---------- Sticky header + scroll progress ---------- */
  const header = document.getElementById('siteHeader');
  const progressBar = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');

  /* ---------- Active nav link highlighting ----------
     Declared before onScroll() so `sections`/`navItems`
     are already initialized when onScroll() runs below. */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    let currentId = sections[0] ? sections[0].id : '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) currentId = sec.id;
    });

    navItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('href') === '#' + currentId);
    });
  }

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';

    header.classList.toggle('scrolled', scrollTop > 60);
    backToTop.classList.toggle('show', scrollTop > 500);

    updateActiveNav();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Back to top ---------- */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Dark mode toggle ---------- */
  const darkToggle = document.getElementById('darkToggle');
  const savedTheme = localStorage.getItem('greenleaf-theme');
  if (savedTheme === 'dark') document.body.classList.add('dark-mode');

  darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem(
      'greenleaf-theme',
      document.body.classList.contains('dark-mode') ? 'dark' : 'light'
    );
  });

  /* ---------- Mobile navigation ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  /* ---------- Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Menu category filtering ---------- */
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuCards = document.querySelectorAll('.menu-card');

  function applyFilter(filter) {
    menuCards.forEach(card => {
      const match = card.dataset.category === filter;
      card.classList.toggle('show', match);
    });
  }

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      menuTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      applyFilter(tab.dataset.filter);
    });
  });

  // Show "coffee" by default
  applyFilter('coffee');

  /* ---------- Button ripple effect ---------- */
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);

      circle.style.width = circle.style.height = diameter + 'px';
      circle.style.left = (e.clientX - rect.left - diameter / 2) + 'px';
      circle.style.top = (e.clientY - rect.top - diameter / 2) + 'px';
      circle.classList.add('ripple-effect');

      const oldRipple = this.querySelector('.ripple-effect');
      if (oldRipple) oldRipple.remove();

      this.appendChild(circle);
      setTimeout(() => circle.remove(), 650);
    });
  });

  /* ---------- Contact form (front-end only demo) ---------- */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formNote.textContent = '✓ Thank you! Your message has been noted. We will reply soon.';
    contactForm.reset();
    setTimeout(() => (formNote.textContent = ''), 5000);
  });

  /* ---------- Newsletter form (front-end only demo) ---------- */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterNote = document.getElementById('newsletterNote');

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    newsletterNote.textContent = '✓ Subscribed! Welcome to the GreenLeaf family.';
    newsletterForm.reset();
    setTimeout(() => (newsletterNote.textContent = ''), 5000);
  });

});
