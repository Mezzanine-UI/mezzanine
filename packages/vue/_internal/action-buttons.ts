import { h, isVNode } from 'vue';
import type { ButtonHTMLAttributes, VNode, VNodeChild } from 'vue';
import MznButton from '../button/button.vue';
import type { ButtonProps } from '../button/button.types';

/**
 * A button described as data rather than markup.
 *
 * React's `ButtonProps` reaches native button props through its polymorphic
 * factory, and carries the label in `children`. Vue's `ButtonProps` holds only
 * the component's own props — everything else is a fallthrough attribute — so
 * the native half is added back here, and `children` becomes the default slot.
 */
export type ActionButtonData = ButtonProps &
  Omit<ButtonHTMLAttributes, keyof ButtonProps> & {
    /**
     * The button's content.
     */
    children?: VNodeChild;
  };

export type ActionButtons =
  | {
      primaryButton?: ActionButtonData;
      secondaryButton: ActionButtonData;
    }
  | ActionButtonData;

export interface ResolveActionButtonsOptions {
  actions?: ActionButtons;
  /**
   * The default slot's children, already flattened.
   */
  children: VNode[];
  /**
   * Named in the warnings, so they read like React's.
   */
  componentName: string;
  size: ButtonProps['size'];
}

/**
 * A plain object becomes a Button; an already-rendered Button is cloned with
 * the size and variant its container decides.
 */
function renderButtonOrElement(
  button: ActionButtonData | VNode | undefined,
  size: ButtonProps['size'],
  variant: 'base-primary' | 'base-secondary',
): VNodeChild {
  if (!button) return null;

  if (isVNode(button)) return h(button, { size, variant });

  const { children, ...rest } = button;

  return h(MznButton, { ...rest, size, variant }, () => children);
}

/**
 * The action buttons for Empty and ResultState, which describe them the same
 * way: an `actions` object, or up to two Buttons in the default slot, the
 * first secondary and the second primary. `actions` wins.
 *
 * React writes this out separately in each component; here it is one
 * implementation, since the rendered result is identical.
 */
export function resolveActionButtons(
  options: ResolveActionButtonsOptions,
): VNodeChild[] | null {
  const { actions, children, componentName, size } = options;

  if (actions) {
    if ('secondaryButton' in actions) {
      return [
        renderButtonOrElement(actions.secondaryButton, size, 'base-secondary'),
        renderButtonOrElement(actions.primaryButton, size, 'base-primary'),
      ];
    }

    return [renderButtonOrElement(actions, size, 'base-secondary')];
  }

  if (children.length === 0) return null;

  return children.map((child, index) => {
    if (child.type !== MznButton) {
      console.warn(
        `Only Button components are allowed as children of ${componentName}.`,
      );

      return null;
    }

    if (index === 0) {
      return renderButtonOrElement(child, size, 'base-secondary');
    }

    if (index === 1) return renderButtonOrElement(child, size, 'base-primary');

    console.warn(
      `Only up to two Button components are allowed as children of ${componentName}.`,
    );

    return null;
  });
}
