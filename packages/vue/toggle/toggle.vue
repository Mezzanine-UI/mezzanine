<script setup lang="ts">
import { computed, inject } from 'vue';
import { toggleClasses as classes } from '@mezzanine-ui/core/toggle';
import clsx from 'clsx';
import { formControlKey } from '../_internal/form-control';
import { useSwitchControlValue } from '../_internal/use-switch-control-value';
import MznTypography from '../typography/typography.vue';
import type { ToggleProps } from './toggle.types';

/**
 * 切換開關元件，用於表示開／關二元狀態。
 *
 * 支援受控（`checked` + `@change`）與非受控（`defaultChecked`）兩種用法；
 * `label` 顯示於開關右側，`supportingText` 顯示於 label 下方作為輔助說明。
 * `disabled` 可透過外層 form control 自動繼承，無需手動傳入。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznToggle } from '@mezzanine-ui/vue/toggle';
 * <\/script>
 *
 * <template>
 *   <MznToggle v-model:checked="enabled" label="啟用通知" />
 *   <MznToggle default-checked label="自動儲存" />
 *   <MznToggle
 *     :checked="darkMode"
 *     label="深色模式"
 *     supporting-text="切換介面主題配色"
 *     @change="darkMode = $event.target.checked"
 *   />
 *   <MznToggle disabled label="此功能暫不開放" />
 * </template>
 * ```
 *
 * @see useSwitchControlValue 管理 Toggle 受控／非受控值狀態的 composable
 */
/**
 * `checked` and `disabled` default to `undefined` rather than `false`: Vue
 * casts an absent Boolean prop to `false`, which would make every toggle look
 * controlled-and-off, and would render `aria-disabled="false"` where React
 * renders no attribute at all.
 */
const props = withDefaults(defineProps<ToggleProps>(), {
  checked: undefined,
  defaultChecked: undefined,
  disabled: undefined,
  inputProps: undefined,
  label: undefined,
  size: 'main',
  supportingText: undefined,
});

const emit = defineEmits<{
  change: [event: Event];
  'update:checked': [checked: boolean];
}>();

const formControl = inject(formControlKey, undefined);

const disabled = computed(
  (): boolean | undefined => props.disabled ?? formControl?.value.disabled,
);

const { checked, onChange } = useSwitchControlValue({
  checked: () => props.checked,
  defaultChecked: () => props.defaultChecked,
  onChange: (event) => {
    emit('change', event);
    emit('update:checked', (event.target as HTMLInputElement).checked);
  },
});

const hostClasses = computed((): string =>
  clsx(classes.host, {
    [classes.checked]: checked.value,
    [classes.disabled]: disabled.value,
    [classes.main]: props.size === 'main',
    [classes.sub]: props.size === 'sub',
  }),
);

const inputContainerClass = classes.inputContainer;
const knobClass = classes.knob;
const inputClass = classes.input;
const textContainerClass = classes.textContainer;
</script>

<template>
  <div :class="hostClasses">
    <div :class="inputContainerClass">
      <span :class="knobClass" />
      <input
        v-bind="inputProps"
        :aria-checked="checked"
        :aria-disabled="disabled"
        :checked="checked"
        :class="inputClass"
        :disabled="disabled"
        type="checkbox"
        @change="onChange"
      />
    </div>
    <div v-if="label" :class="textContainerClass">
      <MznTypography color="text-neutral-solid" variant="label-primary">
        {{ label }}
      </MznTypography>
      <MznTypography
        v-if="supportingText"
        color="text-neutral"
        variant="caption"
      >
        {{ supportingText }}
      </MznTypography>
    </div>
  </div>
</template>
