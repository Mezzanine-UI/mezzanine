# Mezzanine UI

## BEFORE YOU STARTED

This project is in beta version, and currently being used by rytass internal projects. <br />
Please consider the possibility of api changes if you want to use it in production mode.

## Storybook preview

If you are interested about this project, please see: [Storybook](https://storybook.mezzanine-ui.org)

## Migrations

If you are an existing mezzanine users and looking for migration guides, please see [Migrations](https://github.com/Mezzanine-UI/mezzanine/tree/main/migrations).

## Browser Support
`Google Chrome` 64 or newer (2018) <br />
`Edge` 79 or newer (2020) <br />
`Safari` 13.1 or newer (2020) <br />
`Firefox` 69 or newer (2019) <br />

---

## Installation

For fully installation:

```
yarn add @mezzanine-ui/core @mezzanine-ui/react @mezzanine-ui/system @mezzanine-ui/icons
```

## Setup

### Quickly Setup

All you need is to create a `main.scss` file (or your favorite filename), and add:

```scss
@use '~@mezzanine-ui/system' as mzn-system;
@use '~@mezzanine-ui/core' as mzn-core;

:root {
  @include mzn-system.common-variables();
  @include mzn-system.palette();
}

@include mzn-core.styles();
```

then import this file at your root

```jsx
import './main.scss';

function App() {}
```

### Customize palette

Here are default palette.

```scss
$custom-palette: (
  light: (
    primary: #465bc7,
    primary-light: #778de8,
    primary-dark: #2d2d9e,
    on-primary: #fff,
    secondary: #383838,
    secondary-light: #6a6a6a,
    secondary-dark: #161616,
    on-secondary: #fff,
    error: #db2b1d,
    error-light: #f75142,
    error-dark: #c00f03,
    on-error: #fff,
    warning: #f7ac38,
    warning-light: #fdd948,
    warning-dark: #f1842b,
    on-warning: #fff,
    success: #2e8d36,
    success-light: #42ae4a,
    success-dark: #0c5d19,
    on-success: #fff,
    text-primary: #161616,
    text-secondary: #8f8f8f,
    text-disabled: #bcbcbc,
    action-active: #161616,
    action-inactive: #8f8f8f,
    action-disabled: #bcbcbc,
    action-disabled-bg: #e5e5e5,
    bg: #f4f4f4,
    surface: #fff,
    border: #d9d9d9,
    divider: #f2f2f2,
  ),
);

:root {
  @include mzn-system.palette('light', $custom-palette);
}
```

### Customize common system variables

**System common variables** contains `typography`, `motion`, `spacing`, `z-index`

- **typography**: `base` contains `font-family` and each tag contains `font-size`, `font-weight`, `letter-spacing`, `line-height`. We recommend
  to use our `px-to-rem` or `px-to-em` to convert pixel into `rem` or `em`.
- **motion**: motion contains `duration` and `easing` which used by `Transition`, `Collapse`...etc
- **spacing**: spacings used by mezzanine internally, we **RECOMMEND NOT** to modify these values only if you fully understand mezzanine design system.
- **z-index**: z-index start from 1000 as default.

Default values are listed as below.

```scss
@use 'sass:string';
@use '~@mezzanine-ui/system' as mzn-system;
@use '~@mezzanine-ui/system/typography' as mzn-typography;

$custom-variables: (
  typography: (
    base: (
      font-family: string.unquote('PingFang TC, Microsoft JhengHei'),
    ),
    h1: (
      font-size: mzn-typography.px-to-rem(32px),
      font-weight: 600,
      letter-spacing: mzn-typography.px-to-em(4px),
      line-height: mzn-typography.px-to-rem(48px),
    ),
    h2: (
      font-size: mzn-typography.px-to-rem(24px),
      font-weight: 600,
      letter-spacing: mzn-typography.px-to-em(2px),
      line-height: mzn-typography.px-to-rem(36px),
    ),
    h3: (
      font-size: mzn-typography.px-to-rem(22px),
      font-weight: 500,
      letter-spacing: mzn-typography.px-to-em(2px),
      line-height: mzn-typography.px-to-rem(32px),
    ),
    h4: (
      font-size: mzn-typography.px-to-rem(18px),
      font-weight: 500,
      letter-spacing: mzn-typography.px-to-em(1px),
      line-height: mzn-typography.px-to-rem(28px),
    ),
    h5: (
      font-size: mzn-typography.px-to-rem(15px),
      font-weight: 500,
      letter-spacing: 0,
      line-height: mzn-typography.px-to-rem(24px),
    ),
    h6: (
      font-size: mzn-typography.px-to-rem(13px),
      font-weight: 500,
      letter-spacing: 0,
      line-height: mzn-typography.px-to-rem(20px),
    ),
    button1: (
      font-size: mzn-typography.px-to-rem(15px),
      font-weight: 500,
      letter-spacing: mzn-typography.px-to-em(2px),
      line-height: mzn-typography.px-to-rem(40px),
    ),
    button2: (
      font-size: mzn-typography.px-to-rem(15px),
      font-weight: 500,
      letter-spacing: mzn-typography.px-to-em(2px),
      line-height: mzn-typography.px-to-rem(32px),
    ),
    button3: (
      font-size: mzn-typography.px-to-rem(13px),
      font-weight: 500,
      letter-spacing: mzn-typography.px-to-em(1px),
      line-height: mzn-typography.px-to-rem(24px),
    ),
    input1: (
      font-size: mzn-typography.px-to-rem(15px),
      font-weight: 400,
      letter-spacing: mzn-typography.px-to-em(1px),
      line-height: mzn-typography.px-to-rem(40px),
    ),
    input2: (
      font-size: mzn-typography.px-to-rem(15px),
      font-weight: 400,
      letter-spacing: mzn-typography.px-to-em(1px),
      line-height: mzn-typography.px-to-rem(32px),
    ),
    input3: (
      font-size: mzn-typography.px-to-rem(13px),
      font-weight: 400,
      letter-spacing: 0,
      line-height: mzn-typography.px-to-rem(24px),
    ),
    body1: (
      font-size: mzn-typography.px-to-rem(15px),
      font-weight: 400,
      letter-spacing: 0,
      line-height: mzn-typography.px-to-rem(24px),
    ),
    body2: (
      font-size: mzn-typography.px-to-rem(13px),
      font-weight: 400,
      letter-spacing: 0,
      line-height: mzn-typography.px-to-rem(20px),
    ),
    caption: (
      font-size: mzn-typography.px-to-rem(12px),
      font-weight: 400,
      letter-spacing: 0,
      line-height: mzn-typography.px-to-rem(16px),
    ),
  ),
  motion: (
    durations: (
      shortest: 150ms,
      shorter: 200ms,
      short: 250ms,
      standard: 300ms,
      long: 375ms,
    ),
    easings: (
      standard: cubic-bezier(0.58, 0.01, 0.29, 1.01),
      emphasized: cubic-bezier(0.83, 0, 0.17, 1),
      decelerated: cubic-bezier(0, 0, 0.3, 1),
      accelerated: cubic-bezier(0.32, 0, 0.67, 0),
    ),
  ),
  spacing: (
    4px,
    8px,
    12px,
    16px,
    24px,
    32px,
    40px,
    48px,
    64px,
    96px,
    160px,
  ),
  z-index: 1000,
);

:root {
  @include mzn-system.common-variables($custom-variables);
}
```

and in your component level

#### Use mezzanine typography

If `h1` typography is needed, apply it like this:

```scss
@use '~@mezzanine-ui/system/typography';

.text {
  @include typography.variant(h1);
}
```

#### Use mezzanine transition (motion)

If `standard` transition is needed, apply it like this:

```scss
@use '~@mezzanine-ui/system/transition';

.text {
  transition: transition.standard(color);
}
```

#### Use mezzanine z-index

If `modal` z-index is needed, apply it like this:

```scss
@use '~@mezzanine-ui/system/z-index';

.text {
  z-index: z-index.get(modal);
}
```

Notice that mezzanine z-index only includes `modal`, `drawer`, `popover`, `feedback`.<br />
If you need more z-index orders, please add extra z-index scss file by yourself since mezzanine isn't support adding custom order name currently.

---

### Usage

Mezzanine components are listed in [storybook](https://storybook.mezzanine-ui.org) and props description can find in `docs` section. <br />

For example:

```tsx
import { Button } from '@mezzanine-ui/react';

function App() {
  return <Button>Click me!</Button>;
}
```

#### React Hooks (not listed in storybook)

Some useful hooks you may needed:

- **useComposeRefs**

Composing react refs, for example:

```jsx
import { forwardRef, useRef } from 'react';
import { useComposeRefs } from '@mezzanine-ui/react';

const Component = forwardRef((props, ref) => {
  const myRef = useRef();
  const composedRef = useComposeRefs([ref, myRef]);

  return <div ref={composedRef} />;
});
```

- **useClickAway**

Detect whether the user click event is triggered outside the target element.
This may be useful when you have modal/message/pop-up...etc over your container, for example:

```jsx
import { useClickAway } from '@mezzanine-ui/react';

function App() {
  useClickAway(
    () => {
      if (disabled) {
        /** Conditions when not willing to triggered */
        return;
      }

      return (event) => {
        /** Conditions when willing to triggered */
        if (onClose) {
          onClose(event);
        }
      };
    },
    popperRef, // your target element (check whether click event is outside this element)
    [
      disabled,
      onClose,
      // ...dependencies
    ]
  );
}
```

- **usePreviousValue**

Store previous render cycle value, for example:

```jsx
import { useState } from 'react';
import { usePreviousValue } from '@mezzanine-ui/react';

function App() {
  const [value] = useState('');
  const previousValue = usePreviousValue(value);
}
```

- **useWindowWidth**

Add `resize` event on window and return `window.innerWidth`

```jsx
import { useWindowWidth } from '@mezzanine-ui/react';

function App() {
  const windowWidth = useWindowWidth();
}
```

And some other hooks used by mezzanine components are also exported if you need:

- **useDocumentEscapeKeyDown**
- **useDocumentEvents**
- **useIsomorphicLayoutEffect**
- **useLastCallback**
- **useDocumentTabKeyDown**
- **useDelayMouseEnterLeave**

---

## 開發指引

### 架構

- monorepo
- core: component styles (writen in scss)
- icons: export svg specific definition icons
- react: react components implementation
- ng: angular components implementation (deprecated)
- system: shared config (typography, palette, transition...etc)

### 規範

- Props 須按照字母 a-z 排序
- Component interface 需寫註解
- BEM css naming + css variables
- Component Storybook
- Unit tests (PR 審核的版本需確認 test coverage 盡可能 100%)
  - cd 到 `react/` 資料夾下，執行 `yarn test:coverage`

### Commits

- 依照各個 monorepo 上的更動，個別 commit
  - feat(core/input): xxx
  - fix(react/input): xxx
- 如果因反覆修改，而在支線上有「不屬於主線」該存在的修改時，應整併 commits
  - feat(react/input): implement react input
  - fix(react/input): fix some bug _(squash this commit)_
  - fix(react/input): fix some bugs again _(squash this commit)_
- commit 時統一使用 `yarn commit`
