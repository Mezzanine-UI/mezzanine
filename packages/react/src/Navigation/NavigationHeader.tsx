import { forwardRef, ReactNode, use } from 'react';
import { navigationHeaderClasses as classes } from '@mezzanine-ui/core/navigation';
import { SiderIcon } from '@mezzanine-ui/icons';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import NavigationIconButton from './NavigationIconButton';
import { NavigationActivatedContext } from './context';

export interface NavigationHeaderProps
  extends NativeElementPropsWithoutKeyAndRef<'header'> {
  /**
   * Custom content to render inside the header, typically an icon or logo.
   */
  children?: ReactNode;
  /**
   * The title text displayed in the header.
   */
  title: string;
  /**
   * Callback function invoked when the brand area (logo and title) is clicked.
   */
  onBrandClick?: () => void;
}

const NavigationHeader = forwardRef<HTMLElement, NavigationHeaderProps>(
  (props, ref) => {
    const { children, className, title, onBrandClick, ...rest } = props;

    const { collapsed, handleCollapseChange } = use(NavigationActivatedContext);

    const BrandComponent = onBrandClick ? 'button' : 'span';

    return (
      <header
        {...rest}
        ref={ref}
        className={cx(classes.host, collapsed && classes.collapsed, className)}
      >
        <NavigationIconButton
          onClick={() => handleCollapseChange(!collapsed)}
          icon={SiderIcon}
        />
        <BrandComponent className={classes.content} onClick={onBrandClick}>
          {children}
          <span className={classes.title}>{title}</span>
        </BrandComponent>
      </header>
    );
  },
);

export default NavigationHeader;
