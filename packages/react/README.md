# @mezzanine-ui/react

React component library for Mezzanine UI. Provides a comprehensive set of accessible, themeable UI components built on top of `@mezzanine-ui/core`, `@mezzanine-ui/icons`, and `@mezzanine-ui/system`.

## Installation

```bash
npm install @mezzanine-ui/react @mezzanine-ui/core @mezzanine-ui/icons @mezzanine-ui/system
```

## Peer Dependencies

| Package     | Version |
| ----------- | ------- |
| `react`     | `>= 18` |
| `react-dom` | `>= 18` |
| `lodash`    | `>= 4`  |

## Quick Start

### 1. Setup Styles

Create a `main.scss` and import it at your app entry point:

```scss
@use '@mezzanine-ui/system' as mzn-system;
@use '@mezzanine-ui/core' as mzn-core;

:root {
  @include mzn-system.common-variables('default');
  @include mzn-system.colors();
  @include mzn-system.palette-variables(light);
}

/* Optional: dark mode */
[data-theme='dark'] {
  @include mzn-system.palette-variables(dark);
}

/* Optional: compact density */
[data-density='compact'] {
  @include mzn-system.common-variables(compact);
}

@include mzn-core.styles();
```

> **Note:** The `~` prefix (e.g. `~@mezzanine-ui/system`) was required by older webpack 4 + sass-loader setups. Modern tooling (Next.js 13+, Vite) resolves node_modules without it.

```tsx
// app entry (e.g. main.tsx / _app.tsx)
import './main.scss';
```

### 2. Use Components

```tsx
import Button from '@mezzanine-ui/react/Button';

function App() {
  return <Button variant="base-primary">Click me</Button>;
}
```

## Component Catalog

See [COMPONENTS.md](./COMPONENTS.md) for the full list of available components, their import names, and descriptions.

## AI Tooling Note

All published `.d.ts` files include JSDoc comments with `@example` blocks referencing `@mezzanine-ui/react` import paths. AI tools (e.g. GitHub Copilot, Claude) can use these to generate accurate component usage without additional documentation lookups.

## Related Packages

| Package                | Description                                   |
| ---------------------- | --------------------------------------------- |
| `@mezzanine-ui/core`   | CSS styles and TypeScript types per component |
| `@mezzanine-ui/icons`  | SVG icon definitions                          |
| `@mezzanine-ui/system` | Design tokens and CSS custom properties       |

## License

MIT
