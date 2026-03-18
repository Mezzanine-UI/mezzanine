# @mezzanine-ui/core

CSS styles, SCSS sources, and TypeScript type definitions for Mezzanine UI components. This package ships per-component stylesheets that are consumed by `@mezzanine-ui/react`, and can also be imported directly if you are building a custom integration.

## Installation

```bash
npm install @mezzanine-ui/core @mezzanine-ui/icons @mezzanine-ui/system
```

## Peer Dependencies

| Package  | Version | Required |
| -------- | ------- | -------- |
| `lodash` | `>= 4`  | Yes      |
| `dayjs`  | `>= 1`  | Optional |
| `luxon`  | `>= 3`  | Optional |
| `moment` | `>= 2`  | Optional |

Date library peers are only needed if you use date-related components (e.g. DatePicker, DateRangePicker).

## Usage

Import the stylesheet for each component you use:

```scss
@use '@mezzanine-ui/core/button/styles';
@use '@mezzanine-ui/core/input/styles';
```

Or import all styles at once from your global stylesheet entry:

```scss
@use '@mezzanine-ui/core/styles';
```

## Typical Usage

This package is typically consumed indirectly through `@mezzanine-ui/react`. Install `@mezzanine-ui/react` and import individual component styles as shown above. Direct use of this package is useful when you want styles without the React layer, or when integrating with a different framework.

## License

MIT
