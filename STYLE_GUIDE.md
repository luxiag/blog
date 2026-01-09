# Cloudflare Sandbox SDK - Style Guide

## Overview

This style guide documents the design system used in the Cloudflare Sandbox SDK landing page. The design follows a minimalist, technical aesthetic with a monochromatic color scheme, geometric patterns, and clean typography. The overall feel is modern, developer-focused, and professional.

### Design Philosophy
- **Minimalist**: Clean layouts with purposeful whitespace
- **Technical**: Monospace fonts, code blocks, terminal-style elements
- **Geometric**: Grid patterns, circles, and connecting lines
- **High Contrast**: Dark borders on light backgrounds for clarity

---

## Color Palette

### Primary Colors

| Color Name | Value | Usage |
|------------|-------|-------|
| Foreground | `oklch(0.145 0 0)` | Text, borders, icons, solid fills |
| Background | `#f5f5f5` | Page background |
| White | `#ffffff` | Card backgrounds, containers |
| Orange Accent | `#ea580c` | Highlights, code strings, connectors |

### CSS Variables

```css
:root {
    --background: #f5f5f5;
    --foreground: oklch(0.145 0 0);
    --color-orange-800: #ea580c;
    --color-neutral-100: #f5f5f5;
    --color-neutral-200: oklch(0.145 0 0);
    --color-neutral-300: oklch(0.145 0 0);
    --color-neutral-400: oklch(0.145 0 0);
    --color-neutral-500: oklch(0.145 0 0);
    --color-neutral-950: oklch(0.145 0 0);
    --border-color: oklch(0.145 0 0);
}
```

### Color Usage Guidelines

1. **Text**: All text uses `oklch(0.145 0 0)` for maximum readability
2. **Borders**: Consistent `oklch(0.145 0 0)` for all borders (1px solid)
3. **Accent**: Orange (`#ea580c`) used sparingly for:
   - Code string highlighting
   - Decorative pipe connectors
   - Interactive element highlights
4. **Backgrounds**: White for cards, light gray (`#f5f5f5`) for page background

---

## Typography

### Font Families

```css
--font-sans: "Inter", system-ui, sans-serif;
--font-mono: "IBM Plex Mono", monospace;
```

### Font Stack

| Font | Usage |
|------|-------|
| Inter | Headlines, body text, UI elements |
| IBM Plex Mono | Code blocks, terminal text, technical labels |

### Font Sizes

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Hero Title (Features) | 100px | 900 (Black) | 1 |
| Section Title | 18px | 600 (Semibold) | 1.25 |
| Body Text | 16px | 400 (Regular) | 1.5 |
| Code Text | 13px | 400 (Regular) | 1.6 |
| Small Labels | 10-12px | 400-500 | 1.5 |
| NPM Badge | 13px | 400 (Regular) | 1.5 |

### Typography Hierarchy

```css
/* Hero Title - Striped Effect */
.features-title {
    font-size: 100px;
    font-weight: 900;
    letter-spacing: -0.02em;
    line-height: 1;
    background: repeating-linear-gradient(
        0deg,
        var(--foreground) 0px,
        var(--foreground) 4px,
        transparent 4px,
        transparent 8px
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* Section Title */
.feature-card-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--foreground);
}

/* Body Text */
.feature-card-desc {
    font-size: 16px;
    color: var(--color-neutral-500);
    line-height: 1.5;
}

/* Code/Mono Text */
.code-file-content {
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.6;
}
```

### Font Weight Scale

| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Body text, descriptions |
| Medium | 500 | Labels, emphasized text |
| Semibold | 600 | Section titles, headings |
| Bold | 700 | Strong emphasis |
| Black | 900 | Hero titles only |

---

## Spacing System

### Base Unit
The spacing system uses a 4px base unit with common multipliers.

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight gaps, inline spacing |
| sm | 8px | Small gaps, icon margins |
| md | 12px | Medium gaps, padding |
| lg | 16px | Standard padding, gaps |
| xl | 20px | Section padding |
| 2xl | 24px | Large section padding |
| 3xl | 32px | Extra large spacing |

### Common Padding Values

```css
/* Card padding */
padding: 24px;

/* Header padding */
padding: 12px 20px;

/* Button/Badge padding */
padding: 8px 16px;

/* Code block padding */
padding: 16px;

/* Small element padding */
padding: 6px 12px;
```

