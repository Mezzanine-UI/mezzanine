import type { IconDefinition } from '@mezzanine-ui/icons';
import type { AlertBannerSeverity } from '@mezzanine-ui/core/alert-banner';
import type {
  NotifierConfig,
  NotifierData,
  NotifierKey,
} from '../notifier/notifier.types';
import type { ButtonProps } from '../button/button.types';

export interface AlertBannerAction extends Omit<ButtonProps, 'children'> {
  /**
   * The text content of the button.
   */
  content?: string;
  /**
   * Callback when the button is clicked.
   */
  onClick: (event: MouseEvent) => void;
}

export type AlertBannerConfigProps = NotifierConfig;

export interface AlertBannerData
  extends Omit<NotifierData, 'onClose'>,
    AlertBannerConfigProps {
  /**
   * The action buttons to be rendered on the right side of the banner.
   * Maximum 2 actions, minimum 0 (will not display if empty).
   */
  actions?: AlertBannerAction[];
  /**
   * Whether to show the close button.
   */
  closable?: boolean;
  /**
   * @internal
   */
  createdAt?: number;
  /**
   * Custom icon. Defaults to severity icon when omitted.
   */
  icon?: IconDefinition;
  /**
   * Main message displayed in the banner.
   */
  message: string;
  /**
   * Callback when the banner is closed.
   */
  onClose?: () => void;
  /**
   * The key of alert banner.
   */
  reference?: NotifierKey;
  /**
   * The severity of the banner.
   */
  severity: AlertBannerSeverity;
}

export interface AlertBannerProps {
  /**
   * The action buttons to be rendered on the right side of the banner.
   * Maximum 2 actions, minimum 0 (will not display if empty).
   */
  actions?: AlertBannerAction[];
  /**
   * Whether to show the close button.
   * @default true
   */
  closable?: boolean;
  /**
   * Disable portal rendering. Only used internally by grouped rendering.
   * @internal
   */
  disablePortal?: boolean;
  /**
   * Custom icon. Defaults to severity icon when omitted.
   */
  icon?: IconDefinition;
  /**
   * Main message displayed in the banner.
   */
  message: string;
  /**
   * The severity of the banner.
   */
  severity: AlertBannerSeverity;
}
