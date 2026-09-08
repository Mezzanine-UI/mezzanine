import type { InlineMessageSeverity } from '@mezzanine-ui/core/inline-message';
import type { IconDefinition } from '@mezzanine-ui/icons';

export interface InlineMessageProps {
  /**
   * The content of the inline message value(only string is supported).
   */
  content: string;
  /**
   * The icon of the inline message.
   */
  icon?: IconDefinition;
  /**
   * The inline message severity (`'info' | 'warning' | 'error'`).
   */
  severity: InlineMessageSeverity;
}
