import { createContext } from 'react';
import { Size } from '@mezzanine-ui/system/size';

export interface MezzanineConfigContext {
  size: Size;
}

export const MezzanineConfig = createContext<MezzanineConfigContext>({
  size: 'medium',
});
