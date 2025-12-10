import { cloneElement, forwardRef, HTMLAttributes, ReactElement } from 'react';
import { ChevronLeftIcon } from '@mezzanine-ui/icons';
import { pageHeaderClasses as classes } from '@mezzanine-ui/core/page-header';
import { BreadcrumbProps } from '../Breadcrumb';
import Button, { ButtonComponent, ButtonProps } from '../Button';
import { PageToolbarProps } from '../PageToolbar';
import Typography, { TypographyProps } from '../Typography';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

/**
 * Props for the PageHeader component.
 * Extends native HTML header element props.
 */
export type PageHeaderProps = NativeElementPropsWithoutKeyAndRef<'header'> & {
  /** Optional description text displayed below the title */
  description?: string;
  backButtonProps?: Omit<ButtonProps, 'icon' | 'size' | 'variant'>;
  /** Main title text for the page header */
  title: string;
  /** HTML element type for the title (defaults to 'h2') */
  titleComponent?: TypographyProps['component'];
  children?: ReactElement<
    | BreadcrumbProps
    | PageToolbarProps
    | ButtonProps
    | HTMLAttributes<HTMLAnchorElement>
  >[];
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

  if (children) {
    children.forEach((child) => {
      if (child.type && (child.type as any).displayName === 'Breadcrumb') {
        breadcrumb = child as ReactElement<BreadcrumbProps>;
      } else if (
        child.type &&
        (child.type as any).displayName === 'PageToolbar'
      ) {
        pageToolbar = cloneElement(child, {
          size: 'main',
        }) as ReactElement<PageToolbarProps>;
      } else if (child.type && (child.type as any).displayName === 'Button') {
        backButtonOrLink = cloneElement(child as ReactElement<ButtonProps>, {
          icon: {
            position: 'icon-only',
            src: ChevronLeftIcon,
          },
          size: 'sub',
          variant: 'base-tertiary',
        }) as ReactElement<ButtonProps>;
      } else if (child.type === 'a' || (child.type as any).href) {
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
            'PageHeader only accepts Breadcrumb, PageToolbar, Button or Anchor as its children.',
            `not supported: ${child.type}/${(child.type as any).displayName}`,
          );
        }
      }
    });
  }

  return { breadcrumb, pageToolbar, backButtonOrLink };
};

/**
 * PageHeader component displays a page title with optional breadcrumb navigation,
 * description, back button, and action toolbar.
 */
const PageHeader = forwardRef<HTMLElement, PageHeaderProps>(
  function PageHeader(props, ref) {
    const {
      className,
      description,
      title,
      titleComponent = 'h2',
      children,
      ...rest
    } = props;

    const { breadcrumb, pageToolbar, backButtonOrLink } =
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
