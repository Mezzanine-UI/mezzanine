import { cloneVNode, h, isVNode } from 'vue';
import type { VNode, VNodeArrayChildren, VNodeChild } from 'vue';
import { contentHeaderClasses } from '@mezzanine-ui/core/content-header';
import { ChevronLeftIcon } from '@mezzanine-ui/icons';
import { flattenChildren } from '../_internal/flatten-children';
import MznButton from '../button/button.vue';
import type { ButtonProps } from '../button/button.types';
import MznCheckbox from '../checkbox/checkbox.vue';
import MznDropdown from '../dropdown/dropdown.vue';
import MznInput from '../input/input.vue';
import MznSelect from '../select/select.vue';
import MznToggle from '../toggle/toggle.vue';
import MznContentHeaderResponsive from './content-header-responsive.vue';
import type {
  ContentHeaderAction,
  ContentHeaderFilter,
  ContentHeaderUtility,
} from './content-header.types';

type ContentHeaderSize = 'main' | 'sub';

type AnyProps = Record<string, unknown>;

const propsOf = (vnode: VNode): AnyProps => (vnode.props ?? {}) as AnyProps;

const slotsOf = (vnode: VNode): { default?: (...args: never[]) => unknown } =>
  (vnode.children ?? {}) as { default?: (...args: never[]) => unknown };

/**
 * A slot normally hands back an array, but one written as a bare `h(...)`
 * hands back the node itself. React's `flattenChildren` takes either.
 */
const toChildren = (value: unknown): VNodeArrayChildren => {
  if (Array.isArray(value)) return value as VNodeArrayChildren;

  return value == null ? [] : [value as VNodeChild];
};

/**
 * Renders a button from either an action object or an existing node, applying
 * the size the header runs at.
 */
export function renderButton(
  button: ContentHeaderAction | VNode | undefined,
  size: ContentHeaderSize,
  key?: string,
): VNodeChild {
  if (!button) {
    return null;
  }

  if (isVNode(button)) {
    return cloneVNode(button, {
      key: button.key ?? key,
      size,
      type: 'button',
    });
  }

  const { children, ...rest } = button;
  const props = rest as AnyProps;

  return h(
    MznButton,
    { ...props, key: key ?? (props.title as string), size, type: 'button' },
    () => children,
  );
}

const withSize = (target: VNode, size: ContentHeaderSize): VNode =>
  cloneVNode(target, { size });

export function renderFilterProp(
  filter: ContentHeaderFilter | undefined,
  size: ContentHeaderSize,
): VNodeChild {
  if (!filter) {
    return null;
  }

  const { variant } = filter as { variant: string };
  const rest = filter as AnyProps;

  if ('size' in rest) {
    console.warn(
      '[Mezzanine][ContentHeader]: size in ContentHeader filter is forced to match ContentHeader size.',
    );
  }

  if (variant === 'search') {
    return h(MznInput, { ...rest, size, variant: 'search' });
  }

  if (variant === 'select') {
    return h(MznSelect, { ...rest, size });
  }

  if (variant === 'segmentedControl') {
    console.warn('SegmentedControl component is not implemented yet.');

    return null;
  }

  if (variant === 'toggle') {
    return h(MznToggle, { ...rest, size });
  }

  if (variant === 'checkbox') {
    return h(MznCheckbox, { ...rest });
  }

  return null;
}

export function renderIconButtonWithProps(
  child: VNode,
  size: ContentHeaderSize,
  key?: string,
): VNode {
  const { icon } = propsOf(child);

  return cloneVNode(child, {
    icon,
    iconType: 'icon-only',
    key: child.key ?? key,
    size,
    type: 'button',
    variant: 'base-secondary',
  });
}

/**
 * The trigger props Vue's dropdown hands to its slot, merged onto the icon
 * button the utility carries. React's dropdown clones its child to inject the
 * same thing.
 */
