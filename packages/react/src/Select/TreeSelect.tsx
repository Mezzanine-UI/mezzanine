'use client';

import {
  selectClasses as classes,
  SelectInputSize,
} from '@mezzanine-ui/core/select';
import { TreeNodeValue } from '@mezzanine-ui/core/tree';
import {
  forwardRef,
  KeyboardEventHandler,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FormControlContext, FormElementFocusHandlers } from '../Form';
import Menu, { MenuProps } from '../Menu';
import { PopperController } from '../Popper';
import Tree, {
  toggleValue,
  traverseTree,
  TreeNodeListProps,
  TreeNodeProp,
  TreeProps,
} from '../Tree';
import InputTriggerPopper, {
  InputTriggerPopperProps,
} from '../_internal/InputTriggerPopper';
import { useClickAway } from '../hooks/useClickAway';
import { useComposeRefs } from '../hooks/useComposeRefs';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { cx } from '../utils/cx';
import { PickRenameMulti } from '../utils/general';
import SelectTrigger from './SelectTrigger';
import {
  SelectTriggerInputProps,
  SelectTriggerProps,
  SelectValue, TreeSelectOption,
} from './typings';

export interface TreeSelectProps
  extends Omit<
    SelectTriggerProps,
    | 'active'
    | 'onBlur'
    | 'onChange'
    | 'onClear'
    | 'onClick'
    | 'onFocus'
    | 'onKeyDown'
    | 'readOnly'
    | 'searchInputProps'
  >,
  FormElementFocusHandlers,
  Pick<
    TreeProps,
    'defaultExpandAll' | 'disabledValues' | 'expandControllerRef' | 'onExpand'
  >,
  PickRenameMulti<
    Pick<MenuProps, 'itemsInView' | 'maxHeight' | 'role' | 'size'>,
    {
      maxHeight: 'menuMaxHeight';
      role: 'menuRole';
      size: 'menuSize';
    }
  >,
  PickRenameMulti<
    Pick<InputTriggerPopperProps, 'options'>,
    {
      options: 'popperOptions';
    }
  > {
  /**
   * The width of options panel will be calculated based on the depth of your options.
   * If you know how many layers in your object, pass it via this prop will have better performance.
   */
  depth?: number;
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
    | `aria-${'expanded'}`
  >;
  /**
   * Other props you may provide to `Menu`.
   */
  menuProps?: Omit<MenuProps, 'itemsInView' | 'maxHeight' | 'role' | 'size'>;
  /**
   * The change event handler of input element.
   */
  onChange?(newOptions: SelectValue[]): any;
  /**
   * The nested options for `TreeSelect`
   */
  options: TreeSelectOption[];
  /**
   * select input placeholder
   */
  placeholder?: string;
  /**
   * To customize rendering select input value.
   * For single mode, receives the first value from the array.
   * For multiple mode, receives the full array.
   */
  renderValue?: (value?: SelectValue | SelectValue[] | null) => string;
  /**
   * Whether the selection is required.
   * @default false
   */
  required?: boolean;
  /**
   * If true, the panel will have its min-width be same as the trigger width.
   * @default false
   */
  sameWidth?: InputTriggerPopperProps['sameWidth'];
  /**
   * The size of input.
   * @default 'medium'
   */
  size?: SelectInputSize;
  /**
   * Other props you may provide to `Tree`
   */
  treeProps?: Omit<
    TreeProps,
    | 'defaultExpandAll'
    | 'disabledValues'
    | 'expandControllerRef'
    | 'expandedValues'
    | 'nodes'
    | 'onExpand'
    | 'onSelect'
    | 'selectMethod'
    | 'selectable'
    | 'values'
  >;
  /**
   * The value of selection.
   * @default undefined
   */
  value?: SelectValue[];
}

