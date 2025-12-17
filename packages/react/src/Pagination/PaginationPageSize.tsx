import { forwardRef, DetailedHTMLProps, HTMLAttributes, useMemo } from 'react';
import { paginationPageSizeClasses as classes } from '@mezzanine-ui/core/pagination';
import Typography from '../Typography';
import { cx } from '../utils/cx';
import { SelectTrigger } from '../Select';

export interface PaginationPageSizeProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    'onChange'
  > {
  /**
   * If `true`, the pagination page size fields are disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Label displayed before select.
   */
  label?: string;
  /**
   * Callback fired when the page size is changed.
   * @param {number} pageSize The new page size.
   */
  onChange?: (pageSize: number) => void;
  /**
   * Options for select component.
   * @default [10, 20, 50, 100]
   */
  options?: number[];
  /**
   * Callback to render custom option name.
   * @param {number} pageSize The page size value.
   * @returns {string}
   * @default (p) => `${p}`
   */
  renderOptionName?: (pageSize: number) => string;
  /**
   * Current page size value.
   */
  value?: number;
}

const PaginationPageSize = forwardRef<HTMLDivElement, PaginationPageSizeProps>(
  (props, ref) => {
    const {
      className,
      disabled = false,
      label,
      /* TODO: waiting Select onChange, Dropdown Menu options */
      onChange,
      options = [10, 20, 50, 100],
      renderOptionName = (p) => `${p}`,
      value,
      ...rest
    } = props;

    const currentValue = useMemo(
      () =>
        value
          ? {
              id: `${value}`,
              name: renderOptionName(value),
            }
          : undefined,
      [value, renderOptionName],
    );

    return (
      <div {...rest} ref={ref} className={cx(classes.host, className)}>
        {label ? (
          <Typography component="div" ellipsis variant="label-primary">
            {label}
          </Typography>
        ) : null}
        <SelectTrigger
          className={classes.select}
          disabled={disabled}
          size="sub"
          value={currentValue}
        >
          {/* TODO: waiting Select onChange, Dropdown Menu options */}
        </SelectTrigger>
      </div>
    );
  },
);

export default PaginationPageSize;
