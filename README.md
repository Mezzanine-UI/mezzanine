# Mezzanine UI

A comprehensive React component library with a complete design system, built for modern web applications.

## ⚠️ Current Status

This project is currently in **beta** (`1.0.0-beta.x`) and under active development for v2. While it has been widely utilized across various Rytass internal projects, please note that API changes may still occur before the stable release. We recommend pinning to specific versions in production environments.

```json
{
  "@mezzanine-ui/core": "1.0.0-beta.7",
  "@mezzanine-ui/react": "1.0.0-beta.7",
  "@mezzanine-ui/system": "1.0.0-beta.7",
  "@mezzanine-ui/icons": "1.0.0-beta.7"
}
```

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

## ⚡ Framework Support

### Next.js (App Router & Pages Router)

Mezzanine UI fully supports **Next.js** including the App Router. All React components include the `'use client'` directive, making them compatible with React Server Components architecture.

```tsx
// app/layout.tsx - Works seamlessly with Next.js App Router
import { CalendarConfigProviderDayjs, CalendarLocale } from '@mezzanine-ui/react/dayjs';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <CalendarConfigProviderDayjs locale={CalendarLocale.ZH_TW}>{children}</CalendarConfigProviderDayjs>
      </body>
    </html>
  );
}
```

> All hooks and utilities are also SSR-safe and can be used in Next.js projects without additional configuration.

---

## 📦 Installation

Install all required packages:

```bash
yarn add @mezzanine-ui/core @mezzanine-ui/react @mezzanine-ui/system @mezzanine-ui/icons
```

If you plan to use date-related components (DatePicker, Calendar, TimePicker, etc.), install one of the supported date libraries:

```bash
# Choose one:
yarn add dayjs      # Recommended - lightweight
yarn add moment     # Legacy support
yarn add luxon      # Alternative
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

### 4. Setup CalendarConfigProvider (Required for Date Components)

If your application uses date-related components (DatePicker, DateRangePicker, Calendar, TimePicker, etc.), you must wrap your app with a `CalendarConfigProvider`. This provider configures the date library and locale settings.

Choose one of the following date libraries based on your project needs:

#### Using Day.js (Recommended - Lightweight)

```bash
yarn add dayjs
```

```jsx
import { CalendarConfigProviderDayjs, CalendarLocale } from '@mezzanine-ui/react/dayjs';

function App({ children }) {
  return <CalendarConfigProviderDayjs locale={CalendarLocale.ZH_TW}>{children}</CalendarConfigProviderDayjs>;
}
```

#### Using Moment.js

```bash
yarn add moment
```

```jsx
import { CalendarConfigProviderMoment, CalendarLocale } from '@mezzanine-ui/react/moment';

function App({ children }) {
  return <CalendarConfigProviderMoment locale={CalendarLocale.ZH_TW}>{children}</CalendarConfigProviderMoment>;
}
```

#### Using Luxon

```bash
yarn add luxon
```

```jsx
import { CalendarConfigProviderLuxon, CalendarLocale } from '@mezzanine-ui/react/luxon';

function App({ children }) {
  return <CalendarConfigProviderLuxon locale={CalendarLocale.ZH_TW}>{children}</CalendarConfigProviderLuxon>;
}
```

> ⚠️ **Important**: Import the provider from the specific entry point (e.g., `@mezzanine-ui/react/dayjs`) to avoid bundling unused date libraries.

---

## 📅 CalendarConfigProvider Configuration

### Available Props

| Prop                | Type                  | Default                | Description                                                       |
| ------------------- | --------------------- | ---------------------- | ----------------------------------------------------------------- |
| `locale`            | `CalendarLocaleValue` | `CalendarLocale.EN_US` | Controls calendar display: first day of week, month/weekday names |
| `defaultDateFormat` | `string`              | `'YYYY-MM-DD'`         | Default format string for date values                             |
| `defaultTimeFormat` | `string`              | `'HH:mm:ss'`           | Default format string for time values                             |

### Supported Locales

Common locale values (see `CalendarLocale` enum for full list):

| Locale                 | Value     | First Day of Week |
| ---------------------- | --------- | ----------------- |
| `CalendarLocale.EN_US` | `'en-US'` | Sunday            |
| `CalendarLocale.EN_GB` | `'en-GB'` | Monday            |
| `CalendarLocale.ZH_TW` | `'zh-TW'` | Sunday            |
| `CalendarLocale.ZH_CN` | `'zh-CN'` | Monday            |
| `CalendarLocale.JA_JP` | `'ja-JP'` | Sunday            |
| `CalendarLocale.KO_KR` | `'ko-KR'` | Sunday            |
| `CalendarLocale.DE_DE` | `'de-DE'` | Monday            |
| `CalendarLocale.FR_FR` | `'fr-FR'` | Monday            |

### Usage with Next.js App Router

For Next.js App Router, place the provider in your root layout:

```tsx
// app/layout.tsx
import { CalendarConfigProviderDayjs, CalendarLocale } from '@mezzanine-ui/react/dayjs';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <CalendarConfigProviderDayjs locale={CalendarLocale.ZH_TW}>{children}</CalendarConfigProviderDayjs>
      </body>
    </html>
  );
}
```

### Custom Date/Time Formats

```jsx
import { CalendarConfigProviderDayjs, CalendarLocale } from '@mezzanine-ui/react/dayjs';

