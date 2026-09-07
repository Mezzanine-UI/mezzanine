import MznModalContainer from './modal-container.vue';
import {
  modalContainerDefaultOptions,
  type ModalContainerProps,
} from './modal-container.types';

export interface UseModalContainerResult {
  /** The overlay shell: backdrop, scale transition, escape and focus trap. */
  Container: typeof MznModalContainer;
  /** The defaults `Container` applies when a prop is left out. */
  defaultOptions: typeof modalContainerDefaultOptions;
}

/**
 * 取得 Modal 外殼與其預設值的 composable。
 *
 * 想自己組一個帶遮罩、縮放進出場與焦點模型的浮層時，用它拿到 `Container`，
 * 就不必重寫 Escape 關閉、堆疊判斷與焦點還原這些細節。
 *
 * @example
 * ```ts
 * const { Container, defaultOptions } = useModalContainer();
 * ```
 *
 * @see MznModal 直接使用這個外殼的對話框元件
 */
export function useModalContainer(): UseModalContainerResult {
  return {
    Container: MznModalContainer,
    defaultOptions: modalContainerDefaultOptions,
  };
}

export type { ModalContainerProps };
