/* ============================================
   Shared motion layer (all pages)
   ============================================ */
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* Toasts — window.showToast("Copied", "fa-check") */
  let stack;
  window.showToast = function (message, icon = "fa-check-circle") {
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      stack.setAttribute("role", "status");
      stack.setAttribute("aria-live", "polite");
      document.body.appendChild(stack);
    }
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<i class="fas ${icon}"></i><span></span>`;
    toast.querySelector("span").textContent = message;
    stack.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("is-leaving");
      toast.addEventListener("animationend", () => toast.remove(), { once: true });
    }, 2600);
  };

  /* Staggered groups: children inherit data-reveal with increasing delay */
  document.querySelectorAll("[data-stagger]").forEach((group) => {
    const step = parseInt(group.dataset.stagger, 10) || 90;
    Array.from(group.children).forEach((child, i) => {
      if (!child.hasAttribute("data-reveal")) child.setAttribute("data-reveal", "");
      child.style.setProperty("--d", `${i * step}ms`);
    });
  });

  /* Reveal on scroll; attribute removed afterwards so hover transitions stay snappy */
  const revealEls = document.querySelectorAll("[data-reveal]");
  const settle = (el) => {
    const delay = parseInt(el.style.getPropertyValue("--d"), 10) || 0;
    let timer;
    const done = (e) => {
      if (e && (e.target !== el || e.propertyName !== "opacity")) return;
      clearTimeout(timer);
      el.removeAttribute("data-reveal");
      el.classList.remove("is-in");
      el.style.removeProperty("--d");
      el.removeEventListener("transitionend", done);
    };
    el.addEventListener("transitionend", done);
    timer = setTimeout(done, delay + 1200);
  };

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.removeAttribute("data-reveal"));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        settle(entry.target);
        entry.target.classList.add("is-in");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* Scroll progress bar */
  const progress = document.querySelector(".scroll-progress");
  if (progress) {
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* Count-up: <span data-count="30000" data-suffix="+">30,000+</span> */
  const formatNum = (n, el) => {
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const decimals = parseInt(el.dataset.decimals, 10) || 0;
    const value = n.toLocaleString("en-AU", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    return prefix + value + suffix;
  };

  const runCount = (el) => {
    const target = parseFloat(el.dataset.count);
    if (reduceMotion) { el.textContent = formatNum(target, el); return; }
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = formatNum(target * eased, el);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  /* Exposed for components that count on demand (e.g. project panels) */
  window.countUp = runCount;

  const countEls = document.querySelectorAll("[data-count]:not([data-count-manual])");
  if (countEls.length && "IntersectionObserver" in window && !reduceMotion) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        runCount(entry.target);
        countObserver.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    countEls.forEach((el) => {
      el.textContent = formatNum(0, el);
      countObserver.observe(el);
    });
  }

  /* Image shimmer until loaded */
  document.querySelectorAll(".shimmer img").forEach((img) => {
    const wrap = img.closest(".shimmer");
    const done = () => wrap.classList.add("is-loaded");
    if (img.complete && img.naturalWidth) done();
    else {
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    }
  });

  if (!finePointer || reduceMotion) return;

  /* Cursor spotlight */
  document.querySelectorAll(".spotlight").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  /* Magnetic buttons */
  document.querySelectorAll(".magnetic").forEach((el) => {
    const strength = 0.25;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  });

  /* 3D tilt */
  document.querySelectorAll("[data-tilt]").forEach((el) => {
    const max = parseFloat(el.dataset.tilt) || 6;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateY(-4px)`;
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  });
})();
