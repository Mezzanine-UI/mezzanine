import type { ButtonHTMLAttributes, VNodeChild } from 'vue';
import type { ButtonProps } from '../button/button.types';

/**
 * React splits these into four interfaces and intersects two discriminated
 * unions: `MainOrSubEmptyProps | MinorEmptyProps` decides whether actions and a
 * description are allowed, and `CustomPictogramEmptyProps |
 * PresetPictogramEmptyProps` decides whether `type` names a preset pictogram.
 *
 * `defineProps` collapses such a union to `never` — the same limitation
 * documented on `TextFieldProps` and `TextareaProps`. The prop set, their types
 * and the runtime behaviour are unchanged; only the compile-time guarantee that
 * `size="minor"` excludes `actions` and `description` is lost, and the runtime
 * already ignores both in that size exactly as React does.
 */
/**
 * A button described as data rather than markup.
 *
 * React's `ButtonProps` reaches native button props through its polymorphic
 * factory, and carries the label in `children`. Vue's `ButtonProps` holds only
 * the component's own props — everything else is a fallthrough attribute — so
 * the native half is added back here, and `children` becomes the default slot.
 */
export type EmptyActionButton = ButtonProps &
  Omit<ButtonHTMLAttributes, keyof ButtonProps> & {
    /**
     * The button's content.
     */
    children?: VNodeChild;
  };

export interface EmptyProps {
  /**
   * Action buttons configuration for primary and secondary actions. <br />
   * Renders buttons in the order: secondary (left or only one), primary (right). <br />
   * If actions provided, children will be ignored. <br />
   */
  actions?:
    | {
        primaryButton?: EmptyActionButton;
        secondaryButton: EmptyActionButton;
      }
    | EmptyActionButton;
  /**
   * Optional description text displayed below the title.
   * Provides additional context or details about the empty state.
   */
  description?: string;
  /**
   * Custom pictogram element.
   */
  pictogram?: VNodeChild;
  /**
   * The size variant of the empty state.
   * Controls typography, spacing, and overall dimensions.
   * @default 'main'
   */
  size?: 'main' | 'sub' | 'minor';
  /**
   * The title text for the empty state.
   * This is the main heading that describes the state.
   */
  title: string;
  /**
   * The type of empty state, which determines the icon and color theme.
   * @default 'initial-data'
   */
  type?: 'initial-data' | 'result' | 'system' | 'notification' | 'custom';
}
