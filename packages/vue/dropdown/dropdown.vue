<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue';
import type {
  ComponentPublicInstance,
  VNode,
  VNodeArrayChildren,
  VNodeChild,
} from 'vue';
import {
  dropdownClasses,
  type DropdownOption,
} from '@mezzanine-ui/core/dropdown/dropdown';
import { isImeComposing } from '@mezzanine-ui/core/utils';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import {
  flip as flipMiddlewareFn,
  offset,
  shift as shiftMiddlewareFn,
  size,
  type Middleware,
} from '@floating-ui/dom';
import { flattenChildren } from '../_internal/flatten-children';
import { resolveElement } from '../_internal/resolve-element';
import MznButton from '../button/button.vue';
import MznPopper from '../popper/popper.vue';
import type { PopperPlacement } from '../popper/popper.types';
import MznTranslate from '../transition/translate.vue';
import type { TranslateFrom } from '../transition/translate.types';
import MznDropdownItem from './dropdown-item.vue';
import type { DropdownActionConfig } from './dropdown-action.types';
import type { DropdownProps, DropdownTriggerProps } from './dropdown.types';

/**
 * 下拉選單：以按鈕或輸入框作為觸發元素，展開一份可鍵盤操作的選項清單。
 *
 * 觸發元素由預設 slot 提供，slot 會拿到要展開在它身上的 aria 與事件；
 * `inputPosition="inside"` 時清單會就地展開並把觸發元素移到清單頂端。
 * 開關可受控（`open`）或不受控；`activeIndex` 同理，未受控時只有鍵盤會移動它。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznDropdown } from '@mezzanine-ui/vue/dropdown';
 * <\/script>
 *
 * <template>
 *   <MznDropdown :options="options" @select="onSelect">
 *     <template #default="triggerProps">
 *       <MznButton v-bind="triggerProps">請選擇</MznButton>
 *     </template>
 *   </MznDropdown>
 * </template>
 * ```
 *
 * @see MznDropdownItem 清單本體
 * @see MznDropdownItemCard 單一選項列
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DropdownProps>(), {
  actionCancelText: undefined,
  actionClearText: undefined,
  actionConfirmText: undefined,
  actionCustomButtonProps: undefined,
  actionText: undefined,
  activeIndex: undefined,
  customWidth: undefined,
  disabled: false,
  emptyIcon: undefined,
  emptyText: undefined,
  flip: false,
  followText: undefined,
  globalPortal: true,
  id: undefined,
  inputPosition: 'outside',
  isMatchInputValue: false,
  keyboardActiveIndex: undefined,
  listboxId: undefined,
  listboxLabel: undefined,
  loadingPosition: 'full',
  loadingText: undefined,
  maxHeight: undefined,
  minWidth: undefined,
  mode: undefined,
  open: undefined,
  options: () => [],
  placement: 'bottom-start',
  sameWidth: false,
  scrollbarDefer: undefined,
  scrollbarDisabled: undefined,
  scrollbarMaxWidth: undefined,
  scrollbarOptions: undefined,
  shift: false,
  showActionShowTopBar: undefined,
  showDropdownActions: false,
  status: undefined,
  toggleCheckedOnClick: undefined,
  type: 'default',
  value: undefined,
  zIndex: undefined,
});

const emit = defineEmits<{
  actionCancel: [];
  actionClear: [];
  actionConfirm: [];
  actionCustom: [];
  close: [];
  itemHover: [index: number];
  leaveBottom: [];
  open: [];
  reachBottom: [];
  scroll: [
    computed: { maxScrollTop: number; scrollTop: number },
    target: HTMLDivElement,
  ];
  select: [option: DropdownOption];
  visibilityChange: [open: boolean];
}>();

const slots = defineSlots<{
  /**
   * The trigger. Spread the payload onto the button or input that opens the
   * dropdown.
   */
  default?: (props: DropdownTriggerProps) => unknown;
}>();

const isInline = computed((): boolean => props.inputPosition === 'inside');
const inputId = useId();
const listboxId = computed(
  (): string => props.listboxId ?? `${inputId}-listbox`,
);

const container = ref<HTMLDivElement | null>(null);
const anchor = ref<HTMLElement | null>(null);
const popper = ref<InstanceType<typeof MznPopper> | null>(null);

const uncontrolledOpen = ref(false);
const isOpenControlled = computed((): boolean => props.open !== undefined);
const isOpen = computed((): boolean =>
  isOpenControlled.value ? Boolean(props.open) : uncontrolledOpen.value,
);

