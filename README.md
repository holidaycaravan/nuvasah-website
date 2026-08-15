# Nuvasah Interiors — Website

Marketing website for **Nuvasah Interiors**, an interior design studio creating warm,
uncluttered homes for families across India. Built as a lightweight, dependency-free
static site (plain HTML/CSS/JS) so it can be hosted anywhere — currently deployed via
GitHub Pages.

**Live site:** https://holidaycaravan.github.io/nuvasah-website/

## Project structure

```
nuvasah-website/
├── index.html              # Home page (repo root)
├── css/
│   ├── variables.css       # Design tokens (color, type, spacing) — loaded first
│   └── main.css            # Base styles + component/layout patterns
├── js/
│   └── main.js             # Site scripts (contact-form logic lands in Milestone 6)
├── pages/
│   ├── about.html
│   ├── philosophy.html
│   ├── services.html
│   ├── process.html
│   ├── portfolio.html      # Placeholder until Milestone 5
│   └── contact.html
├── assets/
│   ├── images/             # Local imagery (currently using external Unsplash URLs)
│   └── video/
├── style-reference.html    # Standalone design reference (not linked from the site)
└── palette-explorer.html   # Standalone palette-comparison tool (not linked from the site)
```

## Design system

Defined as CSS custom properties in `css/variables.css`.

**Palette — Deep Teal & Warm Sand** (client-approved):

| Token | Value | Role |
| --- | --- | --- |
| `--color-bg` | `#F4EFE4` | Warm sand background |
| `--color-bg-alt` | `#EBE3D2` | Deeper section background |
| `--color-ink` | `#26221D` | Primary text |
| `--color-accent` | `#1F3A34` | Deep teal — primary accent |
| `--color-accent-2` | `#C97B4A` | Burnt orange — CTAs / highlights |
| `--color-line` | `#E3D8C4` | Borders, dividers |

**Typography:** Playfair Display (headings) + Inter (body), loaded from Google Fonts.

Reusable layout/component patterns in `css/main.css`: `.hero`, `.photo-band`,
`.icon-row`, `.project-showcase`, `.card`, `.btn` / `.btn-primary`, `.site-header` /
`.site-nav`, `.site-footer`, and form styling.

## Running locally

No build step. Open `index.html` directly, or serve the folder so relative paths and
fonts behave exactly as in production:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deployment (GitHub Pages)

The site deploys from the `main` branch, root folder. To enable (one-time):

**Settings → Pages → Build and deployment → Source: Deploy from a branch →
Branch: `main` → Folder: `/ (root)` → Save.**

After that, every push to `main` redeploys automatically.

## Milestone status

- ✅ **M1** — Project structure
- ✅ **M2** — Design system (revised to the Deep Teal & Warm Sand palette in M4)
- ✅ **M4** — Core static pages: Home, About, Philosophy, Services, Process, Contact
- ⏳ **M5** — Full portfolio (residential/commercial split, per-project galleries + video)
- ⏳ **M6** — Contact form submission via WhatsApp (`js/main.js`)

## Before launch — copy still to fill

Some client-approved pages contain bracketed placeholders that need real values:

- `pages/about.html` — `[FOUNDER NAME]`, `[FOUNDER BACKGROUND]`, `[FOUNDER PRONOUN]`,
  `[CITIES SERVED]`, `[SHORT FOUNDER QUOTE …]`
- `pages/services.html` — `[CITIES SERVED]`, pricing range, project timeline
