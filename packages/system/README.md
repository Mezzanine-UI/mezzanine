# @mezzanine-ui/system

Design system foundation for Mezzanine UI. Provides CSS custom properties (design tokens) for color, typography, spacing, and other visual primitives that all other Mezzanine UI packages build upon.

## Installation

```bash
npm install @mezzanine-ui/system
```

This package is a dependency of `@mezzanine-ui/core` and `@mezzanine-ui/react` and is typically installed automatically alongside them.

## Design Tokens

All design tokens are exposed as CSS custom properties (e.g. `--mzn-color-primary`, `--mzn-spacing-2`). Applying the system stylesheet to your root element makes these available to all Mezzanine UI components:

```scss
@use '@mezzanine-ui/system/themes/light';
```

You can override individual tokens at any scope level to achieve theming without rebuilding the component library:

```css
:root {
  --mzn-color-primary: #0057ff;
}
```

The TypeScript exports in this package document every available token and are used internally by `@mezzanine-ui/core` to enforce token usage in SCSS variables.

## License

MIT
