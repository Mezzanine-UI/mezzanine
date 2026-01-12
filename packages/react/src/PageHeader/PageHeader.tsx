import { cloneElement, forwardRef, isValidElement, ReactElement } from 'react';
import { pageHeaderClasses as classes } from '@mezzanine-ui/core/page-header';
import Breadcrumb, { BreadcrumbProps } from '../Breadcrumb';
import ContentHeader, { ContentHeaderProps } from '../ContentHeader';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { flattenChildren } from '../utils/flatten-children';

type PageHeaderChild =
  | ReactElement<BreadcrumbProps>
  | ReactElement<ContentHeaderProps>
  | null
  | undefined
  | false;

/**
 * Props for the PageHeader component.
 * Extends native HTML header element props.
 */
export type PageHeaderProps = NativeElementPropsWithoutKeyAndRef<'header'> & {
  /**
   * Child components: Breadcrumb or ContentHeader
   * */
  children?: PageHeaderChild | PageHeaderChild[];
};

const getBreadcrumbAndToolbar = (
  children: PageHeaderProps['children'],
): {
  breadcrumb?: ReactElement<BreadcrumbProps>;
  contentHeader?: ReactElement<ContentHeaderProps>;
} => {
  let breadcrumb: ReactElement<BreadcrumbProps> | undefined;
  let contentHeader: ReactElement<ContentHeaderProps> | undefined;

  const childrenArray = flattenChildren(children);

  if (children) {
    childrenArray.forEach((child) => {
      if (!isValidElement(child)) return;

      if (child.type === Breadcrumb) {
        if (breadcrumb) {
          console.warn(
            '[Mezzanine][PageHeader] only accepts one Breadcrumb as its child.',
          );
        }

        breadcrumb = child as ReactElement<BreadcrumbProps>;
      } else if (child.type === ContentHeader) {
        if (contentHeader) {
          console.warn(
            '[Mezzanine][PageHeader] only accepts one ContentHeader as its child.',
          );
        }

        const sizeProp = (child as ReactElement<ContentHeaderProps>).props.size;

        if (sizeProp !== undefined && sizeProp !== 'main') {
          console.warn(
            '[Mezzanine][PageHeader] ContentHeader size prop will be overridden to "main".',
          );
        }

        contentHeader = cloneElement(
          child as ReactElement<ContentHeaderProps>,
          {
            size: 'main',
          },
        ) as ReactElement<ContentHeaderProps>;
      } else {
        console.warn(
          '[Mezzanine][PageHeader] only accepts Breadcrumb or ContentHeader as its children.',
        );
      }
    });
  }

  if (!contentHeader) {
    console.error(
      '[Mezzanine][PageHeader] requires a ContentHeader as its child.',
    );
  }

  return { breadcrumb, contentHeader };
};

/**
 * PageHeader component
 *
 * Used to display the page header, typically containing a `<Breadcrumb />` and a `<ContentHeader />`.
 *
 * @example
 * ```tsx
 * <PageHeader>
 *   <Breadcrumb
 *     links={[
 *       { id: '1', children: 'Home', href: '/' },
 *       { id: '2', children: 'Page Header' },
 *     ]}
 *   />
 *
 *   <ContentHeader
 *     title="Page Title"
 *     description="This is the page description."
 *   >
 *     <Button variant="base-secondary">Secondary</Button>
 *     <Button>Primary</Button>
 *   </ContentHeader>
 * </PageHeader>
 * ```
 */
const PageHeader = forwardRef<HTMLElement, PageHeaderProps>(
  function PageHeader(props, ref) {
    const { children, className, ...rest } = props;

    const { breadcrumb, contentHeader } = getBreadcrumbAndToolbar(children);

    return (
      <header {...rest} className={cx(classes.host, className)} ref={ref}>
        {breadcrumb}
        {contentHeader}
      </header>
    );
  },
);

export default PageHeader;
