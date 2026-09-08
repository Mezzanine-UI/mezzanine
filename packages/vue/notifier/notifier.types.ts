import type { VNodeChild } from 'vue';

/**
 * Identifies a notifier instance. React's `Key`, minus `bigint`, which no
 * caller uses and Vue's vnode keys do not accept.
 */
export type NotifierKey = string | number;

export interface NotifierConfig {
  /**
   * If passed as number, the notification will be closed after the amount of time.
   */
  duration?: number | false;
  /**
   * How many notifiers may be displayed at once. The rest wait in a queue.
   */
  maxCount?: number;
}

export interface NotifierData extends Pick<NotifierConfig, 'duration'> {
  /**
   * The notification content.
   */
  children?: VNodeChild;
  /**
   * Close Handler
   */
  onClose?: (key: NotifierKey) => void;
}

export type RenderNotifier<N extends NotifierData> = (
  notifier: N & { key: NotifierKey },
) => VNodeChild;

export interface Notifier<
  N extends NotifierData,
  C extends NotifierConfig = NotifierConfig,
> {
  add: (notifier: N & { key?: NotifierKey }) => NotifierKey;
  config: (configs: C) => void;
  destroy: VoidFunction;
  getConfig: () => C;
  remove: (key: NotifierKey) => void;
}

export interface CreateNotifierProps<
  N extends NotifierData,
  C extends NotifierConfig,
> extends NotifierConfig {
  /**
   * Customizable config for notifier. The given values should be retrivable from your notification carrier.
   */
  config?: C;
  /**
   * The render props for notification carrier(UI component).
   */
  render: RenderNotifier<N>;
  /**
   * Custom wrapper for rendered notifiers (e.g. AlertBanner group container).
   */
  renderContainer?: (children: VNodeChild[]) => VNodeChild;
  /**
   * The method to set attributes or listeners to root.
   */
  setRoot?: (root: HTMLDivElement) => void;
  /**
   * Sorting hook to enforce display/queue ordering before updates.
   */
  sortBeforeUpdate?: (
    notifiers: (N & { key: NotifierKey })[],
  ) => (N & { key: NotifierKey })[];
}
