/* ============================================
   Glass blobs: mouse parallax + pause when off screen
   ============================================ */
(function () {
  const stages = document.querySelectorAll(".glass-stage");
  if (!stages.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.target.classList.toggle("is-paused", !e.isIntersecting));
    });
    stages.forEach((s) => io.observe(s));
  }

  if (reduceMotion || !finePointer) return;

  stages.forEach((stage) => {
    const blobs = Array.from(stage.querySelectorAll(".glass-blobs span"));
    const depth = [40, -30, 55];

    stage.addEventListener("pointermove", (e) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      blobs.forEach((b, i) => {
        b.style.translate = `${(x * depth[i]).toFixed(1)}px ${(y * depth[i]).toFixed(1)}px`;
      });
    });

    stage.addEventListener("pointerleave", () => {
      blobs.forEach((b) => { b.style.translate = ""; });
    });
  });
})();
