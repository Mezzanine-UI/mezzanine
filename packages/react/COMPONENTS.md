# Mezzanine UI 元件目錄

> 此檔案為 AI 工具最佳化的元件索引，幫助快速定位元件用途與搭配關係。

## General（基礎）

| 元件             | 匯入名稱           | 說明                                                                                                                                                                                                  |
| ---------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button           | `Button`           | 動作觸發按鈕，支援 primary / secondary / ghost / destructive / inverse 變體與多種尺寸                                                                                                                 |
| ButtonGroup      | `ButtonGroup`      | 將多個 Button 組合為群組，支援水平或垂直排列                                                                                                                                                          |
| Cropper          | `Cropper`          | 圖片裁切元件，支援自訂裁切區域與輸出尺寸                                                                                                                                                              |
| Icon             | `Icon`             | SVG 圖示元件，搭配 `@mezzanine-ui/icons` 使用，支援顏色與大小控制                                                                                                                                     |
| Layout           | `Layout`           | 頁面整體佈局容器，提供左側面板、主要內容區、右側面板的三欄結構                                                                                                                                        |
| LayoutLeftPanel  | `LayoutLeftPanel`  | 佈局左側面板區塊                                                                                                                                                                                      |
| LayoutMain       | `LayoutMain`       | 佈局主要內容區塊                                                                                                                                                                                      |
| LayoutRightPanel | `LayoutRightPanel` | 佈局右側面板區塊                                                                                                                                                                                      |
| Separator        | `Separator`        | 水平或垂直分隔線，用於視覺上區隔內容區塊                                                                                                                                                              |
| Typography       | `Typography`       | 文字排版元件，`variant` 為語意排版類型（`TypographySemanticType`），僅支援 `h1`、`h2`、`h3`（無 h4–h6），並提供 body / caption / annotation / button / input / label / text-link 系列共 21 種 variant |

## Navigation（導航）

| 元件                     | 匯入名稱                   | 說明                                                         |
| ------------------------ | -------------------------- | ------------------------------------------------------------ |
| Breadcrumb               | `Breadcrumb`               | 麵包屑導航，顯示當前頁面的層級路徑，可自訂分隔符             |
| Drawer                   | `Drawer`                   | 側邊抽屜，從螢幕四個方向滑入，搭配 Portal 與 Backdrop 使用   |
| Navigation               | `Navigation`               | 側邊主導航容器，包含標頭、選項群組、頁尾區域                 |
| NavigationFooter         | `NavigationFooter`         | 導航頁尾區域，通常放置帳號資訊或設定入口                     |
| NavigationHeader         | `NavigationHeader`         | 導航標頭區域，通常放置 Logo 或品牌名稱                       |
| NavigationIconButton     | `NavigationIconButton`     | 導航中的圖示按鈕，用於收合或觸發動作                         |
| NavigationOption         | `NavigationOption`         | 導航中的單一選項連結                                         |
| NavigationOptionCategory | `NavigationOptionCategory` | 導航選項群組標題，用於分類導航項目                           |
| NavigationUserMenu       | `NavigationUserMenu`       | 導航中的使用者選單，顯示頭像與帳號資訊                       |
| PageFooter               | `PageFooter`               | 頁面底部頁尾區塊                                             |
| PageHeader               | `PageHeader`               | 頁面頂部標頭區塊，通常包含頁面標題與操作按鈕                 |
| Step                     | `Step`                     | Stepper 中的單一步驟節點                                     |
| Stepper                  | `Stepper`                  | 步驟條元件，引導使用者完成多步驟流程，搭配 `useStepper` hook |
| Tab                      | `Tab`                      | 分頁容器，管理多個 TabItem 的切換狀態                        |
| TabItem                  | `TabItem`                  | 分頁中的單一頁籤項目                                         |

## Data Display（資料展示）

