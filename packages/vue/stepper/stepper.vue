<script setup lang="ts">
import {
  cloneVNode,
  computed,
  onMounted,
  ref,
  shallowRef,
  useSlots,
  watch,
} from 'vue';
import type { CSSProperties, FunctionalComponent } from 'vue';
import { stepperClasses as classes } from '@mezzanine-ui/core/stepper';
import clsx from 'clsx';
import { flattenChildren } from '../_internal/flatten-children';
import { resolveElement } from '../_internal/resolve-element';
import { useStepDistance } from './use-step-distance';
import type { StepProps } from './step.types';
import type { StepperProps } from './stepper.types';

/**
 * 步驟進度指示器元件，以線性流程呈現多個步驟的完成狀態。
 *
 * 預設 slot 必須是 MznStep；`currentStep` 控制當前進行中的步驟（零基索引），
 * 之前的步驟自動標記為已完成，之後的步驟為待處理。支援 `horizontal`（水平）與
 * `vertical`（垂直）排列，以及 `number`（數字）與 `dot`（圓點）兩種指示器樣式。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznStep, MznStepper } from '@mezzanine-ui/vue/stepper';
 * <\/script>
 *
 * <template>
 *   <MznStepper :current-step="1">
 *     <MznStep title="填寫資料" description="請輸入基本資訊" />
 *     <MznStep title="確認內容" description="核對填寫資料" />
 *     <MznStep title="完成送出" />
 *   </MznStepper>
 *
 *   <MznStepper :current-step="0" orientation="vertical" type="dot">
 *     <MznStep title="步驟一" />
 *     <MznStep title="步驟二" />
 *   </MznStepper>
 * </template>
 * ```
 *
 * @see useStepper 管理步驟狀態的 composable
 */
const props = withDefaults(defineProps<StepperProps>(), {
  currentStep: 0,
  orientation: 'horizontal',
  type: 'number',
});

const emit = defineEmits<{
  stepChange: [stepIndex: number];
}>();

defineSlots<{
  /**
   * Three or more MznStep components.
   */
  default?: () => unknown;
}>();

const slots = useSlots();

const stepper = ref<HTMLElement | null>(null);
const steps = ref<(HTMLElement | null)[]>([]);

/**
 * The slot is read inside the render function below, not in a computed: Vue
 * warns that a slot invoked outside render does not track its dependencies,
 * and a stepper whose steps come from a `v-for` would stop updating.
 */
const stepCount = shallowRef(0);

const stepPositions = useStepDistance({
  count: () => stepCount.value,
  orientation: () => props.orientation,
  stepper,
  steps,
  type: () => props.type,
});

const getStepStatus = (
  index: number,
  processingIndex: number,
): StepProps['status'] => {
  if (index === processingIndex) return 'processing';
  if (index < processingIndex) return 'succeeded';

  return 'pending';
};

/**
 * Each step is cloned with the state the stepper owns — index, orientation,
 * status, type — plus the measured connect-line distance, mirroring React's
 * `cloneElement`. The child's own style is repeated last so it still wins.
 */
const Steps: FunctionalComponent = () => {
  const children = flattenChildren(slots.default?.());

  stepCount.value = children.length;

  return children.map((child, index) => {
    const distance = stepPositions.value.distances?.[index];
    const ownStyle: CSSProperties = {
      '--connect-line-distance': distance ? `${distance}px` : undefined,
    } as CSSProperties;

    return cloneVNode(child, {
      index,
      orientation: props.orientation,
      ref: (element) => {
        steps.value[index] = resolveElement(element);
      },
      status: getStepStatus(index, props.currentStep),
      style: [ownStyle, (child.props as { style?: unknown })?.style],
      type: props.type,
    });
  });
};

const hostClasses = computed((): string =>
  clsx(classes.host, {
    [classes.horizontal]: props.orientation === 'horizontal',
    [classes.vertical]: props.orientation === 'vertical',
    [classes.dot]: props.type === 'dot',
    [classes.number]: props.type === 'number',
  }),
);

/**
 * React reports the step in an effect keyed on `currentStep`, so it fires once
 * on mount as well as on every change.
 */
onMounted(() => emit('stepChange', props.currentStep));

watch(
  (): number => props.currentStep,
  (stepIndex) => emit('stepChange', stepIndex),
);
</script>

<template>
  <div ref="stepper" :class="hostClasses">
    <Steps />
  </div>
</template>