### Gap Values

```css
/* Standard gap */
gap: 8px;

/* Medium gap */
gap: 12px;

/* Large gap */
gap: 16px;

/* Section gap */
gap: 24px;
```

---

## Component Styles

### Cards

#### Main Card Container
```css
.main-card {
    background: white;
    border: 1px solid var(--color-neutral-200);
    margin: 20px;
    border-radius: 12px;
    overflow: hidden;
}
```

#### Card Header
```css
.main-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    border-bottom: 1px solid var(--color-neutral-200);
}
```

#### Feature Block
```css
.feature-block {
    padding: 24px;
    border-bottom: 1px solid var(--color-neutral-200);
}
```

### Buttons & Interactive Elements

#### NPM Badge Link
```css
.npm-badge-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border: 1px solid var(--color-neutral-200);
    border-radius: 8px;
    cursor: pointer;
    position: relative;
    transition: background-color 0.2s;
}

.npm-badge-link:hover {
    background-color: var(--color-neutral-100);
}
```

#### Window Control Dots
```css
.card-dot {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    border: 1px solid var(--color-neutral-300);
    background: white;
}
```

### Code Blocks

#### Code File Container
```css
.code-file {
    border: 1px solid var(--color-neutral-200);
    border-radius: 8px;
    overflow: hidden;
    background: white;
}

.code-file-header {
    padding: 8px 12px;
    border-bottom: 1px solid var(--color-neutral-200);
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--color-neutral-500);
    background: var(--color-neutral-100);
}

.code-file-content {
    padding: 16px;
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.6;
}
```

#### Syntax Highlighting
```css
.code-keyword {
    color: var(--foreground);
    font-weight: 500;
}

.code-function {
    color: var(--foreground);
}

.code-string {
    color: var(--color-orange-800);
}
```

### Icons with Double Circle Border

```css
.double-circle-icon {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 1px dashed var(--color-neutral-200);
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    position: relative;
}

.double-circle-icon::before {
    content: '';
    position: absolute;
    width: 75%;
    height: 75%;
    border-radius: 50%;
    border: 1px solid var(--color-neutral-200);
    background: white;
}
```

### Processing/Loading Box
```css
.processing-box {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 24px;
    border: 1px solid var(--color-neutral-200);
    border-radius: 8px;
    background: white;
    font-family: var(--font-mono);
    font-size: 14px;
}
```

### Chat Bubble
```css
.ai-bubble {
    background: white;
    border: 1px solid var(--color-neutral-200);
    border-radius: 8px;
    padding: 16px;
    font-size: 13px;
    line-height: 1.6;
    color: var(--color-neutral-500);
}
```

### Preview Tabs
```css
.preview-tab-item {
    background: white;
    border: 1px solid var(--color-neutral-200);
    border-radius: 4px;
    padding: 6px 12px;
    font-size: 11px;
    font-family: var(--font-mono);
    display: inline-block;
}
```

---

## Shadows & Elevation

### Shadow Scale

The design uses minimal shadows to maintain a flat, clean aesthetic.

| Level | Value | Usage |
|-------|-------|-------|
| None | `none` | Most elements |
| Subtle | `0 2px 4px rgba(0,0,0,0.05)` | Stacked cards |
| Tooltip | `0 2px 8px rgba(0,0,0,0.1)` | Tooltips, popovers |

```css
/* Tooltip shadow */
box-shadow: 0 2px 8px rgba(0,0,0,0.1);

/* Subtle card shadow */
box-shadow: 0 2px 4px rgba(0,0,0,0.05);
```

### Elevation Guidelines
- Primary elevation is achieved through borders, not shadows
- Shadows used only for floating elements (tooltips, dropdowns)
- Keep shadow opacity low (0.05-0.1) for subtlety

---

## Animations & Transitions

### Transition Durations

| Duration | Usage |
|----------|-------|
| 0.2s | Standard UI transitions |
| 1s | Loading spinner rotation |

### Standard Transitions

```css
/* Hover transitions */
transition: background-color 0.2s;
transition: opacity 0.2s;
transition: opacity 0.2s, visibility 0.2s;
```

### Loading Spinner

```css
.spinner {
    width: 16px;
    height: 16px;
    border: 2px solid var(--color-neutral-200);
    border-top-color: var(--foreground);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
```

### Tooltip Animation

