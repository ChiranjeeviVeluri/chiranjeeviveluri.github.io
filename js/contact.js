/* ============================================
   Copy-email button (also used by command menu)
   ============================================ */
(function () {
  const EMAIL = "velurichiranjeevi2001@gmail.com";

  const fallbackCopy = (text) => {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (err) {}
    area.remove();
    return ok;
  };

  window.copyEmail = async function (button) {
    let ok = false;
    try {
      await navigator.clipboard.writeText(EMAIL);
      ok = true;
    } catch (err) {
      ok = fallbackCopy(EMAIL);
    }

    if (window.showToast) {
      window.showToast(ok ? "Email copied to clipboard" : EMAIL, ok ? "fa-check-circle" : "fa-envelope");
    }

    if (button && ok) {
      const icon = button.querySelector(".copy-email__icon i");
      button.classList.add("is-copied");
      if (icon) icon.className = "fas fa-check";
      setTimeout(() => {
        button.classList.remove("is-copied");
        if (icon) icon.className = "far fa-copy";
      }, 2000);
    }
  };

  document.querySelectorAll("[data-copy-email]").forEach((btn) => {
    btn.addEventListener("click", () => window.copyEmail(btn));
  });
})();
