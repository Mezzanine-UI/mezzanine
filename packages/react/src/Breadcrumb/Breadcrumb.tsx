import { cloneElement, forwardRef, isValidElement, ReactElement } from 'react';
import { breadcrumbClasses as classes } from '@mezzanine-ui/core/breadcrumb';
import { SlashIcon } from '@mezzanine-ui/icons';
import { cx } from '../utils/cx';
import { flattenChildren } from '../utils/flatten-children';
import Icon from '../Icon';
import BreadcrumbItem from './BreadcrumbItem';
import { BreadcrumbOverflowMenu } from './BreadcrumbOverflowMenu';
import type { BreadcrumbItemProps, BreadcrumbProps } from './typings';

const renderItemWithProps = (
  item: BreadcrumbItemProps | ReactElement<BreadcrumbItemProps>,
  appendProps?: Partial<BreadcrumbItemProps>,
) => {
  if (isValidElement(item)) {
    return cloneElement(item, appendProps);
  }

  return <BreadcrumbItem {...item} {...appendProps} />;
};

const convertToPropsWithId = (
  item: BreadcrumbItemProps | ReactElement<BreadcrumbItemProps>,
): BreadcrumbItemProps & { id: string } => {
  if (isValidElement(item)) {
    return { id: item.props.id || item.props.name, ...item.props };
  }

  return { id: item.id || item.name, ...item };
};

const renderItems = (
  items: Array<BreadcrumbItemProps> | ReactElement<BreadcrumbItemProps>[],
  condensed?: boolean,
) => {
  if (!items) {
    return null;
  }

  const lastIndex = items.length - 1;

  const hasOverflowDropdownIcon = !condensed || items.length > 2;
  const collapsedProps = hasOverflowDropdownIcon
    ? condensed
      ? items.map((v) => convertToPropsWithId(v)).slice(0, lastIndex - 1)
      : items.map((v) => convertToPropsWithId(v)).slice(2, lastIndex - 1)
    : [];

  return (
    <>
      {/* home */}
      {!condensed &&
        lastIndex >= 0 &&
        renderItemWithProps(items[0], { current: lastIndex === 0 })}

      {/* second */}
      {!condensed && lastIndex >= 1 && (
        <>
          <Icon icon={SlashIcon} size={14} />
          {renderItemWithProps(items[1], { current: lastIndex === 1 })}
        </>
      )}

      {/* default mode with length <= 4 */}
      {!condensed && items.length <= 4 && (
        <>
          {lastIndex >= 2 && (
            <>
              <Icon icon={SlashIcon} size={14} />
              {renderItemWithProps(items[2], { current: lastIndex === 2 })}
            </>
          )}

          {lastIndex === 3 && (
            <>
              <Icon icon={SlashIcon} size={14} />
              {renderItemWithProps(items[3], { current: true })}
            </>
          )}
        </>
      )}

      {/* default mode with length > 4 or condensed mode with length > 2 */}
      {(items.length > 4 || condensed) && (
        <>
          {!condensed && <Icon icon={SlashIcon} size={14} />}

          {hasOverflowDropdownIcon && (
            <>
              <BreadcrumbOverflowMenu collapsedProps={collapsedProps} />
              <Icon icon={SlashIcon} size={14} />
            </>
          )}

          {/* parent of current */}
          {lastIndex - 1 >= 0 && (
            <>
              {renderItemWithProps(items[lastIndex - 1])}
              <Icon icon={SlashIcon} size={14} />
            </>
          )}

          {/* current */}
          {renderItemWithProps(items[lastIndex], { current: true })}
        </>
      )}
    </>
  );
};

/**
 * The react component for `mezzanine` breadcrumb.
 */
const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  function Breadcrumb(props, ref) {
    const { children, className, condensed, items, ...rest } = props;

    const flatChildren = flattenChildren(children);
    const itemFragment = renderItems(
      items || (flatChildren as ReactElement<BreadcrumbItemProps>[]),
      condensed,
    );

    return (
      <nav
        {...rest}
        aria-label="Breadcrumb"
        className={cx(classes.host, className)}
        ref={ref}
      >
        {itemFragment}
      </nav>
    );
  },
);

export default Breadcrumb;