const dropdownTrigger =
  (trigger: VNode, size: ContentHeaderSize) =>
  (triggerProps: AnyProps): VNodeChild =>
    cloneVNode(trigger, {
      ...triggerProps,
      iconType: 'icon-only',
      size,
      type: 'button',
      variant: 'base-secondary',
    });

export function renderIconButtonsProp(
  utilities: ContentHeaderUtility[] | undefined,
  size: ContentHeaderSize,
): VNodeChild[] {
  const result: VNodeChild[] = [];

  utilities?.forEach((utility, index) => {
    const props = utility as unknown as AnyProps;

    if (props instanceof Object && 'icon' in props) {
      result.push(
        h(MznButton as never, {
          ...props,
          iconType: 'icon-only',
          key:
            (props.id as string) ??
            (props['aria-label'] as string) ??
            `utility-${index}`,
          size,
          type: 'button',
          variant: 'base-secondary',
        }),
      );
    }

    if (props instanceof Object && 'options' in props) {
      const trigger = props.children as VNode | undefined;

      if (!trigger || !isVNode(trigger) || trigger.type !== MznButton) {
        console.warn(
          '[Mezzanine][ContentHeader]: Dropdown in utilities should have Button with icon as its children.',
        );

        return;
      }

      const { children: _children, ...rest } = props;

      result.push(
        h(
          MznDropdown as never,
          { ...rest, key: (props.id as string) ?? `utility-dropdown-${index}` },
          { default: dropdownTrigger(trigger, size) },
        ),
      );
    }
  });

  return result;
}

const variantOrder: Record<string, number> = {
  'destructive-secondary': 0,
  'base-secondary': 1,
  'base-primary': 2,
  'base-tertiary': 0,
  'base-ghost': 0,
  'base-dashed': 0,
  'base-text-link': 0,
  'destructive-primary': 0,
  'destructive-ghost': 0,
  'destructive-text-link': 0,
  inverse: 0,
  'inverse-ghost': 0,
};

const isRenderableActionVariant = (
  variant: ButtonProps['variant'] | undefined,
): boolean =>
  variant === 'destructive-secondary' ||
  variant === 'base-secondary' ||
  variant === 'base-primary' ||
  variant === undefined;

/**
 * Renders action buttons from the actions configuration, dropping the variants
 * the header does not accept and putting the rest in their fixed order.
 */
export function renderActionsProp(
  actions: ContentHeaderAction[] | undefined,
  size: ContentHeaderSize,
): VNodeChild[] | null {
  if (!actions) {
    return null;
  }

  return actions
    .filter((action) => {
      if (isRenderableActionVariant(action.variant)) return true;

      console.warn(
        `[Mezzanine][ContentHeader]: Button with variant "${action.variant}" will not be rendered in ContentHeader actions.`,
      );

      return false;
    })
    .sort(
      (a, b) =>
        variantOrder[a.variant ?? 'base-primary'] -
        variantOrder[b.variant ?? 'base-primary'],
    )
    .map((action, index) => renderButton(action, size, `action-${index}`));
}

export interface ResolvedContentHeaderChildren {
  actions: VNodeChild[];
  backButton: VNodeChild | null;
  filter: VNodeChild | null;
  utilities: VNodeChild[];
}

/**
 * Sorts the default slot into the four places the header puts things, the way
 * React sorts its children: by which component each one is.
 */
