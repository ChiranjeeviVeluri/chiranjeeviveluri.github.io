/* ============================================
   Accessible tabs with sliding indicator
   (used by Skills and Experience)
   ============================================ */
(function () {
  document.querySelectorAll('[role="tablist"]').forEach((tablist) => {
    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
    const indicator = tablist.querySelector(".tab-indicator");
    if (!tabs.length) return;

    const panelOf = (tab) => document.getElementById(tab.getAttribute("aria-controls"));

    const moveIndicator = (tab) => {
      if (!indicator) return;
      indicator.style.left = `${tab.offsetLeft}px`;
      indicator.style.top = `${tab.offsetTop}px`;
      indicator.style.width = `${tab.offsetWidth}px`;
      indicator.style.height = `${tab.offsetHeight}px`;
    };

    const activate = (tab, focus) => {
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
        t.tabIndex = active ? 0 : -1;
        const panel = panelOf(t);
        if (panel) panel.hidden = !active;
      });
      moveIndicator(tab);
      if (focus) tab.focus();
      tab.scrollIntoView({ block: "nearest", inline: "nearest" });
      tablist.dispatchEvent(new CustomEvent("tabs:change", { detail: { tab, panel: panelOf(tab) } }));
    };

    /* Stagger index for children of every panel */
    tabs.forEach((t) => {
      const panel = panelOf(t);
      if (panel) Array.from(panel.children).forEach((c, i) => c.style.setProperty("--i", i));
    });

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => activate(tab));
      tab.addEventListener("keydown", (e) => {
        const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
        let next = null;
        if (keys[e.key]) next = tabs[(i + keys[e.key] + tabs.length) % tabs.length];
        if (e.key === "Home") next = tabs[0];
        if (e.key === "End") next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); activate(next, true); }
      });
    });

    const initial = tabs.find((t) => t.classList.contains("is-active")) || tabs[0];
    tabs.forEach((t) => {
      t.tabIndex = t === initial ? 0 : -1;
      const panel = panelOf(t);
      if (panel) panel.hidden = t !== initial;
    });

    const place = () => moveIndicator(tabs.find((t) => t.classList.contains("is-active")) || initial);
    place();
    window.addEventListener("resize", place);
    window.addEventListener("load", place);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
  });
})();