```css
.npm-badge-link::after {
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s, visibility 0.2s;
}

.npm-badge-link:hover::after {
    opacity: 1;
    visibility: visible;
}
```

---

## Border Radius

### Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| none | 0 | Sharp corners |
| sm | 2px | Window dots |
| md | 4px | Small buttons, tabs |
| lg | 6px | Tooltips |
| xl | 8px | Cards, inputs, buttons |
| 2xl | 12px | Main containers |
| full | 50% | Circles, pills |

### Common Usage

```css
/* Main card */
border-radius: 12px;

/* Inner cards, buttons */
border-radius: 8px;

/* Tooltips */
border-radius: 6px;

/* Small elements, tabs */
border-radius: 4px;

/* Window dots */
border-radius: 2px;

/* Circles */
border-radius: 50%;
```

---

## Opacity & Transparency

### Opacity Values

| Value | Usage |
|-------|-------|
| 1 | Default state |
| 0.7 | Hover state for icons |
| 0 | Hidden elements |

### Transparency in Backgrounds

```css
/* Striped text effect - alternating transparent */
background: repeating-linear-gradient(
    0deg,
    var(--foreground) 0px,
    var(--foreground) 4px,
    transparent 4px,
    transparent 8px
);
```

---

## Decorative Patterns

### Dot Pattern
```css
.pattern-cell.dots {
    background-image: radial-gradient(
        circle, 
        var(--color-neutral-400) 1px, 
        transparent 1px
    );
    background-size: 6px 6px;
}
```

### Line Pattern (Diagonal)
```css
.pattern-cell.lines {
    background-image: repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 3px,
        var(--color-neutral-200) 3px,
        var(--color-neutral-200) 4px
    );
}
```

### Solid Fill
```css
.pattern-cell.solid {
    background: var(--foreground);
}
```

### Striped Text Effect
```css
background: repeating-linear-gradient(
    0deg,
    var(--foreground) 0px,
    var(--foreground) 4px,
    transparent 4px,
    transparent 8px
);
-webkit-background-clip: text;
background-clip: text;
-webkit-text-fill-color: transparent;
```

---

## Grid & Layout

### Two-Column Feature Layout
```css
.feature-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
}

.feature-section-left {
    border-right: 1px solid var(--color-neutral-200);
}
```

### Pattern Grid
```css
.right-patterns {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
}

.pattern-cell {
    border-right: 1px solid var(--color-neutral-200);
    border-bottom: 1px solid var(--color-neutral-200);
    aspect-ratio: 1;
}
```

---

## Common Tailwind CSS Equivalents

While this project uses vanilla CSS, here are Tailwind equivalents for common patterns:

### Colors
```
text-neutral-950 → oklch(0.145 0 0)
bg-neutral-100 → #f5f5f5
bg-white → #ffffff
text-orange-600 → #ea580c
border-neutral-200 → oklch(0.145 0 0)
```

### Typography
```
font-sans → font-family: Inter, system-ui, sans-serif
font-mono → font-family: IBM Plex Mono, monospace
text-lg → font-size: 18px
text-base → font-size: 16px
text-sm → font-size: 13px
text-xs → font-size: 11px
font-black → font-weight: 900
font-semibold → font-weight: 600
font-medium → font-weight: 500
```

### Spacing
```
p-6 → padding: 24px
p-4 → padding: 16px
p-3 → padding: 12px
p-2 → padding: 8px
gap-4 → gap: 16px
gap-3 → gap: 12px
gap-2 → gap: 8px
```

### Border Radius
```
rounded-xl → border-radius: 12px
rounded-lg → border-radius: 8px
rounded-md → border-radius: 6px
rounded → border-radius: 4px
rounded-sm → border-radius: 2px
rounded-full → border-radius: 50%
```

### Flexbox
```
flex → display: flex
items-center → align-items: center
justify-between → justify-content: space-between
flex-col → flex-direction: column
```

---

## Example Component Reference Code

### Feature Card Component

```html
<div class="feature-block">
    <h3 class="feature-card-title">Long-running processes</h3>
    <p class="feature-card-desc">
        Safely execute tasks that require extended computation or 
        monitoring without risking system stability or security.
    </p>
</div>
```

