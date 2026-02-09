import {
  TimePanelUnit,
  timePanelClasses as classes,
} from '@mezzanine-ui/core/time-panel';
import { forwardRef, useCallback, useEffect, useRef } from 'react';
import Scrollbar from '../Scrollbar';
import { cx } from '../utils/cx';
import { getNumericCSSVariablePixelValue } from '../utils/get-css-variable-value';

export interface TimePanelColumnProps {
  /**
   * The active unit of time.
   */
  activeUnit?: TimePanelUnit['value'];
  /**
   * `cellHeight` controls the scroll positioning. This should meet the value of the computed cell height.
   */
  cellHeight?: number;
  /**
   * Change handler. Takes `TimePanelUnit` as its argument.
   */
  onChange?: (unit: TimePanelUnit) => void;
  /**
   * Display units inside the column.
   */
  units: TimePanelUnit[];
}

/**
 * The react component for `mezzanine` time panel column.
 */
const TimePanelColumn = forwardRef<HTMLDivElement, TimePanelColumnProps>(
  function TimePanelColumn(props, ref) {
    const { activeUnit, cellHeight: cellHeightProp, onChange, units } = props;

    const cellHeight =
      cellHeightProp ??
      getNumericCSSVariablePixelValue('--mzn-spacing-size-element-loose');

    const viewportRef = useRef<HTMLDivElement>(null);

    const getChangeHandler = useCallback(
      (unit: TimePanelUnit) => () => {
        onChange?.(unit);
      },
      [onChange],
    );

    const preferSmoothScrollRef = useRef(true);
    const onScrollToTarget = useCallback(
      (element: HTMLDivElement) => {
        const activeIndex = units.findIndex(
          ({ value }) => value === activeUnit,
        );

        element.scrollTo({
          behavior: preferSmoothScrollRef.current ? 'auto' : 'smooth',
          top: activeIndex * cellHeight,
        });

        preferSmoothScrollRef.current = false;
      },
      [activeUnit, cellHeight, units],
    );

    useEffect(() => {
      if (viewportRef.current) {
        onScrollToTarget(viewportRef.current);
      }
    }, [onScrollToTarget]);

    const handleViewportReady = useCallback(
      (viewport: HTMLDivElement) => {
        viewportRef.current = viewport;

        onScrollToTarget(viewport);
      },
      [onScrollToTarget],
    );

    // Number of padding cells needed for centering (3 cells above and below the center position)
    const paddingCellCount = 3;
    const placeholders = Array.from({ length: paddingCellCount }, (_, i) => (
      <div
        key={`placeholder-${i}`}
        className={classes.columnPlaceholder}
        style={{ height: cellHeight }}
        aria-hidden
      />
    ));

    return (
      <div ref={ref} className={classes.column}>
        <Scrollbar
          maxHeight={cellHeight * 7}
          onViewportReady={handleViewportReady}
        >
          {placeholders}
          {units.map((unit) => (
            <button
              key={unit.value}
              type="button"
              className={cx(classes.button, classes.columnButton, {
                [classes.buttonActive]: unit.value === activeUnit,
              })}
              onClick={getChangeHandler(unit)}
            >
              {unit.label}
            </button>
          ))}
          {placeholders}
        </Scrollbar>
      </div>
    );
  },
);

export default TimePanelColumn;
