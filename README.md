# mezzanine

## IMPORTANT!!!

This project is in beta version, and currently being used by rytass internal projects. <br />
Please consider the possibility of api changes if you want to use it in production mode.

## Storybook preview

If you are interested about this project, please see: [Storybook](https://www.chromatic.com/library?appId=6088f509c9dfa500212770cf)

## Migrations

If you are an existing mezzanine users and looking for migration guides, please see [Migrations](https://github.com/Mezzanine-UI/mezzanine/tree/main/migrations).

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
