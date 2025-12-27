# Create Design System

I need you to build a comprehensive design system for consistent UI across our product.

## Context

**Current State**: $ARGUMENTS

(Examples: "No design system, inconsistent components", "Bootstrap-based, need custom system", "React app, need component library", "Multi-platform (web + mobile), need unified design language")

## Your Task

Route this to the **ui-designer** agent who will:

1. **Design Foundations**:
   **Color System**:
   - Primary colors (brand identity):
     - Primary: [Main brand color]
     - Primary variants: [50, 100, 200...900 shades]
   - Semantic colors (functional):
     - Success: [Green tones]
     - Warning: [Yellow/orange tones]
     - Error: [Red tones]
     - Info: [Blue tones]
   - Neutral colors (grays):
     - Background: [Light to dark scale]
     - Text: [Primary, secondary, tertiary]
     - Borders: [Subtle to prominent]
   - Accessibility: WCAG AA contrast ratios (4.5:1 for text, 3:1 for UI)

   **Typography Scale**:
   - Font families:
     - Headings: [Sans-serif, high-impact]
     - Body: [Sans-serif, readable]
     - Monospace: [Code blocks, technical]
   - Type scale (modular scale ratio 1.25):
     - xs: 12px
     - sm: 14px
     - base: 16px
     - lg: 20px
     - xl: 24px
     - 2xl: 30px
     - 3xl: 36px
     - 4xl: 48px
   - Line heights: [1.2 for headings, 1.5 for body]
   - Font weights: [400 regular, 500 medium, 600 semibold, 700 bold]

   **Spacing System** (4px base unit):
   - 0: 0px
   - 1: 4px
   - 2: 8px
   - 3: 12px
   - 4: 16px
   - 6: 24px
   - 8: 32px
   - 12: 48px
   - 16: 64px
   - 24: 96px

   **Border Radius**:
   - none: 0
   - sm: 4px
   - md: 8px
   - lg: 12px
   - xl: 16px
   - 2xl: 24px
   - full: 9999px (pills, circles)

   **Shadows**:
   - sm: Subtle, cards at rest
   - md: Moderate, dropdowns
   - lg: Prominent, modals
   - xl: Dramatic, key interactions

2. **Component Library**:
   **Core Components** (build these first):
   - Button (primary, secondary, tertiary, danger, sizes)
   - Input (text, email, password, textarea, with states)
   - Select (dropdown, multi-select, searchable)
   - Checkbox & Radio
   - Toggle/Switch
   - Card (various layouts)
   - Badge & Tag
   - Avatar (user images, initials fallback)
   - Icon system (consistent set, e.g., Heroicons, Lucide)

   **Layout Components**:
   - Container (max-width wrappers)
   - Grid (responsive columns)
   - Stack (vertical/horizontal spacing)
   - Divider

   **Feedback Components**:
   - Alert (success, warning, error, info)
   - Toast/Notification
   - Progress bar & Spinner
   - Skeleton loader

   **Overlay Components**:
   - Modal/Dialog
   - Popover/Tooltip
   - Dropdown menu
   - Sheet (slide-in panel)

   **Data Display**:
   - Table (sortable, filterable)
   - List (simple, with avatars, with actions)
   - Empty state
   - Stat cards

3. **Design Tokens**:
   **Token Structure** (CSS variables or JS objects):
   ```css
   /* Color tokens */
   --color-primary-50: #eff6ff;
   --color-primary-500: #3b82f6;
   --color-primary-900: #1e3a8a;

   /* Spacing tokens */
   --spacing-1: 4px;
   --spacing-4: 16px;

   /* Typography tokens */
   --font-size-base: 16px;
   --font-weight-semibold: 600;
   ```

   **Platform-Specific Tokens**:
   - Web: CSS variables, Tailwind config, Sass variables
   - React: styled-components theme, Chakra UI theme
   - iOS: UIColor extensions, typography styles
   - Android: colors.xml, dimens.xml, styles.xml

