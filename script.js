// ============================================================
// NOTE: Page content (services, tech ticker, process steps) now
// lives directly in index.html as static markup — not generated
// by JS. This means the page displays correctly even if this
// script fails to load. This file only adds animation, mobile
// nav, and form handling on top of that.
// ============================================================

// ============================================================
// Scroll reveal (IntersectionObserver)
// ============================================================
function initReveal() {
  const els = document.querySelectorAll("[data-reveal]");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  els.forEach((el) => {
    const delay = el.dataset.delay || 0;
    el.style.transitionDelay = `${delay}ms`;
    io.observe(el);
  });
}

// ============================================================
// Sticky nav shrink-on-scroll
// ============================================================
function initNavScroll() {
  const header = document.getElementById("site-header");
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// ============================================================
// Mobile nav drawer
//
// On narrow screens the pill nav can't fit all links, so a
// hamburger button toggles a slide-in sidebar instead. Desktop
// layout (nav-bar pill with inline links) is untouched.
// ============================================================
function initMobileNav() {
  const toggle = document.getElementById("menu-toggle");
  const links = document.getElementById("nav-links");
  const overlay = document.getElementById("nav-overlay");
  if (!toggle || !links || !overlay) return;

  function closeMenu() {
    links.classList.remove("is-open");
    overlay.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  function openMenu() {
    links.classList.add("is-open");
    overlay.classList.add("is-open");
    toggle.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  }

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.contains("is-open");
    isOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener("click", closeMenu);

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", closeMenu);
  });

  // Close on Escape for keyboard users
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

// ============================================================
// Contact form — validation + submission
//
// This currently POSTs nowhere by default. To make it actually
// send you the lead, pick ONE of these and fill in FORM_ENDPOINT:
//   - Formspree (https://formspree.io) — free tier, no backend needed
//   - EmailJS (https://www.emailjs.com) — sends straight to your inbox
//   - Your own API route / Supabase function
// Until FORM_ENDPOINT is set, submissions are validated and logged
// to the console so you can see it working, but nothing is sent.
// ============================================================
const FORM_ENDPOINT = ""; // e.g. "https://formspree.io/f/your-id"

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const submitBtn = document.getElementById("submit-btn");
  const submitLabel = document.getElementById("submit-label");
  const status = document.getElementById("form-status");

  const validators = {
    name: (v) => v.trim().length > 0 || "Please enter your name.",
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Please enter a valid email.",
    brief: (v) => v.trim().length > 0 || "Tell us a little about the project.",
    budget: (v) => v.trim().length > 0 || "Please select a budget range.",
  };

  function setFieldError(name, message) {
    const errorEl = document.getElementById(`${name}-error`);
    const fieldEl = errorEl.closest(".field");
    errorEl.textContent = message || "";
    fieldEl.classList.toggle("has-error", !!message);
  }

  function validateField(name, value) {
    const result = validators[name](value);
    const message = result === true ? "" : result;
    setFieldError(name, message);
    return message === "";
  }

  // live validation on blur
  Object.keys(validators).forEach((name) => {
    const el = form.elements[name];
    el.addEventListener("blur", () => validateField(name, el.value));
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    status.className = "form-status";

    const data = Object.fromEntries(new FormData(form).entries());
    const allValid = Object.keys(validators)
      .map((name) => validateField(name, data[name] || ""))
      .every(Boolean);

    if (!allValid) {
      status.textContent = "Please fix the highlighted fields.";
      status.classList.add("error");
      return;
    }

    submitBtn.disabled = true;
    submitLabel.textContent = "Sending…";

    try {
      if (!FORM_ENDPOINT) {
        // No backend wired up yet — simulate so you can see the flow work.
        console.log("Contact form submission (not sent — set FORM_ENDPOINT):", data);
        await new Promise((res) => setTimeout(res, 500));
        status.textContent = "Form works! Set FORM_ENDPOINT in script.js to actually send this.";
        status.classList.add("success");
        form.reset();
      } else {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Request failed");
        status.textContent = "Brief received — we'll be in touch shortly.";
        status.classList.add("success");
        form.reset();
      }
    } catch (err) {
      console.error(err);
      status.textContent = "Something went wrong. Please try again or email us directly.";
      status.classList.add("error");
    } finally {
      submitBtn.disabled = false;
      submitLabel.textContent = "Transmit brief";
    }
  });
}

// ============================================================
// Init
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  initReveal();
  initNavScroll();
  initMobileNav();
  initContactForm();
});