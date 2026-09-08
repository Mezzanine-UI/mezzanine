<script setup lang="ts">
import { computed, ref, useAttrs, useSlots } from 'vue';
import type { CSSProperties } from 'vue';
import { iconClasses as classes } from '@mezzanine-ui/core/spin';
import clsx from 'clsx';
import MznBackdrop from '../backdrop/backdrop.vue';
import type { SpinProps } from './spin.types';

/**
 * 載入中指示器。
 *
 * 有兩種用法：不放內容時只渲染轉圈本身（`loading` 為 false 時什麼都不渲染）；
 * 放了內容則進入巢狀模式，轉圈會蓋在內容之上，由淺色遮罩隔開。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznSpin } from '@mezzanine-ui/vue/spin';
 * <\/script>
 *
 * <template>
 *   <MznSpin loading />
 *   <MznSpin description="載入中..." loading size="large" />
 *   <MznSpin :loading="pending" stretch>
 *     <div>被蓋住的內容</div>
 *   </MznSpin>
 * </template>
 * ```
 *
 * @see MznBackdrop 巢狀模式使用的遮罩
 */
/**
 * React never spreads its rest props: only `className` is used, and only in the
 * nested branch. Letting Vue's fallthrough put attributes on the host would put
 * them where React never does.
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SpinProps>(), {
  backdropProps: () => ({}),
  color: undefined,
  description: undefined,
  descriptionClassName: undefined,
  loading: false,
  size: 'main',
  stretch: false,
  trackColor: undefined,
});

defineSlots<{
  /**
   * Content the spinner covers. Providing it switches to the nested pattern.
   */
  default?: () => unknown;
}>();

const attrs = useAttrs();
const slots = useSlots();

const host = ref<HTMLDivElement | null>(null);

const isNestedPattern = computed((): boolean => Boolean(slots.default));

const ringVars = computed(
  (): CSSProperties => ({
    ...(props.color && { '--mzn-spin--color': props.color }),
    ...(props.trackColor && { '--mzn-spin--track-color': props.trackColor }),
  }),
);

const spinClasses = computed((): string =>
  clsx(classes.spin, classes.size(props.size), {
    [classes.stretch]: props.stretch,
  }),
);

const hostClasses = computed((): string =>
  clsx(
    classes.host,
    {
      [classes.stretch]: props.stretch,
    },
    attrs.class as string,
  ),
);

const descriptionClasses = computed((): string =>
  clsx(classes.description, props.descriptionClassName),
);

const BACKDROP_STYLE = { pointerEvents: 'none' } as CSSProperties;

const spinnerRingClass = classes.spinnerRing;
const spinnerTailClass = classes.spinnerTail;
</script>

<template>
  <div v-if="isNestedPattern" ref="host" :class="hostClasses">
    <MznBackdrop
      v-bind="backdropProps"
      :container="host"
      :open="loading"
      :style="BACKDROP_STYLE"
      variant="light"
    >
      <div v-if="loading" :class="spinClasses">
        <span :class="spinnerRingClass" :style="ringVars">
          <span :class="spinnerTailClass" />
        </span>
        <span v-if="description" :class="descriptionClasses">
          {{ description }}
        </span>
      </div>
    </MznBackdrop>
    <slot />
  </div>

  <div v-else-if="loading" :class="spinClasses">
    <span :class="spinnerRingClass" :style="ringVars">
      <span :class="spinnerTailClass" />
    </span>
    <span v-if="description" :class="descriptionClasses">
      {{ description }}
    </span>
  </div>
</template>
