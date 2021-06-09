import {
  forwardRef,
  KeyboardEvent,
  useRef,
  useState,
  useContext,
  useLayoutEffect,
  ChangeEventHandler,
  FocusEventHandler,
} from 'react';
import {
  selectClasses as classes,
  SelectInputSize,
} from '@mezzanine-ui/core/select';
import { SearchIcon } from '@mezzanine-ui/icons';
import { useComposeRefs } from '../hooks/useComposeRefs';
import { FormControlContext, FormElementFocusHandlers } from '../Form';
import Menu, { MenuProps } from '../Menu';
import { PopperProps } from '../Popper';
import { SelectControlContext } from './SelectControlContext';
import { SelectValue } from './typings';
import Icon from '../Icon';
import { useSelectValueControl } from '../Form/useSelectValueControl';
import { useClickAway } from '../hooks/useClickAway';
import { PickRenameMulti } from '../utils/rename-types';
import InputTriggerPopper from '../_internal/InputTriggerPopper';
import SelectTrigger, { SelectTriggerProps, SelectTriggerInputProps } from './SelectTrigger';

export interface SelectProps
  extends
  Omit<SelectTriggerProps,
  | 'active'
  | 'inputProps'
  | 'onBlur'
  | 'onChange'
  | 'onClick'
  | 'onFocus'
  | 'onKeyDown'
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
   * The default selection
   */
  defaultValue?: SelectValue[];
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
   * The change event handler of input element.
   */
  onChange?(newOptions: SelectValue[]): any;
  /**
   * The search event handler, this prop won't work when mode is `multiple`
   */
  onSearch?(input: string): any;
  /**
   * select input placeholder
   */
  placeholder?: string;
  /**
   * To customize rendering select input value
   */
  renderValue?(values: SelectValue[]): string;
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
  /**
   * The value of selection.
   * @default undefined
   */
  value?: SelectValue[];
}

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
    onSearch,
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
  });

  const nodeRef = useRef<HTMLDivElement>(null);
  const controlRef = useRef<HTMLElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);
  const composedRef = useComposeRefs([ref, controlRef]);

  const searchable = typeof onSearch === 'function';
  const [searchText, changeSearchText] = useState<string>('');
  const [focused, setFocused] = useState<boolean>(false);
  const renderValue = focused && searchable ? () => searchText : renderValueProp;

  function getPlaceholder() {
    if (focused && searchable) {
      return renderValueProp?.(value) ?? value.map(({ name }) => name).join(', ');
    }

    return placeholder;
  }

  useLayoutEffect(() => {
    if (!focused) {
      changeSearchText('');

      if (typeof onSearch === 'function') {
        onSearch('');
      }
    }
  }, [focused, onSearch]);

  useClickAway(
    () => {
      if (!open || focused) return;

      return () => {
        onClose();
      };
    },
    nodeRef,
    [
      focused,
      nodeRef,
      open,
      toggleOpen,
    ],
  );

  const suffixActionIcon = suffixActionIconProp || (
    searchable && open ? (
      <Icon icon={SearchIcon} />
    ) : undefined
  );

  const onClickTextField = () => {
    /** when searchable, should open menu when focus */
    if (!searchable && !disabled) {
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

  /** Trigger input props */
  const onSearchInputChange: ChangeEventHandler<HTMLInputElement> | undefined = searchable ? (e) => {
    changeSearchText(e.target.value);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    onSearch!(e.target.value);
  } : undefined;

  const onSearchInputFocus: FocusEventHandler<HTMLInputElement> | undefined = searchable ? (e) => {
    e.stopPropagation();

    onToggleOpen();

    setFocused(true);
  } : undefined;

  const onSearchInputBlur: FocusEventHandler<HTMLInputElement> = () => setFocused(false);
  const resolvedInputProps: SelectTriggerInputProps = {
    ...inputProps,
    'aria-controls': MENU_ID,
    'aria-expanded': open,
    'aria-owns': MENU_ID,
    onBlur: onSearchInputBlur,
    onChange: onSearchInputChange,
    onFocus: onSearchInputFocus,
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
      <div ref={nodeRef} className={classes.host}>
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
          readOnly={!searchable}
          required={required}
          inputProps={resolvedInputProps}
          size={size}
          suffixActionIcon={suffixActionIcon}
          value={value}
          renderValue={renderValue}
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
            aria-activedescendant={value?.[0]?.id ?? ''}
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
