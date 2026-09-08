import type { CSSProperties } from 'vue';
import type { TableDataSource } from '@mezzanine-ui/core/table';

export interface TableExpandedRowProps<
  T extends TableDataSource = TableDataSource,
> {
  /** The row whose expanded content this is. */
  record: T;
  /** Extra inline style. */
  style?: CSSProperties;
}
