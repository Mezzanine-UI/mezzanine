<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import type { ComponentPublicInstance, CSSProperties } from 'vue';
import { flip, offset } from '@floating-ui/dom';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';
import {
  notificationClasses as classes,
  notificationIcons,
} from '@mezzanine-ui/core/notification-center';
import { CloseIcon, DotHorizontalIcon } from '@mezzanine-ui/icons';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import { resolveElement } from '../_internal/resolve-element';
import MznBadge from '../badge/badge.vue';
import MznButtonGroup from '../button/button-group.vue';
import MznButton from '../button/button.vue';
import MznDropdown from '../dropdown/dropdown.vue';
import MznIcon from '../icon/icon.vue';
import MznPopper from '../popper/popper.vue';
import MznTypography from '../typography/typography.vue';
import { getTransitionStyleProps } from '../transition/get-transition-style-props';
import type { NotificationData } from './notification-center.types';

/**
 * 單則通知的呈現：`notification` 是浮動提示，`drawer` 是抽屜清單裡的一列。
 *
 * 由通知中心的工廠建立，也可以直接寫在畫面上。浮動模式從邊緣滑入、關閉時淡出；
 * 抽屜模式改用時間戳與徽章下拉，滑鼠移上今天的時間戳會浮出完整時間。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznNotificationCenter } from '@mezzanine-ui/vue/notification-center';
 * <\/script>
 *
 * <template>
 *   <MznNotificationCenter severity="success" title="儲存成功" type="notification" />
 * </template>
 * ```
 *
 * @see notificationCenter 命令式觸發通知的工廠
 * @see MznNotificationCenterDrawer 抽屜清單模式的容器
 */
const props = withDefaults(defineProps<NotificationData>(), {
  appendTips: undefined,
  cancelButtonProps: () => ({}),
  cancelButtonText: 'Cancel',
  children: undefined,
  confirmButtonProps: () => ({}),
  confirmButtonText: 'Confirm',
  description: undefined,
  duration: undefined,
  easing: undefined,
  from: 'top',
  maxVisibleNotifications: undefined,
  onBadgeClick: undefined,
  onBadgeSelect: undefined,
  onCancel: undefined,
  onClose: undefined,
  onConfirm: undefined,
  onEnter: undefined,
  onEntered: undefined,
  onExit: undefined,
  onExited: undefined,
  onViewAll: undefined,
  options: undefined,
  prependTips: undefined,
  reference: undefined,
  severity: 'info',
  showBadge: undefined,
  timeStamp: () => new Date().toLocaleTimeString(),
  timeStampLocale: 'zh-TW',
  title: undefined,
  type: 'notification',
  viewAllButtonText: undefined,
});

/**
 * The tips around a drawer notification are roots of their own, as React's
 * fragment is, and React's own component takes no native props — so there is
 * nothing to forward.
 */
defineOptions({ inheritAttrs: false });

const SLIDE_FADE_DURATION = {
  enter: MOTION_DURATION.slow,
  exit: MOTION_DURATION.moderate,
};

const SLIDE_FADE_EASING = {
  enter: MOTION_EASING.standard,
  exit: MOTION_EASING.exit,
};

const targetIcon = computed(() => notificationIcons[props.severity]);

const open = ref(true);
const openDropdown = ref(false);
const timeStampAnchor = ref<HTMLElement | null>(null);
const timeStampElement = ref<HTMLElement | null>(null);

function setTimeStamp(element: Element | ComponentPublicInstance | null): void {
  timeStampElement.value = resolveElement(element);
}

const easing = computed(() => props.easing ?? SLIDE_FADE_EASING);

const isToday = computed((): boolean => {
  try {
    const timestampDate = new Date(props.timeStamp);

    if (Number.isNaN(timestampDate.getTime())) return false;

    const now = new Date();
    const nowStartOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const timestampStartOfDay = new Date(
      timestampDate.getFullYear(),
      timestampDate.getMonth(),
      timestampDate.getDate(),
    );

    return timestampStartOfDay.getTime() === nowStartOfDay.getTime();
  } catch {
    return false;
  }
});

