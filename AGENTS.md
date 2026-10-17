# Project Agent Configuration

## Active Project Skills

This project is equipped with the following custom workspace skills located in `.agents/skills/`:

### 1. UI/UX Pro Max (`ui-ux-pro-max`)
- **Location:** `.agents/skills/ui-ux-pro-max/`
- **Description:** Design intelligence engine with 79 UI styles (50 active), 192 product reasoning profiles, 192 color palettes, 74 font pairings, 119 UX guidelines, and 25 chart types.
- **Search Command:**
  ```bash
  python .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" [--domain <domain>] [--stack <stack>]
  ```
- **Included Sub-Skills:**
  - `brand` (`.agents/skills/brand/`)
  - `design` (`.agents/skills/design/`)
  - `design-system` (`.agents/skills/design-system/`)
  - `slides` (`.agents/skills/slides/`)
  - `ui-styling` (`.agents/skills/ui-styling/`)
  - `banner-design` (`.agents/skills/banner-design/`)

### 2. GreenSock Animation Platform (`gsap-skills`)
- **Location:** `.agents/skills/`
- **Official GSAP Skills:**
  - `gsap-core` (`.agents/skills/gsap-core/SKILL.md`): Core tweens, eases, staggers, and responsive matchMedia.
  - `gsap-timeline` (`.agents/skills/gsap-timeline/SKILL.md`): Sequencing, labels, and timeline controls.
  - `gsap-scrolltrigger` (`.agents/skills/gsap-scrolltrigger/SKILL.md`): Scroll-linked animations and pinning.
  - `gsap-plugins` (`.agents/skills/gsap-plugins/SKILL.md`): ScrollTo, Flip, Draggable, TextPlugin, etc.
  - `gsap-react` (`.agents/skills/gsap-react/SKILL.md`): React / Next.js integration and useGSAP hook.
  - `gsap-frameworks` (`.agents/skills/gsap-frameworks/SKILL.md`): Vue, Svelte, Angular, Astro integrations.
  - `gsap-performance` (`.agents/skills/gsap-performance/SKILL.md`): 60 FPS optimization and best practices.
  - `gsap-utils` (`.agents/skills/gsap-utils/SKILL.md`): Utility functions (clamp, mapRange, interpolate).
- **Rules & Guardrails:** `.agents/rules/gsap.md`
