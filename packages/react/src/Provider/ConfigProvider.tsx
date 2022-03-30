import { useMemo, ReactNode } from 'react';
import { MezzanineConfig, MezzanineConfigContext } from './context';

export interface ConfigProviderProps {
  children?: ReactNode;
  size?: MezzanineConfigContext['size'];
}

function ConfigProvider(props: ConfigProviderProps): JSX.Element {
  const {
    children,
    size,
  } = props;

  const context: MezzanineConfigContext = useMemo(() => ({
    size: size || 'medium',
  }), [size]);

  return (
    <MezzanineConfig.Provider value={context}>
      {children}
    </MezzanineConfig.Provider>
  );
}

export default ConfigProvider;
