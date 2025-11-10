import { stepClasses } from '@mezzanine-ui/core/stepper';
import { useLayoutEffect, useState } from 'react';

export const useStepDistance = (
  orientation: 'horizontal' | 'vertical',
  stepperRef: React.RefObject<HTMLDivElement | null>,
  stepRefs: React.RefObject<Array<HTMLDivElement | null>>,
  type: 'dot' | 'number',
  childrenArray: Array<Exclude<React.ReactNode, boolean | null | undefined>>,
) => {
  const [stepPositions, setStepPositions] = useState<{
    distances: number[];
    positions: Array<{ x: number; y: number; width: number; height: number }>;
  }>({ distances: [], positions: [] });

  // Calculate position and distance between each step
  useLayoutEffect(() => {
    const calculatePositions = () => {
      if (!stepperRef.current || stepRefs.current.length === 0) return;

      const stepperRect = stepperRef.current.getBoundingClientRect();
      const positions: Array<{
        x: number;
        y: number;
        width: number;
        height: number;
      }> = [];
      const distances: number[] = [];

      stepRefs.current.forEach((stepElement) => {
        if (stepElement) {
          const stepRect = stepElement.getBoundingClientRect();
          positions.push({
            x: stepRect.left - stepperRect.left,
            y: stepRect.top - stepperRect.top,
            width: stepRect.width,
            height: stepRect.height,
          });
        }
      });

      // Calculate distance between each pair of adjacent steps
      for (let i = 0; i < positions.length - 1; i += 1) {
        const next = positions[i + 1];
        const currentStepElement = stepRefs.current[i];

        if (orientation === 'horizontal' && type === 'number') {
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
        } else if (orientation === 'horizontal' && type === 'dot') {
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

      setStepPositions({ distances, positions });
    };

    calculatePositions();

    // Add resize listener to recalculate positions on window resize
    window.addEventListener('resize', calculatePositions);

    return () => {
      window.removeEventListener('resize', calculatePositions);
    };
  }, [orientation, type, childrenArray?.length, stepperRef, stepRefs]);

  return stepPositions;
};
