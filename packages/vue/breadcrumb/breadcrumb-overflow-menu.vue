<script setup lang="ts">
import { computed, ref, shallowRef, useAttrs } from 'vue';
import type { Middleware } from '@floating-ui/dom';
import { breadcrumbClasses } from '@mezzanine-ui/core/breadcrumb';
import { DotHorizontalIcon } from '@mezzanine-ui/icons';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import clsx from 'clsx';
import { useDocumentEvents } from '../_internal/use-document-events';
import MznIcon from '../icon/icon.vue';
import MznPopper from '../popper/popper.vue';
import type { PopperController } from '../popper/popper.types';
import MznTranslate from '../transition/translate.vue';
import MznBreadcrumbOverflowMenuItem from './breadcrumb-overflow-menu-item.vue';
import type { BreadcrumbItemProps } from './breadcrumb-item.types';

/**
 * 麵包屑收起中間節點時的「…」按鈕與它展開的選單。
 *
 * 選單以 popper 定位在按鈕下方，點到外面就收起來。
 *
 * @see MznBreadcrumb 決定哪些節點要收進來
 */
defineOptions({ inheritAttrs: false });

const props = defineProps<{
  collapsedProps: (BreadcrumbItemProps & { id: string })[];
}>();

const attrs = useAttrs();

const menuOpen = ref(false);
const target = ref<HTMLButtonElement | null>(null);
const popperRef = shallowRef<{ controllerRef: PopperController } | null>(null);

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

useDocumentEvents(() => {
  if (!menuOpen.value) {
    return undefined;
  }

  const handleClickAway = (event: MouseEvent | TouchEvent): void => {
    const clicked = event.target as HTMLElement | null;
    const anchor = target.value;
    const popper = popperRef.value?.controllerRef.elements.floating
      .value as HTMLElement | null;

    if (!clicked) return;

    if (
      anchor &&
      popper &&
      !anchor.contains(clicked) &&
      !popper.contains(clicked)
    ) {
      menuOpen.value = false;
    }
  };

  return {
    click: handleClickAway,
    touchend: handleClickAway,
  };
});

const zIndexMiddleware: Middleware = {
  name: 'zIndex',
  fn: ({ elements }) => {
    Object.assign(elements.floating.style, { zIndex: 1 });

    return {};
  },
};

const POPPER_OPTIONS = {
  middleware: [zIndexMiddleware],
  placement: 'bottom-start' as const,
};

function buttonOnClick(event: MouseEvent): void {
  menuOpen.value = !menuOpen.value;
  (attrs.onClick as ((event: MouseEvent) => void) | undefined)?.(event);
}

const forwardedAttrs = computed(() => {
  const { class: _class, onClick: _onClick, ...rest } = attrs;

  return rest;
});

const buttonClasses = computed((): string =>
  clsx(breadcrumbClasses.iconButton, attrs.class as string),
);

const menuClass = breadcrumbClasses.menu;
const menuContentClass = breadcrumbClasses.menuContent;
</script>

<template>
  <button
    ref="target"
    aria-label="more options"
    type="button"
    v-bind="forwardedAttrs"
    :class="buttonClasses"
    @click="buttonOnClick"
  >
    <MznIcon :icon="DotHorizontalIcon" :size="14" />
  </button>
  <MznPopper
    ref="popperRef"
    :anchor="target"
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
        <span :class="menuClass">
          <span :class="menuContentClass">
            <MznBreadcrumbOverflowMenuItem
              v-for="item in props.collapsedProps"
              :key="item.id"
              v-bind="item"
            />
          </span>
        </span>
      </MznTranslate>
    </TransitionGroup>
  </MznPopper>
</template>
