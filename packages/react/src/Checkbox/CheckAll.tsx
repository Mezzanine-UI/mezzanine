'use client';

import { ChangeEventHandler, forwardRef, ReactElement, useId, useMemo } from 'react';

import Checkbox from './Checkbox';
import {
  assignCheckboxGroupValuesToEvent,
  CheckboxGroupProps,
} from './CheckboxGroup';


export interface CheckAllProps {
  /**
   * The checkbox group to control.
   */
  children: ReactElement<CheckboxGroupProps>;
  /**
   * Whether the check all checkbox is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The label text for the check all checkbox.
   */
  label?: string;
}

/**
 * The react component for `mezzanine` check all.
 * Wraps a CheckboxGroup and provides a "check all" checkbox that controls all checkboxes in the group.
 */
const CheckAll = forwardRef<HTMLDivElement, CheckAllProps>(
  function CheckAll(props, ref) {
    const {
      children,
      disabled = false,
      label = 'Check All',
    } = props;

    // Generate unique id for the check all checkbox
    // This is important for accessibility
    const checkAllId = useId();

    const checkboxGroupProps = children.props;
    const { options = [], value = [], onChange } = checkboxGroupProps;

    // Calculate checked and indeterminate states
    const { checked, indeterminate } = useMemo(() => {
      const enabledOptions = options.filter((opt) => !opt.disabled);
      const enabledValues = enabledOptions.map((opt) => opt.value);
      const selectedEnabledValues = value.filter((v) => enabledValues.includes(v));

      if (selectedEnabledValues.length === 0) {
        return { checked: false, indeterminate: false };
      }
      if (selectedEnabledValues.length === enabledValues.length) {
        return { checked: true, indeterminate: false };
      }
      return { checked: false, indeterminate: true };
    }, [options, value]);

    const handleCheckAllChange: ChangeEventHandler<HTMLInputElement> = (event) => {
      if (!onChange) return;

      const isChecked = event.target.checked;
      const enabledOptions = options.filter((opt) => !opt.disabled);
      const enabledValues = enabledOptions.map((opt) => opt.value);
      const disabledOptions = options.filter((opt) => opt.disabled);
      const disabledValues = disabledOptions.map((opt) => opt.value);
      const selectedDisabledValues = value.filter((v) => disabledValues.includes(v));

      const newValue = isChecked
        ? [...enabledValues, ...selectedDisabledValues]
        : selectedDisabledValues;

      const syntheticEvent = assignCheckboxGroupValuesToEvent(
        event,
        newValue,
        checkboxGroupProps.name ?? '',
      );

      onChange(syntheticEvent);
    };

    return (
      <div ref={ref}>
        <Checkbox
          checked={checked}
          disabled={disabled}
          indeterminate={indeterminate}
          inputProps={{ id: checkAllId }}
          label={label}
          onChange={handleCheckAllChange}
        />
        {children}
      </div>
    );
  },
);

export default CheckAll;

