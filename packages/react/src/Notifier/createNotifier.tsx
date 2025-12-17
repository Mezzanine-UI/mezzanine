'use client';

import { createRef } from 'react';
import { createRoot, Root } from 'react-dom/client';
import NotifierManager, {
  NotifierController,
  type NotifierManagerProps,
} from './NotifierManager';
import {
  Notifier,
  NotifierConfig,
  NotifierData,
  RenderNotifier,
} from './typings';

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
   * The method to set attributes or listeners to root.
   */
  setRoot?: (root: HTMLDivElement) => void;
  /**
   * Custom wrapper for rendered notifiers (e.g. AlertBanner group container).
   */
  renderContainer?: NotifierManagerProps<N>['renderContainer'];
  /**
   * Sorting hook to enforce display/queue ordering before updates.
   */
  sortBeforeUpdate?: NotifierManagerProps<N>['sortBeforeUpdate'];
}

/**
 * The utility factory for `mezzanine` to create a notifier.
 *
 * When APIs are called, Notifier will dynamically render a new react instance by `ReactDOM.render` method.
 */
export function createNotifier<
  N extends NotifierData,
  C extends NotifierConfig = NotifierConfig,
>(props: CreateNotifierProps<N, C>): Notifier<N, C> {
  const {
    config: configProp,
    render: renderNotifier,
    setRoot,
    duration,
    maxCount,
    renderContainer,
    sortBeforeUpdate,
    ...restNotifierProps
  } = props;
  const container =
    typeof document === 'undefined' ? null : document.createElement('div');
  const root: Root | null = container ? createRoot(container) : null;
  const controllerRef = createRef<NotifierController<N>>();
  let currentConfig = {
    duration,
    maxCount,
    ...configProp,
  };

  if (setRoot && container) {
    setRoot(container);
  }

  return {
    add(notifier) {
      if (container === null) return 'NOT_SET';

      document.body.appendChild(container as HTMLDivElement);

      const key = notifier.key ?? Date.now();

      const resolvedNotifier = {
        ...restNotifierProps,
        ...notifier,
        ...currentConfig,
        duration: notifier.duration ?? currentConfig.duration,
        key,
        instanceKey: key,
      };

      if (controllerRef.current) {
        controllerRef.current.add(resolvedNotifier);
      } else {

        root?.render(
          <NotifierManager<N>
            controllerRef={controllerRef}
            defaultNotifiers={[resolvedNotifier]}
            maxCount={currentConfig.maxCount}
            render={renderNotifier}
            renderContainer={renderContainer}
            sortBeforeUpdate={sortBeforeUpdate}
          />,
        );
      }

      return resolvedNotifier.key;
    },
    remove(key) {
      if (controllerRef.current) {
        controllerRef.current.remove(key);
      }
    },
    destroy() {
      if (container === null) return;

      // when useEffect(() => () => { root.unmount() }, []), will be show "Rendered more hooks than during the previous render." issue.
      root?.render(null);

      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    },
    config(config) {
      currentConfig = {
        ...currentConfig,
        ...config,
      };
    },
    getConfig() {
      return currentConfig as C;
    },
  };
}
