# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-rc.4](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/ng@1.0.0-rc.3...@mezzanine-ui/ng@1.0.0-rc.4) (2026-04-22)

**Note:** Version bump only for package @mezzanine-ui/ng

# [1.0.0-rc.3](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/ng@1.0.0-rc.2...@mezzanine-ui/ng@1.0.0-rc.3) (2026-04-21)

### Bug Fixes

- **ng:** declare `clsx` as an explicit dependency so the package can be installed standalone without relying on `@mezzanine-ui/react` hoisting it through the workspace ([2acd076](https://github.com/Mezzanine-UI/mezzanine/commit/2acd076c5ebf3c8f57d87953da6ce8091bc72e13))
- **ng:** whitelist `clsx` in `ng-package.json` `allowedNonPeerDependencies` so ng-packagr can emit the package manifest during build

# [1.0.0-rc.2](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/ng@1.0.0-rc.1...@mezzanine-ui/ng@1.0.0-rc.2) (2026-04-21)

### Dependencies

- bump `@mezzanine-ui/core` from `1.0.3-rc.1` to `1.0.3` (graduated to stable)

# [1.0.0-rc.1](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/ng@1.0.0-rc.0...@mezzanine-ui/ng@1.0.0-rc.1) (2026-04-20)

### Bug Fixes

- **ng/accordion:** strongly type group context parameter as MznAccordion ([603336b](https://github.com/Mezzanine-UI/mezzanine/commit/603336bd42f7cfc5f4468dfb817769588480b305))

### Features

- **ng/breadcrumb:** implement overflow menu with popper + click-away ([438676e](https://github.com/Mezzanine-UI/mezzanine/commit/438676e25afa0cf325a5878e39be1e95e1820281))
- **ng/checkbox:** port CheckboxGroup level bundle prop from React ([9e33030](https://github.com/Mezzanine-UI/mezzanine/commit/9e330302b1bae1456ba87d496a0bdb593f494336))
