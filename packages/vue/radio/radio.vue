<script setup lang="ts">
import { computed, h, inject, ref, useAttrs } from 'vue';
import type { VNode, VNodeChild } from 'vue';
import type { InputCheckSize } from '@mezzanine-ui/core/_internal/input-check';
import { radioClasses as classes } from '@mezzanine-ui/core/radio';
import clsx from 'clsx';
import { flattenChildren } from '../_internal/flatten-children';
import MznInputCheck from '../_internal/input-check.vue';
import { useRadioControlValue } from '../_internal/use-radio-control-value';
import MznIcon from '../icon/icon.vue';
import MznInput from '../input/input.vue';
import { radioGroupKey } from './radio-group-context';
import type { RadioProps } from './radio.types';

/**
 * 單選按鈕元件，支援標準（radio）與區段（segment）兩種類型。
 *
 * 在 MznRadioGroup 內使用時會自動繼承群組的 `name`、`size` 與 `type`；
 * 也可獨立使用，透過 `checked` / `defaultChecked` 進行受控或非受控操作。
 * `segment` 類型可搭配 `icon` 顯示圖示；`withInputConfig` 會在右側附一個輸入框，
 * 選中時自動聚焦到它。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznRadio } from '@mezzanine-ui/vue/radio';
 * <\/script>
 *
 * <template>
 *   <MznRadio value="male" :input-props="{ name: 'gender' }">男性</MznRadio>
 *   <MznRadio type="segment" :icon="ListIcon" value="list">列表</MznRadio>
 * </template>
 * ```
 *
 * @see MznRadioGroup 管理多個單選按鈕的群組元件
 * @see useRadioControlValue 單選按鈕受控值的 composable
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<RadioProps>(), {
  checked: undefined,
  defaultChecked: undefined,
  disabled: undefined,
  error: false,
  focused: undefined,
  hint: undefined,
  icon: undefined,
  inputProps: undefined,
  segmentedStyle: undefined,
  size: undefined,
  type: undefined,
  value: undefined,
  withInputConfig: undefined,
});

const emit = defineEmits<{
  /** The change event handler of input in radio. */
  change: [event: Event];
}>();

const slots = defineSlots<{
  /** The label of the radio. */
  default?: () => VNode[];
}>();

const attrs = useAttrs();
const radioGroup = inject(radioGroupKey, undefined);

const disabled = computed(
  (): boolean => props.disabled ?? radioGroup?.value.disabled ?? false,
);
const type = computed(
  (): 'radio' | 'segment' => props.type ?? radioGroup?.value.type ?? 'radio',
);
const size = computed(
  (): InputCheckSize =>
    (props.size ?? radioGroup?.value.size ?? 'main') as InputCheckSize,
);

const inputId = computed((): string | undefined => props.inputProps?.id);
const name = computed(
  (): string | undefined => props.inputProps?.name ?? radioGroup?.value.name,
);

const restInputProps = computed(() => {
  const { id: _id, name: _name, ...rest } = props.inputProps ?? {};

  return rest;
});

const { checked, onChange } = useRadioControlValue({
  checked: () => props.checked,
  defaultChecked: () => props.defaultChecked,
  onChange: (event) => emit('change', event),
  radioGroup: () => radioGroup?.value,
  value: () => props.value,
});

const radioInput = ref<HTMLInputElement | null>(null);
const textInput = ref<InstanceType<typeof MznInput> | null>(null);

function handleRadioChange(event: Event): void {
  onChange(event);

  if (props.withInputConfig && !props.withInputConfig.disabled) {
    textInput.value?.input?.focus();
  }
}

const controlClasses = computed((): string =>
  clsx(classes.host, classes.size(size.value), {
    [classes.segmented]: type.value === 'segment',
    [classes.checked]: checked.value,
    [classes.error]: props.error,
  }),
);

const segmentedContainerClasses = computed((): string =>
  clsx(classes.segmentedContainer, {
    [classes.segmentedContainerWithIconText]:
      Boolean(flattenChildren(slots.default?.()).length) && Boolean(props.icon),
  }),
);

/**
 * React hands the control in as a node, so it is built here rather than in a
 * slot: the input has to keep the ref that focuses the paired text input.
 */
const control = computed(
  (): VNodeChild =>
    h('span', { class: controlClasses.value }, [
      type.value === 'segment'
        ? h('span', { class: segmentedContainerClasses.value }, [
            props.icon ? h(MznIcon, { icon: props.icon, size: 16 }) : null,
            slots.default?.(),
          ])
        : null,
      h('input', {
        ...restInputProps.value,
        'aria-checked': checked.value,
        'aria-disabled': disabled.value,
        checked: checked.value,
        disabled: disabled.value,
        id: inputId.value,
        name: name.value,
        onChange: handleRadioChange,
        ref: radioInput,
        type: 'radio',
        value: props.value,
      }),
    ]),
);

const withInputStyle = computed(() => ({
  width: `${props.withInputConfig?.width ?? 120}px`,
}));

const withInputProps = computed(() => {
  const { width: _width, ...rest } = props.withInputConfig ?? {};

  return rest;
});

const textInputProps = { onClick: () => radioInput.value?.click() };

const wrapperClasses = computed((): unknown[] => [
  classes.wrapper,
  attrs.class,
]);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});
</script>

<template>
  <div :class="wrapperClasses">
    <MznInputCheck
      v-bind="forwardedAttrs"
      :control="control"
      :disabled="disabled"
      :error="error"
      :focused="focused"
      :for="inputId"
      :hint="hint"
      :segmented-style="type === 'segment'"
      :size="size"
    >
      <slot v-if="type === 'radio'" />
    </MznInputCheck>
    <div v-if="type === 'radio' && withInputConfig" :style="withInputStyle">
      <MznInput
        ref="textInput"
        v-bind="withInputProps"
        :input-props="textInputProps"
        :placeholder="withInputConfig.placeholder ?? 'Placeholder'"
        variant="base"
      />
    </div>
  </div>
</template>
