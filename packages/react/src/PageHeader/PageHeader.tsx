import {
  Children,
  cloneElement,
  forwardRef,
  HTMLAttributes,
  isValidElement,
  ReactElement,
} from 'react';
import { ChevronLeftIcon } from '@mezzanine-ui/icons';
import { pageHeaderClasses as classes } from '@mezzanine-ui/core/page-header';
import Breadcrumb, { BreadcrumbProps } from '../Breadcrumb';
import Button, { ButtonComponent, ButtonProps } from '../Button';
import PageToolbar, { PageToolbarProps } from '../PageToolbar';
import Typography, { TypographyProps } from '../Typography';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

type PageHeaderChild =
  | ReactElement<BreadcrumbProps>
  | ReactElement<PageToolbarProps>
  | ReactElement<ButtonProps>
  | ReactElement<HTMLAttributes<HTMLAnchorElement>>;

/**
 * Props for the PageHeader component.
 * Extends native HTML header element props.
 */
export type PageHeaderProps = NativeElementPropsWithoutKeyAndRef<'header'> & {
  /** Optional description text displayed below the title */
  description?: string;
  /** Main title text for the page header */
  title: string;
  /** HTML element type for the title (defaults to 'h2') */
  titleComponent?: TypographyProps['component'];
  /** Child components: Breadcrumb, PageToolbar, Button, or component with href prop */
  children?: PageHeaderChild | PageHeaderChild[];
};

const getBreadcrumbAndToolbar = (
  children: PageHeaderProps['children'],
): {
  breadcrumb?: ReactElement<BreadcrumbProps>;
  pageToolbar?: ReactElement<PageToolbarProps>;
  backButtonOrLink?: ReactElement<
    ButtonProps | HTMLAttributes<HTMLAnchorElement>
  >;
} => {
  let breadcrumb: ReactElement<BreadcrumbProps> | undefined;
  let pageToolbar: ReactElement<PageToolbarProps> | undefined;
  let backButtonOrLink:
    | ReactElement<ButtonProps | HTMLAttributes<HTMLAnchorElement>>
    | undefined;

  const childrenArray = Children.toArray(children) as PageHeaderChild[];

  if (children) {
    childrenArray.forEach((child) => {
      if (!isValidElement(child)) return;

      if (child.type === Breadcrumb) {
        breadcrumb = child as ReactElement<BreadcrumbProps>;
      } else if (child.type === PageToolbar) {
        pageToolbar = cloneElement(child as ReactElement<PageToolbarProps>, {
          size: 'main',
        }) as ReactElement<PageToolbarProps>;
      } else if (child.type === Button) {
        backButtonOrLink = cloneElement(child as ReactElement<ButtonProps>, {
          icon: {
            position: 'icon-only',
            src: ChevronLeftIcon,
          },
          size: 'sub',
          variant: 'base-tertiary',
        }) as ReactElement<ButtonProps>;
      } else if (child.type === 'a') {
        backButtonOrLink = cloneElement(
          child as ReactElement<HTMLAttributes<HTMLAnchorElement>>,
          {
            children: (
              <Button
                component={'div' as ButtonComponent}
                icon={{
                  position: 'icon-only',
                  src: ChevronLeftIcon,
                }}
                size="sub"
                variant="base-tertiary"
              />
            ),
          },
        ) as ReactElement<ButtonProps>;
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            'PageHeader only accepts Breadcrumb, PageToolbar, Button or component with href prop as its children.',
          );
        }
      }
    });
  }

  return { breadcrumb, backButtonOrLink, pageToolbar };
};

/**
 * PageHeader component displays a page title with optional breadcrumb navigation,
 * description, back button, and action toolbar.
 */
const PageHeader = forwardRef<HTMLElement, PageHeaderProps>(
  function PageHeader(props, ref) {
    const {
      children,
      className,
      description,
      title,
      titleComponent = 'h2',
      ...rest
    } = props;

    const { backButtonOrLink, breadcrumb, pageToolbar } =
      getBreadcrumbAndToolbar(children);

    return (
      <header {...rest} className={cx(classes.host, className)} ref={ref}>
        {breadcrumb}
        <span className={classes.headerContent}>
          <span className={classes.pageTitleWithIcon}>
            {backButtonOrLink && <div>{backButtonOrLink}</div>}

            <div className={classes.pageTitleText}>
              <Typography
                align="left"
                color="text-neutral-solid"
                component={titleComponent}
                variant="h2"
              >
                {title}
              </Typography>
              {description && (
                <Typography
                  align="left"
                  color="text-neutral"
                  component="p"
                  variant="caption"
                >
                  {description}
                </Typography>
              )}
            </div>
          </span>
          {pageToolbar}
        </span>
      </header>
    );
  },
);

export default PageHeader;
