/* ============================================
   Navbar behaviour, scrollspy, mobile menu,
   back-to-top, mobile "Hire me" button
   ============================================ */
(function () {
  const navbar = document.querySelector(".navbar");
  const navMenu = document.querySelector(".nav-menu");
  const hamburger = document.querySelector(".hamburger");
  const backToTop = document.querySelector(".back-to-top");
  const hireFab = document.querySelector(".hire-fab");
  const contact = document.querySelector("#contact");
  if (!navbar) return;

  const menuOpen = () => navMenu && navMenu.classList.contains("active");

  /* Shrink on scroll, hide on scroll down, show on scroll up */
  let lastY = window.scrollY;
  let contactInView = false;
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    navbar.classList.toggle("is-scrolled", y > 20);

    if (!menuOpen()) {
      if (y > lastY + 6 && y > 300) navbar.classList.add("is-hidden");
      else if (y < lastY - 6 || y < 300) navbar.classList.remove("is-hidden");
    }
    lastY = y;

    if (backToTop) backToTop.classList.toggle("is-visible", y > 700);
    if (hireFab) hireFab.classList.toggle("is-visible", y > window.innerHeight * 0.6 && !contactInView);
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* Hide the floating button once the contact section is on screen */
  if (contact && "IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      contactInView = entry.isIntersecting;
      onScroll();
    }, { threshold: 0.15 }).observe(contact);
  }

  /* Scrollspy */
  const links = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  /* Mobile menu: lock scroll + Escape to close */
  const syncMenu = () => {
    document.body.classList.toggle("menu-open", menuOpen());
    if (hamburger) hamburger.setAttribute("aria-expanded", String(menuOpen()));
    if (menuOpen()) navbar.classList.remove("is-hidden");
  };

  if (hamburger) {
    hamburger.addEventListener("click", syncMenu);
    hamburger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); hamburger.click(); }
    });
  }
  document.querySelectorAll(".nav-menu a").forEach((a) => a.addEventListener("click", () => setTimeout(syncMenu)));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuOpen()) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      syncMenu();
    }
  });

  /* Back to top */
  if (backToTop) {
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }
})();
