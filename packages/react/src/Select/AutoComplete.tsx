/* eslint-disable consistent-return */
import {
  forwardRef,
  useRef,
  useState,
  useContext,
  useMemo,
  ChangeEventHandler,
  FocusEventHandler,
} from 'react';
import {
  selectClasses as classes,
  SelectInputSize,
} from '@mezzanine-ui/core/select';
import { PlusIcon } from '@mezzanine-ui/icons';
import isArray from 'lodash/isArray';
import { SelectValue } from './typings';
import { useComposeRefs } from '../hooks/useComposeRefs';
import { FormControlContext } from '../Form';
import Menu, { MenuProps } from '../Menu';
import Option from './Option';
import Icon from '../Icon';
import { PopperProps } from '../Popper';
import { SelectControlContext } from './SelectControlContext';
import {
  useAutoCompleteValueControl,
  UseAutoCompleteMultipleValueControl,
  UseAutoCompleteSingleValueControl,
} from '../Form/useAutoCompleteValueControl';
import { useClickAway } from '../hooks/useClickAway';
import { PickRenameMulti } from '../utils/general';
import { cx } from '../utils/cx';
import InputTriggerPopper from '../_internal/InputTriggerPopper';
import SelectTrigger, { SelectTriggerProps, SelectTriggerInputProps } from './SelectTrigger';

