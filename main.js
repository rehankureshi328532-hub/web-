
    
    /* main.js — Clean, single-file JS for your site
   Features:
   - YouTube-style mega menu (hover on desktop, accessible keyboard)
   - Mobile slide-from-left panel
   - Slider: auto + arrows + touch + pause on hover
   - Product search filter
   - FAQ accordion
   - Contact form demo handler
   - Safe Google Maps init hook (initMap)
*/

/* eslint-disable no-unused-vars */
(() => {
  'use strict';

  /* -------------------------
     Helpers
     ------------------------- */
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));
  const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

  /* -------------------------
     NAV: Mega dropdown (desktop) + keyboard
     ------------------------- */
  const productsLink = $('#productsLink');
  const productsMega = $('#productsMega');

  if (productsLink && productsMega) {
    let openTimer = null;

    const openMega = () => {
      clearTimeout(openTimer);
      productsMega.style.display = 'block';
      productsMega.setAttribute('aria-hidden', 'false');
      productsLink.setAttribute('aria-expanded', 'true');
    };
    const closeMega = () => {
      clearTimeout(openTimer);
      openTimer = setTimeout(() => {
        productsMega.style.display = 'none';
        productsMega.setAttribute('aria-hidden', 'true');
        productsLink.setAttribute('aria-expanded', 'false');
      }, 160);
    };

    // Hover for non-touch devices
    if (!isTouch) {
      productsLink.addEventListener('mouseenter', openMega);
      productsLink.addEventListener('mouseleave', closeMega);
      productsMega.addEventListener('mouseenter', () => clearTimeout(openTimer));
      productsMega.addEventListener('mouseleave', closeMega);
    }

    // Keyboard accessibility (Enter / Space to toggle, Esc to close)
    productsLink.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        const visible = productsMega.style.display === 'block';
        if (visible) closeMega();
        else openMega();
      } else if (ev.key === 'Escape') {
        closeMega();
        productsLink.focus();
      }
    });

    // Close if clicking outside
    document.addEventListener('click', (e) => {
      if (!productsLink.contains(e.target) && !productsMega.contains(e.target)) {
        productsMega.style.display = 'none';
        productsMega.setAttribute('aria-hidden', 'true');
        productsLink.setAttribute('aria-expanded', 'false');
      }
    });
  }
  
  document.querySelectorAll(".toggle-link").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault(); // stop page jump

      const submenu = this.nextElementSibling;

      // close other open menus (optional)
      document.querySelectorAll(".sub").forEach(sub => {
        if (sub !== submenu) sub.style.display = "none";
      });
      document.querySelectorAll(".toggle-link").forEach(l => {
        if (l !== this) l.classList.remove("active");
      });

      // toggle current
      if (submenu.style.display === "block") {
        submenu.style.display = "none";
        this.classList.remove("active");
      } else {
        submenu.style.display = "block";
        this.classList.add("active");
      }
    });
  });



  /* -------------------------
     MOBILE PANEL (slide-from-left)
     Controls: #menuToggle, #mobilePanel, #mobileOverlay, #mobileClose
     ------------------------- */
  const menuToggle = $('#menuToggle');
  const mobilePanel = $('#mobilePanel');
  const mobileOverlay = $('#mobileOverlay');
  const mobileClose = $('#mobileClose');

  const openMobile = () => {
    if (!mobilePanel || !mobileOverlay) return;
    mobilePanel.classList.add('open');
    mobilePanel.setAttribute('aria-hidden', 'false');
    mobileOverlay.style.display = 'block';
    mobileOverlay.classList.remove('hidden');
    document.documentElement.style.overflow = 'hidden';
    // trap focus minimally: focus close button if present
    if (mobileClose) mobileClose.focus();
  };

  const closeMobile = () => {
    if (!mobilePanel || !mobileOverlay) return;
    mobilePanel.classList.remove('open');
    mobilePanel.setAttribute('aria-hidden', 'true');
    mobileOverlay.style.display = 'none';
    mobileOverlay.classList.add('hidden');
    document.documentElement.style.overflow = '';
    if (menuToggle) menuToggle.focus();
  };

  if (menuToggle) menuToggle.addEventListener('click', openMobile);
  if (mobileClose) mobileClose.addEventListener('click', closeMobile);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobile);

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobile();
      // also close mega menu
      if (productsMega) { productsMega.style.display = 'none'; productsMega.setAttribute('aria-hidden','true'); }
    }
  });

  /* -------------------------
     NAV small-screen toggle (optional secondary nav open)
     target: .nav-links.open
     ------------------------- */
  const navToggleButtons = $$('.menu-toggle, #menuToggle'); // safe fallback
  navToggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const navLinks = document.querySelector('.nav-links');
      if (!navLinks) return;
      navLinks.classList.toggle('open');
    });
  });

  /* -------------------------
     SEARCH: filter product cards (live)
     #searchBox : input
     .product-card : elements to filter
     ------------------------- */
 // ===============================
