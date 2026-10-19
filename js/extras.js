/* ============================================
   Small extras: tab title, console note, "sql" easter egg
   ============================================ */
(function () {
  /* Tab title when the visitor switches away */
  const originalTitle = document.title;
  document.addEventListener("visibilitychange", () => {
    document.title = document.hidden ? "👋 Come back, the data misses you" : originalTitle;
  });

  /* Console note for curious developers */
  console.log(
    "%c👋 Hey there, fellow data nerd!",
    "font: 700 16px sans-serif; color: #1F64C9;"
  );
  console.log(
    "%cLike what you see? Let's talk → velurichiranjeevi2001@gmail.com",
    "font: 500 12px monospace; color: #64748B;"
  );

  /* Easter egg: type "sql" anywhere (outside inputs) */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let buffer = "";

  const burst = () => {
    if (reduceMotion) return;
    const wrap = document.createElement("div");
    wrap.setAttribute("aria-hidden", "true");
    wrap.style.cssText = "position:fixed;left:0;right:0;bottom:0;height:45vh;display:flex;align-items:flex-end;justify-content:center;gap:6px;pointer-events:none;z-index:2900;";
    const colors = ["#1F64C9", "#5AA9FF", "#22D3EE"];
    for (let i = 0; i < 18; i++) {
      const bar = document.createElement("span");
      const h = 20 + Math.random() * 80;
      bar.style.cssText = `width:min(3.5vw,26px);height:${h}%;border-radius:6px 6px 0 0;background:${colors[i % 3]};opacity:.85;transform-origin:bottom;`;
      bar.animate(
        [{ transform: "scaleY(0)" }, { transform: "scaleY(1)", offset: 0.4 }, { transform: "scaleY(1)", offset: 0.75 }, { transform: "scaleY(0)" }],
        { duration: 1800, delay: i * 40, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "both" }
      );
      wrap.appendChild(bar);
    }
    document.body.appendChild(wrap);
    setTimeout(() => wrap.remove(), 2700);
  };

  document.addEventListener("keydown", (e) => {
    const tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;
    if (e.key.length !== 1) return;

    buffer = (buffer + e.key.toLowerCase()).slice(-3);
    if (buffer === "sql") {
      buffer = "";
      burst();
      if (window.showToast) window.showToast("SELECT * FROM visitors WHERE curious = TRUE; → 1 row: you 👋", "fa-database");
    }
  });
})();
