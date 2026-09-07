import type { FilterAlign, FilterSpan } from '@mezzanine-ui/core/filter-area';

export interface FilterProps {
  /**
   * Layout control - Vertical alignment of the field.
   * @default 'stretch'
   */
  align?: FilterAlign;
  /**
   * Layout control - Whether the field should automatically expand to fill the entire row (equivalent to span={6}).
   * @default false
   */
  grow?: boolean;
  /**
   * Layout control - Minimum width of the field.
   */
  minWidth?: string | number;
  /**
   * Layout control - Number of columns the field occupies in the Grid (1-6, Grid has 6 columns total).
   * This property is ignored when grow is true.
   * @default 2
   */
  span?: FilterSpan;
}
