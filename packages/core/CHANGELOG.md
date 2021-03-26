# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.0.7](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/core@0.0.6...@mezzanine-ui/core@0.0.7) (2021-03-26)

### Bug Fixes

- **core/overlay:** add fixed position styling to fix scrollable container bug ([926d4fb](https://github.com/Mezzanine-UI/mezzanine/commit/926d4fb6dc7a54cf756c7ab000b8b24bcfe4b1d8)), closes [#33](https://github.com/Mezzanine-UI/mezzanine/issues/33) [#33](https://github.com/Mezzanine-UI/mezzanine/issues/33)

### Features

- **core/overlay:** add invisible backdrop styling class ([2272a62](https://github.com/Mezzanine-UI/mezzanine/commit/2272a629fe805127d3123ac7a498275862677ea0))
- **core/select:** first implementation ([e9449a1](https://github.com/Mezzanine-UI/mezzanine/commit/e9449a113d4bda79b27b425e33a3b5e6744c7a8f))
- **core/text-field:** add action-icon slot for text field and allow container height growing ([37af8c4](https://github.com/Mezzanine-UI/mezzanine/commit/37af8c4140cbfcfe9a78ccc8501f8871472d097e))

## [0.0.6](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/core@0.0.5...@mezzanine-ui/core@0.0.6) (2021-03-19)

### Bug Fixes

- **core/form:** avoid control section of form field stretched while full width ([aeae510](https://github.com/Mezzanine-UI/mezzanine/commit/aeae510d5cf9e3fed5adf533326542de0439a6fc))

### Features

- **core/checkbox:** implement via design draft ([af54674](https://github.com/Mezzanine-UI/mezzanine/commit/af5467455beb3fa83fc421521af0b38bba0d439d))
- **core/radio:** implement via design draft ([17c5911](https://github.com/Mezzanine-UI/mezzanine/commit/17c59113ff0b6bb9b18a738a6f80244f82be7c80))

## [0.0.5](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/core@0.0.3...@mezzanine-ui/core@0.0.5) (2021-03-15)

### Bug Fixes

- **core/alert:** add transition to close icon of alert ([67211bf](https://github.com/Mezzanine-UI/mezzanine/commit/67211bfd48b4f102498bb2b49aefc31b1d72e9bb))
- **core/badge:** set badge to scale(0) instead of display none while hidden ([8bf9ca1](https://github.com/Mezzanine-UI/mezzanine/commit/8bf9ca1b0335ba5368853891689ee1527c661296))
- **core/button:** add transition to button ([b75a328](https://github.com/Mezzanine-UI/mezzanine/commit/b75a3281eada8b3491a8d3cd39bdd2a9632aea47))
- **core/form:** add transition to form message ([8af1869](https://github.com/Mezzanine-UI/mezzanine/commit/8af186923ed91bc3a1fd596a495429729ad38e6d))
- **core/message:** use SeverityWithInfo instead of SeverityForFeedback ([1ec07a6](https://github.com/Mezzanine-UI/mezzanine/commit/1ec07a615296c4612678f92acbb93af2ad1dca15))
- **core/modal:** add transition to close icon of modal ([6c13f5d](https://github.com/Mezzanine-UI/mezzanine/commit/6c13f5dae4065b394eef19f8b842224f3cf4608d))
- **core/modal:** correctly place action buttons of modal actions on the right side ([a7ea8f5](https://github.com/Mezzanine-UI/mezzanine/commit/a7ea8f54a54850879467597fdc30905537f110e6))
- **core/switch:** add transition to switch ([363790d](https://github.com/Mezzanine-UI/mezzanine/commit/363790d7a7193520f9128e0b777aaff0b944ba24))
- **core/tag:** add transition to tag and fix color of close icon ([37c8b4e](https://github.com/Mezzanine-UI/mezzanine/commit/37c8b4e2e327c1d3f4711c2318fd448f16c47ce7))
- **core/text-field:** add transition to text field ([50e96b5](https://github.com/Mezzanine-UI/mezzanine/commit/50e96b56c77b0078560ee468648a51eead051276))
- **core/textarea:** add transition to count of textarea ([ce31858](https://github.com/Mezzanine-UI/mezzanine/commit/ce318584663b1f334a71c97b341d5cd25f304578))
- **core/upload:** add transition to upload result ([25525a5](https://github.com/Mezzanine-UI/mezzanine/commit/25525a57138d39190d59757d6026ddacc7b4c92a))

### Code Refactoring

- **core/modal:** add severity to modal ([523d486](https://github.com/Mezzanine-UI/mezzanine/commit/523d48600daf02c77b1d1b362f26ff043760ba30))

### BREAKING CHANGES

- **core/modal:** use severity instead of danger

## [0.0.3](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/core@0.0.2...@mezzanine-ui/core@0.0.3) (2021-03-09)

### Bug Fixes

- **core/alert:** set correctly color ([fc376eb](https://github.com/Mezzanine-UI/mezzanine/commit/fc376eb9468826bb2a908cc8ccebd9796adb2316))
- **core/button:** remove redundant height property ([20b4ae7](https://github.com/Mezzanine-UI/mezzanine/commit/20b4ae78cec39413fd9072aef7a219c13253f9f9))
- **core/empty:** add missing color and typography ([3985fca](https://github.com/Mezzanine-UI/mezzanine/commit/3985fca53c873f46fa279824bbbdd6c1243ff445))
- **core/menu:** no need to separate line-height from typography.variant() ([044dba8](https://github.com/Mezzanine-UI/mezzanine/commit/044dba814d9e6eeec2b8613629c0c8939eb3425f))
- **core/modal:** move typography to host of modal for provided to both body and footer ([57844b3](https://github.com/Mezzanine-UI/mezzanine/commit/57844b32e67cd8b7367d940890679fce34126381))
- **core/popconfirm:** provide icon class instead of nested ([ddf1fd7](https://github.com/Mezzanine-UI/mezzanine/commit/ddf1fd79cc194986cd3a4ed31ade8341dc2c1eb1))
- **core/switch:** remove redundant calc() ([818995f](https://github.com/Mezzanine-UI/mezzanine/commit/818995f4076514601a024c173e1a76669fc25d78))
- **core/text-field:** no need to separate line-height from typography.variant() ([58551ca](https://github.com/Mezzanine-UI/mezzanine/commit/58551ca6add21fd98ed81d68c9ba0585dcf18ebb))
- **core/textarea:** add missing typography ([0070baf](https://github.com/Mezzanine-UI/mezzanine/commit/0070bafd26cee015cb457b5dc73cd1502966d048))
- **core/upload:** fix height of upload result ([28091f1](https://github.com/Mezzanine-UI/mezzanine/commit/28091f187a06ea9c115a2ef2c54f31d54a14959c))

## [0.0.2](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/core@0.0.1...@mezzanine-ui/core@0.0.2) (2021-03-05)

### Bug Fixes

- **core:** add missing z-index on message and popover ([bfd34fc](https://github.com/Mezzanine-UI/mezzanine/commit/bfd34fcdf3538b4fb76b091998009dd9f32324df))

### Features

- **core/modal:** add full screen mode ([2274aff](https://github.com/Mezzanine-UI/mezzanine/commit/2274aff9942041a74615cd114d909799696f9746))
- **core/modal:** implement via design draft ([1c01998](https://github.com/Mezzanine-UI/mezzanine/commit/1c019981bfbf09edda436d9b4fe8730f1d4ff655))
- **core/overlay:** implement via design draft ([c8bf106](https://github.com/Mezzanine-UI/mezzanine/commit/c8bf10620c4d45ec1d90ab1918b38f4e2c85c4f3))
- **core/tabs:** implement via design draft ([ee557dc](https://github.com/Mezzanine-UI/mezzanine/commit/ee557dc99febd45541b26a14f748c6c7018de88e))

## 0.0.1 (2021-02-26)

### Bug Fixes

- **core/button:** add gap between any elements and button label ([5165e89](https://github.com/Mezzanine-UI/mezzanine/commit/5165e8912f3905b58f3e0db6e14446a77727921d))
- **core/button:** reset some unnecessary rem to px ([0f2d236](https://github.com/Mezzanine-UI/mezzanine/commit/0f2d2363ef4ce3f78769554ba0e5a0a27f5753ac))
- **core/button:** use --disabled instead of :disabled for button not rendered by button tag ([a4cf96c](https://github.com/Mezzanine-UI/mezzanine/commit/a4cf96cbc88f469c79af5d20e2cbe5b78d8eff27))
- **core/empty:** rename fullHeight to full-height ([1de4bf7](https://github.com/Mezzanine-UI/mezzanine/commit/1de4bf709cecf268a8a5defa0413b90895d81695))
- **core/icon:** set color of css variables of icon to undefined if color=undefined ([67a741d](https://github.com/Mezzanine-UI/mezzanine/commit/67a741d733174d0826f06f827b17d44e173f2d1b))
- **core/icon:** set line-height of icon to 0 ([1fe126d](https://github.com/Mezzanine-UI/mezzanine/commit/1fe126dfcdedf817f094697a914c29286772e69a))
- **core/icon:** set line-height of icon to 0 ([f3e1cae](https://github.com/Mezzanine-UI/mezzanine/commit/f3e1caea3ce98a1cf31c50a91e0468568705be62))
- **core/input:** move options of text-field to text-field key ([1a4662c](https://github.com/Mezzanine-UI/mezzanine/commit/1a4662c47cfa3b4f3fccf7584c511ed7585bf992))
- **core/popconfirm:** should include styles of popover ([bdb05c5](https://github.com/Mezzanine-UI/mezzanine/commit/bdb05c5027e7f236deb9222f93dd8033e64cbf62))
- **core/spacing:** typo, MznspacingLevel to MznSpacingLevel ([cad881b](https://github.com/Mezzanine-UI/mezzanine/commit/cad881b7dd5c379eb69d73b60d11877de8596aa5))
- **core/spacing:** use rem on spacing instead of using em ([e9ff107](https://github.com/Mezzanine-UI/mezzanine/commit/e9ff1078eaf799f1ce2538be2600523736738c8b))
- **core/tag:** reset some unnecessary rem to px ([2f99dba](https://github.com/Mezzanine-UI/mezzanine/commit/2f99dba42ad672f1a7edd470c431ec44ec5e2ab2))
- **core/textarea:** move options of text-field to text-field key ([8073403](https://github.com/Mezzanine-UI/mezzanine/commit/8073403b48d1804a2a2f7da108cbb2a1b86f0df8))

### Features

- **core/alert:** implement ([a2c98d0](https://github.com/Mezzanine-UI/mezzanine/commit/a2c98d0b6bbee370525ca60f70aec94083b6e15e))
- **core/badge:** implement ([718ef7d](https://github.com/Mezzanine-UI/mezzanine/commit/718ef7d7970d6b6c50410019293a0712f967ed22))
- **core/button:** add button corresonpding component-specific things ([de64af4](https://github.com/Mezzanine-UI/mezzanine/commit/de64af4fd0dd5ffc876645d5e578175d19874d2a))
- **core/button:** add button group ([ffa7a04](https://github.com/Mezzanine-UI/mezzanine/commit/ffa7a04f08e20284b82688b5bf5ca7b4bbe9a27d))
- **core/css:** add a css utility like taiwind, but use css variables ([829ae8c](https://github.com/Mezzanine-UI/mezzanine/commit/829ae8c205ba5ed0928836dd53c13644e670d9e2))
- **core/css:** add function toCssVar to create css variables like var(--foo) in js/ts ([09b238c](https://github.com/Mezzanine-UI/mezzanine/commit/09b238c6be92d83e4258b0e577fb8e4045bd1fbf))
- **core/empty:** implement design ([521a177](https://github.com/Mezzanine-UI/mezzanine/commit/521a177a14cb99240d848d05c8a7cb0204b15135))
- **core/form:** implement via design draft ([7ac7500](https://github.com/Mezzanine-UI/mezzanine/commit/7ac7500f133a3d9aa7b9619065b184117bd77cbc))
- **core/icon:** add icon corresonpding component-specific things ([b327eb9](https://github.com/Mezzanine-UI/mezzanine/commit/b327eb9e82f842a838688c22591c7580c725548f))
- **core/menu:** implement via design draft ([d39cdb6](https://github.com/Mezzanine-UI/mezzanine/commit/d39cdb63faab3be01fb411d6e957737089688645))
- **core/message:** implement via design draft ([843498f](https://github.com/Mezzanine-UI/mezzanine/commit/843498f1ce94b9d6d0923d8da21fc765aa11b98f))
- **core/orientation:** add typings ([1a5bb2e](https://github.com/Mezzanine-UI/mezzanine/commit/1a5bb2e24a5311b3a415bd4276ea1fb30e4f52a1))
- **core/palette:** add palette corresponding designed system ([f08636e](https://github.com/Mezzanine-UI/mezzanine/commit/f08636ef8412f71c01f2308e229adb8179c8fe30))
- **core/popconfirm:** implement via design draft ([b459d44](https://github.com/Mezzanine-UI/mezzanine/commit/b459d4411547b8c5616291fa5e536b2ea0a44694))
- **core/popover:** implement via design draft ([ab3ba14](https://github.com/Mezzanine-UI/mezzanine/commit/ab3ba1443dff20cd5b120d92b5eec5ab72699745))
- **core/size:** add common size enum ([5752c8b](https://github.com/Mezzanine-UI/mezzanine/commit/5752c8beefda0f3f29c9e0e300d2b0f182418f57))
- **core/spacing:** add spacing corresonpding designed system ([4dfbdca](https://github.com/Mezzanine-UI/mezzanine/commit/4dfbdca636afa03c223fb44a06aa766e049942d0))
- **core/switch:** implement via design draft ([37ec7de](https://github.com/Mezzanine-UI/mezzanine/commit/37ec7deabf15cefe7d39d72fb688288d23d73a46))
- **core/tag:** implement via design draft ([2551131](https://github.com/Mezzanine-UI/mezzanine/commit/25511319730f9ec1db63bde4637af6354d5dc5c2))
- **core/typography:** add typography corresonpding designed system and component-specific things ([5360ac6](https://github.com/Mezzanine-UI/mezzanine/commit/5360ac6a8b0d1f7f3f80e2926d31b962ed7b720c))
- **core/upload:** implement via design draft ([aef7faa](https://github.com/Mezzanine-UI/mezzanine/commit/aef7faae9a0637296d2329db1d82900f40384fc3))
- **core/utils:** add some js-like scss utilities ([4ebcebc](https://github.com/Mezzanine-UI/mezzanine/commit/4ebcebc1c225fc62cedbe9a3945efed4099127eb))
- **ng/badge:** implement ([5771bf7](https://github.com/Mezzanine-UI/mezzanine/commit/5771bf74bad290930e7121ce61c6222a0a5e8255))
- **react/input:** implement ([#5](https://github.com/Mezzanine-UI/mezzanine/issues/5)) ([5e0ef0f](https://github.com/Mezzanine-UI/mezzanine/commit/5e0ef0f40d5a0a9b5d5f962c5a1df253340d85f3))

### Reverts

- **core/icon:** revert ([87362ac](https://github.com/Mezzanine-UI/mezzanine/commit/87362ac651ffb34244593e687eb9455739d7c69a))
- **core/icon:** revert ([cfc50ed](https://github.com/Mezzanine-UI/mezzanine/commit/cfc50ed461691d594069bfc0a076283e0e877461))
