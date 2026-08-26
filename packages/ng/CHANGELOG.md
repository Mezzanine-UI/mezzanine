# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-rc.12](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/ng@1.0.0-rc.11...@mezzanine-ui/ng@1.0.0-rc.12) (2026-08-26)

### Bug Fixes

- **ng/radio:** render the projected label for the default radio type ([85d514a](https://github.com/Mezzanine-UI/mezzanine/commit/85d514a070f074f385f5dc632e57cf8a0e9a6a7f))
- **ng/table:** skip rowState for loading placeholder rows ([d6c9e74](https://github.com/Mezzanine-UI/mezzanine/commit/d6c9e74af9cf0d3de9537fd99c960c8027fed016))

# [1.0.0-rc.11](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/ng@1.0.0-rc.10...@mezzanine-ui/ng@1.0.0-rc.11) (2026-08-17)

### Bug Fixes

- **ng/autocomplete:** skip select and create while IME is composing ([21d22ad](https://github.com/Mezzanine-UI/mezzanine/commit/21d22ad55e77f36b681da750db7718ebda9940a9))
- **ng/dropdown:** skip keyboard select while IME is composing ([af90926](https://github.com/Mezzanine-UI/mezzanine/commit/af90926beb96bedbbd8a2549737f1811270f631f))
- **ng/pagination:** skip jumper submit while IME is composing ([250869e](https://github.com/Mezzanine-UI/mezzanine/commit/250869ea70091a75f49f2890364c363c7261b9a8))
- **ng/picker:** skip confirm and close while IME is composing ([d4a7dba](https://github.com/Mezzanine-UI/mezzanine/commit/d4a7dba4f09bc995d4f3b6281e664b136b0c7296))

# [1.0.0-rc.10](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/ng@1.0.0-rc.9...@mezzanine-ui/ng@1.0.0-rc.10) (2026-07-21)

### Features

- **ng/autocomplete:** add caseSensitive input to mirror React ([f1be96d](https://github.com/Mezzanine-UI/mezzanine/commit/f1be96dc6d1a062620a60f4f75a90e252c5ce55e))

# [1.0.0-rc.9](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/ng@1.0.0-rc.8...@mezzanine-ui/ng@1.0.0-rc.9) (2026-06-22)

### Bug Fixes

- **ng/select:** align tag fake-measurement DOM, aria-disabled, placeholder with React ([751535b](https://github.com/Mezzanine-UI/mezzanine/commit/751535b56e4baca5e0f940f04bc9009c416adbcf))
- **ng/select:** align trigger ARIA, suffix-icon cursor and input value attr with React ([b9b7563](https://github.com/Mezzanine-UI/mezzanine/commit/b9b7563cebe26800c8d61f05332a6066d339a4e7))
- **ng/select:** align trigger input value/placeholder with React getPlaceholder ([f18c504](https://github.com/Mezzanine-UI/mezzanine/commit/f18c504a95c00305251aedd7057a5930b2fc379d))
- **ng/select:** forward disabled state to the trigger input ([415cae3](https://github.com/Mezzanine-UI/mezzanine/commit/415cae338668d7d2a959e23e0a1bd59e3aaa58c3))
- **ng/select:** mirror React clearable/slim-gap (multiple-only inline clear) ([4aa0082](https://github.com/Mezzanine-UI/mezzanine/commit/4aa008220fb5c5e8c090e63939b2d4ed15906aa0))
- **ng/select:** mirror React TagGroup per-child span wrapper in multiple tags ([e0e5bf1](https://github.com/Mezzanine-UI/mezzanine/commit/e0e5bf174f0848e7ff4a074abfe73b3955bc5fc6))
- **ng/select:** wire trigger aria-controls to the listbox id ([fc44734](https://github.com/Mezzanine-UI/mezzanine/commit/fc44734e552dfb148fe22708b6a2a9d30b87ce2a))
- **ng/select:** wrap trigger in mzn-dropdown--outside to mirror React DOM ([9d6346e](https://github.com/Mezzanine-UI/mezzanine/commit/9d6346e275c76847cbf943ab2964e88db6ff01fe))

- feat(ng/dropdown)!: rewrite popover with cdk overlay and align api to react ([d24fbe4](https://github.com/Mezzanine-UI/mezzanine/commit/d24fbe4e685f84ccaf8c93e640c3fe78a7006a48))
- feat(ng/select)!: align outputs with React (rename on-prefixed, add blur/clear/focus/tagClose) ([ee3573b](https://github.com/Mezzanine-UI/mezzanine/commit/ee3573b5c842c326a3db2685ac057da6228b2be6))

### Features

- **ng/dropdown:** add CDK Overlay popper directive and item/action props ([c690e71](https://github.com/Mezzanine-UI/mezzanine/commit/c690e71edb2c49724f4ddc930a94eb7290360944))
- **ng/select:** add React-parity inputs (value/defaultValue/warning/forceXxx/…) ([e372806](https://github.com/Mezzanine-UI/mezzanine/commit/e3728061153db0d16876f6d46f0e693123df3feb))

### BREAKING CHANGES

- MznDropdown outputs renamed (closed->close, selected->select,
  itemHovered->itemHover, actionCancelled->actionCancel, actionCleared->
  actionClear, actionConfirmed->actionConfirm, actionCustomClicked->actionCustom);
  inputs actionConfig/name/showCheckIcon/showHeader/disableClickAway removed.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>

- MznSelect outputs renamed — (onScroll)->(scroll),
  (onReachBottom)->(reachBottom), (onLeaveBottom)->(leaveBottom),
  (selectionChange)->(change).

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
(cherry picked from commit 1b7928fd8989db0ac1a62dc680d32ca05043c2ea)

# [1.0.0-rc.8](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/ng@1.0.0-rc.7...@mezzanine-ui/ng@1.0.0-rc.8) (2026-06-18)

### Features

- **ng/dropdown:** add flip input mirroring React Dropdown ([861b71e](https://github.com/Mezzanine-UI/mezzanine/commit/861b71e9dc103f14275034c0f3f5cce249d024fc))
- **ng/select:** forward flip through InputTriggerPopper with placement-aware transition ([da9c9b6](https://github.com/Mezzanine-UI/mezzanine/commit/da9c9b6666b1ba134ae599de1f4ef5c19dc5a668))

# [1.0.0-rc.7](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/ng@1.0.0-rc.6...@mezzanine-ui/ng@1.0.0-rc.7) (2026-06-11)

### Bug Fixes

- **ng/input:** throw on native input host to prevent silent CVA failure ([17f53ad](https://github.com/Mezzanine-UI/mezzanine/commit/17f53adb3a2680f11d559bc9017c64cd3030a187))

# [1.0.0-rc.6](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/ng@1.0.0-rc.5...@mezzanine-ui/ng@1.0.0-rc.6) (2026-05-22)

### Bug Fixes

- **ng/table:** align resize donor strategy with React ([bc3e604](https://github.com/Mezzanine-UI/mezzanine/commit/bc3e604f0a0eb89ea1d2651746708845fb07dcb2))

# [1.0.0-rc.5](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/ng@1.0.0-rc.4...@mezzanine-ui/ng@1.0.0-rc.5) (2026-05-07)

### Features

- **ng/calendar:** add Temporal column to multi-adapter stories ([d1f070f](https://github.com/Mezzanine-UI/mezzanine/commit/d1f070fee47ae767f0a5f7a03e769acc90ff4ce3))

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
