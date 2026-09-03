<script setup lang="ts">
import {
  cloneVNode,
  computed,
  onMounted,
  shallowRef,
  useSlots,
  watch,
} from 'vue';
import type { ComponentPublicInstance, FunctionalComponent, VNode } from 'vue';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import { fadeEnter, fadeExit } from './fade-transition';
import type { TransitionImplementationProps } from './transition.types';

/**
 * 淡入淡出轉場。
 *
 * 依 D10 建在 Vue 內建的 `Transition` 之上，但以 JS hook 直接寫 inline style
 * （`:css="false"`），與 React 版一致 — React 的實作同樣是把 `opacity` 與
 * `transition` 寫進元素的 style，而非套用 CSS class。
 *
 * @example
 * ```vue
 * <MznFade :in="visible">
 *   <div>內容</div>
 * </MznFade>
 * ```
 */
const props = withDefaults(defineProps<TransitionImplementationProps>(), {
  appear: true,
  delay: 0,
  duration: () => ({
    enter: MOTION_DURATION.moderate,
    exit: MOTION_DURATION.moderate,
  }),
  easing: () => ({
    enter: MOTION_EASING.entrance,
    exit: MOTION_EASING.exit,
  }),
  in: false,
  keepMount: false,
  lazyMount: true,
});

const emit = defineEmits<{
  enter: [node: HTMLElement];
  entered: [node: HTMLElement];
  exit: [node: HTMLElement];
  exited: [node: HTMLElement];
}>();

defineSlots<{
  default?: () => unknown;
}>();

/** `duration: 'auto'` has no meaning for a fade; React falls back the same way. */
const resolved = computed(() => ({
  delay: props.delay,
  duration:
    props.duration === 'auto'
      ? { enter: MOTION_DURATION.moderate, exit: MOTION_DURATION.moderate }
      : (props.duration ?? {
          enter: MOTION_DURATION.moderate,
          exit: MOTION_DURATION.moderate,
        }),
  easing: props.easing,
}));

/**
 * `lazyMount` maps to not rendering until the first enter, `keepMount` to
 * staying in the DOM afterwards. Vue's `Transition` only animates; what is
 * mounted is decided by the `v-if` below, which is the same split React makes
 * with `mountOnEnter` / `unmountOnExit`.
 */
const shown = computed((): boolean => props.in || props.keepMount);

const slots = useSlots();
const node = shallowRef<Element | ComponentPublicInstance | null>(null);

/**
 * The child is cloned so a ref can be attached to it — React's `Fade` does the
 * same with `cloneElement`, and for the same reason: the transition has to
 * reach an element it does not own.
 */
const FadeChild: FunctionalComponent = () => {
  const [child] = (slots.default?.() ?? []) as VNode[];

  return child ? cloneVNode(child, { ref: node }) : null;
};

function element(): HTMLElement | null {
  const current = node.value;

  if (!current) return null;

  const el = current instanceof Element ? current : current.$el;

  return el instanceof HTMLElement ? el : null;
}

/**
 * With `keepMount` the child never leaves the DOM, so Vue's `Transition` never
 * runs its leave hooks — `v-show` would, but it also writes `display: none`,
 * which React does not. The fade is driven directly instead, which is exactly
 * what React's Fade does: the element stays laid out and is hidden with
 * `visibility` once the exit finishes.
 */
watch(
  (): boolean => props.in,
  (value) => {
    const el = element();

    if (!props.keepMount || !el) return;

    if (value) {
      emit('enter', el);
      fadeEnter(el, resolved.value, () => emit('entered', el));
    } else {
      emit('exit', el);
      fadeExit(el, resolved.value, () => emit('exited', el), true);
    }
  },
  { flush: 'post' },
);

onMounted(() => {
  const el = element();

  if (!props.keepMount || !el || props.in) return;

  // Mounted in the exited state: no animation, just the resting styles.
  el.style.opacity = '0';
  el.style.visibility = 'hidden';
});

function onEnter(element: Element, done: () => void): void {
  const node = element as HTMLElement;

  emit('enter', node);
  fadeEnter(node, resolved.value, () => {
    emit('entered', node);
    done();
  });
}

function onLeave(element: Element, done: () => void): void {
  const node = element as HTMLElement;

  emit('exit', node);
  fadeExit(
    node,
    resolved.value,
    () => {
      emit('exited', node);
      done();
    },
    props.keepMount,
  );
}
</script>

<template>
  <Transition :appear="appear" :css="false" @enter="onEnter" @leave="onLeave">
    <FadeChild v-if="shown" />
  </Transition>
</template>
