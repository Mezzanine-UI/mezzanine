# React → Angular Parity Deviations

當 React 與 Angular 元件因平台差異無法達成完整 parity 時，**先停下來**向使用者說明原因，取得核可後在此檔新增一列。`tools/parity/compare.ts` 會解析下表，**只**抑制明列的 `(Component, Story, Kind)` 三元組 diff，其他一律視為失敗。

- `Component`：kebab-case，需與 `tools/parity/.out/<component>/` 對應
- `Story`：story 的 `name`（即 export 名稱）；填 `*` 代表該元件所有 story
- `Kind`：`tag` | `attr` | `style` | `text` | `missing` | `extra` | `api`
- `Reason`：必須具體說明為何無法 parity
- `Approved`：使用者核可日期 `YYYY-MM-DD`

| Component        | Story       | Kind   | React                                       | Angular                                 | Reason                                                                                                                                                                                                                                                                             | Approved   |
| ---------------- | ----------- | ------ | ------------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| date-time-picker | **api**     | input  | fadeProps                                   | —                                       | React 用 `react-transition-group` / 自訂 Transition lib 暴露一整包 props 控制彈出層的淡入淡出動畫。Angular 這邊採用純 CSS transition，沒有同等的 JS 可配置物件，因此無法做出 prop-level 對應。若未來 Angular 側新增類似的 transition 層，應回頭加上 `fadeProps` input 並移除此行。 | 2026-04-11 |
| upload           | **api**     | input  | errorIcon / uploaderIcon(各 ReactNode 欄位) | IconDefinition + ng-content             | React 允許傳入任意 `ReactNode` 作為 icon。Angular 無對等任意模板傳遞機制，改以 `IconDefinition` Input 輔以 `<ng-content>` 投影提供客製化路徑。覆蓋率足以滿足目前 design system icon 使用場景。                                                                                     | 2026-04-14 |
| upload           | **api**     | output | onUpload                                    | uploadHandler + upload                  | React `onUpload` 同時具有 async return value（控制 files 狀態）與 `setProgress` callback。Angular EventEmitter 不接收 return value，因此拆成 `uploadHandler: UploadHandler` Input（主要控制路徑，含 setProgress）+ `upload: File[]` Output（副通知）。兩者並存時以 handler 為準。  | 2026-04-14 |
| upload           | **api**     | input  | controllerRef                               | exportAs='mznUploader' + public methods | React 的 imperative controller ref 在 Angular 以 `exportAs` + `click()` / `reset()` 公開方法替代；功能等價。                                                                                                                                                                       | 2026-04-14 |
| upload           | **api**     | input  | inputRef                                    | @ViewChild('inputRef')                  | Angular 以 `exportAs='mznUploader'` 暴露 `inputRef` getter 取得 native `<input>` 元素，消費端透過 template ref 取用。                                                                                                                                                              | 2026-04-14 |
| upload           | **missing** | style  | —                                           | —                                       | `.mzn-upload-item__error-message` 在 React 是 `.mzn-upload-item` host 的 **兄弟節點**（React Fragment），Angular 以屬性選擇器 `[mznUploadItem]` 僅能單一 host 容納所有子節點，因此 error-message 改置於 host 內部末端。視覺上一致，但 DOM 深度多一層。                             | 2026-04-14 |
