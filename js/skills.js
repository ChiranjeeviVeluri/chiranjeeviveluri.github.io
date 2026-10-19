/* ============================================
   Skills marquee: duplicate items for a seamless loop
   ============================================ */
(function () {
  document.querySelectorAll(".marquee__track").forEach((track) => {
    Array.from(track.children).forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });
  });
})();
