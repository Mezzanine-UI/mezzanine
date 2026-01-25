import { forwardRef } from 'react';
import { breadcrumbItemClasses as classes } from '@mezzanine-ui/core/breadcrumb';
import { cx } from '../utils/cx';
import Typography from '../Typography';
import BreadcrumbDropdown from './BreadcrumbDropdown';
import type { BreadcrumbItemProps } from './typings';

const BreadcrumbItem = forwardRef<HTMLSpanElement, BreadcrumbItemProps>(
  function BreadcrumbItem(props, ref) {
    if ('options' in props) return <BreadcrumbDropdown {...props} />;

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
          className={cx(classes.trigger, current && classes.current)}
          onClick={TriggerComponent === 'a' ? handleClick : undefined}
        >
          {name && (
            <Typography variant={current ? 'caption-highlight' : 'caption'}>
              {name}
            </Typography>
          )}
        </TriggerComponent>
      </span>
    );
  },
);

export default BreadcrumbItem;