const uncontrolledActiveIndex = ref<number | null>(props.activeIndex ?? null);
const isActiveIndexControlled = computed(
  (): boolean => props.activeIndex !== undefined,
);
const mergedActiveIndex = computed((): number | null =>
  isActiveIndexControlled.value
    ? (props.activeIndex ?? null)
    : uncontrolledActiveIndex.value,
);
// For keyboard-only visual focus. When not externally controlled,
// `uncontrolledActiveIndex` is already set only by keyboard (never by hover).
const mergedKeyboardActiveIndex = computed((): number | null =>
  props.keyboardActiveIndex !== undefined
    ? props.keyboardActiveIndex
    : uncontrolledActiveIndex.value,
);

// Expansion state for tree type (lifted here so keyboard nav can track visible options)
const expandedNodes = ref<Set<string>>(new Set());

function handleToggleExpand(optionId: string): void {
  const next = new Set(expandedNodes.value);

  if (next.has(optionId)) {
    next.delete(optionId);
  } else {
    next.add(optionId);
  }

  expandedNodes.value = next;
}

// Flat list of navigable options, respecting tree expansion state
const flatNavigableOptions = computed((): DropdownOption[] => {
  const options = props.options;

  if (props.type === 'grouped') {
    return options.flatMap((group) => group.children ?? []);
  }

  if (props.type === 'tree') {
    const flatten = (items: DropdownOption[]): DropdownOption[] =>
      items.flatMap((item) =>
        item.children?.length && expandedNodes.value.has(item.id)
          ? [item, ...flatten(item.children)]
          : [item],
      );

    return flatten(options);
  }

  return options;
});

const ariaActivedescendant = computed((): string | undefined =>
  mergedActiveIndex.value !== null && mergedActiveIndex.value >= 0
    ? `${listboxId.value}-option-${mergedActiveIndex.value}`
    : undefined,
);

const actionConfig = computed(
  (): DropdownActionConfig => ({
    actionText: props.actionText,
    cancelText: props.actionCancelText,
    clearText: props.actionClearText,
    confirmText: props.actionConfirmText,
    customActionButtonProps: props.actionCustomButtonProps,
    showActions: props.showDropdownActions,
    showTopBar: props.showActionShowTopBar,
    onCancel: () => emit('actionCancel'),
    onClear: () => emit('actionClear'),
    onClick: () => emit('actionCustom'),
    onConfirm: () => emit('actionConfirm'),
  }),
);

const translateProps = {
  duration: {
    enter: MOTION_DURATION.moderate,
    exit: MOTION_DURATION.moderate,
  },
  easing: {
    enter: MOTION_EASING.standard,
    exit: MOTION_EASING.standard,
  },
};

/** The trigger's own vnode, so its props can be read the way React reads them. */
function triggerVNode(): VNode | undefined {
  return flattenChildren(
    (slots.default?.(triggerProps()) ?? []) as VNodeArrayChildren,
  )[0];
}

const followText = computed((): string | undefined => {
  // If followText is explicitly provided, use it
  if (props.followText !== undefined) {
    return props.followText != null ? String(props.followText) : undefined;
  }

  const child = triggerVNode();

  if (!child || child.type === MznButton) return undefined;
  if (!props.isMatchInputValue) return undefined;

  // Try to get value from the trigger's props
  const childProps = child.props as {
    defaultValue?: unknown;
    value?: unknown;
  } | null;
  const inputValue = childProps?.value ?? childProps?.defaultValue ?? '';

  return inputValue != null ? String(inputValue) : undefined;
});

const popoverPlacement = computed(
  (): PopperPlacement =>
    props.inputPosition === 'outside' ? props.placement : 'bottom',
);

// Tracks the placement actually resolved by floating-ui. Only meaningful when
// `flip` is enabled, where it may differ from `popoverPlacement` after a flip.
const resolvedPlacement = ref<PopperPlacement>(popoverPlacement.value);

const middleware = computed((): Middleware[] => {
  const result: Middleware[] = [offset({ mainAxis: 4 })];

  const flipMiddleware = props.flip
    ? // Main-axis flip only, aligned with `MznInputTriggerPopper`.
      flipMiddlewareFn({ fallbackAxisSideDirection: 'end', padding: 8 })
    : null;
  const shiftMiddleware = props.shift
    ? shiftMiddlewareFn({ padding: 8 })
    : null;

  // flip and shift interfere with each other, so order them the way
  // floating-ui recommends: https://floating-ui.com/docs/flip#combining-with-shift
  if (flipMiddleware && shiftMiddleware) {
    result.push(
      ...(popoverPlacement.value.includes('-')
        ? [flipMiddleware, shiftMiddleware]
        : [shiftMiddleware, flipMiddleware]),
    );
  } else if (flipMiddleware) {
    result.push(flipMiddleware);
  } else if (shiftMiddleware) {
    result.push(shiftMiddleware);
  }

  // Only apply a z-index when one was asked for: without it the portal's
  // contents stack by DOM order, so a Modal opened from a Dropdown always wins.
  if (props.zIndex !== undefined && props.zIndex !== null) {
    const zIndexValue =
      typeof props.zIndex === 'number'
        ? props.zIndex
        : parseInt(props.zIndex, 10) || props.zIndex;

    result.push({
      name: 'zIndex',
      fn: ({ elements }) => {
        Object.assign(elements.floating.style, { zIndex: zIndexValue });

        return {};
      },
    });
  }

  if (props.customWidth) {
    const widthValue =
      typeof props.customWidth === 'number'
        ? `${props.customWidth}px`
        : props.customWidth;

    result.push({
      name: 'customWidth',
      fn: ({ elements }) => {
        Object.assign(elements.floating.style, { width: widthValue });

        return {};
      },
    });
  } else if (props.sameWidth) {
    result.push(
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
      }),
    );
  }

  return result;
});

