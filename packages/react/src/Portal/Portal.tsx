import {
  FC,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { ElementGetter, getElement } from '../utils/getElement';

export interface PortalProps {
  /**
   * The element you want to portal.
   */
  children?: ReactNode;
  /**
   * The destination where to portal.
   */
  container?: ElementGetter;
  /**
   * Whether to disable portal.
   * If true, it will be a normal component.
   * @default false
   */
  disablePortal?: boolean;
}

const Portal: FC<PortalProps> = (props) => {
  const {
    children,
    container,
    disablePortal = false,
  } = props;

  const [portalElement, setPortalElement] = useState(() => (
    disablePortal
      ? null
      : getElement(container) || document.body
  ));

  useEffect(() => {
    if (!disablePortal) {
      setPortalElement(getElement(container) || document.body);
    }
  }, [container, disablePortal]);

  if (disablePortal || !portalElement) {
    return <>{children}</>;
  }

  return createPortal(children, portalElement);
};

export default Portal;
