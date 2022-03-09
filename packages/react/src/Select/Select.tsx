import {
  forwardRef,
  KeyboardEvent,
  useRef,
  useState,
  useContext,
} from 'react';
import {
  selectClasses as classes,
  SelectInputSize,
} from '@mezzanine-ui/core/select';
import isArray from 'lodash/isArray';
import { useComposeRefs } from '../hooks/useComposeRefs';
import { cx } from '../utils/cx';
import { FormControlContext, FormElementFocusHandlers } from '../Form';
import Menu, { MenuProps } from '../Menu';
import { PopperProps } from '../Popper';
import { SelectControlContext } from './SelectControlContext';
import { SelectValue } from './typings';
import {
  useSelectValueControl,
  UseSelectMultipleValueControl,
  UseSelectSingleValueControl,
} from '../Form/useSelectValueControl';
import { useClickAway } from '../hooks/useClickAway';
import { PickRenameMulti } from '../utils/general';
import InputTriggerPopper from '../_internal/InputTriggerPopper';
import SelectTrigger, { SelectTriggerProps, SelectTriggerInputProps } from './SelectTrigger';

export interface SelectBaseProps
  extends
  Omit<SelectTriggerProps,
  | 'active'
  | 'inputProps'
  | 'mode'
  | 'onBlur'
  | 'onChange'
  | 'onClick'
  | 'onFocus'
  | 'onKeyDown'
  | 'readOnly'
  | 'renderValue'
  | 'value'
  >,
  FormElementFocusHandlers,
  PickRenameMulti<Pick<MenuProps, 'itemsInView' | 'maxHeight' | 'role' | 'size'>, {
    maxHeight: 'menuMaxHeight';
    role: 'menuRole';
    size: 'menuSize';
  }>,
  PickRenameMulti<Pick<PopperProps, 'options'>, {
    options: 'popperOptions';
  }>,
  Pick<MenuProps, 'children'> {
  /**
   * The other native props for input element.
   */
  inputProps?: Omit<
  SelectTriggerInputProps,
  | 'onBlur'
  | 'onChange'
  | 'onFocus'
  | 'placeholder'
  | 'role'
  | 'value'
  | `aria-${
    | 'controls'
    | 'expanded'
    | 'owns'
    }`
  >;
  /**
   * select input placeholder
   */
  placeholder?: string;
  /**
   * To customize rendering select input value
   */
  renderValue?(values: SelectValue[] | SelectValue | null): string;
  /**
   * Whether the selection is required.
   * @default false
   */
  required?: boolean;
  /**
   * The size of input.
   * @default 'medium'
   */
  size?: SelectInputSize;
}

export type SelectMultipleProps = SelectBaseProps & {
  /**
   * The default selection
   */
  defaultValue?: SelectValue[];
  /**
   * Controls the layout of trigger.
   */
  mode: 'multiple';
  /**
   * The change event handler of input element.
   */
  onChange?(newOptions: SelectValue[]): any;
  /**
   * To customize rendering select input value
   */
  renderValue?(values: SelectValue[]): string;
  /**
   * The value of selection.
   * @default undefined
   */
  value?: SelectValue[];
};

export type SelectSingleProps = SelectBaseProps & {
  /**
   * The default selection
   */
  defaultValue?: SelectValue;
  /**
   * Controls the layout of trigger.
   */
  mode?: 'single';
  /**
   * The change event handler of input element.
   */
  onChange?(newOptions: SelectValue): any;
  /**
   * To customize rendering select input value
   */
  renderValue?(values: SelectValue | null): string;
  /**
   * The value of selection.
   * @default undefined
   */
  value?: SelectValue | null;
};

export type SelectProps = SelectMultipleProps | SelectSingleProps;

const MENU_ID = 'mzn-select-menu-id';

