import {
  FC,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { ElementGetter, getElement } from './getElement';

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
   * Control whether or not to disable the portal functionality.
   * If true, it will be a normal component.
   */
  disabled?: boolean;
}

const Portal: FC<PortalProps> = (props) => {
  const {
    children,
    container,
    disabled,
  } = props;

  const [portalElement, setPortalElement] = useState(() => (
    disabled
      ? null
      : getElement(container) || document.body
  ));

  useEffect(() => {
    if (!disabled) {
      setPortalElement(getElement(container) || document.body);
    }
  }, [container, disabled]);

  if (disabled || !portalElement) {
    return <>{children}</>;
  }

  return createPortal(children, portalElement);
};

export default Portal;
