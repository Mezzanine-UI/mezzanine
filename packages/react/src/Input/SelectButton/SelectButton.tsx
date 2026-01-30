'use client';

import {
  inputSelectButtonClasses as classes,
  InputSize,
} from '@mezzanine-ui/core/input';
import { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';
import { forwardRef, useCallback, useState } from 'react';
import Icon from '../../Icon';
import Rotate from '../../Transition/Rotate';
import Dropdown from '../../Dropdown';
import { PopperPlacement } from '../../Popper';
import { cx } from '../../utils/cx';
import { ChevronDownIcon } from '@mezzanine-ui/icons';
import { NativeElementPropsWithoutKeyAndRef } from '../../utils/jsx-types';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';

export interface SelectButtonProps
  extends Omit<
    NativeElementPropsWithoutKeyAndRef<'button'>,
    'disabled' | 'onSelect' | 'type' | 'selectedValue'
  > {
  /**
   * Whether the select button is disabled.
   */
  disabled?: boolean;
  /**
   * The custom width of the dropdown.
   */
  dropdownWidth?: number | string;
  /**
   * The max height of the dropdown.
   */
  dropdownMaxHeight?: number | string;
  /**
   * The placement of the dropdown.
   */
  dropdownPlacement?: PopperPlacement;
  /**
   * The options of the dropdown.
   */
  options?: DropdownOption[];
  /**
   * Callback when an option is selected.
   */
  onSelect?: (value: string) => void;
  /**
   * The size of select button.
   * @default 'main'
   */
  size?: InputSize;
  /**
   * The value of select button.
   */
  value?: string;
}

const SelectButton = forwardRef<HTMLButtonElement, SelectButtonProps>(
  function SelectButton(props, ref) {
    const {
      className,
      disabled,
      dropdownMaxHeight = 114,
      dropdownPlacement = 'bottom-start',
      dropdownWidth = 120,
      onSelect,
      options = [],
      size = 'main',
      value,
      ...rest
    } = props;

    const [open, setOpen] = useState(false);

    const handleOpen = useCallback(() => {
      if (!disabled) {
        setOpen(true);
      }
    }, [disabled]);

    const handleClose = useCallback(() => {
      setOpen(false);
    }, []);

    const handleSelect = useCallback(
      (option: DropdownOption) => {
        onSelect?.(option.id);
      },
      [onSelect],
    );

    const dropdownOptions: DropdownOption[] = options.map((option) => ({
      ...option,
      ...(option.id === value ? { checkSite: 'suffix' } : {}),
    }));

    return (
      <Dropdown
        customWidth={dropdownWidth}
        disabled={disabled}
        maxHeight={dropdownMaxHeight}
        onClose={handleClose}
        onOpen={handleOpen}
        onSelect={handleSelect}
        options={dropdownOptions}
        placement={dropdownPlacement}
        value={value}
      >
        <button
          ref={ref}
          type="button"
          disabled={disabled}
          className={cx(
            classes.host,
            disabled && classes.disabled,
            size === 'main' ? classes.main : classes.sub,
            className,
          )}
          title={value}
          {...rest}
        >
          <span className={classes.text}>{value}</span>
          <Rotate
            in={open}
            duration={MOTION_DURATION.fast}
            easing={MOTION_EASING.standard}
          >
            <Icon className={classes.icon} icon={ChevronDownIcon} size={16} />
          </Rotate>
        </button>
      </Dropdown>
    );
  },
);

export default SelectButton;
