# Dashboard Component Tree

## Visual Structure

```
DashboardLayout (layouts/DashboardLayout.jsx)
│
├── Sidebar (components/dashboard/Sidebar/Sidebar.jsx)
│   ├── Logo Section
│   ├── Menu Items
│   │   ├── Workspace 📚
│   │   ├── AI Tools 🤖
│   │   ├── My History 📝
│   │   ├── Billing 💳
│   │   └── Profile 👤
│   └── Support CTA Button
│
├── MobileHeader (components/dashboard/MobileHeader.jsx)
│   ├── Hamburger Menu Button
│   ├── Logo
│   └── UserButton (Clerk)
│
├── Desktop Header (in DashboardLayout)
│   ├── Welcome Message
│   ├── Notification Bell 🔔
│   └── UserButton (Clerk)
│
└── Main Content (Outlet)
    │
    └── DashboardPage (pages/DashboardPage.jsx)
        │
        ├── HeroSection (components/dashboard/Hero/HeroSection.jsx)
        │   ├── Gradient Background
        │   ├── Title & Description
        │   ├── CTA Button
        │   └── Decorative Elements
        │
        ├── AIToolsSection (components/dashboard/AITools/AIToolsSection.jsx)
        │   ├── Section Header
        │   └── Tools Grid
        │       ├── AIToolCard (AI Career Q&A Chat) 💬
        │       ├── AIToolCard (AI Resume Analyzer) 📄
        │       ├── AIToolCard (Career Roadmap Generator) 🗺️
        │       └── AIToolCard (Cover Letter Generator) 📝
        │
        └── HistorySection (components/dashboard/History/HistorySection.jsx)
            ├── Section Header
            └── History Items List
                ├── HistoryItem (AI Resume Analyzer)
                └── HistoryItem (Career Roadmap Generator)
```

## Responsive Behavior

### Mobile (< 1024px)

```
┌─────────────────────────┐
│  MobileHeader           │ ← Hamburger, Logo, User
├─────────────────────────┤
│                         │
│  Hero Section           │
│  (Full Width)           │
│                         │
├─────────────────────────┤
│  AI Tools               │
│  ┌─────────────────┐   │
│  │ Tool Card       │   │ ← 1 column
│  └─────────────────┘   │
│  ┌─────────────────┐   │
│  │ Tool Card       │   │
│  └─────────────────┘   │
├─────────────────────────┤
│  History Section        │
│  (Stacked)              │
└─────────────────────────┘

[Sidebar opens as overlay]
```

### Desktop (≥ 1024px)

```
┌──────────┬──────────────────────────────────┐
│          │  Desktop Header                  │ ← Welcome, Bell, User
│  Sidebar ├──────────────────────────────────┤
│          │                                  │
│  Logo    │  Hero Section                    │
│  ━━━━━   │  (Gradient Banner)               │
│          │                                  │
│  Menu:   ├──────────────────────────────────┤
│  • Work  │  AI Tools                        │
│  • AI    │  ┌────┐ ┌────┐ ┌────┐ ┌────┐   │
│  • Hist  │  │Tool│ │Tool│ │Tool│ │Tool│   │ ← 4 columns
│  • Bill  │  └────┘ └────┘ └────┘ └────┘   │
│  • Prof  │                                  │
│          ├──────────────────────────────────┤
│  Support │  History Section                 │
│  Button  │  (List View)                     │
│          │                                  │
└──────────┴──────────────────────────────────┘
```

## State Management

### Sidebar State

- `isOpen`: Boolean (controlled by MobileHeader)
- `setIsOpen`: Function to toggle sidebar
- Active menu item tracked by URL path

### Component Props Flow

```
DashboardLayout
  ├── sidebarOpen (state) ──→ Sidebar (isOpen)
  ├── setSidebarOpen ──────→ Sidebar (setIsOpen)
  └── setSidebarOpen ──────→ MobileHeader (onMenuClick)
```

## Theme Integration

All components use centralized theme from `config/theme.js`:

```javascript
// Example usage in components
import theme from '../../../config/theme';

// Gradient classes from theme
className={theme.gradients.primary}

// Color references
bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600
```

## Component Dependencies

```
DashboardPage.jsx
  ├── Import: HeroSection from '../components/dashboard/Hero/HeroSection'
  ├── Import: AIToolsSection from '../components/dashboard/AITools/AIToolsSection'
  └── Import: HistorySection from '../components/dashboard/History/HistorySection'

DashboardLayout.jsx
  ├── Import: Sidebar from '../components/dashboard/Sidebar/Sidebar'
  ├── Import: MobileHeader from '../components/dashboard/MobileHeader'
  └── Clerk: UserButton, useUser

AIToolsSection.jsx
  └── Import: AIToolCard from './AIToolCard'

HistorySection.jsx
  └── Contains: HistoryItem (internal component)
```

## Styling Approach

### Tailwind Classes Used

- **Layout**: `flex`, `grid`, `sticky`, `fixed`, `absolute`
- **Responsive**: `lg:`, `md:`, `sm:` breakpoints
- **Colors**: Gradient combinations (pink, purple, violet, blue)
- **Spacing**: `space-y-*`, `gap-*`, `p-*`, `m-*`
- **Effects**: `hover:`, `group-hover:`, `transition-all`
- **Shadows**: `shadow-sm` to `shadow-2xl`
- **Borders**: `border`, `rounded-xl`, `rounded-2xl`

### Custom Animations

- Smooth transitions: `transition-all duration-300`
- Scale on hover: `hover:scale-110`
- Shadow elevation: `hover:shadow-xl`
- Color shifts: `hover:bg-gradient-to-r`

## File Sizes (Approximate)

```
Sidebar.jsx          ─── 4.5 KB  (109 lines)
HeroSection.jsx      ─── 1.5 KB  (38 lines)
AIToolCard.jsx       ─── 1.2 KB  (32 lines)
AIToolsSection.jsx   ─── 1.8 KB  (48 lines)
HistorySection.jsx   ─── 2.5 KB  (78 lines)
MobileHeader.jsx     ─── 1.3 KB  (43 lines)
DashboardLayout.jsx  ─── 2.0 KB  (52 lines)
DashboardPage.jsx    ─── 0.6 KB  (20 lines)
theme.js             ─── 1.8 KB  (62 lines)
```

## Performance Considerations

✅ **Optimizations Applied:**

- No unnecessary re-renders (proper component separation)
- Efficient state management (only sidebar state)
- CSS-only animations (no JavaScript animations)
- Lazy loading ready (can add React.lazy if needed)
- Minimal bundle size (uses Tailwind purge)

## Accessibility Features

✅ **WCAG Compliant:**

- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus visible states
- Sufficient color contrast ratios
- Screen reader friendly text