function App({ children }) {
  return (
    <CalendarConfigProviderDayjs defaultDateFormat="YYYY/MM/DD" defaultTimeFormat="HH:mm" locale={CalendarLocale.ZH_TW}>
      {children}
    </CalendarConfigProviderDayjs>
  );
}
```

### Date Library Comparison

| Library | Bundle Size | Tree-Shakeable | ISO Week Support | Note                            |
| ------- | ----------- | -------------- | ---------------- | ------------------------------- |
| Day.js  | ~2KB        | Yes            | Yes              | Recommended for most projects   |
| Moment  | ~70KB       | No             | Yes              | Legacy support                  |
| Luxon   | ~20KB       | Yes            | Yes (ISO only)   | Always uses Monday as first day |

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

#### DatePicker

> Requires `CalendarConfigProvider` wrapper (see [Setup CalendarConfigProvider](#4-setup-calendarconfigprovider-required-for-date-components))

```jsx
import { useState } from 'react';
import { DatePicker } from '@mezzanine-ui/react';

function Example() {
  const [date, setDate] = useState<string>();

  return (
    <DatePicker
      onChange={setDate}
      placeholder="Select a date"
      value={date}
    />
  );
}
```

#### DateRangePicker

```jsx
import { useState } from 'react';
import { DateRangePicker } from '@mezzanine-ui/react';

function Example() {
  const [range, setRange] = useState<[string, string]>();

  return (
    <DateRangePicker
      onChange={setRange}
      value={range}
    />
  );
}
```

---

## 🪝 React Hooks

Mezzanine provides several utility hooks for common UI patterns:

| Hook                        | Description                                                            |
| --------------------------- | ---------------------------------------------------------------------- |
| `useClickAway`              | Detect clicks outside an element (useful for dropdowns, modals)        |
| `useComposeRefs`            | Compose multiple refs into one                                         |
| `useDocumentEscapeKeyDown`  | Listen for ESC key press on document                                   |
| `useDocumentTabKeyDown`     | Listen for Tab key press on document                                   |
| `useDocumentEvents`         | Generic document event listener with cleanup                           |
| `useElementHeight`          | Track an element's height with ResizeObserver                          |
| `useIsomorphicLayoutEffect` | SSR-safe `useLayoutEffect` (uses `useEffect` on server)                |
| `useLastCallback`           | Stable callback reference that always calls the latest version         |
| `useLastValue`              | Ref that always holds the latest value                                 |
| `usePreviousValue`          | Access the previous render's value                                     |
| `useScrollLock`             | Lock body scroll (for modals/overlays) with scrollbar gap compensation |
| `useTopStack`               | Manage stacking order for overlays                                     |
| `useWindowWidth`            | Track window width with resize listener                                |

### Example: useClickAway

```jsx
import { useRef } from 'react';
import { useClickAway } from '@mezzanine-ui/react';

function Dropdown({ onClose }) {
  const dropdownRef = useRef();

  useClickAway(() => (event) => onClose(event), dropdownRef, [onClose]);

  return <div ref={dropdownRef}>Dropdown content</div>;
}
```

### Example: useScrollLock

```jsx
import { useScrollLock } from '@mezzanine-ui/react';

function Modal({ isOpen }) {
  // Automatically locks scroll when modal is open
  useScrollLock({ enabled: isOpen });

  return isOpen ? <div className="modal">Modal content</div> : null;
}
```

---

## 🛠️ Utility Functions

Mezzanine also exports commonly used utility functions:

| Utility                           | Description                                           |
| --------------------------------- | ----------------------------------------------------- |
| `formatNumberWithCommas`          | Format numbers with locale-aware thousands separators |
| `parseNumberWithCommas`           | Parse comma-formatted string back to number           |
| `getCSSVariableValue`             | Get computed CSS variable value from `:root`          |
| `getNumericCSSVariablePixelValue` | Get CSS variable as numeric pixel value               |
| `arrayMove`                       | Move array item from one index to another (immutable) |
| `cx`                              | Classname utility (re-exported from `clsx`)           |
| `composeRefs`                     | Compose multiple refs (non-hook version)              |
| `getScrollbarWidth`               | Get current scrollbar width in pixels                 |

### Example: Number Formatting

```jsx
import { formatNumberWithCommas, parseNumberWithCommas } from '@mezzanine-ui/react';

// Format number for display
formatNumberWithCommas(1234567); // '1,234,567'
formatNumberWithCommas(1234567, 'de-DE'); // '1.234.567'

// Parse back to number
parseNumberWithCommas('1,234,567'); // 1234567
```

### Example: CSS Variables

```jsx
import { getCSSVariableValue } from '@mezzanine-ui/react';

// Read design token values at runtime
const brandColor = getCSSVariableValue('--mzn-color-text-brand');
```

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
