/* ============================================
   Command menu (Ctrl/⌘ + K)
   ============================================ */
(function () {
  const EMAIL = "velurichiranjeevi2001@gmail.com";
  const LINKEDIN = "https://www.linkedin.com/in/veluri-chiranjeevi-5b1b20225";
  const GITHUB = "https://github.com/ChiranjeeviVeluri";
  const resumeLink = document.querySelector("[data-resume]");

  const scrollTo = (id) => () => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };
  const open = (url) => () => window.open(url, "_blank", "noopener");
  const go = (url) => () => { window.location.href = url; };

  const commands = [
    { group: "Navigate", label: "Skills", icon: "fa-tools", run: scrollTo("#skills") },
    { group: "Navigate", label: "Projects", icon: "fa-th-large", run: scrollTo("#projects") },
    { group: "Navigate", label: "Education", icon: "fa-graduation-cap", run: scrollTo("#education") },
    { group: "Navigate", label: "Experience", icon: "fa-briefcase", run: scrollTo("#experience") },
    { group: "Navigate", label: "Contact", icon: "fa-paper-plane", run: scrollTo("#contact") },
    { group: "Case studies", label: "NSW Property Market Intelligence", icon: "fa-home", run: go("project-nsw.html") },
    { group: "Case studies", label: "Woolworths Merchandise", icon: "fa-shopping-basket", run: go("project-woolies.html") },
    { group: "Case studies", label: "BIG W Sales Dashboard", icon: "fa-store", run: go("project-bigw.html") },
    { group: "Case studies", label: "Everyday Rewards Dashboard", icon: "fa-gift", run: go("project-edr.html") },
    { group: "Actions", label: "Copy email address", icon: "fa-copy", run: () => window.copyEmail && window.copyEmail() },
    { group: "Actions", label: "Open LinkedIn", icon: "fa-external-link-alt", run: open(LINKEDIN) },
    { group: "Actions", label: "Open GitHub", icon: "fa-code-branch", run: open(GITHUB) },
    { group: "Actions", label: "Send an email", icon: "fa-envelope", run: go(`mailto:${EMAIL}`) },
    { group: "Actions", label: "View résumé", icon: "fa-file-alt", run: () => resumeLink && open(resumeLink.href)() },
    { group: "Actions", label: "Toggle dark mode", icon: "fa-adjust", run: () => {
      const sw = document.querySelector("#switch");
      if (!sw) return;
      sw.checked = !sw.checked;
      sw.dispatchEvent(new Event("change"));
    } },
  ];

  const root = document.createElement("div");
  root.className = "cmdk";
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-modal", "true");
  root.setAttribute("aria-label", "Command menu");
  root.innerHTML = `
    <div class="cmdk__panel">
      <div class="cmdk__search">
        <i class="fas fa-search"></i>
        <input class="cmdk__input" type="text" placeholder="Search sections, projects, actions…" aria-label="Search commands" autocomplete="off" />
        <span class="cmdk__esc">ESC</span>
      </div>
      <div class="cmdk__list" role="listbox"></div>
      <div class="cmdk__foot"><span>↑↓ navigate</span><span>↵ select</span><span>esc close</span></div>
    </div>`;
  document.body.appendChild(root);

  const input = root.querySelector(".cmdk__input");
  const list = root.querySelector(".cmdk__list");
  let filtered = commands;
  let selected = 0;
  let lastFocus = null;

  const render = () => {
    const q = input.value.trim().toLowerCase();
    filtered = commands.filter((c) => `${c.label} ${c.group}`.toLowerCase().includes(q));
    selected = Math.min(selected, Math.max(filtered.length - 1, 0));
    list.innerHTML = "";

    if (!filtered.length) {
      list.innerHTML = `<div class="cmdk__empty">No results. Try “projects” or “email”.</div>`;
      return;
    }

    let group = "";
    filtered.forEach((cmd, i) => {
      if (cmd.group !== group) {
        group = cmd.group;
        const heading = document.createElement("div");
        heading.className = "cmdk__group";
        heading.textContent = group;
        list.appendChild(heading);
      }
      const item = document.createElement("button");
      item.type = "button";
      item.className = "cmdk__item" + (i === selected ? " is-selected" : "");
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", String(i === selected));
      item.innerHTML = `<i class="fas ${cmd.icon}"></i><span></span><kbd>↵</kbd>`;
      item.querySelector("span").textContent = cmd.label;
      item.addEventListener("click", () => execute(i));
      item.addEventListener("pointermove", () => {
        if (selected !== i) { selected = i; highlight(); }
      });
      list.appendChild(item);
    });
  };

  const highlight = () => {
    list.querySelectorAll(".cmdk__item").forEach((el, i) => {
      el.classList.toggle("is-selected", i === selected);
      el.setAttribute("aria-selected", String(i === selected));
      if (i === selected) el.scrollIntoView({ block: "nearest" });
    });
  };

  const openMenu = () => {
    lastFocus = document.activeElement;
    input.value = "";
    selected = 0;
    render();
    root.classList.add("is-open");
    setTimeout(() => input.focus(), 50);
  };

  const closeMenu = () => {
    root.classList.remove("is-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  const execute = (i) => {
    const cmd = filtered[i];
    if (!cmd) return;
    closeMenu();
    setTimeout(cmd.run, 120);
  };

  input.addEventListener("input", () => { selected = 0; render(); });

  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); selected = (selected + 1) % filtered.length; highlight(); }
    if (e.key === "ArrowUp") { e.preventDefault(); selected = (selected - 1 + filtered.length) % filtered.length; highlight(); }
    if (e.key === "Enter") { e.preventDefault(); execute(selected); }
  });

  root.addEventListener("click", (e) => { if (e.target === root) closeMenu(); });

  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      root.classList.contains("is-open") ? closeMenu() : openMenu();
    }
    if (e.key === "Escape" && root.classList.contains("is-open")) closeMenu();
  });

  document.querySelectorAll("[data-cmdk-open]").forEach((btn) => btn.addEventListener("click", openMenu));

  /* Show ⌘ on Mac, Ctrl elsewhere */
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  document.querySelectorAll("[data-cmdk-key]").forEach((el) => { el.textContent = isMac ? "⌘K" : "Ctrl K"; });
})();
