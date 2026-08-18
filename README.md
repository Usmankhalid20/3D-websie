# Tissot PRX Powermatic 80 — Scrollytelling Landing Page

> An Apple-level, Awwwards-quality cinematic scrollytelling experience for the **Tissot PRX Powermatic 80** — built with Next.js 14, Framer Motion, and HTML5 Canvas.

---

## ✦ Overview

This project is an ultra-premium, scroll-driven product storytelling experience inspired by Apple product pages and Swiss luxury watch campaigns. As the user scrolls, a **240-frame image sequence** plays across a full-screen HTML5 canvas, guiding them through 13 cinematic sections — from the hero watch reveal, through a detailed engineering disassembly, to a satisfying mechanical reassembly.

The experience is designed to answer one question per section:

> *"What am I learning about this watch that I couldn't understand from the previous section?"*

---

## ✦ Live Preview

```
http://localhost:3000
```

---

## ✦ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Animation | Framer Motion |
| Rendering | HTML5 Canvas (image sequence playback) |
| Styling | Vanilla CSS Modules |
| Typography | Inter (Google Fonts) |
| Build Tool | Turbopack |

---

## ✦ Features

### 🎬 13 Cinematic Scroll Sections
| # | Section | Story |
|---|---------|-------|
| 01 | The Icon | Hero assembled watch — cinematic beauty shot |
| 02 | The Silhouette | Case & bracelet integration revealed through rotation |
| 03 | The Case | Brushed planes, polished bevels, crown geometry |
| 04 | The Crystal | Sapphire glass rises — clarity engineering |
| 05 | The Dial | Waffle-pattern macro, applied indices, date window |
| 06 | The Hands | Three polished hands, central pinion relationship |
| 07 | The Date | Mechanical date disc behind the aperture |
| 08 | The Movement | Full disassembly — Powermatic 80 revealed |
| 09 | The Mechanics | Gear train, balance wheel, escapement detail |
| 10 | 80 Hours | Oversized typographic power reserve display |
| 11 | The Bracelet | Individual links, clasp construction, integration |
| 12 | The Assembly | All 168 components returning to position |
| 13 | The Finish | Watch reassembled — return to hero configuration |

### ⏪ Non-Linear Frame Mapping (Reassembly Effect)
```
Scroll  0% → 84%  :  Frames   0 → 220  (forward — disassembly)
Scroll 84% → 100% :  Frames 220 →   0  (reverse — reassembly)
```
The sequence plays **backward** for the final three sections, creating a physically satisfying reassembly without any duplicate assets.

### ✦ Component Architecture
```
app/
├── globals.css            Design system tokens, typography, animations
├── layout.tsx             Root layout + SEO metadata
└── page.tsx               Main page orchestrator

components/
├── ScrollSequence.tsx     Canvas engine — 240 frames, non-linear mapping, 13 beats
├── StoryOverlay.tsx       Animated text panels (section numbers, stat display, 4 layouts)
├── SectionNavigator.tsx   Named section list with vertical progress track
├── CursorParallax.tsx     LERP cursor-driven subtle parallax for depth perception
├── Navbar.tsx             Ultra-minimal fixed nav — glass on scroll
├── LoadingScreen.tsx      Cinematic loading screen with frame-count progress bar
├── ScrollIndicator.tsx    Animated mouse-scroll hint (auto-hides after scroll)
├── HeritageSection.tsx    Brand timeline (1853 → Now) + editorial copy
└── SpecsSection.tsx       Key facts bar + 16-row technical specification grid

public/
└── frames/                240 × ezgif-frame-XXX.jpg (watch image sequence)
```

---

## ✦ Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd tissot-prx-landing

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## ✦ Project Structure

