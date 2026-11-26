# Contributing

Thanks for helping keep Shorts out of YouTube. This project is small on purpose: plain CSS, one content script, one redirect rule, no build step, no dependencies.

## Shorts showing up again?

That is the most useful thing you can report. YouTube renames its elements every few months.

1. Open an issue with the **Shorts are showing** template.
2. Say which page it is on (home, search, a channel, the watch page, mobile site) and add a screenshot.
3. If you can, right-click the leftover element, choose **Inspect**, and paste the name of the nearest wrapper element (it starts with `ytd-`, `ytm-` or ends with `-view-model`).

## Sending a fix

1. Fork the repo and load your copy unpacked (see [README](README.md#install)).
2. Make the change. Most fixes are one new selector in [`content/hide.css`](content/hide.css).
3. Reload the extension on the extensions page, then reload YouTube and check that:
   - the Shorts element is gone,
   - normal videos next to it are still there,
   - turning the switch off in the popup brings Shorts back without a page reload.
4. Open a pull request. Say which page you tested and in which browser.

## Rules for selectors

- Scope every rule to `html[data-disable-shorts]`, so the popup switch keeps working.
- Match on stable things: `href^="/shorts/"`, `is-shorts`, Shorts-specific element names. Do not match on translated text; it breaks for other languages.
- Never hide a container that can also hold normal videos, unless the rule checks that it only holds Shorts (`:has(...)`).

## What will not be merged

- Tracking, analytics, remote code or network requests of any kind.
- New permissions, unless there is no other way and the reason is written down.
- Build tools or dependencies.
- Features unrelated to Shorts.

## Conduct

By taking part you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).
