import { useMemo, ReactNode, type JSX } from 'react';
import { MezzanineConfig, MezzanineConfigContext } from './context';

export interface ConfigProviderProps {
  children?: ReactNode;
  size?: MezzanineConfigContext['size'];
}

/** @deprecated 未來不提供此設定 */
function ConfigProvider(props: ConfigProviderProps): JSX.Element {
  const { children, size } = props;

  const context: MezzanineConfigContext = useMemo(
    () => ({
      size: size || 'medium',
    }),
    [size],
  );

  return (
    <MezzanineConfig.Provider value={context}>
      {children}
    </MezzanineConfig.Provider>
  );
}

export default ConfigProvider;