```
tissot-prx-landing/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── page.module.css
├── components/
│   ├── BeatNav.tsx / .module.css
│   ├── CursorParallax.tsx
│   ├── HeritageSection.tsx / .module.css
│   ├── LoadingScreen.tsx / .module.css
│   ├── Navbar.tsx / .module.css
│   ├── ScrollIndicator.tsx / .module.css
│   ├── ScrollSequence.tsx / .module.css
│   ├── SectionNavigator.tsx / .module.css
│   ├── SpecsSection.tsx / .module.css
│   └── StoryOverlay.tsx / .module.css
├── public/
│   └── frames/               ← 240 image frames (not tracked in git)
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## ✦ Design System

### Color Palette
| Token | Value | Usage |
|---|---|---|
| Background primary | `#050507` | Page base |
| Background canvas | `#04060d` | Canvas & image match |
| Text primary | `rgba(255,255,255,0.92)` | Headlines |
| Text secondary | `rgba(255,255,255,0.52)` | Body copy |
| Accent (steel blue) | `#8aa4c8` | Overlines, active states |
| Accent dim | `#536b87` | Dots, separators |

### Typography
- **Font:** Inter (Google Fonts), system-ui fallback
- **Headlines:** `clamp(1.9rem, 3.8vw, 3.1rem)`, weight 700, tracking `-0.028em`
- **Overlines:** `0.6rem`, weight 600, `0.18em` letter-spacing, uppercase
- **Body:** `clamp(0.82rem, 1.1vw, 0.95rem)`, weight 400, `1.7` line-height

### Motion Principles
- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` — luxe deceleration throughout
- **Entry animations:** `opacity + y-translate + blur` staggered reveal
- **Cursor parallax:** LERP strength `0.008`, max ~±4px displacement
- **Frame playback:** `requestAnimationFrame` + `Math.round()` frame snapping
- **No cartoon physics.** No neon effects. No random rotations.

---

## ✦ Performance Notes

- **Progressive frame loading:** First 24 frames load immediately (LCP priority), remaining 216 stream in at 2ms intervals
- **DPR-correct canvas:** `ctx.setTransform` reset prevents scale accumulation on resize
- **Bidirectional frame fallback:** If the target frame isn't loaded yet, the nearest loaded frame (in either direction) is rendered instantly
- **RAF-gated rendering:** Scroll events are debounced to a single `requestAnimationFrame` call per frame
- **CSS transform only:** CursorParallax uses `translate3d` exclusively — zero layout reflow

---

## ✦ Browser Support

| Browser | Status |
|---|---|
| Chrome 100+ | ✅ Full support |
| Firefox 100+ | ✅ Full support |
| Safari 15.4+ | ✅ Full support |
| Edge 100+ | ✅ Full support |
| Mobile Chrome/Safari | ✅ Responsive layout |

---

## ✦ Customization

### Changing Scroll Section Copy
Edit `STORY_BEATS` in [`components/ScrollSequence.tsx`](./components/ScrollSequence.tsx).

Each beat defines:
```typescript
{
  index:      number,          // Section number (01–13)
  id:         string,          // Unique identifier
  startPct:   number,          // Scroll start (0–1)
  endPct:     number,          // Scroll end (0–1)
  label:      string,          // Navigator label
  headline:   string,          // Section headline (\n for line breaks)
  body?:      string,          // Optional supporting copy
  highlights?: string[],       // Optional bullet points
  align:      'left' | 'right' | 'center' | 'center-large'
}
```

### Changing the Frame Sequence
Replace the JPG files in `public/frames/` following the naming convention:
```
ezgif-frame-001.jpg → ezgif-frame-240.jpg
```
Update `TOTAL_FRAMES` in `ScrollSequence.tsx` if the frame count changes.

### Adjusting Scroll Height
Change `height` in `ScrollSequence.module.css`:
```css
.sequenceContainer {
  height: 650vh; /* Increase for more scroll travel per section */
}
```

---

## ✦ Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

> **Note:** The `public/frames/` directory contains 240 JPEG images (~11MB total). Ensure your deployment platform serves static assets efficiently. Consider a CDN for production.

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## ✦ License

This project is created for demonstration and portfolio purposes.  
All Tissot and PRX product assets, trademarks, and imagery are copyright © **Tissot SA / Swatch Group**, Le Locle, Switzerland.  
Not for commercial use without explicit authorization from Tissot SA.

---

## ✦ Credits

- **Watch image sequence** — Tissot SA product visualization
- **Typography** — Inter by Rasmus Andersson (Google Fonts)
- **Framework** — Next.js by Vercel
- **Animation** — Framer Motion by Framer

---

<p align="center">
  <sub>Built with precision. Tissot PRX Powermatic 80 — Le Locle, Switzerland, since 1853.</sub>
</p>
