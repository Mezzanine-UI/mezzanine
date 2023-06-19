# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.12.9](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.12.8...@mezzanine-ui/react@0.12.9) (2023-06-19)

**Note:** Version bump only for package @mezzanine-ui/react

## [0.12.8](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.12.7...@mezzanine-ui/react@0.12.8) (2023-06-17)

### Bug Fixes

- **react/table:** fix table source changed but not rendered correctly bug, closed [#195](https://github.com/Mezzanine-UI/mezzanine/issues/195) ([ee7abeb](https://github.com/Mezzanine-UI/mezzanine/commit/ee7abebd0af5f46089e59a389d6e6ecd55bf5832))

## [0.12.7](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.12.6...@mezzanine-ui/react@0.12.7) (2023-06-14)

### Bug Fixes

- **react/table:** hide table dropdown action when rowSelection.actions is not given ([51813c6](https://github.com/Mezzanine-UI/mezzanine/commit/51813c6aea79ca8043fbc61e89fd6c3ada319f5e))

## [0.12.6](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.12.5...@mezzanine-ui/react@0.12.6) (2023-06-08)

### Bug Fixes

- **react/modal-actions:** modal-actions loading priority, closed [#190](https://github.com/Mezzanine-UI/mezzanine/issues/190) ([3cfbfe5](https://github.com/Mezzanine-UI/mezzanine/commit/3cfbfe566623622b953076c108172bb13035c3d2))

## [0.12.5](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.12.4...@mezzanine-ui/react@0.12.5) (2023-05-08)

### Features

- **react/upload:** upload picture and upload picture wall allow custom label ([62cb026](https://github.com/Mezzanine-UI/mezzanine/commit/62cb0266e6cda1b2fc4969fd1e629223e4fefa69))

## [0.12.4](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.12.3...@mezzanine-ui/react@0.12.4) (2023-03-10)

**Note:** Version bump only for package @mezzanine-ui/react

## [0.12.3](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.12.2...@mezzanine-ui/react@0.12.3) (2023-03-02)

### Bug Fixes

- **react/form:** useing uppercase or lowercase to search all options of auto complete component ([7858900](https://github.com/Mezzanine-UI/mezzanine/commit/785890078e87518c8c03651c60e89ddf3ed00da4))

## [0.12.2](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.12.1...@mezzanine-ui/react@0.12.2) (2023-02-20)

### Bug Fixes

- **react/utils:** add body scroll lock layout broken workaround, closed [#184](https://github.com/Mezzanine-UI/mezzanine/issues/184) ([5868dbd](https://github.com/Mezzanine-UI/mezzanine/commit/5868dbd513e499f5b97b85f7d11035f4e0f913ef))

### Features

- **react/icon:** add icons ([9294bd9](https://github.com/Mezzanine-UI/mezzanine/commit/9294bd9fca41129e3b1f0e0198cfe4a40a514769))

## [0.12.1](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.12.0...@mezzanine-ui/react@0.12.1) (2023-02-06)

### Bug Fixes

- **react/calendar:** correct year offset of calendar in year mode ([77fbd75](https://github.com/Mezzanine-UI/mezzanine/commit/77fbd75b876c4286c9c4a972c4e55e468c59f094))
- **testing:** correct letter case for case-sensitive system ([f39f08f](https://github.com/Mezzanine-UI/mezzanine/commit/f39f08fbdff8e210a3deac023208ddaaade2a680))

# [0.12.0](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.11.3...@mezzanine-ui/react@0.12.0) (2022-11-16)

### Features

- **react/pagination:** implement pagination page size selections feature ([669455f](https://github.com/Mezzanine-UI/mezzanine/commit/669455f72033f67df19958ff2d7531b1a196f312))
- **react/table:** implement all Pagination props under Table.pagination.options ([b9ea2f2](https://github.com/Mezzanine-UI/mezzanine/commit/b9ea2f2a27717690493e30ddeb0085087f6cae08))
- **react/table:** table expandableRender allow render custom component / render api changed ([c6e54a4](https://github.com/Mezzanine-UI/mezzanine/commit/c6e54a4041358f92f6ceb55d9df884a4a508d1c0))

### BREAKING CHANGES

- **react/table:** TableColumn.render((rowData, index, column) => /_ return_/);

## [0.11.3](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.11.2...@mezzanine-ui/react@0.11.3) (2022-11-08)

### Bug Fixes

- **react/select:** stop propagation when select trigger clicked ([509b71c](https://github.com/Mezzanine-UI/mezzanine/commit/509b71c65a115e091b8a3fd0b7ecb9f1fc595cdc))
- **react/text-field:** stop propagation when TextField clicked ([c59898e](https://github.com/Mezzanine-UI/mezzanine/commit/c59898eb341e4b431f11dfd40eec8f34d3f4a16f))

### Features

- **react/navigation:** add `defaultOpen` for NavigationSubMenu component ([3c2c478](https://github.com/Mezzanine-UI/mezzanine/commit/3c2c478c96c848cb6afeca000fea5435fdbe7ed8)), closes [#182](https://github.com/Mezzanine-UI/mezzanine/issues/182) [#182](https://github.com/Mezzanine-UI/mezzanine/issues/182)
- **react/upload-picture-wall:** add `fileHost` for UploadPictureWall to render correct file url ([c322a1e](https://github.com/Mezzanine-UI/mezzanine/commit/c322a1e4d42d5c5994516b9888034dcf048cdd9b)), closes [#173](https://github.com/Mezzanine-UI/mezzanine/issues/173) [#173](https://github.com/Mezzanine-UI/mezzanine/issues/173)

## [0.11.2](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.11.1...@mezzanine-ui/react@0.11.2) (2022-09-28)

**Note:** Version bump only for package @mezzanine-ui/react

## [0.11.1](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.11.0...@mezzanine-ui/react@0.11.1) (2022-08-03)

### Bug Fixes

- **react/navigation:** allow null/fragment rendering ([64d6fad](https://github.com/Mezzanine-UI/mezzanine/commit/64d6fade20e048eadb803fdfe2b577a0e6bd65b1)), closes [#179](https://github.com/Mezzanine-UI/mezzanine/issues/179) [#179](https://github.com/Mezzanine-UI/mezzanine/issues/179)

# [0.11.0](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.10.5...@mezzanine-ui/react@0.11.0) (2022-06-28)

### Bug Fixes

- **react/accordion:** fix type of prefixIcon props ([c8ef470](https://github.com/Mezzanine-UI/mezzanine/commit/c8ef47013f07ec062e529957d1946436e8dc3e6c))
- **react/appbar:** fix typing ([96c360b](https://github.com/Mezzanine-UI/mezzanine/commit/96c360bf6bc311b14c110fa5a74dbbb0e2b29170))
- **react/date_picker:** fix testing code after react 18 ([78ea6b6](https://github.com/Mezzanine-UI/mezzanine/commit/78ea6b607d8d36c1178d01c7cd4e9c75cd3bc069))
- **react/date_range_picker:** fix testing code after react 18 ([69490af](https://github.com/Mezzanine-UI/mezzanine/commit/69490af6cc691735aacb15a8f831f1f2e9dae45b))
- **react/date_time_picker:** fix testing code after react 18 ([fb5cade](https://github.com/Mezzanine-UI/mezzanine/commit/fb5cadecc18d828f1fabef09b41c528c4ccd45ad))
- **react/notification:** fix testing code after react 18 ([4f0f802](https://github.com/Mezzanine-UI/mezzanine/commit/4f0f802628fd3daf90c232873d9403b4055ff040))
- **react/notifier:** fix root api of destory api ([7d4808c](https://github.com/Mezzanine-UI/mezzanine/commit/7d4808cd3583b244c524fc844554a2cd1bc8cd83))
- **react/select:** fix testing code after react 18 ([fa5a161](https://github.com/Mezzanine-UI/mezzanine/commit/fa5a161d965216e0282e77f7e12f0bd9a4bd26ce))
- **react/table:** fix types ([09d1918](https://github.com/Mezzanine-UI/mezzanine/commit/09d1918a2e7c3baac85934efb43dc8d4d859a674))
- **react/table:** give type to onScrollBarMouseDown ([3955ddf](https://github.com/Mezzanine-UI/mezzanine/commit/3955ddf9adc1873f85d1d9e53d5fb32f85eb6e11))
- **react/time_picker:** fix testing code after react 18 ([ee31355](https://github.com/Mezzanine-UI/mezzanine/commit/ee3135517bb168b59c25da7ad621dba0ad9d69b7))
- **react/tooltip:** fix types ([c2e9447](https://github.com/Mezzanine-UI/mezzanine/commit/c2e94474c8b1903db4c30c2298d85c5548f31333))
- **react/transition:** correct coding of defining types ([779dac3](https://github.com/Mezzanine-UI/mezzanine/commit/779dac3b56b7213691ee6bcfa3edea859ec0efaa))
- **react/upload:** give type on upload function ([ea88efb](https://github.com/Mezzanine-UI/mezzanine/commit/ea88efb0a5598e04d4e09ce382e4ae3d21f6e898))

## [0.10.5](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.10.4...@mezzanine-ui/react@0.10.5) (2022-06-28)

### Bug Fixes

- **react/notification:** correct severity icon typing ([6fb0cff](https://github.com/Mezzanine-UI/mezzanine/commit/6fb0cffe98d69bfe6a58c832e233ebb4d9ecfffe))
- **react/select:** add missing `disablePortal` property for `<Select />` props ([3d17074](https://github.com/Mezzanine-UI/mezzanine/commit/3d17074d32ed8dd9f61c04b95b5a884dcf2c0a78))

## [0.10.4](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.10.3...@mezzanine-ui/react@0.10.4) (2022-05-10)

### Bug Fixes

- add @types/react @types/react-dom resolution to prevent use react 18 typings ([2ece1a6](https://github.com/Mezzanine-UI/mezzanine/commit/2ece1a69cf9b7f72f4c47b2d07ddc8c58542a723))
- add lodash deps ([ef5250d](https://github.com/Mezzanine-UI/mezzanine/commit/ef5250dbac176604e3e182020be15e21ef256be1)), closes [#174](https://github.com/Mezzanine-UI/mezzanine/issues/174) [#174](https://github.com/Mezzanine-UI/mezzanine/issues/174)
- **react/notifier:** ssr support ([f4d496c](https://github.com/Mezzanine-UI/mezzanine/commit/f4d496ca1c2a7e9746598721b9d33ca26f4d38e6))

## [0.10.3](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.10.2...@mezzanine-ui/react@0.10.3) (2022-05-03)

### Features

- **react/upload:** upload picture wall add `prop.maxLength` to limit maximum file length ([dbe6594](https://github.com/Mezzanine-UI/mezzanine/commit/dbe6594f16be91c1172e0db17e888d2b6a535566)), closes [#172](https://github.com/Mezzanine-UI/mezzanine/issues/172) [#172](https://github.com/Mezzanine-UI/mezzanine/issues/172)

## [0.10.2](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.10.1...@mezzanine-ui/react@0.10.2) (2022-04-01)

### Bug Fixes

- **react/dropdown:** fix dropdown children ref type ([ad8948d](https://github.com/Mezzanine-UI/mezzanine/commit/ad8948dc2cc68ba99de47ca82dc8bdcfc9622c0f))
- **react/modal:** context value should wrap in useMemo ([7582d1b](https://github.com/Mezzanine-UI/mezzanine/commit/7582d1bdb964528180b86f8ca98c189ade0df613))

### Features

- **react/button:** apply global config context on Button/ButtonGroup ([924ca1f](https://github.com/Mezzanine-UI/mezzanine/commit/924ca1f722494cac0e66d1256ff8f51315c44a0d)), closes [#166](https://github.com/Mezzanine-UI/mezzanine/issues/166) [#166](https://github.com/Mezzanine-UI/mezzanine/issues/166)
- **react/checkbox:** apply global config context on Checkbox ([4b5bf90](https://github.com/Mezzanine-UI/mezzanine/commit/4b5bf904e936745fa1de1db6fd0e0d1cc88ea90a)), closes [#166](https://github.com/Mezzanine-UI/mezzanine/issues/166) [#166](https://github.com/Mezzanine-UI/mezzanine/issues/166)
- **react/icon:** improve icon accessibility by adding title element ([f1d612c](https://github.com/Mezzanine-UI/mezzanine/commit/f1d612c08165ab5c020271b94570d644ae8599ae)), closes [#167](https://github.com/Mezzanine-UI/mezzanine/issues/167) [#167](https://github.com/Mezzanine-UI/mezzanine/issues/167)
- **react/input:** apply global config context on Input ([9455710](https://github.com/Mezzanine-UI/mezzanine/commit/94557101dec30539d2f39f8ed467fffd8877a7ec)), closes [#166](https://github.com/Mezzanine-UI/mezzanine/issues/166) [#166](https://github.com/Mezzanine-UI/mezzanine/issues/166)
- **react/menu:** apply global config context on Menu ([461ab68](https://github.com/Mezzanine-UI/mezzanine/commit/461ab684a800fe8882be6c6609a5557ab31bd0ca)), closes [#166](https://github.com/Mezzanine-UI/mezzanine/issues/166) [#166](https://github.com/Mezzanine-UI/mezzanine/issues/166)
- **react/progress:** apply global config context on Progress ([b0982a8](https://github.com/Mezzanine-UI/mezzanine/commit/b0982a81dc00368b4875cd15ad84994d22b88261)), closes [#166](https://github.com/Mezzanine-UI/mezzanine/issues/166) [#166](https://github.com/Mezzanine-UI/mezzanine/issues/166)
- **react/provider:** implement mezzanine config provider to facilitate the modifications ([c89769b](https://github.com/Mezzanine-UI/mezzanine/commit/c89769b7731f2c068de17fda853fff163e7cb7ec)), closes [#166](https://github.com/Mezzanine-UI/mezzanine/issues/166) [#166](https://github.com/Mezzanine-UI/mezzanine/issues/166)
- **react/radio:** apply global config context on Radio/RadioGroup ([48b1d3f](https://github.com/Mezzanine-UI/mezzanine/commit/48b1d3f81728bdff2b2fab06ad72a89cf076d0d8)), closes [#166](https://github.com/Mezzanine-UI/mezzanine/issues/166) [#166](https://github.com/Mezzanine-UI/mezzanine/issues/166)
- **react/select:** apply global config context on Select/TreeSelect/Autocomplete & correct size map ([aa839bf](https://github.com/Mezzanine-UI/mezzanine/commit/aa839bf271b2920f082570cf5fea8ecf5f4d28f5)), closes [#166](https://github.com/Mezzanine-UI/mezzanine/issues/166) [#166](https://github.com/Mezzanine-UI/mezzanine/issues/166)
- **react/tag:** apply global config context on Tag ([89da8ac](https://github.com/Mezzanine-UI/mezzanine/commit/89da8ac01f250676d0aea9ce4a21144266cea412)), closes [#166](https://github.com/Mezzanine-UI/mezzanine/issues/166) [#166](https://github.com/Mezzanine-UI/mezzanine/issues/166)
- **react/text-field:** apply global config context on TextField ([d9dcf7f](https://github.com/Mezzanine-UI/mezzanine/commit/d9dcf7ff6efd86105d8fd4f18759670e80491ea4)), closes [#166](https://github.com/Mezzanine-UI/mezzanine/issues/166) [#166](https://github.com/Mezzanine-UI/mezzanine/issues/166)
- **react/textarea:** apply global config context on Textarea ([bb21bff](https://github.com/Mezzanine-UI/mezzanine/commit/bb21bff9191ea80863db21a30d790b9a603be0cd)), closes [#166](https://github.com/Mezzanine-UI/mezzanine/issues/166) [#166](https://github.com/Mezzanine-UI/mezzanine/issues/166)
- **react/tree:** apply global config context on TreeNode ([3d4750f](https://github.com/Mezzanine-UI/mezzanine/commit/3d4750f016257cb6a7e2446942c09e6d7ea1342d)), closes [#166](https://github.com/Mezzanine-UI/mezzanine/issues/166) [#166](https://github.com/Mezzanine-UI/mezzanine/issues/166)
- **react/upload:** apply global config context on UploadResult ([dce22a7](https://github.com/Mezzanine-UI/mezzanine/commit/dce22a74f02fecae70cd986daf96f04c19c1505e)), closes [#166](https://github.com/Mezzanine-UI/mezzanine/issues/166) [#166](https://github.com/Mezzanine-UI/mezzanine/issues/166)

## [0.10.1](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.10.0...@mezzanine-ui/react@0.10.1) (2022-03-23)

### Bug Fixes

- **react/input:** remove sufficActionIcon typing from props (unused) ([d21a3f7](https://github.com/Mezzanine-UI/mezzanine/commit/d21a3f78e1feb9e2c7054ab4aa25f7a1cb43fbd4))
- **react/picker:** picker should not clearable when readonly is enabled ([ca4ec61](https://github.com/Mezzanine-UI/mezzanine/commit/ca4ec61279297fb5666c03d8f16a3364e1fa7ebe)), closes [#146](https://github.com/Mezzanine-UI/mezzanine/issues/146) [#146](https://github.com/Mezzanine-UI/mezzanine/issues/146)
- **react/select:** correct value of autocomplete attributes in AutoComplete ([6425b84](https://github.com/Mezzanine-UI/mezzanine/commit/6425b84420285267fe192d33de6573571b3c4c28))
- **react/textarea:** correct textarea typings ([1ab5a0a](https://github.com/Mezzanine-UI/mezzanine/commit/1ab5a0ab2a99d09d9ab7f80a2da5e654014d43e7)), closes [#152](https://github.com/Mezzanine-UI/mezzanine/issues/152) [#152](https://github.com/Mezzanine-UI/mezzanine/issues/152)

# [0.10.0](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.9.2...@mezzanine-ui/react@0.10.0) (2022-03-15)

### Bug Fixes

- **core/calendar:** change base date type to string ([43fe1dd](https://github.com/Mezzanine-UI/mezzanine/commit/43fe1dd3641b124d835bcb96489990a60448130d))
- **react/calendar:** change base date type to string ([e6fb50d](https://github.com/Mezzanine-UI/mezzanine/commit/e6fb50d2600ff2a70221cd3cdf04c2f177e532d8))
- **react/calendar:** memorize context value and correct coding style ([a2c0cdf](https://github.com/Mezzanine-UI/mezzanine/commit/a2c0cdf6bc64dd8ff7ed41cbdc13f4e3a131a1bb))

### Features

- **react/DatePicker:** add dayjs method stories ([8c7cf8b](https://github.com/Mezzanine-UI/mezzanine/commit/8c7cf8b8e01189846ba9c4d06514039789f2c2bb))
- **react/select:** refactor AutoComplete component, and create multiple mode ([18569c1](https://github.com/Mezzanine-UI/mezzanine/commit/18569c1cf4b6565298cfa1352bb8632d76178eae))
- **react/select:** remove onSearch props from Select component ([bc259e5](https://github.com/Mezzanine-UI/mezzanine/commit/bc259e573d467e48100530f8e05c65b6bb50725e))

## [0.9.2](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.9.1...@mezzanine-ui/react@0.9.2) (2022-03-04)

### Features

- **icons:** add arrow-up and arrow-down icons ([5f554c2](https://github.com/Mezzanine-UI/mezzanine/commit/5f554c2f54c421f3b28587f276bdda23431931c1))
- **react/table:** can give className props of row in expanded table ([7995e5a](https://github.com/Mezzanine-UI/mezzanine/commit/7995e5a96cd83c0adc1934041d71592c6b12a7c7))

## [0.9.1](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.9.0...@mezzanine-ui/react@0.9.1) (2022-03-03)

### Bug Fixes

- **react/table:** index args in render function of columns is row index not column index ([221fb01](https://github.com/Mezzanine-UI/mezzanine/commit/221fb0138d5a3b6601f63b47652cb0f0fd3e5d55))

# [0.9.0](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.8.1...@mezzanine-ui/react@0.9.0) (2022-02-15)

### Bug Fixes

- **react/date-picker:** remove unused props of date-picker stories ([e1de4ab](https://github.com/Mezzanine-UI/mezzanine/commit/e1de4abb64b6430408c98fae984d27342f7e72c7))
- **react/date-picker:** remove unused props of date-time-picker stories ([46fb58a](https://github.com/Mezzanine-UI/mezzanine/commit/46fb58a420211b6b49ff1d6406ab6a76d3782b96))
- **react/tabs:** avoid unnecessary re-render when window resize ([56b89e0](https://github.com/Mezzanine-UI/mezzanine/commit/56b89e01909262b6eff785d670123276c4c79e62))

### Features

- **react/date-picker:** adjust mode relative props in playground of date-range-picker stories ([e8ba872](https://github.com/Mezzanine-UI/mezzanine/commit/e8ba8724d78f9371346e8ce771596c7a8562703f))
- **react/date-picker:** default enable the clearable prop ([e40463e](https://github.com/Mezzanine-UI/mezzanine/commit/e40463e6b41b0bc27f2840f19d3aaf009fe446a5))
- **react/loading:** adjust on-modal, playground examples ([8c74893](https://github.com/Mezzanine-UI/mezzanine/commit/8c74893a25a95e8ae481b42c2f6260b5b5eb9450))
- **react/pop-confirm:** add controls on stories playground ([6e9f1c7](https://github.com/Mezzanine-UI/mezzanine/commit/6e9f1c720980d03ee8e3acf9b70d84dea96a2a8b))
- **react/radio:** complete playground of radio stories ([866f4e8](https://github.com/Mezzanine-UI/mezzanine/commit/866f4e80b1388078955cc8d978c0e14af33fe31d))
- **react/text-area:** add playground of text-area ([cedfe35](https://github.com/Mezzanine-UI/mezzanine/commit/cedfe35fb9eb3cdebccedaa859cc77bad7c710e4))

## [0.8.1](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.8.0...@mezzanine-ui/react@0.8.1) (2022-02-08)

### Features

- **react/button:** add playground arguments of button ([2225ee1](https://github.com/Mezzanine-UI/mezzanine/commit/2225ee15ef2df4dcf70c45a498d4094b0c3d5ec7))
- **react/icon:** set pointer cursor if onClick or onMouseMove is defined ([d2f83e7](https://github.com/Mezzanine-UI/mezzanine/commit/d2f83e77476d68e05e353d00985aaab2c752a735))
- **react/input:** add tags mode extension on input component ([0ae9643](https://github.com/Mezzanine-UI/mezzanine/commit/0ae964370b2c06d8fd9ca9bb77d3db4f86778ca8))

# [0.8.0](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.7.4...@mezzanine-ui/react@0.8.0) (2022-01-18)

### Bug Fixes

- **react/autocomplete:** fix autocomplete control mode value not sync correctly bug / fullWidth bug ([3cc6d57](https://github.com/Mezzanine-UI/mezzanine/commit/3cc6d57edc7223fbef8e7c530fe51d652fdf9283))

### Features

- **react/select:** change type of value from Array to Object when mode is single ([72d6a9c](https://github.com/Mezzanine-UI/mezzanine/commit/72d6a9c62117e3e228c6865b3dba316e2303bf89)), closes [#93](https://github.com/Mezzanine-UI/mezzanine/issues/93)

### BREAKING CHANGES

- **react/select:** type change

## [0.7.4](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.7.3...@mezzanine-ui/react@0.7.4) (2022-01-10)

### Bug Fixes

- **react/index:** fix stepper export wrong component bug ([564803b](https://github.com/Mezzanine-UI/mezzanine/commit/564803b03ed35be6a4aa22d137b22ef1c8f60c0b))

## [0.7.3](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.7.2...@mezzanine-ui/react@0.7.3) (2022-01-05)

### Bug Fixes

- **react/upload:** fix input issue of uploading same file ([7eef66f](https://github.com/Mezzanine-UI/mezzanine/commit/7eef66fdb80eca5dc840c608dc4b728b67331bc4))

### Features

- **icons:** add trash icon ([232815b](https://github.com/Mezzanine-UI/mezzanine/commit/232815b58cc68f19150c678937818fb85b340867))
- **react/upload:** create UploadPicture and UploadPictureWall components ([4207a61](https://github.com/Mezzanine-UI/mezzanine/commit/4207a613a1ad573e04380bb826adcb9bd7dce435))

## [0.7.2](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.7.1...@mezzanine-ui/react@0.7.2) (2021-12-23)

### Bug Fixes

- **react/transition:** children type should be required ([ea77d07](https://github.com/Mezzanine-UI/mezzanine/commit/ea77d07278d603b5d3fafea5d1a8942ea4e86644))

### Features

- **react/\_internal:** implement SlideFadeOverlay to unify Drawer/Modal api ([146fbff](https://github.com/Mezzanine-UI/mezzanine/commit/146fbff9e89b841aae89d21e05f9617508fb9712))
- **react/icon:** implement size props on Icon component ([a7a1bb3](https://github.com/Mezzanine-UI/mezzanine/commit/a7a1bb343b78da764952426767a3e69969b0af55)), closes [#91](https://github.com/Mezzanine-UI/mezzanine/issues/91) [#91](https://github.com/Mezzanine-UI/mezzanine/issues/91)
- **react/modal:** export useModalContainer to allow using `<SlideFadeOverlay />` with default opts ([dca8244](https://github.com/Mezzanine-UI/mezzanine/commit/dca82441bbc185cc6ed8c84407ed07b77b045e49))

## [0.7.1](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.7.0...@mezzanine-ui/react@0.7.1) (2021-12-03)

### Bug Fixes

- **react/slider:** fix slider behavior ([89c8a8f](https://github.com/Mezzanine-UI/mezzanine/commit/89c8a8f5d19d82e054979a1802db30ae840db02e)), closes [#104](https://github.com/Mezzanine-UI/mezzanine/issues/104) [#105](https://github.com/Mezzanine-UI/mezzanine/issues/105) [#106](https://github.com/Mezzanine-UI/mezzanine/issues/106)

# [0.7.0](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.6.4...@mezzanine-ui/react@0.7.0) (2021-10-20)

**Note:** Version bump only for package @mezzanine-ui/react

## [0.6.4](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.6.3...@mezzanine-ui/react@0.6.4) (2021-09-28)

### Bug Fixes

- **react/select:** fix selector value not sync from props issue ([143a43d](https://github.com/Mezzanine-UI/mezzanine/commit/143a43d7f43126716e9b27a3847e5beb4ee86cf5))

## [0.6.3](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.6.2...@mezzanine-ui/react@0.6.3) (2021-08-24)

### Bug Fixes

- **deps:** correct react-transition-group import pathname for case-sensitive system ([f79821b](https://github.com/Mezzanine-UI/mezzanine/commit/f79821bd78181a6965e5fc60c4cf7607253f68df))

## [0.6.2](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.6.1...@mezzanine-ui/react@0.6.2) (2021-08-10)

### Bug Fixes

- **react/calendar:** change html structure due to calendar styles implementation has been changed ([17d379f](https://github.com/Mezzanine-UI/mezzanine/commit/17d379fb68a8e28b9e0e9aed766b3cb4d7aa1140)), closes [#94](https://github.com/Mezzanine-UI/mezzanine/issues/94)

## [0.6.1](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.6.0...@mezzanine-ui/react@0.6.1) (2021-07-16)

### Bug Fixes

- **react/time-picker:** popperProps should pass down to TimePickerPanel (currently missing) ([a5e650e](https://github.com/Mezzanine-UI/mezzanine/commit/a5e650e2cd5cf55ac92568e95973ec2a68d49dc8))

# [0.6.0](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.5.4...@mezzanine-ui/react@0.6.0) (2021-07-09)

**Note:** Version bump only for package @mezzanine-ui/react

## [0.5.4](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.5.3...@mezzanine-ui/react@0.5.4) (2021-07-08)

### Bug Fixes

- **react/drawer:** implement missing <Overlay> props.invisibleBackdrop on <Drawer> ([4dcda7e](https://github.com/Mezzanine-UI/mezzanine/commit/4dcda7e0b61282542e7bb76632c8e1489957a766))
- **react/switch:** export missing SwitchProps typing ([0a7e78a](https://github.com/Mezzanine-UI/mezzanine/commit/0a7e78af4f3b6077c5e995ec7ea645c93be9bdc3))

### Features

- **react/table:** allow customizing bodyRowClassName and Empty component props bypass ([58ecaa5](https://github.com/Mezzanine-UI/mezzanine/commit/58ecaa5ce7095c75aa4443bfc7a66dbefcf7f24c))

## [0.5.3](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.5.2...@mezzanine-ui/react@0.5.3) (2021-07-05)

### Bug Fixes

- **react/button:** export ButtonBaseProps type from index and rewrite disabled type ([8edf21d](https://github.com/Mezzanine-UI/mezzanine/commit/8edf21dc854d110593d2688475b7a3708d96b34c))
- **react/select:** implement full width className on Select host element when props.fullWidth=true ([9701c3c](https://github.com/Mezzanine-UI/mezzanine/commit/9701c3cf0906a6e97f4ae28da73ccf517f91ffc9)), closes [#86](https://github.com/Mezzanine-UI/mezzanine/issues/86) [#86](https://github.com/Mezzanine-UI/mezzanine/issues/86)

## [0.5.2](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.5.1...@mezzanine-ui/react@0.5.2) (2021-06-17)

### Bug Fixes

- **react/table:** fix sorting equality function to do deep comparison if shallow compare return true ([d088758](https://github.com/Mezzanine-UI/mezzanine/commit/d08875842181d9fc55805dd17134805a7eb30596)), closes [#85](https://github.com/Mezzanine-UI/mezzanine/issues/85) [#85](https://github.com/Mezzanine-UI/mezzanine/issues/85)

### Features

- **react/skeleton:** implement ([f0a92fd](https://github.com/Mezzanine-UI/mezzanine/commit/f0a92fdf695be1c80881bc6c87e3da7c98601301))

## [0.5.1](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.5.0...@mezzanine-ui/react@0.5.1) (2021-06-11)

### Bug Fixes

- **react/select-trigger:** export inputProps type as independent type def to fix undefined type bugs ([ff67c5e](https://github.com/Mezzanine-UI/mezzanine/commit/ff67c5e7eb894b0599512a5035748c3c8e9e53f5))

### Features

- **react/autocomplete:** first implement ([09f9b35](https://github.com/Mezzanine-UI/mezzanine/commit/09f9b356ba9ff6702bf2ad884d9eb93a290d9f6c))
- **react/form:** add focus event handler type ([dec39d3](https://github.com/Mezzanine-UI/mezzanine/commit/dec39d35f8dd5d0ac18f96ee3b7e21abbe733f20))
- **react/hooks:** implement useWindowWidth ([d0dcf6a](https://github.com/Mezzanine-UI/mezzanine/commit/d0dcf6a2ea4a569707a4f0ce45c1f1569f301df8))
- **react/select:** add onFocus and onBlur handler ([0013224](https://github.com/Mezzanine-UI/mezzanine/commit/00132246ace65f96bac4f6c8fd209e59aeebc481)), closes [#63](https://github.com/Mezzanine-UI/mezzanine/issues/63)
- **react/tabs:** implement overflow and actions ([b700b8e](https://github.com/Mezzanine-UI/mezzanine/commit/b700b8eca3665ac410e685277ce7180d44c9291e))

# [0.5.0](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.3.3...@mezzanine-ui/react@0.5.0) (2021-06-10)

### Bug Fixes

- **react/hooks/use-click-away:** remove preventDefault method ([123ca74](https://github.com/Mezzanine-UI/mezzanine/commit/123ca744f25c5e019843e09d52d486728867ef43))
- **react/notifier:** add missing element key inside array map ([eeba2eb](https://github.com/Mezzanine-UI/mezzanine/commit/eeba2ebcdd1a57f2c96c70fe02c6f2bcaac13d6f))
- **react/text-field:** make suffix-action-icon classname extensible ([f5fb21a](https://github.com/Mezzanine-UI/mezzanine/commit/f5fb21a8f2c914a4e0c242b1209f0bdb70443378))

### Features

- **react/input-trigger-popper:** implement common input trigger popper ([0cb47ef](https://github.com/Mezzanine-UI/mezzanine/commit/0cb47ef5904fcf437505237fb297ff50eabe17fc))
- **react/popper:** have access to usePopper hook results ([77f4ec4](https://github.com/Mezzanine-UI/mezzanine/commit/77f4ec4cb61bb24a7bbe0e28b6b807f1eafcbae4))
- **react/progress:** implement ([4e5c114](https://github.com/Mezzanine-UI/mezzanine/commit/4e5c1147da3e66539070de78b33c95e8b3792b36))
- **react/select:** implement tree-select ([eb31647](https://github.com/Mezzanine-UI/mezzanine/commit/eb31647ccf936ec68b4084d4acbe00ccd5d75496))
- **react/slider:** implement ([5ebad9f](https://github.com/Mezzanine-UI/mezzanine/commit/5ebad9fa7649c1afcf26d486041adcc1aa64abf0))
- **react/table:** implement renderTooltipTitle/forceShownTooltipWhenHovered props ([d0ea36f](https://github.com/Mezzanine-UI/mezzanine/commit/d0ea36f32065d84715f35b2b0978551e2ee2af07)), closes [#78](https://github.com/Mezzanine-UI/mezzanine/issues/78) [#78](https://github.com/Mezzanine-UI/mezzanine/issues/78)
- **react/tree:** enabled controlled expanded values ([650a340](https://github.com/Mezzanine-UI/mezzanine/commit/650a34079600bd67d239f56b229563c5719dc386))

# [0.4.0](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.3.3...@mezzanine-ui/react@0.4.0) (2021-06-04)

### Bug Fixes

- **react/hooks/use-click-away:** remove preventDefault method ([123ca74](https://github.com/Mezzanine-UI/mezzanine/commit/123ca744f25c5e019843e09d52d486728867ef43))
- **react/text-field:** make suffix-action-icon classname extensible ([f5fb21a](https://github.com/Mezzanine-UI/mezzanine/commit/f5fb21a8f2c914a4e0c242b1209f0bdb70443378))

### Features

- **react/input-trigger-popper:** implement common input trigger popper ([0cb47ef](https://github.com/Mezzanine-UI/mezzanine/commit/0cb47ef5904fcf437505237fb297ff50eabe17fc))
- **react/popper:** have access to usePopper hook results ([77f4ec4](https://github.com/Mezzanine-UI/mezzanine/commit/77f4ec4cb61bb24a7bbe0e28b6b807f1eafcbae4))
- **react/select:** implement tree-select ([eb31647](https://github.com/Mezzanine-UI/mezzanine/commit/eb31647ccf936ec68b4084d4acbe00ccd5d75496))
- **react/tree:** enabled controlled expanded values ([650a340](https://github.com/Mezzanine-UI/mezzanine/commit/650a34079600bd67d239f56b229563c5719dc386))

## [0.3.3](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.3.2...@mezzanine-ui/react@0.3.3) (2021-06-03)

### Features

- **react/icon:** add percent icon in storybook ([a2bdd37](https://github.com/Mezzanine-UI/mezzanine/commit/a2bdd379da97594eb0702946dcb55b8922e07c84))
- **react/stepper:** implement ([a22e7e8](https://github.com/Mezzanine-UI/mezzanine/commit/a22e7e87c93eae299305b51d764b7e5e3872ead1))

## [0.3.2](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.3.1...@mezzanine-ui/react@0.3.2) (2021-05-26)

### Bug Fixes

- **react/table:** fix table can't scroll bug when sources are async injected ([18dab68](https://github.com/Mezzanine-UI/mezzanine/commit/18dab687b441961f93e9258c1bfec1045bfaba79)), closes [#74](https://github.com/Mezzanine-UI/mezzanine/issues/74) [#74](https://github.com/Mezzanine-UI/mezzanine/issues/74)
- **react/transition/collapse:** remove height description in getStyle method ([d62c6bb](https://github.com/Mezzanine-UI/mezzanine/commit/d62c6bb9ea832d05ab065210d3d2d94360b9ff47))

### Features

- **icons:** add caret-right icon ([800369e](https://github.com/Mezzanine-UI/mezzanine/commit/800369e11fc89a0b2051c7fd345b4735963dd216))
- **react/tree:** implement ([93b5677](https://github.com/Mezzanine-UI/mezzanine/commit/93b5677b6c33cd9f1e9666dbb4789ae3ae618087))

## [0.3.1](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.3.0...@mezzanine-ui/react@0.3.1) (2021-05-21)

### Features

- **react/card:** implement ([c6e5637](https://github.com/Mezzanine-UI/mezzanine/commit/c6e5637fd030db175e65f06d8f138bde9d685afe))

# [0.3.0](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.2.1...@mezzanine-ui/react@0.3.0) (2021-05-12)

### Bug Fixes

- **react/page-footer:** pass miss props ([8287b88](https://github.com/Mezzanine-UI/mezzanine/commit/8287b88b9a1dbf41f3215e91aff9bc73d62d1c1c))

### Features

- **icons:** add clock icon ([d8ff505](https://github.com/Mezzanine-UI/mezzanine/commit/d8ff505e46fbf84fbdf4a3a24f850e824142d7f1))
- **react/calendar:** add tests ([0b04633](https://github.com/Mezzanine-UI/mezzanine/commit/0b046339dbe244e042ead6abc71ed36d9a9126b2))
- **react/date-picker:** add tests ([a531fcc](https://github.com/Mezzanine-UI/mezzanine/commit/a531fccae0fdfd7a8675f7d5997347b6d24f2e85))
- **react/date-range-picker:** add tests ([e9403f1](https://github.com/Mezzanine-UI/mezzanine/commit/e9403f16b79a3feaef1edc26d2b423ec482178d0))
- **react/date-time-picker:** implement ([5cf32fa](https://github.com/Mezzanine-UI/mezzanine/commit/5cf32fa1aad50e2284852800243f6a187c7e5270))
- **react/notification:** implement ([c463281](https://github.com/Mezzanine-UI/mezzanine/commit/c46328170fc204207c82c2c98dc1cf147f19a932))
- **react/picker:** implement pickers common UI components and hooks ([5bfb9f3](https://github.com/Mezzanine-UI/mezzanine/commit/5bfb9f3e8979b3de0bae41048b0cccd9b842afcb))
- **react/time-panel:** implement ([6f51e8a](https://github.com/Mezzanine-UI/mezzanine/commit/6f51e8a3a55883a640be5017e4bc98e966e3f049))
- **react/time-picker:** implement ([e1ca0ec](https://github.com/Mezzanine-UI/mezzanine/commit/e1ca0ec8fec6a6308c8ed8be19be50ebcaa54645))

## [0.2.1](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.2.0...@mezzanine-ui/react@0.2.1) (2021-05-07)

### Features

- **react/table:** implement table editable feature ([f05ada8](https://github.com/Mezzanine-UI/mezzanine/commit/f05ada857951b021d1e589f183ced355991557d8))

# [0.2.0](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.1.5...@mezzanine-ui/react@0.2.0) (2021-05-04)

### Bug Fixes

- **react/overlay:** implement disable pointer-events when overlay closed on react <Overlay> ([9e2c4f2](https://github.com/Mezzanine-UI/mezzanine/commit/9e2c4f2857f8a1417db42a67b32b42397e7de5e5))

### Features

- **react/table:** first implement ([a4af479](https://github.com/Mezzanine-UI/mezzanine/commit/a4af479e32f32d0809879c20ccda208b1d20682d))

## [0.1.5](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.1.3...@mezzanine-ui/react@0.1.5) (2021-04-28)

### Bug Fixes

- **react/navigation:** fix navigation submenu active status ([6c0b967](https://github.com/Mezzanine-UI/mezzanine/commit/6c0b967e837018f82fcd7711e1a5abe09d50b4c2))

### Features

- **react/page-footer:** implement ([fef2421](https://github.com/Mezzanine-UI/mezzanine/commit/fef2421c5300e618b89be62b8ad2199f0c18ffe7))

## [0.1.4](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.1.3...@mezzanine-ui/react@0.1.4) (2021-04-26)

### Code Refactoring

- **react/input:** input props are passing via `inputProps` except value and onChange
- **react/textarea:** input props are passing via `inputProps` except value and onChange
- **react/radio:** input props are passing via `inputProps` except value and onChange
- **react/checkbox:** input props are passing via `inputProps` except value and onChange
- **react/select:** input props are passing via `inputProps` except value and onChange
- **react/switch:** input props are passing via `inputProps` except value and onChange

## [0.1.3](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.1.2...@mezzanine-ui/react@0.1.3) (2021-04-21)

### Features

- **react/accordion:** add suffixActions prop and refactor component structure ([12f60cb](https://github.com/Mezzanine-UI/mezzanine/commit/12f60cb8f1e6f48316d19b2c8d07273257e3b180))
- **react/date-picker:** add on-calendar-toggle prop ([509bec0](https://github.com/Mezzanine-UI/mezzanine/commit/509bec04b0034d64739f456599dcc5d7bc6f7586)), closes [#53](https://github.com/Mezzanine-UI/mezzanine/issues/53)

## [0.1.2](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.1.1...@mezzanine-ui/react@0.1.2) (2021-04-16)

### Bug Fixes

- **react/date-picker:** useClickAway should not return anything when calendar not open ([e658ae0](https://github.com/Mezzanine-UI/mezzanine/commit/e658ae07d586f11c8b738ed498724119a29cf74c))
- **react/date-range-picker:** useClickAway should not return anything when calendar not open ([f252139](https://github.com/Mezzanine-UI/mezzanine/commit/f252139184fddf74b08ce8557e92e33285f1d0d8))

## [0.1.1](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.1.0...@mezzanine-ui/react@0.1.1) (2021-04-15)

### Bug Fixes

- **react/date-picker:** add popper className and prevent propagation when icon clicked ([0f5bcd9](https://github.com/Mezzanine-UI/mezzanine/commit/0f5bcd9512df7e922aa9a214b7097d547f3b8252)), closes [#50](https://github.com/Mezzanine-UI/mezzanine/issues/50) [#50](https://github.com/Mezzanine-UI/mezzanine/issues/50)
- **react/date-range-picker:** add popper className and prevent propagation when icon clicked ([19283b1](https://github.com/Mezzanine-UI/mezzanine/commit/19283b1c8fcc6a921e6505738682208044e85055)), closes [#50](https://github.com/Mezzanine-UI/mezzanine/issues/50) [#50](https://github.com/Mezzanine-UI/mezzanine/issues/50)
- **react/modal:** fix modal not allowBodyScroll when closed modal bug ([f827713](https://github.com/Mezzanine-UI/mezzanine/commit/f827713048b219b0f7758725b0ff0e8542c95af4))
- **react/utils:** fix allowBodyScroll wrong top calculation type bug ([6bc9886](https://github.com/Mezzanine-UI/mezzanine/commit/6bc9886a39d80c3846f8da9e1a029d3d7da3164a))

### Features

- **react/loading:** first implement ([b0fbb13](https://github.com/Mezzanine-UI/mezzanine/commit/b0fbb132c6a078d0ddb764669c916dcbdb8695f9))
- **react/overlay:** add onSurface prop to implement different background-color ([00563d2](https://github.com/Mezzanine-UI/mezzanine/commit/00563d26389d9db768241448b2cb2008d316428d))

# [0.1.0](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.0.10...@mezzanine-ui/react@0.1.0) (2021-04-13)

### Bug Fixes

- **react/calendar:** fix circular import and remove DateType declare ([a088b7b](https://github.com/Mezzanine-UI/mezzanine/commit/a088b7badbe8512a722eb1d778d92b94e2c896e8))
- **react/date-picker:** fix circular import ([68506ed](https://github.com/Mezzanine-UI/mezzanine/commit/68506ed9b389c8199d07cdd3fabfc2dd6e77779e))
- **react/popper:** merging styles ([412d7d6](https://github.com/Mezzanine-UI/mezzanine/commit/412d7d63921b2f37511e62b277b12e19d9a88b4a))
- **react/text-field:** apply with-suffix styles when suffix action icon is provided ([47d2042](https://github.com/Mezzanine-UI/mezzanine/commit/47d204258e214c965a6a87eea0dc448e1765c06b))

### Features

- **icons:** add arrow-right and calendar icon ([b4d4cc9](https://github.com/Mezzanine-UI/mezzanine/commit/b4d4cc9ec68ba97b5b3439447588ce3f5ab425bf))
- **react/accordion:** first implementation ([175584c](https://github.com/Mezzanine-UI/mezzanine/commit/175584cfd79fc6dde81b6a680e3ec553ca5b28be))
- **react/appbar:** implement ([511c5a4](https://github.com/Mezzanine-UI/mezzanine/commit/511c5a44e7c25723c513658a6c6dbfc3f153508f))
- **react/calendar:** implement ([2ad74ad](https://github.com/Mezzanine-UI/mezzanine/commit/2ad74ad751aeec60cd8d93ef66d531da7b118896))
- **react/date-picker:** implement ([cfbd274](https://github.com/Mezzanine-UI/mezzanine/commit/cfbd27408bbe0b3ce7cc96d5b7a2fb707d8b1f62))
- **react/date-range-picker:** implement ([9d221ab](https://github.com/Mezzanine-UI/mezzanine/commit/9d221abc340f866f5871ec38c67097f955c07a3b))
- **react/dropdown:** implement ([fa34a18](https://github.com/Mezzanine-UI/mezzanine/commit/fa34a18335aab42932a1f1e1ce8cfa0a8f02dc9a))
- **react/hooks:** add use-document-tab-key-down hook ([11e4f35](https://github.com/Mezzanine-UI/mezzanine/commit/11e4f3541bfbb5d6347bb0dec09c320ac1985aeb))

## [0.0.10](https://github.com/Mezzanine-UI/mezzanine/compare/@mezzanine-ui/react@0.0.9...@mezzanine-ui/react@0.0.10) (2021-04-07)

### Bug Fixes

- **react/modal:** unlock body scroll after element unmount (under useEffect not useLayoutEffect) ([ec94310](https://github.com/Mezzanine-UI/mezzanine/commit/ec943109eda409aa30553d7764089a424c873443)), closes [#41](https://github.com/Mezzanine-UI/mezzanine/issues/41) [#41](https://github.com/Mezzanine-UI/mezzanine/issues/41)

### Features

- **react/navigation:** implement ([431ab37](https://github.com/Mezzanine-UI/mezzanine/commit/431ab371a06054f483d7d106dc734d40d85f9df9))

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
