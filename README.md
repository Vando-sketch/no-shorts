# No Shorts

A small browser extension that removes YouTube Shorts. No tracking, no remote code, no account. Works in Chrome, Brave, Edge and Firefox (Manifest V3).

## What it does

- Hides Shorts shelves and grids on the home page, subscriptions, search results, watch-page sidebar and channel pages
- Hides single Shorts tiles mixed into feeds and search results
- Removes the Shorts entry from the sidebar / mini sidebar and the Shorts tab on channels
- Hides the "Shorts" filter chip in search
- Hides Shorts in the notification menu
- Works on the mobile site **m.youtube.com** too (bottom bar, shelves, tiles)
- Opens any `/shorts/<id>` link in the normal video player (`/watch?v=<id>`), whether you click it on YouTube, type it, or come from another site
- On/off switch in the toolbar popup (plus a separate switch for the redirect). Changes apply instantly, no reload.

## Install (unpacked)

**Chrome / Brave / Edge**
1. Download or clone this repo.
2. Open `chrome://extensions` (Brave: `brave://extensions`), turn on **Developer mode**.
3. Click **Load unpacked** and pick the repo folder.

**Firefox** (128+)
1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…** and pick `manifest.json`.
   Temporary add-ons are removed when Firefox restarts. For a permanent install the extension has to be signed through addons.mozilla.org.

## How it works

| Part | File | Job |
|---|---|---|
| CSS rules | `content/hide.css` | Hides everything Shorts-related. Injected at `document_start`, so nothing flashes. All rules are scoped to `html[data-disable-shorts]`, so the toggle just flips that attribute. |
| Content script | `content/content.js` | Sets the attribute, catches clicks on Shorts links and YouTube's in-app navigations, and has a fallback that hides shelves whose heading is literally "Shorts" (for when YouTube ships new markup). |
| Redirect rule | `rules/redirect.json` | `declarativeNetRequest` rule that turns `/shorts/<id>` page loads into `/watch?v=<id>` before the page even loads. |
| Popup | `popup/` | The two switches. Settings are kept in `storage.sync`. |

Selectors are matched on stable things where possible (`href^="/shorts/"`, `is-shorts`, Shorts-specific element names) instead of translated text, so it works with any YouTube language. Checked against live YouTube (desktop and mobile, German UI) on 2026-11-25.

## When YouTube changes something

YouTube renames its elements every few months. If Shorts show up again, open DevTools on the leftover element, find the nearest `ytd-…`/`ytm-…`/`…-view-model` wrapper, and add it to `content/hide.css`.
