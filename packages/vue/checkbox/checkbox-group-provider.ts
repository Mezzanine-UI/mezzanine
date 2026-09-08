import { computed, defineComponent, provide } from 'vue';
import type { PropType } from 'vue';
import { checkboxGroupKey } from './checkbox-group-context';
import type { CheckboxGroupContextValue } from './checkbox-group-context';

/**
 * Renderless: it provides the group context and renders its slot untouched.
 *
 * React wraps only the options (or the caller's children) in
 * `CheckboxGroupContext.Provider`, so the group's own level-control checkbox
 * sits outside it and never counts as "inside a CheckboxGroup". Vue's `provide`
 * reaches every descendant of the component that calls it, so the level control
 * would inject the context, hit the `value` is required guard and disappear —
 * this component narrows the context to the same subtree React gives it.
 */
export default defineComponent({
  name: 'MznCheckboxGroupProvider',
  props: {
    disabled: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined,
    },
    name: { type: String as PropType<string | undefined>, default: undefined },
    onChange: {
      type: Function as PropType<CheckboxGroupContextValue['onChange']>,
      required: true,
    },
    value: { type: Array as PropType<string[]>, required: true },
  },
  setup(props, { slots }) {
    provide(
      checkboxGroupKey,
      computed(
        (): CheckboxGroupContextValue => ({
          disabled: props.disabled,
          name: props.name,
          onChange: props.onChange,
          value: props.value,
        }),
      ),
    );

    return () => slots.default?.();
  },
});
