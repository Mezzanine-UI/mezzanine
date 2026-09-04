# Mezzanine UI Vue 元件目錄

> 此檔案為 AI 工具最佳化的元件索引，幫助快速定位元件用途與搭配關係。
> 對照 `packages/react/COMPONENTS.md`；每移植一個元件就同步更新。

## General（基礎）

| 元件       | 匯入名稱        | 匯入路徑                       | 說明                                                                                   |
| ---------- | --------------- | ------------------------------ | -------------------------------------------------------------------------------------- |
| Icon       | `MznIcon`       | `@mezzanine-ui/vue/icon`       | SVG 圖示元件，搭配 `@mezzanine-ui/icons` 使用，支援顏色、尺寸與旋轉動畫控制            |
| Separator  | `MznSeparator`  | `@mezzanine-ui/vue/separator`  | 水平或垂直分隔線，以 `<hr>` 為基礎，垂直時自動標註 `aria-orientation`                  |
| Typography | `MznTypography` | `@mezzanine-ui/vue/typography` | 文字排版元件，`variant` 為語意排版類型並自動推斷標籤，支援色彩、對齊、單行截斷與不換行 |

## General（基礎）之外的操作元件

| 元件        | 匯入名稱         | 匯入路徑                   | 說明                                                                   |
| ----------- | ---------------- | -------------------------- | ---------------------------------------------------------------------- |
| Button      | `MznButton`      | `@mezzanine-ui/vue/button` | 通用按鈕，支援 12 種外觀、前後置圖示、僅圖示（自帶 tooltip）與載入狀態 |
| ButtonGroup | `MznButtonGroup` | `@mezzanine-ui/vue/button` | 按鈕群組，群組的 disabled／size／variant 會填補子按鈕未設定的值        |

## Navigation（導航）

| 元件        | 匯入名稱         | 匯入路徑                    | 說明                                                         |
| ----------- | ---------------- | --------------------------- | ------------------------------------------------------------ |
| Anchor      | `MznAnchor`      | `@mezzanine-ui/vue/anchor`  | 頁面章節導航連結，依網址 hash 自動標示當前位置，最多三層巢狀 |
| AnchorGroup | `MznAnchorGroup` | `@mezzanine-ui/vue/anchor`  | 錨點導航群組容器，可用 `anchors` 資料或子元件描述結構        |
| Stepper     | `MznStepper`     | `@mezzanine-ui/vue/stepper` | 步驟進度指示器，支援水平／垂直排列與數字／圓點兩種指示器     |
| Step        | `MznStep`        | `@mezzanine-ui/vue/stepper` | 單一步驟，狀態由父層 stepper 指定，可掛 click 成為互動元素   |
| Tab         | `MznTab`         | `@mezzanine-ui/vue/tab`     | 頁籤導航容器，以底部滑動指示條標示選取項，支援水平與垂直     |
| TabItem     | `MznTabItem`     | `@mezzanine-ui/vue/tab`     | 頁籤項目，支援圖示、徽章計數、錯誤與停用狀態                 |

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

| 元件        | 匯入名稱         | 匯入路徑                         | 說明                                                 |
| ----------- | ---------------- | -------------------------------- | ---------------------------------------------------- |
| AlertBanner | `MznAlertBanner` | `@mezzanine-ui/vue/alert-banner` | 頁面層級警示橫幅，命令式 `alertBanner` 共用 alert 層 |
| Empty       | `MznEmpty`       | `@mezzanine-ui/vue/empty`        | 空狀態，四種情境插畫與三種尺寸，可帶動作按鈕         |
| Message     | `message`        | `@mezzanine-ui/vue/message`      | 命令式訊息提示，最多四則、預設三秒，滑鼠懸停暫停計時 |
| ResultState | `MznResultState` | `@mezzanine-ui/vue/result-state` | 結果狀態，六種語意圖示與兩種尺寸，可帶動作按鈕       |
| Skeleton    | `MznSkeleton`    | `@mezzanine-ui/vue/skeleton`     | 骨架屏佔位元件，支援文字條、圓形與方塊三種形態       |
| Spin        | `MznSpin`        | `@mezzanine-ui/vue/spin`         | 載入指示器，可單獨使用或包住內容以淺色遮罩覆蓋       |

