<script setup lang="ts">
import { computed, h, inject, ref } from 'vue';
import type { ComponentPublicInstance, FunctionalComponent, VNode } from 'vue';
import { navigationOverflowMenuClasses as classes } from '@mezzanine-ui/core/navigation';
import { DotHorizontalIcon } from '@mezzanine-ui/icons';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import { resolveElement } from '../_internal/resolve-element';
import { useDocumentEvents } from '../_internal/use-document-events';
import MznPopper from '../popper/popper.vue';
import MznScrollbar from '../scrollbar/scrollbar.vue';
import MznTranslate from '../transition/translate.vue';
import { NAVIGATION_ACTIVATED_CONTEXT } from './navigation-context';
import MznNavigationIconButton from './navigation-icon-button.vue';
import MznNavigationLevelProvider from './navigation-level-provider';
import MznNavigationOverflowMenuOption from './navigation-overflow-menu-option.vue';
import type { NavigationOverflowMenuProps } from './navigation-overflow-menu.types';

/**
 * 收合側邊欄放不下的第一層選項，收進一顆「更多」按鈕後面的浮層。
 *
 * 浮層最多三欄：點有子項的那一列就往右再開一欄，點沒有子項的就關掉浮層。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznNavigationOverflowMenu } from '@mezzanine-ui/vue/navigation';
 * <\/script>
 *
 * <template>
 *   <MznNavigationOverflowMenu :items="hiddenItems" />
 * </template>
 * ```
 *
 * @see MznNavigation 決定哪些選項放不下的側邊欄
 */
const props = defineProps<NavigationOverflowMenuProps>();

/**
 * The button and the popper are two roots, as React's fragment is, and React's
 * own component takes nothing but `items` — so there is nothing to forward.
 */
defineOptions({ inheritAttrs: false });

const context = inject(NAVIGATION_ACTIVATED_CONTEXT, undefined);

const menuOpen = ref(false);

const target = ref<ComponentPublicInstance | null>(null);
const popper = ref<ComponentPublicInstance | null>(null);

const targetElement = computed((): HTMLElement | null =>
  resolveElement(target.value),
);

const isActive = computed((): boolean => {
  const activatedPath = context?.value.activatedPath ?? [];

  return (
    activatedPath.length > 0 &&
    Boolean(context?.value.collapsedHiddenKeys.has(activatedPath[0]))
  );
});

const level1path = ref<string[]>([]);
const level2path = ref<string[]>([]);
const level2Items = ref<VNode[]>([]);
const level3Items = ref<VNode[]>([]);

/**
 * Each row is rebuilt as an overflow row carrying the original option's props
 * and children, with the menu's own handler in front of the option's.
 */
function renderMenuItem(item: VNode, currentLevel: number): VNode {
  const itemProps = (item.props ?? {}) as Record<string, unknown>;
  const ownTriggerClick = itemProps.onTriggerClick as
    | ((path: string[], currentKey: string, href?: string) => void)
    | undefined;

  return h(
    MznNavigationOverflowMenuOption as never,
    {
      ...itemProps,
      key: item.key ?? undefined,
      onTriggerClick: (
        path: string[],
        currentKey: string,
        href?: string,
        subItems?: VNode[],
      ) => {
        if (subItems && subItems.length > 0) {
          if (currentLevel === 1) {
            level1path.value = path;
            level2Items.value = subItems;
            level3Items.value = [];
          } else if (currentLevel === 2) {
            level2path.value = path;
            level3Items.value = subItems;
          }
        } else {
          menuOpen.value = false;
        }

        ownTriggerClick?.(path, currentKey, href);
      },
    },
    item.children as never,
  );
}

const renderedItems = computed((): VNode[] =>
  props.items.map((item) => renderMenuItem(item, 1)),
);
const renderedItems2 = computed((): VNode[] =>
  level2Items.value.map((item) => renderMenuItem(item, 2)),
);
const renderedItems3 = computed((): VNode[] =>
  level3Items.value.map((item) => renderMenuItem(item, 3)),
);

useDocumentEvents(() => {
  if (!menuOpen.value) return undefined;

  const handleClickAway = (event: MouseEvent | TouchEvent): void => {
    const eventTarget = event.target as HTMLElement | null;
    const anchor = targetElement.value;
    const popperElement = resolveElement(popper.value);

    if (!eventTarget) return;

    if (
      anchor &&
      popperElement &&
      !anchor.contains(eventTarget) &&
      !popperElement.contains(eventTarget)
    ) {
      menuOpen.value = false;
    }
  };

  return { click: handleClickAway, touchend: handleClickAway };
});

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

const POPPER_OPTIONS = { placement: 'right-end' as const };

const Level1Items: FunctionalComponent = () => renderedItems.value;
const Level2Items: FunctionalComponent = () => renderedItems2.value;
const Level3Items: FunctionalComponent = () => renderedItems3.value;
</script>

<template>
  <MznNavigationIconButton
    ref="target"
    :active="isActive"
    :icon="DotHorizontalIcon"
    @click="menuOpen = !menuOpen"
  />
  <MznPopper
    ref="popper"
    :anchor="targetElement"
    disable-portal
    :open="menuOpen"
    :options="POPPER_OPTIONS"
  >
    <TransitionGroup :css="false">
      <MznTranslate
        v-if="menuOpen"
        key="popper-list"
        v-bind="TRANSLATE_PROPS"
        from="bottom"
        in
      >
        <li :class="classes.host">
          <span
            :aria-expanded="menuOpen"
            aria-haspopup="true"
            :class="classes.content"
          >
            <MznScrollbar :class="classes.subMenu">
              <ul
                ><Level1Items
              /></ul>
            </MznScrollbar>
            <MznNavigationLevelProvider :level="1" :path="level1path">
              <MznScrollbar
                v-if="level2Items.length > 0"
                :class="classes.subMenu"
              >
                <ul
                  ><Level2Items
                /></ul>
              </MznScrollbar>
            </MznNavigationLevelProvider>
            <MznNavigationLevelProvider :level="2" :path="level2path">
              <MznScrollbar
                v-if="level3Items.length > 0"
                :class="classes.subMenu"
              >
                <ul
                  ><Level3Items
                /></ul>
              </MznScrollbar>
            </MznNavigationLevelProvider>
          </span>
        </li>
      </MznTranslate>
    </TransitionGroup>
  </MznPopper>
</template>
