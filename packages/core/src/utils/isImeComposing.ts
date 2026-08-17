/**
 * IME 組字期間的 keyCode。Safari 等瀏覽器在按 Enter 確認組字時，
 * `isComposing` 可能已是 `false`，但仍帶此碼。
 */
const IME_KEYCODE = 229;

export interface ImeComposingEventLike {
  isComposing?: boolean;
  keyCode?: number;
  nativeEvent?: {
    isComposing?: boolean;
    keyCode?: number;
  };
}

/**
 * 判斷鍵盤事件是否發生在 IME 組字期間。
 *
 * 中日韓輸入法按 Enter / Return 是確認候選字，不應觸發選取或送出。
 *
 * @example
 * ```ts
 * if (isImeComposing(event)) return;
 * ```
 */
export function isImeComposing(event: ImeComposingEventLike): boolean {
  const source = event.nativeEvent ?? event;

  return Boolean(source.isComposing) || source.keyCode === IME_KEYCODE;
}
