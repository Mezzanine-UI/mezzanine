<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { DotHorizontalIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import MznButton from '../button/button.vue';
import MznDropdown from '../dropdown/dropdown.vue';
import MznToggle from '../toggle/toggle.vue';
import type { BaseCardComponent, BaseCardProps } from './base-card.types';

/**
 * 通用卡片，可渲染成 div、連結或任意元件。
 *
 * `type` 決定標題列右側放什麼 —— `default` 什麼都不放、`action` 放一顆文字按鈕、
 * `overflow` 放一個下拉選單、`toggle` 放一個開關。沒有 `title` 也沒有
 * `description` 時整條標題列都不渲染。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznBaseCard } from '@mezzanine-ui/vue/card';
 * <\/script>
 *
 * <template>
 *   <MznBaseCard description="說明" title="標題">內容</MznBaseCard>
 *   <MznBaseCard action-name="查看" title="標題" type="action" @action-click="open">
 *     內容
 *   </MznBaseCard>
 * </template>
 * ```
 *
 * @see MznCardGroup 把多張卡片排成一列
 */
/**
 * React spreads only the props it did not destructure onto the host, and
 * `component` is one it takes out. Vue's fallthrough would leave it on the
 * element as an attribute.
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<BaseCardProps>(), {
  actionName: undefined,
  actionVariant: 'base-text-link',
  checked: undefined,
  defaultChecked: undefined,
  description: undefined,
  disabled: false,
  options: undefined,
  readOnly: false,
  title: undefined,
  toggleLabel: undefined,
  toggleSize: undefined,
  toggleSupportingText: undefined,
  type: 'default',
});

const emit = defineEmits<{
  actionClick: [event: MouseEvent];
  optionSelect: [option: DropdownOption];
  toggleChange: [event: Event];
}>();

defineSlots<{
  /** The card's content area. */
  default?: () => unknown;
}>();

const attrs = useAttrs();

const component = computed(
  (): BaseCardComponent => (attrs.component as BaseCardComponent) ?? 'div',
);

const forwardedAttrs = computed(() => {
  const { class: _class, component: _component, ...rest } = attrs;

  return rest;
});

const hasHeaderContent = computed((): boolean =>
  Boolean(props.title || props.description),
);

function onActionClick(event: MouseEvent): void {
  event.stopPropagation();
  emit('actionClick', event);
}

const hostClasses = computed((): string =>
  clsx(
    classes.base,
    {
      [classes.baseDisabled]: props.disabled,
      [classes.baseReadOnly]: props.readOnly,
    },
    attrs.class as string,
  ),
);

const contentClass = classes.baseContent;
const headerActionClass = classes.baseHeaderAction;
const headerClass = classes.baseHeader;
const headerContentWrapperClass = classes.baseHeaderContentWrapper;
const headerDescriptionClass = classes.baseHeaderDescription;
const headerTitleClass = classes.baseHeaderTitle;
</script>

<template>
  <component
    :is="component"
    v-bind="forwardedAttrs"
    :aria-disabled="disabled || undefined"
    :aria-readonly="readOnly || undefined"
    :class="hostClasses"
  >
    <div v-if="hasHeaderContent" :class="headerClass">
      <div :class="headerContentWrapperClass">
        <span v-if="title" :class="headerTitleClass">{{ title }}</span>
        <span v-if="description" :class="headerDescriptionClass">
          {{ description }}
        </span>
      </div>
      <div v-if="type === 'action'" :class="headerActionClass">
        <MznButton
          :disabled="disabled"
          size="sub"
          type="button"
          :variant="actionVariant"
          @click="onActionClick"
        >
          {{ actionName }}
        </MznButton>
      </div>
      <div v-else-if="type === 'overflow'" :class="headerActionClass">
        <MznDropdown
          :disabled="disabled"
          :global-portal="false"
          mode="single"
          :options="options ?? []"
          @select="emit('optionSelect', $event)"
        >
          <template #default="triggerProps">
            <MznButton
              v-bind="triggerProps"
              :disabled="disabled"
              :icon="DotHorizontalIcon"
              icon-type="icon-only"
              size="sub"
              type="button"
              variant="base-text-link"
            />
          </template>
        </MznDropdown>
      </div>
      <div v-else-if="type === 'toggle'" :class="headerActionClass">
        <MznToggle
          :checked="checked"
          :default-checked="defaultChecked"
          :disabled="disabled"
          :label="toggleLabel"
          :size="toggleSize"
          :supporting-text="toggleSupportingText"
          @change="emit('toggleChange', $event)"
        />
      </div>
    </div>
    <div :class="contentClass"><slot /></div>
  </component>
</template>
