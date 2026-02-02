'use client';

import {
  forwardRef,
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  calendarClasses,
  DateType,
  getDefaultModeFormat,
} from '@mezzanine-ui/core/calendar';
import {
  multipleDatePickerClasses as classes,
  MultipleDatePickerValue,
} from '@mezzanine-ui/core/multiple-date-picker';
import { CalendarIcon } from '@mezzanine-ui/icons';
import Calendar, {
  CalendarProps,
  useCalendarContext,
  useCalendarControls,
} from '../Calendar';
import { CalendarFooterActionsProps } from '../Calendar/CalendarFooterActions';
import CalendarFooterActions from '../Calendar/CalendarFooterActions';
import InputTriggerPopper, {
  InputTriggerPopperProps,
} from '../_internal/InputTriggerPopper';
import MultipleDatePickerTrigger, {
  DateValue,
  MultipleDatePickerTriggerProps,
} from './MultipleDatePickerTrigger';
import { useMultipleDatePickerValue } from './useMultipleDatePickerValue';
import { usePickerDocumentEventClose } from '../Picker';
import Icon from '../Icon';
import { cx } from '../utils/cx';
import { useComposeRefs } from '../hooks/useComposeRefs';

export interface MultipleDatePickerProps
  extends Pick<
      MultipleDatePickerTriggerProps,
      | 'className'
      | 'clearable'
      | 'disabled'
      | 'error'
      | 'fullWidth'
      | 'overflowStrategy'
      | 'prefix'
      | 'readOnly'
      | 'size'
    >,
    Pick<
      CalendarProps,
      | 'disabledMonthSwitch'
      | 'disableOnNext'
      | 'disableOnPrev'
      | 'disableOnDoubleNext'
      | 'disableOnDoublePrev'
      | 'disabledYearSwitch'
      | 'displayMonthLocale'
      | 'isDateDisabled'
    > {
  /**
   * Custom action button props. Allows overriding confirm/cancel button text and behavior.
   */
  actions?: Partial<CalendarFooterActionsProps['actions']>;
  /**
   * Other calendar props you may provide to `Calendar`.
   */
  calendarProps?: Omit<
    CalendarProps,
    | 'disableOnNext'
    | 'disableOnPrev'
    | 'disableOnDoubleNext'
    | 'disableOnDoublePrev'
    | 'displayMonthLocale'
    | 'isDateDisabled'
    | 'locale'
    | 'mode'
    | 'onChange'
    | 'onMonthControlClick'
    | 'onNext'
    | 'onDoubleNext'
    | 'onPrev'
    | 'onDoublePrev'
    | 'onYearControlClick'
    | 'referenceDate'
    | 'updateReferenceDate'
    | 'value'
  >;
  /**
   * The format for displaying date in tags.
   * @default 'YYYY-MM-DD'
   */
  format?: string;
  /**
   * Maximum number of dates that can be selected.
   */
  maxSelections?: number;
  /**
   * A function that fires when calendar toggle.
   */
  onCalendarToggle?: (open: boolean) => void;
  /**
   * Change handler. Called when user confirms the selection.
   */
  onChange?: (value: MultipleDatePickerValue) => void;
  /**
   * Placeholder text when no dates are selected.
   */
  placeholder?: string;
  /**
   * Other props you may provide to `Popper` component.
   */
  popperProps?: Omit<
    InputTriggerPopperProps,
    'anchor' | 'children' | 'fadeProps' | 'open'
  >;
  /**
   * The reference date for getting calendars. Default to current time.
   */
  referenceDate?: DateType;
  /**
   * Whether the input is required.
   * @default false
   */
  required?: boolean;
  /**
   * Controlled value - array of selected dates.
   * @default []
   */
  value?: MultipleDatePickerValue;
}

/**
 * The react component for `mezzanine` multiple date picker.
 * Allows selecting multiple dates from a calendar with manual confirmation.
 * Notice that any component related to date-picker should be used along with `CalendarContext`.
 */