## 內部元件（不建議直接使用）

| 元件                   | 匯入名稱                    | 匯入路徑                          | 說明                                                                    |
| ---------------------- | --------------------------- | --------------------------------- | ----------------------------------------------------------------------- |
| Calendar               | `MznCalendar`               | `@mezzanine-ui/vue/calendar`      | 日曆，依 `mode` 顯示日／週／月／季／半年／年面板                        |
| RangeCalendar          | `MznRangeCalendar`          | `@mezzanine-ui/vue/calendar`      | 並排兩個日曆的區間選取版本，含區間掃描與底部動作按鈕                    |
| CalendarConfigProvider | `MznCalendarConfigProvider` | `@mezzanine-ui/vue/calendar`      | 提供日期函式庫（Moment／Dayjs／Luxon／Temporal）與語系                  |
| ClearActions           | `MznClearActions`           | `@mezzanine-ui/vue/clear-actions` | 清除／關閉按鈕，依 `type` 提供 standard / embedded / clearable 三種情境 |
| TimePanel              | `MznTimePanel`              | `@mezzanine-ui/vue/time-panel`    | 時間面板，時／分／秒三個捲動欄位，可個別隱藏與設定步進                  |
| TextField              | `MznTextField`              | `@mezzanine-ui/vue/text-field`    | 輸入類元件的視覺外框，支援前後綴、清除鈕與交由使用端接管內距            |
| Scrollbar              | `MznScrollbar`              | `@mezzanine-ui/vue/scrollbar`     | 自訂捲軸容器（OverlayScrollbars），可用 `disabled` 退回原生捲軸         |
| Notifier               | `createNotifier`            | `@mezzanine-ui/vue/notifier`      | 建立命令式通知的工廠，Message／AlertBanner 建於其上                     |
| Portal                 | `MznPortal`                 | `@mezzanine-ui/vue/portal`        | 以 Teleport 將內容送往 alert／default portal 容器或指定的目的地         |
| Popper                 | `MznPopper`                 | `@mezzanine-ui/vue/popper`        | 依錨點定位的浮層（`@floating-ui/dom`），支援箭頭與 middleware           |
| Backdrop               | `MznBackdrop`               | `@mezzanine-ui/vue/backdrop`      | Modal／Drawer 用的遮罩層，開啟時淡入並鎖定 body 捲動                    |
| Tooltip                | `MznTooltip`                | `@mezzanine-ui/vue/tooltip`       | 懸停提示，觸發元素由 scoped slot 提供，支援鍵盤與 Escape 關閉           |

## Motion（動效）

| 元件      | 匯入名稱       | 匯入路徑                       | 說明                                                |
| --------- | -------------- | ------------------------------ | --------------------------------------------------- |
| Fade      | `MznFade`      | `@mezzanine-ui/vue/transition` | 淡入淡出                                            |
| Scale     | `MznScale`     | `@mezzanine-ui/vue/transition` | 由 95% 放大並淡入，進場結束後 transform 設回 `none` |
| Translate | `MznTranslate` | `@mezzanine-ui/vue/transition` | 從指定方向位移 4px 進場並淡入                       |
| Slide     | `MznSlide`     | `@mezzanine-ui/vue/transition` | 從邊緣整塊滑入（位移 100%，不淡入）                 |
| Rotate    | `MznRotate`    | `@mezzanine-ui/vue/transition` | 依 `in` 旋轉既有元素，不負責掛載／卸載              |

> Collapse 尚未移植：它沒有自己的 story（harness 無法驗證），使用它的 Accordion 與
> NavigationOption 也還沒移植，React 端本身標記為 `@deprecated`。

> Portal、Popper、Tooltip、轉場家族的 stories 都已補齊並通過 DOM parity。
>
> Backdrop（需 drawer / modal / select）、Spin（需 description / modal）與 Button
> 自己（需 dropdown）的 stories 仍缺依賴，DOM parity 還沒跑過，
> `yarn components:graph` 會標成 `parity pending …`。這些元件目前的把關是 props
> 契約比對、靜態檢查與單元測試。
