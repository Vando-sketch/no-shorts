// No Shorts — content script (runs at document_start on youtube.com and m.youtube.com).
(() => {
  "use strict";

  const api = chrome; // Firefox also provides chrome.* with callbacks
  const ATTR = "data-disable-shorts";
  const HIDDEN = "ds-hidden-by-js";
  const DEFAULTS = { enabled: true, redirect: true };
  const settings = { ...DEFAULTS };

  // Turn hiding on right away (default), so Shorts never flash before storage answers.
  document.documentElement.setAttribute(ATTR, "");

  // ---------- Redirect /shorts/<id> to /watch?v=<id> ----------

  const shortsId = (url) => {
    const m = /^\/shorts\/([A-Za-z0-9_-]{6,})/.exec(url.pathname);
    return m ? m[1] : null;
  };

  const watchUrlFor = (href) => {
    let url;
    try { url = new URL(href, location.href); } catch { return null; }
    if (!/(^|\.)youtube\.com$/.test(url.hostname)) return null;
    const id = shortsId(url);
    if (!id) return null;
    const out = new URL("/watch", url.origin);
    out.searchParams.set("v", id);
    return out.href;
  };

  let loaded = false; // don't redirect on defaults before the user's settings are known
  const redirectActive = () => loaded && settings.enabled && settings.redirect;

  const checkLocation = () => {
    if (!redirectActive()) return;
    const target = watchUrlFor(location.href);
    if (target) location.replace(target);
  };

  // Catch clicks on Shorts links before YouTube's own router handles them.
  const onClick = (e) => {
    if (!redirectActive() || e.defaultPrevented || e.button > 1) return;
    const a = e.target instanceof Element ? e.target.closest("a[href]") : null;
    if (!a) return;
    const target = watchUrlFor(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (e.button === 1 || e.ctrlKey || e.metaKey || e.shiftKey) window.open(target, "_blank");
    else location.assign(target);
  };
  document.addEventListener("click", onClick, true);
  document.addEventListener("auxclick", onClick, true);

  // YouTube is a single-page app: also check after its internal navigations.
  for (const ev of ["yt-navigate-start", "yt-navigate-finish", "state-navigatestart", "state-navigateend"]) {
    document.addEventListener(ev, checkLocation, true);
  }
  window.addEventListener("popstate", checkLocation);
  if (globalThis.navigation?.addEventListener) {
    navigation.addEventListener("navigatesuccess", checkLocation);
  }
  checkLocation();

  // ---------- Fallback: hide shelves titled "Shorts" that CSS can't identify ----------

  const SHELF_HOSTS = [
    "ytd-rich-section-renderer", "ytd-shelf-renderer", "ytd-horizontal-card-list-renderer",
    "ytm-rich-section-renderer", "grid-shelf-view-model",
  ].join(",");
  const TITLE_SEL = "#title, #title-text, .shelf-title, h2, h3, .yt-shelf-header-layout__title, [role=heading]";
  const SHORTS_WORD = /^\s*#?shorts\s*$/i;
  // A *video* that happens to be titled "Shorts" must never take its section down with it.
  const VIDEO_ITEM = "ytd-video-renderer, ytd-rich-item-renderer, ytd-compact-video-renderer, yt-lockup-view-model, ytm-video-with-context-renderer, ytm-rich-item-renderer";

  const sweep = () => {
    if (!settings.enabled) return;
    for (const title of document.querySelectorAll(TITLE_SEL)) {
      if (!SHORTS_WORD.test(title.textContent) || title.closest(VIDEO_ITEM)) continue;
      const host = title.closest(SHELF_HOSTS);
      if (host && !host.classList.contains(HIDDEN)) host.classList.add(HIDDEN);
    }
    // Search / channel filter chips labelled "Shorts".
    for (const chip of document.querySelectorAll("yt-chip-cloud-chip-renderer, chip-shape, ytm-chip-cloud-chip-renderer")) {
      if (SHORTS_WORD.test(chip.textContent) && !chip.classList.contains(HIDDEN)) chip.classList.add(HIDDEN);
    }
  };

  let queued = false;
  const queueSweep = () => {
    if (queued) return;
    queued = true;
    setTimeout(() => { queued = false; sweep(); }, 250);
  };
  new MutationObserver(queueSweep).observe(document.documentElement, { childList: true, subtree: true });

  // ---------- Settings ----------

  const apply = () => {
    document.documentElement.toggleAttribute(ATTR, settings.enabled);
    if (settings.enabled) { sweep(); checkLocation(); }
  };

  api.storage.sync.get(DEFAULTS, (stored) => {
    Object.assign(settings, stored);
    loaded = true;
    apply();
  });

  api.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync") return;
    for (const [k, { newValue }] of Object.entries(changes)) {
      if (k in DEFAULTS) settings[k] = newValue ?? DEFAULTS[k];
    }
    apply();
  });
})();
