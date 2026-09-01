import { forwardRef } from 'react';
import { navigationIconButtonClasses as classes } from '@mezzanine-ui/core/navigation';
import { IconDefinition } from '@mezzanine-ui/icons';
import Icon from '../Icon';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export type NavigationIconButtonProps = Omit<
  NativeElementPropsWithoutKeyAndRef<'button'>,
  'children'
> & {
  /**
   * Whether the button is in an active state.
   */
  active?: boolean;
  /**
   * The icon to be displayed.
   */
  icon: IconDefinition;
} & {
  /**
   * Accessible name for the button.
   *
   * This component renders an icon and nothing else — `children` is not
   * accepted — so there is no visible text for assistive technology to fall
   * back on. Without `aria-label` the button has no accessible name at all and
   * axe reports a critical `button-name`.
   */
  'aria-label'?: string;
};

const NavigationIconButton = forwardRef<
  HTMLButtonElement,
  NavigationIconButtonProps
>((props, ref) => {
  const { active, className, icon, ...rest } = props;

  return (
    <button
      {...rest}
      ref={ref}
      className={cx(classes.host, active && classes.active, className)}
      type="button"
    >
      <Icon icon={icon} size={16} />
    </button>
  );
});

export default NavigationIconButton;
