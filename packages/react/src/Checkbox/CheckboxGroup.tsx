'use client';

import {
  CheckboxGroupLayout,
  CheckboxGroupOption,
  CheckboxMode,
  checkboxGroupClasses as classes,
} from '@mezzanine-ui/core/checkbox';
import {
  ChangeEvent,
  ChangeEventHandler,
  Children,
  ComponentProps,
  forwardRef,
  isValidElement,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
} from 'react';
import { useControlValueState } from '../Form/useControlValueState';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Checkbox, { CheckboxProps } from './Checkbox';
import { CheckboxGroupContext, CheckboxGroupContextValue } from './CheckboxGroupContext';

export interface CheckboxGroupChangeEventTarget extends HTMLInputElement {
  values: string[];
}

export type CheckboxGroupChangeEvent = ChangeEvent<HTMLInputElement> & {
  target: CheckboxGroupChangeEventTarget;
};

export function assignCheckboxGroupValuesToEvent(
  event: ChangeEvent<HTMLInputElement>,
  values: string[],
  name: string,
): CheckboxGroupChangeEvent {
  const target = event.target as CheckboxGroupChangeEventTarget;

  target.values = values;

  if (name) {
    target.name = name;
  }

  return event as CheckboxGroupChangeEvent;
}

type CheckboxGroupOptionInput = CheckboxGroupOption &
  Omit<
    ComponentProps<typeof Checkbox>,
    | 'checked'
    | 'mode'
    | 'children'
    | 'defaultChecked'
    | 'indeterminate'
    | 'inputProps'
    | 'inputRef'
    | 'name'
    | 'onChange'
    | 'ref'
    | 'value'
  > & {
    /**
     * The id of input element.
     * If not provided, will be auto-generated as `{name}-{value}`.
     */
    id?: string;
    /**
     * The react ref passed to input element.
     */
    inputRef?: ComponentProps<typeof Checkbox>['inputRef'];
    /**
     * Additional props for the input element.
     */
    inputProps?: ComponentProps<typeof Checkbox>['inputProps'];
  };

export interface CheckboxGroupLevelConfig {
  /**
   * Whether the level control is active.
   */
  active: boolean;
  /**
   * Whether the level control checkbox is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The label displayed for the level control checkbox.
   * @default 'Select all'
   */
  label?: string;
  /**
   * The mode of level control checkbox.
   * @default 'main'
   */
  mode?: CheckboxMode;
  /**
   * Custom onChange handler for the level control.
   * If not provided, the default behavior (select/deselect all) will be used.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

interface CheckboxGroupBaseProps extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * The default value of checkbox group.
   */
  defaultValue?: string[];
  /**
   * Whether the checkbox group is disabled.
   * Control the disabled of checkboxes in group if disabled not passed to checkbox.
   */
  disabled?: boolean;
  /**
   * The level control configuration.
   * When provided, a "select all" checkbox will be rendered above the group.
   */
  level?: CheckboxGroupLevelConfig;
  /**
   * The layout of checkbox group.
   * @default 'horizontal'
   */
  layout?: CheckboxGroupLayout;
  /**
   * The mode of checkboxes in the group.
   * Control the mode of checkboxes in group if mode not passed to checkbox.
   */
  mode?: CheckboxMode;
  /**
   * The name of checkbox group.
   * Control the name of checkboxes in group if name not passed to checkbox.
   * 
   * @important When integrating with react-hook-form, this prop is highly recommended.
   * All checkboxes in the group will share the same `name` attribute, which is required
   * for react-hook-form to correctly collect the selected values as an array.
   * 
   * @example Using with react-hook-form's Controller:
   * ```tsx
   * const { control } = useForm();
   * <Controller
   *   name="interests"
   *   control={control}
   *   render={({ field }) => (
   *     <CheckboxGroup
   *       name="interests"
   *       value={field.value || []}
   *       onChange={(e) => field.onChange(e.target.values)}
   *     >
   *       <Checkbox value="reading" label="Reading" />
   *       <Checkbox value="coding" label="Coding" />
   *     </CheckboxGroup>
   *   )}
   * />
   * ```
   */
  name?: string;
  /**
   * The onChange of checkbox group.
   * Provides the latest `values` array via `event.target.values`.
   */
  onChange?: (event: CheckboxGroupChangeEvent) => void;
  /**
   * The value of checkbox group.
   */
  value?: string[];
}

