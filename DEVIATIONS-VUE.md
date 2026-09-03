# React → Vue Parity Deviations

當 React 與 Vue 元件因平台差異無法達成完整 parity 時，**先停下來**向使用者說明原因，取得核可後在此檔新增一列。`tools/parity/compare.ts --target vue` 會解析下表，**只**抑制明列的 `(Component, Story, Kind)` 三元組 diff，其他一律視為失敗。

本檔與 `DEVIATIONS.md`（React ↔ Angular）**刻意分開**：Angular 的 deviation 是「Angular 表達能力不足」的證據，對 Vue 能不能做到毫無參考價值。共用一份會讓 Vue 默默繼承 Angular 的妥協。特別注意以下三類在 Angular 有、但 Vue **不應該**重現的 deviation：

- **emit 改名**（`onChange` → `expandedChange`、`onOpen` → `opened`）：Angular 無法讓 input 與 output 同名，Vue 的具名 `v-model:<prop>` 沒有這個限制
- **portal 旁多出的 sibling 節點**：Vue 的 `<Teleport to="body">` 對應 React 的 `createPortal`，若仍多出節點是 Teleport 位置放錯
- **ReactNode → 橋接 prop**（`prefixText` / `prefixIcon`）：Vue slot 比 `<ng-content>` 更有表達力，應先嘗試忠實對應

欄位說明：

- `Component`：kebab-case，需與 `tools/parity/.out-vue/<component>/` 對應
- `Story`：story 的 `name`（即 export 名稱）；填 `*` 代表該元件所有 story
- `Kind`：`tag` | `attr` | `style` | `text` | `args` | `missing` | `extra` | `error` | `input` | `output`
- `Reason`：必須具體說明為何無法 parity
- `Approved`：使用者核可日期 `YYYY-MM-DD`

| Component  | Story     | Kind   | React                                                                                                 | Vue                                          | Reason                                                                                                                                                                                                                                                                                                            | Approved   |
| ---------- | --------- | ------ | ----------------------------------------------------------------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| transition | `__api__` | input  | 基底 `Transition` 元件的 `appear` / `duration` / `in` / `keepMount` / `lazyMount` / `addEndListener`  | 無對應元件                                   | React 的 `Transition.tsx` 是 react-transition-group 的包裝層；Vue 內建的 `<Transition>` 就是這一層，Fade / Scale / Translate / Slide 直接建在其上。D10 已授權「同行為、不同 API」，另外開一個沒有任何使用者的 `MznTransition` 包裝只是為了讓抽取器閉嘴，比 deviation 更糟。五個 story 的 DOM parity 皆為 0 diff。 | 2026-09-03 |
| transition | `__api__` | output | 基底 `Transition` 元件的 `onEnter` / `onEntering` / `onEntered` / `onExit` / `onExiting` / `onExited` | 無對應元件                                   | 同上：這六個 callback 在 Vue 是各實作自己的 emit（`MznFade` 等皆已完整提供），基底元件本身不存在。                                                                                                                                                                                                                | 2026-09-03 |
| transition | `__api__` | error  | 基底 `Transition` 元件（`TransitionProps` + `Transition.tsx`）                                        | 無 `transition.types.ts` 與 `transition.vue` | 抽取器依 story title 尋找同名的 props interface 與 SFC，而 Vue 端刻意沒有基底元件，因此回報「找不到」。這是上述兩列的同一件事在檔案層級的表現。                                                                                                                                                                   | 2026-09-03 |
