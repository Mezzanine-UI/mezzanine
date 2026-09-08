/**
 * React 的三個 union 成員（水平圖示、垂直＋靠左標題、垂直＋置中標題）攤平成
 * 單一 interface。
 *
 * 這些成員是以 `statusTypeIconLayout` 與 `titleAlign` 的字面值互相判別的：
 * 水平佈局只允許 `titleAlign` 與 `supportingTextAlign` 為 `'left'`，標題置中時
 * `supportingTextAlign` 才可以是 `'center'`。Vue 的 `defineProps` 解析這種
 * union 會得到無法使用的結果，因此全部列成選用的 prop。
 *
 * prop 名稱、型別與執行期行為都沒有變；失去的只是編譯期保證。
 */
export interface ModalHeaderProps {
  /**
   * Whether to show status type icon.
   * @default false
   */
  showStatusTypeIcon?: boolean;
  /**
   * Layout of the status type icon relative to title.
   * - 'horizontal': Icon to the left of title
   * - 'vertical': Icon above title
   * @default 'vertical'
   */
  statusTypeIconLayout?: 'horizontal' | 'vertical';
  /**
   * Supporting text displayed below the title.
   */
  supportingText?: string;
  /**
   * Alignment of the supporting text.
   * Only 'left' is allowed unless `titleAlign` is 'center'.
   * @default 'left'
   */
  supportingTextAlign?: 'center' | 'left';
  /**
   * The title text of the modal header.
   */
  title: string;
  /**
   * Alignment of the title.
   * Only 'left' is allowed when `statusTypeIconLayout` is 'horizontal'.
   * @default 'left'
   */
  titleAlign?: 'center' | 'left';
}
