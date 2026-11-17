(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     Content from clinic-data.md
     ------------------------------------------------------------------ */

  const DIRECTIONS = {
    therapy: {
      label: "Терапия",
      desc: "Лечение кариеса, пульпита и периодонтита, эстетическая реставрация и профилактика на современном оборудовании.",
      items: [
        ["Лечение кариеса", "от 8 500 ₽"],
        ["Лечение клиновидного дефекта", "7 500 ₽"],
        ["Лечение пульпита 1-канального зуба", "16 500 ₽"],
        ["Лечение пульпита 2-канального зуба", "19 500 ₽"],
        ["Лечение пульпита 3-канального зуба", "23 500 ₽"],
        ["Лечение пульпита 4-канального зуба", "26 500 ₽"],
        ["Художественная реставрация (восстановление зуба)", "от 12 000 ₽"],
      ],
    },
    hygiene: {
      label: "Гигиена и отбеливание",
      desc: "Ультразвуковая чистка, Air Flow, полировка и фторирование. Отбеливание ZOOM с закреплением результата.",
      items: [
        ["Комплексная гигиена", "от 8 500 ₽"],
        ["Комплексная гигиена с брекетами", "от 10 500 ₽"],
        ["Отбеливание «ZOOM»", "40 000 ₽"],
      ],
    },
    aesthetic: {
      label: "Виниры",
      desc: "Композитные и керамические виниры для естественной формы и эстетики передних зубов.",
      items: [
        ["Композитные виниры (Япония, СИА)", "16 500 ₽"],
        ["Керамические виниры (e.max)", "от 35 000 ₽"],
      ],
    },
    prosthetics: {
      label: "Ортопедия",
      desc: "Коронки из металлокерамики и диоксида циркония, съёмные протезы и восстановление жевательной функции.",
      items: [
        ["Коронка из металлокерамики", "от 20 000 ₽"],
        ["Коронка из диоксида циркония", "от 28 000 ₽"],
        ["Съёмные протезы", "от 45 000 ₽"],
      ],
    },
    surgery: {
      label: "Хирургия и имплантация",
      desc: "Удаление зубов, имплантация Dentium и Straumann, костная пластика и лечение воспалений челюстно-лицевой области.",
      items: [
        ["Удаление зуба", "от 6 500 ₽"],
        ["Удаление зуба мудрости", "от 8 500 ₽"],
        ["Удаление ретинированного / дистопированного зуба", "11 500 – 15 000 ₽"],
        ["Имплантация Dentium", "45 000 ₽"],
        ["Имплантация Straumann", "70 000 ₽"],
        ["Металлокерамическая коронка на имплантат", "35 000 ₽"],
        ["Циркониевая коронка на имплантат", "45 000 ₽"],
      ],
    },
    orthodontics: {
      label: "Ортодонтия",
      desc: "Брекет-системы и прозрачные элайнеры. Исправление прикуса улучшает жевательную функцию и дикцию.",
      items: [
        ["Металлические брекеты, этап установки (США)", "160 000 ₽ + 6 500 ₽ × 12 мес."],
        ["Лечение на элайнерах", "от 350 000 ₽"],
      ],
    },
  };

  const ORDER = ["therapy", "hygiene", "aesthetic", "prosthetics", "surgery", "orthodontics"];

  const CONTACTS = {
    wa: "https://wa.me/79255147828?text=",
    tg: "https://t.me/+79255147828",
    vk: "https://vk.com/search?c%5Bq%5D=%D0%A0.%D0%98.%20%D0%9A%D0%BB%D0%B8%D0%BD%D0%B8%D0%BA&c%5Bsection%5D=communities",
    phone: "tel:+74991109101",
  };

  const normalize = (value) => value.toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ").trim();

  /* ------------------------------------------------------------------
     Header
     ------------------------------------------------------------------ */

  const header = $("[data-header]");
  const onScroll = () => header && header.classList.toggle("is-stuck", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const navLinks = $$(".nav a[href^='#']");
  if (navLinks.length && "IntersectionObserver" in window) {
    const sections = navLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) =>
            link.setAttribute("aria-current", link.getAttribute("href") === `#${entry.target.id}` ? "page" : "false")
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((section) => spy.observe(section));
  }

  /* ------------------------------------------------------------------
     Mobile drawer
     ------------------------------------------------------------------ */

  const drawer = $("[data-drawer]");
  const drawerPanel = drawer ? $(".drawer__panel", drawer) : null;
  const drawerTrigger = $("[data-menu-open]");
  let lastFocus = null;

  function setDrawer(open) {
    if (!drawer) return;
    document.body.classList.toggle("is-menu-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    drawerTrigger?.setAttribute("aria-expanded", String(open));
    if (drawerPanel) drawerPanel.inert = !open;
    if (open) {
      lastFocus = document.activeElement;
      drawerPanel?.focus({ preventScroll: true });
    } else if (lastFocus) {
      lastFocus.focus();
    }
  }

  drawerTrigger?.addEventListener("click", () => setDrawer(true));
  $$("[data-menu-close]", drawer || document).forEach((el) => el.addEventListener("click", () => setDrawer(false)));
  $$(".drawer__nav a, .drawer__contact a", drawer || document).forEach((a) =>
    a.addEventListener("click", () => setDrawer(false))
  );
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("is-menu-open")) setDrawer(false);
  });

  /* ------------------------------------------------------------------
     Reveal + counters
     ------------------------------------------------------------------ */

  const revealItems = $$("[data-reveal]");
  if (revealItems.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      revealItems.forEach((el) => el.classList.add("is-in"));
    } else {
      $$(".section, .hero").forEach((section) => {
        $$("[data-reveal]", section).forEach((el, index) => el.style.setProperty("--i", String(index % 4)));
      });
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -8% 0px" }
      );
      revealItems.forEach((el) => io.observe(el));
    }
  }

  const counters = $$("[data-count]");
  if (counters.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      counters.forEach((el) => (el.textContent = `${el.dataset.count}${el.dataset.suffix || ""}`));
    } else {
      const countIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = Number(el.dataset.count);
            const suffix = el.dataset.suffix || "";
            const start = performance.now();
            const duration = 1200;
            const finish = () => (el.textContent = `${target}${suffix}`);
            const tick = (now) => {
              const progress = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = `${Math.round(target * eased)}${suffix}`;
              if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            setTimeout(finish, duration + 400);
            countIo.unobserve(el);
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((el) => countIo.observe(el));
    }
  }

  /* ------------------------------------------------------------------
     Before / after sliders
     ------------------------------------------------------------------ */

  $$("[data-compare]").forEach((box) => {
    const range = $(".ba-slider__range", box);
    if (!range) return;
    const sync = () => box.style.setProperty("--pos", `${range.value}%`);
    range.addEventListener("input", sync);
    sync();
  });

  /* ------------------------------------------------------------------
     Directions carousel
     ------------------------------------------------------------------ */

  const carousel = $("[data-carousel]");
  if (carousel) {
    const prev = $("[data-carousel-prev]");
    const next = $("[data-carousel-next]");
    const step = () => {
      const card = $(".direction-card", carousel);
      return card ? card.getBoundingClientRect().width + 16 : 320;
    };
    const update = () => {
      const max = carousel.scrollWidth - carousel.clientWidth - 2;
      if (prev) prev.disabled = carousel.scrollLeft <= 2;
      if (next) next.disabled = carousel.scrollLeft >= max;
    };
    prev?.addEventListener("click", () => carousel.scrollBy({ left: -step(), behavior: reduce ? "auto" : "smooth" }));
    next?.addEventListener("click", () => carousel.scrollBy({ left: step(), behavior: reduce ? "auto" : "smooth" }));
    carousel.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ------------------------------------------------------------------
     Doctors carousel
     ------------------------------------------------------------------ */

  const doctorCarousel = $("[data-doctors-carousel]");
  if (doctorCarousel) {
    const prev = $("[data-doctors-prev]");
    const next = $("[data-doctors-next]");
    const step = () => {
      const card = $(".doctor", doctorCarousel);
      return card ? card.getBoundingClientRect().width + 14 : 334;
    };
    const update = () => {
      const max = doctorCarousel.scrollWidth - doctorCarousel.clientWidth - 2;
      if (prev) prev.disabled = doctorCarousel.scrollLeft <= 2;
      if (next) next.disabled = doctorCarousel.scrollLeft >= max;
    };
    prev?.addEventListener("click", () => doctorCarousel.scrollBy({ left: -step(), behavior: reduce ? "auto" : "smooth" }));
    next?.addEventListener("click", () => doctorCarousel.scrollBy({ left: step(), behavior: reduce ? "auto" : "smooth" }));
    doctorCarousel.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ------------------------------------------------------------------
     Prices: tabs, live search, rows
     ------------------------------------------------------------------ */

  const tabsRoot = $("[data-tabs]");
  const panelsRoot = $("[data-panels]");
  const search = $("[data-price-search]");
  const searchClear = $("[data-search-clear]");
  let activeTab = "therapy";

  const esc = (value) =>
    String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  function buildPrices() {
    if (!tabsRoot || !panelsRoot) return;
    tabsRoot.innerHTML = ORDER.map(
      (key, index) =>
        `<button class="tab" type="button" role="tab" id="tab-${key}" aria-controls="panel-${key}" aria-selected="${key === activeTab}" tabindex="${key === activeTab ? 0 : -1}">${DIRECTIONS[key].label}</button>`
    ).join("");
    panelsRoot.innerHTML = ORDER.map(
      (key) =>
        `<div class="panel" role="tabpanel" id="panel-${key}" aria-labelledby="tab-${key}" ${key === activeTab ? "" : "hidden"}></div>`
    ).join("");
  }

  function priceRow(name, price) {
    return `<div class="price-row">
      <span class="price-row__name">${esc(name)}</span>
      <span class="price-row__price">${esc(price)}</span>
      <button class="price-row__btn" type="button" data-book data-service="${esc(name)}">Записаться <span aria-hidden="true">→</span></button>
    </div>`;
  }

  function fillPanels(query = "") {
    const q = normalize(query);
    let firstMatch = "";
    ORDER.forEach((key) => {
      const panel = document.getElementById(`panel-${key}`);
      if (!panel) return;
      const matches = DIRECTIONS[key].items.filter(([name]) => !q || normalize(name).includes(q));
      if (matches.length && !firstMatch) firstMatch = key;
      if (!matches.length) {
        panel.innerHTML = `<div class="price-empty">По запросу «${esc(query)}» в этом разделе ничего не нашлось.</div>`;
        return;
      }
      panel.innerHTML =
        `<div class="price-list">${matches.map(([name, price]) => priceRow(name, price)).join("")}</div>` +
        (q ? `<p class="price-count">Найдено: ${matches.length}</p>` : "");
    });
    if (q && firstMatch) activateTab(firstMatch, true);
  }

  function activateTab(key, focus = false) {
    if (!tabsRoot) return;
    activeTab = key;
    ORDER.forEach((name) => {
      const tab = document.getElementById(`tab-${name}`);
      const panel = document.getElementById(`panel-${name}`);
      if (!tab || !panel) return;
      const isActive = name === key;
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
      panel.hidden = !isActive;
      if (isActive && focus) tab.focus({ preventScroll: true });
    });
  }

  buildPrices();
  fillPanels();

  tabsRoot?.addEventListener("click", (event) => {
    const tab = event.target.closest(".tab");
    if (!tab) return;
    activateTab(tab.id.replace("tab-", ""));
    if (search && normalize(search.textContent)) {
      search.textContent = "";
      searchClear && (searchClear.hidden = true);
      fillPanels();
    }
  });

  tabsRoot?.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = ORDER.indexOf(activeTab);
    let index = current;
    if (event.key === "ArrowLeft") index = (current - 1 + ORDER.length) % ORDER.length;
    if (event.key === "ArrowRight") index = (current + 1) % ORDER.length;
    if (event.key === "Home") index = 0;
    if (event.key === "End") index = ORDER.length - 1;
    activateTab(ORDER[index], true);
  });

  function runSearch() {
    if (!search) return;
    const query = normalize(search.textContent);
    if (searchClear) searchClear.hidden = !query;
    fillPanels(query);
  }

  search?.addEventListener("input", runSearch);
  search?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") event.preventDefault();
  });
  searchClear?.addEventListener("click", () => {
    if (!search) return;
    search.textContent = "";
    search.focus();
    runSearch();
  });

  /* ------------------------------------------------------------------
     Dialogs
     ------------------------------------------------------------------ */

  const bookingDialog = $("#booking-dialog");
  const directionDialog = $("#direction-dialog");
  const galleryDialog = $("#gallery-dialog");
  const bookingContext = $("#booking-context");
  const bookingWa = $("#booking-wa");
  const bookingPhone = $("#booking-phone");
  const directionTitle = $("#direction-title");
  const directionDesc = $("#direction-desc");
  const directionList = $("#direction-list");
  const directionBook = $("#direction-book");
  let directionKey = "therapy";
  let lastDialogTrigger = null;

  function syncModalState() {
    const anyOpen = $$("dialog[open]").length > 0;
    document.body.classList.toggle("is-modal-open", anyOpen);
  }

  function openDialog(dialog, trigger) {
    if (!dialog) return;
    lastDialogTrigger = trigger || document.activeElement;
    dialog.showModal();
    $(".modal__panel", dialog)?.focus({ preventScroll: true });
    syncModalState();
  }

  function closeDialog(dialog) {
    if (dialog?.open) dialog.close();
  }

  $$("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      const panel = $(".modal__panel", dialog);
      if (panel && !panel.contains(event.target)) dialog.close();
    });
    dialog.addEventListener("close", syncModalState);
    $$("[data-close]", dialog).forEach((btn) => btn.addEventListener("click", () => dialog.close()));
  });

  function bookingMessage(state) {
    let message = "Здравствуйте! Хочу записаться в Ri.Клинику";
    if (state.service) message += ` на «${state.service}»`;
    if (state.doctor) message += ` к врачу ${state.doctor}`;
    return `${message}. Подскажите, пожалуйста, свободное время.`;
  }

  function openBooking({ service = "", doctor = "" } = {}) {
    if (bookingContext) {
      if (service || doctor) {
        const parts = [];
        if (service) parts.push(`направление <strong>${esc(service)}</strong>`);
        if (doctor) parts.push(`врач <strong>${esc(doctor)}</strong>`);
        bookingContext.innerHTML = `Вы выбрали ${parts.join(", ")}. Отправьте готовое сообщение или позвоните — администратор ответит ежедневно с 10:00 до 20:00.`;
      } else {
        bookingContext.textContent =
          "Выберите удобный способ связи — администратор клиники ответит ежедневно с 10:00 до 20:00.";
      }
    }
    if (bookingWa) bookingWa.href = CONTACTS.wa + encodeURIComponent(bookingMessage({ service, doctor }));
    if (bookingPhone) bookingPhone.href = CONTACTS.phone;
    openDialog(bookingDialog);
  }

  function openDirection(key, trigger) {
    const data = DIRECTIONS[key];
    if (!data) return;
    directionKey = key;
    if (directionTitle) directionTitle.textContent = data.label;
    if (directionDesc) directionDesc.textContent = data.desc;
    if (directionList) {
      directionList.innerHTML = data.items
        .map(
          ([name, price]) =>
            `<div class="direction-item"><span>${esc(name)}</span><strong>${esc(price)}</strong></div>`
        )
        .join("");
    }
    openDialog(directionDialog, trigger);
  }

  $$(".direction-card").forEach((card) => {
    card.addEventListener("click", () => openDirection(card.dataset.direction, card));
  });

  directionBook?.addEventListener("click", () => {
    const label = DIRECTIONS[directionKey]?.label || "";
    closeDialog(directionDialog);
    openBooking({ service: label });
  });

  $$("[data-gallery]").forEach((button) =>
    button.addEventListener("click", () => openDialog(galleryDialog, button))
  );

  /* ------------------------------------------------------------------
     Doctors: expand + book
     ------------------------------------------------------------------ */

  $$(".doctor").forEach((card) => {
    const toggle = () => {
      const open = card.classList.toggle("is-open");
      card.setAttribute("aria-expanded", String(open));
      if (open) {
        requestAnimationFrame(() =>
          card.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest", inline: "center" })
        );
      }
    };
    card.addEventListener("click", (event) => {
      if (event.target.closest("[data-book]")) return;
      toggle();
    });
    card.addEventListener("keydown", (event) => {
      if (event.target.closest("[data-book]")) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggle();
      }
    });
  });

  /* ------------------------------------------------------------------
     Booking delegation + copy + toast
     ------------------------------------------------------------------ */

  let toastTimer = null;
  const toast = $("[data-toast]");
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-in");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-in"), 2400);
  }

  document.addEventListener("click", async (event) => {
    const copyBtn = event.target.closest("[data-copy]");
    if (copyBtn) {
      const value = copyBtn.dataset.copy || "";
      try {
        await navigator.clipboard.writeText(value);
        showToast("Номер скопирован");
      } catch {
        const helper = document.createElement("textarea");
        helper.value = value;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.appendChild(helper);
        helper.select();
        try {
          document.execCommand("copy");
          showToast("Номер скопирован");
        } catch {
          showToast("Не удалось скопировать номер");
        }
        helper.remove();
      }
      return;
    }

    const bookBtn = event.target.closest("[data-book]");
    if (bookBtn) {
      event.preventDefault();
      if (document.body.classList.contains("is-menu-open")) setDrawer(false);
      openBooking({ service: bookBtn.dataset.service || "", doctor: bookBtn.dataset.doctor || "" });
    }
  });

  /* ------------------------------------------------------------------
     Restore focus after closing a dialog
     ------------------------------------------------------------------ */

  $$("dialog").forEach((dialog) => {
    dialog.addEventListener("close", () => {
      if (lastDialogTrigger && document.contains(lastDialogTrigger)) {
        lastDialogTrigger.focus({ preventScroll: true });
      }
      lastDialogTrigger = null;
    });
  });
})();
