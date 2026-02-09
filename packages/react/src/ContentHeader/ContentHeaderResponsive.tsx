import { ResponsiveBreakpoint } from '@mezzanine-ui/core/content-header';
import { FC, ReactNode } from 'react';

export interface ContentHeaderResponsiveProps {
  breakpoint: ResponsiveBreakpoint;
  children?: ReactNode;
}

/** @experimental This component is still in testing and the API may change frequently */
const ContentHeaderResponsive: FC<ContentHeaderResponsiveProps> = (props) => {
  const { children } = props;

  return children;
};

export default ContentHeaderResponsive;
