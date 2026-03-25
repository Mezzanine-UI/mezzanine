'use client';

import { Children, cloneElement, forwardRef, isValidElement, ReactElement, ReactNode, useContext, useMemo } from 'react';

import {
  filterAreaClasses as classes,
  FilterAlign,
  filterAreaPrefix,
  FilterSpan,
} from '@mezzanine-ui/core/filter-area';

import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

import { FormFieldProps } from '../Form';
import FilterAreaContext, { FilterAreaContextValue } from './FilterAreaContext';
import type { FilterAreaSize } from '@mezzanine-ui/core/filter-area';

export interface FilterProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'children'> {
  /**
   * Layout control - Vertical alignment of the field.
   * @default 'stretch'
   */
  align?: FilterAlign;
  /**
   * The content of the filter field.
   */
  children: ReactElement<FormFieldProps> | ReactElement<FormFieldProps>[];
  /**
   * Layout control - Whether the field should automatically expand to fill the entire row (equivalent to span={12}).
   * @default false
   */
  grow?: boolean;
  /**
   * Layout control - Minimum width of the field.
   */
  minWidth?: string | number;
  /**
   * Layout control - Number of columns the field occupies in the Grid (1-12, Grid has 12 columns total).
   * This property is ignored when grow is true.
   * @default 2
   */
  span?: FilterSpan;
}

/**
 * 單一篩選條件元件，用於在 FilterLine 中定義欄位的佔位寬度。
 *
 * 使用 12 欄 Grid，`span` 決定欄位佔用幾欄（1–6）；
 * `grow` 設為 `true` 時欄位自動填滿整行。
 * 從 FilterAreaContext 繼承 `size`，統一套用至內部的輸入元件。
 *
 * @example
 * ```tsx
 * import { Filter } from '@mezzanine-ui/react';
 * import { FormField } from '@mezzanine-ui/react';
 * import Input from '@mezzanine-ui/react/Input';
 *
 * <Filter span={2}>
 *   <FormField label="名稱" name="name" layout="horizontal">
 *     <Input placeholder="請輸入" />
 *   </FormField>
 * </Filter>
 * ```
 *
 * @see {@link FilterLine} 包含 Filter 的行容器
 * @see {@link FilterArea} 管理整個篩選器的容器
 */
const Filter = forwardRef<HTMLDivElement, FilterProps>(
  function Filter(props, ref) {
    const {
      align = 'stretch',
      children,
      className,
      grow = false,
      minWidth,
      span = 2,
      ...rest
    } = props;

    const { size } = (useContext(FilterAreaContext) ?? {}) as FilterAreaContextValue;

    const filterClassName = useMemo(
      () =>
        cx(
          classes.filter,
          {
            [classes.filterGrow]: grow,
            [classes.filterAlign(align)]: align,
          },
          className,
        ),
      [align, className, grow],
    );

    const style = useMemo(
      () => ({
        ...(minWidth && { minWidth: typeof minWidth === 'number' ? `${minWidth}px` : minWidth }),
        ...(!grow && {
          [`--${filterAreaPrefix}-filter-span`]: span,
        }),
        ...rest.style,
      }),
      [grow, minWidth, rest.style, span],
    );

    const sizedChildren = useMemo(() => {
      if (!size) return children;
      return Children.map(children, (formField) => {
        const sizedInputs = Children.map(
          formField.props.children as ReactNode,
          (inputChild) => {
            if (!isValidElement(inputChild)) return inputChild;
            const { size: ownSize } = inputChild.props as { size?: FilterAreaSize };
            if (ownSize !== undefined) return inputChild;
            return cloneElement(inputChild as ReactElement<{ size: FilterAreaSize }>, { size });
          },
        );
        return cloneElement(formField, {}, sizedInputs);
      });
    }, [children, size]);

    return (
      <div
        {...rest}
        ref={ref}
        className={filterClassName}
        style={style}
      >
        {sizedChildren}
      </div>
    );
  },
);

export default Filter;

