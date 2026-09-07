<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { drawerClasses as classes } from '@mezzanine-ui/core/drawer';
import { DotHorizontalIcon } from '@mezzanine-ui/icons';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import clsx from 'clsx';
import { useDocumentEscapeKeyDown } from '../_internal/use-document-escape-key-down';
import { useTopStack } from '../_internal/use-top-stack';
import MznBackdrop from '../backdrop/backdrop.vue';
import MznButton from '../button/button.vue';
import MznClearActions from '../clear-actions/clear-actions.vue';
import MznDropdown from '../dropdown/dropdown.vue';
import MznRadioGroup from '../radio/radio-group.vue';
import MznRadio from '../radio/radio.vue';
import MznSlide from '../transition/slide.vue';
import type { DrawerProps } from './drawer.types';

/**
 * 從螢幕右側滑入的抽屜面板。
 *
 * 以 MznBackdrop 當遮罩、MznSlide 做進出場。可以帶標題列、篩選區（分頁 radio 或
 * 下拉）與底部操作列。多個抽屜同時開著時，Escape 只關最上面那一個。內容區在重新
 * 開啟時會自動重掛，也可以用 `contentKey` 自己控制。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznDrawer } from '@mezzanine-ui/vue/drawer';
 * <\/script>
 *
 * <template>
 *   <MznDrawer :open="open" isHeaderDisplay header-title="詳細資料" @close="open = false">
 *     <p>抽屜內容</p>
 *   </MznDrawer>
 * </template>
 * ```
 *
 * @see MznModal 對話框元件
 * @see MznBackdrop 遮罩層元件
 */
const props = withDefaults(defineProps<DrawerProps>(), {
  bottomGhostActionDisabled: undefined,
  bottomGhostActionIcon: undefined,
  bottomGhostActionIconType: undefined,
  bottomGhostActionLoading: undefined,
  bottomGhostActionSize: undefined,
  bottomGhostActionText: undefined,
  bottomGhostActionVariant: 'base-ghost',
  bottomOnGhostActionClick: undefined,
  bottomOnPrimaryActionClick: undefined,
  bottomOnSecondaryActionClick: undefined,
  bottomPrimaryActionDisabled: undefined,
  bottomPrimaryActionIcon: undefined,
  bottomPrimaryActionIconType: undefined,
  bottomPrimaryActionLoading: undefined,
  bottomPrimaryActionSize: undefined,
  bottomPrimaryActionText: undefined,
  bottomPrimaryActionVariant: 'base-primary',
  bottomSecondaryActionDisabled: undefined,
  bottomSecondaryActionIcon: undefined,
  bottomSecondaryActionIconType: undefined,
  bottomSecondaryActionLoading: undefined,
  bottomSecondaryActionSize: undefined,
  bottomSecondaryActionText: undefined,
  bottomSecondaryActionVariant: 'base-secondary',
  container: undefined,
  contentKey: undefined,
  disableCloseOnBackdropClick: false,
  disableCloseOnEscapeKeyDown: false,
  disablePortal: undefined,
  filterAreaAllRadioLabel: undefined,
  filterAreaCustomButtonLabel: '全部已讀',
  filterAreaDefaultValue: undefined,
  filterAreaIsEmpty: false,
  filterAreaOnCustomButtonClick: undefined,
  filterAreaOnRadioChange: undefined,
  filterAreaOnSelect: undefined,
  filterAreaOptions: () => [],
  filterAreaReadRadioLabel: undefined,
  filterAreaShow: false,
  filterAreaShowUnreadButton: false,
  filterAreaUnreadRadioLabel: undefined,
  filterAreaValue: undefined,
  headerTitle: undefined,
  isBottomDisplay: undefined,
  isHeaderDisplay: undefined,
  open: undefined,
  size: 'medium',
});

const emit = defineEmits<{
  /** Fired when the backdrop itself is clicked. */
  backdropClick: [event: MouseEvent];
  /** Fired when the drawer asks to be closed. */
  close: [];
}>();

defineSlots<{
  /** The drawer's own content. */
  default?: () => unknown;
}>();

const exited = ref(true);
const openCount = ref(0);

/** Counting the openings is what remounts the content when no key was given. */
watch(
  () => props.open,
  (open) => {
    if (open) openCount.value += 1;
  },
  { immediate: true },
);

/** Escape closes only the drawer on top. */
const checkIsOnTheTop = useTopStack(() => Boolean(props.open));

useDocumentEscapeKeyDown(() => {
  if (!props.open || props.disableCloseOnEscapeKeyDown) return undefined;

  return (event: KeyboardEvent) => {
    if (checkIsOnTheTop()) {
      event.stopPropagation();
      emit('close');
    }
  };
});

interface FilterRadio {
  key: string;
  label: string;
  value: string;
}

const filterRadios = computed((): FilterRadio[] => {
  const radios: FilterRadio[] = [];

  if (props.filterAreaAllRadioLabel) {
    radios.push({
      key: 'all',
      label: props.filterAreaAllRadioLabel,
      value: 'all',
    });
  }

  if (props.filterAreaReadRadioLabel) {
    radios.push({
      key: 'read',
      label: props.filterAreaReadRadioLabel,
      value: 'read',
    });
  }

  if (props.filterAreaUnreadRadioLabel && props.filterAreaShowUnreadButton) {
    radios.push({
      key: 'unread',
      label: props.filterAreaUnreadRadioLabel,
      value: 'unread',
    });
  }

  return radios;
});