const formattedTimeStamp = computed((): string => {
  const { timeStamp, timeStampLocale } = props;

  try {
    const timestampDate = new Date(timeStamp);
    const timeStampText =
      typeof timeStamp === 'string' ? timeStamp : String(timeStamp);

    if (Number.isNaN(timestampDate.getTime())) return timeStampText;

    const now = Date.now();
    const nowDate = new Date(now);
    const nowStartOfDay = new Date(
      nowDate.getFullYear(),
      nowDate.getMonth(),
      nowDate.getDate(),
    );
    const timestampStartOfDay = new Date(
      timestampDate.getFullYear(),
      timestampDate.getMonth(),
      timestampDate.getDate(),
    );

    // Only show relative time if the timestamp is today
    if (nowStartOfDay.getTime() === timestampStartOfDay.getTime()) {
      const diffInSeconds = Math.round((timestampDate.getTime() - now) / 1000);
      const rtf = new Intl.RelativeTimeFormat(timeStampLocale, {
        numeric: 'always',
      });

      const units: Array<{
        seconds: number;
        unit: Intl.RelativeTimeFormatUnit;
      }> = [
        { seconds: 3600, unit: 'hour' },
        { seconds: 60, unit: 'minute' },
      ];

      for (const { seconds, unit } of units) {
        const value = Math.round(diffInSeconds / seconds);

        if (Math.abs(value) >= 1) return rtf.format(value, unit);
      }

      return 'now';
    }

    const hasTimeComponent =
      /:\d{2}/.test(timeStampText) || timeStampText.includes('T');

    const dateFormatter = new Intl.DateTimeFormat(
      timeStampLocale,
      hasTimeComponent
        ? {
            day: '2-digit',
            hour: '2-digit',
            hour12: false,
            minute: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }
        : { day: '2-digit', month: '2-digit', year: 'numeric' },
    );

    return dateFormatter.format(timestampDate).replace(/\//g, '-');
  } catch {
    return typeof timeStamp === 'string' ? timeStamp : String(timeStamp);
  }
});

let timer: number | null = null;

function clearTimer(): void {
  if (timer !== null) {
    window.clearTimeout(timer);
    timer = null;
  }
}

watch(
  [open, (): NotificationData['duration'] => props.duration],
  ([isOpen, duration]) => {
    clearTimer();

    if (isOpen && duration) {
      timer = window.setTimeout(() => {
        open.value = false;
      }, duration);
    }
  },
  { immediate: true },
);

onBeforeUnmount(clearTimer);

function onBadgeClick(): void {
  props.onBadgeClick?.();

  if (props.options && props.options.length > 0) openDropdown.value = true;
}

function onClose(): void {
  open.value = false;

  if (props.onClose && props.reference !== undefined) {
    props.onClose(props.reference);
  }
}

const onConfirm = computed(() =>
  props.onConfirm
    ? (): void => {
        open.value = false;
        props.onConfirm?.();
      }
    : undefined,
);

const onCancel = computed(() =>
  props.onCancel
    ? (): void => {
        open.value = false;
        props.onCancel?.();
      }
    : undefined,
);

function onSelect(option: DropdownOption): void {
  props.onBadgeSelect?.(option);
}

function handleMouseEnter(): void {
  if (props.type === 'drawer' && isToday.value) {
    setTimeout(() => {
      if (timeStampElement.value)
        timeStampAnchor.value = timeStampElement.value;
    }, 0);
  }
}

function handleMouseLeave(): void {
  if (props.type === 'drawer' && isToday.value) timeStampAnchor.value = null;
}

const showConfirmButton = computed((): boolean =>
  Boolean(props.confirmButtonText && props.onConfirm),
);

const showCancelButton = computed((): boolean =>
  Boolean(props.cancelButtonText && (props.onCancel || props.onClose)),
);

const hideButtons = computed(
  (): boolean =>
    !(
      props.type === 'notification' &&
      (showConfirmButton.value || showCancelButton.value)
    ),
);

/**
 * The slide and the fade are two separate transitions: entering moves the
 * notification in, leaving only fades it out where it stands.
 */
function transitionFor(property: string, mode: 'enter' | 'exit'): string {
  const { delay, duration, timingFunction } = getTransitionStyleProps(mode, {
    delay: 0,
    duration: SLIDE_FADE_DURATION,
    easing: easing.value,
  });

  return `${property} ${duration}ms ${timingFunction} ${delay}ms`;
}

const exitedTransform = computed((): string =>
  props.from === 'top' ? 'translate3d(0, -100%, 0)' : 'translate3d(100%, 0, 0)',
);

function applyStyle(
  element: HTMLElement,
  style: Record<string, number | string>,
): void {
  Object.entries(style).forEach(([property, value]) => {
    element.style.setProperty(
      property.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`),
      value == null ? '' : String(value),
    );
  });
}

/** Committed before the transition is armed, the way the shared runner does. */
function reflow(element: HTMLElement): void {
  void element.scrollTop;
}

function onBeforeEnter(element: Element): void {
  applyStyle(element as HTMLElement, {
    opacity: 0,
    transform: exitedTransform.value,
    visibility: '',
  });
}

function onEnter(element: Element, done: () => void): void {
  const node = element as HTMLElement;

  node.style.transition = transitionFor('transform', 'enter');
  reflow(node);
  props.onEnter?.(node, true);
  applyStyle(node, { opacity: 1, transform: 'translate3d(0, 0, 0)' });

  window.setTimeout(() => {
    node.style.transition = '';
    props.onEntered?.(node, true);
    done();
  }, SLIDE_FADE_DURATION.enter);
}

function onLeave(element: Element, done: () => void): void {
  const node = element as HTMLElement;

  node.style.transition = transitionFor('opacity', 'exit');
  props.onExit?.(node);
  applyStyle(node, { opacity: 0, transform: 'translate3d(0, 0, 0)' });

  window.setTimeout(() => {
    node.style.transition = '';
    applyStyle(node, {
      opacity: 0,
      transform: exitedTransform.value,
      visibility: 'hidden',
    });
    props.onExited?.(node);
    done();
  }, SLIDE_FADE_DURATION.exit);
}

const hostClasses = computed((): string[] => [
  classes.host,
  classes.severity(props.severity),
  classes.type(props.type),
]);

const TIME_STAMP_POPPER_ARROW = {
  className: classes.timeStampPopperArrow,
  enabled: true,
  padding: 0,
};

const TIME_STAMP_POPPER_STYLE: CSSProperties = {
  zIndex: 'var(--mzn-z-index-popover)',
};

const timeStampPopperOptions = {
  middleware: [offset({ mainAxis: 8 }), flip()],
  placement: 'bottom' as const,
};
</script>

<template>
  <MznTypography
    v-if="type === 'drawer' && prependTips"
    :class="classes.prependTips"
  >
    {{ prependTips }}
  </MznTypography>

  <Transition
    :appear="type === 'notification'"
    :css="false"
    @appear="(element, done) => onEnter(element, done)"
    @appear-cancelled="() => {}"
    @before-appear="onBeforeEnter"
    @before-enter="onBeforeEnter"
    @enter="(element, done) => onEnter(element, done)"
    @leave="(element, done) => onLeave(element, done)"
  >
    <div
      v-if="type !== 'notification' || open"
      :class="hostClasses"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <div v-if="targetIcon" :class="classes.iconContainer">
        <MznIcon :class="classes.severityIcon" :icon="targetIcon" :size="32" />
      </div>
      <div :class="classes.body">
        <div :class="classes.bodyContent">
          <h4 :class="classes.title">{{ title }}</h4>
          <MznTypography :class="classes.content">
            {{ description }}
          </MznTypography>
        </div>
        <MznButtonGroup v-if="!hideButtons" :class="classes.action">
          <MznButton
            v-if="showCancelButton"
            size="minor"
            variant="base-secondary"
            v-bind="cancelButtonProps"
            @click="onCancel ? onCancel() : onClose()"
          >
            {{ cancelButtonText }}
          </MznButton>
          <MznButton
            v-if="showConfirmButton"
            size="minor"
            v-bind="confirmButtonProps"
            @click="onConfirm?.()"
          >
            {{ confirmButtonText }}
          </MznButton>
        </MznButtonGroup>
        <template v-if="type === 'drawer'">
          <MznPopper
            v-if="isToday"
            :anchor="timeStampAnchor"
            :arrow="TIME_STAMP_POPPER_ARROW"
            :open="Boolean(timeStampAnchor)"
            :options="timeStampPopperOptions"
            :style="TIME_STAMP_POPPER_STYLE"
          >
            <div :class="classes.timeStampPopper">
              <MznTypography :class="classes.timeStampText">
                {{ timeStamp }}
              </MznTypography>
            </div>
          </MznPopper>
          <MznTypography
            :ref="setTimeStamp"
            :class="classes.timeStamp"
            variant="label-secondary"
          >
            {{ formattedTimeStamp }}
          </MznTypography>
        </template>
      </div>
      <MznDropdown
        v-if="type === 'drawer'"
        :open="openDropdown"
        :options="options ?? []"
        placement="bottom-end"
        z-index="var(--mzn-z-index-popover)"
        @close="openDropdown = false"
        @select="onSelect"
        @visibility-change="openDropdown = $event"
      >
        <template #default="trigger">
          <MznButton
            v-bind="trigger"
            :class="classes.dotIconButton"
            variant="base-ghost"
            @click="onClose"
          >
            <MznBadge v-if="showBadge" variant="dot-error" />
            <MznIcon
              :class="classes.closeIcon"
              :icon="DotHorizontalIcon"
              :size="16"
              @click="onBadgeClick"
            />
          </MznButton>
        </template>
      </MznDropdown>
      <MznIcon
        v-else
        :class="classes.closeIcon"
        :icon="CloseIcon"
        :size="16"
        @click="onClose"
      />
    </div>
  </Transition>

  <MznTypography
    v-if="type === 'drawer' && appendTips"
    :class="classes.appendTips"
  >
    {{ appendTips }}
  </MznTypography>
</template>
