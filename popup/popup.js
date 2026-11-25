const DEFAULTS = { enabled: true, redirect: true };
const $ = (id) => document.getElementById(id);
const enabled = $("enabled"), redirect = $("redirect"), hint = $("hint");

const render = (s) => {
  enabled.checked = s.enabled;
  redirect.checked = s.redirect;
  redirect.closest(".row").classList.toggle("disabled", !s.enabled);
  hint.textContent = s.enabled ? "Shorts are hidden on YouTube." : "Paused. Shorts are visible again.";
};

// The static redirect rule handles typed URLs / links from other sites; keep it in sync.
const syncRules = (s) => {
  const on = s.enabled && s.redirect;
  chrome.declarativeNetRequest.updateEnabledRulesets(
    on ? { enableRulesetIds: ["redirect"] } : { disableRulesetIds: ["redirect"] }
  );
};

const save = () => {
  const s = { enabled: enabled.checked, redirect: redirect.checked };
  chrome.storage.sync.set(s);
  syncRules(s);
  render(s);
};

chrome.storage.sync.get(DEFAULTS, render);
enabled.addEventListener("change", save);
redirect.addEventListener("change", save);