interface CheckboxGroupOptionsInputProps extends CheckboxGroupBaseProps {
  children?: never;
  options: CheckboxGroupOptionInput[];
}

interface CheckboxGroupChildrenInputProps extends CheckboxGroupBaseProps {
  children: ReactNode;
  options?: never;
}

export type CheckboxGroupProps =
  | CheckboxGroupOptionsInputProps
  | CheckboxGroupChildrenInputProps;

const equalityFn = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, idx) => val === sortedB[idx]);
};

/**
 * The react component for `mezzanine` checkbox group.
 */
const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  function CheckboxGroup(props, ref) {
    const {
      children: childrenProp,
      className,
      defaultValue,
      disabled,
      layout = 'horizontal',
      level,
      mode,
      name,
      options,
      onChange: onChangeProp,
      role = 'group',
      value: valueProp,
      ...rest
    } = props;

    const generatedName = useId();
    const resolvedName = name ?? generatedName;

    const normalizedOptions = useMemo(
      () => options ?? [],
      [options],
    );

    const [value, setValue] = useControlValueState<string[]>({
      defaultValue: defaultValue ?? [],
      equalityFn,
      value: valueProp,
    }).slice(0, 2) as [string[], (newValue: string[]) => void];

    const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
      (event) => {
        const checkboxValue = event.target.value;
        const isChecked = event.target.checked;
        const currentValue = value || [];
        const newValue = isChecked
          ? [...currentValue, checkboxValue]
          : currentValue.filter((v) => v !== checkboxValue);

        setValue(newValue);

        if (onChangeProp) {
          const syntheticEvent = assignCheckboxGroupValuesToEvent(
            event,
            newValue,
            resolvedName,
          );
          onChangeProp(syntheticEvent);
        }
      },
      [onChangeProp, resolvedName, setValue, value],
    );

    const context: CheckboxGroupContextValue = useMemo(
      () => ({
        disabled,
        name: resolvedName,
        onChange: handleChange,
        value: value || [],
      }),
      [disabled, resolvedName, handleChange, value],
    );

    const hasChildrenInput = typeof childrenProp !== 'undefined';
    const hasOptionsInput = Array.isArray(options);

    if (process.env.NODE_ENV !== 'production') {
      if (hasChildrenInput && hasOptionsInput) {
        console.error(
          'CheckboxGroup: Please provide either `children` or `options`, but not both.',
        );
      } else if (!hasChildrenInput && !hasOptionsInput) {
        console.error(
          'CheckboxGroup: Please provide one of `children` or `options`.',
        );
      }

      // Warn if name is not provided (important for react-hook-form integration)
      if (!name) {
        console.warn(
          'CheckboxGroup: The `name` prop is recommended, especially when integrating with react-hook-form. ' +
          'All checkboxes in the group should share the same `name` attribute.',
        );
      }

      // Validate that all children have value prop
      if (hasChildrenInput) {
        Children.forEach(childrenProp, (child, index) => {
          if (isValidElement(child) && child.type === Checkbox) {
            const checkboxProps = child.props as CheckboxProps;
            if (!checkboxProps.value) {
              console.warn(
                `CheckboxGroup: Each Checkbox child should have a \`value\` prop. ` +
                `Checkbox at index ${index} is missing the \`value\` prop.`,
              );
            }
          }
        });
      }
    }

    // Render priority: ReactNode (children) first, then options
    // If using ReactNode, only Checkbox components are supported, other components are not supported
    const children = useMemo(() => {
      // Render ReactNode (children) if provided
      // Note: Only Checkbox components are supported when using ReactNode input
      if (hasChildrenInput) {
        // Validate that all children are Checkbox components
        if (process.env.NODE_ENV !== 'production') {
          Children.forEach(childrenProp, (child) => {
            if (isValidElement(child) && child.type !== Checkbox) {
              console.warn(
                'CheckboxGroup: When using ReactNode (children) input, only Checkbox components are supported. ' +
                `Found unsupported component: ${typeof child.type === 'string' ? child.type : child.type?.name || 'Unknown'}`,
              );
            }
          });
        }
        return childrenProp;
      }

      if (hasOptionsInput && normalizedOptions.length > 0) {
        return normalizedOptions.map(
          ({
            label,
            value: optionValue,
            disabled: optionDisabled,
            id: optionId,
            inputProps: optionInputProps,
            inputRef: optionInputRef,
            ...optionRest
          }) => {
            // Generate unique id if not provided
            // Format: {name}-{value} or fallback to checkbox-{value}
            const generatedId = resolvedName
              ? `${resolvedName}-${optionValue}`
              : `checkbox-${optionValue}`;
            const finalId = optionId ?? generatedId;

            return (
              <Checkbox
                key={optionValue}
                disabled={optionDisabled ?? disabled}
                id={finalId}
                inputProps={optionInputProps}
                inputRef={optionInputRef}
                label={typeof label === 'string' ? label : String(label)}
                mode={mode}
                value={optionValue}
                {...optionRest}
              />
            );
          },
        );
      }

      return null;
    }, [
      childrenProp,
      disabled,
      hasChildrenInput,
      hasOptionsInput,
      mode,
      normalizedOptions,
      resolvedName,
    ]);

    const isLevelActive = level?.active ?? false;
    const isChipMode = mode === 'chip';
    const ariaOrientation = isLevelActive ? 'vertical' : layout;

    const canRenderLevelControl =
      isLevelActive && normalizedOptions.length > 0 && !isChipMode;

    useEffect(() => {
      if (isLevelActive && !hasOptionsInput) {
        console.warn(
          'CheckboxGroup: `level.active=true` currently supports only the `options` input approach.',
        );
      }
      if (isLevelActive && isChipMode) {
        console.warn(
          'CheckboxGroup: `level` is not supported when `mode="chip"`. Level control will be disabled.',
        );
      }
    }, [hasOptionsInput, isLevelActive, isChipMode]);

    const { levelChecked, levelIndeterminate } = useMemo(() => {
      if (!canRenderLevelControl) {
        return { levelChecked: false, levelIndeterminate: false };
      }

      const enabledOptions = normalizedOptions.filter((opt) => !opt.disabled);
      const enabledValues = enabledOptions.map((opt) => opt.value);
      const selectedEnabledValues = (value || []).filter((v) =>
        enabledValues.includes(v),
      );

      if (selectedEnabledValues.length === 0) {
        return { levelChecked: false, levelIndeterminate: false };
      }

      if (selectedEnabledValues.length === enabledValues.length) {
        return { levelChecked: true, levelIndeterminate: false };
      }

      return { levelChecked: false, levelIndeterminate: true };
    }, [canRenderLevelControl, normalizedOptions, value]);

    const handleLevelControlChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
      (event) => {
        if (!canRenderLevelControl) {
          return;
        }

        // Use custom onChange if provided
        if (level?.onChange) {
          level.onChange(event);
          return;
        }

        // Default behavior: select/deselect all
        const isChecked = event.target.checked;
        const currentValue = value || [];
        const enabledOptions = normalizedOptions.filter((opt) => !opt.disabled);
        const enabledValues = enabledOptions.map((opt) => opt.value);
        const disabledOptions = normalizedOptions.filter((opt) => opt.disabled);
        const disabledValues = disabledOptions.map((opt) => opt.value);
        const selectedDisabledValues = currentValue.filter((v) =>
          disabledValues.includes(v),
        );

        const newValue = isChecked
          ? [...enabledValues, ...selectedDisabledValues]
          : selectedDisabledValues;

        setValue(newValue);

        if (onChangeProp) {
          const syntheticEvent = assignCheckboxGroupValuesToEvent(
            event,
            newValue,
            resolvedName,
          );

          onChangeProp(syntheticEvent);
        }
      },
      [canRenderLevelControl, level, onChangeProp, normalizedOptions, resolvedName, setValue, value],
    );

    return (
      <div
        {...rest}
        ref={ref}
        aria-orientation={ariaOrientation}
        className={cx(
          classes.host,
          {
            [classes.nested]: isLevelActive,
          },
          className,
        )}
        role={role}
      >
        {canRenderLevelControl && (
          <Checkbox
            checked={levelChecked}
            disabled={disabled || level?.disabled}
            indeterminate={levelIndeterminate}
            label={level?.label ?? ''}
            mode={level?.mode ?? 'main'}
            onChange={handleLevelControlChange}
          />
        )}
        <div
          className={cx(
            classes.contentWrapper,
            classes.layout(layout),
            mode && classes.mode(mode),
          )}
        >
          <CheckboxGroupContext.Provider value={context}>
            {children}
          </CheckboxGroupContext.Provider>
        </div>
      </div>
    );
  },
);

export default CheckboxGroup;

