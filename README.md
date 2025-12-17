# Mezzanine UI

A comprehensive React component library with a complete design system, built for modern web applications.

## ⚠️ Current Status

This project is in **active development** for v2. While it has been widely utilized across various Rytass projects, please note that API changes may still occur. We recommend pinning to specific versions in production environments.

## 📚 Documentation

- **[Storybook](https://storybook.mezzanine-ui.org)** - Interactive component documentation and examples
- **[Migration Guide](https://github.com/Mezzanine-UI/mezzanine/tree/main/migrations)** - Upgrading from previous versions

## 🌐 Browser Support

| Browser       | Minimum Version |
| ------------- | --------------- |
| Google Chrome | 64 (2018)       |
| Edge          | 79 (2020)       |
| Safari        | 13.1 (2020)     |
| Firefox       | 69 (2019)       |

---

## 📦 Installation

Install all required packages:

```bash
yarn add @mezzanine-ui/core @mezzanine-ui/react @mezzanine-ui/system @mezzanine-ui/icons
```

---

## 🚀 Quick Start

### 1. Setup Styles

Create a `main.scss` file in your project:

```scss
@use '~@mezzanine-ui/system' as mzn-system;
@use '~@mezzanine-ui/core' as mzn-core;

// Apply design system variables
:root {
  @include mzn-system.palette-variables(light);
  @include mzn-system.common-variables(default);
}

// Optional: Dark mode support
[data-theme='dark'] {
  @include mzn-system.palette-variables(dark);
}

// Optional: Compact mode support
[data-density='compact'] {
  @include mzn-system.common-variables(compact);
}

// Import component styles
@include mzn-core.styles();
```

### 2. Import Styles

Import the stylesheet at your app's entry point:

```jsx
import './main.scss';

function App() {
  return <div>Your App</div>;
}
```

### 3. Use Components

```jsx
import { Button, Typography } from '@mezzanine-ui/react';
import { PlusIcon } from '@mezzanine-ui/icons';

function App() {
  return (
    <div>
      <Typography variant="h1">Welcome to Mezzanine UI</Typography>
      <Button variant="base-primary" size="main">
        <PlusIcon />
        Click Me
      </Button>
    </div>
  );
}
```

---

## 🎨 Design System Customization

### Understanding Primitives vs Semantic

Mezzanine UI v2 uses a two-layer design token system:

- **Primitives**: Raw values (e.g., `#3b82f6`, `16px`)
- **Semantic**: Contextual tokens that reference primitives (e.g., `text-brand`, `padding-base`)

> 💡 **Best Practice**: Always use semantic tokens in your application for automatic theme switching support.

### Customize Color Palette

Override palette colors by passing a custom configuration:

```scss
@use '~@mezzanine-ui/system' as mzn-system;

$custom-palette: (
  background: (
    base: (
      light: #000,
      dark: #fff,
    ),
    menu: (
      light: #fff,
      dark: #9a9a9a,
    ),
    // ...
  ), // ...
);

:root {
  @include mzn-system.palette-variables(light, $custom-palette);
}

[data-theme='dark'] {
  @include mzn-system.palette-variables(dark, $custom-palette);
}
```

### Customize Typography

Override typography settings:

```scss
@use '~@mezzanine-ui/system' as mzn-system;
@use '~@mezzanine-ui/system/typography' as typography;

$custom-variables: (
  typography: (
    h3: (
      font-size: 18px,
      font-weight: 700,
      line-height: 26px,
      letter-spacing: 0,
    ),
    // ...
  ),
);

:root {
  @include mzn-system.common-variables(default, $custom-variables);
}
```

### Customize Spacing

Override spacing values:

```scss
@use '~@mezzanine-ui/system' as mzn-system;

$custom-variables: (
  spacing: (
    size: (
      element: (
        hairline: (
          default: 2px,
          compact: 2px,
        ),
      ),
    ),
  ),
);

:root {
  @include mzn-system.common-variables(default, $custom-variables);
}

[data-density='compact'] {
  @include mzn-system.common-variables(compact, $custom-variables);
}
```

---

## 🎯 Using Design Tokens in Your Components

### In SCSS

```scss
@use '~@mezzanine-ui/system/palette' as palette;
@use '~@mezzanine-ui/system/spacing' as spacing;
@use '~@mezzanine-ui/system/radius' as radius;
@use '~@mezzanine-ui/system/typography' as typography;

.my-component {
  // Colors - use semantic variables
  color: palette.semantic-variable(text, brand);
  background-color: palette.semantic-variable(background, base);
  border-color: palette.semantic-variable(border, neutral);

  // Spacing - use semantic variables
  padding: spacing.semantic-variable(padding, horizontal, base);
  gap: spacing.semantic-variable(gap, tight);

  // Border radius
  border-radius: radius.variable(base);

  // Typography - apply full semantic typography
  @include typography.semantic-variable(body);
}
```

### Available System Modules

| Module       | Purpose                         | Example                                         |
| ------------ | ------------------------------- | ----------------------------------------------- |
| `palette`    | Colors (text, background, etc.) | `palette.semantic-variable(text, brand)`        |
| `spacing`    | Padding, margin, gap            | `spacing.semantic-variable(padding, base)`      |
| `radius`     | Border radius                   | `radius.variable(base)`                         |
| `typography` | Font settings                   | `@include typography.semantic-variable(button)` |
| `effect`     | Shadows, focus rings            | `effect.variable(focus, primary)`               |
| `size`       | Element sizes                   | `size.semantic-variable(element, main)`         |

---

## 🔧 Using React Components

### Component Examples

#### Button

```jsx
import { Button } from '@mezzanine-ui/react';
import { PlusIcon } from '@mezzanine-ui/icons';

<Button variant="base-primary" size="main">
  Primary Button
</Button>

<Button variant="base-secondary" size="sub" disabled>
  Disabled Button
</Button>

<Button variant="outlined-primary" size="minor">
  <PlusIcon />
  With Icon
</Button>
```

#### Typography

```jsx
import { Typography } from '@mezzanine-ui/react';

<Typography variant="h1">Heading 1</Typography>
<Typography variant="body">Body text</Typography>
<Typography variant="caption" color="text-neutral">
  Caption text
</Typography>
```

---

## 🪝 Useful React Hooks

Mezzanine provides several utility hooks:

### useComposeRefs

Compose multiple refs:

```jsx
import { forwardRef, useRef } from 'react';
import { useComposeRefs } from '@mezzanine-ui/react';

const Component = forwardRef((props, ref) => {
  const internalRef = useRef();
  const composedRef = useComposeRefs([ref, internalRef]);

  return <div ref={composedRef} />;
});
```

### useClickAway

Detect clicks outside an element:

```jsx
import { useRef } from 'react';
import { useClickAway } from '@mezzanine-ui/react';

function Modal({ onClose }) {
  const modalRef = useRef();

  useClickAway(
    () => {
      return (event) => {
        onClose(event);
      };
    },
    modalRef,
    [onClose],
  );

  return <div ref={modalRef}>Modal content</div>;
}
```

### Other Hooks

- `usePreviousValue` - Store previous render value
- `useWindowWidth` - Get window width with resize listener
- `useDocumentEscapeKeyDown` - Handle ESC key press
- `useIsomorphicLayoutEffect` - SSR-safe useLayoutEffect

---

## 🌙 Theme Support

### Light/Dark Mode

Mezzanine UI v2 has built-in support for light and dark modes:

```scss
// In your SCSS
:root {
  @include mzn-system.palette-variables(light);
}

[data-theme='dark'] {
  @include mzn-system.palette-variables(dark);
}
```

Toggle theme in your React app:

```jsx
function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Toggle Theme</Button>;
}
```

### Default/Compact Mode

Switch between comfortable and compact spacing:

```scss
:root {
  @include mzn-system.common-variables(default);
}

[data-density='compact'] {
  @include mzn-system.common-variables(compact);
}
```

Toggle density in your React app:

```jsx
function DensityToggle() {
  const [density, setDensity] = useState('default');

  useEffect(() => {
    document.documentElement.setAttribute('data-density', density);
  }, [density]);

  return <Button onClick={() => setDensity(density === 'default' ? 'compact' : 'default')}>Toggle Density</Button>;
}
```

---

## 📖 Icon Usage

Use icons from the `@mezzanine-ui/icons` package:

```jsx
import { ChevronDownIcon, PlusIcon, CheckIcon } from '@mezzanine-ui/icons';

function Example() {
  return (
    <div>
      <ChevronDownIcon />
      <PlusIcon />
      <CheckIcon />
    </div>
  );
}
```

> ⚠️ **Important**: Only use icons from categorized folders (e.g., `arrow/`, `controls/`, `system/`). Avoid deprecated icons in the root directory.

---

## 🤝 Contributing

We welcome contributions! Please see our [Development Guidelines](./DEVELOP_GUIDELINE.md) for:

- Setting up the development environment
- Understanding the project architecture
- Following coding conventions
- Writing tests and documentation

---

## 📝 License

MIT License - see [LICENSE](./LICENSE) for details.

---

## 🔗 Links

- [GitHub Repository](https://github.com/Mezzanine-UI/mezzanine)
- [Storybook Documentation](https://storybook.mezzanine-ui.org)
- [NPM Package](https://www.npmjs.com/package/@mezzanine-ui/react)
