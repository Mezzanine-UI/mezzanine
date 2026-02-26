import { Children, forwardRef, isValidElement } from 'react';
import { layoutClasses as classes } from '@mezzanine-ui/core/layout';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { LayoutHost } from './LayoutHost';
import { LayoutMain, LayoutMainProps } from './LayoutMain';
import { LayoutSidePanel, LayoutSidePanelProps } from './LayoutSidePanel';

export { LayoutMain };
export type { LayoutMainProps };
export { LayoutSidePanel };
export type { LayoutSidePanelProps };

export interface LayoutProps extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /** The slot children: use `Layout.Main` and `Layout.SidePanel` as direct children. */
  children?: React.ReactNode;
}

const Layout = forwardRef<HTMLDivElement, LayoutProps>(
  function Layout(props, ref) {
    const { children, ...rest } = props;

    let mainContent: React.ReactNode = null;
    let sidePanelNode: React.ReactElement<LayoutSidePanelProps> | null = null;
    let initialOpen = false;
    let initialSidePanelWidth = 320;

    Children.forEach(children, (child) => {
      if (!isValidElement(child)) return;

      if (child.type === LayoutMain) {
        mainContent = (child as React.ReactElement<LayoutMainProps>).props
          .children;
      } else if (child.type === LayoutSidePanel) {
        const sidePanelChild =
          child as React.ReactElement<LayoutSidePanelProps>;

        sidePanelNode = sidePanelChild;
        initialOpen = sidePanelChild.props.open ?? false;
        initialSidePanelWidth =
          sidePanelChild.props.defaultSidePanelWidth ?? 320;
      }
    });

    return (
      <LayoutHost
        {...rest}
        initialOpen={initialOpen}
        initialSidePanelWidth={initialSidePanelWidth}
        ref={ref}
      >
        <main className={classes.main}>{mainContent}</main>
        {sidePanelNode}
      </LayoutHost>
    );
  },
);

const LayoutWithSubComponents = Object.assign(Layout, {
  Main: LayoutMain,
  SidePanel: LayoutSidePanel,
});

export default LayoutWithSubComponents;
