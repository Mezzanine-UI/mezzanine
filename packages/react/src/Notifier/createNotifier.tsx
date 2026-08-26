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
  let container: HTMLDivElement | null = null;
  let root: Root | null = null;
  const controllerRef = createRef<NotifierController<N>>();
  let currentConfig = {
    duration,
    maxCount,
    ...configProp,
  };
  let lastGeneratedKey = 0;

  /**
   * Auto-generated keys have to be unique: a notifier keyed the same as a live
   * one is treated as an update to it, so a caller firing several notifiers in
   * a tight loop would silently see all but the last collapse into one.
   * `Date.now()` alone only has millisecond resolution, which is coarse enough
   * for that to happen in ordinary code, so step past the last key whenever the
   * clock has not moved on.
   */
  function generateKey(): number {
    const now = Date.now();

    lastGeneratedKey = now > lastGeneratedKey ? now : lastGeneratedKey + 1;

    return lastGeneratedKey;
  }

  function ensureInitialized() {
    if (container || typeof document === 'undefined') return;
    container = document.createElement('div');
    if (setRoot) setRoot(container);
    root = createRoot(container);
  }

  return {
    add(notifier) {
      ensureInitialized();
      if (container === null) return 'NOT_SET';

      document.body.appendChild(container as HTMLDivElement);

      const key = notifier.key ?? generateKey();

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