const Select = forwardRef<HTMLDivElement, SelectProps>(function Select(props, ref) {
  const {
    disabled: disabledFromFormControl,
    fullWidth: fullWidthFromFormControl,
    required: requiredFromFormControl,
    severity,
  } = useContext(FormControlContext) || {};
  const {
    children,
    className,
    clearable = false,
    defaultValue,
    disabled = disabledFromFormControl || false,
    error = severity === 'error' || false,
    fullWidth = fullWidthFromFormControl || false,
    inputProps,
    inputRef,
    itemsInView = 4,
    menuMaxHeight,
    menuRole = 'listbox',
    menuSize = 'medium',
    mode = 'single',
    onBlur,
    onChange: onChangeProp,
    onClear: onClearProp,
    onFocus,
    placeholder = '',
    popperOptions = {},
    prefix,
    renderValue: renderValueProp,
    required = requiredFromFormControl || false,
    size = 'medium',
    suffixActionIcon: suffixActionIconProp,
    value: valueProp,
  } = props;

  const [open, toggleOpen] = useState(false);
  const onOpen = () => {
    onFocus?.();

    toggleOpen(true);
  };

  const onClose = () => {
    onBlur?.();

    toggleOpen(false);
  };

  const onToggleOpen = () => {
    if (open) {
      onClose();
    } else {
      onOpen();
    }
  };

  const {
    onChange,
    onClear,
    value,
  } = useSelectValueControl({
    defaultValue,
    mode,
    onChange: onChangeProp,
    onClear: onClearProp,
    onClose,
    value: valueProp,
  } as UseSelectMultipleValueControl | UseSelectSingleValueControl);

  const nodeRef = useRef<HTMLDivElement>(null);
  const controlRef = useRef<HTMLElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);
  const composedRef = useComposeRefs([ref, controlRef]);

  function getPlaceholder() {
    if (typeof renderValueProp === 'function') {
      return renderValueProp(value);
    }

    if (value && !isArray(value)) {
      return (value as SelectValue).name;
    }

    return placeholder;
  }

  useClickAway(
    () => {
      if (!open) return;

      return () => {
        onClose();
      };
    },
    nodeRef,
    [
      nodeRef,
      open,
      toggleOpen,
    ],
  );

  const suffixActionIcon = suffixActionIconProp;

  const onClickTextField = () => {
    if (!disabled) {
      onToggleOpen();
    }
  };

  /**
   * keyboard events for a11y
   * (@todo keyboard event map into option selection when menu is opened)
   */
  const onKeyDownTextField = (evt: KeyboardEvent<Element>) => {
    /** for a11y to open menu via keyboard */
    switch (evt.code) {
      case 'Enter':
        onClose();

        break;
      case 'ArrowUp':
      case 'ArrowRight':
      case 'ArrowLeft':
      case 'ArrowDown': {
        if (!open) {
          onOpen();
        }

        break;
      }
      case 'Tab': {
        if (open) {
          onClose();
        }

        break;
      }

      default:
        break;
    }
  };

  const resolvedInputProps: SelectTriggerInputProps = {
    ...inputProps,
    'aria-controls': MENU_ID,
    'aria-expanded': open,
    'aria-owns': MENU_ID,
    placeholder: getPlaceholder(),
    role: 'combobox',
  };

  return (
    <SelectControlContext.Provider
      value={{
        onChange,
        value,
      }}
    >
      <div
        ref={nodeRef}
        className={cx(
          classes.host,
          fullWidth && classes.hostFullWidth,
        )}
      >
        <SelectTrigger
          ref={composedRef}
          active={open}
          className={className}
          clearable={clearable}
          disabled={disabled}
          error={error}
          fullWidth={fullWidth}
          inputRef={inputRef}
          mode={mode}
          onTagClose={onChange}
          onClear={onClear}
          onClick={onClickTextField}
          onKeyDown={onKeyDownTextField}
          prefix={prefix}
          readOnly
          renderValue={renderValueProp}
          required={required}
          inputProps={resolvedInputProps}
          size={size}
          suffixActionIcon={suffixActionIcon}
          value={value}
        />
        <InputTriggerPopper
          ref={popperRef}
          anchor={controlRef}
          className={classes.popper}
          open={open}
          sameWidth
          options={popperOptions}
        >
          <Menu
            id={MENU_ID}
            aria-activedescendant={
              Array.isArray(value) ? value?.[0]?.id ?? '' : value?.id
            }
            itemsInView={itemsInView}
            maxHeight={menuMaxHeight}
            role={menuRole}
            size={menuSize}
            style={{ border: 0 }}
          >
            {children}
          </Menu>
        </InputTriggerPopper>
      </div>
    </SelectControlContext.Provider>
  );
});

export default Select;
