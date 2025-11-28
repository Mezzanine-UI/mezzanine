'use client';

import {
  calendarClasses,
  CalendarMode,
  DateType,
} from '@mezzanine-ui/core/calendar';
import castArray from 'lodash/castArray';
import { forwardRef, RefObject, useCallback } from 'react';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Calendar, { CalendarProps } from './Calendar';
import { useCalendarContext } from './CalendarContext';
import { useRangeCalendarControls } from './useRangeCalendarControls';
import CalendarFooterActions, {
  CalendarFooterActionsProps,
} from './CalendarFooterActions';
import CalendarQuickSelect, {
  CalendarQuickSelectProps,
} from './CalendarQuickSelect';

export interface RangeCalendarProps
  extends Omit<
      NativeElementPropsWithoutKeyAndRef<'div'>,
      'onChange' | 'children'
    >,
    Pick<
      CalendarProps,
      | 'renderAnnotations'
      | 'isDateDisabled'
      | 'isDateInRange'
      | 'onDateHover'
      | 'displayWeekDayLocale'
      | 'isMonthDisabled'
      | 'isMonthInRange'
      | 'onMonthHover'
      | 'displayMonthLocale'
      | 'isWeekDisabled'
      | 'isWeekInRange'
      | 'onWeekHover'
      | 'isYearDisabled'
      | 'isYearInRange'
      | 'onYearHover'
      | 'isQuarterDisabled'
      | 'isQuarterInRange'
      | 'onQuarterHover'
      | 'isHalfYearDisabled'
      | 'isHalfYearInRange'
      | 'onHalfYearHover'
      | 'disabledMonthSwitch'
      | 'disabledYearSwitch'
      | 'disableOnNext'
      | 'disableOnPrev'
      | 'disableOnDoubleNext'
      | 'disableOnDoublePrev'
    > {
  /**
   * Footer action buttons props
   */
  actions?: CalendarFooterActionsProps['actions'];
  /**
   * Other props you may provide to each `Calendar`
   */
  calendarProps?: Omit<
    CalendarProps,
    | 'mode'
    | 'value'
    | 'onChange'
    | 'referenceDate'
    | 'onNext'
    | 'onPrev'
    | 'onDoubleNext'
    | 'onDoublePrev'
    | 'onMonthControlClick'
    | 'onYearControlClick'
  >;
  /**
   * React Ref for the first (left) calendar
   */
  firstCalendarRef?: RefObject<HTMLDivElement | null>;
  /**
   * Use this prop to switch calendars.
   * @default 'day'
   */
  mode?: CalendarMode;
  /**
   * Click handler for every cell on calendars.
   */
  onChange?: (target: DateType) => void;
  /**
   * Quick select options for range calendar.
   * Provide options for users to quickly select specific date ranges.
   */
  quickSelect?: Pick<CalendarQuickSelectProps, 'activeId' | 'options'>;
  /**
   * The reference date for getting the calendar.
   * **The type of `referenceDate` should be the same as your declared `DateType`.**
   */
  referenceDate: DateType;
  /**
   * React Ref for the second (right) calendar
   */
  secondCalendarRef?: RefObject<HTMLDivElement | null>;
  /**
   * The displaying cells will be marked as active
   * if the single value of it matches any date object in the array.
   * **The type of `value` should be the same as your declared `DateType`.**
   */
  value?: DateType | DateType[];
}

/**
 * The react component for `mezzanine` range calendar.
 * Displays two calendars side by side for range selection.
 * Notice that any component related to calendar should be used along with `CalendarContext`.
 */
