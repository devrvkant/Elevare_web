# Dashboard Components Structure

This directory contains all the components related to the AI Career Coach Agent dashboard.

## Folder Structure

```
dashboard/
├── Sidebar/              # Sidebar navigation component
│   ├── Sidebar.jsx       # Main sidebar component with menu items
│   └── index.js          # Export file
├── Hero/                 # Hero section component
│   ├── HeroSection.jsx   # Main hero banner with CTA
│   └── index.js          # Export file
├── AITools/              # AI Tools section components
│   ├── AIToolCard.jsx    # Individual tool card component
│   ├── AIToolsSection.jsx # Tools grid section
│   └── index.js          # Export file
├── History/              # History section components
│   ├── HistorySection.jsx # Previous work history display
│   └── index.js          # Export file
└── MobileHeader.jsx      # Mobile header with hamburger menu
```

## Theme Configuration

The dashboard uses a centralized theme configuration located at:
`src/config/theme.js`

### Theme Structure
- **Colors**: Primary (purple), Secondary (blue), Accent (pink), Background, Text, Border, Status
- **Gradients**: Pre-defined gradient combinations
- **Shadows**: Consistent shadow levels (sm, md, lg, xl, 2xl)
- **Spacing**: Standard spacing for sections and containers
- **Border Radius**: Consistent rounded corners (sm, md, lg, full)

## Components Overview

### Sidebar
- Responsive sidebar with mobile overlay
- Menu items with icons and descriptions
- Active state highlighting
- Support CTA at bottom

### HeroSection
- Eye-catching gradient banner
- Call-to-action button
- Decorative background elements

### AIToolsSection
- Grid layout of AI tool cards
- 4 tools: Q&A Chat, Resume Analyzer, Roadmap Generator, Cover Letter Generator
- Responsive grid (1 col mobile, 2 cols tablet, 4 cols desktop)

### HistorySection
- Previous work history display
- Timestamp formatting
- Empty state handling

### MobileHeader
- Hamburger menu button
- Logo display
- User profile button (Clerk)

## Customization

To change the theme colors or styling:

1. Edit `src/config/theme.js` for global theme changes
2. Individual components use Tailwind classes that reference the theme
3. Gradient colors are defined in the theme configuration

## Responsive Design

All components are fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px
