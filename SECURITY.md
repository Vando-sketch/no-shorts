# Security

## What the extension can do

- It runs only on `youtube.com`, `www.youtube.com` and `m.youtube.com`.
- It asks for two permissions: `storage` (remembers the two switches) and `declarativeNetRequest` (one static rule that turns `/shorts/<id>` into `/watch?v=<id>`).
- It makes no network requests, loads no remote code and collects no data.

## Supported versions

Only the latest version on the `main` branch gets fixes.

## Reporting a problem

Please do not open a public issue for a security problem.

Use GitHub's private reporting instead: open the **Security** tab of this repository and click **Report a vulnerability**.

Things worth reporting:

- the extension running on, or redirecting to, a site other than YouTube,
- a way for a web page to change the extension's settings,
- any path that sends data off your device.

Shorts that are not hidden are a normal bug, not a security problem. Please use the issue tracker for those.
