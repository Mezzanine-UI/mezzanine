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

/**
 * React's transition reports six moments, and `isAppearing` tells the enter
 * three whether this is the first mount. Vue routes the initial run through
 * `appear` instead of `enter`, so both are bound below and the flag comes from
 * which one fired.
 */
const emit = defineEmits<{
  enter: [node: HTMLElement, isAppearing: boolean];
  entered: [node: HTMLElement, isAppearing: boolean];
  entering: [node: HTMLElement, isAppearing: boolean];
  exit: [node: HTMLElement];
  exited: [node: HTMLElement];
  exiting: [node: HTMLElement];
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

    if (value) runEnter(el, false);
    else runExit(el);
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

function runEnter(
  node: HTMLElement,
  isAppearing: boolean,
  done?: () => void,
): void {
  emit('enter', node, isAppearing);
  fadeEnter(node, resolved.value, () => {
    emit('entered', node, isAppearing);
    done?.();
  });
  // `fadeEnter` writes the entering styles synchronously, so by here the
  // entering state is applied — which is the moment React reports.
  emit('entering', node, isAppearing);
}

function runExit(node: HTMLElement, done?: () => void): void {
  emit('exit', node);
  fadeExit(
    node,
    resolved.value,
    () => {
      emit('exited', node);
      done?.();
    },
    props.keepMount,
  );
  emit('exiting', node);
}

function onEnter(element: Element, done: () => void): void {
  runEnter(element as HTMLElement, false, done);
}

function onAppear(element: Element, done: () => void): void {
  runEnter(element as HTMLElement, true, done);
}

function onLeave(element: Element, done: () => void): void {
  runExit(element as HTMLElement, done);
}
</script>

<template>
  <Transition
    :appear="appear"
    :css="false"
    @appear="onAppear"
    @enter="onEnter"
    @leave="onLeave"
  >
    <FadeChild v-if="shown" />
  </Transition>
</template>
