import {
  cloneElement,
  isValidElement,
  PropsWithChildren,
  ReactElement,
  forwardRef,
} from 'react';
import ContentHeader, { ContentHeaderProps } from '../ContentHeader';
import { FilterArea, FilterAreaProps } from '../FilterArea';
import Tab, { TabProps } from '../Tab';
import { cx } from '../utils/cx';
import { sectionClasses as classes } from '@mezzanine-ui/core/section';

export interface SectionProps {
  /**
   * Additional style for the section container.
   */
  className?: string;
  /**
   * Accept `<ContentHeader />` component from `mezzanine`.
   * Other components will trigger a warning.
   */
  contentHeader?: ReactElement<ContentHeaderProps>;
  /**
   * Accept `<FilterArea />` component from `mezzanine`.
   * Other components will trigger a warning.
   */
  filterArea?: ReactElement<FilterAreaProps>;
  /**
   * Accept `<Tab />` component from `mezzanine`.
   * Other components will trigger a warning.
   */
  tab?: ReactElement<TabProps>;
}

function isContentHeaderElement(
  element: ReactElement<ContentHeaderProps> | undefined,
): element is ReactElement<ContentHeaderProps> {
  return isValidElement(element) && element.type === ContentHeader;
}

function isFilterAreaElement(
  element: ReactElement<FilterAreaProps> | undefined,
): element is ReactElement<FilterAreaProps> {
  return isValidElement(element) && element.type === FilterArea;
}

function isTabElement(
  element: ReactElement<TabProps> | undefined,
): element is ReactElement<TabProps> {
  return isValidElement(element) && element.type === Tab;
}

/**
 * The react component for `mezzanine` section.
 */
const Section = forwardRef<HTMLDivElement, PropsWithChildren<SectionProps>>(
  function Section(props, ref) {
    const {
      children,
      className,
      contentHeader,
      filterArea,
      tab,
    } = props;

    let renderedContentHeader: ReactElement<ContentHeaderProps> | null = null;
    let renderedFilterArea: ReactElement<FilterAreaProps> | null = null;
    let renderedTab: ReactElement<TabProps> | null = null;

    if (contentHeader) {
      if (isContentHeaderElement(contentHeader)) {
        renderedContentHeader = cloneElement(contentHeader, { size: 'sub' });
      } else {
        console.warn(
          '[Section] The contentHeader prop only accepts a <ContentHeader /> component from @mezzanine-ui/react.',
        );
      }
    }

    if (filterArea) {
      if (isFilterAreaElement(filterArea)) {
        renderedFilterArea = cloneElement(filterArea, { size: 'sub' });
      } else {
        console.warn(
          '[Section] The filterArea prop only accepts a <FilterArea /> component from @mezzanine-ui/react.',
        );
      }
    }

    if (tab) {
      if (isTabElement(tab)) {
        renderedTab = tab;
      } else {
        console.warn(
          '[Section] The tab prop only accepts a <Tab /> component from @mezzanine-ui/react.',
        );
      }
    }

    return (
      <div ref={ref} className={cx(classes.host, className)}>
        {renderedContentHeader}
        {renderedFilterArea}
        {renderedTab}
        {children}
      </div>
    );
  },
);

export default Section;
