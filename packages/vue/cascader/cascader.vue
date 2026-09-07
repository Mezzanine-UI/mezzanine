<script setup lang="ts">
import { computed, inject, ref, useAttrs, watchEffect } from 'vue';
import type { ComponentPublicInstance, CSSProperties } from 'vue';
import { offset } from '@floating-ui/dom';
import type { Middleware } from '@floating-ui/dom';
import { cascaderClasses as classes } from '@mezzanine-ui/core/cascader';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import clsx from 'clsx';
import { formControlKey } from '../_internal/form-control';
import { resolveElement } from '../_internal/resolve-element';
import { useControlValueState } from '../_internal/use-control-value-state';
import { useDocumentEvents } from '../_internal/use-document-events';
import MznPopper from '../popper/popper.vue';
import MznSelectTrigger from '../select/select-trigger.vue';
import type { SelectTriggerInputProps } from '../select/select-trigger.types';
import type { SelectValue } from '../select/select.types';
import MznTooltip from '../tooltip/tooltip.vue';
import MznTranslate from '../transition/translate.vue';
import MznCascaderPanel from './cascader-panel.vue';
import type { CascaderOption, CascaderProps } from './cascader.types';

/**
 * 階層選擇器：一次展開一層，選到葉節點才算選完。
 *
 * 面板是一欄一欄往右長的，點到有子項的選項就再開一欄，點到葉節點才發出
 * `change` 並收起來。鍵盤上下移動、右鍵或 Enter 進入下一層、左鍵回上一層。
 * 選到的路徑以「甲 / 乙 / 丙」顯示，寬度不夠時中間折成「...」並用 tooltip 補完。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznCascader } from '@mezzanine-ui/vue/cascader';
 * <\/script>
 *
 * <template>
 *   <MznCascader :options="options" placeholder="國家 / 城市 / 區域" @change="onChange" />
 * </template>
 * ```
 *
 * @see MznCascaderPanel 單一欄的面板
 */
const props = withDefaults(defineProps<CascaderProps>(), {
  clearable: false,
  defaultValue: undefined,
  disabled: undefined,
  dropdownZIndex: undefined,
  error: undefined,
  fullWidth: undefined,
  globalPortal: true,
  menuMaxHeight: undefined,
  placeholder: '',
  readOnly: false,
  required: undefined,
  size: undefined,
  value: undefined,
});

const emit = defineEmits<{
  /** Fired when the dropdown is closed. */
  blur: [];
  /** Fired when the final leaf option is selected. */
  change: [value: CascaderOption[]];
  /** Fired when the dropdown is opened. */
  focus: [];
}>();

/**
 * React's Cascader takes no native props at all, so nothing a consumer writes
 * beyond `className` reaches the DOM — and the class it does take goes to the
 * trigger rather than to the host.
 */
defineOptions({ inheritAttrs: false });

const attrs = useAttrs();

const formControl = inject(formControlKey, undefined);

const disabled = computed(
  (): boolean => props.disabled ?? formControl?.value.disabled ?? false,
);
const error = computed(
  (): boolean => props.error ?? formControl?.value.severity === 'error',
);
const fullWidth = computed(
  (): boolean => props.fullWidth ?? formControl?.value.fullWidth ?? false,
);
const required = computed(
  (): boolean => props.required ?? formControl?.value.required ?? false,
);

const open = ref(false);
const activePath = ref<CascaderOption[]>([]);
const keyboardFocusedIndex = ref(-1);
const isOverflowing = ref(false);

const { setValue, value } = useControlValueState<CascaderOption[]>({
  defaultValue: props.defaultValue ?? [],
  value: () => props.value,
});

const anchor = ref<ComponentPublicInstance | null>(null);
const dropdown = ref<HTMLDivElement | null>(null);
const measure = ref<HTMLSpanElement | null>(null);

const anchorElement = computed((): HTMLElement | null =>
  resolveElement(anchor.value),
);

/**
 * The value may name options without their `children`, so the path is walked
 * back out of the tree to get the ones that can actually expand a panel.
 */
function resolveActivePath(
  options: CascaderOption[],
  selected: CascaderOption[],
): CascaderOption[] {
  const result: CascaderOption[] = [];
  let currentOptions = options;

  for (const selectedItem of selected) {
    const found = currentOptions.find((o) => o.id === selectedItem.id);

    if (!found) break;

    result.push(found);

    if (found.children && found.children.length > 0) {
      currentOptions = found.children;
    } else {
      break;
    }
  }

  return result;
}

function handleOpen(): void {
  if (props.readOnly || disabled.value) return;

  activePath.value = resolveActivePath(props.options, value.value);
  emit('focus');
  open.value = true;
}

function handleClose(): void {
  emit('blur');
  open.value = false;
  keyboardFocusedIndex.value = -1;
}

