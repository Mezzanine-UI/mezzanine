import type { ReactNode } from 'react';
import { alertBannerGroupClasses } from '@mezzanine-ui/core/alert-banner';
import Portal from '../Portal';

export interface AlertBannerGroupProps {
  children?: ReactNode;
}

export default function AlertBannerGroup({ children }: AlertBannerGroupProps) {
  if (!children) {
    return null;
  }

  return (
    <Portal layer="alert">
      <div className={alertBannerGroupClasses.host}>{children}</div>
    </Portal>
  );
}

