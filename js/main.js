document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
  initSmoothScroll();
  initAnchorScroll();
  initScrollProgress();
  initMagneticLinks();
  initAmbientParallax();
  initRoomVideoParallax();
  initQuoteModal();
  initQuoteCarousel();
});

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

function initSmoothScroll() {
  if (prefersReducedMotion() || typeof Lenis === "undefined") return;

  const lenis = new Lenis({
    duration: 1.1, // higher = slower, gentler stop
    easing: (t) => 1 - Math.pow(1 - t, 3), // ease-out cubic
    smoothWheel: true,
    syncTouch: false, // keep native touch scrolling on mobile
    autoRaf: true,
  });

  window.__lenis = lenis; // handy hook if you add more scroll-synced effects later
}

function initAnchorScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  if (!links.length) return;

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();

      if (window.__lenis && !prefersReducedMotion()) {
        window.__lenis.scrollTo(target, { offset: 0, duration: 1.25 });
      } else {
        target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
      }

      history.pushState(null, "", href);
    });
  });
}


function initScrollProgress() {
  const bar = document.querySelector(".scroll-progress span");
  if (!bar) return;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    bar.style.height = `${Math.min(1, Math.max(0, progress)) * 100}%`;
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function initMagneticLinks() {
  if (prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
  const links = document.querySelectorAll(".site-header a, .hero__scroll, .btn, .footer__social a");
  links.forEach((link) => {
    link.addEventListener("pointermove", (event) => {
      const rect = link.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - .5) * 8;
      const y = ((event.clientY - rect.top) / rect.height - .5) * 5;
      link.style.transform = `translate(${x}px, ${y}px)`;
    });
    link.addEventListener("pointerleave", () => { link.style.transform = ""; });
  });
}


function initAmbientParallax() {
  if (prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
  const bg = document.querySelector(".ambient-bg");
  if (!bg) return;
  let raf = 0;
  let px = 0, py = 0;
  const render = () => {
    raf = 0;
    bg.style.setProperty("--pointer-x", `${px * 10}px`);
    bg.style.setProperty("--pointer-y", `${py * 8}px`);
  };
  window.addEventListener("pointermove", (event) => {
    px = event.clientX / window.innerWidth - .5;
    py = event.clientY / window.innerHeight - .5;
    if (!raf) raf = requestAnimationFrame(render);
  }, { passive: true });
}





function initRoomVideoParallax() {
  const media = document.querySelector('.room-page .room-video-card__media');
  if (!media || prefersReducedMotion()) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const reset = () => {
    media.classList.remove('is-parallax');
    media.style.setProperty('--video-tilt-x', '0deg');
    media.style.setProperty('--video-tilt-y', '0deg');
    media.style.setProperty('--video-shift-x', '0px');
    media.style.setProperty('--video-shift-y', '0px');
  };

  media.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    const rect = media.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    media.classList.add('is-parallax');
    media.style.setProperty('--video-tilt-x', `${x * 4.5}deg`);
    media.style.setProperty('--video-tilt-y', `${y * -4.5}deg`);
    media.style.setProperty('--video-shift-x', `${x * 5}px`);
    media.style.setProperty('--video-shift-y', `${y * 5}px`);
  }, { passive: true });

  media.addEventListener('pointerleave', reset);
}

