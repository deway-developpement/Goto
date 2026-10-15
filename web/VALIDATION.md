# Local validation — 15 October 2026, revised design

- Restored the original white/black layout, DM Sans, cyan copilot accent, pill buttons,
  three-photo vertical carousel, and draggable before/after landscape comparison.
- Restored original hero: unshaded carousel photos, centered slogan below, controlled title lines. Restored app descriptions/screenshots
  and a four-tab app explorer. Team portraits have been removed; names remain in footer credits.
- Visible download choices are Android and iOS, with small 36.3 MB and 11.2 MB labels.
- Pricing and its navigation have been removed.
- Vertical app journey: click and Up/Down keyboard selection verified; one panel visible at a time.
- Footer links have no decorative arrows. Comparator has no pointer-focus outline or blue frame.
- Phone frame has no shadow; simulator bars are absent.
- Four sharper original screens extracted unchanged from the project defense PDF; transparent
  phone outlines rendered in CSS, paired with original carousel/copilot photographs.
- Download panel enlarged; exactly two platform actions remain.
- Rebuilt the static darkhttpd container. Non-root UID/GID 65532, read-only root filesystem,
  no capabilities, 32 MiB memory limit. APK and ZIP are included unchanged.
- Public HTML/assets in the integrated v8: 2,012,476 bytes. The APK and ZIP are only loaded when downloaded.
- Browser checks at 1440, 960, 900, 768, 390 and 320 px: no horizontal overflow, no broken images or
  browser/CSP errors. Carousel autoplay, hover pause, dots, arrow keys and range comparison work.
- No pause button; exactly two action buttons, Android and iOS, in a single download row.
- Full downloads of both provided builds verified by SHA-256.
- Tested through an isolated local Caddy reverse proxy. CSS gzip and immutable caching,
  HTML revalidation, APK range/revalidation and Pricing 410 validated.
- Apple ZIP range request: 206, application/zip, attachment disposition.
- Directory listing, .git/config, Dockerfile and missing paths are inaccessible.

APK SHA-256: b881bf33ad75220ac2b6fc06ee7e5be64cef645df41be2b26b4d77a765aa298a

ZIP SHA-256: 7fe1d8d2a8b7f673201aebfad3d8f4ac92154fa02f733032541eda44894b6b6e

Limits: no Android-device or iOS-simulator execution test, no public DNS/TLS cutover,
no production proxy changes, no GHCR publication, and no CI/CD workflow activated.

Latest scroll correction (v8):
- The former 961×760 gate excluded narrow previews and laptop-height windows; the former
  manual/focus lock could indefinitely stop automatic progression. Both are replaced.
- Desktop (>960 px, height ≥650 px): pinned scene sized to the viewport, four scroll steps,
  overlapping outgoing/incoming screen fades, device movement, marker repositioning and photo parallax.
- Compact/short viewport: readable vertical four-step story and a smaller sticky visual.
  All step descriptions remain present, without forcing the desktop scene into the screen.
- Clicking selects immediately; moving another 80 px resumes scroll progression, even with focus on a tab.
- Reduced motion cancels current animations, disables sticky visuals and automatic selection.
- Real Playwright wheel gestures down/up traverse all steps at 1440×1000, 1100×700,
  1024×650, 900×800, 768×900, 390×844, 320×568 and 844×390.
- Chromium touchStart/touchMove/touchEnd gestures traverse all four mobile steps.
  This is browser emulation, not a physical phone test.
- Intermediate fade opacity verified between 0 and 1, outgoing clone removed after completion,
  exactly one accessible app panel; click-to-wheel recovery and live resize verified.
- Existing carousel, keyboard, comparison, download checks pass. No horizontal overflow,
  broken images or browser/CSP errors. Both provided downloads still match SHA-256.

Source/build separation: editable files moved to `src/` with stable filenames. The Docker build
generates fingerprinted files in its build stage; local `dist/` output is ignored by Git.
The complete generated site matches the previously validated image content byte for byte.
