/* ══════════════════════════════════════════════════
   Elder M. Fouraux — script.js
   • Theme toggle (dark ↔ light)
   • Active nav link on scroll
   • Scroll-reveal animations
   • Hamburger menu (mobile)
   • Contact form feedback
   ══════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── 1. THEME TOGGLE ─────────────────────────────── */
  const html         = document.documentElement;
  const themeBtn     = document.getElementById("theme-toggle");
  const STORAGE_KEY  = "emf-theme";

  function applyTheme(theme) {
    html.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  // Restore saved preference (or system preference)
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    applyTheme(saved);
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }

  themeBtn.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });

  /* ── 2. ACTIVE NAV LINK ON SCROLL ────────────────── */
  const sections  = Array.from(document.querySelectorAll("section[id]"));
  const navLinks  = Array.from(document.querySelectorAll(".nav-link"));
  const navbar    = document.getElementById("navbar");

  function updateActiveLink() {
    const scrollY = window.scrollY;

    // Slightly scroll the navbar's appearance
    navbar.style.boxShadow =
      scrollY > 10 ? "0 2px 16px rgba(0,0,0,.25)" : "none";

    // Find section in view
    let current = sections[0]?.id ?? "";
    for (const section of sections) {
      const top = section.offsetTop - 80;
      if (scrollY >= top) current = section.id;
    }

    navLinks.forEach((link) => {
      const href = link.getAttribute("href").replace("#", "");
      link.classList.toggle("active", href === current);
    });
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink();

  /* ── 3. SCROLL-REVEAL ────────────────────────────── */
  const revealTargets = [
    ".hero-content",
    ".hero-terminal",
    ".sobre-img-wrap",
    ".sobre-text",
    ".form-card",
    ".proj-card",
    ".contato-card",
  ];

  // Add reveal class to all targets
  revealTargets.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add("reveal");
      el.style.transitionDelay = `${i * 0.07}s`;
    });
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((el) =>
    revealObserver.observe(el)
  );

  /* ── 4. HAMBURGER MENU (MOBILE) ──────────────────── */
  const hamburger = document.getElementById("hamburger");
  const navLinksEl = document.querySelector(".nav-links");

  hamburger?.addEventListener("click", () => {
    navLinksEl.classList.toggle("open");
  });

  // Close on nav link click (mobile)
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinksEl.classList.remove("open");
    });
  });

  /* ── 5. SMOOTH SECTION LINKS (portfolio/contact) ─── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ── 6. CONTACT FORM FEEDBACK ────────────────────── */
  const btnEnviar  = document.getElementById("btn-enviar");
  const notice     = document.getElementById("form-notice");

  btnEnviar?.addEventListener("click", () => {
    const nome  = document.getElementById("c-nome")?.value.trim();
    const email = document.getElementById("c-email")?.value.trim();
    const msg   = document.getElementById("c-msg")?.value.trim();

    if (!nome || !email || !msg) {
      notice.style.color = "var(--ctp-maroon, #ea999c)";
      notice.textContent  = "⚠ Por favor, preencha todos os campos.";
      return;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      notice.style.color = "var(--ctp-maroon, #ea999c)";
      notice.textContent  = "⚠ Insira um e-mail válido.";
      return;
    }

    // Simulate sending
    btnEnviar.textContent = "Enviando…";
    btnEnviar.disabled    = true;

    setTimeout(() => {
      notice.style.color = "var(--ctp-green, #a6d189)";
      notice.textContent  = "✓ Mensagem enviada com sucesso!";
      btnEnviar.textContent = "Enviar";
      btnEnviar.disabled    = false;

      document.getElementById("c-nome").value  = "";
      document.getElementById("c-email").value = "";
      document.getElementById("c-msg").value   = "";
    }, 1000);
  });
})();
