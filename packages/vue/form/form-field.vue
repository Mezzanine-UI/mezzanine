<script setup lang="ts">
import { computed, provide, useAttrs } from 'vue';
import {
  ControlFieldSlotLayout,
  FormFieldCounterColor,
  FormFieldLabelSpacing,
  FormFieldLayout,
  formFieldClasses as classes,
} from '@mezzanine-ui/core/form';
import clsx from 'clsx';
import { formControlKey, type FormControl } from '../_internal/form-control';
import MznFormHintText from './form-hint-text.vue';
import MznFormLabel from './form-label.vue';
import type { FormFieldProps } from './form-field.types';

/**
 * 表單欄位容器，整合標籤、提示文字與錯誤狀態。
 *
 * 透過 form control 把 `disabled`、`fullWidth`、`required`、`severity` 往下傳給子元件。
 * 支援水平、垂直與延伸三種排版；`density` 與 `labelSpacing` 在垂直排版下不套用。
 * 有 `hintText`、`hintTextIcon` 或 `counter` 其中之一時才會渲染下方那一列。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznFormField } from '@mezzanine-ui/vue/form';
 * <\/script>
 *
 * <template>
 *   <MznFormField label="使用者名稱" name="username">
 *     <MznTextField />
 *   </MznFormField>
 *
 *   <MznFormField
 *     hint-text="電子郵件格式不正確"
 *     label="電子郵件"
 *     layout="vertical"
 *     severity="error"
 *   >
 *     <MznTextField />
 *   </MznFormField>
 * </template>
 * ```
 *
 * @see MznFormLabel 標籤
 * @see MznFormHintText 提示文字
 * @see MznFormGroup 欄位群組
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FormFieldProps>(), {
  controlFieldSlotColumns: undefined,
  controlFieldSlotLayout: ControlFieldSlotLayout.MAIN,
  counter: undefined,
  counterColor: undefined,
  density: undefined,
  disabled: false,
  fullWidth: false,
  hintText: undefined,
  hintTextIcon: undefined,
  label: undefined,
  labelInformationIcon: undefined,
  labelInformationText: undefined,
  labelOptionalMarker: undefined,
  labelSpacing: FormFieldLabelSpacing.MAIN,
  layout: FormFieldLayout.HORIZONTAL,
  name: undefined,
  required: false,
  severity: 'info',
  showHintTextIcon: undefined,
});

defineSlots<{
  /** The controls this field wraps. */
  default?: () => unknown;
}>();

const attrs = useAttrs();

provide(
  formControlKey,
  computed(
    (): FormControl => ({
      disabled: props.disabled,
      fullWidth: props.fullWidth,
      required: props.required,
      severity: props.severity,
    }),
  ),
);

const densityClass = computed((): string | undefined => {
  const shouldApplyDensity =
    props.density && props.layout !== FormFieldLayout.VERTICAL;

  return shouldApplyDensity ? classes.density(props.density!) : undefined;
});

const labelSpacingClass = computed((): string | undefined =>
  props.layout !== FormFieldLayout.VERTICAL
    ? classes.labelSpacing(props.labelSpacing)
    : undefined,
);

const hostClasses = computed((): string =>
  clsx(
    classes.host,
    classes.layout(props.layout),
    densityClass.value,
    {
      [classes.disabled]: props.disabled,
      [classes.fullWidth]: props.fullWidth,
    },
    attrs.class as string,
  ),
);

const labelClasses = computed((): string =>
  clsx(classes.labelArea, labelSpacingClass.value),
);

const controlFieldSlotClasses = computed((): string =>
  clsx(
    `${classes.controlFieldSlot}--${props.controlFieldSlotLayout}`,
    props.controlFieldSlotColumns
      ? classes.controlFieldSlotColumns(props.controlFieldSlotColumns)
      : undefined,
  ),
);

const showHintTextAndCounterArea = computed((): boolean =>
  Boolean(props.hintText || props.hintTextIcon || props.counter),
);

const showHintText = computed((): boolean =>
  Boolean(props.hintText || props.hintTextIcon),
);

const hintTextAndCounterAreaClasses = computed((): string =>
  clsx(classes.hintTextAndCounterArea, {
    [`${classes.hintTextAndCounterArea}--align-right`]:
      !showHintText.value && props.counter,
  }),
);

const counterClasses = computed((): string =>
  clsx(
    classes.counter,
    classes.counterColor(props.counterColor || FormFieldCounterColor.INFO),
  ),
);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});

const dataEntryClass = classes.dataEntry;
</script>

<template>
  <div v-bind="forwardedAttrs" :class="hostClasses">
    <MznFormLabel
      v-if="label"
      :class="labelClasses"
      :for="name"
      :information-icon="labelInformationIcon"
      :information-text="labelInformationText"
      :label-text="label"
      :optional-marker="labelOptionalMarker"
    />
    <div :class="dataEntryClass">
      <div :class="controlFieldSlotClasses"><slot /></div>
      <div
        v-if="showHintTextAndCounterArea"
        :class="hintTextAndCounterAreaClasses"
      >
        <MznFormHintText
          v-if="showHintText"
          :hint-text="hintText"
          :hint-text-icon="hintTextIcon"
          :severity="severity"
          :show-hint-text-icon="showHintTextIcon"
        />
        <span v-if="counter" :class="counterClasses">{{ counter }}</span>
      </div>
    </div>
  </div>
</template>
