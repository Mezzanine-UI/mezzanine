# Table 開發想像

```typescript
interface TableColumnBase {
  // 主 key
  key: string;
  // 資料渲染相關
  dataIndex?: string; // 指定某個 key name
  render?: Function; // 或是自定義 render
  // 樣式相關
  align?: 'start' | 'center' | 'end';
  bodyClassName?: string;
  headerClassName?: string;
  width?: number;
  // 表頭相關
  title?: ReactNode; // 表頭 label
  titleHelp?: ReactNode; // 表頭補充說明 (傳給 tooltip)
  titleMenu?: ReactNode; // 表頭最右側可以放一個 Vertical dot 並點擊展開 Menu
  // 功能：排序
  sorter?: Function; // 決定如何 sort 該欄
  onSorted?: (key: string, sortedType: 'default' | 'sort-up' | 'sort-down') => void; // Default → Sort Up → Sort Down → Default
  // 功能：ellipsis
  ellipsis?: boolean; // 預設要是開啟的
  // 功能：動態調整欄寬
  resizable?: boolean; // 預設關閉
  // 功能：釘選
  fixed?: boolean | 'start' | 'end'; // true='start'，可選擇釘選欄位在開頭還是結尾
  // ...可能還有不夠完整之處，可以隨時補充修正
}
```

## 可能會使用到的 mzn 元件

```
<Pagination>
<Checkbox>
// ...還會有更多
```

## 實作上的注意

1. 要注意大量資料時的處理，需利用 Virtual list 方式優化，可以考慮使用 react-window 或其他套件方便實作，但也要注意使用套件後，是否所有功能的實作都是能做到的，需要評估一下。
2. 瀏覽器預設使用的 scroll bar 應該要隱藏，並且使用自製的 scroll bar 懸浮在上方，避免 windows 的 scroll bar 推移 table 內部空間，導致表格偏移。
3. 每個 column 可以選擇 resizable: true 並且會在該欄表頭欄位右側長出一個 resize indicator，當它拉動時會影響該欄的寬度+右側欄位的寬度，最後一欄是不能開啟 resize 的，因為這會影響 table 的總寬度
4. 選取功能 props.rowSelection，也可以設定 fixed，當使用者傳入 rowSelection 會固定在每一個 row 前面渲染 Checkbox，表頭的最左側也會有 checkbox 供 selectAll 使用，使用者也能透過 rowSelection.hideSelectAll 隱藏（參照 Ant design 做法）
5. 使用者有給予 props.scroll 的時候，需要可以滾動（可以參考現行 Table 的做法，也可以參考 Ant design 做法補足），且可以滾動時 header 要是 sticky 狀態
6. 使用者可以透過 draggable 來啟動 Table row 的拖曳功能，細節的實作可以參考現行 mzn Table 的做法，使用 @hello-pangea/dnd 套件

## 效能與可讀性

1. 希望每個功能盡量獨立包裝成 custom hook 引用，讓工程師方便維護
2. 請開發時一併考量 render 的效率

## 參考資料

Ant Design Table
https://ant.design/components/table
