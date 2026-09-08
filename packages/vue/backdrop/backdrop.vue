<script setup lang="ts">
import { computed } from 'vue';
import { backdropClasses as classes } from '@mezzanine-ui/core/backdrop';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import clsx from 'clsx';
import { useScrollLock } from '../_internal/use-scroll-lock';
import MznPortal from '../portal/portal.vue';
import MznFade from '../transition/fade.vue';
import type { BackdropProps } from './backdrop.types';

/**
 * 用於 Modal、Drawer 等覆蓋層元件的遮罩底層元件。
 *
 * 透過 MznPortal 渲染至指定的 DOM 容器，並使用 MznFade 動畫處理顯示與隱藏過渡。
 * 開啟時會自動鎖定 body 捲動（可透過 `disableScrollLock` 停用）。
 * 點擊遮罩時預設發出 `close`，可透過 `disableCloseOnBackdropClick` 停用此行為。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { ref } from 'vue';
 * import { MznBackdrop } from '@mezzanine-ui/vue/backdrop';
 *
 * const open = ref(false);
 * <\/script>
 *
 * <template>
 *   <MznBackdrop :open="open" @close="open = false">
 *     <div>浮層內容</div>
 *   </MznBackdrop>
 *
 *   <MznBackdrop
 *     disable-close-on-backdrop-click
 *     :open="open"
 *     variant="light"
 *     @close="open = false"
 *   >
 *     <div>強制顯示的內容</div>
 *   </MznBackdrop>
 * </template>
 * ```
 *
 * @see MznPortal 決定遮罩落在 DOM 的哪個位置
 */
/**
 * React spreads its rest props onto the host div inside the portal, not onto
 * the portal itself. Vue's fallthrough would hand them to MznPortal, which
 * renders no element of its own and would drop them.
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<BackdropProps>(), {
  container: undefined,
  disableCloseOnBackdropClick: false,
  disablePortal: undefined,
  disableScrollLock: false,
  open: false,
  variant: 'dark',
});

const emit = defineEmits<{
  backdropClick: [event: MouseEvent];
  close: [];
}>();

defineSlots<{
  default?: () => unknown;
}>();

// Lock body scroll when backdrop is open
useScrollLock({ enabled: () => props.open && !props.disableScrollLock });

const FADE_DURATION = {
  enter: MOTION_DURATION.fast,
  exit: MOTION_DURATION.fast,
};

const FADE_EASING = {
  enter: MOTION_EASING.standard,
  exit: MOTION_EASING.standard,
};

const hostClasses = computed((): string =>
  clsx(classes.host, classes.hostAbsolute, {
    [classes.hostOpen]: props.open,
  }),
);

const backdropClasses = computed((): string =>
  clsx(classes.backdrop, classes.backdropVariant(props.variant)),
);

const mainClass = classes.main;
const contentClass = classes.content;

function handleBackdropClick(event: MouseEvent): void {
  if (!props.disableCloseOnBackdropClick) {
    emit('close');
  }

  emit('backdropClick', event);
}
</script>

<template>
  <MznPortal
    :container="container"
    :disable-portal="disablePortal"
    layer="default"
  >
    <div
      v-bind="$attrs"
      :aria-hidden="!open"
      :class="hostClasses"
      role="presentation"
    >
      <div :class="mainClass">
        <MznFade :duration="FADE_DURATION" :easing="FADE_EASING" :in="open">
          <div
            aria-hidden="true"
            :class="backdropClasses"
            @click="handleBackdropClick"
          />
        </MznFade>
        <div :class="contentClass">
          <slot />
        </div>
      </div>
    </div>
  </MznPortal>
</template>