| 元件                        | 匯入名稱                      | 說明                                                                               |
| --------------------------- | ----------------------------- | ---------------------------------------------------------------------------------- |
| Accordion                   | `Accordion`                   | 手風琴展開/收合元件，包含標題與內容區域                                            |
| AccordionActions            | `AccordionActions`            | Accordion 底部操作按鈕區域                                                         |
| AccordionContent            | `AccordionContent`            | Accordion 展開後的內容區域                                                         |
| AccordionGroup              | `AccordionGroup`              | 將多個 Accordion 組合為群組                                                        |
| AccordionTitle              | `AccordionTitle`              | Accordion 的標題列，點擊可切換展開狀態                                             |
| Badge                       | `Badge`                       | 徽章元件，顯示數字或狀態標記                                                       |
| BadgeContainer              | `BadgeContainer`              | 將 Badge 疊加在子元件右上角的容器                                                  |
| BaseCard                    | `BaseCard`                    | 基礎卡片元件，支援縮圖、動作選單、toggle 等多種配置                                |
| BaseCardSkeleton            | `BaseCardSkeleton`            | BaseCard 的骨架屏載入佔位元件                                                      |
| CardGroup                   | `CardGroup`                   | 卡片群組容器，支援 grid 佈局與載入狀態                                             |
| FourThumbnailCard           | `FourThumbnailCard`           | 四縮圖卡片，適合展示多媒體內容集合                                                 |
| FourThumbnailCardSkeleton   | `FourThumbnailCardSkeleton`   | FourThumbnailCard 的骨架屏                                                         |
| QuickActionCard             | `QuickActionCard`             | 快速操作卡片，支援圖示與標題兩種模式                                               |
| QuickActionCardSkeleton     | `QuickActionCardSkeleton`     | QuickActionCard 的骨架屏                                                           |
| SingleThumbnailCard         | `SingleThumbnailCard`         | 單縮圖卡片，適合展示單一媒體項目                                                   |
| SingleThumbnailCardSkeleton | `SingleThumbnailCardSkeleton` | SingleThumbnailCard 的骨架屏                                                       |
| Thumbnail                   | `Thumbnail`                   | 縮圖元件，用於卡片內部呈現圖片預覽                                                 |
| Description                 | `Description`                 | 描述列表元件，以 key-value 形式呈現資料                                            |
| DescriptionContent          | `DescriptionContent`          | 描述列表的值（value）欄位                                                          |
| DescriptionGroup            | `DescriptionGroup`            | 描述列表群組，管理多個 Description 的佈局                                          |
| DescriptionTitle            | `DescriptionTitle`            | 描述列表的鍵（key）欄位                                                            |
| Empty                       | `Empty`                       | 空狀態元件，在無資料時顯示提示圖示與文字                                           |
| OverflowCounterTag          | `OverflowCounterTag`          | 顯示溢出項目計數的標籤，搭配 OverflowTooltip 使用                                  |
| Pagination                  | `Pagination`                  | 分頁元件，包含頁碼、跳頁、每頁筆數等子元件，搭配 `usePagination` hook              |
| PaginationItem              | `PaginationItem`              | 分頁中的單一頁碼項目                                                               |
| PaginationJumper            | `PaginationJumper`            | 分頁中的跳頁輸入框                                                                 |
| PaginationPageSize          | `PaginationPageSize`          | 分頁中的每頁筆數選擇器                                                             |
| Section                     | `Section`                     | 內容分區元件，提供標題與內容的區塊佈局                                             |
| Table                       | `Table`                       | 功能完整的表格元件，支援排序、篩選、選取、展開、虛擬捲動、拖曳、固定欄、可調欄寬等 |
| Tag                         | `Tag`                         | 標籤元件，用於分類或標記，支援多種顏色與可關閉                                     |
| TagGroup                    | `TagGroup`                    | 標籤群組容器                                                                       |
| Tooltip                     | `Tooltip`                     | 文字提示泡泡，懸停時顯示說明文字，基於 Popper 定位                                 |

## Data Entry（資料輸入）

