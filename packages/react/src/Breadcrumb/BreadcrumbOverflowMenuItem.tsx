import { forwardRef } from 'react';
import { breadcrumbOverflowMenuItemClasses as classes } from '@mezzanine-ui/core/breadcrumb';
import { cx } from '../utils/cx';
import Typography from '../Typography';
import type { BreadcrumbItemProps } from './typings';
import BreadcrumbOverflowMenuDropdown from './BreadcrumbOverflowMenuDropdown';

const BreadcrumbOverflowMenuItem = forwardRef<
  HTMLSpanElement,
  BreadcrumbItemProps
>(function BreadcrumbOverflowMenuItem(props, ref) {
  if ('options' in props) return <BreadcrumbOverflowMenuDropdown {...props} />;

  const { className, component, current, name, onClick, ...rest } = props;

  const TriggerComponent = (() => {
    if (component) return component;

    if (
      (!current && 'href' in props && typeof props.href === 'string') ||
      'onClick' in props
    ) {
      return 'a';
    }

    return 'span';
  })();

  const handleClick = () => {
    onClick?.();
  };

  return (
    <span {...rest} className={cx(classes.host, className)} ref={ref}>
      <TriggerComponent
        className={cx(classes.trigger)}
        onClick={TriggerComponent === 'a' ? handleClick : undefined}
      >
        <Typography variant={'label-primary'}>{name}</Typography>
      </TriggerComponent>
    </span>
  );
});

export default BreadcrumbOverflowMenuItem;
