import { Children, forwardRef, isValidElement } from 'react';
import { layoutClasses as classes } from '@mezzanine-ui/core/layout';
import { cx } from '../utils/cx';
import Navigation from '../Navigation';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { LayoutHost } from './LayoutHost';
import { LayoutLeftPanel, LayoutLeftPanelProps } from './LayoutLeftPanel';
import { LayoutMain, LayoutMainProps } from './LayoutMain';
import { LayoutRightPanel, LayoutRightPanelProps } from './LayoutRightPanel';

export { LayoutLeftPanel };
export type { LayoutLeftPanelProps };
export { LayoutMain };
export type { LayoutMainProps };
export { LayoutRightPanel };
export type { LayoutRightPanelProps };

export interface LayoutProps extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * Slot children. Place `<Navigation>`, `<Layout.LeftPanel>`, `<Layout.Main>`,
   * and `<Layout.RightPanel>` as direct children in any order.
   * They will be re-ordered into the correct DOM sequence automatically.
   */
  children?: React.ReactNode;
  /**
   * Additional class name applied to the content wrapper element.
   */
  contentWrapperClassName?: string;
  /**
   * Additional class name applied to the navigation wrapper element. Only has effect if a `<Navigation>` component is provided as a child.
   */
  navigationClassName?: string;
}

const Layout = forwardRef<HTMLDivElement, LayoutProps>(
  function Layout(props, ref) {
    const { children, contentWrapperClassName, navigationClassName, ...rest } =
      props;

    let navigationNode: React.ReactNode = null;
    let leftPanelNode: React.ReactNode = null;
    let mainNode: React.ReactNode = null;
    let rightPanelNode: React.ReactNode = null;

    Children.forEach(children, (child) => {
      if (!isValidElement(child)) return;

      if (child.type === Navigation) {
        navigationNode = child;
      } else if (child.type === LayoutLeftPanel) {
        leftPanelNode = child;
      } else if (child.type === LayoutMain) {
        mainNode = child;
      } else if (child.type === LayoutRightPanel) {
        rightPanelNode = child;
      }
    });

    return (
      <LayoutHost {...rest} ref={ref}>
        {navigationNode && (
          <div className={cx(classes.navigation, navigationClassName)}>
            {navigationNode}
          </div>
        )}
        <div className={cx(classes.contentWrapper, contentWrapperClassName)}>
          {leftPanelNode}
          {mainNode}
          {rightPanelNode}
        </div>
      </LayoutHost>
    );
  },
);

const LayoutWithSubComponents = Object.assign(Layout, {
  LeftPanel: LayoutLeftPanel,
  Main: LayoutMain,
  RightPanel: LayoutRightPanel,
});

export default LayoutWithSubComponents;