function initQuoteModal() {
  const modal = document.querySelector("#quote-modal");
  const cards = document.querySelectorAll(".quote-card[data-quote]");
  if (!modal || !cards.length) return;

  const getQuoteEntries = () => {
    const lang = document.documentElement.lang === "en" ? "en" : "ar";
    if (lang === "en") {
      return [
        { label: "01 / The Hanging Tree", title: "The Hanging Tree", body: "The universe seemed to carve itself out of the dark; white light moved quietly through its limbs, and the stars faded one by one in a solemn silence, as if guarding a cosmic secret. At the heart of that vastness stood a hanging tree, touched by light—not only to protect it, but to bear witness that it was alive, as though the universe were remembering itself after forgetting everything.\n\n— Mohamed Ahmed" },
        { label: "02 / Tree", title: "Tree", body: "The world is a hanging tree, its branches reaching downward, letting go of whatever has ripened. I am that tree, and the tree is me.\n\n— Mohamed Ahmed" },
        { label: "03 / Flower", title: "Flower", body: "The art we take in today would be pure pain to those who came before us.\n\n— Mohamed Ahmed" },
        { label: "04 / Vincent’s Abyss", title: "Vincent’s Abyss", body: "One day, Frida thought Vincent would take her by subway to a night full of stars. It was his favorite painting, yet it went beyond the stars themselves, the way Van Gogh saw them in his own mind. He found himself on the edge of falling into hell, and he lost one of his ears. That was the beginning of the fall.\n\n— Mohamed Ahmed" }
      ];
    }
    return [
      { label: "٠١ / شجرة معلقة", title: "شجرة معلقة", body: "كاد الكون ينحت في عتمته، تسلسل البياض أوصاله خفياً، تلاشت النجوم واحدة تلو الأخرى، في سكون مهيب، كأنه سر كوني. في قلب الاتساع شجرة معلقة، تسلل إليها نوراً، ليس فقط ليحميها بل ليشهد أنها تنبض بالحياة، كأنها ذاكرة الكون حين ينسى كل شيء.\n\n— محمد أحمد" },
      { label: "٠٢ / شجرة", title: "شجرة", body: "العالم شجرة معلقة، فروعها إلى أسفل، يتساقط منها ما استوى. أنا تلك الشجرة، والشجرة هي أنا.\n\n— محمد أحمد" },
      { label: "٠٣ / زهرة", title: "زهرة", body: "الفن الذي يُستنشق الآن هو ألم صافٍ لأولئك الذين سبقونا.\n\n— محمد أحمد" },
      { label: "٠٤ / هاوية فينسنت", title: "هاوية فينسنت", body: "يومًا ما، اعتقدت فريدا أن فينسنت سيأخذها بالمترو إلى ليلةٍ مليئة بالنجوم، كانت تلك لوحته المفضلة، لكنها تتعدى حدود النجوم، كما رسمها فان جوخ في حالته، فوجد نفسه على هاوية الوقوع في الجحيم، وسقطت إحدى أذنيه، وهذه كانت بداية السقوط.\n\n— محمد أحمد" }
    ];
  };

  const label = modal.querySelector("#quote-modal-label");
  const title = modal.querySelector("#quote-modal-title");
  const body = modal.querySelector("#quote-modal-body");
  const close = modal.querySelector("[data-quote-modal-close]");

  const openEntry = (card) => {
    const entry = getQuoteEntries()[Number(card.dataset.quote)];
    if (!entry) return;
    label.textContent = entry.label;
    title.textContent = entry.title;
    body.textContent = entry.body;
    modal.hidden = false;
    modal.classList.add("is-open");
    document.body.classList.add("quote-modal-open");
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.hidden = true;
    document.body.classList.remove("quote-modal-open");
  };

  cards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      if (card.closest(".quote-grid")?.dataset.dragged === "true") {
        card.closest(".quote-grid").dataset.dragged = "false";
        return;
      }
      openEntry(card);
    });
  });

  close?.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });
}

