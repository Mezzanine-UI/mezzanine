# @mezzanine-ui/icons

SVG icon definitions for Mezzanine UI. Each icon is exported as a typed icon descriptor object and rendered through the `Icon` component provided by `@mezzanine-ui/react`.

## Installation

```bash
npm install @mezzanine-ui/icons
```

When using icons inside a React application, also install `@mezzanine-ui/react`:

```bash
npm install @mezzanine-ui/react @mezzanine-ui/core @mezzanine-ui/icons @mezzanine-ui/system
```

## Usage

Pass an icon descriptor as the `icon` prop of the `Icon` component:

```tsx
import Icon from '@mezzanine-ui/react/Icon';
import { SearchIcon } from '@mezzanine-ui/icons';

function SearchButton() {
  return <Icon icon={SearchIcon} />;
}
```

The `Icon` component controls rendering size and color via props and CSS custom properties defined in `@mezzanine-ui/system`. The icon descriptors in this package have no runtime dependencies of their own.

## License

MIT