const translateFrom = computed((): TranslateFrom => {
  if (isInline.value) return 'bottom';

  // With flip on, follow the placement floating-ui resolved so the enter
  // transition slides from the correct side.
  const placementBase = (
    props.flip ? resolvedPlacement.value : popoverPlacement.value
  ).split('-')[0];

  return placementBase === 'top' ? 'top' : 'bottom';
});

function setOpen(next: boolean): void {
  if (!isOpenControlled.value) {
    uncontrolledOpen.value = next;
  }

  emit('visibilityChange', next);
}

watch(isOpen, (open) => {
  if (open) {
    emit('open');
  } else {
    emit('close');
  }
});

// Reset active index when dropdown closes (uncontrolled only)
watch(isOpen, (open) => {
  if (!open && !isActiveIndexControlled.value) {
    uncontrolledActiveIndex.value = null;
  }
});

// Scroll the active option into view whenever activeIndex changes
watch([mergedActiveIndex, isOpen], ([index, open]) => {
  if (!open || index === null) return;

  requestAnimationFrame(() => {
    document
      .getElementById(`${listboxId.value}-option-${index}`)
      ?.scrollIntoView({ block: 'nearest' });
  });
});

// Built-in keyboard navigation (only when activeIndex is not controlled externally)
function handleBuiltinKeyDown(event: KeyboardEvent): void {
  if (isImeComposing(event) || isActiveIndexControlled.value) return;

  const count = flatNavigableOptions.value.length;

  if (!isOpen.value) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
    }

    return;
  }

  if (count === 0) return;

  switch (event.key) {
    case 'ArrowDown': {
      event.preventDefault();

      const prev = uncontrolledActiveIndex.value;

      uncontrolledActiveIndex.value = prev === null ? 0 : (prev + 1) % count;
      break;
    }

    case 'ArrowUp': {
      event.preventDefault();

      const prev = uncontrolledActiveIndex.value;

      uncontrolledActiveIndex.value =
        prev === null ? count - 1 : (prev - 1 + count) % count;
      break;
    }

    case 'Enter': {
      if (mergedActiveIndex.value === null || mergedActiveIndex.value < 0) {
        break;
      }

      const activeOption = flatNavigableOptions.value[mergedActiveIndex.value];

      if (!activeOption) break;

      event.preventDefault();

      if (props.type === 'tree' && activeOption.children?.length) {
        handleToggleExpand(activeOption.id);
      } else {
        emit('select', activeOption);

        if (props.mode !== 'multiple') {
          setOpen(false);
        }
      }

      break;
    }

    case 'Escape': {
      event.preventDefault();
      setOpen(false);
      break;
    }

    default:
      break;
  }
}

const setAnchor = (element: Element | ComponentPublicInstance | null): void => {
  anchor.value = resolveElement(element);
};

/** The aria and event props the trigger has to carry. */
function triggerProps(): DropdownTriggerProps {
  const isButtonTrigger = triggerType === MznButton;
  const combobox = isButtonTrigger
    ? {
        // Button trigger: expose listbox ARIA so screen readers can navigate
        'aria-activedescendant': ariaActivedescendant.value,
        'aria-controls': listboxId.value,
        'aria-expanded': isOpen.value,
        'aria-haspopup': 'listbox' as const,
      }
    : {
        'aria-activedescendant': ariaActivedescendant.value,
        'aria-autocomplete': props.isMatchInputValue
          ? ('list' as const)
          : undefined,
        'aria-controls': listboxId.value,
        'aria-expanded': isOpen.value,
        'aria-haspopup': 'listbox' as const,
        role: 'combobox' as const,
      };

  if (isInline.value) {
    return {
      ...combobox,
      onBlur: (event: FocusEvent) => {
        // When open is controlled, don't automatically close on blur
        if (isOpenControlled.value) return;

        const nextFocusTarget = event?.relatedTarget as HTMLElement | null;

        if (
          container.value &&
          nextFocusTarget &&
          container.value.contains(nextFocusTarget)
        ) {
          return;
        }

        setOpen(false);
      },
      onClick: () => setOpen(true),
      onFocus: () => setOpen(true),
      onKeydown: handleBuiltinKeyDown,
      ref: () => {},
    };
  }

  return {
    ...combobox,
    onClick: () => setOpen(!isOpen.value),
    onKeydown: handleBuiltinKeyDown,
    ref: setAnchor,
  };
}