export interface AutoCompleteBaseProps
  extends
  Omit<SelectTriggerProps,
  | 'active'
  | 'clearable'
  | 'forceHideSuffixActionIcon'
  | 'mode'
  | 'onClick'
  | 'onKeyDown'
  | 'onChange'
  | 'renderValue'
  | 'inputProps'
  | 'suffixActionIcon'
  | 'value'
  >,
  PickRenameMulti<Pick<MenuProps, 'itemsInView' | 'maxHeight' | 'role' | 'size'>, {
    maxHeight: 'menuMaxHeight';
    role: 'menuRole';
    size: 'menuSize';
  }>,
  PickRenameMulti<Pick<PopperProps, 'options'>, {
    options: 'popperOptions';
  }> {
  /**
   * Set to true when options can be added dynamically
   * @default false
   */
  addable?: boolean;
  /**
   * Should the filter rules be disabled (If you need to control options filter by yourself)
   * @default false
   */
  disabledOptionsFilter?: boolean;
  /**
   * The other native props for input element.
   */
  inputProps?: Omit<
  SelectTriggerInputProps,
  'onChange'
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
   * insert callback whenever insert icon is clicked
   * return `true` when insert is successfully
   */
  onInsert?(text: string): SelectValue;
  /**
   * The search event handler
   */
  onSearch?(input: string): any;
  /**
   * The options that mapped autocomplete options
   */
  options: SelectValue[];
  /**
   * select input placeholder
   */
  placeholder?: string;
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

export type AutoCompleteMultipleProps = AutoCompleteBaseProps & {
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
   * The value of selection.
   * @default undefined
   */
  value?: SelectValue[];
};

export type AutoCompleteSingleProps = AutoCompleteBaseProps & {
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
   * The value of selection.
   * @default undefined
   */
  value?: SelectValue | null;
};

export type AutoCompleteProps = AutoCompleteMultipleProps | AutoCompleteSingleProps;

const MENU_ID = 'mzn-select-autocomplete-menu-id';

/**
 * The AutoComplete component for react. <br />
 * Note that if you need search for ONLY given options, not included your typings,
 * should considering using the `Select` component with `onSearch` prop.
 */
const AutoComplete = forwardRef<HTMLDivElement, AutoCompleteProps>(function Select(props, ref) {
  const {
    disabled: disabledFromFormControl,
    fullWidth: fullWidthFromFormControl,
    required: requiredFromFormControl,
    severity,
  } = useContext(FormControlContext) || {};
  const {
    addable = false,
    className,
    disabled = disabledFromFormControl || false,
    disabledOptionsFilter = false,
    defaultValue,
    error = severity === 'error' || false,
    fullWidth = fullWidthFromFormControl || false,
    inputRef,
    inputProps,
    itemsInView = 4,
    menuMaxHeight,
    menuRole = 'listbox',
    menuSize = 'medium',
    mode = 'single',
    onChange: onChangeProp,
    onClear: onClearProp,
    onInsert,
    onSearch,
    options: optionsProp,
    popperOptions = {},
    placeholder = '',
    prefix,
    required = requiredFromFormControl || false,
    size = 'medium',
    value: valueProp,
  } = props;

  const [open, toggleOpen] = useState(false);
  const {
    focused,
    onFocus,
    onChange,
    onClear,
    options,
    searchText,
    selectedOptions,
    setSearchText,
    unselectedOptions,
    value,
  } = useAutoCompleteValueControl({
    defaultValue,
    disabledOptionsFilter,
    mode,
    onChange: onChangeProp,
    onClear: onClearProp,
    onClose: () => toggleOpen(false),
    onSearch,
    options: optionsProp,
    value: valueProp,
  } as UseAutoCompleteMultipleValueControl | UseAutoCompleteSingleValueControl);

  /** insert feature */
  const [insertText, setInsertText] = useState<string>('');

  const nodeRef = useRef<HTMLDivElement>(null);
  const controlRef = useRef<HTMLElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);
  const composedRef = useComposeRefs([ref, controlRef]);
  const renderValue = focused ? () => searchText : undefined;

  useClickAway(
    () => {
      if (!open || focused) return;

      return () => {
        toggleOpen((prev) => !prev);
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

  function getPlaceholder() {
    if (focused && value && !isArray(value)) {
      return (value as SelectValue).name;
    }

    return placeholder;
  }

  /** Trigger input props */
  const onSearchInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    /** should sync both search input and value */
    setSearchText(e.target.value);
    setInsertText(e.target.value);

    /** return current value to onSearch */
    onSearch?.(e.target.value);
  };

  const onSearchInputFocus: FocusEventHandler<HTMLInputElement> = (e) => {
    e.stopPropagation();

    toggleOpen(true);
    onFocus(true);

    inputProps?.onFocus?.(e);
  };

  const onSearchInputBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    onFocus(false);

    inputProps?.onBlur?.(e);
  };

  const onClickSuffixActionIcon = () => {
    toggleOpen((prev) => !prev);
  };

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

  const searchTextExistWithoutOption: boolean = !!searchText && options.find((option) => option.name === searchText) === undefined;

  const context = useMemo(() => ({
    onChange,
    value,
  }), [onChange, value]);

  return (
    <SelectControlContext.Provider
      value={context}
    >
      <div
        ref={nodeRef}
        className={cx(
          classes.host,
          {
            [classes.hostFullWidth]: fullWidth,
          },
        )}
      >
        <SelectTrigger
          ref={composedRef}
          active={open}
          className={className}
          clearable
          disabled={disabled}
          ellipsis
          error={error}
          fullWidth={fullWidth}
          inputRef={inputRef}
          mode={mode}
          onTagClose={onChange}
          onClear={onClear}
          prefix={prefix}
          readOnly={false}
          required={required}
          inputProps={resolvedInputProps}
          searchText={searchText}
          size={size}
          showTextInputAfterTags
          suffixAction={onClickSuffixActionIcon}
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
          {options.length ? (
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
              {mode === 'single' ? (
                <>
                  {options.map((option) => (
                    <Option key={option.id} value={option.id}>
                      {option.name}
                    </Option>
                  ))}
                </>
              ) : (
                <>
                  {selectedOptions.map((option) => (
                    <Option key={option.id} value={option.id}>
                      {option.name}
                    </Option>
                  ))}
                  {unselectedOptions.map((option) => (
                    <Option key={option.id} value={option.id}>
                      {option.name}
                    </Option>
                  ))}
                </>
              )}
            </Menu>
          ) : null}
          {searchTextExistWithoutOption && addable ? (
            <button
              type="button"
              className={classes.autoComplete}
              onClick={(e) => {
                e.stopPropagation();

                if (insertText) {
                  const newOption = onInsert?.(insertText) ?? null;

                  if (newOption) {
                    setInsertText('');
                    onChange(newOption);
                  }
                }
              }}
            >
              <p>{insertText}</p>
              <Icon
                className={classes.autoCompleteIcon}
                icon={PlusIcon}
              />
            </button>
          ) : null}
        </InputTriggerPopper>
      </div>
    </SelectControlContext.Provider>
  );
});

export default AutoComplete;
