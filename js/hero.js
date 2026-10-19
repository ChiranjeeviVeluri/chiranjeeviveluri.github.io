/* ============================================
   Hero: rotating typing line + live Melbourne clock
   ============================================ */
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Rotating typing line */
  const target = document.getElementById("typing-rotate");
  if (target) {
    const phrases = (target.dataset.phrases || "").split("|").filter(Boolean);
    if (phrases.length && !reduceMotion) {
      const cursor = document.createElement("span");
      cursor.className = "typing-cursor";
      const text = document.createElement("span");
      target.textContent = "";
      target.append(text, cursor);

      let p = 0;
      let i = 0;
      let deleting = false;

      const tick = () => {
        const phrase = phrases[p];
        i += deleting ? -1 : 1;
        text.textContent = phrase.slice(0, i);

        let delay = deleting ? 35 : 70;
        if (!deleting && i === phrase.length) { deleting = true; delay = 1800; }
        else if (deleting && i === 0) { deleting = false; p = (p + 1) % phrases.length; delay = 350; }
        setTimeout(tick, delay);
      };
      setTimeout(tick, 1100);
    }
  }

  /* Live clock */
  const clock = document.querySelector("[data-clock]");
  if (clock) {
    const zone = clock.dataset.clock;
    const hm = new Intl.DateTimeFormat("en-AU", { timeZone: zone, hour: "numeric", minute: "2-digit", hour12: true });
    const tz = new Intl.DateTimeFormat("en-AU", { timeZone: zone, timeZoneName: "short" });
    const hourFmt = new Intl.DateTimeFormat("en-AU", { timeZone: zone, hour: "numeric", hour12: false });
    const greeting = document.querySelector("[data-clock-greeting]");

    const render = () => {
      const now = new Date();
      const parts = hm.formatToParts(now);
      const get = (type) => (parts.find((x) => x.type === type) || {}).value || "";
      const zoneName = (tz.formatToParts(now).find((x) => x.type === "timeZoneName") || {}).value || "";

      clock.innerHTML = `${get("hour")}<span class="clock__colon">:</span>${get("minute")}` +
        ` <small>${get("dayPeriod").toUpperCase()}</small><span class="clock__zone">${zoneName}</span>`;

      if (greeting) {
        const h = parseInt(hourFmt.format(now), 10) % 24;
        greeting.textContent =
          h >= 5 && h < 12 ? "Good morning from Melbourne ☀️" :
          h >= 12 && h < 17 ? "Good afternoon from Melbourne" :
          h >= 17 && h < 22 ? "Good evening from Melbourne 🌆" :
          "Night-owl hours in Melbourne 🌙";
      }
    };

    render();
    setInterval(render, 15000);
  }
})();
