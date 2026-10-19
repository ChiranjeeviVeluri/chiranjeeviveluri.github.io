/* ============================================
   Education timeline: line draws as you scroll,
   dots light up when reached
   ============================================ */
(function () {
  const timelines = document.querySelectorAll(".timeline");
  if (!timelines.length) return;

  const items = Array.from(timelines).map((tl) => ({
    tl,
    bar: tl.querySelector(".timeline__progress"),
    dots: Array.from(tl.querySelectorAll(".timeline-dot")),
  }));

  let ticking = false;

  const update = () => {
    const trigger = window.innerHeight * 0.65;
    items.forEach(({ tl, bar, dots }) => {
      const r = tl.getBoundingClientRect();
      const p = Math.min(Math.max((trigger - r.top) / r.height, 0), 1);
      if (bar) bar.style.setProperty("--p", p.toFixed(3));
      dots.forEach((dot) => {
        const d = dot.getBoundingClientRect();
        dot.classList.toggle("is-active", d.top + d.height / 2 <= trigger);
      });
    });
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  window.addEventListener("resize", update);
  update();
})();
