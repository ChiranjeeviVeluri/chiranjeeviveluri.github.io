// Hamburger menu
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

if (hamburger) {
  hamburger.addEventListener("click", mobileMenu);

  function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  }

  const navLink = document.querySelectorAll(".nav-link");
  navLink.forEach((n) => n.addEventListener("click", closeMenu));

  function closeMenu() {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  }
}

// Dark mode toggle (circular wipe where supported)
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try { localStorage.setItem("theme", theme); } catch (err) {}
}

function switchTheme(e) {
  const theme = e.target.checked ? "dark" : "light";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!document.startViewTransition || reduceMotion) {
    applyTheme(theme);
    return;
  }

  const origin = document.querySelector(".toggle-icons").getBoundingClientRect();
  const x = origin.left + origin.width / 2;
  const y = origin.top + origin.height / 2;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  const transition = document.startViewTransition(() => applyTheme(theme));
  transition.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 650, easing: "cubic-bezier(0.77, 0, 0.18, 1)", pseudoElement: "::view-transition-new(root)" }
    );
  });
}

if (toggleSwitch) {
  toggleSwitch.addEventListener("change", switchTheme, false);
}

// Dark is the default; light only when the visitor has chosen it
let currentTheme = "dark";
try { if (localStorage.getItem("theme") === "light") currentTheme = "light"; } catch (err) {}
document.documentElement.setAttribute("data-theme", currentTheme);
if (toggleSwitch) toggleSwitch.checked = currentTheme === "dark";

// Footer year
const datee = document.querySelector("#datee");
if (datee) datee.innerHTML = new Date().getFullYear();

// Page transition — outgoing
const overlay = document.querySelector(".page-transition");

document.querySelectorAll(".transition-link, .project-link-card").forEach((el) => {
  el.addEventListener("click", function (e) {
    const href = this.getAttribute("href") || this.dataset.href;
    if (!href || href === "#") return;
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    if (overlay) overlay.classList.add("is-leaving");
    setTimeout(() => { window.location.href = href; }, 500);
  });
});

// Restore page if it comes back from the back/forward cache
window.addEventListener("pageshow", (e) => {
  if (e.persisted && overlay) overlay.classList.remove("is-leaving");
});
