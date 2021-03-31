import {
  forwardRef,
  KeyboardEvent,
  useRef,
  useState,
  useContext,
  useLayoutEffect,
  Ref,
} from 'react';
import {
  selectClasses as classes,
  SelectInputSize,
} from '@mezzanine-ui/core/select';
import { ChevronDownIcon, SearchIcon } from '@mezzanine-ui/icons';
import { cx } from '../utils/cx';
import { useComposeRefs } from '../hooks/useComposeRefs';
import { FormControlContext } from '../Form';
import Menu, { MenuProps } from '../Menu';
import Popper, { PopperProps, PopperOptions } from '../Popper';
import { SelectControlContext, SelectValue } from './SelectControlContext';
import Tag from '../Tag';
import TextField, { TextFieldProps } from '../TextField';
import Icon from '../Icon';
import { useSelectValueControl } from '../Form/useSelectValueControl';
import { useClickAway } from '../hooks/useClickAway';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { PickRenameMulti } from '../utils/rename-types';

const popperDefaultOptions: PopperOptions<any> = {
  modifiers: [{
    name: 'offset',
    options: {
      offset: [0, 4],
    },
  }, {
    name: 'sameWidth',
    enabled: true,
    phase: 'beforeWrite',
    requires: ['computeStyles'],
    fn: ({ state }) => {
      const reassignState = state;

      reassignState.styles.popper.minWidth = `${state.rects.reference.width}px`;
    },
    effect: ({ state }) => {
      const reassignState = state;

      reassignState.elements.popper.style.minWidth = `${
        state.elements.reference.getBoundingClientRect().width
      }px`;
    },
  }],
};

type SelectMode = 'single' | 'multiple';

export interface SelectProps
  extends
  Omit<TextFieldProps, 'active' | 'onClick' | 'onKeyDown'>,
  PickRenameMulti<Pick<MenuProps, 'itemsInView' | 'maxHeight' | 'role' | 'size'>, {
    maxHeight: 'menuMaxHeight';
    role: 'menuRole';
    size: 'menuSize';
  }>,
  PickRenameMulti<Pick<PopperProps, 'options'>, { options: 'popperOptions'; }> {
  /**
   * The default selection
   */
  defaultValue?: SelectValue[];
  /**
   * The react ref passed to input element.
   */
  inputRef?: Ref<HTMLInputElement>;
  /**
   * The other native props for input element.
   */
  inputProps?: Omit<
  NativeElementPropsWithoutKeyAndRef<'input'>,
  | Exclude<keyof SelectProps, 'className'>
  | `aria-${'disabled' | 'multiline' | 'readonly' | 'required'}`
  >;
  /**
   * The mode of selector
   * @default 'single''
   */
  mode?: SelectMode;
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
    disabled = disabledFromFormControl || false,
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
    onSearch,
    popperOptions = {},
    placeholder = '',
    prefix,
    renderValue: renderValueProp,
    required = requiredFromFormControl || false,
    size = 'medium',
    suffixActionIcon,
    value: valueProp,
  } = props;

  const [open, toggleOpen] = useState(false);
  const {
    value,
    onChange,
    onClear,
  } = useSelectValueControl({
    defaultValue,
    mode,
    onChange: onChangeProp,
    onClear: onClearProp,
    onClose: () => toggleOpen(false),
    value: valueProp,
  });

  const nodeRef = useRef<HTMLDivElement>(null);
  const controlRef = useRef<HTMLElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);
  const composedRef = useComposeRefs([ref, controlRef]);

  const searchable = typeof onSearch === 'function';
  const [searchText, changeSearchText] = useState<string>('');
  const [focused, setFocused] = useState<boolean>(false);

  const renderValue = () => {
    if (typeof renderValueProp === 'function') {
      return renderValueProp(value);
    }

    if (value.length) return value.map((v) => v.name).join(', ');

    return searchable ? searchText : '';
  };

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

  const getSuffixActionIcon = () => {
    if (suffixActionIcon) return suffixActionIcon;

    if (searchable && open) {
      return (
        <Icon icon={SearchIcon} />
      );
    }

    return (
      <Icon
        icon={ChevronDownIcon}
        style={open ? {
          transform: 'rotate(180deg)',
        } : undefined}
      />
    );
  };

  const onClickTextField = () => {
    /** when searchable, should open menu when focus */
    if (!searchable && !disabled) {
      toggleOpen((prev) => !prev);
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
        onClickTextField();

        break;
      case 'ArrowUp':
      case 'ArrowRight':
      case 'ArrowLeft':
      case 'ArrowDown': {
        if (!open) {
          onClickTextField();
        }

        break;
      }
      case 'Tab': {
        if (open) {
          onClickTextField();
        }

        break;
      }

      default:
        break;
    }
  };

  /** Popper customizable options */
  const { modifiers = [] } = popperOptions;

  return (
    <SelectControlContext.Provider
      value={{
        value,
        onChange,
      }}
    >
      <div ref={nodeRef} className={classes.host}>
        <TextField
          ref={composedRef}
          active={Boolean(value.length)}
          className={cx(classes.textField, className)}
          clearable={clearable}
          disabled={disabled}
          error={error}
          fullWidth={fullWidth}
          onClear={onClear}
          onClick={onClickTextField}
          onKeyDown={onKeyDownTextField}
          prefix={prefix}
          size={size}
          suffixActionIcon={getSuffixActionIcon()}
        >
          {mode === 'multiple' && value.length ? (
            <div className={classes.tags}>
              {value.map((selection) => (
                <Tag
                  key={selection.id}
                  closable
                  disabled={disabled}
                  onClose={(evt) => {
                    evt.stopPropagation();

                    onChange(selection);
                  }}
                  size={size}
                >
                  {selection.name}
                </Tag>
              ))}
            </div>
          ) : (
            <input
              {...inputProps}
              ref={inputRef}
              autoComplete="false"
              aria-autocomplete="list"
              aria-controls={MENU_ID}
              aria-disabled={disabled}
              aria-expanded={open}
              aria-haspopup="listbox"
              aria-owns={MENU_ID}
              aria-readonly={!searchable}
              aria-required={required}
              disabled={disabled}
              onBlur={() => setFocused(false)}
              onChange={(e) => {
                changeSearchText(e.target.value);

                if (typeof onSearch === 'function') {
                  onSearch(e.target.value);
                }
              }}
              onFocus={(e) => {
                e.stopPropagation();

                if (searchable) toggleOpen((prev) => !prev);

                setFocused(true);
              }}
              placeholder={focused && searchable ? renderValue() : placeholder}
              readOnly={!searchable}
              required={required}
              role="combobox"
              type="search"
              value={focused && searchable ? searchText : renderValue()}
            />
          )}
        </TextField>
        <Popper
          ref={popperRef}
          anchor={controlRef}
          className={classes.popper}
          open={open}
          options={{
            ...popperDefaultOptions,
            ...popperOptions,
            modifiers: [
              ...(popperDefaultOptions.modifiers || []),
              ...modifiers,
            ],
          }}
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
        </Popper>
      </div>
    </SelectControlContext.Provider>
  );
});

export default Select;
