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

| 元件                     | 匯入名稱                      | 匯入路徑                           | 說明                                                               |
| ------------------------ | ----------------------------- | ---------------------------------- | ------------------------------------------------------------------ |
| Anchor                   | `MznAnchor`                   | `@mezzanine-ui/vue/anchor`         | 頁面章節導航連結，依網址 hash 自動標示當前位置，最多三層巢狀       |
| AnchorGroup              | `MznAnchorGroup`              | `@mezzanine-ui/vue/anchor`         | 錨點導航群組容器，可用 `anchors` 資料或子元件描述結構              |
| Stepper                  | `MznStepper`                  | `@mezzanine-ui/vue/stepper`        | 步驟進度指示器，支援水平／垂直排列與數字／圓點兩種指示器           |
| Step                     | `MznStep`                     | `@mezzanine-ui/vue/stepper`        | 單一步驟，狀態由父層 stepper 指定，可掛 click 成為互動元素         |
| Tab                      | `MznTab`                      | `@mezzanine-ui/vue/tab`            | 頁籤導航容器，以底部滑動指示條標示選取項，支援水平與垂直           |
| TabItem                  | `MznTabItem`                  | `@mezzanine-ui/vue/tab`            | 頁籤項目，支援圖示、徽章計數、錯誤與停用狀態                       |
| Breadcrumb               | `MznBreadcrumb`               | `@mezzanine-ui/vue/breadcrumb`     | 麵包屑導覽，超過四節收成「…」選單，condensed 只留最後兩節          |
| BreadcrumbItem           | `MznBreadcrumbItem`           | `@mezzanine-ui/vue/breadcrumb`     | 麵包屑的一節，給 options 就變下拉、給 href 就變連結                |
| ContentHeader            | `MznContentHeader`            | `@mezzanine-ui/vue/content-header` | 內容標題列，依元件種類把 slot 分派到篩選、動作與工具區             |
| PageFooter               | `MznPageFooter`               | `@mezzanine-ui/vue/page-footer`    | 頁尾操作列，左側可放註記、按鈕、核取方塊或密碼欄位                 |
| Pagination               | `MznPagination`               | `@mezzanine-ui/vue/pagination`     | 分頁導覽，可加跳頁輸入框與每頁筆數選擇器                           |
| Navigation               | `MznNavigation`               | `@mezzanine-ui/vue/navigation`     | 側邊主導航容器，含標頭、選項清單與頁尾；收合時放不下的選項收進浮層 |
| NavigationFooter         | `MznNavigationFooter`         | `@mezzanine-ui/vue/navigation`     | 導航頁尾，使用者選單單獨排前面，其餘收進圖示列                     |
| NavigationHeader         | `MznNavigationHeader`         | `@mezzanine-ui/vue/navigation`     | 導航標頭，收合切換鈕加品牌區塊                                     |
| NavigationIconButton     | `MznNavigationIconButton`     | `@mezzanine-ui/vue/navigation`     | 導航中只有圖示的按鈕，靠 `aria-label` 命名                         |
| NavigationOption         | `MznNavigationOption`         | `@mezzanine-ui/vue/navigation`     | 導航的單一選項，有子項時是收合群組、有 href 時是連結               |
| NavigationOptionCategory | `MznNavigationOptionCategory` | `@mezzanine-ui/vue/navigation`     | 導航選項的分組標題                                                 |
| NavigationUserMenu       | `MznNavigationUserMenu`       | `@mezzanine-ui/vue/navigation`     | 導航中的使用者選單，頭像加名字加下拉                               |
| Drawer                   | `MznDrawer`                   | `@mezzanine-ui/vue/drawer`         | 側邊抽屜，從右側滑入，可帶標題列、篩選區與底部操作列               |
| PageHeader               | `MznPageHeader`               | `@mezzanine-ui/vue/page-header`    | 頁面標頭，一組麵包屑加上一個內容標題列                             |

## Data Display（資料展示）

