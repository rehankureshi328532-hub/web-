/* =========================================================
   YAKIN TRADERS — MAIN JS (STRUCTURED & CLEAN)
   Works with your provided HTML
   ========================================================= */

(() => {
  "use strict";

  /* =========================
     HELPERS
     ========================= */
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  /* =========================
     MEGA MENU (DESKTOP)
     ========================= */
  const productsLink = $("#productsLink");
  const productsMega = $("#productsMega");

  if (productsLink && productsMega) {
    let timer;

    const openMega = () => {
      clearTimeout(timer);
      productsMega.style.display = "block";
      productsMega.setAttribute("aria-hidden", "false");
      productsLink.setAttribute("aria-expanded", "true");
    };

    const closeMega = () => {
      timer = setTimeout(() => {
        productsMega.style.display = "none";
        productsMega.setAttribute("aria-hidden", "true");
        productsLink.setAttribute("aria-expanded", "false");
      }, 150);
    };

    if (!isTouch) {
      productsLink.addEventListener("mouseenter", openMega);
      productsLink.addEventListener("mouseleave", closeMega);
      productsMega.addEventListener("mouseenter", () => clearTimeout(timer));
      productsMega.addEventListener("mouseleave", closeMega);
    }

    productsLink.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        productsMega.style.display === "block" ? closeMega() : openMega();
      }
      if (e.key === "Escape") closeMega();
    });

    document.addEventListener("click", e => {
      if (!productsLink.contains(e.target) && !productsMega.contains(e.target)) {
        closeMega();
      }
    });
  }

  /* =========================
     MOBILE MENU
     ========================= */
  const menuToggle = $("#menuToggle");
  const mobilePanel = $("#mobilePanel");
  const mobileOverlay = $("#mobileOverlay");
  const mobileClose = $("#mobileClose");

  const openMobile = () => {
    mobilePanel.classList.add("open");
    mobileOverlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  };

  const closeMobile = () => {
    mobilePanel.classList.remove("open");
    mobileOverlay.classList.add("hidden");
    document.body.style.overflow = "";
  };

  menuToggle?.addEventListener("click", openMobile);
  mobileClose?.addEventListener("click", closeMobile);
  mobileOverlay?.addEventListener("click", closeMobile);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeMobile();
  });

  /* =========================
     MOBILE PRODUCT TOGGLE
     ========================= */
  $$(".toggle-link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const sub = link.nextElementSibling;

      $$(".sub").forEach(s => s !== sub && (s.style.display = "none"));
      $$(".toggle-link").forEach(l => l !== link && l.classList.remove("active"));

      if (sub.style.display === "block") {
        sub.style.display = "none";
        link.classList.remove("active");
      } else {
        sub.style.display = "block";
        link.classList.add("active");
      }
    });
  });

  /* =========================
     PRODUCT SEARCH
     ========================= */
  document.addEventListener("DOMContentLoaded", () => {
    const searchBox = $("#searchBox");
    const cards = $$(".motor-card");
    const section = $("#productsection");

    if (!searchBox || !cards.length) return;

    let noResult = $("#noResults");
    if (!noResult) {
      noResult = document.createElement("p");
      noResult.id = "noResults";
      noResult.textContent = "❌ Product not available";
      noResult.style.textAlign = "center";
      noResult.style.display = "none";
      section.appendChild(noResult);
    }

    searchBox.addEventListener("input", () => {
      const q = searchBox.value.toLowerCase().trim();
      let found = false;

      cards.forEach(card => {
        const match = card.textContent.toLowerCase().includes(q);
        card.style.display = match ? "" : "none";
        if (match) found = true;
      });

      noResult.style.display = found || q === "" ? "none" : "block";
    });
  });

  /* =========================
     LAZY IMAGE LOAD
     ========================= */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const img = e.target;
          img.src = img.dataset.src || img.src;
          io.unobserve(img);
        }
      });
    }, { rootMargin: "80px" });

    $$("img[data-src]").forEach(img => io.observe(img));
  }

  /* =========================
     FAQ ACCORDION
     ========================= */
  $$(".faq-question").forEach(q => {
    q.addEventListener("click", () => {
      const item = q.closest(".faq-item");
      const ans = item.querySelector(".faq-answer");

      $$(".faq-answer").forEach(a => a.style.display = "none");
      ans.style.display = ans.style.display === "block" ? "none" : "block";
    });
  });

  /* =========================
     SLIDER
     ========================= */
  (() => {
    const slider = $(".slider");
    if (!slider) return;

    const imgs = slider.querySelectorAll(".slides img");
    const prev = slider.querySelector(".prev");
    const next = slider.querySelector(".next");
    const caption = slider.querySelector(".slider-caption");

    let i = 0;

    const show = n => {
      i = (n + imgs.length) % imgs.length;
      imgs.forEach((img, idx) => img.classList.toggle("active", idx === i));
      caption.textContent = imgs[i].dataset.caption || imgs[i].alt;
    };

    prev?.addEventListener("click", () => show(i - 1));
    next?.addEventListener("click", () => show(i + 1));

    setInterval(() => show(i + 1), 4500);
    show(0);
  })();

  /* =========================
     BACK TO TOP (SINGLE)
     ========================= */
  const backToTop = $("#backToTop");

  window.addEventListener("scroll", () => {
    backToTop.style.display = window.scrollY > 400 ? "block" : "none";
  });

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

})();
document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault(); // ❌ page reload band

  const form = e.target;
  const formData = new FormData(form);

  fetch(form.action, {
    method: "POST",
    body: formData
  })
  .then(() => {
    alert("✅ Your inquiry has been sent successfully!");
    form.reset(); // optional: form clear
  })
  .catch(() => {
    alert("❌ Something went wrong. Please try again.");
  });
});

