<script setup lang="ts">
import { computed, h, isVNode, useAttrs, useSlots } from 'vue';
import type { FunctionalComponent, VNode, VNodeChild } from 'vue';
import { emptyClasses as classes } from '@mezzanine-ui/core/empty';
import {
  BoxIcon,
  FolderOpenIcon,
  NotificationIcon,
  SystemIcon,
} from '@mezzanine-ui/icons';
import type { IconDefinition } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { flattenChildren } from '../_internal/flatten-children';
import MznButton from '../button/button.vue';
import MznButtonGroup from '../button/button-group.vue';
import MznIcon from '../icon/icon.vue';
import type { ButtonProps } from '../button/button.types';
import type { EmptyActionButton } from './empty.types';
import EmptyMainInitialDataIcon from './icons/empty-main-initial-data-icon.vue';
import EmptyMainNotificationIcon from './icons/empty-main-notification-icon.vue';
import EmptyMainResultIcon from './icons/empty-main-result-icon.vue';
import EmptyMainSystemIcon from './icons/empty-main-system-icon.vue';
import type { EmptyProps } from './empty.types';

/**
 * 空狀態元件，用於清單無資料、查無結果等情境。
 *
 * `type` 決定圖示與色調，`size` 為 `main` 時使用大型插畫、`sub` 與 `minor` 使用
 * 一般圖示。動作按鈕可用 `actions` 設定物件，或直接把 MznButton 放進預設 slot ——
 * 兩者同時存在時 `actions` 優先。第一顆按鈕視為次要、第二顆為主要。
 * `size="minor"` 不顯示 description 與動作。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznButton } from '@mezzanine-ui/vue/button';
 * import { MznEmpty } from '@mezzanine-ui/vue/empty';
 * <\/script>
 *
 * <template>
 *   <MznEmpty title="查無資料" description="請調整搜尋條件後再試一次" />
 *
 *   <MznEmpty title="尚未建立資料" type="initial-data">
 *     <MznButton>取消</MznButton>
 *     <MznButton>建立</MznButton>
 *   </MznEmpty>
 * </template>
 * ```
 *
 * @see MznResultState 帶有插畫的結果頁狀態
 */
const props = withDefaults(defineProps<EmptyProps>(), {
  actions: undefined,
  description: undefined,
  pictogram: undefined,
  size: 'main',
  type: 'initial-data',
});

defineSlots<{
  /**
   * Up to two MznButton elements. The first is treated as secondary, the
   * second as primary. Ignored when `actions` is given.
   */
  default?: () => unknown;
}>();

const attrs = useAttrs();
const slots = useSlots();

const ICONS: Record<string, IconDefinition | null> = {
  custom: null,
  'initial-data': BoxIcon,
  notification: NotificationIcon,
  result: FolderOpenIcon,
  system: SystemIcon,
};

const MAIN_ICONS: Record<string, FunctionalComponent | null> = {
  custom: null,
  'initial-data': EmptyMainInitialDataIcon as unknown as FunctionalComponent,
  notification: EmptyMainNotificationIcon as unknown as FunctionalComponent,
  result: EmptyMainResultIcon as unknown as FunctionalComponent,
  system: EmptyMainSystemIcon as unknown as FunctionalComponent,
};

const hostClasses = computed((): string =>
  clsx(classes.host, classes.size(props.size), attrs.class as string),
);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});

/**
 * A plain object becomes a Button; an already-rendered Button is cloned with
 * the size and variant the empty state decides. Mirrors React's
 * `renderButtonOrElement`.
 */
function renderButtonOrElement(
  button: EmptyActionButton | VNode | undefined,
  size: ButtonProps['size'],
  variant: 'base-primary' | 'base-secondary',
): VNodeChild {
  if (!button) return null;

  if (isVNode(button)) return h(button, { size, variant });

  // React spreads the object onto a Button, so its `children` becomes the
  // content; in Vue that is the default slot.
  const { children, ...rest } = button;

  return h(MznButton, { ...rest, size, variant }, () => children);
}

const actionButtons = computed((): VNodeChild[] | null => {
  const { actions, size } = props;

  if (actions) {
    if ('secondaryButton' in actions) {
      return [
        renderButtonOrElement(actions.secondaryButton, size, 'base-secondary'),
        renderButtonOrElement(actions.primaryButton, size, 'base-primary'),
      ];
    }

    return [renderButtonOrElement(actions, size, 'base-secondary')];
  }

  const children = flattenChildren(slots.default?.());

  if (children.length === 0) return null;

  return children.map((child, index) => {
    if (child.type !== MznButton) {
      console.warn('Only Button components are allowed as children of Empty.');

      return null;
    }

    if (index === 0) {
      return renderButtonOrElement(child, size, 'base-secondary');
    }

    if (index === 1) return renderButtonOrElement(child, size, 'base-primary');

    console.warn(
      'Only up to two Button components are allowed as children of Empty.',
    );

    return null;
  });
});

const showActions = computed(
  (): boolean =>
    Boolean(props.actions || slots.default) && props.size !== 'minor',
);

const Pictogram: FunctionalComponent = () => {
  if (props.pictogram) {
    return h('div', { class: classes.icon }, [props.pictogram]);
  }

  if (props.size === 'main') {
    const MainIcon = MAIN_ICONS[props.type];

    return MainIcon ? h(MainIcon, { class: classes.icon }) : null;
  }

  const icon = ICONS[props.type];

  return icon ? h(MznIcon, { class: classes.icon, icon }) : null;
};

const Actions: FunctionalComponent = () => actionButtons.value as VNode[];

const containerClass = classes.container;
const titleClass = classes.title;
const descriptionClass = classes.description;
const actionsClass = classes.actions;
</script>

<template>
  <div v-bind="forwardedAttrs" :class="hostClasses">
    <div :class="containerClass">
      <Pictogram />

      <p :class="titleClass">{{ title }}</p>
      <p v-if="description" :class="descriptionClass">{{ description }}</p>
      <MznButtonGroup v-if="showActions" :class="actionsClass">
        <Actions />
      </MznButtonGroup>
    </div>
  </div>
</template>