function initQuoteCarousel() {
  const grid = document.querySelector(".quote-grid");
  const indicator = document.querySelector('[data-carousel-indicator="quotes"]');
  if (!grid || !indicator) return;

  const cards = [...grid.querySelectorAll(".quote-card")];
  if (cards.length <= 3) {
    indicator.hidden = true;
    return;
  }

  grid.classList.add("is-carousel");
  const getVisibleCount = () => window.matchMedia("(max-width: 700px)").matches ? 1 : 3;
  const getStep = () => {
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(grid).columnGap || getComputedStyle(grid).gap || "0");
    return cardWidth + gap;
  };
  const getPageCount = () => Math.max(1, cards.length - getVisibleCount() + 1);

  const renderIndicator = () => {
    const count = getPageCount();
    indicator.innerHTML = Array.from({ length: count }, (_, i) =>
      `<span${i === 0 ? ' class="is-active"' : ''}></span>`
    ).join("");
    indicator.hidden = count <= 1;
  };

  const update = () => {
    const step = Math.max(1, getStep());
    const maxScroll = Math.max(0, grid.scrollWidth - grid.clientWidth);
    const logicalScroll = Math.max(0, maxScroll - Math.abs(grid.scrollLeft));
    const index = Math.max(0, Math.min(getPageCount() - 1, Math.round(logicalScroll / step)));
    indicator.querySelectorAll("span").forEach((line, i) => line.classList.toggle("is-active", i === index));
  };

  renderIndicator();
  grid.addEventListener("scroll", update, { passive: true });
  grid.addEventListener("wheel", (event) => {
    if (!event.deltaX) return;
    event.preventDefault();
    grid.scrollLeft += event.deltaX;
  }, { passive: false });
  window.addEventListener("resize", () => {
    renderIndicator();
    update();
  });
  update();

  let pointerId = null;
  let startX = 0;
  let startScroll = 0;
  let moved = false;

  grid.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    if (event.button !== 0) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    startScroll = grid.scrollLeft;
    moved = false;
  });

  grid.addEventListener("pointermove", (event) => {
    if (pointerId !== event.pointerId) return;
    const dx = event.clientX - startX;
    if (Math.abs(dx) <= 6) return;
    moved = true;
    grid.dataset.dragged = "true";
    grid.classList.add("is-pointer-dragging");
    grid.scrollLeft = startScroll - dx;
    event.preventDefault();
  }, { passive: false });

  const end = (event) => {
    if (pointerId !== event.pointerId) return;
    pointerId = null;
    grid.classList.remove("is-pointer-dragging");
    if (!moved) grid.dataset.dragged = "false";
    window.setTimeout(() => {
      grid.dataset.dragged = "false";
    }, 0);
  };

  grid.addEventListener("pointerup", end);
  grid.addEventListener("pointercancel", end);
}


