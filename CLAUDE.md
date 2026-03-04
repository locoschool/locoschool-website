# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static single-page website for **Loco School**, a nonprofit robotics academy. No build system, package manager, or framework — just `index.html`, `css/styles.css`, and `js/main.js`. Deployed via GitHub Pages (`.nojekyll` present).

## Development

Open `index.html` directly in a browser to preview. There are no build, lint, or test commands.

## Architecture

### Page Structure
A single scrollable page with anchor-linked sections: Hero → Courses → LOCOboard → Projects → Gallery → Team → Contact → Footer.

### CSS Design System (`css/styles.css`)
Dark glassmorphism theme with CSS custom properties:
- `--bg-color: #0d0d12` (near-black background)
- `--primary-color: #6c5ce7` (soft purple)
- `--accent-color: #00cec9` (teal/cyan)
- `--glass-bg / --glass-border` for translucent card surfaces

The `Outfit` font (Google Fonts) overrides the system font stack defined in CSS variables.

### JavaScript (`js/main.js`)
All interactivity is in one file with no modules:

- **Course modal**: `openModal(cardElement)` extracts content from hidden `.course-details` divs inside each `.course-card` and injects it into `#courseModal`. Adding a new course means adding an `<article class="course-card" onclick="openModal(this)">` with a `.course-details` child.

- **Gallery lightbox**: `openGallery(index)` / `changeSlide(step)` dynamically collect all `.gallery-item img` sources from the DOM at runtime. Adding gallery images only requires adding `.gallery-item` divs to the HTML.

- **Horizontal scroll gallery**: `scrollGallery(direction)` scrolls `.gallery-scroll` by 1/3 of its width, wrapping at boundaries.

- **Contact form**: Uses EmailJS SDK (CDN). Credentials are hardcoded: public key `ZDUKythU-Ofg8KbGE`, service ID `service_787x9tb`, template ID `template_th4mj2j`. Messages are sent to `tatarchm@gmail.com`.

### External Dependencies (CDN only)
- Google Fonts — Outfit typeface
- EmailJS browser SDK (`@emailjs/browser@4`) — contact form delivery
