<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { inputPasswordStrengthIndicatorClasses as classes } from '@mezzanine-ui/core/input';
import clsx from 'clsx';
import MznFormHintText from '../form/form-hint-text.vue';
import type { PasswordStrengthIndicatorProps } from './password-strength-indicator.types';

/**
 * 密碼強度指示條。
 *
 * `strengthText` 未指定時依 `strength` 顯示「低／中／高」，下方可再列出提示文字。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznPasswordStrengthIndicator } from '@mezzanine-ui/vue/input';
 * <\/script>
 *
 * <template>
 *   <MznPasswordStrengthIndicator strength="medium" />
 * </template>
 * ```
 *
 * @see MznInput `variant="password"` 時可顯示這個指示條
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PasswordStrengthIndicatorProps>(), {
  hintTexts: undefined,
  strength: 'weak',
  strengthText: undefined,
  strengthTextPrefix: '密碼強度：',
});

const attrs = useAttrs();

const strengthText = computed(
  (): string =>
    props.strengthText ||
    (props.strength === 'weak'
      ? '低'
      : props.strength === 'medium'
        ? '中'
        : '高'),
);

const hostClasses = computed((): string =>
  clsx(classes.host, attrs.class as string),
);

const barClasses = computed((): string =>
  clsx(classes.bar, classes.barState(props.strength)),
);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});

const hintTextGroupClass = classes.hintTextGroup;
const textClass = classes.text;
</script>

<template>
  <div :class="hostClasses" v-bind="forwardedAttrs">
    <div :class="barClasses" />
    <span :class="textClass"
      >{{ strengthTextPrefix }}<mark>{{ strengthText }}</mark></span
    >
    <div v-if="hintTexts && hintTexts.length > 0" :class="hintTextGroupClass">
      <MznFormHintText
        v-for="(hintText, index) in hintTexts"
        :key="index"
        :hint-text="hintText.hint"
        :severity="hintText.severity"
      />
    </div>
  </div>
</template>
