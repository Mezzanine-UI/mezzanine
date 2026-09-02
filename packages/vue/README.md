# @mezzanine-ui/vue

Vue 3 components for Mezzanine UI.

Components are published as sub-path entry points:

```ts
import { MznButton } from '@mezzanine-ui/vue/button';
```

Styles are provided by `@mezzanine-ui/core`; this package ships no stylesheets
of its own. Load the core styles once in your application entry:

```scss
@use '@mezzanine-ui/system';
@use '@mezzanine-ui/core';

:root {
  @include system.common-variables('default');
  @include system.colors();
}

@include core.styles();
```

## Development

This package is a prop-for-prop port of `@mezzanine-ui/react`. See
`.claude/skills/architecting-vue-components/` in the repository for the
mandatory porting rules and the parity harness contract.