| 元件                      | 匯入名稱                    | 說明                                                                                     | 相關 Hooks                                                |
| ------------------------- | --------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| AutoComplete              | `AutoComplete`              | 自動完成輸入，輸入時透過 Dropdown 顯示建議選項                                           | `useAutoCompleteValueControl`                             |
| CheckAll                  | `CheckAll`                  | 「全選」核取方塊，與 CheckboxGroup 配合管理全選/取消全選狀態                             | `useCheckboxControlValue`                                 |
| Checkbox                  | `Checkbox`                  | 核取方塊，支援 indeterminate 狀態                                                        | `useCheckboxControlValue`                                 |
| CheckboxGroup             | `CheckboxGroup`             | 核取方塊群組，管理多個選項的勾選狀態，支援水平/垂直排列                                  | `useCheckboxControlValue`                                 |
| DatePicker                | `DatePicker`                | 日期選擇器，點擊觸發 Calendar 面板選取日期                                               | `usePickerValue`                                          |
| DatePickerCalendar        | `DatePickerCalendar`        | DatePicker 內部的日曆面板，可獨立使用                                                    | —                                                         |
| DateRangePicker           | `DateRangePicker`           | 日期範圍選擇器，選取起始與結束日期                                                       | `useDateRangePickerValue`, `useDateRangeCalendarControls` |
| DateRangePickerCalendar   | `DateRangePickerCalendar`   | DateRangePicker 內部的雙月日曆面板，可獨立使用                                           | —                                                         |
| DateTimePicker            | `DateTimePicker`            | 日期時間選擇器，同時選取日期與時間                                                       | `usePickerValue`                                          |
| DateTimeRangePicker       | `DateTimeRangePicker`       | 日期時間範圍選擇器，選取起始與結束的日期時間                                             | —                                                         |
| Filter                    | `Filter`                    | 單一篩選條件元件，搭配 FilterArea 使用                                                   | —                                                         |
| FilterArea                | `FilterArea`                | 篩選器容器，管理多個 FilterLine 的展示與收合                                             | —                                                         |
| FilterLine                | `FilterLine`                | 篩選器中的單行條件列，包含多個 Filter                                                    | —                                                         |
| FormControlContext        | `FormControlContext`        | Form 的 React Context Provider，向下傳遞 label/hint/error 等表單控制狀態                 | —                                                         |
| FormField                 | `FormField`                 | 表單欄位包裝器，提供 label、hint、error 的標準化佈局，包裝任何輸入元件                   | —                                                         |
| FormHintText              | `FormHintText`              | 表單欄位的提示說明文字                                                                   | —                                                         |
| FormLabel                 | `FormLabel`                 | 表單欄位的標籤文字                                                                       | —                                                         |
| Input                     | `Input`                     | 文字輸入框，支援 clearable、number、password、search、select、measure、action 等多種變體 | `useInputControlValue`, `useInputWithClearControlValue`   |
| MultipleDatePicker        | `MultipleDatePicker`        | 多選日期選擇器，可選取多個不連續日期                                                     | `useMultipleDatePickerValue`                              |
| MultipleDatePickerTrigger | `MultipleDatePickerTrigger` | MultipleDatePicker 的觸發輸入區域，可獨立使用                                            | —                                                         |
| PickerTrigger             | `PickerTrigger`             | 選取器的觸發輸入框基底元件                                                               | `usePickerValue`, `usePickerDocumentEventClose`           |
| RangePickerTrigger        | `RangePickerTrigger`        | 範圍選取器的雙輸入框觸發元件                                                             | —                                                         |
| Radio                     | `Radio`                     | 單選按鈕                                                                                 | `useRadioControlValue`                                    |
| RadioGroup                | `RadioGroup`                | 單選按鈕群組，管理互斥選取，支援水平/垂直排列                                            | `useRadioControlValue`                                    |
| Cascader                  | `Cascader`                  | 級聯選擇器，支援多層次的樹狀選項選取                                                     | —                                                         |
| CascaderPanel             | `CascaderPanel`             | Cascader 內部的選項面板，可獨立使用                                                      | —                                                         |
| Select                    | `Select`                    | 下拉選擇器，支援單選與多選，透過 Dropdown 呈現選項                                       | `useSelectValueControl`                                   |
| SelectControlContext      | `SelectControlContext`      | Select 的受控狀態 Context                                                                | —                                                         |
| SelectTrigger             | `SelectTrigger`             | Select 的觸發輸入區域，可獨立組合使用                                                    | —                                                         |
| SelectTriggerTags         | `SelectTriggerTags`         | 多選 Select 的標籤顯示區域                                                               | —                                                         |
| SelectionCard             | `SelectionCard`             | 可選取的卡片元件，作為 Checkbox/Radio 的卡片式替代                                       | —                                                         |
| Slider                    | `Slider`                    | 滑桿元件，支援單點與範圍兩種模式                                                         | `useSlider`                                               |
| Toggle                    | `Toggle`                    | 切換開關元件，用於表示開／關二元狀態（原名為 Switch）                                    | `useSwitchControlValue`                                   |
| Textarea                  | `Textarea`                  | 多行文字輸入框，支援自動調整高度與字數限制                                               | `useInputControlValue`                                    |
| TextField                 | `TextField`                 | 文字欄位基底元件，提供通用的邊框/尺寸/狀態樣式                                           | —                                                         |
| TimePicker                | `TimePicker`                | 時間選擇器，點擊觸發 TimePanel 面板選取時間                                              | `usePickerValue`                                          |
| TimePickerPanel           | `TimePickerPanel`           | TimePicker 內部的時間面板，可獨立使用                                                    | —                                                         |
| TimeRangePicker           | `TimeRangePicker`           | 時間範圍選擇器，選取起始與結束時間                                                       | `useTimeRangePickerValue`                                 |
| Upload                    | `Upload`                    | 檔案上傳元件，支援點擊與拖曳上傳                                                         | —                                                         |
| UploadItem                | `UploadItem`                | 上傳列表中的單一檔案項目，顯示檔名與上傳狀態                                             | —                                                         |
| UploadPictureCard         | `UploadPictureCard`         | 圖片上傳的卡片式預覽元件                                                                 | —                                                         |
| Uploader                  | `Uploader`                  | 上傳觸發區域基底元件，可自訂觸發按鈕樣式                                                 | —                                                         |