// PRODUCT SEARCH (ONLY motor-card)
// + Hide mobile menu content while searching
// ===============================

document.addEventListener('DOMContentLoaded', () => {

  const searchBox = document.getElementById('searchBox');
  const cards = document.querySelectorAll('.motor-card');
  const productSection = document.getElementById('productsection');

  if (!searchBox || !cards.length || !productSection) return;

  // ----- "Product not available" message -----
  let noResultMsg = document.getElementById('noResults');

  if (!noResultMsg) {
    noResultMsg = document.createElement('p');
    noResultMsg.id = 'noResults';
    noResultMsg.textContent = '❌ Product not available';
    noResultMsg.style.textAlign = 'center';
    noResultMsg.style.marginTop = '20px';
    noResultMsg.style.fontSize = '16px';
    noResultMsg.style.display = 'none';
    productSection.appendChild(noResultMsg);
  }

  // ----- SEARCH LOGIC -----
  searchBox.addEventListener('input', () => {
    const q = searchBox.value.toLowerCase().trim();
    let found = false;

    // 🔥 IMPORTANT: hide mobile panel content during search
    if (q !== '') {
      document.body.classList.add('search-active');
    } else {
      document.body.classList.remove('search-active');
    }

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (text.includes(q)) {
        card.style.display = '';
        found = true;
      } else {
        card.style.display = 'none';
      }
    });

    noResultMsg.style.display = (found || q === '') ? 'none' : 'block';
  });

});


  /* -------------------------
     PRODUCT CARDS: accordion toggle
     - .product-card .card-header toggles its .card-body
     ------------------------- */
  /* Product Cards Accordion
$$('.product-card').forEach(card => {
  const header = card.querySelector('.card-header');
  const body = card.querySelector('.card-body');
  const arrow = card.querySelector('.arrow');
  const link = header.querySelector('a'); // product link

  if (!header || !body) return;

  // click on header (but not the link)
  header.addEventListener('click', (ev) => {
    if (ev.target === link) return; // let link work normally

    const isOpen = body.style.display === 'block';

    // close all siblings
    $$('.product-card .card-body').forEach(cb => cb.style.display = 'none');
    $$('.product-card .arrow').forEach(a => a.classList.remove('rotate'));

    // toggle this one
    if (!isOpen) {
      body.style.display = 'block';
      if (arrow) arrow.classList.add('rotate');
    }
  });

  // click arrow specifically (same as header)
  if (arrow) {
    arrow.addEventListener('click', (ev) => {
      ev.stopPropagation(); // prevent triggering header twice
      const isOpen = body.style.display === 'block';

      $$('.product-card .card-body').forEach(cb => cb.style.display = 'none');
      $$('.product-card .arrow').forEach(a => a.classList.remove('rotate'));

      if (!isOpen) {
        body.style.display = 'block';
        arrow.classList.add('rotate');
      }
    });
  }
});*/

