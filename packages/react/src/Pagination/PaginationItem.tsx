import { DetailedHTMLProps, forwardRef, HTMLAttributes, Ref } from 'react';
import {
  PaginationItemType,
  paginationItemClasses as classes,
} from '@mezzanine-ui/core/pagination';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DotHorizontalIcon,
  DoubleChevronLeftIcon,
  DoubleChevronRightIcon,
  IconDefinition,
} from '@mezzanine-ui/icons';

import Icon from '../Icon';

import { cx } from '../utils/cx';
import Typography from '../Typography';

export type PaginationItemElement = HTMLButtonElement | HTMLDivElement;

export interface PaginationItemProps
  extends Omit<
    DetailedHTMLProps<
      HTMLAttributes<PaginationItemElement>,
      PaginationItemElement
    >,
    'ref'
  > {
  /**
   * If `true`, the pagination item is active.
   * @default false
   */
  active?: boolean;
  /**
   * If `true`, the pagination item is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The page number.
   * @default 1
   */
  page?: number;
  /**
   * Whether the field type.
   * @default 'page'
   */
  type?: PaginationItemType;
}

const PaginationItem = forwardRef<PaginationItemElement, PaginationItemProps>(
  (props, ref) => {
    const {
      active = false,
      className,
      disabled = false,
      page = 1,
      type = 'page',
      ...rest
    } = props;

    const icons: { [index: string]: IconDefinition } = {
      next: ChevronRightIcon,
      previous: ChevronLeftIcon,
      first: DoubleChevronLeftIcon,
      last: DoubleChevronRightIcon,
    };

    const ButtonIcon = icons[type];

    return type === 'ellipsis' ? (
      <div
        {...rest}
        ref={ref as Ref<HTMLDivElement>}
        className={cx(
          classes.host,
          classes.ellipsis,
          {
            [classes.disabled]: disabled,
          },
          className,
        )}
      >
        <Icon icon={DotHorizontalIcon} />
      </div>
    ) : (
      <button
        {...rest}
        ref={ref as Ref<HTMLButtonElement>}
        key={page}
        disabled={disabled}
        className={cx(
          classes.host,
          classes.button,
          {
            [classes.active]: active,
            [classes.disabled]: disabled,
          },
          className,
        )}
        type="button"
      >
        {ButtonIcon && <Icon icon={ButtonIcon} />}
        {type === 'page' && (
          <Typography variant="label-primary">{page}</Typography>
        )}
      </button>
    );
  },
);

export default PaginationItem;