## Feedback（回饋）

| 元件                     | 匯入名稱                   | 說明                                                                  |
| ------------------------ | -------------------------- | --------------------------------------------------------------------- |
| InlineMessage            | `InlineMessage`            | 行內訊息提示，支援 success / warning / error / info 嚴重程度          |
| InlineMessageGroup       | `InlineMessageGroup`       | 多則行內訊息的群組顯示                                                |
| Message                  | `Message`                  | 全域訊息通知，從頁面頂部彈出，自動消失                                |
| Modal                    | `Modal`                    | 對話框，使用 Portal 渲染在 DOM 外層，包含 Header、Body、Footer 子元件 |
| ModalBodyForVerification | `ModalBodyForVerification` | 用於確認/刪除操作的 Modal Body，含警告圖示                            |
| ModalFooter              | `ModalFooter`              | Modal 底部操作按鈕區域                                                |
| ModalHeader              | `ModalHeader`              | Modal 頂部標題區域                                                    |
| NotificationCenter       | `NotificationCenter`       | 通知中心面板，展示系統通知列表                                        |
| Progress                 | `Progress`                 | 進度條元件，支援 line / circle 兩種類型與多種狀態                     |
| ResultState              | `ResultState`              | 結果狀態頁，顯示操作成功/失敗/空等結果情境                            |
| Skeleton                 | `Skeleton`                 | 骨架屏佔位元件，在內容載入前顯示灰色佔位區塊                          |
| Spin                     | `Spin`                     | 載入中旋轉動畫，支援包裹子元件或獨立使用                              |

## Others（其他）

| 元件           | 匯入名稱         | 說明                                               |
| -------------- | ---------------- | -------------------------------------------------- |
| AlertBanner    | `AlertBanner`    | 警示橫幅，固定於頁面頂部，用於系統級別的重要通知   |
| Anchor         | `Anchor`         | 錨點連結元件，用於頁面內跳轉                       |
| AnchorGroup    | `AnchorGroup`    | 錨點群組，管理多個 Anchor 並同步捲動位置的高亮狀態 |
| Backdrop       | `Backdrop`       | 遮罩背景層，用於 Modal、Drawer 等覆蓋元件的背景    |
| FloatingButton | `FloatingButton` | 懸浮操作按鈕，固定在頁面右下角，觸發主要操作       |

## Utility（工具）