function handleClear(event: MouseEvent): void {
  event.stopPropagation();
  setValue([]);
  emit('change', []);

  if (open.value) handleClose();
}

function handleItemSelect(
  panelIndex: number,
  option: CascaderOption,
  isLeaf: boolean,
): void {
  const newActivePath = [...activePath.value.slice(0, panelIndex), option];

  activePath.value = newActivePath;

  if (isLeaf) {
    setValue(newActivePath);
    emit('change', newActivePath);
    handleClose();
  } else {
    keyboardFocusedIndex.value = -1;
  }
}

const panels = computed((): CascaderOption[][] => {
  const result: CascaderOption[][] = [props.options];

  for (const activeOption of activePath.value) {
    if (activeOption.children && activeOption.children.length > 0) {
      result.push(activeOption.children);
    } else {
      break;
    }
  }

  return result;
});

useDocumentEvents(() => {
  if (!open.value) return undefined;

  const handleClickAway = (event: MouseEvent | TouchEvent): void => {
    const target = event.target as HTMLElement | null;

    if (!target) return;

    if (
      anchorElement.value?.contains(target) ||
      dropdown.value?.contains(target)
    ) {
      return;
    }

    handleClose();
  };

  return { click: handleClickAway, touchend: handleClickAway };
});

useDocumentEvents(() => {
  if (!open.value) return undefined;

  const currentPanelOptions = panels.value[panels.value.length - 1];

  return {
    keydown(event: KeyboardEvent) {
      switch (event.key) {
        case 'Escape': {
          event.preventDefault();
          handleClose();
          break;
        }

        case 'ArrowDown': {
          event.preventDefault();

          let next = keyboardFocusedIndex.value + 1;

          while (
            next < currentPanelOptions.length &&
            currentPanelOptions[next].disabled
          ) {
            next += 1;
          }

          if (next < currentPanelOptions.length) {
            keyboardFocusedIndex.value = next;
          }

          break;
        }

        case 'ArrowUp': {
          event.preventDefault();

          let prev =
            keyboardFocusedIndex.value === -1
              ? currentPanelOptions.length - 1
              : keyboardFocusedIndex.value - 1;

          while (prev >= 0 && currentPanelOptions[prev].disabled) {
            prev -= 1;
          }

          if (prev >= 0) {
            keyboardFocusedIndex.value = prev;
          }

          break;
        }

        case 'ArrowRight':
        case 'Enter':
        case ' ': {
          if (keyboardFocusedIndex.value === -1) return;

          const focusedOption = currentPanelOptions[keyboardFocusedIndex.value];

          if (!focusedOption || focusedOption.disabled) return;

          const isLeaf =
            !focusedOption.children || focusedOption.children.length === 0;

          if (event.key === 'ArrowRight' && isLeaf) return;

          event.preventDefault();
          handleItemSelect(panels.value.length - 1, focusedOption, isLeaf);
          break;
        }

        case 'ArrowLeft': {
          event.preventDefault();

          if (activePath.value.length === 0) return;

          const removedItem = activePath.value[activePath.value.length - 1];
          const parentPanel = panels.value[activePath.value.length - 1];
          const index = parentPanel.findIndex((o) => o.id === removedItem.id);

          activePath.value = activePath.value.slice(0, -1);
          keyboardFocusedIndex.value = index >= 0 ? index : -1;
          break;
        }
      }
    },
  };
});

const displayPath = computed((): CascaderOption[] =>
  open.value ? activePath.value : value.value,
);

const displayString = computed((): string =>
  displayPath.value.map((o) => o.name).join(' / '),
);

const shouldCollapse = computed(
  (): boolean =>
    !open.value && displayPath.value.length >= 3 && isOverflowing.value,
);

const collapsedDisplayString = computed((): string =>
  shouldCollapse.value
    ? `${displayPath.value[0].name} / ... / ${displayPath.value[displayPath.value.length - 1].name}`
    : displayString.value,
);

/**
 * The hidden span carries the full path at the input's own font, so its width
 * says whether the real one would overflow.
 */
watchEffect(
  (onCleanup) => {
    if (open.value || displayPath.value.length < 3) {
      isOverflowing.value = false;

      return;
    }

    const host = anchorElement.value;

    if (!host) return;

    // Read so the effect re-runs when the text changes.
    void displayString.value;

    const check = (): void => {
      const inputElement = host.querySelector('input');
      const measureElement = measure.value;

      if (!inputElement || !measureElement) return;

      measureElement.style.font = getComputedStyle(inputElement).font;
      isOverflowing.value =
        measureElement.offsetWidth > inputElement.clientWidth;
    };

    check();

    const observer = new ResizeObserver(check);

    observer.observe(host);

    onCleanup(() => observer.disconnect());
  },
  { flush: 'post' },
);