| 元件                        | 匯入名稱                         | 匯入路徑                           | 說明                                                                       |
| --------------------------- | -------------------------------- | ---------------------------------- | -------------------------------------------------------------------------- |
| InlineMessage               | `MznInlineMessage`               | `@mezzanine-ui/vue/inline-message` | 行內提示訊息，依 `severity` 顯示對應圖示，info 可關閉                      |
| InlineMessageGroup          | `MznInlineMessageGroup`          | `@mezzanine-ui/vue/inline-message` | 行內提示訊息群組，可用 `items` 或 slot 提供內容                            |
| Badge                       | `MznBadge`                       | `@mezzanine-ui/vue/badge`          | 徽章元件，支援數字計數、狀態圓點、圓點含文字與純文字標籤四種變體           |
| Tag                         | `MznTag`                         | `@mezzanine-ui/vue/tag`            | 標籤元件，static／counter／overflow-counter／dismissable／addable 五種模式 |
| TagGroup                    | `MznTagGroup`                    | `@mezzanine-ui/vue/tag`            | 標籤群組，只收 MznTag 與 MznOverflowCounterTag，可選淡入淡出               |
| BaseCard                    | `MznBaseCard`                    | `@mezzanine-ui/vue/card`           | 通用卡片，可渲染成 div、連結或任意元件；`type` 決定標題列右側的動作        |
| BaseCardSkeleton            | `MznBaseCardSkeleton`            | `@mezzanine-ui/vue/card`           | BaseCard 的載入佔位版本                                                    |
| CardGroup                   | `MznCardGroup`                   | `@mezzanine-ui/vue/card`           | 把多張卡片排成 grid 的容器，`loading` 時改渲染對應的骨架                   |
| FourThumbnailCard           | `MznFourThumbnailCard`           | `@mezzanine-ui/vue/card`           | 四張縮圖排成 2x2 的卡片，可加標籤與收藏按鈕                                |
| FourThumbnailCardSkeleton   | `MznFourThumbnailCardSkeleton`   | `@mezzanine-ui/vue/card`           | FourThumbnailCard 的載入佔位版本                                           |
| QuickActionCard             | `MznQuickActionCard`             | `@mezzanine-ui/vue/card`           | 小尺寸的快捷卡片，一個圖示加標題與副標題                                   |
| QuickActionCardSkeleton     | `MznQuickActionCardSkeleton`     | `@mezzanine-ui/vue/card`           | QuickActionCard 的載入佔位版本                                             |
| SingleThumbnailCard         | `MznSingleThumbnailCard`         | `@mezzanine-ui/vue/card`           | 單張縮圖的卡片，寬度由圖片決定                                             |
| SingleThumbnailCardSkeleton | `MznSingleThumbnailCardSkeleton` | `@mezzanine-ui/vue/card`           | SingleThumbnailCard 的載入佔位版本                                         |
| Thumbnail                   | `MznThumbnail`                   | `@mezzanine-ui/vue/card`           | FourThumbnailCard 的子項，滑過時蓋一層寫著 `title` 的遮罩                  |
| Accordion                   | `MznAccordion`                   | `@mezzanine-ui/vue/accordion`      | 手風琴，可展開／收合的內容區塊                                             |
| AccordionActions            | `MznAccordionActions`            | `@mezzanine-ui/vue/accordion`      | 手風琴標題右側的操作按鈕區，只收 Button 與 Dropdown                        |
| AccordionContent            | `MznAccordionContent`            | `@mezzanine-ui/vue/accordion`      | 手風琴展開後的內容區                                                       |
| AccordionGroup              | `MznAccordionGroup`              | `@mezzanine-ui/vue/accordion`      | 把多個手風琴排成一組，`exclusive` 時同時只開一個                           |
| AccordionTitle              | `MznAccordionTitle`              | `@mezzanine-ui/vue/accordion`      | 手風琴的標題列，點一下切換展開狀態                                         |
| Description                 | `MznDescription`                 | `@mezzanine-ui/vue/description`    | 描述列，一個標題配一段內容                                                 |
| DescriptionContent          | `MznDescriptionContent`          | `@mezzanine-ui/vue/description`    | 描述列的內容，可帶趨勢箭頭或可點的圖示                                     |
| DescriptionGroup            | `MznDescriptionGroup`            | `@mezzanine-ui/vue/description`    | 把多個描述列排在一起                                                       |
| DescriptionTitle            | `MznDescriptionTitle`            | `@mezzanine-ui/vue/description`    | 描述列的標題，可帶徽章與提示圖示                                           |
| Section                     | `MznSection`                     | `@mezzanine-ui/vue/section`        | 內容分區，標題列、篩選區與頁籤各自認得自己的元件並排到對應版位             |
| SectionGroup                | `MznSectionGroup`                | `@mezzanine-ui/vue/section`        | 把多個分區排成一欄或一列                                                   |

