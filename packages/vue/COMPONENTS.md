# Mezzanine UI Vue 元件目錄

> 此檔案為 AI 工具最佳化的元件索引，幫助快速定位元件用途與搭配關係。
> 對照 `packages/react/COMPONENTS.md`；每移植一個元件就同步更新。

## General（基礎）

| 元件       | 匯入名稱        | 匯入路徑                       | 說明                                                                                   |
| ---------- | --------------- | ------------------------------ | -------------------------------------------------------------------------------------- |
| Icon       | `MznIcon`       | `@mezzanine-ui/vue/icon`       | SVG 圖示元件，搭配 `@mezzanine-ui/icons` 使用，支援顏色、尺寸與旋轉動畫控制            |
| Separator  | `MznSeparator`  | `@mezzanine-ui/vue/separator`  | 水平或垂直分隔線，以 `<hr>` 為基礎，垂直時自動標註 `aria-orientation`                  |
| Typography | `MznTypography` | `@mezzanine-ui/vue/typography` | 文字排版元件，`variant` 為語意排版類型並自動推斷標籤，支援色彩、對齊、單行截斷與不換行 |

## Navigation（導航）

| 元件        | 匯入名稱         | 匯入路徑                   | 說明                                                         |
| ----------- | ---------------- | -------------------------- | ------------------------------------------------------------ |
| Anchor      | `MznAnchor`      | `@mezzanine-ui/vue/anchor` | 頁面章節導航連結，依網址 hash 自動標示當前位置，最多三層巢狀 |
| AnchorGroup | `MznAnchorGroup` | `@mezzanine-ui/vue/anchor` | 錨點導航群組容器，可用 `anchors` 資料或子元件描述結構        |
| Tab         | `MznTab`         | `@mezzanine-ui/vue/tab`    | 頁籤導航容器，以底部滑動指示條標示選取項，支援水平與垂直     |
| TabItem     | `MznTabItem`     | `@mezzanine-ui/vue/tab`    | 頁籤項目，支援圖示、徽章計數、錯誤與停用狀態                 |

## Data Display（資料展示）

| 元件               | 匯入名稱                | 匯入路徑                           | 說明                                                             |
| ------------------ | ----------------------- | ---------------------------------- | ---------------------------------------------------------------- |
| InlineMessage      | `MznInlineMessage`      | `@mezzanine-ui/vue/inline-message` | 行內提示訊息，依 `severity` 顯示對應圖示，info 可關閉            |
| InlineMessageGroup | `MznInlineMessageGroup` | `@mezzanine-ui/vue/inline-message` | 行內提示訊息群組，可用 `items` 或 slot 提供內容                  |
| Badge              | `MznBadge`              | `@mezzanine-ui/vue/badge`          | 徽章元件，支援數字計數、狀態圓點、圓點含文字與純文字標籤四種變體 |

## Data Entry（資料輸入）

| 元件     | 匯入名稱      | 匯入路徑                     | 說明                                                                     |
| -------- | ------------- | ---------------------------- | ------------------------------------------------------------------------ |
| Textarea | `MznTextarea` | `@mezzanine-ui/vue/textarea` | 多行文字輸入區域，`type` 控制預設／警告／錯誤樣式，`resize` 開啟縮放把手 |
| Toggle   | `MznToggle`   | `@mezzanine-ui/vue/toggle`   | 開／關切換開關，支援 `v-model:checked`、label 與輔助說明文字             |

## Feedback（回饋）

| 元件     | 匯入名稱      | 匯入路徑                     | 說明                                           |
| -------- | ------------- | ---------------------------- | ---------------------------------------------- |
| Skeleton | `MznSkeleton` | `@mezzanine-ui/vue/skeleton` | 骨架屏佔位元件，支援文字條、圓形與方塊三種形態 |
| Spin     | `MznSpin`     | `@mezzanine-ui/vue/spin`     | 載入指示器，可單獨使用或包住內容以淺色遮罩覆蓋 |

## 內部元件（不建議直接使用）

| 元件         | 匯入名稱          | 匯入路徑                          | 說明                                                                    |
| ------------ | ----------------- | --------------------------------- | ----------------------------------------------------------------------- |
| ClearActions | `MznClearActions` | `@mezzanine-ui/vue/clear-actions` | 清除／關閉按鈕，依 `type` 提供 standard / embedded / clearable 三種情境 |
| TextField    | `MznTextField`    | `@mezzanine-ui/vue/text-field`    | 輸入類元件的視覺外框，支援前後綴、清除鈕與交由使用端接管內距            |
| Scrollbar    | `MznScrollbar`    | `@mezzanine-ui/vue/scrollbar`     | 自訂捲軸容器（OverlayScrollbars），可用 `disabled` 退回原生捲軸         |
| Portal       | `MznPortal`       | `@mezzanine-ui/vue/portal`        | 以 Teleport 將內容送往 alert／default portal 容器或指定的目的地         |
| Popper       | `MznPopper`       | `@mezzanine-ui/vue/popper`        | 依錨點定位的浮層（`@floating-ui/dom`），支援箭頭與 middleware           |
| Backdrop     | `MznBackdrop`     | `@mezzanine-ui/vue/backdrop`      | Modal／Drawer 用的遮罩層，開啟時淡入並鎖定 body 捲動                    |
| Tooltip      | `MznTooltip`      | `@mezzanine-ui/vue/tooltip`       | 懸停提示，觸發元素由 scoped slot 提供，支援鍵盤與 Escape 關閉           |

## Motion（動效）

| 元件 | 匯入名稱  | 匯入路徑                       | 說明                                                                                                     |
| ---- | --------- | ------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Fade | `MznFade` | `@mezzanine-ui/vue/transition` | 淡入淡出轉場。其餘轉場家族成員（Collapse / Rotate / Scale / Slide / Translate）待其 stories 解封後再移植 |

> Portal、Popper、Backdrop、Tooltip、Spin 與 Fade 的 stories 需要尚未移植的元件（都直接
> 或間接卡在 Button），因此還沒有 story 檔，DOM parity 也還沒跑過
> （`yarn components:graph` 會標成 `parity pending …`）。目前的把關是 props 契約
> 比對、靜態檢查與單元測試。
