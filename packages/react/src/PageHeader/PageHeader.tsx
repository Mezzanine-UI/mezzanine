import { cloneElement, forwardRef, ReactElement } from 'react';
import { ChevronLeftIcon } from '@mezzanine-ui/icons';
import { pageHeaderClasses as classes } from '@mezzanine-ui/core/page-header';
import { BreadcrumbProps } from '../Breadcrumb';
import Button from '../Button';
import { PageToolbarProps } from '../PageToolbar';
import Typography, { TypographyProps } from '../Typography';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

/**
 * Props for the PageHeader component.
 * Extends native HTML header element props.
 */
export type PageHeaderProps = NativeElementPropsWithoutKeyAndRef<'header'> & {
  /** `<Breadcrumb />` navigation element to display above the header */
  breadcrumb?: ReactElement<BreadcrumbProps>;
  /** Optional description text displayed below the title */
  description?: string;
  /** Callback function triggered when the back button is clicked */
  onBack?: () => void;
  /** `<PageToolbar />` component displayed on the right side of the header */
  pageToolbar?: ReactElement<PageToolbarProps>;
  /** Main title text for the page header */
  title: string;
  /** HTML element type for the title (defaults to 'h2') */
  titleComponent?: TypographyProps['component'];
};

/**
 * PageHeader component displays a page title with optional breadcrumb navigation,
 * description, back button, and action toolbar.
 */
const PageHeader = forwardRef<HTMLElement, PageHeaderProps>(
  function PageHeader(props, ref) {
    const {
      breadcrumb,
      className,
      description,
      onBack,
      pageToolbar,
      title,
      titleComponent = 'h2',
      ...rest
    } = props;

    const toolbarWithSize = pageToolbar
      ? cloneElement(pageToolbar, { size: 'main' })
      : null;

    return (
      <header {...rest} className={cx(classes.host, className)} ref={ref}>
        {breadcrumb}
        <span className={classes.headerContent}>
          <span className={classes.pageTitleWithIcon}>
            {onBack && (
              <div>
                <Button
                  icon={{
                    position: 'icon-only',
                    src: ChevronLeftIcon,
                  }}
                  size="sub"
                  variant="base-tertiary"
                  onTouchEnd={onBack}
                  onClick={onBack}
                />
              </div>
            )}

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
          {toolbarWithSize}
        </span>
      </header>
    );
  },
);

export default PageHeader;
