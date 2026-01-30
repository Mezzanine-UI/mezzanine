import {
  TimePanelUnit,
  timePanelClasses as classes,
} from '@mezzanine-ui/core/time-panel';
import { forwardRef, useCallback, useEffect, useRef } from 'react';
import Scrollbar from '../Scrollbar';
import { cx } from '../utils/cx';

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
    const { activeUnit, cellHeight = 32, onChange, units } = props;

    const viewportRef = useRef<HTMLDivElement>(null);

    const getChangeHandler = useCallback(
      (unit: TimePanelUnit) => () => {
        onChange?.(unit);
      },
      [onChange],
    );

    const preferSmoothScrollRef = useRef(true);

    useEffect(() => {
      const activeIndex = units.findIndex(({ value }) => value === activeUnit);

      if (viewportRef.current) {
        viewportRef.current.scrollTo({
          behavior: preferSmoothScrollRef.current ? 'auto' : 'smooth',
          top: activeIndex * cellHeight, // (activeIndex - 3) * cellHeight, (center)
        });
      }

      preferSmoothScrollRef.current = false;
    }, [activeUnit, cellHeight, units]);

    const handleViewportReady = useCallback((viewport: HTMLDivElement) => {
      viewportRef.current = viewport;
    }, []);

    return (
      <div ref={ref} className={classes.column}>
        <Scrollbar
          maxHeight={cellHeight * 7}
          onViewportReady={handleViewportReady}
        >
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
        </Scrollbar>
      </div>
    );
  },
);

export default TimePanelColumn;