/* Bilingual interface */
const I18N = {
  ar: {
    dir: 'rtl',
    nav: { room: 'الغرفة', contact: 'للتواصل', channels: 'القنوات', languageToggle: 'تغيير اللغة' },
    brand: { name: 'ستة وتسعين' },
    meta: {
      homeTitle: 'ستة وتسعين',
      homeDescription: 'استوديو ستة وتسعين — مساحة شخصية وإبداعية تجمع قنوات ومشاريع مختلفة تحت هوية واحدة، لصناعة محتوى له أثر.',
      roomTitle: 'الغرفة — ستة وتسعين',
      ogLocale: 'ar_AR',
      roomDescription: 'الغرفة — مساحة شخصية للتفكير بصوت عالٍ وفيديوهات من استوديو ستة وتسعين.'
    },
    home: {
      studio: 'استـوديـو', creativeSpace: 'مساحة إبداعية', description: 'مساحة شخصية وإبداعية تجمع قنوات ومشاريع مختلفة تحت هوية واحدة، لصناعة محتوى له أثر.', discover: 'اكتشف',
      manifesto: 'بنصنع مساحات تستحق إنك ترجع ليها، مش بنعمل محتوى لمجرد محتوى.', attribution: '— محمد أحمد', role: 'المؤسس والمدير الإبداعي', chooseSpace: 'اختر مساحتك', more: 'المزيد', comingSoon: 'قريبًا', comingSoonAria: 'قناة قادمة قريبًا', channel: 'قناة',
      contactTitle: 'خلــينا<br /><em>نتكـــلم.</em>', contactDescription: 'حوار بلا مسافة، لفكرة، تعاون، أو سؤال', emailMe: 'راسلني عبر البريد'
    },
    room: { personalSpace: 'مساحة شخصية للكتابة والتفكير بصوت عال', description: 'دي غرفتي، مكاني اللي بكتب فيه، بسجل فيه، وبفكر فيه بصوت عالي. مساحة لكل الأفكار اللي بتيجي في دماغي؛ فلسفة، أدب، علم نفس، حكايات، وتجارب شخصية.', scroll: 'انزل', videos: 'فيديوهات', fromRoom: 'من الغرفة', writings: 'كتاباتي', watchYoutube: 'مشاهدة الفيديو على يوتيوب' },
    quotes: {
      read: 'اقرأ الاقتباس',
      1: { label: '٠١ / شجرة معلقة', preview: 'كاد الكون ينحت في عتمته، تسلسل البياض أوصاله خفياً، تلاشت النجوم واحدة تلو الأخرى.' },
      2: { label: '٠٢ / شجرة', preview: 'العالم شجرة معلقة، فروعها إلى أسفل، يتساقط منها ما استوى.' },
      3: { label: '٠٣ / زهرة', preview: 'الفن الذي يُستنشق الآن هو ألم صافٍ لأولئك الذين سبقونا.' },
      4: { label: '٠٤ / هاوية فينسنت', preview: 'يومًا ما، اعتقدت فريدا أن فينسنت سيأخذها بالمترو إلى ليلةٍ مليئة بالنجوم، كانت تلك لوحته المفضلة، لكنها تتعدى حدود النجوم، كما رسمها فان جوخ في حالته، فوجد نفسه على هاوية الوقوع في الجحيم، وسقطت إحدى أذنيه، وهذه كانت بداية السقوط.' }
    },
    footer: { rights: 'جميع الحقوق محفوظة استوديو ستة وتسعين', copyright: 'حقوق النشر © ٢٠٢٦', socialAria: 'روابط التواصل الاجتماعي', youtube: 'يوتيوب', x: 'إكس', linkedin: 'لينكدإن' },
    modal: { close: 'إلغاء' }
  },
  en: {
    dir: 'ltr',
    nav: { room: 'The Room', contact: 'Contact', channels: 'Channels', languageToggle: 'Change language' },
    brand: { name: 'Ninety-Six' },
    meta: {
      homeTitle: 'Ninety-Six',
      homeDescription: 'Studio 96 — a personal creative space bringing different channels and projects together under one identity, making work that leaves a mark.',
      roomTitle: 'The Room — Ninety-Six',
      ogLocale: 'en_US',
      roomDescription: 'The Room — a personal space to think out loud and share videos from Studio 96.'
    },
    home: {
      studio: 'STUDIO',
      creativeSpace: 'A creative space',
      description: 'A personal creative space bringing different channels and projects together under one identity, making work that leaves a mark.',
      discover: 'Explore',
      manifesto: 'We make spaces worth coming back to—not content for content’s sake.',
      attribution: '— Mohamed Ahmed',
      role: 'Founder & Creative Director',
      chooseSpace: 'Choose your space',
      more: 'More',
      comingSoon: 'Coming soon',
      comingSoonAria: 'Upcoming channel',
      channel: 'Channel',
      contactTitle: 'LET’S<br /><em>TALK.</em>',
      contactDescription: 'For an idea, a collaboration, or just a question.',
      emailMe: 'Email me'
    },
    room: {
      personalSpace: 'A personal space to write and think out loud',
      description: 'This is my room—a place to write, record, and think out loud. A space for every idea that crosses my mind: philosophy, literature, psychology, stories, and personal experiences.',
      scroll: 'Scroll down',
      videos: 'Videos',
      fromRoom: 'From the Room',
      writings: 'Writings',
      watchYoutube: 'Watch on YouTube'
    },
    quotes: {
      read: 'Read the quote',
      1: { label: '01 / The Hanging Tree', preview: 'The universe seemed to carve itself out of the dark; white light moved quietly through its limbs, and the stars faded one by one.' },
      2: { label: '02 / Tree', preview: 'The world is a hanging tree, its branches reaching downward, letting go of whatever has ripened.' },
      3: { label: '03 / Flower', preview: 'The art we take in today would be pure pain to those who came before us.' },
      4: { label: '04 / Vincent’s Abyss', preview: 'One day, Frida thought Vincent would take her by subway to a night full of stars. It was his favorite painting, yet it went beyond the stars themselves, the way Van Gogh painted them in his state of mind. He found himself on the edge of falling into hell, and one of his ears was lost. That was the beginning of the fall.' }
    },
    footer: { rights: 'All rights reserved — Studio 96', copyright: 'Copyright © 2026', socialAria: 'Social links', youtube: 'YouTube', x: 'X', linkedin: 'LinkedIn' },
    modal: { close: 'Close' }
  }
};

const getI18nValue = (obj, path) => path.split('.').reduce((value, key) => value?.[key], obj);

function setLanguageAssets(lang) {
  document.querySelectorAll('[data-ar-src][data-en-src]').forEach((el) => {
    const src = lang === 'en' ? el.dataset.enSrc : el.dataset.arSrc;
    if (src && el.getAttribute('src') !== src) el.setAttribute('src', src);
  });
}

