import { Key, ReactNode } from 'react';

export interface NotifierConfig {
  /**
   * If passed as number, the notification will be closed after the amount of time.
   */
  duration?: number | false;
  maxCount?: number;
}

export interface NotifierData extends Pick<NotifierConfig, 'duration'> {
  /**
   * The notification content.
   */
  children?: ReactNode;
  /**
   * Close Handler
   */
  onClose?: (key: Key) => void;
}

export type RenderNotifier<N extends NotifierData> = (notifier: N) => ReactNode;

export interface Notifier<
  N extends NotifierData,
  C extends NotifierConfig = NotifierConfig,
> {
  add: (notifier: N & { key?: Key }) => Key;
  config: (configs: C) => void;
  destroy: VoidFunction;
  remove: (key: Key) => void;
  getConfig: () => C;
}
