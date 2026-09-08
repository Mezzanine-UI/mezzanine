<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { messageClasses as classes } from '@mezzanine-ui/core/message';
import clsx from 'clsx';
import MznIcon from '../icon/icon.vue';
import MznSpin from '../spin/spin.vue';
import MznTranslate from '../transition/translate.vue';
import { messageTimerController } from './message-timer-controller';
import { message } from './message';
import type { MessageData } from './message.types';

/**
 * 單則訊息的呈現，由 Message 工廠負責建立，一般不直接使用。
 *
 * 停留時間到就自動關閉；滑鼠移入或取得焦點時**整疊訊息**一起暫停計時，
 * 移出後再一起恢復 —— 指標只蓋住一則，但被擋住的閱讀時間是所有人的。
 * `duration: false`（loading 用）則完全不計時。
 *
 * @see createNotifier 建立訊息佇列的工廠
 */
const props = withDefaults(defineProps<MessageData>(), {
  children: undefined,
  duration: undefined,
  easing: undefined,
  from: 'bottom',
  icon: undefined,
  onEnter: undefined,
  onEntered: undefined,
  onEntering: undefined,
  onExit: undefined,
  onExited: undefined,
  onExiting: undefined,
  reference: undefined,
  severity: undefined,
});

const open = ref(true);

let timer: number | null = null;
let remainingTime = props.duration || 0;
let startTime = 0;

// 清理計時器
function clearTimer(): void {
  if (timer) {
    window.clearTimeout(timer);
    timer = null;
  }
}

// 開始計時器
function startTimer(time: number): void {
  clearTimer();

  if (time > 0) {
    startTime = Date.now();
    remainingTime = time;
    timer = window.setTimeout(() => {
      open.value = false;
    }, time);
  }
}

// 暫停計時器
function pauseTimer(): void {
  if (timer) {
    clearTimer();

    const elapsed = Date.now() - startTime;

    remainingTime = Math.max(0, remainingTime - elapsed);
  }
}

// 恢復計時器
function resumeTimer(): void {
  if (remainingTime > 0) startTimer(remainingTime);
}

// 初始設定計時器
watch(
  [open, (): MessageData['duration'] => props.duration],
  ([isOpen, duration]) => {
    if (isOpen && duration) startTimer(duration);
    // duration 為 false 時，清除計時器（不自動關閉）
    else if (isOpen && duration === false) clearTimer();
  },
  { immediate: true },
);

// 註冊到全域控制器
watch(
  [
    (): MessageData['reference'] => props.reference,
    (): MessageData['duration'] => props.duration,
  ],
  ([reference, duration], _previous, onCleanup) => {
    if (!reference || !duration) return;

    messageTimerController.register(reference, {
      pause: pauseTimer,
      resume: resumeTimer,
    });

    onCleanup(() => messageTimerController.unregister(reference));
  },
  { immediate: true },
);

// 清理計時器（元件卸載時）
onBeforeUnmount(clearTimer);

function onExited(node: HTMLElement): void {
  props.onExited?.(node);

  if (props.reference) message.remove(props.reference);
}

function pauseAll(): void {
  messageTimerController.pause();
}

function resumeAll(): void {
  messageTimerController.resume();
}

const hostClasses = computed((): string =>
  clsx(classes.host, props.severity ? classes.severity(props.severity) : ''),
);

const iconClass = classes.icon;
const contentClass = classes.content;
</script>

<template>
  <MznTranslate
    appear
    :easing="easing"
    :from="from"
    :in="open"
    @enter="onEnter"
    @entered="onEntered"
    @entering="onEntering"
    @exit="onExit"
    @exited="onExited"
    @exiting="onExiting"
  >
    <div
      :class="hostClasses"
      role="status"
      @blur="resumeAll"
      @focus="pauseAll"
      @mouseenter="pauseAll"
      @mouseleave="resumeAll"
    >
      <span v-if="severity === 'loading'" :class="iconClass">
        <MznSpin loading size="minor" />
      </span>
      <MznIcon v-else-if="icon" :class="iconClass" :icon="icon" />
      <span :class="contentClass">{{ children }}</span>
    </div>
  </MznTranslate>
</template>
