import { InjectionToken } from '@angular/core';
import { DescriptionSize } from '@mezzanine-ui/core/description';

export interface DescriptionContextValue {
  readonly size: DescriptionSize;
}

export const MZN_DESCRIPTION_CONTEXT =
  new InjectionToken<DescriptionContextValue>('MZN_DESCRIPTION_CONTEXT');
