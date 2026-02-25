'use client';

import {
  DropdownOption,
  DropdownType,
} from '@mezzanine-ui/core/dropdown/dropdown';
import {
  selectClasses as classes,
  SelectInputSize,
} from '@mezzanine-ui/core/select';
import isArray from 'lodash/isArray';
import {
  forwardRef,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import Dropdown from '../Dropdown';
import { FormControlContext, FormElementFocusHandlers } from '../Form';
import {
  SelectMultipleValueControl,
  UseSelectMultipleValueControl,
  UseSelectSingleValueControl,
  useSelectValueControl,
} from '../Form/useSelectValueControl';
import { useComposeRefs } from '../hooks/useComposeRefs';
import { cx } from '../utils/cx';
import { SelectControlContext } from './SelectControlContext';
import SelectTrigger from './SelectTrigger';
import {
  SelectTriggerInputProps,
  SelectTriggerProps,
  SelectValue,
} from './typings';

export interface SelectBaseProps
  extends Omit<
    SelectTriggerProps,
    | 'active'
    | 'inputProps'
    | 'mode'
    | 'onBlur'
    | 'onChange'
    | 'onClick'
    | 'onFocus'
    | 'onKeyDown'
    | 'onScroll'
    | 'type'
    | 'renderValue'
    | 'value'
  >,
  FormElementFocusHandlers {
  /**
   * Direct options array for dropdown (supports tree structure).
   * If provided, `type` will be automatically set.
   */
  options?: DropdownOption[];
  /**
   * The type of dropdown.
   * @default 'default'
   */
  type?: DropdownType;
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
    | `aria-${'controls' | 'expanded' | 'owns'}`
  >;
  /**
   * The max height of the dropdown list.
   */
  menuMaxHeight?: number | string;
  /**
   * Popup menu scroll listener
   */
  onScroll?: (
    computed: { scrollTop: number; maxScrollTop: number },
    target: HTMLDivElement,
  ) => void;
  /**
   * select input placeholder
   */
  placeholder?: string;
  /**
   * Whether the input is readonly.
   * @default false
   */
  readOnly?: boolean;
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
   */
  size?: SelectInputSize;
  /**
   * The z-index of the dropdown.
   */
  dropdownZIndex?: number | string;
  /**
   * Whether to enable portal for the dropdown.
   * @default true
   */
  globalPortal?: boolean;
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
  onChange?(newOptions: SelectValue[]): void;
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
  onChange?(newOptions: SelectValue | null): void;
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

const Select = forwardRef<HTMLDivElement, SelectProps>(
  function Select(props, ref) {
    const {
      disabled: disabledFromFormControl,
      fullWidth: fullWidthFromFormControl,
      required: requiredFromFormControl,
      severity,
    } = useContext(FormControlContext) || {};
    const {
      className,
      clearable = false,
      defaultValue,
      disabled = disabledFromFormControl || false,
      error = severity === 'error' || false,
      fullWidth = fullWidthFromFormControl || false,
      inputProps,
      inputRef,
      menuMaxHeight,
      mode = 'single',
      onBlur,
      onChange: onChangeProp,
      onClear: onClearProp,
      onFocus,
      onScroll,
      options: optionsProp,
      placeholder = '',
      prefix,
      readOnly = false,
      renderValue,
      required = requiredFromFormControl || false,
      size,
      suffixActionIcon,
      type = 'default',
      value: valueProp,
      dropdownZIndex,
      globalPortal = true,
    } = props;

    const [open, toggleOpen] = useState(false);
    const onOpen = useCallback(() => {
      // Prevent opening when readOnly is true
      if (readOnly) {
        return;
      }

      onFocus?.();
      toggleOpen(true);
    }, [onFocus, readOnly]);

    const onClose = useCallback(() => {
      onBlur?.();
      toggleOpen(false);
    }, [onBlur]);

    const {
      onChange,
      onClear: onClearFromControl,
      value,
    } = useSelectValueControl({
      defaultValue,
      mode,
      onChange: onChangeProp,
      onClear: onClearProp,
      onClose,
      value: valueProp,
    } as UseSelectMultipleValueControl | UseSelectSingleValueControl);

    // Wrap onClear and delegate to control hook
    const onClear = useCallback(
      (e: MouseEvent<Element>) => {
        onClearFromControl(e);
      },
      [onClearFromControl],
    );

    const nodeRef = useRef<HTMLDivElement>(null);
    const composedRef = useComposeRefs([ref, nodeRef]);

    // Helper function to recursively add checkbox to all options in tree structure
    const addCheckboxToTreeOptions = useCallback(
      (opts: DropdownOption[]): DropdownOption[] => {
        return opts.map((opt) => ({
          ...opt,
          showCheckbox: true,
          checkSite: 'prefix' as const,
          children: opt.children
            ? addCheckboxToTreeOptions(opt.children)
            : undefined,
        }));
      },
      [],
    );

    const getLeafDescendantIds = useCallback(
      (option: DropdownOption): string[] => {
        const ids: string[] = [];

        const collect = (opt: DropdownOption) => {
          if (!opt.children || opt.children.length === 0) {
            ids.push(String(opt.id));
          } else {
            opt.children.forEach(collect);
          }
        };

        collect(option);

        return ids;
      },
      [],
    );

    const findOptionById = useCallback(
      (id: string, opts: DropdownOption[]): DropdownOption | null => {
        for (const opt of opts) {
          if (String(opt.id) === id) {
            return opt;
          }
          if (opt.children) {
            const found = findOptionById(id, opt.children);
            if (found) {
              return found;
            }
          }
        }
        return null;
      },
      [],
    );

    // Use provided options directly
    const options = useMemo<DropdownOption[]>(() => {
      if (!optionsProp) return [];

      // In tree mode (multiple mode with tree structure), ensure all options have checkbox
      if (mode === 'multiple') {
        const hasTreeStructure = optionsProp.some(
          (opt) => opt.children && opt.children.length > 0,
        );
        if (hasTreeStructure) {
          return addCheckboxToTreeOptions(optionsProp);
        }
      }
      return optionsProp;
    }, [mode, optionsProp, addCheckboxToTreeOptions]);

    // Determine dropdown type based on options structure and mode
    // Tree mode is only available in multiple mode
    const dropdownType = useMemo<DropdownType>(() => {
      if (optionsProp && mode === 'multiple') {
        // If options prop is provided and mode is multiple, check if it has tree structure
        const hasTreeStructure = optionsProp.some(
          (opt) => opt.children && opt.children.length > 0,
        );
        return hasTreeStructure ? 'tree' : type;
      }
      return type;
    }, [optionsProp, type, mode]);

    const dropdownValue = useMemo<string | string[] | undefined>(() => {
      if (!value) return undefined;

      if (Array.isArray(value)) {
        return value.map((v) => String(v.id));
      }

      return String(value.id);
    }, [value]);

    function getPlaceholder() {
      if (typeof renderValue === 'function') {
        return renderValue(value);
      }

      if (value && !isArray(value)) {
        return (value as SelectValue).name;
      }

      return placeholder;
    }

    /**
     * keyboard events for a11y
     * (@todo keyboard event map into option selection when menu is opened)
     */
    const onKeyDownTextField = (evt: KeyboardEvent<Element>) => {
      // Prevent keyboard events from opening when readOnly is true
      if (readOnly) {
        return;
      }

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

    const handleDropdownSelect = useCallback(
      (option: DropdownOption) => {
        if (mode === 'multiple' && dropdownType === 'tree') {
          const onChangeMultiple =
            onChange as SelectMultipleValueControl['onChange'];
          const currentValues = Array.isArray(value) ? value : [];
          const leafDescendantIds = getLeafDescendantIds(option);
          const leafDescendantValues: SelectValue[] = leafDescendantIds.map(
            (id) => {
              const foundOption = findOptionById(id, options);

              return {
                id,
                name: foundOption?.name || id,
              };
            },
          );

          const selectedLeafIds = leafDescendantIds.filter((id) =>
            currentValues.some((v) => String(v.id) === id),
          );
          const allSelected =
            selectedLeafIds.length === leafDescendantIds.length;

          if (allSelected) {
            // Deselect all leaf descendants in a single update
            const leafIdSet = new Set(
              leafDescendantIds.map((id) => String(id)),
            );
            const nextValues = currentValues.filter(
              (v) => !leafIdSet.has(String(v.id)),
            );
            onChangeMultiple(nextValues);
          } else {
            // Select all leaf descendants that are not yet selected in a single update
            const existingIdSet = new Set(
              currentValues.map((v) => String(v.id)),
            );
            const valuesToAdd = leafDescendantValues.filter(
              (descValue) => !existingIdSet.has(String(descValue.id)),
            );
            const nextValues = [...currentValues, ...valuesToAdd];
            onChangeMultiple(nextValues);
          }
        } else {
          // Normal selection logic for non-tree mode
          const selectValue: SelectValue = {
            id: String(option.id),
            name: String(option.name),
          };

          if (mode === 'multiple') {
            onChange(selectValue);
          } else {
            onChange(selectValue);
            onClose();
          }
        }
      },
      [
        mode,
        onChange,
        onClose,
        value,
        dropdownType,
        getLeafDescendantIds,
        findOptionById,
        options,
      ],
    );

    const handleVisibilityChange = useCallback(
      (isOpen: boolean) => {
        if (isOpen && readOnly) {
          return;
        }

        if (isOpen) {
          onOpen();
        } else {
          onClose();
        }
      },
      [onOpen, onClose, readOnly],
    );

    const resolvedInputProps: SelectTriggerInputProps = {
      ...inputProps,
      role: 'combobox',
    };

    const context = useMemo(
      () => ({
        onChange,
        value,
      }),
      [onChange, value],
    );

    return (
      <SelectControlContext.Provider value={context}>
        <div
          ref={nodeRef}
          className={cx(
            classes.host,
            fullWidth && classes.hostFullWidth,
            mode && classes.hostMode(mode),
          )}
        >
          <Dropdown
            disabled={readOnly || disabled}
            maxHeight={menuMaxHeight}
            mode={mode}
            onScroll={onScroll}
            onSelect={handleDropdownSelect}
            onVisibilityChange={handleVisibilityChange}
            open={readOnly ? false : open}
            options={options}
            sameWidth
            type={dropdownType}
            value={dropdownValue}
            zIndex={dropdownZIndex}
            globalPortal={globalPortal}
          >
            <SelectTrigger
              ref={composedRef}
              active={!readOnly && open}
              className={className}
              clearable={clearable}
              disabled={disabled}
              error={error}
              fullWidth={fullWidth}
              inputRef={inputRef}
              mode={mode}
              onTagClose={onChange}
              onClear={onClear}
              onKeyDown={onKeyDownTextField}
              prefix={prefix}
              readOnly={readOnly}
              {...(mode === 'single' && renderValue ? { renderValue } : {})}
              required={required}
              inputProps={resolvedInputProps}
              size={size}
              suffixActionIcon={suffixActionIcon}
              value={value === null ? undefined : value}
              placeholder={getPlaceholder()}
            />
          </Dropdown>
        </div>
      </SelectControlContext.Provider>
    );
  },
);

export default Select;