const MultipleDatePicker = forwardRef<HTMLDivElement, MultipleDatePickerProps>(
  function MultipleDatePicker(props, ref) {
    const { getNow, locale } = useCalendarContext();
    const {
      actions: actionsProp,
      calendarProps,
      className,
      clearable = true,
      disabledMonthSwitch = false,
      disableOnDoubleNext,
      disableOnDoublePrev,
      disableOnNext,
      disableOnPrev,
      disabledYearSwitch = false,
      disabled = false,
      displayMonthLocale = locale,
      error = false,
      format: formatProp,
      fullWidth = false,
      isDateDisabled: isDateDisabledProp,
      maxSelections,
      onCalendarToggle: onCalendarToggleProp,
      onChange: onChangeProp,
      overflowStrategy = 'counter',
      placeholder,
      popperProps,
      prefix,
      readOnly = false,
      referenceDate: referenceDateProp,
      size = 'main',
      value = [],
    } = props;

    const format = formatProp || getDefaultModeFormat('day');
    const { className: calendarClassName, ...restCalendarProps } =
      calendarProps || {};

    // Calendar open state
    const [open, setOpen] = useState(false);
    const preventOpen = readOnly || disabled;

    const onCalendarToggle = useCallback(
      (currentOpen: boolean) => {
        if (!preventOpen) {
          setOpen(currentOpen);
          onCalendarToggleProp?.(currentOpen);
        }
      },
      [onCalendarToggleProp, preventOpen],
    );

    // Value management hook
    const {
      clearAll,
      formatDate,
      getConfirmValue,
      internalValue,
      isDateSelected,
      isMaxReached,
      removeDate,
      revertToValue,
      toggleDate,
    } = useMultipleDatePickerValue({
      format,
      maxSelections,
      value,
    });

    // Manage referenceDate internally for stable value
    const [internalReferenceDate, setInternalReferenceDate] = useState(
      () => referenceDateProp || getNow(),
    );

    // Sync referenceDate when prop changes
    useEffect(() => {
      if (referenceDateProp) {
        setInternalReferenceDate(referenceDateProp);
      }
    }, [referenceDateProp]);

    // Calendar controls - pass stable referenceDate
    const {
      currentMode,
      onMonthControlClick,
      onNext,
      onPrev,
      onDoublePrev,
      onDoubleNext,
      onYearControlClick,
      popModeStack,
      referenceDate,
      updateReferenceDate,
    } = useCalendarControls(internalReferenceDate, 'day');

    // Handle mode switching (month/year selection) with value transformation
    const createModeChangeHandler = useMemo(() => {
      return (
        transformValue?: (target: DateType, reference: DateType) => DateType,
      ) => {
        return (target: DateType) => {
          const result = transformValue
            ? transformValue(target, referenceDate)
            : target;

          updateReferenceDate(result);
          popModeStack();
        };
      };
    }, [referenceDate, updateReferenceDate, popModeStack]);

    // Convert internalValue to DateValue[] for trigger display
    const triggerValues: DateValue[] = useMemo(
      () =>
        internalValue.map((date) => ({
          date,
          id: formatDate(date),
          name: formatDate(date),
        })),
      [internalValue, formatDate],
    );

    // Handle calendar date click - toggle selection (only in day mode)
    const onCalendarDateChange = useCallback(
      (date: DateType) => {
        if (currentMode === 'day') {
          toggleDate(date);
        } else {
          // Handle month/year mode switching
          createModeChangeHandler()(date);
        }
      },
      [currentMode, toggleDate, createModeChangeHandler],
    );

    // Handle tag close - remove date
    const onTagClose = useCallback(
      (date: DateType) => {
        removeDate(date);
      },
      [removeDate],
    );

    // Handle confirm action
    const onConfirm = useCallback(() => {
      const confirmedValue = getConfirmValue();

      onChangeProp?.(confirmedValue);
      onCalendarToggle(false);
    }, [getConfirmValue, onChangeProp, onCalendarToggle]);

    // Handle cancel action
    const onCancel = useCallback(() => {
      revertToValue();
      onCalendarToggle(false);
    }, [revertToValue, onCalendarToggle]);

    // Handle clear
    const onClear = useCallback<MouseEventHandler<Element>>(() => {
      clearAll();
    }, [clearAll]);

    // Auto-generate actions
    const actions: CalendarFooterActionsProps['actions'] = useMemo(() => {
      const hasValue = internalValue.length > 0;

      return {
        primaryButtonProps: {
          children: 'Confirm',
          disabled: !hasValue,
          onClick: onConfirm,
          ...actionsProp?.primaryButtonProps,
        },
        secondaryButtonProps: {
          children: 'Cancel',
          onClick: onCancel,
          ...actionsProp?.secondaryButtonProps,
        },
      };
    }, [actionsProp, internalValue.length, onConfirm, onCancel]);

    // Enhanced isDateDisabled - disable unselected dates when max is reached
    const isDateDisabled = useCallback(
      (date: DateType): boolean => {
        // Check user-provided disabled function first
        if (isDateDisabledProp?.(date)) {
          return true;
        }

        // If max is reached and date is not already selected, disable it
        if (isMaxReached && !isDateSelected(date)) {
          return true;
        }

        return false;
      },
      [isDateDisabledProp, isDateSelected, isMaxReached],
    );

    // Refs for popper positioning
    const anchorRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    const triggerComposedRef = useComposeRefs([ref, anchorRef]);

    // Close handlers for click-away and escape
    const onClose = useCallback(() => {
      revertToValue();
      onCalendarToggle(false);
    }, [revertToValue, onCalendarToggle]);

    const onChangeClose = useCallback(() => {
      // In manual mode, always revert on click-away (don't auto-submit)
      revertToValue();
      onCalendarToggle(false);
    }, [revertToValue, onCalendarToggle]);

    // Use a dummy ref for lastElementRefInFlow since we don't have a focusable input
    const dummyRef = useRef<HTMLElement>(null);

    usePickerDocumentEventClose({
      anchorRef,
      lastElementRefInFlow: dummyRef,
      onChangeClose,
      onClose,
      open,
      popperRef: calendarRef,
    });

    // Icon click handler
    const onIconClick: MouseEventHandler<HTMLElement> = useCallback(
      (e) => {
        e.stopPropagation();

        if (open) {
          revertToValue();
        }

        onCalendarToggle(!open);
      },
      [open, revertToValue, onCalendarToggle],
    );

    const suffixActionIcon = (
      <Icon
        aria-label="Open calendar"
        icon={CalendarIcon}
        onClick={readOnly || disabled ? undefined : onIconClick}
      />
    );

    // Trigger click handler
    const onTriggerClick: MouseEventHandler<HTMLDivElement> =
      useCallback(() => {
        if (!preventOpen && !open) {
          onCalendarToggle(true);
        }
      }, [preventOpen, open, onCalendarToggle]);

    return (
      <>
        <MultipleDatePickerTrigger
          active={open}
          className={cx(classes.host, className, {
            [classes.hostFullWidth]: fullWidth,
          })}
          clearable={clearable}
          disabled={disabled}
          error={error}
          fullWidth={fullWidth}
          onClick={onTriggerClick}
          onClear={onClear}
          onTagClose={onTagClose}
          overflowStrategy={overflowStrategy}
          placeholder={placeholder}
          prefix={prefix}
          readOnly={readOnly}
          ref={triggerComposedRef}
          size={size}
          suffix={suffixActionIcon}
          value={triggerValues}
        />
        <InputTriggerPopper
          {...popperProps}
          anchor={anchorRef}
          open={open}
          ref={calendarRef}
        >
          <div className={calendarClasses.host}>
            <div className={calendarClasses.mainWithFooter}>
              <Calendar
                {...restCalendarProps}
                className={cx(calendarClasses.noShadowHost, calendarClassName)}
                disabledFooterControl
                disabledMonthSwitch={disabledMonthSwitch}
                disableOnDoubleNext={disableOnDoubleNext}
                disableOnDoublePrev={disableOnDoublePrev}
                disableOnNext={disableOnNext}
                disableOnPrev={disableOnPrev}
                disabledYearSwitch={disabledYearSwitch}
                displayMonthLocale={displayMonthLocale}
                isDateDisabled={isDateDisabled}
                mode={currentMode}
                onChange={onCalendarDateChange}
                onMonthControlClick={onMonthControlClick}
                onNext={onNext}
                onDoubleNext={onDoubleNext}
                onPrev={onPrev}
                onDoublePrev={onDoublePrev}
                onYearControlClick={onYearControlClick}
                referenceDate={referenceDate}
                value={internalValue}
              />
              <CalendarFooterActions actions={actions} />
            </div>
          </div>
        </InputTriggerPopper>
      </>
    );
  },
);

export default MultipleDatePicker;
