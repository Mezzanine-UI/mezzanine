<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { stepClasses as classes } from '@mezzanine-ui/core/stepper';
import {
  CheckedOutlineIcon,
  DangerousFilledIcon,
  Item0Icon,
  Item1Icon,
  Item2Icon,
  Item3Icon,
  Item4Icon,
  Item5Icon,
  Item6Icon,
  Item7Icon,
  Item8Icon,
  Item9Icon,
} from '@mezzanine-ui/icons';
import type { IconDefinition } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import MznIcon from '../icon/icon.vue';
import MznTypography from '../typography/typography.vue';
import type { StepProps } from './step.types';

/**
 * 步驟條中的單一步驟。
 *
 * `index`、`orientation`、`status`、`type` 由父層 MznStepper 自動指定，直接使用時
 * 才需要自己傳。掛上 click 監聽會讓步驟變成可互動：加上 `role="button"`、
 * `tabindex`，並讓 Enter 與空白鍵等同點擊。
 *
 * @example
 * ```vue
 * <MznStepper :current-step="1">
 *   <MznStep title="填寫資料" description="請輸入基本資訊" />
 *   <MznStep title="確認內容" />
 * </MznStepper>
 * ```
 *
 * @see MznStepper 步驟條容器
 */
const props = withDefaults(defineProps<StepProps>(), {
  description: undefined,
  disabled: undefined,
  error: undefined,
  index: 0,
  orientation: undefined,
  status: 'pending',
  title: undefined,
  type: 'number',
});

const attrs = useAttrs();

const INDICATOR_NUMBER_ICONS: IconDefinition[] = [
  Item0Icon,
  Item1Icon,
  Item2Icon,
  Item3Icon,
  Item4Icon,
  Item5Icon,
  Item6Icon,
  Item7Icon,
  Item8Icon,
  Item9Icon,
];

const interactive = computed((): boolean => !!attrs.onClick);

const hostClasses = computed((): string =>
  clsx(classes.host, {
    // status
    [classes.processing]: props.status === 'processing',
    [classes.pending]: props.status === 'pending',
    [classes.succeeded]: !props.error && props.status === 'succeeded',
    [classes.error]: props.error && props.status !== 'processing',
    [classes.processingError]: props.error && props.status === 'processing',
    // orientation
    [classes.horizontal]: props.orientation === 'horizontal',
    [classes.vertical]: props.orientation === 'vertical',
    // type
    [classes.dot]: props.type === 'dot',
    [classes.number]: props.type === 'number',
    // interactive
    [classes.interactive]: interactive.value,
  }),
);

/** icon and indicatorNumber */
const statusIcon = computed((): IconDefinition => {
  if (!props.error && props.status === 'succeeded') return CheckedOutlineIcon;
  if (props.status !== 'processing' && props.error) return DangerousFilledIcon;

  return INDICATOR_NUMBER_ICONS[(props.index + 1) % 10];
});

const role = computed((): string | undefined =>
  interactive.value ? 'button' : undefined,
);

/**
 * React leaves `disabled` in its rest props, so it lands on the div as a
 * boolean attribute — `disabled=""`. Vue would write `disabled="true"` for a
 * non-form element, so the empty string is passed explicitly.
 */
const disabledAttr = computed((): string | undefined =>
  props.disabled ? '' : undefined,
);

const tabindex = computed((): number | undefined =>
  interactive.value ? 0 : undefined,
);

/**
 * Only bound when the step is interactive, matching React: without a click
 * handler the key handler is whatever the consumer passed, untouched.
 */
function onKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    (event.currentTarget as HTMLElement).click();
  }
}

const statusIndicatorClass = classes.statusIndicator;
const statusIndicatorDotClasses = clsx(
  classes.statusIndicator,
  classes.statusIndicatorDot,
);
const textContainerClass = classes.textContainer;
const titleClass = classes.title;
const titleConnectLineClass = classes.titleConnectLine;
const descriptionClass = classes.description;
</script>

<template>
  <div
    :class="hostClasses"
    :disabled="disabledAttr"
    :role="role"
    :tabindex="tabindex"
    v-on="interactive ? { keydown: onKeyDown } : {}"
  >
    <MznIcon
      v-if="type === 'number'"
      :class="statusIndicatorClass"
      :icon="statusIcon"
    />
    <span v-if="type === 'dot'" :class="statusIndicatorDotClasses" />
    <div :class="textContainerClass">
      <MznTypography :class="titleClass" variant="label-primary-highlight">
        {{ title }}
        <span :class="titleConnectLineClass" />
      </MznTypography>
      <MznTypography
        v-if="description"
        :class="descriptionClass"
        variant="caption"
      >
        {{ description }}
      </MznTypography>
    </div>
  </div>
</template>
