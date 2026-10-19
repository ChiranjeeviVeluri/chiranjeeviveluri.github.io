/* ============================================
   Case study pages: reveal setup, reading progress,
   side contents, lightbox, next-project card.
   Load BEFORE script.js and animations.js.
   ============================================ */
(function () {
  const PROJECTS = [
    { href: "project-nsw.html", title: "NSW Property Market Intelligence", img: "assets/project/thumb-nsw.webp" },
    { href: "project-woolies.html", title: "Woolworths Merchandise", img: "assets/project/thumb-woolies.webp" },
    { href: "project-bigw.html", title: "BIG W Sales Dashboard", img: "assets/project/thumb-bigw.webp" },
    { href: "project-edr.html", title: "Everyday Rewards Dashboard", img: "assets/project/thumb-edr.webp" },
  ];

  /* Reading progress bar */
  if (!document.querySelector(".scroll-progress")) {
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.prepend(bar);
  }

  /* Next case study card (inserted before the footer) */
  const page = window.location.pathname.split("/").pop() || "index.html";
  const index = PROJECTS.findIndex((p) => p.href === page);
  const footer = document.querySelector("#footer");

  if (index !== -1 && footer) {
    const next = PROJECTS[(index + 1) % PROJECTS.length];
    const section = document.createElement("section");
    section.className = "cs-next cs-section";
    section.innerHTML = `
      <div class="cs-container">
        <a class="cs-next__card transition-link" href="${next.href}">
          <div class="cs-next__img shimmer"><img src="${next.img}" alt="" loading="lazy" width="1000" height="563" /></div>
          <div class="cs-next__body">
            <span class="cs-next__label">Next case study</span>
            <h2 class="cs-next__title">${next.title}</h2>
            <span class="cs-next__cta">Read next <i class="fas fa-arrow-right"></i></span>
          </div>
        </a>
      </div>`;
    footer.before(section);
  }

  /* Side contents built from [data-toc] sections */
  const labels = Array.from(document.querySelectorAll("[data-toc]"));
  if (labels.length > 2) {
    const toc = document.createElement("nav");
    toc.className = "cs-toc";
    toc.setAttribute("aria-label", "On this page");

    const buttons = labels.map((label, i) => {
      if (!label.id) label.id = `section-${i + 1}`;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = label.dataset.toc;
      btn.addEventListener("click", () => {
        const y = label.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: y, behavior: "smooth" });
      });
      toc.appendChild(btn);
      return btn;
    });

    document.body.appendChild(toc);

    let ticking = false;
    const spy = () => {
      const line = window.innerHeight * 0.4;
      let active = 0;
      labels.forEach((label, i) => {
        if (label.getBoundingClientRect().top < line) active = i;
      });
      buttons.forEach((b, i) => b.classList.toggle("is-active", i === active));
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { requestAnimationFrame(spy); ticking = true; }
    }, { passive: true });
    spy();
  }

  /* Lightbox for screenshots */
  const shots = Array.from(document.querySelectorAll(".cs-zoom img")).filter(
    (img) => !img.closest(".cs-next")
  );

  if (shots.length) {
    const box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Screenshot viewer");
    box.innerHTML = `
      <button class="lightbox__btn lightbox__close" type="button" aria-label="Close"><i class="fas fa-times"></i></button>
      <button class="lightbox__btn lightbox__prev" type="button" aria-label="Previous"><i class="fas fa-chevron-left"></i></button>
      <button class="lightbox__btn lightbox__next" type="button" aria-label="Next"><i class="fas fa-chevron-right"></i></button>
      <div class="lightbox__frame"><img class="lightbox__img" alt="" /></div>
      <p class="lightbox__caption"></p>
      <span class="lightbox__count"></span>`;
    document.body.appendChild(box);

    const img = box.querySelector(".lightbox__img");
    const caption = box.querySelector(".lightbox__caption");
    const count = box.querySelector(".lightbox__count");
    const prev = box.querySelector(".lightbox__prev");
    const next = box.querySelector(".lightbox__next");
    let current = 0;

    if (shots.length < 2) { prev.hidden = true; next.hidden = true; }

    const show = (i) => {
      current = (i + shots.length) % shots.length;
      img.classList.remove("is-zoomed");
      img.src = shots[current].currentSrc || shots[current].src;
      img.alt = shots[current].alt;
      caption.textContent = shots[current].alt;
      count.textContent = `${current + 1} / ${shots.length}`;
    };

    const open = (i) => {
      show(i);
      box.classList.add("is-open");
      document.body.style.overflow = "hidden";
      box.querySelector(".lightbox__close").focus();
    };

    const close = () => {
      box.classList.remove("is-open");
      document.body.style.overflow = "";
      shots[current].focus();
    };

    shots.forEach((shot, i) => {
      shot.classList.add("cs-zoomable");
      shot.tabIndex = 0;
      shot.addEventListener("click", () => open(i));
      shot.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); }
      });
    });

    img.addEventListener("click", (e) => {
      const r = img.getBoundingClientRect();
      img.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
      img.classList.toggle("is-zoomed");
    });

    box.querySelector(".lightbox__close").addEventListener("click", close);
    prev.addEventListener("click", () => show(current - 1));
    next.addEventListener("click", () => show(current + 1));
    box.addEventListener("click", (e) => { if (e.target === box) close(); });

    document.addEventListener("keydown", (e) => {
      if (!box.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft" && shots.length > 1) show(current - 1);
      if (e.key === "ArrowRight" && shots.length > 1) show(current + 1);
    });
  }

  /* Methodology stepper: fill the line up to the active step */
  document.querySelectorAll(".cs-steps__track").forEach((track) => {
    const steps = Array.from(track.querySelectorAll('[role="tab"]'));
    const fill = (tab) => {
      const i = steps.indexOf(tab);
      track.style.setProperty("--step-progress", steps.length > 1 ? i / (steps.length - 1) : 1);
      steps.forEach((s, j) => s.classList.toggle("is-done", j < i));
    };
    track.addEventListener("tabs:change", (e) => fill(e.detail.tab));
    fill(steps.find((s) => s.classList.contains("is-active")) || steps[0]);
  });

  /* Show the project title in the top bar once the hero scrolls away */
  const topbar = document.querySelector(".pw-topbar");
  const hero = document.querySelector(".cs-hero");
  if (topbar && hero && "IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      topbar.classList.toggle("is-condensed", !entry.isIntersecting);
      document.body.classList.toggle("toc-visible", !entry.isIntersecting);
    }, { rootMargin: "-80px 0px 0px 0px" }).observe(hero);
  }

  /* Bar charts draw in when they come into view */
  const bars = document.querySelectorAll(".cs-bars");
  if (bars.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-drawn");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    bars.forEach((b) => io.observe(b));
  } else {
    bars.forEach((b) => b.classList.add("is-drawn"));
  }
})();