| 元件                   | 匯入名稱                 | 說明                                                                                 |
| ---------------------- | ------------------------ | ------------------------------------------------------------------------------------ |
| Calendar               | `Calendar`               | 完整日曆元件，支援日/週/月/季/半年/年視圖切換                                        |
| RangeCalendar          | `RangeCalendar`          | 範圍日曆，支援選取起始至結束日期範圍                                                 |
| CalendarCell           | `CalendarCell`           | 日曆中的單一日期格子                                                                 |
| CalendarConfigProvider | `CalendarConfigProvider` | 日曆全域設定提供者，設定語系與格式                                                   |
| CalendarControls       | `CalendarControls`       | 日曆的月份/年份切換控制列                                                            |
| CalendarDayOfWeek      | `CalendarDayOfWeek`      | 日曆的週幾標題列                                                                     |
| CalendarDays           | `CalendarDays`           | 日曆的日期格子區域                                                                   |
| CalendarHalfYears      | `CalendarHalfYears`      | 日曆的半年視圖                                                                       |
| CalendarMonths         | `CalendarMonths`         | 日曆的月份視圖                                                                       |
| CalendarQuarters       | `CalendarQuarters`       | 日曆的季度視圖                                                                       |
| CalendarWeeks          | `CalendarWeeks`          | 日曆的週視圖                                                                         |
| CalendarYears          | `CalendarYears`          | 日曆的年份視圖                                                                       |
| Dropdown               | `Dropdown`               | 下拉選單面板，由 Select、AutoComplete、Cascader 等元件內部使用                       |
| DropdownAction         | `DropdownAction`         | Dropdown 中的操作按鈕項目                                                            |
| DropdownItem           | `DropdownItem`           | Dropdown 中的標準選項項目                                                            |
| DropdownItemCard       | `DropdownItemCard`       | Dropdown 中的卡片式選項項目                                                          |
| DropdownStatus         | `DropdownStatus`         | Dropdown 的狀態提示顯示（空狀態、載入中等）                                          |
| Popper                 | `Popper`                 | 定位浮層元件，基於 Floating UI，Tooltip / Dropdown 的定位基底                        |
| Portal                 | `Portal`                 | 將子元件渲染到指定 DOM 節點，Modal、Drawer 使用此元件脫離文件流                      |
| TimePanel              | `TimePanel`              | 時間選取面板，包含時/分/秒的滾輪選取                                                 |
| TimePanelColumn        | `TimePanelColumn`        | TimePanel 中的單一時間欄（時、分或秒）的滾輪列                                       |
| Transition             | `Transition`             | 動畫過渡基底元件，提供 Collapse / Fade / Rotate / Scale / Slide / Translate 六種動畫 |
| Collapse               | `Collapse`               | 收合展開動畫（高度過渡）                                                             |
| Fade                   | `Fade`                   | 淡入淡出動畫                                                                         |
| Rotate                 | `Rotate`                 | 旋轉動畫                                                                             |
| Scale                  | `Scale`                  | 縮放動畫                                                                             |
| Slide                  | `Slide`                  | 滑動動畫，Drawer 使用此元件進行進出場                                                |
| Translate              | `Translate`              | 位移動畫                                                                             |
| createNotifier         | `createNotifier`         | 工廠函式，建立通知管理器實例，用於指令式顯示 toast / 通知訊息                        |

---

## 元件關係圖

- **Select** 內部使用 Dropdown 呈現選項面板，SelectTrigger 作為輸入觸發區域
- **AutoComplete** 使用 Dropdown 顯示建議選項，Input 作為觸發器
- **Cascader** 使用 Dropdown 呈現樹狀選項面板，CascaderPanel 為面板主體
- **FormField** 包裝任何輸入元件（Input、Select、Checkbox 等），透過 FormControlContext 向下傳遞 label / hint / error 狀態
- **Modal** 使用 Portal 渲染在 DOM 樹外層，Backdrop 作為遮罩背景
- **Drawer** 使用 Portal + Backdrop + Slide 動畫組合呈現側邊抽屜
- **DatePicker** 內部使用 Calendar + PickerTrigger
- **DateRangePicker** 內部使用 RangeCalendar + RangePickerTrigger
- **DateTimePicker** 內部使用 Calendar + TimePanel + PickerTrigger
- **DateTimeRangePicker** 內部使用 RangeCalendar + TimePanel + RangePickerTrigger
- **TimePicker** 內部使用 TimePanel + PickerTrigger
- **TimeRangePicker** 內部使用 TimePanel + RangePickerTrigger
- **MultipleDatePicker** 使用 Calendar + MultipleDatePickerTrigger
- **Table** 可搭配 Pagination 進行分頁；搭配 `useTableRowSelection` 管理列選取；搭配 `useTableDataSource` 管理資料
- **Tooltip** 使用 Popper 定位浮層，`useDelayMouseEnterLeave` 管理延遲顯示
- **Navigation** 由 NavigationHeader、NavigationOptionCategory、NavigationOption、NavigationFooter、NavigationUserMenu 組合構成
- **Accordion** 由 AccordionTitle、AccordionContent、AccordionActions 組合；AccordionGroup 管理多個 Accordion
- **Description** 由 DescriptionTitle、DescriptionContent 組合；DescriptionGroup 管理多組
- **Upload** 由 Uploader（觸發區）、UploadItem（列表項）、UploadPictureCard（圖片預覽卡）組合
- **Stepper** 由多個 Step 組合，搭配 `useStepper` hook 管理當前步驟狀態
- **Pagination** 可組合 PaginationItem、PaginationJumper、PaginationPageSize，搭配 `usePagination` hook
- **FilterArea** 由 FilterLine 與 Filter 組合，管理多行篩選條件
- **AnchorGroup** 包含多個 Anchor，監聽捲動事件同步高亮當前錨點

---

## Form Hook ↔ 元件對應

