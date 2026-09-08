import { onBeforeUnmount, onMounted, shallowRef, watch } from 'vue';
import type { Ref, ShallowRef } from 'vue';
import { stepClasses } from '@mezzanine-ui/core/stepper';

export interface StepPosition {
  height: number;
  width: number;
  x: number;
  y: number;
}

export interface StepDistances {
  distances: number[];
  positions: StepPosition[];
}

export interface UseStepDistanceOptions {
  /**
   * Reads how many steps there are, so the measurement re-runs when one is
   * added or removed.
   */
  count: () => number;
  orientation: () => 'horizontal' | 'vertical';
  stepper: Ref<HTMLElement | null>;
  steps: Ref<(HTMLElement | null)[]>;
  type: () => 'dot' | 'number';
}

/**
 * 量測每個步驟之間的距離，供連接線的 `--connect-line-distance` 使用。
 *
 * 逐字移植自 React 的 `useStepDistance`：三種排列（水平數字、水平圓點、垂直）
 * 各有自己的量測起點，並在 resize 時重算。React 用 layout effect，Vue 對應的是
 * `onMounted` 加上 post-flush 的 watcher —— 都是「DOM 更新後、繪製前」。
 */
export function useStepDistance(
  options: UseStepDistanceOptions,
): ShallowRef<StepDistances> {
  const stepPositions = shallowRef<StepDistances>({
    distances: [],
    positions: [],
  });

  function calculatePositions(): void {
    const stepperElement = options.stepper.value;

    if (!stepperElement || options.steps.value.length === 0) return;

    const stepperRect = stepperElement.getBoundingClientRect();
    const positions: StepPosition[] = [];
    const distances: number[] = [];

    options.steps.value.forEach((stepElement) => {
      if (stepElement) {
        const stepRect = stepElement.getBoundingClientRect();

        positions.push({
          height: stepRect.height,
          width: stepRect.width,
          x: stepRect.left - stepperRect.left,
          y: stepRect.top - stepperRect.top,
        });
      }
    });

    // Calculate distance between each pair of adjacent steps
    for (let i = 0; i < positions.length - 1; i += 1) {
      const next = positions[i + 1];
      const currentStepElement = options.steps.value[i];

      if (
        options.orientation() === 'horizontal' &&
        options.type() === 'number'
      ) {
        // Horizontal number version: from current step title to next step start
        const titleElement = currentStepElement?.querySelector(
          `.${stepClasses.titleConnectLine}`,
        );

        if (titleElement) {
          const titleRect = titleElement.getBoundingClientRect();
          const titleEnd = titleRect.right - stepperRect.left;

          distances.push(next.x - titleEnd);
        } else {
          distances.push(0);
        }
      } else if (
        options.orientation() === 'horizontal' &&
        options.type() === 'dot'
      ) {
        // Horizontal dot version: calculate x-axis distance from status-indicator
        const statusIndicatorElement = currentStepElement?.querySelector(
          `.${stepClasses.statusIndicator}`,
        );

        if (statusIndicatorElement) {
          const statusIndicatorRect =
            statusIndicatorElement.getBoundingClientRect();
          const statusIndicatorEnd =
            statusIndicatorRect.right - stepperRect.left;

          distances.push(
            next.x +
              next.width / 2 -
              statusIndicatorEnd -
              statusIndicatorElement.clientWidth / 2,
          );
        } else {
          distances.push(0);
        }
      } else {
        // Vertical orientation: calculate y-axis distance
        const statusIndicatorElement = currentStepElement?.querySelector(
          `.${stepClasses.statusIndicator}`,
        );

        if (statusIndicatorElement) {
          const statusIndicatorRect =
            statusIndicatorElement.getBoundingClientRect();
          const statusIndicatorEnd =
            statusIndicatorRect.bottom - stepperRect.top;

          distances.push(next.y - statusIndicatorEnd);
        } else {
          distances.push(0);
        }
      }
    }

    stepPositions.value = { distances, positions };
  }

  onMounted(() => {
    calculatePositions();
    window.addEventListener('resize', calculatePositions);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', calculatePositions);
  });

  watch(
    [options.orientation, options.type, options.count],
    calculatePositions,
    { flush: 'post' },
  );

  return stepPositions;
}
