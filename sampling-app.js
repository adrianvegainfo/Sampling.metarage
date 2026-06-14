(() => {
  const CONTENT = window.SAMPLING_CONTENT;
  const LANGUAGES = ["fr", "nl", "en"];
  const STORAGE_PREFIX = "samplingV2:";
  const EDITOR_ALLOWED_HOSTS = ["127.0.0.1", "localhost", "::1"];
  const EDITOR_ENABLED = EDITOR_ALLOWED_HOSTS.includes(window.location.hostname);
  const mobileQuery = window.matchMedia("(max-width: 760px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const state = {
    lang: LANGUAGES.includes(localStorage.getItem(`${STORAGE_PREFIX}lang`))
      ? localStorage.getItem(`${STORAGE_PREFIX}lang`)
      : "fr",
    reading: mobileQuery.matches,
    performance: localStorage.getItem(`${STORAGE_PREFIX}performance`) === "true",
    editing: false,
    topWindowZ: 360,
    topFolderZ: 20,
    openWindows: new Map(),
    imageTarget: null,
    revealTimer: null,
    revealEndTimer: null,
  };

  const elements = {
    boot: document.querySelector("[data-boot]"),
    cursor: document.querySelector("[data-cursor-tag]"),
    signal: document.querySelector("[data-signal-line]"),
    nav: document.querySelector("[data-nav]"),
    hero: document.querySelector("[data-hero]"),
    heroTitle: document.querySelector("[data-hero-title]"),
    heroDescription: document.querySelector("[data-hero-description]"),
    status: document.querySelector("[data-status-panel]"),
    folderStage: document.querySelector("[data-folder-stage]"),
    readingView: document.querySelector("[data-reading-view]"),
    desktopLayer: document.querySelector("[data-desktop-layer]"),
    languageButtons: [...document.querySelectorAll("[data-lang]")],
    languageToggle: document.querySelector("[data-language-toggle]"),
    languageSwitcher: document.querySelector(".language-switcher"),
    readingToggle: document.querySelector("[data-reading-toggle]"),
    performanceToggle: document.querySelector("[data-performance-toggle]"),
    shuffle: document.querySelector("[data-shuffle]"),
    videoPeek: document.querySelector("[data-video-peek]"),
    editToggle: document.querySelector("[data-edit-toggle]"),
    editSave: document.querySelector("[data-edit-save]"),
    editExport: document.querySelector("[data-edit-export]"),
    editImport: document.querySelector("[data-edit-import]"),
    editClear: document.querySelector("[data-edit-clear]"),
    editStatus: document.querySelector("[data-edit-status]"),
    imagePicker: document.querySelector("[data-image-picker]"),
    importPicker: document.querySelector("[data-edit-import-picker]"),
    bootChoices: [...document.querySelectorAll("[data-boot-choice]")],
    bootHint: document.querySelector("[data-boot-hint]"),
  };

  const visualItems = [
    {
      id: "inventory",
      src: "./assets/sampling-visual/inventario-dispositivos-cables-camaras.jpg",
      alt: "Inventory of devices, cables and cameras",
      text: "inventory / cameras / cables / shoes",
    },
    {
      id: "mylar-microphone",
      src: "./assets/sampling-visual/mylar-vertical-microfono-escultura.jpg",
      alt: "Vertical mylar with microphone",
      text: "mylar / microphone / listening body",
    },
    {
      id: "monitor",
      src: "./assets/sampling-visual/proyeccion-fragmentada-monitor.jpg",
      alt: "Projection fragmented over monitor",
      text: "monitor / damaged export / Buffering context",
    },
    {
      id: "projection-body",
      src: "./assets/sampling-visual/instalacion-oscura-proyeccion-verde-2.jpg",
      alt: "Installation with projection and body",
      text: "body / projection / Sampling",
    },
    {
      id: "dark-mylar",
      src: "./assets/sampling-visual/mylar-negro-textura-oscura.jpg",
      alt: "Dark mylar texture",
      text: "dark mylar / texture / reflection",
    },
    {
      id: "open-studio",
      src: "./assets/sampling-visual/muestra-proyeccion-mylar-publico.jpg",
      alt: "Open studio with projection and public",
      text: "open studio / shared test / public",
    },
  ];

  const portfolioItems = [
    {
      id: "digital-bodies",
      src: "./assets/digital-bodies-cover.jpg",
      file: "DIGITAL_BODIES.research",
      title: "Digital Bodies - Echo & Delay",
      html: {
        fr: "Recherche-mère sur corps, image, son, archive, delay et installation.",
        nl: "Moederonderzoek rond lichaam, beeld, geluid, archief, delay en installatie.",
        en: "Mother research into body, image, sound, archive, delay and installation.",
      },
    },
    {
      id: "inaudit",
      src: "./assets/portfolio-inaudit.jpg",
      youtube: "h5QRH1IsxVc",
      file: "INAUDIT.sound_heritage",
      title: "Inaudit",
      html: {
        fr: "Créé avec Adriano Galante : héritage sonore inaudible, espace-instrument et corps-capteur.",
        nl: "Gemaakt met Adriano Galante: onhoorbaar sonisch erfgoed, ruimte als instrument en sensorlichaam.",
        en: "Created with Adriano Galante: inaudible sonic heritage, space as instrument and body as sensor.",
      },
    },
    {
      id: "puma",
      src: "./assets/portfolio-los-lunares-del-puma.jpg",
      youtube: "3dWio72gp3c",
      file: "LOS_LUNARES.performance_vlog",
      title: "Los lunares del Puma",
      html: {
        fr: "Processus performance-vlog autour de caméra, journal corporel, post-Hip Hop, flamenco et processus comme résultat artistique.",
        nl: "Performance-vlog rond camera, lichaamsdagboek, post-Hip Hop, flamenco en proces als artistiek resultaat.",
        en: "Performance-vlog around camera, body diary, post-Hip Hop, flamenco and process as artistic result.",
      },
    },
    {
      id: "okey",
      src: "./assets/portfolio-we-are-just-okey.png",
      youtube: "uGa9oe7glzI",
      file: "WE_ARE_JUST_OK.final_degree_project",
      title: "We are just okey",
      html: {
        fr: "Projet de fin d’études autour de la chute, de l’impact, du sol, du jeu, de l’erreur et du zapateado.",
        nl: "Afstudeerproject rond val, impact, vloer, spel, fout en zapateado.",
        en: "Final degree project around falling, impact, floor, game, error and zapateado.",
      },
    },
  ];

  const portfolioWindowMedia = [
    {
      src: "./assets/digital-bodies-cover.jpg",
      editId: "window-image-portfolio-digital-bodies",
      alt: "Digital Bodies cover",
    },
    {
      src: "./assets/portfolio-inaudit.jpg",
      youtube: "h5QRH1IsxVc",
      editId: "window-image-portfolio-inaudit",
      alt: "Inaudit",
    },
    {
      src: "./assets/portfolio-los-lunares-del-puma.jpg",
      youtube: "3dWio72gp3c",
      editId: "window-image-portfolio-puma",
      alt: "Los lunares del Puma",
    },
    {
      src: "./assets/digital-bodies-cover.jpg",
      editId: "window-image-portfolio-links",
      alt: "Portfolio links",
    },
    {
      src: "./assets/portfolio-we-are-just-okey.png",
      youtube: "uGa9oe7glzI",
      editId: "window-image-portfolio-okey",
      alt: "We are just okey",
    },
  ];

  const videoItems = [
    {
      id: "residency",
      youtube: "tvvpnfamsj0",
      file: "PROJECT_EXPLANATION.castellano",
      title: { fr: "Sortie de résidence", nl: "Residentie-uitgang", en: "Residency output" },
      html: {
        fr: "Explication du projet en espagnol après résidence. Les sous-titres français peuvent être préparés dans CapCut.",
        nl: "Projectuitleg in het Spaans na residentie. Franse ondertitels kunnen in CapCut worden voorbereid.",
        en: "Project explanation in Spanish after residency. French subtitles can be prepared in CapCut.",
      },
    },
    {
      id: "sampling-rehearsal",
      youtube: "pkP5lEjQFqI",
      file: "SAMPLING.rehearsal",
      title: { fr: "Test de projection", nl: "Projectietest", en: "Projection test" },
      html: {
        fr: "Matériaux de test de projection : corps, caméra, présence et archive corporelle.",
        nl: "Projectietestmateriaal: lichaam, camera, aanwezigheid en lichaamsarchief.",
        en: "Projection test materials: body, camera, presence and bodily archive.",
      },
    },
    {
      id: "buffering",
      youtube: "uBs8gOrPZEs",
      file: "BUFFERING.shared_installation_materials",
      title: { fr: "Buffering / matériaux partagés", nl: "Buffering / gedeeld materiaal", en: "Buffering / shared materials" },
      html: {
        fr: "Matériaux de l’installation vidéo de Buffering qui partagent image, delay et surfaces avec Sampling.",
        nl: "Videoinstallatiemateriaal van Buffering dat beeld, delay en oppervlaktes met Sampling deelt.",
        en: "Video installation materials from Buffering sharing image, delay and surfaces with Sampling.",
      },
    },
    {
      id: "dirty-pass",
      youtube: "KozWAIlzfaQ",
      file: "SAMPLING.body_sound_dirty_pass",
      title: { fr: "Corps, pulsation, atonal", nl: "Lichaam, puls, atonaal", en: "Body, pulse, atonal" },
      html: {
        fr: "Corps, pulsation, sons atonaux, matière d’installation et mylar.",
        nl: "Lichaam, puls, atonale klank, installatiesound en mylar.",
        en: "Body, pulse, atonal sound, installation material and mylar.",
      },
    },
  ];

  const supportItems = [
    {
      id: "pdf",
      title: "PDF Metalab",
      href: "./Sampling_Metalab_Metarage_FR_v1.pdf",
      html: {
        fr: "Dossier PDF français utilisé pour l’application Metalab.",
        nl: "Frans PDF-dossier voor de Metalab-aanvraag.",
        en: "French PDF dossier used for the Metalab application.",
      },
    },
    {
      id: "drive",
      title: "Phase 2 / Drive archive",
      href: "https://drive.google.com/drive/folders/1l2qYD9uSCw4IzxpDmVivtd3GStCjO6WI?usp=sharing",
      html: {
        fr: "Archive Drive pour téléverser les matériaux complets après cette première phase web.",
        nl: "Drive-archief om de volledige materialen na deze eerste webfase op te laden.",
        en: "Drive archive for uploading the full materials after this first web phase.",
      },
    },
    {
      id: "strategy",
      title: "Application strategy",
      href: "./application_strategy.html",
      html: {
        fr: "Page de stratégie : formats, trois semaines, matériaux existants, logique de lecture et liens publics.",
        nl: "Strategiepagina: formats, drie weken, bestaand materiaal, leeslogica en publieke links.",
        en: "Strategy page: formats, three weeks, existing materials, reading logic and public links.",
      },
    },
    {
      id: "theory",
      title: "Theoretical frame",
      href: "./Sampling_marco_teorico_borrador.md",
      html: {
        fr: "Cadre théorique de travail autour de Sampling.",
        nl: "Theoretisch werkkader rond Sampling.",
        en: "Working theoretical frame around Sampling.",
      },
    },
  ];

  function textKey(id, lang = state.lang) {
    const scope = id === "hero-title" ? "global" : lang;
    return `${STORAGE_PREFIX}text:${scope}:${id}`;
  }

  function imageKey(id) {
    return `${STORAGE_PREFIX}image:${id}`;
  }

  function migrateLegacyEdits() {
    const oldTitle = localStorage.getItem("metarageSamplingText:text-6");
    const oldSysline = localStorage.getItem("metarageSamplingText:text-5");
    const oldBrand = localStorage.getItem("metarageSamplingText:text-0");
    const oldImage = localStorage.getItem("metarageSamplingImage:image-0");
    const migratedTitle = localStorage.getItem(textKey("hero-title"));
    if (oldTitle && (!migratedTitle || migratedTitle === oldBrand || migratedTitle === oldSysline)) {
      localStorage.setItem(textKey("hero-title"), oldTitle);
    }
    if (localStorage.getItem(`${STORAGE_PREFIX}migrationComplete`)) return;
    if (oldImage && !localStorage.getItem(imageKey("hero-image"))) {
      localStorage.setItem(imageKey("hero-image"), oldImage);
    }
    localStorage.setItem(`${STORAGE_PREFIX}migrationComplete`, "true");
  }

  function migrateContentRevisions() {
    const storedTextKeys = Object.keys(localStorage).filter((key) => key.startsWith(`${STORAGE_PREFIX}text:`));

    Object.keys(localStorage)
      .filter((key) => key.startsWith(`${STORAGE_PREFIX}text:`))
      .forEach((key) => {
        const value = localStorage.getItem(key);
        if (value && value.includes("Sampling_Metalab_Metarage_dossier_FR.pdf")) {
          localStorage.setItem(key, value.replaceAll("Sampling_Metalab_Metarage_dossier_FR.pdf", "Sampling_Metalab_Metarage_FR_v1.pdf"));
        }
      });

    const textReplacements = [
      ["Répétitions Sampling", "Test de projection"],
      ["Sampling-repetities", "Projectietest"],
      ["Sampling rehearsals", "Projection test"],
      ["Sampling rehearsal", "Projection test"],
      ["Présentation brute", "Corps, pulsation, atonal"],
      ["Ruwe doorloop", "Lichaam, puls, atonaal"],
      ["Dirty pass", "Body, pulse, atonal"],
      ["Passage en brut", "Corps, pulsation, atonal"],
    ];

    storedTextKeys.forEach((key) => {
      let value = localStorage.getItem(key);
      if (!value) return;
      textReplacements.forEach(([from, to]) => {
        value = value.replaceAll(from, to);
      });
      localStorage.setItem(key, value);
    });

    const revisions = [
      {
        key: `${STORAGE_PREFIX}text:fr:content-motivation-0`,
        from: "J’ai longtemps travaillé comme danseur et créateur au sein de structures collectives, notamment avec Iron Skulls.",
        to: "J’ai longtemps travaillé comme <strong>interprète</strong>, danseur et créateur dans des contextes de <strong>travail collectif</strong>, notamment avec Iron Skulls.",
      },
      {
        key: `${STORAGE_PREFIX}text:nl:content-motivation-0`,
        from: "Lange tijd werkte ik als danser en maker binnen collectieve structuren, onder meer met Iron Skulls.",
        to: "Lange tijd werkte ik als <strong>performer</strong>, danser en maker binnen contexten van <strong>collectief werk</strong>, onder meer met Iron Skulls.",
      },
      {
        key: `${STORAGE_PREFIX}text:en:content-motivation-0`,
        from: "I worked for many years as a dancer and maker within collective structures, notably with Iron Skulls.",
        to: "I worked for many years as a <strong>performer</strong>, dancer and maker within contexts of <strong>collective work</strong>, notably with Iron Skulls.",
      },
    ];

    revisions.forEach(({ key, from, to }) => {
      const value = localStorage.getItem(key);
      if (value && value.includes(from)) {
        localStorage.setItem(key, value.replace(from, to));
      }
    });
  }

  function setEditorStatus(message) {
    if (!EDITOR_ENABLED) return;
    elements.editStatus.textContent = message;
  }

  function setEditableState() {
    document.body.classList.toggle("edit-mode", state.editing);
    document.querySelectorAll("[data-edit-text]").forEach((node) => {
      node.contentEditable = state.editing ? "true" : "false";
      node.spellcheck = state.editing;
    });
  }

  function applyStoredEdits(root = document) {
    root.querySelectorAll("[data-edit-text]").forEach((node) => {
      const value = localStorage.getItem(textKey(node.dataset.editId));
      if (value !== null) node.innerHTML = value;
    });
    root.querySelectorAll("[data-edit-image]").forEach((node) => {
      const value = localStorage.getItem(imageKey(node.dataset.editId));
      if (value !== null) node.src = value;
    });
    bindEditableImages(root);
    setEditableState();
  }

  function saveCurrentDom() {
    document.querySelectorAll("[data-edit-text]").forEach((node) => {
      if (node.dataset.editId) localStorage.setItem(textKey(node.dataset.editId), node.innerHTML);
    });
    document.querySelectorAll("[data-edit-image]").forEach((node) => {
      if (node.dataset.editId) localStorage.setItem(imageKey(node.dataset.editId), node.src);
    });
  }

  function bindEditableImages(root = document) {
    root.querySelectorAll("[data-edit-image]:not([data-image-bound])").forEach((image) => {
      image.dataset.imageBound = "true";
      image.addEventListener("click", (event) => {
        if (!state.editing) return;
        event.preventDefault();
        event.stopPropagation();
        state.imageTarget = image;
        elements.imagePicker.click();
      });
    });
  }

  function ui() {
    return CONTENT.ui[state.lang];
  }

  function localise(value) {
    if (typeof value === "string") return value;
    return value?.[state.lang] || value?.fr || "";
  }

  function youtubeFrame(id, title) {
    return `<iframe
      src="https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=1&playsinline=1&rel=0&modestbranding=1"
      title="${title}"
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowfullscreen
    ></iframe>`;
  }

  function completeSectionKey(folder) {
    return folder.key === "portfolio" ? "portfolio-expanded" : folder.key;
  }

  function scrollToCompleteSection(folder) {
    const targetKey = completeSectionKey(folder);
    const target = document.querySelector(`[data-reading-key="${targetKey}"]`) || document.getElementById(targetKey);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderNavigation() {
    const keys = ["sampling", "methodology", "objectives", "metalab", "mediation", "portfolio"];
    elements.nav.innerHTML = keys
      .map((key, index) => `<a href="#${key}" data-open-key="${key}" data-cursor-label="${ui().nav[index]}">${ui().nav[index]}</a>`)
      .join("");
    elements.nav.querySelectorAll("[data-open-key]").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        document.querySelector(`[data-reading-key="${link.dataset.openKey}"]`)?.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  function renderHero() {
    elements.heroDescription.innerHTML = ui().hero;
    elements.status.innerHTML = ui().status.map((item) => `<span>${item}</span>`).join("");
    elements.languageButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.lang === state.lang);
      button.setAttribute("aria-pressed", String(button.dataset.lang === state.lang));
    });
    elements.readingToggle.textContent = state.reading ? ui().desktop : ui().reading;
    elements.readingToggle.classList.toggle("is-active", state.reading);
    elements.readingToggle.setAttribute("aria-label", state.reading ? ui().desktop : ui().reading);
    elements.performanceToggle.setAttribute("aria-label", state.performance ? ui().archive : ui().performance);
    elements.performanceToggle.setAttribute("title", state.performance ? ui().archive : ui().performance);
    elements.performanceToggle.classList.toggle("is-active", state.performance);
    elements.shuffle.textContent = ui().shuffle;
    elements.editToggle.textContent = state.editing ? ui().exitEdit : ui().edit;
    if (EDITOR_ENABLED) {
      elements.editSave.textContent = ui().save;
      elements.editExport.textContent = ui().export;
      elements.editImport.textContent = ui().import;
      elements.editClear.textContent = ui().restore;
    }
    document.documentElement.lang = state.lang;
    document.body.classList.toggle("reading-mode", state.reading);
    document.body.classList.toggle("interactive-mode", !state.reading);
    document.body.classList.toggle("performance-mode", state.performance);
    applyStoredEdits();
  }

  function folderMarkup(folder, index) {
    return `<button
      class="folder"
      type="button"
      data-folder
      data-key="${folder.key}"
      data-action="${folder.action[state.lang]}"
      data-cursor-label="${folder.action[state.lang]}"
      style="--folder-z:${20 + index}"
    >
      <strong>${folder.label[state.lang]}</strong>
      <small>${ui().open} / ${folder.file}</small>
    </button>`;
  }

  function renderFolders() {
    elements.folderStage.innerHTML = CONTENT.folders.map(folderMarkup).join("");
    elements.folderStage.querySelectorAll("[data-folder]").forEach((folder) => {
      attachFolderGesture(folder);
      folder.addEventListener("dblclick", (event) => {
        event.preventDefault();
        event.stopPropagation();
        releaseAllDrags();
        openDesktopWindow(folder.dataset.key);
      });
    });
    bindCursorLabels(elements.folderStage);
  }

  function renderReading() {
    const sections = CONTENT.folders
      .map((folder) => {
        const tabs = folder.tabs[state.lang]
          .map(
            (tab, index) => `<article class="reading-tab">
              <h3>${tab.title}</h3>
              <div data-edit-text data-edit-id="content-${folder.key}-${index}">${tab.html}</div>
            </article>`,
          )
          .join("");
        return `<section class="reading-section" id="${folder.key}" data-reading-key="${folder.key}">
          <p class="sysline">${folder.file}</p>
          <h2>${folder.label[state.lang]}</h2>
          <div class="reading-tabs">${tabs}</div>
        </section>`;
      })
      .join("");
    const portfolioCards = portfolioItems
      .map((item) => `<article class="expanded-card">
        <div class="expanded-media">
          ${
            item.youtube
              ? youtubeFrame(item.youtube, item.title)
              : `<img src="${item.src}" alt="${item.title}" data-edit-image data-edit-id="expanded-image-${item.id}">`
          }
        </div>
        <span class="file-type">${item.file}</span>
        <h3>${item.title}</h3>
        <p data-edit-text data-edit-id="expanded-portfolio-${item.id}">${localise(item.html)}</p>
      </article>`)
      .join("");
    const imageCards = visualItems
      .map((item) => `<article class="image-tile">
        <img src="${item.src}" alt="${item.alt}" data-edit-image data-edit-id="expanded-image-${item.id}">
        <p data-edit-text data-edit-id="expanded-visual-${item.id}">${item.text}</p>
      </article>`)
      .join("");
    const videoCards = videoItems
      .map((item) => `<article class="video-card">
        <div class="video-frame">${youtubeFrame(item.youtube, localise(item.title))}</div>
        <div class="video-card-copy">
          <span class="file-type">${item.file}</span>
          <h3>${localise(item.title)}</h3>
          <p data-edit-text data-edit-id="expanded-video-${item.id}">${localise(item.html)}</p>
        </div>
      </article>`)
      .join("");
    const supportCards = supportItems
      .map((item) => `<article class="support-card">
        <h3>${item.title}</h3>
        <p data-edit-text data-edit-id="expanded-support-${item.id}">${localise(item.html)}</p>
        <p><a href="${item.href}" target="_blank" rel="noreferrer">${item.href.replace("./", "")}</a></p>
      </article>`)
      .join("");
    const expandedSections = `
      <section class="reading-section expanded-section" id="portfolio-expanded" data-reading-key="portfolio-expanded">
        <p class="sysline">/PORTFOLIO/TRAJECTORY</p>
        <h2>Portfolio</h2>
        <div class="expanded-grid">${portfolioCards}</div>
      </section>
      <section class="reading-section expanded-section" id="visual-materials" data-reading-key="visual-materials">
        <p class="sysline">/VISUAL_MATERIALS</p>
        <h2>Images / matériaux visuels</h2>
        <div class="image-grid">${imageCards}</div>
      </section>
      <section class="reading-section expanded-section" id="video-materials" data-reading-key="video-materials">
        <p class="sysline">/VIDEO_MATERIALS</p>
        <h2>Matériaux vidéo</h2>
        <div class="video-grid">${videoCards}</div>
      </section>
      <section class="reading-section expanded-section" id="supporting-files" data-reading-key="supporting-files">
        <p class="sysline">/SUPPORTING_FILES</p>
        <h2>Expanded material</h2>
        <div class="support-grid">${supportCards}</div>
      </section>`;
    elements.readingView.innerHTML = `<section class="reading-intro">
      <p class="sysline">C:/SAMPLING/COMPLETE_DOSSIER</p>
      <h1>${elements.heroTitle.innerHTML}</h1>
      <p>${ui().hero}</p>
    </section>${sections}${expandedSections}`;
    applyStoredEdits(elements.readingView);
  }

  function renderAll() {
    renderNavigation();
    renderHero();
    renderFolders();
    renderReading();
    refreshOpenWindows();
    bindCursorLabels(document);
    setEditableState();
  }

  function mediaMarkup(folder, activeTab = 0) {
    const id = `window-image-${folder.key}`;
    if (folder.video) {
      return `<iframe
        src="https://www.youtube.com/embed/${folder.video}?autoplay=1&mute=1&controls=1&loop=1&playlist=${folder.video}&playsinline=1&rel=0&modestbranding=1"
        title="${folder.label[state.lang]}"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowfullscreen
      ></iframe>`;
    }
    const portfolioMedia = folder.key === "portfolio" ? portfolioWindowMedia[activeTab] || portfolioWindowMedia[0] : null;
    if (portfolioMedia?.youtube) {
      return `<iframe
        src="https://www.youtube.com/embed/${portfolioMedia.youtube}?autoplay=1&mute=1&controls=1&playsinline=1&rel=0&modestbranding=1"
        title="${portfolioMedia.alt}"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowfullscreen
      ></iframe>`;
    }
    const src = portfolioMedia?.src || folder.image;
    const editId = portfolioMedia?.editId || id;
    const alt = portfolioMedia?.alt || folder.label[state.lang];
    return `<img src="${src}" alt="${alt}" data-edit-image data-edit-id="${editId}">`;
  }

  function buildWindowContent(win, folder, activeTab = 0) {
    const tabs = folder.tabs[state.lang];
    const tab = tabs[Math.min(activeTab, tabs.length - 1)];
    win.dataset.activeTab = String(Math.min(activeTab, tabs.length - 1));
    win.querySelector(".desktop-window-bar span").textContent = folder.file;
    win.querySelector(".desktop-window-body").innerHTML = `
      <div class="window-main">
        <p class="sysline">${folder.action[state.lang]}</p>
        <h2 class="window-title">${folder.label[state.lang]}</h2>
        <div class="window-tabs">
          ${tabs.map((item, index) => `<button type="button" data-tab="${index}" class="${index === Number(win.dataset.activeTab) ? "is-active" : ""}">${item.title}</button>`).join("")}
        </div>
        <div class="window-extent" aria-label="${ui().briefView} / ${ui().fullPage}">
          <span>${ui().briefView}</span>
          <button type="button" data-full-page data-cursor-label="${ui().fullPage}">${ui().fullPage}</button>
        </div>
        <div class="window-tab-content" data-edit-text data-edit-id="content-${folder.key}-${win.dataset.activeTab}">${tab.html}</div>
      </div>
      <aside class="window-side">
        ${mediaMarkup(folder, Number(win.dataset.activeTab))}
        <div class="window-tags">${folder.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
      </aside>
      <div class="window-meta">
        <span>${folder.action[state.lang]}</span>
        <span>${ui().language}: ${state.lang.toUpperCase()}</span>
      </div>`;
    win.querySelectorAll("[data-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        saveCurrentDom();
        buildWindowContent(win, folder, Number(button.dataset.tab));
        applyStoredEdits(win);
      });
    });
    win.querySelector("[data-full-page]")?.addEventListener("click", () => {
      saveCurrentDom();
      closeWindow(folder.key);
      window.requestAnimationFrame(() => scrollToCompleteSection(folder));
    });
    applyStoredEdits(win);
    bindCursorLabels(win);
  }

  function openDesktopWindow(key, position = null) {
    const existing = state.openWindows.get(key);
    if (existing) {
      existing.style.setProperty("--window-z", String(++state.topWindowZ));
      existing.classList.remove("is-minimized");
      return existing;
    }
    const folder = CONTENT.folders.find((item) => item.key === key);
    if (!folder) return null;

    const win = document.createElement("section");
    win.className = "desktop-window";
    win.dataset.windowKey = key;
    win.style.setProperty("--window-z", String(++state.topWindowZ));
    win.style.left = `${position?.left ?? Math.round(24 + Math.random() * 100)}px`;
    win.style.top = `${position?.top ?? Math.round(64 + Math.random() * 90)}px`;
    win.innerHTML = `<div class="desktop-window-bar">
      <span>${folder.file}</span>
      <button type="button" data-minimize aria-label="Minimize">_</button>
      <button type="button" data-close aria-label="${ui().close}">x</button>
    </div>
    <div class="desktop-window-body"></div>`;
    elements.desktopLayer.append(win);
    state.openWindows.set(key, win);
    buildWindowContent(win, folder, 0);
    clampToViewport(win);
    attachWindowGesture(win, win.querySelector(".desktop-window-bar"));
    win.addEventListener("pointerdown", () => win.style.setProperty("--window-z", String(++state.topWindowZ)));
    win.querySelector("[data-close]").addEventListener("click", () => closeWindow(key));
    win.querySelector("[data-minimize]").addEventListener("click", () => win.classList.toggle("is-minimized"));
    stopVideoReveal();
    return win;
  }

  function closeWindow(key) {
    state.openWindows.get(key)?.remove();
    state.openWindows.delete(key);
    scheduleVideoReveal();
  }

  function refreshOpenWindows() {
    state.openWindows.forEach((win, key) => {
      const folder = CONTENT.folders.find((item) => item.key === key);
      if (folder) buildWindowContent(win, folder, Number(win.dataset.activeTab || 0));
    });
  }

  function clampToViewport(element, left = parseFloat(element.style.left || 0), top = parseFloat(element.style.top || 0)) {
    const rect = element.getBoundingClientRect();
    const maxLeft = Math.max(6, window.innerWidth - Math.min(rect.width, window.innerWidth) - 6);
    const maxTop = Math.max(6, window.innerHeight - Math.min(rect.height, window.innerHeight) - 6);
    const nextLeft = Math.min(Math.max(6, left), maxLeft);
    const nextTop = Math.min(Math.max(6, top), maxTop);
    element.style.left = `${nextLeft}px`;
    element.style.top = `${nextTop}px`;
  }

  function attachFolderGesture(folder) {
    let gesture = null;
    const threshold = 7;

    const release = (event, shouldOpen = false) => {
      if (!gesture) return;
      const wasDragging = gesture.dragging;
      folder.classList.remove("is-dragging");
      if (wasDragging) {
        folder.classList.remove("is-settling");
        window.requestAnimationFrame(() => {
          folder.classList.add("is-settling");
          window.setTimeout(() => folder.classList.remove("is-settling"), 380);
        });
      }
      try {
        if (event && folder.hasPointerCapture(event.pointerId)) folder.releasePointerCapture(event.pointerId);
      } catch (_) {}
      gesture = null;
      if (shouldOpen && !wasDragging) openDesktopWindow(folder.dataset.key);
    };

    folder.addEventListener("pointerdown", (event) => {
      if (mobileQuery.matches || state.editing || event.button !== 0) return;
      const rect = folder.getBoundingClientRect();
      const stageRect = elements.folderStage.getBoundingClientRect();
      gesture = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        left: rect.left - stageRect.left,
        top: rect.top - stageRect.top,
        dragging: false,
      };
      folder.setPointerCapture(event.pointerId);
      folder.style.setProperty("--folder-z", String(++state.topFolderZ));
    });

    folder.addEventListener("pointermove", (event) => {
      if (!gesture || gesture.pointerId !== event.pointerId) return;
      const dx = event.clientX - gesture.startX;
      const dy = event.clientY - gesture.startY;
      if (!gesture.dragging && Math.hypot(dx, dy) >= threshold) {
        gesture.dragging = true;
        folder.classList.add("is-dragging");
        folder.style.right = "auto";
        folder.style.bottom = "auto";
        folder.style.transform = "none";
      }
      if (!gesture.dragging) return;
      const maxLeft = Math.max(0, elements.folderStage.clientWidth - folder.offsetWidth);
      const maxTop = Math.max(0, elements.folderStage.clientHeight - folder.offsetHeight);
      folder.style.left = `${Math.min(Math.max(0, gesture.left + dx), maxLeft)}px`;
      folder.style.top = `${Math.min(Math.max(0, gesture.top + dy), maxTop)}px`;
    });

    folder.addEventListener("click", (event) => {
      if (!mobileQuery.matches || state.editing) return;
      event.preventDefault();
      openDesktopWindow(folder.dataset.key);
    });
    folder.addEventListener("pointerup", (event) => release(event, true));
    folder.addEventListener("pointercancel", (event) => release(event, false));
    folder.addEventListener("lostpointercapture", () => release(null, false));
    folder._releaseGesture = () => release(null, false);
  }

  function attachWindowGesture(win, handle) {
    let gesture = null;
    const threshold = 5;

    const release = (event) => {
      if (!gesture) return;
      win.classList.remove("is-moving");
      try {
        if (event && handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
      } catch (_) {}
      gesture = null;
      clampToViewport(win);
    };

    handle.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button") || event.button !== 0) return;
      gesture = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        left: parseFloat(win.style.left || 0),
        top: parseFloat(win.style.top || 0),
        moving: false,
      };
      handle.setPointerCapture(event.pointerId);
      win.style.setProperty("--window-z", String(++state.topWindowZ));
    });

    handle.addEventListener("pointermove", (event) => {
      if (!gesture || gesture.pointerId !== event.pointerId) return;
      const dx = event.clientX - gesture.startX;
      const dy = event.clientY - gesture.startY;
      if (!gesture.moving && Math.hypot(dx, dy) >= threshold) {
        gesture.moving = true;
        win.classList.add("is-moving");
      }
      if (!gesture.moving) return;
      clampToViewport(win, gesture.left + dx, gesture.top + dy);
    });

    handle.addEventListener("pointerup", release);
    handle.addEventListener("pointercancel", release);
    handle.addEventListener("lostpointercapture", () => release(null));
    win._releaseGesture = () => release(null);
  }

  function releaseAllDrags() {
    document.querySelectorAll("[data-folder]").forEach((folder) => folder._releaseGesture?.());
    state.openWindows.forEach((win) => win._releaseGesture?.());
    document.querySelectorAll(".is-dragging,.is-moving").forEach((node) => node.classList.remove("is-dragging", "is-moving"));
  }

  function shuffleFolders() {
    if (mobileQuery.matches) {
      elements.folderStage.querySelectorAll("[data-folder]").forEach((folder) => {
        folder.classList.remove("is-shuffled");
        window.requestAnimationFrame(() => {
          folder.classList.add("is-shuffled");
          window.setTimeout(() => folder.classList.remove("is-shuffled"), 520);
        });
      });
      return;
    }
    const stage = elements.folderStage.getBoundingClientRect();
    elements.folderStage.querySelectorAll("[data-folder]").forEach((folder) => {
      const maxLeft = Math.max(10, stage.width - folder.offsetWidth - 10);
      const maxTop = Math.max(10, stage.height - folder.offsetHeight - 10);
      folder.style.left = `${Math.round(10 + Math.random() * (maxLeft - 10))}px`;
      folder.style.top = `${Math.round(10 + Math.random() * (maxTop - 10))}px`;
      folder.style.right = "auto";
      folder.style.bottom = "auto";
      folder.style.transform = `rotate(${Math.round(-4 + Math.random() * 8)}deg)`;
    });
    elements.signal.classList.remove("is-scanning");
    requestAnimationFrame(() => elements.signal.classList.add("is-scanning"));
  }

  function canRevealVideo() {
    return !state.reading && !state.editing && state.openWindows.size === 0 && !reducedMotion.matches;
  }

  function revealVideo(duration = 3500) {
    if (!canRevealVideo()) return;
    elements.hero.classList.add("video-reveal");
    clearTimeout(state.revealEndTimer);
    state.revealEndTimer = setTimeout(() => elements.hero.classList.remove("video-reveal"), duration);
  }

  function stopVideoReveal() {
    clearTimeout(state.revealTimer);
    clearTimeout(state.revealEndTimer);
    elements.hero.classList.remove("video-reveal", "cursor-reveal");
  }

  function scheduleVideoReveal() {
    clearTimeout(state.revealTimer);
    if (!canRevealVideo()) return;
    state.revealTimer = setTimeout(() => {
      revealVideo();
      scheduleVideoReveal();
    }, 12000 + Math.random() * 4000);
  }

  function bindCursorLabels(root = document) {
    root.querySelectorAll("[data-cursor-label]:not([data-cursor-bound])").forEach((node) => {
      node.dataset.cursorBound = "true";
      node.addEventListener("mouseenter", () => {
        elements.cursor.textContent = node.dataset.cursorLabel;
      });
      node.addEventListener("mouseleave", () => {
        elements.cursor.textContent = "sampling";
      });
    });
  }

  function switchLanguage(lang) {
    if (!LANGUAGES.includes(lang) || lang === state.lang) return;
    saveCurrentDom();
    state.lang = lang;
    localStorage.setItem(`${STORAGE_PREFIX}lang`, lang);
    renderAll();
  }

  function toggleReading() {
    saveCurrentDom();
    state.reading = !state.reading;
    document.body.classList.toggle("reading-mode", state.reading);
    if (state.reading) {
      state.openWindows.forEach((_, key) => closeWindow(key));
      stopVideoReveal();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      scheduleVideoReveal();
      document.querySelector("#desktop")?.scrollIntoView({ behavior: "smooth" });
    }
    renderHero();
  }

  function enterBootMode(mode) {
    state.reading = mode === "read";
    document.body.classList.toggle("reading-mode", state.reading);
    if (state.reading) {
      state.openWindows.forEach((_, key) => closeWindow(key));
      stopVideoReveal();
      window.scrollTo({ top: 0, behavior: "auto" });
    } else {
      scheduleVideoReveal();
      document.querySelector("#desktop")?.scrollIntoView({ behavior: "auto" });
    }
    renderHero();
    elements.boot.classList.add("is-dismissed");
  }

  function refreshBootChoices() {
    const recommendedMode = mobileQuery.matches ? "read" : "interactive";
    const defaultHint =
      recommendedMode === "read"
        ? "Recommended here: Read Mode. Start with the complete dossier."
        : "Recommended here: Interactive Mode. Start with the desktop app-performance.";
    if (elements.bootHint) elements.bootHint.textContent = defaultHint;
    elements.bootChoices.forEach((button) => {
      button.classList.toggle("is-recommended", button.dataset.bootChoice === recommendedMode);
    });
  }

  function exportEdits() {
    saveCurrentDom();
    const storage = Object.fromEntries(
      Object.keys(localStorage)
        .filter((key) => key.startsWith(STORAGE_PREFIX))
        .map((key) => [key, localStorage.getItem(key)]),
    );
    const blob = new Blob([JSON.stringify({ version: 2, exportedAt: new Date().toISOString(), storage }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sampling-metarage-edits-v2.json";
    link.click();
    URL.revokeObjectURL(url);
    setEditorStatus(ui().exported);
  }

  function bindControls() {
    document.querySelector(".edit-panel").hidden = !EDITOR_ENABLED;
    elements.languageButtons.forEach((button) =>
      button.addEventListener("click", () => {
        switchLanguage(button.dataset.lang);
        if (elements.languageSwitcher) elements.languageSwitcher.hidden = true;
        elements.languageToggle?.setAttribute("aria-expanded", "false");
      }),
    );
    elements.languageToggle?.addEventListener("click", (event) => {
      event.stopPropagation();
      if (!elements.languageSwitcher) return;
      const shouldOpen = elements.languageSwitcher.hidden;
      elements.languageSwitcher.hidden = !shouldOpen;
      elements.languageToggle.setAttribute("aria-expanded", String(shouldOpen));
    });
    document.addEventListener("click", (event) => {
      if (!elements.languageSwitcher || elements.languageSwitcher.hidden) return;
      if (event.target.closest(".language-menu")) return;
      elements.languageSwitcher.hidden = true;
      elements.languageToggle?.setAttribute("aria-expanded", "false");
    });
    elements.readingToggle.addEventListener("click", toggleReading);
    elements.performanceToggle.addEventListener("click", () => {
      state.performance = !state.performance;
      localStorage.setItem(`${STORAGE_PREFIX}performance`, String(state.performance));
      renderHero();
    });
    elements.shuffle.addEventListener("click", shuffleFolders);
    elements.videoPeek.addEventListener("mouseenter", () => elements.hero.classList.add("cursor-reveal"));
    elements.videoPeek.addEventListener("mouseleave", () => elements.hero.classList.remove("cursor-reveal"));
    elements.videoPeek.addEventListener("click", () => revealVideo(5000));

    elements.hero.addEventListener("pointermove", (event) => {
      if (!canRevealVideo()) return;
      const blocked = event.target.closest(".hero-image,.hero-copy,.status-panel,.folder,.video-peek");
      elements.hero.classList.toggle("cursor-reveal", !blocked);
    });
    elements.hero.addEventListener("pointerleave", () => elements.hero.classList.remove("cursor-reveal"));

    elements.editToggle.addEventListener("click", () => {
      if (!EDITOR_ENABLED) return;
      state.editing = !state.editing;
      releaseAllDrags();
      setEditableState();
      renderHero();
      setEditorStatus(state.editing ? ui().editing : ui().view);
      if (state.editing) stopVideoReveal();
      else scheduleVideoReveal();
    });
    elements.editSave.addEventListener("click", () => {
      if (!EDITOR_ENABLED) return;
      saveCurrentDom();
      setEditorStatus(ui().saved);
    });
    elements.editExport.addEventListener("click", () => {
      if (!EDITOR_ENABLED) return;
      exportEdits();
    });
    elements.editImport.addEventListener("click", () => {
      if (!EDITOR_ENABLED) return;
      elements.importPicker.click();
    });
    elements.editClear.addEventListener("click", () => {
      if (!EDITOR_ENABLED) return;
      if (!window.confirm("¿Restaurar el contenido original y borrar los cambios locales?")) return;
      Object.keys(localStorage)
        .filter((key) => key.startsWith(STORAGE_PREFIX) || key.startsWith("metarageSampling"))
        .forEach((key) => localStorage.removeItem(key));
      window.location.reload();
    });

    elements.importPicker.addEventListener("change", async () => {
      if (!EDITOR_ENABLED) return;
      const file = elements.importPicker.files?.[0];
      if (!file) return;
      try {
        const data = JSON.parse(await file.text());
        Object.entries(data.storage || {}).forEach(([key, value]) => {
          if (key.startsWith(STORAGE_PREFIX)) localStorage.setItem(key, value);
        });
        setEditorStatus(ui().imported);
        window.location.reload();
      } catch (_) {
        setEditorStatus("JSON ERROR");
      }
    });

    elements.imagePicker.addEventListener("change", () => {
      if (!EDITOR_ENABLED) return;
      const file = elements.imagePicker.files?.[0];
      if (!file || !state.imageTarget) return;
      const reader = new FileReader();
      reader.onload = () => {
        state.imageTarget.src = reader.result;
        localStorage.setItem(imageKey(state.imageTarget.dataset.editId), reader.result);
      };
      reader.readAsDataURL(file);
      elements.imagePicker.value = "";
    });

    elements.bootChoices.forEach((button) => {
      const showBootHint = () => {
        if (elements.bootHint) elements.bootHint.textContent = button.dataset.bootDescription || "";
      };
      button.addEventListener("pointerenter", showBootHint);
      button.addEventListener("pointerdown", showBootHint);
      button.addEventListener("focus", showBootHint);
      button.addEventListener("click", () => enterBootMode(button.dataset.bootChoice));
    });
    window.addEventListener("blur", releaseAllDrags);
    window.addEventListener("pointercancel", releaseAllDrags);
    window.addEventListener("resize", () => {
      releaseAllDrags();
      refreshBootChoices();
      state.openWindows.forEach((win) => clampToViewport(win));
    });
    document.addEventListener("mousemove", (event) => {
      elements.cursor.style.transform = `translate(${event.clientX + 14}px, ${event.clientY + 14}px)`;
    });
  }

  function initialise() {
    migrateLegacyEdits();
    migrateContentRevisions();
    bindControls();
    renderAll();
    refreshBootChoices();
    setEditorStatus(ui().view);
    scheduleVideoReveal();
  }

  initialise();
})();