const triggerValue = computed((): SelectValue | undefined =>
  displayPath.value.length === 0
    ? undefined
    : { id: 'cascader-value', name: collapsedDisplayString.value },
);

const isPartial = computed(
  (): boolean =>
    open.value &&
    activePath.value.length > 0 &&
    Boolean(activePath.value[activePath.value.length - 1]?.children?.length),
);

const zIndexMiddleware = computed(
  (): Middleware => ({
    name: 'zIndex',
    fn: ({ elements }) => {
      const raw = props.dropdownZIndex ?? 1;
      const zIndex = typeof raw === 'number' ? raw : parseInt(raw, 10) || raw;

      Object.assign(elements.floating.style, { zIndex });

      return {};
    },
  }),
);

const offsetMiddleware = offset({ mainAxis: 4 });

const popperOptions = computed(() => ({
  middleware: [offsetMiddleware, zIndexMiddleware.value],
  placement: 'bottom-start' as const,
}));

const TRANSLATE_PROPS = {
  duration: {
    enter: MOTION_DURATION.moderate,
    exit: MOTION_DURATION.moderate,
  },
  easing: {
    enter: MOTION_EASING.standard,
    exit: MOTION_EASING.standard,
  },
};

const TOOLTIP_OPTIONS = { placement: 'bottom-start' as const };

const measureStyle: CSSProperties = {
  pointerEvents: 'none',
  position: 'absolute',
  visibility: 'hidden',
  whiteSpace: 'nowrap',
};

const hostClasses = computed((): string =>
  clsx(classes.host, fullWidth.value && classes.hostFullWidth),
);

const triggerClasses = computed((): string =>
  clsx(attrs.class as string, isPartial.value && classes.triggerPartial),
);

const inputProps = computed(
  (): SelectTriggerInputProps => ({
    onKeydown: (event: KeyboardEvent) => {
      if (!open.value && (event.key === ' ' || event.key === 'Enter')) {
        event.preventDefault();
        handleOpen();
      }
    },
    title: shouldCollapse.value ? displayString.value : undefined,
  }),
);

const tooltipTitle = computed((): string | undefined =>
  shouldCollapse.value ? displayString.value : undefined,
);

const isForceClearable = computed(
  (): boolean =>
    props.clearable &&
    !disabled.value &&
    !props.readOnly &&
    value.value.length > 0,
);

function focusedIdOf(panelIndex: number): string | undefined {
  return panelIndex === panels.value.length - 1 &&
    keyboardFocusedIndex.value >= 0
    ? panels.value[panelIndex][keyboardFocusedIndex.value]?.id
    : undefined;
}

function selectedIdOf(panelIndex: number): string | undefined {
  return value.value.length > 0 && panelIndex === value.value.length - 1
    ? value.value[panelIndex]?.id
    : undefined;
}
</script>

<template>
  <div :class="hostClasses">
    <span ref="measure" aria-hidden="true" :style="measureStyle">
      {{ displayString }}
    </span>
    <MznPopper
      :anchor="anchorElement"
      :disable-portal="!globalPortal"
      :open="open"
      :options="popperOptions"
    >
      <TransitionGroup :css="false">
        <MznTranslate
          v-if="open"
          key="cascader-dropdown"
          v-bind="TRANSLATE_PROPS"
          from="bottom"
          in
        >
          <div>
            <div ref="dropdown" :class="classes.dropdownPanels">
              <MznCascaderPanel
                v-for="(panelOptions, panelIndex) in panels"
                :key="panelIndex"
                :active-id="activePath[panelIndex]?.id"
                :focused-id="focusedIdOf(panelIndex)"
                :max-height="menuMaxHeight"
                :options="panelOptions"
                :selected-id="selectedIdOf(panelIndex)"
                @select="
                  (option, isLeaf) =>
                    handleItemSelect(panelIndex, option, isLeaf)
                "
              />
            </div>
          </div>
        </MznTranslate>
      </TransitionGroup>
    </MznPopper>

    <MznTooltip :options="TOOLTIP_OPTIONS" :title="tooltipTitle">
      <template #default="trigger">
        <div
          :ref="trigger.ref"
          @mouseenter="trigger.onMouseenter"
          @mouseleave="trigger.onMouseleave"
        >
          <MznSelectTrigger
            ref="anchor"
            :active="open"
            :class="triggerClasses"
            :disabled="disabled"
            :full-width="fullWidth"
            :input-props="inputProps"
            :is-force-clearable="isForceClearable"
            mode="single"
            :placeholder="placeholder"
            :read-only="readOnly"
            :required="required"
            :size="size"
            :type="error ? 'error' : 'default'"
            :value="triggerValue"
            @clear="handleClear"
            @click="open ? handleClose() : handleOpen()"
          />
        </div>
      </template>
    </MznTooltip>
  </div>
</template>