function setNumberLanguage(lang) {
  const arabic = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  document.querySelectorAll('[data-num]').forEach((el) => {
    const n = String(el.dataset.num);
    el.textContent = lang === 'ar' ? n.replace(/\d/g, d => arabic[Number(d)]) : n;
  });
}

function updateLanguage(lang, persist = true) {
  const safeLang = lang === 'en' ? 'en' : 'ar';
  const dict = I18N[safeLang];
  document.documentElement.lang = safeLang;
  document.documentElement.dir = dict.dir;
  document.documentElement.dataset.lang = safeLang;
  if (persist) {
    try { localStorage.setItem('studio96-language', safeLang); } catch (_) {}
  }

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const value = getI18nValue(dict, el.dataset.i18n);
    if (value !== undefined) el.textContent = value;
  });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const value = getI18nValue(dict, el.dataset.i18nHtml);
    if (value !== undefined) el.innerHTML = value;
  });
  document.querySelectorAll('[data-i18n-content]').forEach((el) => {
    const value = getI18nValue(dict, el.dataset.i18nContent);
    if (value !== undefined) el.setAttribute('content', value);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const value = getI18nValue(dict, el.dataset.i18nAria);
    if (value !== undefined) el.setAttribute('aria-label', value);
  });
  document.querySelectorAll('[data-lang-label]').forEach((el) => { el.textContent = safeLang === 'ar' ? 'EN' : 'AR'; });

  document.querySelectorAll('img[data-i18n-alt]').forEach((el) => {
    const value = getI18nValue(dict, el.dataset.i18nAlt);
    if (value !== undefined) el.alt = value;
  });
  document.title = getI18nValue(dict, document.title.includes('الغرفة') || document.body.classList.contains('room-page') ? 'meta.roomTitle' : 'meta.homeTitle');
  setNumberLanguage(safeLang);
  setLanguageAssets(safeLang);
  window.dispatchEvent(new CustomEvent('studio96:languagechange', { detail: { lang: safeLang } }));
}

function initLanguageSwitcher() {
  const toggle = document.querySelector('[data-lang-toggle]');
  if (!toggle) return;
  let stored = 'ar';
  try { stored = localStorage.getItem('studio96-language') || 'ar'; } catch (_) {}
  updateLanguage(stored === 'en' ? 'en' : 'ar', false);
  toggle.addEventListener('click', () => {
    const next = document.documentElement.lang === 'ar' ? 'en' : 'ar';
    updateLanguage(next);
  });
}

initLanguageSwitcher();


function trackEvent(name, params = {}) {
  if (typeof window.gtag !== "function") return;
  const payload = {
    ...params,
    language: document.documentElement.lang === "en" ? "en" : "ar",
  };
  window.gtag("event", name, payload);
}