const TreeSelect = forwardRef<HTMLDivElement, TreeSelectProps>((props, ref) => {
  const {
    disabled: disabledFromFormControl,
    fullWidth: fullWidthFromFormControl,
    required: requiredFromFormControl,
    severity,
  } = useContext(FormControlContext) || {};
  const {
    className,
    clearable = false,
    defaultExpandAll,
    depth,
    disabled = disabledFromFormControl || false,
    disabledValues,
    error = severity === 'error' || false,
    expandControllerRef,
    fullWidth = fullWidthFromFormControl || false,
    inputProps,
    inputRef,
    itemsInView = 4,
    menuMaxHeight,
    menuProps,
    menuRole = 'listbox',
    menuSize,
    mode = 'single',
    onBlur,
    onChange: onChangeProp,
    onExpand: onExpandProp,
    onFocus,
    options,
    placeholder = '',
    popperOptions,
    prefix,
    renderValue,
    required = requiredFromFormControl || false,
    sameWidth = false,
    size,
    suffixActionIcon,
    treeProps,
    value: valueProp,
  } = props;
  const { className: treeClassName, ...restTreeProps } = treeProps || {};
  const { width, border, ...restStyle } = menuProps?.style || {};
  const multiple = mode === 'multiple';

  /** Compute panel width */
  const panelWidth = useMemo(() => {
    if (width) {
      return;
    }

    const base = multiple ? 224 : 208;
    const indent = 16;

    function getWidth(resultDepth: number) {
      return (resultDepth - 1) * indent + base;
    }

    if (depth) {
      return getWidth(depth);
    }

    function maxDepth(object: TreeSelectOption, counter = 1): number {
      if (object.siblings) {
        return Math.max(
          ...object.siblings.map((sibling) => maxDepth(sibling, counter + 1)),
        );
      }

      return counter;
    }

    const computedMaxDepth = options.reduce<number>((acc, current) => {
      const currentDepth = maxDepth(current);

      return currentDepth > acc ? currentDepth : acc;
    }, 0);

    return getWidth(computedMaxDepth);
  }, [depth, multiple, options, width]);

  /** Popper positioning */
  const nodeRef = useRef<HTMLDivElement>(null);
  const controlRef = useRef<HTMLElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);
  const composedRef = useComposeRefs([ref, controlRef]);

  /** Make popper positioning dynamically by computing styles every time value prop changes */
  const controllerRef = useRef<PopperController>(null);

  useIsomorphicLayoutEffect(() => {
    controllerRef.current?.update?.();
  }, [valueProp]);

  /** Open control */
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

  const onTextFieldClick = disabled
    ? undefined
    : () => {
      onToggleOpen();
    };

  const onTextFieldKeydown: KeyboardEventHandler<HTMLElement> | undefined =
    disabled
      ? undefined
      : (event) => {
        switch (event.code) {
          case 'Enter':
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            onTextFieldClick!();

            break;
          case 'ArrowUp':
          case 'ArrowRight':
          case 'ArrowLeft':
          case 'ArrowDown': {
            if (!open) {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              onTextFieldClick!();
            }

            break;
          }
          case 'Tab': {
            if (open) {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              onTextFieldClick!();
            }

            break;
          }

          default:
            break;
        }
      };

  useClickAway(
    () => {
      if (!open) return;

      return (event) => {
        if (!popperRef.current?.contains(event.target as HTMLElement)) {
          onClose();
        }
      };
    },
    controlRef,
    [open, toggleOpen],
  );

  /** Trigger input props */
  const resolvedInputProps: SelectTriggerInputProps = {
    ...inputProps,
    'aria-expanded': open,
    placeholder,
    role: 'combobox',
  };

  /** Tags close handler */
  const onTagClose: SelectTriggerProps['onTagClose'] =
    onChangeProp && valueProp
      ? (target) => {
        onChangeProp(valueProp.filter((v) => v.id !== target.id));
      }
      : undefined;

  /** Clear method */
  const onClear: SelectTriggerProps['onClear'] =
    clearable && onChangeProp
      ? () => {
        onChangeProp([]);
      }
      : undefined;

  /** Map options to tree nodes */
  function mapOptionToNode(option: TreeSelectOption): TreeNodeProp {
    return {
      label: option.name,
      value: option.id,
      dynamicNodesFetching: option.dynamicChildrenFetching,
      nodes: option.siblings?.map((sibling) => mapOptionToNode(sibling)),
    };
  }

  type TreeSelectOptionMap = Record<TreeNodeValue, SelectValue>;
  function flattenOptions(targets: TreeSelectOption[]): TreeSelectOptionMap {
    const optionsMap = {} as TreeSelectOptionMap;

    function mapOptionsToSelectValue(optionsToMap: TreeSelectOption[]) {
      optionsToMap.forEach((optionToMap) => {
        optionsMap[optionToMap.id as TreeNodeValue] = {
          id: optionToMap.id,
          name: optionToMap.name,
        };

        if (optionToMap.siblings) {
          mapOptionsToSelectValue(optionToMap.siblings);
        }
      });
    }

    mapOptionsToSelectValue(targets);

    return optionsMap;
  }

  const optionMap = flattenOptions(options);

  const nodes = options.map((option) => mapOptionToNode(option));

  /** Map selected values */
  const selectedValues = valueProp?.map((v) => mapOptionToNode(v).value);

  const onSelect: TreeProps['onSelect'] = onChangeProp
    ? (values) => {
      const selectValues = values.map(
        (currentValue) => optionMap[currentValue],
      );

      onChangeProp(selectValues);
    }
    : undefined;

  /** Controlled expanded value to avoid expanded values cleanup after panel toggled */
  const [expandedValues, setExpandedValues] = useState(() => {
    const currentExpandedValues: TreeNodeValue[] = [];

    if (defaultExpandAll) {
      traverseTree(nodes, (node) => {
        if (node.nodes) {
          currentExpandedValues.push(node.value);
        }
      });
    }

    return currentExpandedValues;
  });

  const onExpand: TreeNodeListProps['onExpand'] = (value) => {
    const newExpandedValues = toggleValue(value, expandedValues);

    setExpandedValues(newExpandedValues);
    onExpandProp?.(value);
  };

  // Convert valueProp to single value for single mode
  const triggerValue = multiple ? valueProp : (valueProp?.[0] ?? undefined);

  // Adapt renderValue for single mode
  const adaptedRenderValue = renderValue && !multiple
    ? (value?: SelectValue | null) => renderValue(value ?? null)
    : undefined;

  return (
    <div ref={nodeRef} className={classes.treeSelect}>
      <SelectTrigger
        ref={composedRef}
        active={open}
        className={className}
        clearable={clearable}
        disabled={disabled}
        error={error}
        fullWidth={fullWidth}
        inputProps={resolvedInputProps}
        inputRef={inputRef}
        mode={mode}
        onClear={onClear}
        onClick={onTextFieldClick}
        onKeyDown={onTextFieldKeydown}
        onTagClose={onTagClose}
        prefix={prefix}
        readOnly
        {...(mode === 'single' && adaptedRenderValue ? { renderValue: adaptedRenderValue } : {})}
        required={required}
        size={size}
        suffixActionIcon={suffixActionIcon}
        value={triggerValue}
      />
      <InputTriggerPopper
        ref={popperRef}
        anchor={controlRef}
        className={classes.popper}
        controllerRef={controllerRef}
        open={open}
        options={popperOptions}
        sameWidth={sameWidth}
      >
        <Menu
          itemsInView={itemsInView}
          maxHeight={menuMaxHeight}
          role={menuRole}
          size={menuSize}
          style={{
            ...restStyle,
            border: border || 0,
            width: width || `${panelWidth}px`,
          }}
        >
          <Tree
            {...restTreeProps}
            ref={ref}
            className={cx(classes.tree, treeClassName)}
            disabledValues={disabledValues}
            expandControllerRef={expandControllerRef}
            expandedValues={expandedValues}
            multiple={multiple}
            nodes={nodes}
            onExpand={onExpand}
            onSelect={onSelect}
            selectMethod="target"
            selectable
            values={selectedValues}
          />
        </Menu>
      </InputTriggerPopper>
    </div>
  );
});

export default TreeSelect;
