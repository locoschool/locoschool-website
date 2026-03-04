# UX Visual Critic — Persistent Memory

## Project Identity
- **Loco School** — nonprofit robotics academy, single-page static site
- Files: `index.html`, `css/styles.css`, `js/main.js` (no build system)
- Deployed via GitHub Pages

## Design System (Confirmed)
- Background: `#0d0d12`
- Primary: `#6c5ce7` (soft purple)
- Accent: `#00cec9` (teal/cyan)
- Text: `#e0e0e0`
- Glass: `--glass-bg: rgba(255,255,255,0.05)`, `--glass-border: rgba(255,255,255,0.1)`
- Font: `Outfit` (Google Fonts, loaded in `<head>`) — overrides CSS variable fallback stack via inline `<style>` in `<head>`

## Architecture Notes
- Font override pattern: CSS vars define system font stack, then `<style>` in `<head>` re-declares vars with Outfit. This is functional but redundant — see design-system.md
- `.course-details` divs are hidden in cards (`display:none`) and extracted via JS into modal — no server needed
- Gallery images collected dynamically from DOM at runtime, not a static array
- EmailJS credentials are hardcoded in `main.js` (public key only — acceptable for EmailJS)

## Known Issues (First Review — 2026-03-04)
See `review-2026-03-04.md` for full first-pass critique.

### Critical
1. Modal transition broken: `.modal` uses `display:none` + `opacity:0` simultaneously — the opacity transition never fires because `display:none` makes the element invisible before opacity can animate. The `show` class sets both `display:flex` AND `opacity:1` at once, so fade-in does not occur.
2. Course cards lack a visual affordance that they are clickable — no "click to learn more" hint, no cursor change in the card CSS (cursor:pointer only on the duplicate `.course-card` block at line 271–273).
3. Lightbox nav buttons (`.prev-btn` / `.next-btn`) use negative absolute positioning (`left:-80px`, `right:-80px`) which clips outside `.lightbox-content` on smaller screens and on mobile at 480px they are repositioned to `left:5px`/`right:5px` overlapping the image.
4. `alert()` used for form success/error feedback — breaks the glassmorphism aesthetic and is jarring UX.
5. Hero Ken Burns zoom is triggered by `hover` on the entire hero section (`transition: transform 5s ease`) — on desktop this means the background shifts whenever the user moves their mouse anywhere over the hero, creating distracting motion during normal reading.

### Notable
1. Section backgrounds alternate between `#111`, `#000`, `#0d0d12`, `#1a1a24` without a clear rhythm — the difference between `#000` and `#0d0d12` is imperceptible and adds maintenance noise.
2. Duplicate `.course-card` rule block (lines 230–238 and 271–273, plus hover repeated at lines 240–244 and 275–279).
3. LOCOboard `margin-bottom: 6rem` on `.locoboard-showcase` is dead space — no content follows it inside the section.
4. `locoboard-hero-image` has `justify-content: flex-start` while the responsive rule at 900px changes it to `center` — the desktop asymmetry is intentional but the image is `max-width:80%` which leaves a large dead gap on the right at wide viewports.
5. Gallery section title says "Impressions" — unclear label for a photo gallery; "Gallery" or "In the Classroom" would communicate faster.
6. Footer logo loses the `<img>` element present in the `<nav>` logo — inconsistent brand treatment.
7. No visible active state on nav links to indicate current section while scrolling.
8. `scroll-behavior: smooth` on `<html>` duplicates the JS smooth scroll implementation — both fire simultaneously.
9. `.locoboard-showcase` has no `backdrop-filter` or glass treatment, making it visually inconsistent with the rest of the page's card vocabulary.
10. Project descriptions are extremely thin ("Mobile humidifier robot." — one sentence) with no context about what the student learned or the technical challenge.

## Recurring Patterns to Watch
- Section padding is consistently `6rem 0` on desktop — good rhythm
- All interactive cards use `translateY(-10px)` on hover — consistent
- Glass card pattern is `--glass-bg` background + `--glass-border` border + `border-radius: 20px` — standard across course, team, contact sections