function initAnalyticsTracking() {
  // Navigation and primary actions.
  document.querySelectorAll('.site-header__brand').forEach((el) => {
    el.addEventListener('click', () => trackEvent('room_click', { location: 'navbar' }));
  });

  document.querySelectorAll('.site-header__mark').forEach((el) => {
    el.addEventListener('click', () => trackEvent('home_logo_click', { location: 'navbar' }));
  });

  document.querySelectorAll('.site-header__contact').forEach((el) => {
    el.addEventListener('click', () => trackEvent('contact_click', { location: 'navbar_or_section' }));
  });

  document.querySelectorAll('[data-lang-toggle]').forEach((el) => {
    el.addEventListener('click', () => {
      const next = document.documentElement.lang === 'ar' ? 'en' : 'ar';
      trackEvent('language_change', { from_language: document.documentElement.lang, to_language: next });
    });
  });

  // Home/channel cards. Only track actionable cards so analytics stays clean.
  document.querySelectorAll('.channel-card--main').forEach((el) => {
    el.addEventListener('click', () => trackEvent('channel_click', {
      channel: 'room',
      location: 'channels'
    }));
  });

  document.querySelectorAll('.hero__scroll').forEach((el) => {
    el.addEventListener('click', () => trackEvent('scroll_down_click', { location: 'hero' }));
  });

  document.querySelectorAll('.btn--primary[href^="mailto:"]').forEach((el) => {
    el.addEventListener('click', () => trackEvent('email_click', { location: 'contact', destination: 'mailto' }));
  });

  // Video / YouTube actions.
  document.querySelectorAll('.room-video-card__link').forEach((el) => {
    el.addEventListener('click', () => trackEvent('video_click', {
      video_name: 'The Limits of the Mind',
      platform: 'youtube',
      location: 'room_videos'
    }));
  });

  // Quote interactions.
  document.querySelectorAll('.quote-card[data-quote]').forEach((el) => {
    el.addEventListener('click', () => {
      const label = el.querySelector('.quote-card__label')?.textContent?.trim() || `quote_${Number(el.dataset.quote) + 1}`;
      trackEvent('quote_open', { quote: label, quote_index: Number(el.dataset.quote) + 1 });
    });
  });

  document.querySelectorAll('[data-quote-modal-close]').forEach((el) => {
    el.addEventListener('click', () => trackEvent('quote_close'));
  });

  // Footer social links and any other outbound social links.
  document.querySelectorAll('.footer__social a').forEach((el) => {
    const href = el.getAttribute('href') || '';
    let eventName = 'social_click';
    let platform = 'other';
    if (href.includes('youtube.com')) { eventName = 'youtube_click'; platform = 'youtube'; }
    else if (href.includes('x.com') || href.includes('twitter.com')) { eventName = 'x_click'; platform = 'x'; }
    else if (href.includes('linkedin.com')) { eventName = 'linkedin_click'; platform = 'linkedin'; }
    el.addEventListener('click', () => trackEvent(eventName, { platform, location: 'footer' }));
  });

  // Track any external link that is not already covered above.
  document.querySelectorAll('a[target="_blank"]').forEach((el) => {
    if (el.closest('.footer__social') || el.closest('.room-video-card__link')) return;
    el.addEventListener('click', () => trackEvent('external_link_click', {
      url: el.href,
      link_text: el.textContent.trim()
    }));
  });
}

function initMusicPlayer() {
  const audio = document.querySelector('#studio96-audio');
  const toggle = document.querySelector('[data-music-toggle]');
  if (!audio || !toggle) return;

  const setPlayingUI = (playing) => {
    toggle.classList.toggle('is-playing', playing);
    toggle.setAttribute('aria-pressed', String(playing));
    const lang = document.documentElement.lang === 'en' ? 'en' : 'ar';
    toggle.setAttribute('aria-label', playing
      ? (lang === 'en' ? 'Pause music' : 'إيقاف الموسيقى')
      : (lang === 'en' ? 'Play music' : 'تشغيل الموسيقى'));
  };

  const tryPlay = () => {
    const promise = audio.play();
    if (promise && typeof promise.then === 'function') {
      promise.then(() => { setPlayingUI(true); trackEvent('music_autoplay_start', { location: 'page_load' }); }).catch(() => setPlayingUI(false));
    } else {
      setPlayingUI(true);
      trackEvent('music_autoplay_start', { location: 'page_load' });
    }
  };

  toggle.addEventListener('click', () => {
    if (audio.paused) {
      const promise = audio.play();
      if (promise) promise.then(() => { setPlayingUI(true); trackEvent('music_play', { location: 'floating_player' }); }).catch(() => setPlayingUI(false));
    } else {
      audio.pause();
      setPlayingUI(false);
      trackEvent('music_pause', { location: 'floating_player' });
    }
  });

  audio.addEventListener('play', () => setPlayingUI(true));
  audio.addEventListener('pause', () => setPlayingUI(false));

  // Browsers may block audible autoplay. Retry once on the first real interaction.
  tryPlay();
  const unlock = () => {
    if (audio.paused) tryPlay();
    window.removeEventListener('pointerdown', unlock, true);
    window.removeEventListener('keydown', unlock, true);
    window.removeEventListener('touchstart', unlock, true);
  };
  window.addEventListener('pointerdown', unlock, true);
  window.addEventListener('keydown', unlock, true);
  window.addEventListener('touchstart', unlock, true);

  window.addEventListener('studio96:languagechange', () => setPlayingUI(!audio.paused));
}

initMusicPlayer();
initAnalyticsTracking();
