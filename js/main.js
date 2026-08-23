// Nuvasah Interiors — main script.

// Client WhatsApp number in wa.me format (country code + number, digits only).
// Source: +91 74280 14947
const CLIENT_WHATSAPP_NUMBER = "917428014947";

// Secondary record of enquiries. Replace the placeholder below with the client's
// Formspree endpoint (e.g. "https://formspree.io/f/abcdwxyz"). Until it's replaced,
// the POST is skipped gracefully so the form keeps working.
const FORMSPREE_ENDPOINT = "PASTE_FORMSPREE_ENDPOINT_HERE";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  if (!form) return;

  // Field id -> human label, in the order they appear on the form.
  const FIELDS = [
    ["name", "Name"],
    ["whatsapp", "WhatsApp"],
    ["email", "Email"],
    ["location", "Property Location"],
    ["bhk", "Property Size"],
    ["scope", "Scope of Work"],
    ["budget", "Estimated Budget"],
    ["message", "Message"],
  ];

  // Reusable on-page status line, inserted right after the form.
  let status = document.getElementById("form-status");
  if (!status) {
    status = document.createElement("p");
    status.id = "form-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.style.marginTop = "var(--space-sm)";
    status.style.color = "var(--color-accent)";
    form.appendChild(status);
  }

  function readValues() {
    const data = {};
    FIELDS.forEach(function (pair) {
      const el = document.getElementById(pair[0]);
      data[pair[0]] = el ? el.value.trim() : "";
    });
    return data;
  }

  function buildSummary(data) {
    const lines = ["New enquiry from the Nuvasah Interiors website:", ""];
    FIELDS.forEach(function (pair) {
      const value = data[pair[0]];
      lines.push(pair[1] + ": " + (value || "—"));
    });
    return lines.join("\n");
  }

  function postToFormspree(data) {
    // Skip gracefully if the endpoint hasn't been configured yet.
    if (!FORMSPREE_ENDPOINT || FORMSPREE_ENDPOINT === "PASTE_FORMSPREE_ENDPOINT_HERE") {
      return;
    }
    try {
      fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      }).catch(function () {
        // Network/endpoint errors must never block the WhatsApp flow.
      });
    } catch (e) {
      // Same: swallow so the form always works.
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const data = readValues();
    const summary = buildSummary(data);
    const waLink =
      "https://wa.me/" +
      CLIENT_WHATSAPP_NUMBER +
      "?text=" +
      encodeURIComponent(summary);

    // Confirmation before the redirect, so nothing happens silently.
    status.textContent = "Opening WhatsApp…";

    // Open synchronously in the submit handler so pop-up blockers allow it.
    window.open(waLink, "_blank");

    // Secondary record — fire-and-forget, never blocks or errors out.
    postToFormspree(data);
  });
});

// Home carousel / slideshow. Dependency-free. Each .carousel-slide may hold an
// <img> or a <video>; active videos are left to the browser, inactive ones paused.
document.addEventListener("DOMContentLoaded", function () {
  const carousels = document.querySelectorAll(".home-carousel");

  carousels.forEach(function (carousel) {
    const slides = Array.prototype.slice.call(
      carousel.querySelectorAll(".carousel-slide")
    );
    if (slides.length === 0) return;

    const prevBtn = carousel.querySelector(".carousel-prev");
    const nextBtn = carousel.querySelector(".carousel-next");
    const dotsWrap = carousel.querySelector(".carousel-dots");
    const interval = parseInt(carousel.getAttribute("data-interval"), 10) || 5000;
    const reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let index = 0;
    let timer = null;

    // Build one dot per slide.
    const dots = [];
    if (dotsWrap) {
      slides.forEach(function (_, i) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", "Go to slide " + (i + 1));
        dot.addEventListener("click", function () {
          show(i);
          restart();
        });
        dotsWrap.appendChild(dot);
        dots.push(dot);
      });
    }

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (slide, si) {
        const active = si === index;
        slide.classList.toggle("is-active", active);
        const video = slide.querySelector("video");
        if (video && !active) {
          try { video.pause(); } catch (e) {}
        }
      });
      dots.forEach(function (dot, di) {
        dot.classList.toggle("is-active", di === index);
      });
    }

    function nextSlide() { show(index + 1); }
    function prevSlide() { show(index - 1); }

    function start() {
      if (reduceMotion || slides.length < 2) return;
      stop();
      timer = setInterval(nextSlide, interval);
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    function restart() { stop(); start(); }

    if (nextBtn) nextBtn.addEventListener("click", function () { nextSlide(); restart(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { prevSlide(); restart(); });

    // Pause while the visitor is interacting.
    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    carousel.addEventListener("focusin", stop);
    carousel.addEventListener("focusout", start);

    // Hide single-arrow/dot controls when there's nothing to advance to.
    if (slides.length < 2) {
      if (prevBtn) prevBtn.style.display = "none";
      if (nextBtn) nextBtn.style.display = "none";
      if (dotsWrap) dotsWrap.style.display = "none";
    }

    carousel.classList.add("is-ready");
    show(0);
    start();
  });
});
