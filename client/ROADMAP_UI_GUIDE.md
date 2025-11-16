# 🎨 Interactive Roadmap UI Guide

## Visual Components Overview

### 1. **Main Roadmap Page Layout**

```
┌─────────────────────────────────────────────────────────┐
│  [← Back]          Career Name          [Spacer]        │ ← Top Bar (Sticky)
├─────────────────────────────────────────────────────────┤
│  Description banner with gradient background            │ ← Description
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [Help Card]                         [Interactive       │
│  • Click nodes                        Graph with        │
│  • Zoom/pan                           Connected         │
│  • Learn more                         Nodes]            │
│                                                          │
│                                       [Detail Panel]    │ ← Detail Panel (when node clicked)
│                                       Title              │
│                                       Description        │
│                                       [Learn More →]    │
│                                                          │
│  [Mini Map]     [Zoom Controls]                         │ ← Controls (bottom-left)
└─────────────────────────────────────────────────────────┘
```

---

## 2. **Node Card Design**

```
┌──────────────────────────────────┐
│ 🎯 FUNDAMENTALS ← Category badge │ ← Gradient header
│ HTML & CSS Fundamentals          │
├──────────────────────────────────┤
│ Learn the building blocks of    │ ← Description (3 lines max)
│ web development...               │
│                                  │
│ ⏱ 2-3 weeks      ← Duration     │
│                                  │
│ Learn More → ← Link button       │
└──────────────────────────────────┘
```

**Node Categories & Colors:**

- 🎯 **Fundamentals** → Blue gradient (from-blue-500 to-cyan-500)
- 🚀 **Intermediate** → Purple gradient (from-purple-500 to-pink-500)
- ⚡ **Advanced** → Orange gradient (from-orange-500 to-red-500)
- 💎 **Specialization** → Green gradient (from-green-500 to-emerald-500)

---

## 3. **Detail Panel (Selected Node)**

```
┌─────────────────────────────────────┐
│ FUNDAMENTALS                    [×] │ ← Category & close button
│ HTML & CSS Fundamentals             │
├─────────────────────────────────────┤
│ Full description text with more     │ ← Full description
│ details about what you'll learn     │
│ in this node...                     │
│                                     │
│ ⏱ 2-3 weeks                         │ ← Duration
│                                     │
│ ┌─────────────────────────────┐   │
│ │   Learn More →               │   │ ← CTA button with gradient
│ └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Position:** Bottom-right corner (absolute)
**Animation:** Slides in from bottom

---

## 4. **Roadmap List View (RoadmapsPage)**

```
┌────────────────────────────────┐
│ [Completed ✓]          [Clock] │ ← Status badge
│                                │
│ Full Stack React Developer     │ ← Career title (hover effect)
│                                │
│ 📍 10 learning nodes           │ ← Node count
│                                │
│ ⏱ 2 hours ago                  │ ← Created time
│                                │
│ Interactive learning roadmap   │ ← Description preview
│ with visual nodes              │
│                                │
├────────────────────────────────┤
│ View Roadmap          [→]      │ ← Action footer
└────────────────────────────────┘
```

---

## 5. **Graph Connections**

```
Node 1 ──────→ Node 2 ──────→ Node 3
  │                              │
  ↓                              ↓
Node 4 ──────→ Node 5 ──────→ Node 6
  │                              │
  ↓                              ↓
