/* ============================================================
   STACKLY - Complete Site Interactions & Dashboard Engine
   ============================================================ */

(function () {
  "use strict";

  /* ============ UTILITY ============ */
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => [...(c || document).querySelectorAll(s)];
  const getLS = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const setLS = (k, v) => { try { localStorage.setItem(k, v); } catch {} };

  /* ============ NAV SCROLL ============ */
  const nav = $(".nav");
  const onScroll = () => nav && nav.classList.toggle("scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ============ MOBILE MENU ============ */
  const toggle = $(".menu-toggle");
  const links = $(".nav-links");
  if (toggle) {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("open");
      links.classList.toggle("open");
    });
    // Close on link click
    links && $$("a", links).forEach((a) => a.addEventListener("click", () => {
      toggle.classList.remove("open");
      links.classList.remove("open");
    }));
  }

  /* ============ ACTIVE NAV LINK ============ */
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  $$(".nav-links a").forEach((a) => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === path || (path === "" && href === "index.html")) a.classList.add("active");
  });

  /* ============ SCROLL REVEAL ============ */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          revealObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  $$("[data-anim]").forEach((el) => revealObserver.observe(el));

  /* ============ FAQ ACCORDION ============ */
  $$(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    if (!q) return;
    q.addEventListener("click", () => {
      $$(".faq-item.open").forEach((o) => { if (o !== item) o.classList.remove("open"); });
      item.classList.toggle("open");
    });
  });

  /* ============ COUNTER ANIMATION ============ */
  const counters = $$("[data-count]");
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const dur = 1600;
        const start = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - start) / dur);
          const v = target * (1 - Math.pow(1 - p, 3));
          el.textContent = (target % 1 ? v.toFixed(target < 1 ? 2 : 1) : Math.floor(v)).toLocaleString() + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );
  counters.forEach((c) => counterObserver.observe(c));

  /* ============ LIVE TICKER SIMULATION ============ */
  const tickerSymbols = {};
  $$("[data-ticker]").forEach((el) => {
    const base = parseFloat(el.dataset.ticker);
    tickerSymbols[el.dataset.ticker] = { el, base, cur: base };
  });
  setInterval(() => {
    Object.values(tickerSymbols).forEach(({ el, base }) => {
      const cur = parseFloat(el.textContent) || base;
      const newVal = cur + (Math.random() - 0.48) * base * 0.002;
      el.textContent = newVal.toFixed(2);
      const chg = el.parentElement && el.parentElement.querySelector(".tk-chg");
      if (chg) {
        const diff = ((newVal - base) / base * 100);
        chg.textContent = (diff >= 0 ? "+" : "") + diff.toFixed(2) + "%";
        chg.className = "tk-chg " + (diff >= 0 ? "up" : "down");
      }
    });
  }, 2200);

  /* ============ CONTACT FORM ============ */
  const contactForm = $(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector("button[type=submit]");
      if (!btn) return;
      btn.textContent = "Sending...";
      setTimeout(() => {
        btn.textContent = "Message Sent \u2713";
        contactForm.reset();
        setTimeout(() => (btn.textContent = "Send Message"), 2500);
      }, 900);
    });
  }

  /* ============ DASHBOARD SEARCH ============ */
  const searchInput = $(".dash-search input");
  const searchResults = $(".search-results");
  if (searchInput && searchResults) {
    const symbols = [
      { sym: "AAPL", name: "Apple Inc.", price: "232.84", chg: "+1.42%" },
      { sym: "MSFT", name: "Microsoft Corp.", price: "448.12", chg: "+0.84%" },
      { sym: "NVDA", name: "NVIDIA Corp.", price: "138.27", chg: "+2.31%" },
      { sym: "TSLA", name: "Tesla Inc.", price: "244.50", chg: "-0.62%" },
      { sym: "GOOG", name: "Alphabet Inc.", price: "172.91", chg: "+0.41%" },
      { sym: "AMZN", name: "Amazon.com Inc.", price: "198.35", chg: "+1.12%" },
      { sym: "META", name: "Meta Platforms", price: "512.40", chg: "+1.85%" },
      { sym: "JPM", name: "JPMorgan Chase", price: "198.76", chg: "+0.33%" },
      { sym: "V", name: "Visa Inc.", price: "275.60", chg: "+0.52%" },
      { sym: "AMD", name: "Advanced Micro Devices", price: "162.88", chg: "+3.21%" },
    ];
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim().toUpperCase();
      if (!q) { searchResults.classList.remove("show"); return; }
      const matches = symbols.filter(
        (s) => s.sym.includes(q) || s.name.toUpperCase().includes(q)
      ).slice(0, 6);
      if (!matches.length) { searchResults.classList.remove("show"); return; }
      searchResults.innerHTML = matches
        .map(
          (m) =>
            `<div class="sr-item" data-sym="${m.sym}">
              <div><div class="sym">${m.sym}</div><div class="name">${m.name}</div></div>
              <div><div class="price">$${m.price}</div><div class="name" style="color:${m.chg.startsWith("+") ? "#1c8d5d" : "#c14242"}">${m.chg}</div></div>
            </div>`
        )
        .join("");
      searchResults.classList.add("show");
      $$(".sr-item", searchResults).forEach((item) => {
        item.addEventListener("click", () => {
          searchInput.value = item.dataset.sym;
          searchResults.classList.remove("show");
        });
      });
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".dash-search")) searchResults.classList.remove("show");
    });
  }

  /* ============ DASHBOARD TAB SWITCHING ============ */
  function setupDashboardTabs() {
    const navLinks = $$(".dash-nav a");
    const tabs = $$(".dash-tab");
    if (!navLinks.length || !tabs.length) return;

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = link.dataset.tab || link.textContent.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
        navLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
        tabs.forEach((t) => {
          t.classList.toggle("active", t.id === "tab-" + target || t.dataset.tab === target);
        });
        // Update crumbs
        const crumbs = $(".dash-top .crumbs b");
        if (crumbs) crumbs.textContent = link.textContent.trim().replace(/[^a-zA-Z0-9 ]/g, "");
        // Update heading
        const h1 = $(".dash-head h1");
        const activeTab = $(".dash-tab.active");
        if (h1 && activeTab) {
          const heading = activeTab.dataset.heading;
          if (heading) {
            const name = link.textContent.trim();
            h1.innerHTML = heading;
            // Update breadcrumb
            if (crumbs) crumbs.textContent = name.charAt(0).toUpperCase() + name.slice(1);
          }
        }
      });
    });
  }
  setupDashboardTabs();

  /* ============ DASHBOARD SIDEBAR ============ */
  const menuBtn = $(".dash-menu-btn");
  const side = $(".dash-side");
  const overlay = $(".dash-side-overlay");
  if (menuBtn && side) {
    const closeSide = () => { side.classList.remove("open"); overlay && overlay.classList.remove("show"); };
    menuBtn.addEventListener("click", () => { side.classList.toggle("open"); overlay && overlay.classList.toggle("show"); });
    overlay && overlay.addEventListener("click", closeSide);
  }

  /* ============ DASHBOARD LOGOUT ============ */
  const logoutBtn = $("#dash-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      try { localStorage.removeItem("stackly_user"); } catch {}
      location.href = "login.html";
    });
  }

  /* ============ DASHBOARD USER HYDRATION ============ */
  try {
    const raw = getLS("stackly_user");
    if (raw) {
      const u = JSON.parse(raw);
      const nameEl = $("#dash-username");
      const nameEl2 = $("#dash-username2");
      const initEl = $("#dash-initial");
      const uname = u.email ? u.email.split("@")[0] : "Trader";
      if (nameEl) nameEl.textContent = uname;
      if (nameEl2) nameEl2.textContent = uname;
      if (initEl) initEl.textContent = uname.charAt(0).toUpperCase();
    }
  } catch {}

  /* ============ CHIP TOGGLE ============ */
  $$(".chip-row").forEach((row) => {
    $$(".chip", row).forEach((c) => {
      c.addEventListener("click", () => {
        $$(".chip", row).forEach((x) => x.classList.remove("on"));
        c.classList.add("on");
      });
    });
  });

  /* ============ TOGGLE SWITCHES ============ */
  $$(".toggle-switch").forEach((t) => {
    t.addEventListener("click", () => t.classList.toggle("on"));
  });

  /* ============ TOAST NOTIFICATIONS ============ */
  window.showToast = function (message, type) {
    type = type || "info";
    const container = $(".toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "toast " + type;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("out");
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  };

  /* ============ MODAL ============ */
  window.openModal = function (id) {
    const overlay = $(".modal-overlay" + (id ? "[data-modal='" + id + "']" : ""));
    if (overlay) overlay.classList.add("show");
  };
  window.closeModal = function (overlay) {
    overlay = overlay || $(".modal-overlay.show");
    if (overlay) overlay.classList.remove("show");
  };
  $$(".modal-overlay").forEach((o) => {
    o.addEventListener("click", (e) => {
      if (e.target === o) o.classList.remove("show");
    });
  });
  $$(".modal-close").forEach((b) => {
    b.addEventListener("click", () => {
      const o = b.closest(".modal-overlay");
      if (o) o.classList.remove("show");
    });
  });

  /* ============ DASHBOARD WATCHLIST LIVE UPDATE ============ */
  function updateWatchlist() {
    const watchRows = $$("#tab-watchlist .dash-list .row, #tab-overview .dash-list .row");
    if (!watchRows.length) return;
    watchRows.forEach((row) => {
      const valEl = row.querySelector(".val");
      if (!valEl) return;
      const baseText = valEl.textContent.trim();
      const priceMatch = baseText.match(/[\d.]+/);
      if (!priceMatch) return;
      const base = parseFloat(priceMatch[0]);
      if (!base) return;
      const newPrice = base + (Math.random() - 0.48) * base * 0.003;
      const diff = ((newPrice - base) / base * 100);
      const sub = valEl.querySelector(".sub");
      if (sub) {
        sub.textContent = (diff >= 0 ? "+" : "") + diff.toFixed(2) + "%";
        sub.style.color = diff >= 0 ? "#1c8d5d" : "#c14242";
      }
      valEl.childNodes[0].textContent = newPrice.toFixed(2);
    });
  }
  setInterval(updateWatchlist, 4000);

  /* ============ AUTH ============ */
  // Role selector
  const roleSelect = $(".role-select");
  if (roleSelect) {
    const trigger = roleSelect.querySelector(".role-trigger");
    const label = roleSelect.querySelector(".role-label");
    const hidden = roleSelect.querySelector("input[name=role]");
    trigger && trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      roleSelect.classList.toggle("open");
    });
    $$(".role-opt", roleSelect).forEach((o) => {
      o.addEventListener("click", () => {
        const v = o.dataset.role;
        if (hidden) hidden.value = v;
        if (label) {
          label.textContent = v.charAt(0).toUpperCase() + v.slice(1);
          label.classList.remove("placeholder");
        }
        roleSelect.classList.remove("open");
      });
    });
    document.addEventListener("click", () => roleSelect.classList.remove("open"));
  }

  // Login form
  const loginForm = $("#login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = $("#auth-msg");
      const data = new FormData(loginForm);
      const role = data.get("role");
      const email = data.get("email");
      const pw = data.get("password");
      if (!role) { if (msg) { msg.className = "auth-msg err show"; msg.textContent = "Please choose a role to continue."; } return; }
      if (!email || !pw) { if (msg) { msg.className = "auth-msg err show"; msg.textContent = "Email and password are required."; } return; }
      if (msg) { msg.className = "auth-msg ok show"; msg.textContent = "Signed in. Redirecting\u2026"; }
      try { localStorage.setItem("stackly_user", JSON.stringify({ email, role })); } catch {}
      setTimeout(() => { location.href = role === "admin" ? "admin-dashboard.html" : "user-dashboard.html"; }, 700);
    });
  }

  // Forgot password
  const forgotLink = $("#forgot-link");
  const backLogin = $("#back-login");
  const loginPanel = $("#login-panel");
  const forgotPanel = $("#forgot-panel");
  if (forgotLink) {
    forgotLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (loginPanel) loginPanel.style.display = "none";
      if (forgotPanel) forgotPanel.classList.add("active");
    });
    backLogin && backLogin.addEventListener("click", (e) => {
      e.preventDefault();
      if (forgotPanel) forgotPanel.classList.remove("active");
      if (loginPanel) loginPanel.style.display = "block";
    });
    const forgotForm = $("#forgot-form");
    forgotForm && forgotForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const m = $("#forgot-msg");
      if (m) { m.className = "auth-msg ok show"; m.textContent = "If that email exists, a recovery link was sent."; }
    });
  }

  /* ============ RYZA-STYLE ANIMATION ENHANCEMENTS ============ */
  if (!window.matchMedia || !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // Auto-tag elements
    const autoTargets = [
      { sel: "section", anim: "up" },
      { sel: ".card, .stat-card, .panel, .blog-card, .testi", anim: "zoom" },
      { sel: "h1, h2", anim: "up" },
    ];
    autoTargets.forEach(({ sel, anim }) => {
      $$(sel).forEach((el) => {
        if (!el.hasAttribute("data-anim")) el.setAttribute("data-anim", anim);
      });
    });

    // Stagger cards
    $$(".dash-grid, .grid").forEach((group) => {
      [...group.children].slice(0, 8).forEach((c, i) => {
        if (c.hasAttribute("data-anim") && !c.hasAttribute("data-delay"))
          c.setAttribute("data-delay", String((i % 6) + 1));
      });
    });

    // Re-observe newly tagged
    $$("[data-anim]:not(.in)").forEach((el) => revealObserver.observe(el));

    // Ripple effect
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn");
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const span = document.createElement("span");
      span.className = "ripple";
      const size = Math.max(rect.width, rect.height);
      span.style.width = span.style.height = size + "px";
      span.style.left = e.clientX - rect.left - size / 2 + "px";
      span.style.top = e.clientY - rect.top - size / 2 + "px";
      btn.appendChild(span);
      setTimeout(() => span.remove(), 700);
    });

    // Parallax
    const parallaxEls = $$("[data-parallax], .hero img");
    if (parallaxEls.length) {
      let ticking = false;
      const onParallax = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          parallaxEls.forEach((el) => {
            const speed = parseFloat(el.dataset.parallax || "0.08");
            el.style.transform = "translate3d(0, " + (-y * speed).toFixed(1) + "px, 0)";
          });
          ticking = false;
        });
      };
      window.addEventListener("scroll", onParallax, { passive: true });
    }

    // Card tilt
    if (window.matchMedia("(hover:hover) and (min-width: 900px)").matches) {
      $$(".stat-card, .panel").forEach((card) => {
        card.addEventListener("mousemove", (e) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform =
            "translateY(-6px) rotateX(" + (-py * 4).toFixed(2) + "deg) rotateY(" + (px * 5).toFixed(2) + "deg)";
        });
        card.addEventListener("mouseleave", () => { card.style.transform = ""; });
      });
    }

    // Animate allocation bars
    setTimeout(() => {
      $$(".alloc-bar .seg").forEach((seg) => {
        const w = seg.dataset.width || seg.style.width;
        seg.style.width = "0%";
        setTimeout(() => { seg.style.width = w; }, 100);
      });
    }, 500);
  }

  console.log("STACKLY - All systems nominal \u2713");
})();
