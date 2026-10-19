/* ============================================
   Project filters with FLIP re-layout animation
   ============================================ */
(function () {
  const grid = document.querySelector(".p-grid");
  const filters = document.querySelectorAll(".filter");
  if (!grid || !filters.length) return;

  const cards = Array.from(grid.querySelectorAll(".p-card"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Counts per filter */
  filters.forEach((btn) => {
    const key = btn.dataset.filter;
    const count = key === "all" ? cards.length : cards.filter((c) => c.dataset.tags.split(" ").includes(key)).length;
    const badge = btn.querySelector(".filter__count");
    if (badge) badge.textContent = count;
  });

  const applyFilter = (key) => {
    const first = new Map(cards.map((c) => [c, c.getBoundingClientRect()]));

    cards.forEach((card) => {
      const show = key === "all" || card.dataset.tags.split(" ").includes(key);
      card.classList.toggle("is-hidden", !show);
    });

    if (reduceMotion) return;

    cards.forEach((card) => {
      if (card.classList.contains("is-hidden")) return;
      const before = first.get(card);
      const after = card.getBoundingClientRect();
      const wasHidden = before.width === 0;

      if (wasHidden) {
        card.animate(
          [{ opacity: 0, transform: "scale(0.94)" }, { opacity: 1, transform: "none" }],
          { duration: 450, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
        );
        return;
      }

      const dx = before.left - after.left;
      const dy = before.top - after.top;
      const sx = before.width / after.width;
      const sy = before.height / after.height;
      if (!dx && !dy && sx === 1 && sy === 1) return;

      card.animate(
        [
          { transformOrigin: "top left", transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
          { transformOrigin: "top left", transform: "none" },
        ],
        { duration: 550, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
      );
    });
  };

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-pressed", String(b === btn));
      });
      applyFilter(btn.dataset.filter);
      grid.scrollTo({ left: 0, behavior: "smooth" });
    });
  });
})();
