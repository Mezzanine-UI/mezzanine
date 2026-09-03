import type { InlineMessageProps } from './inline-message.types';

export interface InlineMessageGroupItem
  extends Omit<InlineMessageProps, 'content'> {
  key: string | number;
  content: string;
  onClose?: VoidFunction;
}

export interface InlineMessageGroupProps {
  /**
   * The inline messages within the group.
   * Ignored when the default slot is provided.
   */
  items?: InlineMessageGroupItem[];
}