4. **Component API Design**:
   **Props Interface** (consistent naming):
   ```typescript
   interface ButtonProps {
     variant?: 'primary' | 'secondary' | 'tertiary' | 'danger'
     size?: 'sm' | 'md' | 'lg'
     isLoading?: boolean
     isDisabled?: boolean
     leftIcon?: ReactNode
     rightIcon?: ReactNode
     children: ReactNode
     onClick?: () => void
   }
   ```

   **Composition Patterns**:
   - Compound components (e.g., `<Menu>`, `<Menu.Item>`)
   - Render props for customization
   - Slot-based composition (header, body, footer)

5. **Documentation**:
   **Component Docs** (Storybook, Docusaurus, or custom):
   - Component overview (what it does, when to use)
   - Props table (name, type, default, description)
   - Usage examples (code snippets)
   - Variants showcase (all states and sizes)
   - Accessibility notes (ARIA attributes, keyboard nav)
   - Do's and Don'ts (design guidelines)

   **Getting Started Guide**:
   - Installation instructions
   - Theming and customization
   - Dark mode setup
   - Responsive utilities

6. **Implementation**:
   **Tech Stack Options**:
   - **Utility-First**: Tailwind CSS (recommended for speed)
   - **Component Libraries**: shadcn/ui (copy-paste components)
   - **Full Frameworks**: Chakra UI, Mantine, Material-UI
   - **Custom**: styled-components, CSS Modules, vanilla CSS

   **File Structure**:
   ```
   src/
   ├── design-system/
   │   ├── tokens/
   │   │   ├── colors.ts
   │   │   ├── typography.ts
   │   │   ├── spacing.ts
   │   │   └── shadows.ts
   │   ├── components/
   │   │   ├── Button/
   │   │   │   ├── Button.tsx
   │   │   │   ├── Button.stories.tsx
   │   │   │   ├── Button.test.tsx
   │   │   │   └── index.ts
   │   │   ├── Input/
   │   │   └── ...
   │   └── index.ts
   ```

7. **Dark Mode Support**:
   - Semantic color tokens (background, foreground, accent)
   - Theme switcher component
   - System preference detection
   - Persistent user preference (localStorage)
   - Smooth transitions between themes

8. **Accessibility**:
   - WCAG AA compliance (minimum)
   - Color contrast ratios validated
   - Keyboard navigation (Tab, Enter, Esc, Arrow keys)
   - Screen reader support (ARIA labels, roles, live regions)
   - Focus indicators (visible, clear)
   - Skip links for main content

9. **Testing Strategy**:
   - Visual regression testing (Chromatic, Percy)
   - Unit tests for component logic
   - Accessibility tests (axe-core, jest-axe)
   - Snapshot tests for preventing regressions

10. **Adoption & Maintenance**:
    - Component adoption metrics (% of app using design system)
    - Contribution guidelines (how to add new components)
    - Versioning strategy (semantic versioning)
    - Migration guides (breaking changes)
    - Design system team (designers + engineers)

## Deliverables

- Design token definitions (colors, typography, spacing, shadows)
- Component library (15-20 core components)
- Component documentation (Storybook or equivalent)
- Usage guidelines (when to use each component)
- Dark mode implementation
- Accessibility audit report
- Getting started guide for developers

## Design System Maturity Model

**Level 1: Foundation** (Week 1-2):
- Define design tokens (colors, typography, spacing)
- Build 5 core components (Button, Input, Card, Alert, Modal)
- Basic documentation

**Level 2: Expansion** (Week 3-4):
- Add 10 more components
- Storybook with interactive docs
- Dark mode support

**Level 3: Ecosystem** (Week 5+):
- Figma component library (design-dev handoff)
- Automated visual regression testing
- Design system website
- Contribution process

## Success Criteria

- Component coverage: 80% of UI built with design system components
- Consistency score: 95% adherence to design tokens
- Developer satisfaction: > 8/10 in usability survey
- Design-to-dev handoff time: Reduced by 50%
- Accessibility: 100% WCAG AA compliance

**Route to**: System Coordinator → Design Coordinator → ui-designer