```css
.feature-block {
    padding: 24px;
    border-bottom: 1px solid var(--color-neutral-200);
}

.feature-card-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--foreground);
}

.feature-card-desc {
    font-size: 16px;
    color: var(--color-neutral-500);
    line-height: 1.5;
}
```

### Double Circle Icon Component

```html
<div class="double-circle-icon" style="width: 100px; height: 100px;">
    <svg style="position: relative; z-index: 1;" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="4" y="8" width="16" height="10" rx="2"/>
        <circle cx="9" cy="13" r="1.5" fill="currentColor"/>
        <circle cx="15" cy="13" r="1.5" fill="currentColor"/>
        <line x1="9" y1="16" x2="15" y2="16"/>
        <line x1="12" y1="4" x2="12" y2="8"/>
        <circle cx="12" cy="3" r="1"/>
    </svg>
</div>
```

```css
.double-circle-icon {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 1px dashed var(--color-neutral-200);
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    position: relative;
}

.double-circle-icon::before {
    content: '';
    position: absolute;
    width: 75%;
    height: 75%;
    border-radius: 50%;
    border: 1px solid var(--color-neutral-200);
    background: white;
}
```

### Code File Component

```html
<div class="code-file">
    <div class="code-file-header">app.py</div>
    <div class="code-file-content">
        <div><span class="code-keyword">for</span> i <span class="code-keyword">in</span> <span class="code-function">range</span>(5):</div>
        <div style="padding-left: 20px;"><span class="code-function">print</span>(<span class="code-string">f"Hello Python! On step {i}"</span>)</div>
        <div style="padding-left: 20px;">time.<span class="code-function">sleep</span>(1)</div>
    </div>
</div>
```

### NPM Badge with Tooltip

```html
<div class="npm-badge">
    <div class="npm-badge-link">
        <span class="package-name">npm i @cloudflare/sandbox</span>
        <span class="copy-label">COPY</span>
    </div>
    <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12..."/>
    </svg>
</div>
```

### Processing Box with Spinner

```html
<div class="processing-box">
    <div class="spinner"></div>
    <span>processing...</span>
</div>
```

```css
.processing-box {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 24px;
    border: 1px solid var(--color-neutral-200);
    border-radius: 8px;
    background: white;
    font-family: var(--font-mono);
    font-size: 14px;
}

.spinner {
    width: 16px;
    height: 16px;
    border: 2px solid var(--color-neutral-200);
    border-top-color: var(--foreground);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
```

### AI Chat Connector

```html
<div class="ai-chat-section">
    <div style="display: flex; align-items: center; gap: 0;">
        <div class="ai-icon-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
        </div>
        <div class="ai-line-h"></div>
        <div class="ai-dot"></div>
    </div>
    <div class="ai-bubble">
        Sure thing! I can guide you through implementing the issue 
        and opening a pull request. First, I need some details:
    </div>
</div>
```

---

## Accessibility Considerations

### Color Contrast
- All text uses `oklch(0.145 0 0)` on white/light gray backgrounds
- Contrast ratio exceeds WCAG AA standards

### Focus States
- Interactive elements should have visible focus indicators
- Consider adding `:focus-visible` styles for keyboard navigation

### Motion
- Animations are subtle and short (0.2s-1s)
- Consider `prefers-reduced-motion` media query for accessibility

```css
@media (prefers-reduced-motion: reduce) {
    .spinner {
        animation: none;
    }
    
    * {
        transition: none !important;
    }
}
```

---

## Browser Support

### Required Features
- CSS Custom Properties (CSS Variables)
- CSS Grid
- Flexbox
- `oklch()` color function
- `background-clip: text`
- CSS Animations

### Fallbacks
For browsers not supporting `oklch()`:
```css
color: #1a1a1a; /* Fallback */
color: oklch(0.145 0 0);
```

---

## File Structure

```
ui-design/
├── sandbox.html      # Main HTML file
├── STYLE_GUIDE.md    # This style guide
└── assets/           # (Optional) Images, icons
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-06 | Initial style guide |

---

## Summary

This design system emphasizes:
1. **Consistency**: Single border color, unified typography
2. **Simplicity**: Minimal shadows, flat design
3. **Technical Aesthetic**: Monospace fonts, code blocks, terminal styles
4. **Geometric Patterns**: Dots, lines, circles as decorative elements
5. **High Contrast**: Dark on light for readability
6. **Subtle Interactions**: Smooth hover transitions, tooltips