## Data Entry（資料輸入）

| 元件                | 匯入名稱                 | 匯入路徑                                   | 說明                                                                                           |
| ------------------- | ------------------------ | ------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Checkbox            | `MznCheckbox`            | `@mezzanine-ui/vue/checkbox`               | 核取方塊，default／chip 兩種模式，支援中間態與勾選後的可編輯輸入框                             |
| CheckboxGroup       | `MznCheckboxGroup`       | `@mezzanine-ui/vue/checkbox`               | 一組共用 name 的核取方塊，以 `options` 或預設 slot 提供，可帶全選控制                          |
| CheckAll            | `MznCheckAll`            | `@mezzanine-ui/vue/checkbox`               | 包住一組 CheckboxGroup 的全選核取方塊                                                          |
| Radio               | `MznRadio`               | `@mezzanine-ui/vue/radio`                  | 單選按鈕，radio／segment 兩種模式，選取後可帶可編輯輸入框                                      |
| RadioGroup          | `MznRadioGroup`          | `@mezzanine-ui/vue/radio`                  | 一組互斥的單選按鈕，以 `options` 或預設 slot 提供，可水平或垂直排列                            |
| DateTimePicker      | `MznDateTimePicker`      | `@mezzanine-ui/vue/date-time-picker`       | 日期時間選擇器，左右兩個輸入框各自帶日曆與時間面板                                             |
| DateTimeRangePicker | `MznDateTimeRangePicker` | `@mezzanine-ui/vue/date-time-range-picker` | 日期時間區間選擇器，兩個日期時間選擇器加方向箭頭                                               |
| DateRangePicker     | `MznDateRangePicker`     | `@mezzanine-ui/vue/date-range-picker`      | 日期區間選擇器，雙日曆浮層，支援即時與手動確認兩種模式                                         |
| FormField           | `MznFormField`           | `@mezzanine-ui/vue/form`                   | 表單欄位容器，整合標籤、提示文字、計數器與 form control 狀態                                   |
| FormGroup           | `MznFormGroup`           | `@mezzanine-ui/vue/form`                   | 表單欄位群組，一個標題加一組欄位                                                               |
| DatePicker          | `MznDatePicker`          | `@mezzanine-ui/vue/date-picker`            | 日期選擇器，六種模式的日曆浮層，可用 predicate 限制可選範圍                                    |
| Input               | `MznInput`               | `@mezzanine-ui/vue/input`                  | 多功能輸入框，以 `variant` 切換 base／affix／search／number／measure／action／select／password |
| Select              | `MznSelect`              | `@mezzanine-ui/vue/select`                 | 下拉選擇，單選或多選；多選以標籤呈現，巢狀 options 自動切換樹狀勾選                            |
| AutoComplete        | `MznAutoComplete`        | `@mezzanine-ui/vue/auto-complete`          | 自動完成輸入，輸入時即時篩選；可切換搜尋框在選單外或內，並支援動態新增選項                     |
| TimePicker          | `MznTimePicker`          | `@mezzanine-ui/vue/time-picker`            | 時間選擇器，遮罩輸入加時間面板浮層，支援步進與隱藏欄位                                         |
| TimeRangePicker     | `MznTimeRangePicker`     | `@mezzanine-ui/vue/time-range-picker`      | 時間區間選擇器，兩個輸入框共用一個時間面板                                                     |
| Textarea            | `MznTextarea`            | `@mezzanine-ui/vue/textarea`               | 多行文字輸入區域，`type` 控制預設／警告／錯誤樣式，`resize` 開啟縮放把手                       |
| Slider              | `MznSlider`              | `@mezzanine-ui/vue/slider`                 | 滑桿，值的型別決定單點或範圍；可加輸入框、加減圖示與刻度                                       |
| SelectionCard       | `MznSelectionCard`       | `@mezzanine-ui/vue/selection-card`         | 以整張卡片作為選項的單選或多選控制項                                                           |
| SelectionCardGroup  | `MznSelectionCardGroup`  | `@mezzanine-ui/vue/selection-card`         | 把多張選擇卡片排成一組，可用 slot 或 `selections` 提供                                         |
| Toggle              | `MznToggle`              | `@mezzanine-ui/vue/toggle`                 | 開／關切換開關，支援 `v-model:checked`、label 與輔助說明文字                                   |
| MultipleDatePicker  | `MznMultipleDatePicker`  | `@mezzanine-ui/vue/multiple-date-picker`   | 多日期選擇器，從日曆挑多個日期以標籤呈現，按確認才送出                                         |
| Cascader            | `MznCascader`            | `@mezzanine-ui/vue/cascader`               | 階層選擇器，一次展開一層，選到葉節點才送出                                                     |
| Filter              | `MznFilter`              | `@mezzanine-ui/vue/filter-area`            | 單一篩選條件，決定欄位在行裡佔幾欄                                                             |
| FilterArea          | `MznFilterArea`          | `@mezzanine-ui/vue/filter-area`            | 篩選器容器，管理多條 FilterLine 的展開與收合                                                   |
| FilterLine          | `MznFilterLine`          | `@mezzanine-ui/vue/filter-area`            | 篩選器中的單行條件列                                                                           |
| Upload              | `MznUpload`              | `@mezzanine-ui/vue/upload`                 | 檔案上傳，五種版面；檔案狀態完全受控                                                           |
| UploadItem          | `MznUploadItem`          | `@mezzanine-ui/vue/upload`                 | 上傳清單裡的一列，依狀態顯示取消／下載／重試                                                   |
| UploadPictureCard   | `MznUploadPictureCard`   | `@mezzanine-ui/vue/upload`                 | 圖片上傳的卡片式預覽                                                                           |
| Uploader            | `MznUploader`            | `@mezzanine-ui/vue/upload`                 | 上傳觸發區，可拖放的區塊或一顆按鈕                                                             |

