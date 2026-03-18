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

Import the component styles from `@mezzanine-ui/core`, then use components from this package:

```tsx
// Import component styles (e.g. in your app entry or global stylesheet)
import '@mezzanine-ui/core/button/styles';

// Use the component
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
