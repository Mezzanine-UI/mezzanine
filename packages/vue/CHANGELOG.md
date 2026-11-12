# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-rc.13](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/vue@1.0.0-rc.12...@mezzanine-ui/vue@1.0.0-rc.13) (2026-11-12)

### Bug Fixes

- **vue/table:** name dropdown action listboxes ([617b22f](https://github.com/Mezzanine-UI/mezzanine/commit/617b22f9ff080535a966f7c1538758cb9303f6be))

# [1.0.0-rc.12](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/vue@1.0.0-rc.11...@mezzanine-ui/vue@1.0.0-rc.12) (2026-11-11)

### Features

- **vue/textarea:** add fullWidth ([b531539](https://github.com/Mezzanine-UI/mezzanine/commit/b531539adfc103f914c95ed9092dde6359dd4833)), closes [#523](https://github.com/Mezzanine-UI/mezzanine/issues/523)

# [1.0.0-rc.11](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/vue@1.0.0-rc.10...@mezzanine-ui/vue@1.0.0-rc.11) (2026-11-06)

### Features

- **vue/calendar:** customize the footer control and respect disabled periods ([#521](https://github.com/Mezzanine-UI/mezzanine/issues/521)) ([450a87a](https://github.com/Mezzanine-UI/mezzanine/commit/450a87a0e7bbdb557a3ce7193359bf931153eb32))

# [1.0.0-rc.10](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/vue@1.0.0-rc.9...@mezzanine-ui/vue@1.0.0-rc.10) (2026-11-05)

### Bug Fixes

- **vue/auto-complete:** honour readOnly prop ([#517](https://github.com/Mezzanine-UI/mezzanine/issues/517)) ([0be4f8a](https://github.com/Mezzanine-UI/mezzanine/commit/0be4f8ad2a650e6d81e67c4f7fa4912dbbea0262))
- **vue/picker:** restore the caret before the next key arrives ([#518](https://github.com/Mezzanine-UI/mezzanine/issues/518)) ([9d48713](https://github.com/Mezzanine-UI/mezzanine/commit/9d48713e36632c19e324edc5853bd412ad50c31b))

# [1.0.0-rc.9](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/vue@1.0.0-rc.8...@mezzanine-ui/vue@1.0.0-rc.9) (2026-11-03)

### Bug Fixes

- **vue/auto-complete:** allow re-search right after a single select ([4928163](https://github.com/Mezzanine-UI/mezzanine/commit/49281631b8e2476d63e40a195045adcdb65ac851)), closes [#489](https://github.com/Mezzanine-UI/mezzanine/issues/489)
- **vue/button-group:** emit aria-orientation only for supporting roles ([#502](https://github.com/Mezzanine-UI/mezzanine/issues/502)) ([69878a6](https://github.com/Mezzanine-UI/mezzanine/commit/69878a60e7132f6ac9e5e858b993a46fc75122a8))
- **vue/clear-actions:** let caller aria-label override default Close ([#498](https://github.com/Mezzanine-UI/mezzanine/issues/498)) ([8acb300](https://github.com/Mezzanine-UI/mezzanine/commit/8acb3006a7a9af88c5ab82684675e1f59234c282))
- **vue/drawer:** implement the dialog focus model, matching React ([c1cca8f](https://github.com/Mezzanine-UI/mezzanine/commit/c1cca8f2a416d15e0f0f9436c3920d470a4a63a0)), closes [#490](https://github.com/Mezzanine-UI/mezzanine/issues/490)
- **vue/dropdown:** enable shift by default ([#494](https://github.com/Mezzanine-UI/mezzanine/issues/494)) ([46d9aeb](https://github.com/Mezzanine-UI/mezzanine/commit/46d9aeb5322f5476e0950b5928f9bdaf093913ce))
- **vue/dropdown:** keep button semantics on native button triggers ([#503](https://github.com/Mezzanine-UI/mezzanine/issues/503)) ([67f87b0](https://github.com/Mezzanine-UI/mezzanine/commit/67f87b0c03d305f16cb2b2583e57f8aaabb6eeb8))
- **vue/input:** forward aria attrs to native input ([#504](https://github.com/Mezzanine-UI/mezzanine/issues/504)) ([16ff523](https://github.com/Mezzanine-UI/mezzanine/commit/16ff52375862b8492febd5577232a0af6226835e))
- **vue/internal:** remove stray 'use client' directive ([00477c2](https://github.com/Mezzanine-UI/mezzanine/commit/00477c222178638f66e4a0101f5c0a5ae02e4856))
- **vue/modal:** forward disableScrollLock through the modal container ([#499](https://github.com/Mezzanine-UI/mezzanine/issues/499)) ([e1f066f](https://github.com/Mezzanine-UI/mezzanine/commit/e1f066f8aeb16fcc5e50ac3f53cf481ae4772d5b))
- **vue/modal:** label dialog by modal header title ([#497](https://github.com/Mezzanine-UI/mezzanine/issues/497)) ([beded85](https://github.com/Mezzanine-UI/mezzanine/commit/beded853450843f5f36fecf3348099d08103ac7c))
- **vue/navigation:** name collapsed navigation options by title ([#496](https://github.com/Mezzanine-UI/mezzanine/issues/496)) ([b2b5701](https://github.com/Mezzanine-UI/mezzanine/commit/b2b570149831d87cb0d63440e2e36b49a5d41355))
- **vue/navigation:** name image-only user menu trigger ([#505](https://github.com/Mezzanine-UI/mezzanine/issues/505)) ([47ec3cf](https://github.com/Mezzanine-UI/mezzanine/commit/47ec3cf345c6b9ac3409d7d2cd0ea136fc1cc311))
- **vue/notification-center:** localize sub-minute time stamp and keep it fresh ([#492](https://github.com/Mezzanine-UI/mezzanine/issues/492)) ([fad0c19](https://github.com/Mezzanine-UI/mezzanine/commit/fad0c192f43735020d628e16ca7bebf5c41b70ca))
- **vue/page-footer:** add dropdownTriggerAriaLabel for overflow trigger ([#495](https://github.com/Mezzanine-UI/mezzanine/issues/495)) ([9191487](https://github.com/Mezzanine-UI/mezzanine/commit/919148798b0dcc0dea5272741cd5d4706317ec09))
- **vue/portal:** match server markup on the hydration pass ([#500](https://github.com/Mezzanine-UI/mezzanine/issues/500)) ([26181e4](https://github.com/Mezzanine-UI/mezzanine/commit/26181e4c9cb26d046c04ca11c6c40d617cb9cc6a))
- **vue/select:** expose combobox ARIA and aria-label on the input ([#506](https://github.com/Mezzanine-UI/mezzanine/issues/506)) ([c15108c](https://github.com/Mezzanine-UI/mezzanine/commit/c15108c9efcfe6f09b04ff14344de79b2df0c72b))
- **vue/table:** render bulk action separators only after a preceding group ([#493](https://github.com/Mezzanine-UI/mezzanine/issues/493)) ([f41553c](https://github.com/Mezzanine-UI/mezzanine/commit/f41553cdbf7e78ca17fa6d42ca10dcb524b26ccb))
- **vue:** drop angle-bracket tags from script comments ([1fcfc11](https://github.com/Mezzanine-UI/mezzanine/commit/1fcfc11fcea41c0a0b750701481375c639c4fa49))

### Features

- **vue/internal:** add splitAriaAttrs helper ([7726c66](https://github.com/Mezzanine-UI/mezzanine/commit/7726c6640725452ebd36c99cb3f520943e0c4351))

# [1.0.0-rc.8](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/vue@1.0.0-rc.7...@mezzanine-ui/vue@1.0.0-rc.8) (2026-10-29)

### Bug Fixes

- **vue/internal:** skip fieldset-disabled controls in focus trap ([691bd76](https://github.com/Mezzanine-UI/mezzanine/commit/691bd768534e85231e6422b04766e8b3be413cf0)), closes [#481](https://github.com/Mezzanine-UI/mezzanine/issues/481)
- **vue/modal:** keep in-dialog focus when the enter transition ends ([8349ef6](https://github.com/Mezzanine-UI/mezzanine/commit/8349ef62e621ea02c2ef52f5923707c6be08d1da)), closes [#482](https://github.com/Mezzanine-UI/mezzanine/issues/482)

# [1.0.0-rc.7](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/vue@1.0.0-rc.6...@mezzanine-ui/vue@1.0.0-rc.7) (2026-10-27)

### Bug Fixes

- **vue/dropdown:** close uncontrolled menu after an option is clicked ([2ead220](https://github.com/Mezzanine-UI/mezzanine/commit/2ead22043dd3e34c7ca203485523ed934d7bab91)), closes [#477](https://github.com/Mezzanine-UI/mezzanine/issues/477)
- **vue/filter-area:** support loading and button props on actions ([5062118](https://github.com/Mezzanine-UI/mezzanine/commit/506211862a36b01a826bfa7f9f24749c68ade987)), closes [#478](https://github.com/Mezzanine-UI/mezzanine/issues/478)

# [1.0.0-rc.6](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/vue@1.0.0-rc.5...@mezzanine-ui/vue@1.0.0-rc.6) (2026-10-22)

### Bug Fixes

- **vue/select:** forward isForceClearable to SelectTrigger ([ffc73c0](https://github.com/Mezzanine-UI/mezzanine/commit/ffc73c0530f093512f9b00c79331af0f9b7c93e6)), closes [#475](https://github.com/Mezzanine-UI/mezzanine/issues/475)

# [1.0.0-rc.5](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/vue@1.0.0-rc.4...@mezzanine-ui/vue@1.0.0-rc.5) (2026-10-21)

### Bug Fixes

- **vue/picker:** let typing replace a filled cell and skip unchanged commits ([#473](https://github.com/Mezzanine-UI/mezzanine/issues/473)) ([adc23b2](https://github.com/Mezzanine-UI/mezzanine/commit/adc23b25bb9e4aaeb0138ae9e8215160a833893d))
- **vue/scrollbar:** detect a viewportReady listener from the vnode ([dd92446](https://github.com/Mezzanine-UI/mezzanine/commit/dd92446e8092e24dd750ad2f377f399968e57800))

# [1.0.0-rc.4](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/vue@1.0.0-rc.3...@mezzanine-ui/vue@1.0.0-rc.4) (2026-10-20)

### Bug Fixes

- **vue/table:** include pinnable handle column in resize offset ([c8aacc6](https://github.com/Mezzanine-UI/mezzanine/commit/c8aacc6a5412a0c09ae8972a2de4a2243dee0495))

### Features

- **vue/table:** add columnWidths and columnWidthsChange for resizable columns ([35add9b](https://github.com/Mezzanine-UI/mezzanine/commit/35add9b5639c1129eb12cfd0786ace09ae0c664f)), closes [#471](https://github.com/Mezzanine-UI/mezzanine/issues/471)

# [1.0.0-rc.3](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/vue@1.0.0-rc.2...@mezzanine-ui/vue@1.0.0-rc.3) (2026-10-12)

**Note:** Version bump only for package @mezzanine-ui/vue

# [1.0.0-rc.2](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/vue@1.0.0-rc.1...@mezzanine-ui/vue@1.0.0-rc.2) (2026-10-02)

### Bug Fixes

- **vue/scrollbar:** respect a caller-supplied options.overflow ([7508b1a](https://github.com/Mezzanine-UI/mezzanine/commit/7508b1a3d63fbac9f1b04bbde33e4154ca9d9e2e))

### Features

- **vue/table:** add scrollbarOptions and contain the scroll area ([25a3cf4](https://github.com/Mezzanine-UI/mezzanine/commit/25a3cf44b934de0ac72600b95d564bd8372f43d2))

# [1.0.0-rc.1](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/vue@1.0.0-rc.0...@mezzanine-ui/vue@1.0.0-rc.1) (2026-09-08)

### Bug Fixes

- **vue:** restore the lodash dependency range ([e76d51d](https://github.com/Mezzanine-UI/mezzanine/commit/e76d51df9f3c2d6716587b52b464044851d30a90))