## Feedback（回饋）

| 元件                     | 匯入名稱                      | 匯入路徑                                | 說明                                                        |
| ------------------------ | ----------------------------- | --------------------------------------- | ----------------------------------------------------------- |
| AlertBanner              | `MznAlertBanner`              | `@mezzanine-ui/vue/alert-banner`        | 頁面層級警示橫幅，命令式 `alertBanner` 共用 alert 層        |
| Cropper                  | `MznCropper`                  | `@mezzanine-ui/vue/cropper`             | 裁切器外框，只負責樣式與尺寸                                |
| CropperElement           | `MznCropperElement`           | `@mezzanine-ui/vue/cropper`             | 裁切畫布，拖曳圖片、滾輪或滑桿縮放，角落標出原圖像素尺寸    |
| CropperModal             | `MznCropperModal`             | `@mezzanine-ui/vue/cropper`             | 裁切對話框，`MznCropperModal.open()` 可命令式開啟並取回結果 |
| Empty                    | `MznEmpty`                    | `@mezzanine-ui/vue/empty`               | 空狀態，四種情境插畫與三種尺寸，可帶動作按鈕                |
| Message                  | `message`                     | `@mezzanine-ui/vue/message`             | 命令式訊息提示，最多四則、預設三秒，滑鼠懸停暫停計時        |
| MediaPreviewModal        | `MznMediaPreviewModal`        | `@mezzanine-ui/vue/modal`               | 媒體預覽對話框，前後切換並交叉淡入，可受控或自行記住索引    |
| Modal                    | `MznModal`                    | `@mezzanine-ui/vue/modal`               | 對話框，五種佈局與六種狀態圖示，內容過長時自動加分隔線      |
| NotificationCenter       | `MznNotificationCenter`       | `@mezzanine-ui/vue/notification-center` | 單則通知，命令式 `notificationCenter` 同時最多顯示三則      |
| NotificationCenterDrawer | `MznNotificationCenterDrawer` | `@mezzanine-ui/vue/notification-center` | 通知抽屜，依今天／昨天／過去七天／更早分組                  |
| Progress                 | `MznProgress`                 | `@mezzanine-ui/vue/progress`            | 進度條，可顯示百分比文字或狀態圖示，並在指定位置標記刻度    |
| ResultState              | `MznResultState`              | `@mezzanine-ui/vue/result-state`        | 結果狀態，六種語意圖示與兩種尺寸，可帶動作按鈕              |
| Skeleton                 | `MznSkeleton`                 | `@mezzanine-ui/vue/skeleton`            | 骨架屏佔位元件，支援文字條、圓形與方塊三種形態              |
| Spin                     | `MznSpin`                     | `@mezzanine-ui/vue/spin`                | 載入指示器，可單獨使用或包住內容以淺色遮罩覆蓋              |