Node 7 ──────→ Node 8 ──────→ Node 9
```

**Connection Style:**

- Type: Smooth step edges
- Color: Purple (#9333ea)
- Width: 2px
- Animation: Flowing animation effect

---

## 6. **Responsive Breakpoints**

### Mobile (< 768px)

- Single column layout
- Nodes stack vertically
- Touch-optimized controls
- Detail panel covers more screen

### Tablet (768px - 1024px)

- 2-column node grid
- Adjusted spacing
- Sidebar toggle

### Desktop (> 1024px)

- 3-column node grid
- Help card visible
- Full controls and mini-map

---

## 7. **Interactive States**

### Node States:

1. **Default**: White background, purple border
2. **Hover**: Elevated shadow, scale transform
3. **Selected**: Highlight effect, detail panel opens

### Button States:

1. **Default**: Gradient background
2. **Hover**: Darker gradient, shadow increase
3. **Active**: Slight scale down

---

## 8. **Color Palette**

### Primary Colors:

- **Purple**: #9333ea (primary brand)
- **Pink**: #ec4899 (accent)
- **Violet**: #7c3aed (secondary)

### Category Colors:

- **Blue**: #3b82f6 (fundamentals)
- **Cyan**: #06b6d4 (fundamentals accent)
- **Orange**: #f97316 (advanced)
- **Red**: #ef4444 (advanced accent)
- **Green**: #10b981 (specialization)
- **Emerald**: #059669 (specialization accent)

### Neutral Colors:

- **Background**: Gradient slate → purple → pink
- **Text**: Gray-800 (#1f2937)
- **Secondary Text**: Gray-600 (#4b5563)
- **Borders**: Purple-100 (#f3e8ff)

---

## 9. **Typography**

### Headers:

- **Page Title**: 3xl, bold, white
- **Node Title**: lg, bold, white (header) / gray-800 (body)
- **Section Title**: 2xl, bold, gray-800

### Body Text:

- **Description**: sm, gray-600, leading-relaxed
- **Meta Info**: xs, gray-500

### Interactive Elements:

- **Buttons**: sm/base, semibold
- **Links**: sm, semibold, purple-600

---

## 10. **Animations & Transitions**

### Standard Transitions:

```css
transition: all 300ms ease;
```

### Specific Animations:

- **Edge Flow**: Continuous animated stroke
- **Panel Slide**: `slide-in-from-bottom-4`
- **Hover Scale**: `scale-110` (nodes)
- **Button Hover**: Shadow increase, color shift

---

## 11. **Accessibility Features**

- ✅ Keyboard navigation support
- ✅ ARIA labels for interactive elements
- ✅ Focus indicators on all controls
- ✅ Sufficient color contrast ratios
- ✅ Semantic HTML structure
- ✅ External link warnings (new tab icon)

---

## 12. **Loading & Error States**

### Loading:

```
     [Spinner Animation]

  Loading your roadmap...

  Please wait while we fetch
  your career path
```

### Error:

```
     [!] Error Icon

  Generation Failed

  [Error message details]

  [Try Again]  [View My Roadmaps]
```

---

## 13. **Empty State**

```
     [Map Icon]

  No roadmaps yet

  Start your career journey by
  generating your first personalized
  roadmap.

  [Generate Your First Roadmap]
```

---

## 14. **Mini Map Component**

```
┌─────────────┐
│ • • •   •   │ ← Dots represent nodes
│ • • • • •   │    (colored by category)
│ • • •       │
│             │
│  [View]     │ ← Current viewport
└─────────────┘
```

**Features:**

- Shows all nodes at once
- Color-coded by category
- Draggable viewport indicator
- Semi-transparent overlay

---

## 15. **Zoom Controls**

```
┌─────┐
│  +  │ ← Zoom in
├─────┤
│  🔒 │ ← Fit view
├─────┤
│  -  │ ← Zoom out
└─────┘
```

**Zoom Range:** 10% - 150%

---

## Usage Tips for Users 💡

1. **Navigate**: Click and drag background to pan
2. **Zoom**: Use controls or mouse wheel/pinch
3. **Explore**: Click any node for full details
4. **Learn**: Click "Learn More" to visit resources
5. **Overview**: Use mini-map for quick navigation

---

## Design Principles 🎨

1. **Visual Hierarchy**: Gradient headers draw attention
2. **Progressive Disclosure**: Details on demand (click)
3. **Intuitive Navigation**: Natural left-to-right, top-to-bottom flow
4. **Consistent Spacing**: 4px grid system
5. **Smooth Interactions**: All transitions at 300ms
6. **Mobile-First**: Responsive from smallest to largest screens

---

_This UI provides an engaging, intuitive learning experience that makes career progression visual and interactive!_