/**
 * Read once per render, the way React compares `children.type` to Button.
 */
let triggerType: unknown = undefined;

watch(
  () => slots.default,
  () => {
    triggerType = flattenChildren(
      (slots.default?.(triggerProps()) ?? []) as VNodeArrayChildren,
    )[0]?.type;
  },
  { immediate: true },
);

const baseDropdownItemProps = computed(() => ({
  actionConfig: actionConfig.value,
  activeIndex: mergedActiveIndex.value,
  disabled: props.disabled,
  emptyIcon: props.emptyIcon,
  emptyText: props.emptyText,
  expandedNodes: expandedNodes.value,
  followText: followText.value,
  keyboardActiveIndex: mergedKeyboardActiveIndex.value,
  listboxId: listboxId.value,
  listboxLabel: props.listboxLabel,
  loadingPosition: props.loadingPosition,
  loadingText: props.loadingText,
  maxHeight: props.maxHeight,
  minWidth: props.minWidth,
  mode: props.mode,
  options: props.options,
  sameWidth: props.sameWidth,
  scrollbarDefer: props.scrollbarDefer,
  scrollbarDisabled: props.scrollbarDisabled,
  scrollbarMaxWidth: props.scrollbarMaxWidth,
  scrollbarOptions: props.scrollbarOptions,
  status: props.status,
  toggleCheckedOnClick: props.toggleCheckedOnClick,
  type: props.type,
  value: props.value,
}));

function handleClickAway(event: MouseEvent | TouchEvent): void {
  if (!isOpen.value) return;

  const target = event.target as HTMLElement | null;

  if (!target) return;

  if (isInline.value) {
    if (container.value && !container.value.contains(target)) {
      setOpen(false);
    }

    return;
  }

  const popperElement = popper.value?.controllerRef.elements.floating
    .value as HTMLElement | null;

  if (
    anchor.value &&
    popperElement &&
    !anchor.value.contains(target) &&
    !popperElement.contains(target)
  ) {
    setOpen(false);
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickAway, false);
  document.addEventListener('touchend', handleClickAway, false);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickAway, false);
  document.removeEventListener('touchend', handleClickAway, false);
});

function inlineHeaderContent(): VNodeChild {
  return slots.default?.(triggerProps()) as VNodeChild;
}

const rootClasses = computed(
  (): string =>
    `${dropdownClasses.root} ${dropdownClasses.inputPosition(props.inputPosition)}`,
);

const popperWithPortalClass = dropdownClasses.popperWithPortal;
</script>

<template>
  <div ref="container" :class="rootClasses" :id="id">
    <template v-if="isInline">
      <MznTranslate v-bind="translateProps" :from="translateFrom" :in="!isOpen">
        <div><slot v-bind="triggerProps()" /></div>
      </MznTranslate>
      <MznTranslate v-bind="translateProps" :from="translateFrom" :in="isOpen">
        <div>
          <MznDropdownItem
            v-bind="baseDropdownItemProps"
            :header-content="inlineHeaderContent()"
            @hover="emit('itemHover', $event)"
            @leave-bottom="emit('leaveBottom')"
            @reach-bottom="emit('reachBottom')"
            @scroll="
              (computedScroll, target) => emit('scroll', computedScroll, target)
            "
            @select="emit('select', $event)"
            @toggle-expand="handleToggleExpand"
          />
        </div>
      </MznTranslate>
    </template>
    <MznPopper
      v-else
      ref="popper"
      :anchor="() => anchor"
      :class="popperWithPortalClass"
      :disable-portal="!globalPortal"
      :open="isOpen"
      :options="{ middleware, placement: popoverPlacement }"
      @placement-change="resolvedPlacement = $event"
    >
      <MznTranslate v-bind="translateProps" :from="translateFrom" :in="isOpen">
        <div>
          <MznDropdownItem
            v-bind="baseDropdownItemProps"
            @hover="emit('itemHover', $event)"
            @leave-bottom="emit('leaveBottom')"
            @reach-bottom="emit('reachBottom')"
            @scroll="
              (computedScroll, target) => emit('scroll', computedScroll, target)
            "
            @select="emit('select', $event)"
            @toggle-expand="handleToggleExpand"
          />
        </div>
      </MznTranslate>
    </MznPopper>
    <slot v-if="!isInline" v-bind="triggerProps()" />
  </div>
</template>
