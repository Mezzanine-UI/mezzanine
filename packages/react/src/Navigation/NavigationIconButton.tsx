import { forwardRef } from 'react';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import { navigationIconButtonClasses as classes } from '@mezzanine-ui/core/navigation';
import Icon from '../Icon';
import { IconDefinition } from '@mezzanine-ui/icons';

export type NavigationIconButtonProps = Omit<
  NativeElementPropsWithoutKeyAndRef<'button'>,
  'children'
> & {
  /**
   * The icon to be displayed.
   */
  icon: IconDefinition;
};

const NavigationIconButton = forwardRef<
  HTMLButtonElement,
  NavigationIconButtonProps
>((props, ref) => {
  const { className, icon, ...rest } = props;

  return (
    <button {...rest} ref={ref} className={cx(classes.host, className)}>
      <Icon size={16} icon={icon} />
    </button>
  );
});

export default NavigationIconButton;
