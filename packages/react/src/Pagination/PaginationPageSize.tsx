import { forwardRef, DetailedHTMLProps, HTMLAttributes, useMemo } from 'react';
import { paginationPageSizeClasses as classes } from '@mezzanine-ui/core/pagination';
import Typography from '../Typography';
import { cx } from '../utils/cx';
import Select, { Option } from '../Select';

export interface PaginationPageSizeProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    'onChange'
  > {
  /**
   * If `true`, the pagination page size fields is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Label display before `select`
   */
  label?: string;
  /**
   * Callback fired when the page size is changed.
   *
   * @param {number} pageSize The page active.
   */
  onChange?: (pageSize: number) => void;
  /**
   * options for `select` to use
   * @default [10, 20, 50, 100]
   */
  options?: number[];
  /**
   * Callback to custom render option name
   * @default (p) => `${p}`
   */
  renderOptionName?: (pageSize: number) => string;
  /**
   * unit display after `select`
   */
  unit?: string;
  /**
   * Current page size value
   */
  value?: number;
}

const PaginationPageSize = forwardRef<HTMLDivElement, PaginationPageSizeProps>(
  (props, ref) => {
    const {
      className,
      disabled = false,
      label,
      onChange,
      options = [10, 20, 50, 100],
      renderOptionName = (p) => `${p}`,
      unit,
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
          <Typography
            color="text-secondary"
            component="div"
            ellipsis
            variant="button3"
          >
            {label}
          </Typography>
        ) : null}
        <Select
          disabled={disabled}
          value={currentValue}
          onChange={(nextSelection) => onChange?.(Number(nextSelection.id))}
          className={classes.select}
        >
          {options.map((opt) => (
            <Option key={opt} value={`${opt}`}>
              {renderOptionName(opt)}
            </Option>
          ))}
        </Select>
        {unit ? (
          <Typography
            color="text-secondary"
            component="div"
            ellipsis
            variant="button3"
          >
            {unit}
          </Typography>
        ) : null}
      </div>
    );
  },
);

export default PaginationPageSize;
