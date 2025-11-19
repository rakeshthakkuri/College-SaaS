# Design System Documentation

This document outlines the design system principles and reusable components used in the College SaaS application.

## Design Principles

### 1. Consistency
- All components follow a unified design language
- Consistent spacing, typography, and color usage
- Predictable interactions and behaviors

### 2. Accessibility
- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios

### 3. Responsiveness
- Mobile-first approach
- Breakpoints: 768px (tablet), 1024px (desktop)
- Flexible layouts that adapt to screen sizes

### 4. Performance
- Optimized animations (60fps)
- Lazy loading for heavy components
- Minimal CSS footprint

## Color System

### Primary Colors
- `--primary-blue`: #0066FF (Main brand color)
- `--primary-blue-hover`: #0052CC (Hover state)
- `--primary-blue-light`: #E6F0FF (Light background)
- `--primary-blue-dark`: #0047B3 (Dark variant)

### Text Colors
- `--text-primary`: #1A1A1A (Main text)
- `--text-secondary`: #666666 (Secondary text)
- `--text-light`: #999999 (Light text)
- `--text-disabled`: #CCCCCC (Disabled text)

### Status Colors
- Success: #10B981 (Green)
- Warning: #F59E0B (Amber)
- Error: #EF4444 (Red)
- Info: #3B82F6 (Blue)

## Typography

### Font Family
- Primary: Inter (Google Fonts)
- Monospace: SF Mono, Monaco, Cascadia Code

### Font Sizes
- `--font-size-xs`: 12px
- `--font-size-sm`: 14px
- `--font-size-base`: 15px
- `--font-size-lg`: 16px
- `--font-size-xl`: 18px
- `--font-size-2xl`: 20px
- `--font-size-3xl`: 24px
- `--font-size-4xl`: 32px

### Font Weights
- 300: Light
- 400: Regular
- 500: Medium
- 600: Semi-bold
- 700: Bold
- 800: Extra-bold

## Spacing Scale

Based on 4px base unit:
- `--spacing-xs`: 4px
- `--spacing-sm`: 8px
- `--spacing-md`: 16px
- `--spacing-lg`: 24px
- `--spacing-xl`: 32px
- `--spacing-2xl`: 48px
- `--spacing-3xl`: 64px

## Components

### Button

Reusable button component with multiple variants and sizes.

```jsx
import { Button } from '../components';

<Button variant="primary" size="large" loading={isLoading}>
  Submit
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
- `size`: 'small' | 'medium' | 'large'
- `loading`: boolean
- `disabled`: boolean
- `fullWidth`: boolean
- `as`: React component (e.g., Link)
- `to`: string (for Link)

### Card

Container component for grouping related content.

```jsx
import { Card } from '../components';

<Card hover padding="large">
  Content here
</Card>
```

**Props:**
- `hover`: boolean (enables hover effect)
- `padding`: 'small' | 'medium' | 'large'
- `onClick`: function (makes card clickable)

### Input

Form input with label, error handling, and helper text.

```jsx
import { Input } from '../components';

<Input
  label="Email"
  type="email"
  error={errors.email}
  helperText="Enter your email address"
  required
/>
```

**Props:**
- `label`: string
- `error`: string (error message)
- `helperText`: string
- `required`: boolean
- `fullWidth`: boolean
- All standard input props

### LoadingSpinner

Loading indicator component.

```jsx
import { LoadingSpinner } from '../components';

<LoadingSpinner size="medium" />
```

**Props:**
- `size`: 'small' | 'medium' | 'large'

### EmptyState

Component for displaying empty states.

```jsx
import { EmptyState } from '../components';

<EmptyState
  icon="📭"
  title="No data found"
  description="There is no data to display"
  actionLabel="Create New"
  onAction={handleCreate}
/>
```

**Props:**
- `icon`: string (emoji or icon)
- `title`: string
- `description`: string
- `actionLabel`: string
- `onAction`: function

### Badge

Small status indicator.

```jsx
import { Badge } from '../components';

<Badge variant="success" size="medium">
  Active
</Badge>
```

**Props:**
- `variant`: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
- `size`: 'small' | 'medium' | 'large'

### Alert

Alert message component.

```jsx
import { Alert } from '../components';

<Alert variant="error" title="Error" onClose={handleClose}>
  Something went wrong
</Alert>
```

**Props:**
- `variant`: 'info' | 'success' | 'warning' | 'error'
- `title`: string (optional)
- `onClose`: function (optional)

### Skeleton

Loading placeholder component.

```jsx
import { Skeleton } from '../components';

<Skeleton variant="text" lines={3} />
```

**Props:**
- `variant`: 'text' | 'title' | 'avatar' | 'card' | 'button'
- `width`: string (e.g., '100%', '200px')
- `height`: string
- `lines`: number (for text variant)

## Usage Guidelines

### Component Import

```jsx
// Import individual components
import { Button, Card, Input } from '../components';

// Or import from index
import { Button } from '../components/Button';
```

### Styling

- Use CSS variables for colors, spacing, and typography
- Follow the spacing scale
- Use utility classes for common patterns
- Keep component styles scoped

### Best Practices

1. **Always use design system components** instead of custom HTML elements
2. **Follow the spacing scale** for consistent layouts
3. **Use semantic HTML** for accessibility
4. **Test on multiple screen sizes** before deploying
5. **Keep components focused** - one responsibility per component
6. **Document props** with JSDoc comments
7. **Handle loading and error states** consistently

## Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1023px
- Desktop: ≥ 1024px

### Mobile Considerations
- Stack elements vertically
- Full-width buttons
- Larger touch targets (min 44x44px)
- Simplified navigation

## Accessibility

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus indicators are visible
- Tab order is logical

### Screen Readers
- Semantic HTML elements
- ARIA labels where needed
- Descriptive alt text for images
- Form labels properly associated

### Color Contrast
- Text meets WCAG AA standards (4.5:1)
- Interactive elements have clear focus states
- Error states use both color and text

## Animation Guidelines

### Transitions
- Use `--transition-fast` (0.15s) for micro-interactions
- Use `--transition-base` (0.2s) for standard transitions
- Use `--transition-slow` (0.3s) for complex animations

### Principles
- Keep animations subtle and purposeful
- Respect `prefers-reduced-motion`
- Maintain 60fps performance
- Use transform and opacity for animations

## Future Enhancements

- [ ] Dark mode support
- [ ] More component variants
- [ ] Icon library integration
- [ ] Animation library
- [ ] Storybook documentation
- [ ] Component testing suite

