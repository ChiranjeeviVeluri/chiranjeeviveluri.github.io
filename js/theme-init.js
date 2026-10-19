/* Runs in <head> before the page paints: dark by default, light only if chosen */
(function () {
  var theme = "dark";
  try { if (localStorage.getItem("theme") === "light") theme = "light"; } catch (err) {}
  document.documentElement.setAttribute("data-theme", theme);
})();
