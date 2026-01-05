// product.js — modal form, lazy loading, prefill, small UX helpers
(() => {
  'use strict';

  // Lazy load images
  const lazyInit = () => {
    const imgs = document.querySelectorAll('img.lazy');
    if (!imgs.length) return;
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const img = e.target;
        if (img.dataset.src) img.src = img.dataset.src;
        img.classList.remove('lazy');
        img.classList.add('loaded');
        obs.unobserve(img);
      });
    }, { rootMargin: '120px 0px' });
    imgs.forEach(i => io.observe(i));
  };

  // Prefill product input, show form area
  const openQuoteBtn = document.getElementById('openQuote');
  const quickQuoteForm = document.getElementById('quickQuote');
  const quoteCancel = document.getElementById('quoteCancel');
  const quoteProduct = document.getElementById('quoteProduct');
  const quoteFeedback = document.getElementById('quoteFeedback');

  if (openQuoteBtn && quickQuoteForm) {
    openQuoteBtn.addEventListener('click', () => {
      quoteProduct.value = '5 HP Kirloskar Motor';
      quickQuoteForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      quoteProduct.focus();
    });
    quoteCancel.addEventListener('click', () => {
      quoteFeedback.textContent = 'Request cancelled.';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Floating quick-quote button
  const quickBtn = document.getElementById('quickQuoteBtn');
  let quickShown = false;
  const showQuick = () => {
    if (!quickShown) { quickBtn.classList.add('show'); quickBtn.style.transform = 'scale(1)'; quickShown = true; }
  };
  if (quickBtn) {
    quickBtn.addEventListener('click', () => {
      document.getElementById('quoteProduct').value = '5 HP Kirloskar Motor';
      quickQuoteForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    setTimeout(showQuick, 4000);
    window.addEventListener('scroll', showQuick, { once:true });
  }

  // Thumbnails click -> swap main image
  document.querySelectorAll('.thumb').forEach(t => {
    t.addEventListener('click', (e) => {
      const main = document.querySelector('.main-img');
      if (!main) return;
      if (t.datasetSrc) main.src = t.datasetSrc;
      else main.src = t.src;
    });
  });

  // Form submit handling
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const formData = new FormData(quoteForm);
      quoteFeedback.textContent = 'Sending…';
      // Replace the endpoint (Formspree) with your endpoint
      const endpoint = quoteForm.action || '';
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          quoteFeedback.textContent = 'Thanks — enquiry sent. We will call you shortly.';
          quoteForm.reset();
          // optional: open WhatsApp with template
          setTimeout(() => {
            const phone = '917878311313';
            const msg = encodeURIComponent('Hi, I requested a quote for 5 HP Kirloskar Motor. Please call me.');
            window.open(`https://wa.me/${phone}?text=${msg}`, '_blank', 'noopener');
          }, 800);
        } else {
          const json = await res.json().catch(()=>null);
          quoteFeedback.textContent = json?.error || 'Unable to send. Please call us or WhatsApp.';
        }
      } catch (err) {
        quoteFeedback.textContent = 'Network error — please try again or call.';
      }
    });
  }

  // Small accessibility: ensure Enter toggles CTA where appropriate
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement.matches('.related-card a')) {
      document.activeElement.click();
    }
  });

  // init
  lazyInit();

})();
// Image Change
function changeImage(el) {
    document.getElementById("mainProductImage").src = el.src;

    document.querySelectorAll(".thumb").forEach(t => t.classList.remove("active"));
    el.classList.add("active");
}

// POPUP
function openPopup() {
    document.getElementById("popupForm").style.display = "flex";
}

function closePopup() {
    document.getElementById("popupForm").style.display = "none";
}

document.getElementById("quoteForm").addEventListener("submit", function (e) {
  e.preventDefault(); // page reload stop

  const form = e.target;
  const formData = new FormData(form);

  fetch(form.action, {
    method: "POST",
    body: formData
  })
  .then(() => {
    alert("✅ Request sent successfully! Our team will contact you soon.");
    form.reset();
  })
  .catch(() => {
    alert("❌ Something went wrong. Please try again.");
  });
});

document.getElementById("quoteCancel").addEventListener("click", function () {
  document.getElementById("quoteForm").reset();
});


