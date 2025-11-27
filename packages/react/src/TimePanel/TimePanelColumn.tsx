import {
  TimePanelUnit,
  timePanelClasses as classes,
} from '@mezzanine-ui/core/time-panel';
import { forwardRef, useEffect, useRef } from 'react';
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

    const cellsRef = useRef<HTMLDivElement>(null);

    const getChangeHandler = (unit: TimePanelUnit) => {
      if (!onChange) return undefined;

      return () => {
        onChange(unit);
      };
    };

    const preferSmoothScrollRef = useRef(true);

    useEffect(() => {
      const activeIndex = units.findIndex(({ value }) => value === activeUnit);

      if (cellsRef.current) {
        cellsRef.current.scrollTo({
          top: activeIndex * cellHeight,
          behavior: preferSmoothScrollRef.current ? 'auto' : 'smooth',
        });
      }

      preferSmoothScrollRef.current = false;
    }, [activeUnit, cellHeight, units]);

    return (
      <div ref={ref} className={classes.column}>
        <div ref={cellsRef} className={classes.columnCells}>
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
        </div>
      </div>
    );
  },
);

export default TimePanelColumn;
