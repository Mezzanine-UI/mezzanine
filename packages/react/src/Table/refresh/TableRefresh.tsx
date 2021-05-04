import {
  forwardRef,
  useContext,
  useCallback,
  MouseEvent,
} from 'react';
import {
  tableClasses as classes,
} from '@mezzanine-ui/core/table';
import { ResetIcon } from '@mezzanine-ui/icons';
import { TableContext } from '../TableContext';
import { NativeElementPropsWithoutKeyAndRef } from '../../utils/jsx-types';
import Button from '../../Button';
import Icon from '../../Icon';

export interface TableRefreshProps extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'onClick'> {
  /**
   * callback when button is clicked
   */
  onClick?(e: MouseEvent): void;
}

const TableRefresh = forwardRef<HTMLDivElement, TableRefreshProps>(
  function TableRefresh(props, ref) {
    const {
      className,
      children,
      onClick,
      ...rest
    } = props;

    const {
      setLoading,
    } = useContext(TableContext) || {};

    const onRefreshClicked = useCallback((e: MouseEvent) => {
      e.stopPropagation();

      setLoading?.(true);
      onClick?.(e);
    }, [
      onClick,
      setLoading,
    ]);

    return (
      <div
        ref={ref}
        className={classes.refresh}
        {...rest}
      >
        <Button
          onClick={onRefreshClicked}
          prefix={<Icon icon={ResetIcon} />}
        >
          {children || '重新整理'}
        </Button>
      </div>
    );
  },
);

export default TableRefresh;
