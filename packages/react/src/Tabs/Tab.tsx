import { forwardRef } from 'react';
import { tabsClasses as classes } from '@mezzanine-ui/core/tabs';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface TabProps extends NativeElementPropsWithoutKeyAndRef<'button'> {
  /**
   * Whether the tab is active.
   * Controlled by tabs.
   */
  active?: boolean;
  /**
   * Whether the tab is disabled
   * @default false
   */
  disabled?: boolean;
}

/**
 * The react component for `mezzanine` tab.
 */
const Tab = forwardRef<HTMLButtonElement, TabProps>(function Tab(props, ref) {
  const { active, children, className, disabled, ...rest } = props;

  return (
    <button
      {...rest}
      ref={ref}
      type="button"
      aria-disabled={disabled}
      className={cx(
        classes.tab,
        {
          [classes.tabActive]: active,
        },
        className,
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
});

export default Tab;