const hasRadios = computed((): boolean => filterRadios.value.length > 0);

const hasFilterButton = computed(
  (): boolean =>
    props.filterAreaOptions.length > 0 ||
    props.filterAreaOnCustomButtonClick !== undefined,
);

const showFilterArea = computed(
  (): boolean =>
    props.filterAreaShow && (hasRadios.value || hasFilterButton.value),
);

const filterAreaClasses = computed((): string =>
  clsx(classes.filterArea, {
    [classes.filterAreaButtonOnly]: !hasRadios.value && hasFilterButton.value,
  }),
);

/**
 * Bound as objects rather than with `@change` / `@select`, because React hands
 * these straight through — a consumer that gave none leaves the child without
 * a handler at all.
 */
const filterRadioGroupBindings = computed(() => ({
  defaultValue: props.filterAreaDefaultValue ?? 'all',
  onChange: props.filterAreaOnRadioChange,
  size: 'minor' as const,
  type: 'segment' as const,
  value: props.filterAreaValue,
}));

const filterDropdownBindings = computed(() => ({
  onSelect: props.filterAreaOnSelect,
  options: props.filterAreaOptions,
  placement: 'bottom-end' as const,
}));

const hostClasses = computed((): string =>
  clsx(classes.host, classes.right, classes.size(props.size)),
);

const contentKey = computed((): number | string =>
  props.contentKey !== undefined ? props.contentKey : openCount.value,
);

const SLIDE_DURATION = {
  enter: MOTION_DURATION.moderate,
  exit: MOTION_DURATION.moderate,
};
const SLIDE_EASING = {
  enter: MOTION_EASING.entrance,
  exit: MOTION_EASING.exit,
};
</script>

<template>
  <MznBackdrop
    v-if="open || !exited"
    :class="classes.overlay"
    :container="container"
    :disable-close-on-backdrop-click="disableCloseOnBackdropClick"
    :disable-portal="disablePortal"
    :open="open"
    role="presentation"
    @backdrop-click="emit('backdropClick', $event)"
    @close="emit('close')"
  >
    <MznSlide
      :duration="SLIDE_DURATION"
      :easing="SLIDE_EASING"
      :in="open"
      @entered="exited = false"
      @exited="exited = true"
    >
      <div :class="hostClasses">
        <div v-if="isHeaderDisplay" :class="classes.header">
          {{ headerTitle }}
          <MznClearActions @click="emit('close')" />
        </div>

        <div v-if="showFilterArea" :class="filterAreaClasses">
          <MznRadioGroup v-if="hasRadios" v-bind="filterRadioGroupBindings">
            <MznRadio
              v-for="radio in filterRadios"
              :key="radio.key"
              type="segment"
              :value="radio.value"
            >
              {{ radio.label }}
            </MznRadio>
          </MznRadioGroup>
          <template v-if="hasFilterButton">
            <MznDropdown
              v-if="filterAreaOptions.length > 0"
              v-bind="filterDropdownBindings"
            >
              <template #default="trigger">
                <MznButton
                  v-bind="trigger"
                  :icon="DotHorizontalIcon"
                  icon-type="icon-only"
                  size="minor"
                  type="button"
                  variant="base-ghost"
                />
              </template>
            </MznDropdown>
            <MznButton
              v-else
              :disabled="filterAreaIsEmpty"
              size="minor"
              type="button"
              variant="base-ghost"
              @click="filterAreaOnCustomButtonClick?.()"
            >
              {{ filterAreaCustomButtonLabel }}
            </MznButton>
          </template>
        </div>

        <div :key="contentKey" :class="classes.content"><slot /></div>

        <div v-if="isBottomDisplay" :class="classes.bottom">
          <div>
            <MznButton
              v-if="bottomGhostActionText && bottomOnGhostActionClick"
              :disabled="bottomGhostActionDisabled"
              :icon="bottomGhostActionIcon"
              :icon-type="bottomGhostActionIconType"
              :loading="bottomGhostActionLoading"
              :size="bottomGhostActionSize"
              type="button"
              :variant="bottomGhostActionVariant"
              @click="bottomOnGhostActionClick()"
            >
              {{ bottomGhostActionText }}
            </MznButton>
          </div>
          <div :class="classes.bottom__actions">
            <MznButton
              v-if="bottomSecondaryActionText && bottomOnSecondaryActionClick"
              :disabled="bottomSecondaryActionDisabled"
              :icon="bottomSecondaryActionIcon"
              :icon-type="bottomSecondaryActionIconType"
              :loading="bottomSecondaryActionLoading"
              :size="bottomSecondaryActionSize"
              type="button"
              :variant="bottomSecondaryActionVariant"
              @click="bottomOnSecondaryActionClick()"
            >
              {{ bottomSecondaryActionText }}
            </MznButton>
            <MznButton
              v-if="bottomPrimaryActionText && bottomOnPrimaryActionClick"
              :disabled="bottomPrimaryActionDisabled"
              :icon="bottomPrimaryActionIcon"
              :icon-type="bottomPrimaryActionIconType"
              :loading="bottomPrimaryActionLoading"
              :size="bottomPrimaryActionSize"
              type="button"
              :variant="bottomPrimaryActionVariant"
              @click="bottomOnPrimaryActionClick()"
            >
              {{ bottomPrimaryActionText }}
            </MznButton>
          </div>
        </div>
      </div>
    </MznSlide>
  </MznBackdrop>
</template>
