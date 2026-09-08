import { computed, defineComponent, provide } from 'vue';
import type { PropType } from 'vue';
import { NAVIGATION_OPTION_LEVEL_CONTEXT } from './navigation-context';

/**
 * Renderless: it provides the option level and renders its slot untouched.
 *
 * React wraps only part of a subtree in `NavigationOptionLevelContext.Provider`
 * — the overflow menu puts each of its three columns at a different level
 * inside one component. Vue's `provide` reaches every descendant of whoever
 * calls it, so a component cannot hand out two different levels; this one
 * narrows each to the subtree React gives it.
 */
export default defineComponent({
  name: 'MznNavigationLevelProvider',
  props: {
    level: { type: Number, required: true },
    path: { type: Array as PropType<string[]>, required: true },
  },
  setup(props, { slots }) {
    provide(
      NAVIGATION_OPTION_LEVEL_CONTEXT,
      computed(() => ({ level: props.level, path: props.path })),
    );

    return () => slots.default?.();
  },
});
