# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.0.9](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.0.8...@mezzanine-ui/react@0.0.9) (2021-04-01)

### Bug Fixes

- **react/input:** omit text-field onKeyDown types ([0558290](https://github.com/Mezzanine-UI/mezzanine/commit/0558290c176ac41bbef577b1084a195fed5c7077))

### Features

- **icons:** add chevron right and chevron left icon ([e95c847](https://github.com/Mezzanine-UI/mezzanine/commit/e95c8474c15fadb6f461fa0550d538376bed725e))
- **react/drawer:** implement ([193aaa8](https://github.com/Mezzanine-UI/mezzanine/commit/193aaa82a7dc0de3ba8c20f31056a461da77ca77))
- **react/pagination:** implement ([d13820e](https://github.com/Mezzanine-UI/mezzanine/commit/d13820e64e8c3317f695986cbfe1c22b61b4d17c))

## [0.0.8](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.0.7...@mezzanine-ui/react@0.0.8) (2021-04-01)

### Bug Fixes

- **react/menu:** bind keydown event from props on MenuItem instead of empty function ([1d8f76a](https://github.com/Mezzanine-UI/mezzanine/commit/1d8f76a6398a5eb486d83d3cf4cf3149517e9828))

### Features

- **react/select:** bind keyboard events for a11y in <Select> & <Option> / remove overlay ([71629fd](https://github.com/Mezzanine-UI/mezzanine/commit/71629fd1d5922a2e5edcdf9bac19c098fdf9a14a))
- **react/text-field:** extend div element types and allow div element original properties binding ([7d69ee0](https://github.com/Mezzanine-UI/mezzanine/commit/7d69ee0299933ce0975c69ec67d71d7cb05734a6))
- **react/tooltip:** first implement ([bd6cee7](https://github.com/Mezzanine-UI/mezzanine/commit/bd6cee73d8ae718353a7b0cf5d35954c8d1a4179))

## [0.0.7](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.0.6...@mezzanine-ui/react@0.0.7) (2021-03-26)

### Bug Fixes

- **react/modal:** lock body scroll effect when modal is opened ([46cfbc9](https://github.com/Mezzanine-UI/mezzanine/commit/46cfbc90065e6f11d45b24e56578fa6a370b5916))
- **react/overlay:** add fixed position className when container is not given ([2fecad6](https://github.com/Mezzanine-UI/mezzanine/commit/2fecad6015de4203aa2000ada6c669071b5176e2)), closes [#33](https://github.com/Mezzanine-UI/mezzanine/issues/33) [#33](https://github.com/Mezzanine-UI/mezzanine/issues/33)

### Features

- **react/overlay:** implement invisibleBackdrop feature on react overlay ([3c8588e](https://github.com/Mezzanine-UI/mezzanine/commit/3c8588eabe1b4b5e9716c8eb59f063c94b33161d))
- **react/select:** first implementation ([b4ab86a](https://github.com/Mezzanine-UI/mezzanine/commit/b4ab86a521105babea9d265a163f58c10bcd593c))
- **react/textfield:** implement textField clickable feature and add sufficActionIcon prop ([8058c4b](https://github.com/Mezzanine-UI/mezzanine/commit/8058c4b0c26698551f68ce9ee9882fe00e975ff5))
- **react/utils:** add rename multiple types utils for types renaming ([e23b0ad](https://github.com/Mezzanine-UI/mezzanine/commit/e23b0adc676163a0155dafd7a11ae943561e7934))

## [0.0.6](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.0.5...@mezzanine-ui/react@0.0.6) (2021-03-19)

### Features

- **react/checkbox:** implement ([b06009d](https://github.com/Mezzanine-UI/mezzanine/commit/b06009d282fbe2e524a2d0f16eb9c3c39b1e1d62))
- **react/form:** add ControlValue related hooks ([dec8456](https://github.com/Mezzanine-UI/mezzanine/commit/dec84560f329379e7f22198ec0125ecb5165fe79))
- **react/radio:** implement ([5edb74f](https://github.com/Mezzanine-UI/mezzanine/commit/5edb74fc87406a76a4cb157fb88baf1810a37777))

## [0.0.5](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.0.4...@mezzanine-ui/react@0.0.5) (2021-03-15)

### Bug Fixes

- **react/modal:** add role to overlay and modal ([b20d119](https://github.com/Mezzanine-UI/mezzanine/commit/b20d1193235bf04ab8b561b1706f9c1829ad95da))
- **react/modal:** add transition to modal ([495473d](https://github.com/Mezzanine-UI/mezzanine/commit/495473def9f1cbdd9e31cb4f6cca92c8057e7430))

### Code Refactoring

- **react/modal:** add severity to modal ([e7c78d6](https://github.com/Mezzanine-UI/mezzanine/commit/e7c78d68dc8f60245a25eac74aa54eb027b05de0))

### Features

- **react/transition:** implement ([684cb11](https://github.com/Mezzanine-UI/mezzanine/commit/684cb11a2ec3d5e6a1c626541262db97814634fb))

### BREAKING CHANGES

- **react/modal:** use severity instead of danger

## [0.0.4](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.0.3...@mezzanine-ui/react@0.0.4) (2021-03-09)

### Features

- **react/button:** make button generic ([7f16335](https://github.com/Mezzanine-UI/mezzanine/commit/7f16335f1f270fddcb685ba7ec0ac56c31927252))
- **react/typography:** make typography generic ([843ae31](https://github.com/Mezzanine-UI/mezzanine/commit/843ae3192b245b1ac2542f10a3a98bffd8662aa7))

## [0.0.3](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.0.2...@mezzanine-ui/react@0.0.3) (2021-03-09)

### Bug Fixes

- **react/alert:** not depend on Typography ([382815c](https://github.com/Mezzanine-UI/mezzanine/commit/382815cadaeb96670645610c3145876bcbfcf53c))
- **react/empty:** not depend on Typography ([7d64162](https://github.com/Mezzanine-UI/mezzanine/commit/7d64162ba9ddc6a563dbd80c1ca794744b5b72e1))
- **react/modal:** export ModalActions to root ([c9d10f6](https://github.com/Mezzanine-UI/mezzanine/commit/c9d10f633e07b6730c1aa2d0dc5dd8c29baddc78))
- **react/popconfirm:** bind icon class ([eb798a6](https://github.com/Mezzanine-UI/mezzanine/commit/eb798a6637475dec20a31d85d441471983a7ab71))
- **react/popover:** use div to render title and not render content if children not passed ([ce50243](https://github.com/Mezzanine-UI/mezzanine/commit/ce5024324f9c007dca2e02e8cd148bc340eb2563))
- **react/textarea:** not depend on Typography ([70bf083](https://github.com/Mezzanine-UI/mezzanine/commit/70bf083962f57932b6b473784236de2f548cd6d7))

### Features

- **react/utils:** add type utilities for jsx ([6125570](https://github.com/Mezzanine-UI/mezzanine/commit/6125570e670dd37572c8f17adfadf1386e1ad7fe))

## [0.0.2](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.0.1...@mezzanine-ui/react@0.0.2) (2021-03-05)

### Features

- **react/confirm-actions:** implement ([910b9f9](https://github.com/Mezzanine-UI/mezzanine/commit/910b9f9060103518f0e00b34da753812410a8dc3))
- **react/modal:** bind full screen class ([24b8e31](https://github.com/Mezzanine-UI/mezzanine/commit/24b8e316edbc6826b334cd4991a4e8e67c302d4a))
- **react/modal:** implement ([e9d8d81](https://github.com/Mezzanine-UI/mezzanine/commit/e9d8d8160f8432c7fcc638bb183915e7f23c32ac))
- **react/overlay:** implement ([5a737ea](https://github.com/Mezzanine-UI/mezzanine/commit/5a737ea535df1b65a38cd4c409ddea30429c9b06))
- **react/tabs:** implement ([0e33311](https://github.com/Mezzanine-UI/mezzanine/commit/0e333114f564cec9da33af290a521af381f1b035))

## 0.0.1 (2021-02-26)

### Bug Fixes

- **core/empty:** rename fullHeight to full-height ([1de4bf7](https://github.com/Mezzanine-UI/mezzanine/commit/1de4bf709cecf268a8a5defa0413b90895d81695))
- **react:** add missing root export ([9a9e343](https://github.com/Mezzanine-UI/mezzanine/commit/9a9e34358778119ee862b1245ab19bc460efbc11))
- **react:** export components corresponding to form to root index.ts ([df1821f](https://github.com/Mezzanine-UI/mezzanine/commit/df1821ffff1cf1e299adffac14647ee2b2c9e465))
- **react:** re-export all things to root index.ts ([4a1cfd5](https://github.com/Mezzanine-UI/mezzanine/commit/4a1cfd5658e84535c719096d9a2c8e7c2885f044))
- **react:** use namespaced prefix and classes ([125f289](https://github.com/Mezzanine-UI/mezzanine/commit/125f28995db3423c8ab240d658bddacb89ebce97))
- **react/button:** bind --disabled class ([c8f46f4](https://github.com/Mezzanine-UI/mezzanine/commit/c8f46f494f428159a961af08048f07c8bc56cafb))
- **react/button:** can use custom component to render button ([520e9f6](https://github.com/Mezzanine-UI/mezzanine/commit/520e9f61f840a5748e2b4bd59cc2215440b6147b))
- **react/button:** let ButtonGroup accept null,undefined,false as child ([8b1c191](https://github.com/Mezzanine-UI/mezzanine/commit/8b1c19147ff123ac3c9f53b7e607f54a7fe9cc4b))
- **react/button:** should not be fired if loading=true ([f5e37a4](https://github.com/Mezzanine-UI/mezzanine/commit/f5e37a4050741fc47292e61b22476e2ca40fb32e))
- **react/icon:** remove redundant useMemo to toIconCssVars ([d94f7d6](https://github.com/Mezzanine-UI/mezzanine/commit/d94f7d6c1d3b75a767cc305b6ea57b92fb0e5f17))
- **react/tag:** export tag to root index ([c888d47](https://github.com/Mezzanine-UI/mezzanine/commit/c888d47baf97d31153f866aa6e938a7422af8557))
- **react/typography:** remove redundant children and className props ([575a971](https://github.com/Mezzanine-UI/mezzanine/commit/575a9713221510deed43070692abec170a5532b5))
- **react/typography:** remove redundant useMemo to toTypographyCssVars ([b6955c5](https://github.com/Mezzanine-UI/mezzanine/commit/b6955c579745764b9ce7dfde636040f3b52e4de1))

### Features

- **icons:** add 'minus-circle-filled' icon and add it to react/ng icon stories ([e4a96c9](https://github.com/Mezzanine-UI/mezzanine/commit/e4a96c98c38f4bf7fe2272fc6e1358b22113e552))
- **icons:** add "folder-open" icon and add it to react/ng storybook ([b0e8c74](https://github.com/Mezzanine-UI/mezzanine/commit/b0e8c74e0c0253639169f730deffb938789a5cbe))
- **react/alert:** implement ([447f771](https://github.com/Mezzanine-UI/mezzanine/commit/447f771088d82d80cd6d51d8577dc420ee03cdbf))
- **react/badge:** implement ([6ff9131](https://github.com/Mezzanine-UI/mezzanine/commit/6ff91315389686d957974e0f9190ea3f654feb06))
- **react/button:** implement button group ([1b4a693](https://github.com/Mezzanine-UI/mezzanine/commit/1b4a6937c7ee52ed2c8ddce8bcb8b3d35706dc9b))
- **react/button:** implement react component of button ([647db0c](https://github.com/Mezzanine-UI/mezzanine/commit/647db0c052b5bf509f0c7b90f3f020a75e0827cb))
- **react/empty:** implement design ([9d99c1c](https://github.com/Mezzanine-UI/mezzanine/commit/9d99c1c566dd5df3de6d6192755ec255f20646df))
- **react/form:** implement ([3efd25a](https://github.com/Mezzanine-UI/mezzanine/commit/3efd25a684d651aa49838c0f03bfeedfb30d4bff))
- **react/icon:** implement react component of icon ([3f0f700](https://github.com/Mezzanine-UI/mezzanine/commit/3f0f700f30d432aad545cdac3dd57f3bbb871bfa))
- **react/input:** implement ([#5](https://github.com/Mezzanine-UI/mezzanine/issues/5)) ([5e0ef0f](https://github.com/Mezzanine-UI/mezzanine/commit/5e0ef0f40d5a0a9b5d5f962c5a1df253340d85f3))
- **react/menu:** implement ([f808fd0](https://github.com/Mezzanine-UI/mezzanine/commit/f808fd00cf4d5e75ef8f77c924c59109bd5f7e35))
- **react/message:** implement ([f08384e](https://github.com/Mezzanine-UI/mezzanine/commit/f08384ef8a4e12a581939850e0a8e97a6e279508))
- **react/notifier:** implement ([f83a24e](https://github.com/Mezzanine-UI/mezzanine/commit/f83a24e48b218769c680593dfcf60b5d75fc0901))
- **react/popconfirm:** implement ([1c3aae9](https://github.com/Mezzanine-UI/mezzanine/commit/1c3aae9091abb85e1d9315bbf38ed92a829f70b5))
- **react/popover:** implement ([5b43ce9](https://github.com/Mezzanine-UI/mezzanine/commit/5b43ce9f3831b05fcdd89ea5a5a33a5d98f93189))
- **react/popper:** implement ([e8e5815](https://github.com/Mezzanine-UI/mezzanine/commit/e8e58153c4e77aad47b18901a902ed470a689373))
- **react/portal:** implement ([6f00e89](https://github.com/Mezzanine-UI/mezzanine/commit/6f00e89c5398ec6b5e20bf66098f39fe0a3909de))
- **react/switch:** implement ([a2fef2e](https://github.com/Mezzanine-UI/mezzanine/commit/a2fef2eb1e17459bbfded5ef2f25105aeaa447d2))
- **react/tag:** implement ([9b1e2f3](https://github.com/Mezzanine-UI/mezzanine/commit/9b1e2f35e15b835153da7a098d686de94dffa840))
- **react/typography:** implement react component of typography ([c837bc0](https://github.com/Mezzanine-UI/mezzanine/commit/c837bc0ca1949ce3dabf76093a162655599640b9))
- **react/upload:** implement ([30673f1](https://github.com/Mezzanine-UI/mezzanine/commit/30673f1f5a8e87141aad918982b393f44fb3488d))