| Hook                            | 搭配元件                | 用途                       |
| ------------------------------- | ----------------------- | -------------------------- |
| `useInputControlValue`          | Input、Textarea         | 受控字串值管理             |
| `useInputWithClearControlValue` | Input（clearable）      | 含清除按鈕的受控輸入值管理 |
| `useSelectValueControl`         | Select                  | 受控單選 / 多選值管理      |
| `useCheckboxControlValue`       | Checkbox、CheckboxGroup | 受控勾選狀態管理           |
| `useRadioControlValue`          | Radio、RadioGroup       | 受控 radio 選取管理        |
| `useSwitchControlValue`         | Toggle                  | 受控開關狀態管理           |
| `useAutoCompleteValueControl`   | AutoComplete            | 受控自動完成值管理         |
| `useCustomControlValue`         | 任意元件                | 泛用受控值 hook            |
| `useControlValueState`          | 任意元件                | 基礎受控 / 非受控狀態管理  |

---

## 通用 Hooks

| Hook                           | 說明                                                  |
| ------------------------------ | ----------------------------------------------------- |
| `useClickAway`                 | 偵測點擊元件外部區域                                  |
| `useComposeRefs`               | 合併多個 ref                                          |
| `useDocumentEscapeKeyDown`     | 監聽全域 Escape 鍵事件                                |
| `useDocumentEvents`            | 監聽全域 DOM 事件                                     |
| `useDocumentTabKeyDown`        | 監聽全域 Tab 鍵事件                                   |
| `useIsomorphicLayoutEffect`    | SSR 安全的 `useLayoutEffect`                          |
| `useLastCallback`              | 保持 callback 參照穩定，避免 stale closure            |
| `useLastValue`                 | 取得最新的值參照                                      |
| `usePreviousValue`             | 取得前一次渲染的值                                    |
| `useScrollLock`                | 鎖定頁面捲動（Modal、Drawer 開啟時使用）              |
| `useTopStack`                  | 管理 z-index 堆疊順序（覆蓋元件使用）                 |
| `useWindowWidth`               | 監聽視窗寬度變化                                      |
| `useDelayMouseEnterLeave`      | 延遲觸發 mouseEnter / mouseLeave（Tooltip 使用）      |
| `useStepper`                   | 管理 Stepper 的當前步驟與流程控制                     |
| `usePagination`                | 管理分頁狀態（當前頁、總頁數計算）                    |
| `useSlider`                    | 管理 Slider 的拖曳與值計算                            |
| `usePickerValue`               | 管理選取器（DatePicker、TimePicker 等）的開關與值狀態 |
| `usePickerDocumentEventClose`  | 偵測點擊外部或按 Escape 關閉選取器面板                |
| `useTabKeyClose`               | 按 Tab 鍵關閉選取器面板                               |
| `useDateRangePickerValue`      | 管理日期範圍選取器的值狀態                            |
| `useDateRangeCalendarControls` | 管理日期範圍日曆的月份切換                            |
| `useMultipleDatePickerValue`   | 管理多選日期選擇器的值狀態                            |
| `useTimeRangePickerValue`      | 管理時間範圍選擇器的值狀態                            |
| `useCalendarContext`           | 取得 Calendar 的 Context 值                           |
| `useCalendarControlModifiers`  | 提供日曆控制列的日期修改函數                          |
| `useCalendarControls`          | 管理日曆的月份 / 年份切換狀態                         |
| `useCalendarModeStack`         | 管理日曆視圖模式的堆疊切換（日→月→年）                |
| `useRangeCalendarControls`     | 管理範圍日曆的月份切換                                |
| `useModalContainer`            | 取得 Modal 的 Portal 容器節點                         |
| `useTableContext`              | 取得 Table 的主要 Context                             |
| `useTableDataContext`          | 取得 Table 的資料 Context                             |
| `useTableSuperContext`         | 取得 Table 的上層 Context                             |
| `useTableDataSource`           | 管理 Table 的資料來源、排序與篩選                     |
| `useTableRowSelection`         | 管理 Table 的列選取狀態                               |

---

## 內部元件（不建議使用）

以下元件僅可透過 sub-path import 存取，為 mezzanine 內部使用。

| 元件          | 替代方案                   | 說明          |
| ------------- | -------------------------- | ------------- |
| ContentHeader | 自行組合 PageHeader 或自訂 | 頁面級別標頭  |
| ClearActions  | 自行組合 Button            | 清除/關閉按鈕 |
| Scrollbar     | 瀏覽器原生捲軸或自訂       | 自訂捲軸元件  |