## 內部元件（不建議直接使用）

| 元件                         | 匯入名稱                          | 匯入路徑                                 | 說明                                                                    |
| ---------------------------- | --------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------- |
| Calendar                     | `MznCalendar`                     | `@mezzanine-ui/vue/calendar`             | 日曆，依 `mode` 顯示日／週／月／季／半年／年面板                        |
| RangeCalendar                | `MznRangeCalendar`                | `@mezzanine-ui/vue/calendar`             | 並排兩個日曆的區間選取版本，含區間掃描與底部動作按鈕                    |
| CalendarConfigProvider       | `MznCalendarConfigProvider`       | `@mezzanine-ui/vue/calendar`             | 提供日期函式庫（Moment／Dayjs／Luxon／Temporal）與語系                  |
| ClearActions                 | `MznClearActions`                 | `@mezzanine-ui/vue/clear-actions`        | 清除／關閉按鈕，依 `type` 提供 standard / embedded / clearable 三種情境 |
| InputTriggerPopper           | `MznInputTriggerPopper`           | 內部使用（`_internal`）                  | 由輸入框觸發的淡入浮層，picker 面板的容器                               |
| Dropdown                     | `MznDropdown`                     | `@mezzanine-ui/vue/dropdown`             | 下拉選單，觸發元素由 scoped slot 提供，支援鍵盤導覽、樹狀與多選         |
| DropdownItem                 | `MznDropdownItem`                 | `@mezzanine-ui/vue/dropdown`             | 下拉選單的清單本體，含狀態、動作列與捲動事件                            |
| DropdownItemCard             | `MznDropdownItemCard`             | `@mezzanine-ui/vue/dropdown`             | 下拉選單的單一選項列，支援關鍵字標色、快捷鍵文字與勾選                  |
| DropdownAction               | `MznDropdownAction`               | `@mezzanine-ui/vue/dropdown`             | 下拉選單底部的操作列，依監聽的事件決定顯示哪些按鈕                      |
| DropdownStatus               | `MznDropdownStatus`               | `@mezzanine-ui/vue/dropdown`             | 下拉選單的載入／無資料狀態                                              |
| ModalBodyForVerification     | `MznModalBodyForVerification`     | `@mezzanine-ui/vue/modal`                | 驗證碼輸入區，一格一字元，可貼上整串                                    |
| ModalContainer               | `MznModalContainer`               | `@mezzanine-ui/vue/modal`                | Modal 的外殼：遮罩、縮放進出場、Escape 關閉與焦點困住                   |
| ModalFooter                  | `MznModalFooter`                  | `@mezzanine-ui/vue/modal`                | Modal 的操作列，左側可放註記、按鈕、核取方塊或密碼欄位                  |
| ModalHeader                  | `MznModalHeader`                  | `@mezzanine-ui/vue/modal`                | Modal 的標題列，含狀態圖示與輔助說明                                    |
| PaginationItem               | `MznPaginationItem`               | `@mezzanine-ui/vue/pagination`           | 分頁列上的頁碼、箭頭或省略號                                            |
| PaginationJumper             | `MznPaginationJumper`             | `@mezzanine-ui/vue/pagination`           | 分頁列的跳頁欄                                                          |
| PaginationPageSize           | `MznPaginationPageSize`           | `@mezzanine-ui/vue/pagination`           | 分頁列的每頁筆數選擇器                                                  |
| ContentHeaderResponsive      | `MznContentHeaderResponsive`      | `@mezzanine-ui/vue/content-header`       | 把一段 ContentHeader 子項標記成只在某斷點顯示                           |
| SelectTrigger                | `MznSelectTrigger`                | `@mezzanine-ui/vue/select`               | Select 的觸發器：唯讀輸入框加收合箭頭                                   |
| SelectTriggerTags            | `MznSelectTriggerTags`            | `@mezzanine-ui/vue/select`               | 多選觸發器裡的標籤列，counter 會把放不下的收進計數標籤                  |
| AutoCompleteInsideTrigger    | `MznAutoCompleteInsideTrigger`    | `@mezzanine-ui/vue/auto-complete`        | inputPosition 為 inside 時 AutoComplete 的觸發輸入框                    |
| InputActionButton            | `MznInputActionButton`            | `@mezzanine-ui/vue/input`                | Input `variant="action"` 的動作按鈕                                     |
| InputSelectButton            | `MznInputSelectButton`            | `@mezzanine-ui/vue/input`                | Input `variant="select"` 的下拉選擇按鈕                                 |
| InputSpinnerButton           | `MznInputSpinnerButton`           | `@mezzanine-ui/vue/input`                | Input `variant="measure"` 的上下步進按鈕                                |
| PasswordStrengthIndicator    | `MznPasswordStrengthIndicator`    | `@mezzanine-ui/vue/input`                | 密碼強度指示器，強度條加提示文字                                        |
| TimePanel                    | `MznTimePanel`                    | `@mezzanine-ui/vue/time-panel`           | 時間面板，時／分／秒三個捲動欄位，可個別隱藏與設定步進                  |
| TextField                    | `MznTextField`                    | `@mezzanine-ui/vue/text-field`           | 輸入類元件的視覺外框，支援前後綴、清除鈕與交由使用端接管內距            |
| Scrollbar                    | `MznScrollbar`                    | `@mezzanine-ui/vue/scrollbar`            | 自訂捲軸容器（OverlayScrollbars），可用 `disabled` 退回原生捲軸         |
| Notifier                     | `createNotifier`                  | `@mezzanine-ui/vue/notifier`             | 建立命令式通知的工廠，Message／AlertBanner 建於其上                     |
| PickerTrigger                | `MznPickerTrigger`                | `@mezzanine-ui/vue/picker`               | Picker 的觸發輸入框，依格式遮罩輸入日期／時間                           |
| RangePickerTrigger           | `MznRangePickerTrigger`           | `@mezzanine-ui/vue/picker`               | 區間 picker 的觸發輸入框，兩個輸入框與箭頭                              |
| MultipleDatePickerTrigger    | `MznMultipleDatePickerTrigger`    | `@mezzanine-ui/vue/multiple-date-picker` | MultipleDatePicker 的觸發器，把選到的日期以標籤列在輸入框裡             |
| ThumbnailCardInfo            | `MznThumbnailCardInfo`            | `@mezzanine-ui/vue/card`                 | 縮圖卡片下方的資訊列，單縮圖與四縮圖卡片共用                            |
| CascaderPanel                | `MznCascaderPanel`                | `@mezzanine-ui/vue/cascader`             | 階層選擇器的其中一欄                                                    |
| NavigationOverflowMenu       | `MznNavigationOverflowMenu`       | `@mezzanine-ui/vue/navigation`           | 收合導航放不下的選項，收進「更多」浮層                                  |
| NavigationOverflowMenuOption | `MznNavigationOverflowMenuOption` | `@mezzanine-ui/vue/navigation`           | 「更多」浮層裡的一列                                                    |
| Portal                       | `MznPortal`                       | `@mezzanine-ui/vue/portal`               | 以 Teleport 將內容送往 alert／default portal 容器或指定的目的地         |
| Popper                       | `MznPopper`                       | `@mezzanine-ui/vue/popper`               | 依錨點定位的浮層（`@floating-ui/dom`），支援箭頭與 middleware           |
| Backdrop                     | `MznBackdrop`                     | `@mezzanine-ui/vue/backdrop`             | Modal／Drawer 用的遮罩層，開啟時淡入並鎖定 body 捲動                    |
| Tooltip                      | `MznTooltip`                      | `@mezzanine-ui/vue/tooltip`              | 懸停提示，觸發元素由 scoped slot 提供，支援鍵盤與 Escape 關閉           |
| OverflowTooltip              | `MznOverflowTooltip`              | `@mezzanine-ui/vue/overflow-tooltip`     | 收合標籤的浮層，開啟後量測每列寬度把浮層收到最寬的那一列                |
| OverflowCounterTag           | `MznOverflowCounterTag`           | `@mezzanine-ui/vue/overflow-tooltip`     | 顯示收合數量的計數標籤，點一下展開 MznOverflowTooltip                   |

