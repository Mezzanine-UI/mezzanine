<script setup lang="ts">
import { computed, inject, useAttrs } from 'vue';
import type { FunctionalComponent } from 'vue';
import { formFieldClasses as classes } from '@mezzanine-ui/core/form';
import clsx from 'clsx';
import { formControlKey } from '../_internal/form-control';
import MznIcon from '../icon/icon.vue';
import MznTooltip from '../tooltip/tooltip.vue';
import type { FormLabelProps } from './form-label.types';

/**
 * 表單欄位的標籤。
 *
 * `required` 由外層的 form control 提供，為 true 時在文字前加上星號；
 * 提供 `informationIcon` 時圖示會帶出 tooltip。結尾固定是一個冒號。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznFormLabel } from '@mezzanine-ui/vue/form';
 * <\/script>
 *
 * <template>
 *   <MznFormLabel label-text="使用者名稱" optional-marker="(選填)" />
 * </template>
 * ```
 *
 * @see MznFormField 使用這個標籤的欄位容器
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FormLabelProps>(), {
  informationIcon: undefined,
  informationText: undefined,
  optionalMarker: undefined,
});

const attrs = useAttrs();
const formControl = inject(formControlKey, undefined);

const required = computed((): boolean => Boolean(formControl?.value.required));

const hostClasses = computed((): string =>
  clsx(classes.label, attrs.class as string),
);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});

const OptionalMarker: FunctionalComponent = () => props.optionalMarker;

const colonClass = classes.labelColon;
const informationIconClass = classes.labelInformationIcon;
const optionalMarkerClass = classes.labelOptionalMarker;
const requiredMarkerClass = classes.labelRequiredMarker;
</script>

<template>
  <label v-bind="forwardedAttrs" :class="hostClasses"
    ><span v-if="required" :class="requiredMarkerClass">*</span>{{ labelText
    }}<span v-if="optionalMarker" :class="optionalMarkerClass"
      ><OptionalMarker /></span
    ><MznTooltip v-if="informationIcon" :title="informationText">
      <!--
        Only the pointer half of the trigger payload, as React's FormLabel
        picks: the icon is not focusable there, so the tooltip does not open
        on focus and never carries `aria-describedby`.
      -->
      <template #default="{ onMouseenter, onMouseleave, ref: setTrigger }">
        <MznIcon
          :ref="setTrigger"
          :class="informationIconClass"
          color="neutral-light"
          :icon="informationIcon"
          :size="16"
          @mouseenter="onMouseenter"
          @mouseleave="onMouseleave"
        />
      </template> </MznTooltip
    ><span :class="colonClass">:</span></label
  >
</template>