export function resolveContentHeaderChild(
  children: VNodeArrayChildren | undefined,
  size: ContentHeaderSize,
  backButtonLabel: string,
): ResolvedContentHeaderChildren {
  let filter: VNodeChild | null = null;
  let backButton: VNodeChild | null = null;

  // [destructive-secondary[], base-secondary[], base-primary[]]
  const actionsWithOrder: [VNodeChild[], VNodeChild[], VNodeChild[]] = [
    [],
    [],
    [],
  ];
  const utilities: VNodeChild[] = [];

  const flatChildren = flattenChildren(toChildren(children));
  const responsiveChildren: VNode[] = [];

  flatChildren.forEach((child) => {
    if (child.type !== MznContentHeaderResponsive) {
      responsiveChildren.push(child);

      return;
    }

    const breakpointClass = contentHeaderClasses.breakpoint(
      propsOf(child).breakpoint as never,
    );
    const inner = toChildren(slotsOf(child).default?.());

    flattenChildren(inner).forEach((responsiveChild) => {
      responsiveChildren.push(
        cloneVNode(responsiveChild, { class: breakpointClass }),
      );
    });
  });

  responsiveChildren.forEach((child) => {
    const { type } = child;
    const props = propsOf(child);

    if (type === 'a' || props.href) {
      const chevron = h(MznButton as never, {
        'aria-label': backButtonLabel,
        component: 'span',
        icon: ChevronLeftIcon,
        iconType: 'icon-only',
        size: 'sub',
        type: 'button',
        variant: 'base-tertiary',
      });

      backButton =
        typeof type === 'string'
          ? h(type, props, [chevron])
          : h(type as never, props, { default: () => chevron });

      return;
    }

    const sizeProp = props.size;

    if (sizeProp !== undefined && sizeProp !== size) {
      console.warn(
        '[Mezzanine][ContentHeader]: Input, Button, Select size in ContentHeader utilities is forced to match ContentHeader size.',
      );
    }

    // is filter
    if (
      (type === MznInput && props.variant === 'search') ||
      type === MznSelect ||
      type === MznToggle
    ) {
      if (filter) {
        console.warn(
          '[Mezzanine][ContentHeader]: ContentHeader only accepts one filter component.',
        );
      }

      filter = withSize(child, size);
    } else if (String(type) === 'SegmentedControl') {
      console.warn('SegmentedControl component is not implemented yet.');
    } else if (type === MznCheckbox) {
      if (filter) {
        console.warn(
          '[Mezzanine][ContentHeader]: ContentHeader only accepts one filter component.',
        );
      }

      filter = child;
    } else if (
      // is utilities (icon button)
      (type === MznButton && props.iconType === 'icon-only') ||
      (type === MznButton && props.icon && !slotsOf(child).default)
    ) {
      utilities.push(renderIconButtonWithProps(child, size));
    } else if (type === MznDropdown) {
      const trigger = flattenChildren(
        toChildren(slotsOf(child).default?.()),
      )[0];

      if (!trigger || trigger.type !== MznButton) {
        console.warn(
          '[Mezzanine][ContentHeader]: Dropdown in utilities should have Button with icon as its children.',
        );

        return;
      }

      utilities.push(
        h(MznDropdown as never, props, {
          default: dropdownTrigger(trigger, size),
        }),
      );
    }
    // is actions (normal button)
    else if (type === MznButton) {
      const variant = props.variant as ButtonProps['variant'] | undefined;

      if (!isRenderableActionVariant(variant)) {
        console.warn(
          `[Mezzanine][ContentHeader]: Button with variant "${variant}" will not be rendered in ContentHeader actions.`,
        );

        return;
      }

      const buttonElement = renderButton(child, size);

      if (!buttonElement) {
        return;
      }

      if (variant === 'destructive-secondary') {
        actionsWithOrder[0].push(buttonElement);
      } else if (variant === 'base-secondary') {
        actionsWithOrder[1].push(buttonElement);
      } else {
        actionsWithOrder[2].push(buttonElement);
      }
    } else {
      console.warn(
        '[Mezzanine][ContentHeader]: ContentHeader only accepts Input (search variant), Select, SegmentedControl, Dropdown with Icon Button, or Button as children.',
      );
    }
  });

  return {
    actions: [
      ...actionsWithOrder[0],
      ...actionsWithOrder[1],
      ...actionsWithOrder[2],
    ],
    backButton,
    filter,
    utilities,
  };
}