/* =====  LAZY IMAGE + WEBP FALL-BACK  ===== */
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((es, o) => es.forEach(e => {
    if (e.isIntersecting) {
      const img = e.target, src = img.dataset.src, webp = src.replace(/\.(jpg|png)/i, '.webp');
      const t = new Image(); t.src = webp;
      t.onload = () => (img.src = webp);
      t.onerror = () => (img.src = src);
      img.classList.remove('lazy'); o.unobserve(img);
    }
  }), { rootMargin: '60px' });
  document.querySelectorAll('img[data-src]').forEach(i => io.observe(i));
} else {
  document.querySelectorAll('img[data-src]').forEach(i => i.src = i.dataset.src);
}



  /* -------------------------
     FAQ accordion
     - .faq-question toggles sibling .faq-answer
     ------------------------- */
  $$('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item') || q.parentElement;
      if (!item) return;
      item.classList.toggle('open');
      const answer = item.querySelector('.faq-answer');
      if (answer) {
        const isOpen = answer.style.display === 'block';
        // close others if you want single-open behavior:
        $$('.faq-item .faq-answer').forEach(a => { a.style.display = 'none'; });
        if (!isOpen) answer.style.display = 'block';
        else answer.style.display = 'none';
      }
    });
  });

 

  /* -------------------------
     SLIDER (Auto + Arrows + Touch + Pause on hover)
     expects:
       - .slider (container)
       - .slider .slides img  (images)
       - .slider .prev  (prev button)
       - .slider .next  (next button)
       - .slider .slider-caption (caption element) [optional]
     ------------------------- */
  (function sliderModule() {
    const slider = document.querySelector('.slider');
    if (!slider) return;

    const imgs = Array.from(slider.querySelectorAll('.slides img'));
    if (!imgs.length) return;

    const prevBtn = slider.querySelector('.prev') || slider.querySelector('.slider-btn.prev') || slider.querySelector('#prevSlide');
    const nextBtn = slider.querySelector('.next') || slider.querySelector('.slider-btn.next') || slider.querySelector('#nextSlide');
    const captionEl = slider.querySelector('.slider-caption') || slider.querySelector('#sliderCaption');

    let idx = imgs.findIndex(i => i.classList.contains('active'));
    if (idx < 0) idx = 0;

    // normalize: ensure only current active has class
    const setActive = (n) => {
      idx = ((n % imgs.length) + imgs.length) % imgs.length;
      imgs.forEach((img, i) => img.classList.toggle('active', i === idx));
      if (captionEl) captionEl.textContent = imgs[idx].dataset.caption || imgs[idx].getAttribute('alt') || '';
    };

    // show initial
    setActive(idx);

    // handlers
    const goNext = () => setActive(idx + 1);
    const goPrev = () => setActive(idx - 1);

    if (nextBtn) nextBtn.addEventListener('click', goNext);
    if (prevBtn) prevBtn.addEventListener('click', goPrev);

    // Auto play
    let autoTimer = null;
    const startAuto = () => {
      stopAuto();
      autoTimer = setInterval(goNext, 4500);
    };
    const stopAuto = () => { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } };

    // pause on hover/focus
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);
    slider.addEventListener('focusin', stopAuto);
    slider.addEventListener('focusout', startAuto);

    // touch support
    if (isTouch) {
      let startX = 0;
      const threshold = 40;
      const slidesEl = slider.querySelector('.slides') || slider;
      slidesEl.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
      }, { passive: true });
      slidesEl.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const dx = endX - startX;
        if (dx > threshold) goPrev();
        else if (dx < -threshold) goNext();
      });
    }

    // keyboard left/right
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    });

    // start autoplay
    startAuto();
  })();

  /* -------------------------
     MAP INIT (exposed as window.initMap for Google script callback)
     - safe guard if google isn't present yet
     ------------------------- */

     
  window.initMap = function initMap() {
    const mapEl = document.getElementById('map');
    if (!mapEl) return;
    if (typeof google === 'undefined' || !google.maps) {
      mapEl.innerHTML = '<p style="padding:18px;color:#666">Map unavailable (Google Maps script not loaded).</p>';
      return;
    }
    const yakinOffice = { lat: 21.7645, lng: 72.1519 };
    const map = new google.maps.Map(mapEl, { center: yakinOffice, zoom: 13 });
    new google.maps.Marker({ position: yakinOffice, map });
  };

  /* -------------------------
     Small accessibility / tidyups
     ------------------------- */
  // ensure required aria attributes exist
  if (productsMega && !productsMega.hasAttribute('aria-hidden')) productsMega.setAttribute('aria-hidden', 'true');
  if (productsLink && !productsLink.hasAttribute('aria-expanded')) productsLink.setAttribute('aria-expanded', 'false');

  // prevent multiple fast clicks on mobile panel buttons (simple guard)
  if (menuToggle) menuToggle.addEventListener('click', () => menuToggle.setAttribute('aria-pressed','true'), { once: false });

  /* End main IIFE */
})();

 
 
  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTop.style.display = "block";
    } else {
      backToTop.style.display = "none";
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  const backToTopBtn = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backToTopBtn.style.display = "block";
    } else {
      backToTopBtn.style.display = "none";
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });






