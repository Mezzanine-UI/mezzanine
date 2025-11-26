import { forwardRef } from 'react';
import { breadcrumbClasses as classes } from '@mezzanine-ui/core/breadcrumb';
import { cx } from '../utils/cx';
import { BreadcrumbDropdownItemProps, BreadcrumbProps } from './typings';
import { SlashIcon } from '@mezzanine-ui/icons';
import Icon from '../Icon';
import BreadcrumbItem from './BreadcrumbItem';

/**
 * The react component for `mezzanine` breadcrumb.
 */
const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  function Breadcrumb(props, ref) {
    const { className, condensed, items, ...rest } = props;

    const lastIndex = items.length - 1;

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cx(classes.host, className)}
        {...rest}
      >
        {/* home */}
        {!condensed && lastIndex >= 0 && (
          <BreadcrumbItem {...items[0]} current={lastIndex === 0} />
        )}

        {/* second */}
        {!condensed && lastIndex >= 1 && (
          <>
            <Icon size={14} icon={SlashIcon} />
            <BreadcrumbItem {...items[1]} current={lastIndex === 1} />
          </>
        )}

        {/* default mode with length <= 4 */}
        {!condensed && items.length <= 4 && (
          <>
            {lastIndex >= 2 && (
              <>
                <Icon size={14} icon={SlashIcon} />
                <BreadcrumbItem {...items[2]} current={lastIndex === 2} />
              </>
            )}

            {lastIndex == 3 && (
              <>
                <Icon size={14} icon={SlashIcon} />
                <BreadcrumbItem {...items[3]} current />
              </>
            )}
          </>
        )}

        {/* default mode with length > 4 or condensed mode with length > 2 */}
        {(items.length > 4 || condensed) && (
          <>
            {!condensed && <Icon size={14} icon={SlashIcon} />}

            {(!condensed || items.length > 2) && (
              <>
                {/* overflow dropdown icon */}
                <BreadcrumbItem
                  {...({
                    options: condensed
                      ? items.slice(0, lastIndex - 1)
                      : items.slice(2, lastIndex - 1),
                  } as BreadcrumbDropdownItemProps)}
                />
                <Icon size={14} icon={SlashIcon} />
              </>
            )}

            {/* parent of current */}
            {lastIndex - 1 >= 0 && (
              <>
                <BreadcrumbItem {...items[lastIndex - 1]} />
                <Icon icon={SlashIcon} size={14} />
              </>
            )}

            {/* current */}
            <BreadcrumbItem {...items[lastIndex]} current />
          </>
        )}
      </nav>
    );
  },
);

export default Breadcrumb;