const RangeCalendar = forwardRef<HTMLDivElement, RangeCalendarProps>(
  function RangeCalendar(props, ref) {
    const { getMonth, getYear, setMonth, setYear } = useCalendarContext();

    const {
      actions,
      renderAnnotations,
      calendarProps,
      className,
      disabledMonthSwitch,
      disabledYearSwitch,
      disableOnNext,
      disableOnPrev,
      disableOnDoubleNext,
      disableOnDoublePrev,
      displayMonthLocale,
      displayWeekDayLocale,
      firstCalendarRef,
      isDateDisabled,
      isDateInRange,
      isMonthDisabled,
      isMonthInRange,
      isWeekDisabled,
      isWeekInRange,
      isYearDisabled,
      isYearInRange,
      isQuarterDisabled,
      isQuarterInRange,
      isHalfYearDisabled,
      isHalfYearInRange,
      mode = 'day',
      onChange: onChangeProp,
      onDateHover,
      onMonthHover,
      onWeekHover,
      onYearHover,
      onQuarterHover,
      onHalfYearHover,
      quickSelect,
      referenceDate: referenceDateProp,
      secondCalendarRef,
      value: valueProp,
      ...restProps
    } = props;

    const value = valueProp ? castArray(valueProp) : undefined;

    const {
      currentMode,
      onMonthControlClick,
      onFirstPrev,
      onFirstDoublePrev,
      onSecondNext,
      onSecondDoubleNext,
      onYearControlClick,
      popModeStack,
      referenceDates,
      updateFirstReferenceDate,
      updateSecondReferenceDate,
    } = useRangeCalendarControls(referenceDateProp, mode);

    const onChangeFactory = useCallback(
      (calendar: 0 | 1) => {
        const targetDate = referenceDates[calendar];
        const updateReferenceDate = calendar
          ? updateSecondReferenceDate
          : updateFirstReferenceDate;

        if (currentMode === 'day' || currentMode === 'week') {
          return (target: DateType) => {
            updateReferenceDate(target);
            popModeStack();

            if (currentMode === mode && onChangeProp) {
              onChangeProp(target);
            }
          };
        }

        if (currentMode === 'month') {
          return (target: DateType) => {
            const result =
              currentMode === mode
                ? target
                : setMonth(targetDate, getMonth(target));

            updateReferenceDate(result);
            popModeStack();

            if (currentMode === mode && onChangeProp) {
              onChangeProp(result);
            }
          };
        }

        if (currentMode === 'year') {
          return (target: DateType) => {
            const result =
              currentMode === mode
                ? target
                : setYear(targetDate, getYear(target));

            updateReferenceDate(result);
            popModeStack();

            if (currentMode === mode && onChangeProp) {
              onChangeProp(result);
            }
          };
        }

        if (currentMode === 'quarter') {
          return (target: DateType) => {
            updateReferenceDate(target);
            popModeStack();

            if (currentMode === mode && onChangeProp) {
              onChangeProp(target);
            }
          };
        }

        if (currentMode === 'half-year') {
          return (target: DateType) => {
            updateReferenceDate(target);
            popModeStack();

            if (currentMode === mode && onChangeProp) {
              onChangeProp(target);
            }
          };
        }

        return undefined;
      },
      [
        currentMode,
        getMonth,
        getYear,
        mode,
        onChangeProp,
        popModeStack,
        referenceDates,
        setMonth,
        setYear,
        updateFirstReferenceDate,
        updateSecondReferenceDate,
      ],
    );

    return (
      <div
        {...restProps}
        ref={ref}
        className={cx(calendarClasses.host, className)}
      >
        {quickSelect && (
          <CalendarQuickSelect
            activeId={quickSelect.activeId}
            options={quickSelect.options}
          />
        )}
        <div className={calendarClasses.mainWithFooter}>
          <div style={{ display: 'inline-flex', flexFlow: 'row' }}>
            <Calendar
              {...calendarProps}
              renderAnnotations={renderAnnotations}
              className={cx(
                calendarClasses.noShadowHost,
                calendarProps?.className,
              )}
              ref={firstCalendarRef}
              mode={currentMode}
              value={value}
              onChange={onChangeFactory(0)}
              referenceDate={referenceDates[0]}
              onPrev={onFirstPrev}
              onDoublePrev={onFirstDoublePrev}
              onMonthControlClick={onMonthControlClick}
              onYearControlClick={onYearControlClick}
              disabledFooterControl
              disabledMonthSwitch={disabledMonthSwitch}
              disabledYearSwitch={disabledYearSwitch}
              disableOnPrev={disableOnPrev}
              disableOnDoublePrev={disableOnDoublePrev}
              displayMonthLocale={displayMonthLocale}
              displayWeekDayLocale={displayWeekDayLocale}
              isDateDisabled={isDateDisabled}
              isDateInRange={isDateInRange}
              onDateHover={onDateHover}
              isMonthDisabled={isMonthDisabled}
              isMonthInRange={isMonthInRange}
              onMonthHover={onMonthHover}
              isWeekDisabled={isWeekDisabled}
              isWeekInRange={isWeekInRange}
              onWeekHover={onWeekHover}
              isYearDisabled={isYearDisabled}
              isYearInRange={isYearInRange}
              onYearHover={onYearHover}
              isQuarterDisabled={isQuarterDisabled}
              isQuarterInRange={isQuarterInRange}
              onQuarterHover={onQuarterHover}
              isHalfYearDisabled={isHalfYearDisabled}
              isHalfYearInRange={isHalfYearInRange}
              onHalfYearHover={onHalfYearHover}
            />
            <Calendar
              {...calendarProps}
              renderAnnotations={renderAnnotations}
              className={cx(
                calendarClasses.noShadowHost,
                calendarProps?.className,
              )}
              ref={secondCalendarRef}
              mode={currentMode}
              value={value}
              onChange={onChangeFactory(1)}
              referenceDate={referenceDates[1]}
              onNext={onSecondNext}
              onDoubleNext={onSecondDoubleNext}
              onMonthControlClick={onMonthControlClick}
              onYearControlClick={onYearControlClick}
              disabledFooterControl
              disabledMonthSwitch={disabledMonthSwitch}
              disabledYearSwitch={disabledYearSwitch}
              disableOnNext={disableOnNext}
              disableOnDoubleNext={disableOnDoubleNext}
              displayMonthLocale={displayMonthLocale}
              displayWeekDayLocale={displayWeekDayLocale}
              isDateDisabled={isDateDisabled}
              isDateInRange={isDateInRange}
              onDateHover={onDateHover}
              isMonthDisabled={isMonthDisabled}
              isMonthInRange={isMonthInRange}
              onMonthHover={onMonthHover}
              isWeekDisabled={isWeekDisabled}
              isWeekInRange={isWeekInRange}
              onWeekHover={onWeekHover}
              isYearDisabled={isYearDisabled}
              isYearInRange={isYearInRange}
              onYearHover={onYearHover}
              isQuarterDisabled={isQuarterDisabled}
              isQuarterInRange={isQuarterInRange}
              onQuarterHover={onQuarterHover}
              isHalfYearDisabled={isHalfYearDisabled}
              isHalfYearInRange={isHalfYearInRange}
              onHalfYearHover={onHalfYearHover}
            />
          </div>
          <CalendarFooterActions
            actions={{
              secondaryButtonProps: {
                children: 'Cancel',
                disabled: false,
                ...actions?.secondaryButtonProps,
              },
              primaryButtonProps: {
                children: 'Ok',
                disabled: false,
                ...actions?.primaryButtonProps,
              },
            }}
          />
        </div>
      </div>
    );
  },
);

export default RangeCalendar;