## Others（其他）

| 元件             | 匯入名稱              | 匯入路徑                            | 說明                                             |
| ---------------- | --------------------- | ----------------------------------- | ------------------------------------------------ |
| FloatingButton   | `MznFloatingButton`   | `@mezzanine-ui/vue/floating-button` | 浮動按鈕，固定在畫面角落，可在面板開啟時自動收起 |
| Layout           | `MznLayout`           | `@mezzanine-ui/vue/layout`          | 頁面版面：導航、左面板、主要區域、右面板         |
| LayoutHost       | `MznLayoutHost`       | `@mezzanine-ui/vue/layout`          | 版面的最外層容器，提供量測用的 context           |
| LayoutLeftPanel  | `MznLayoutLeftPanel`  | `@mezzanine-ui/vue/layout`          | 版面左側可拖曳改寬度的面板                       |
| LayoutMain       | `MznLayoutMain`       | `@mezzanine-ui/vue/layout`          | 版面的主要內容區，自己捲動                       |
| LayoutRightPanel | `MznLayoutRightPanel` | `@mezzanine-ui/vue/layout`          | 版面右側可拖曳改寬度的面板                       |

## Motion（動效）

| 元件      | 匯入名稱       | 匯入路徑                       | 說明                                                |
| --------- | -------------- | ------------------------------ | --------------------------------------------------- |
| Collapse  | `MznCollapse`  | `@mezzanine-ui/vue/transition` | 高度收合展開，量測內容高度後過渡                    |
| Fade      | `MznFade`      | `@mezzanine-ui/vue/transition` | 淡入淡出                                            |
| Scale     | `MznScale`     | `@mezzanine-ui/vue/transition` | 由 95% 放大並淡入，進場結束後 transform 設回 `none` |
| Translate | `MznTranslate` | `@mezzanine-ui/vue/transition` | 從指定方向位移 4px 進場並淡入                       |
| Slide     | `MznSlide`     | `@mezzanine-ui/vue/transition` | 從邊緣整塊滑入（位移 100%，不淡入）                 |
| Rotate    | `MznRotate`    | `@mezzanine-ui/vue/transition` | 依 `in` 旋轉既有元素，不負責掛載／卸載              |

> Collapse 沒有自己的 story（harness 無法驗證），因此以單元測試把關；React 端本身
> 標記為 `@deprecated`，但 Accordion、Cascader、Navigation 與 FilterArea 仍在用它。

> 每一個已移植的元件都有自己的 stories，並且全部通過 DOM parity；
> `yarn components:graph` 的「Story files ready to write」清單為空，
> 也沒有任何 `parity pending`。唯一還沒移植的元件是 Table。
