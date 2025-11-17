import type { ReactNode } from 'react';
import {
  Fragment,
  Key,
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { NotifierConfig, NotifierData, RenderNotifier } from './typings';

export interface NotifierController<N extends NotifierData> {
  add: (notifier: N & { key: Key }) => void;
  remove: (key: Key) => void;
}

export interface NotifierManagerProps<N extends NotifierData>
  extends Pick<NotifierConfig, 'maxCount'> {
  controllerRef: RefObject<NotifierController<N> | null>;
  defaultNotifiers?: (N & { key: Key })[];
  render: RenderNotifier<N>;
  /**
   * Custom wrapper for rendered notifiers (e.g. AlertBanner group container).
   */
  renderContainer?: (children: ReactNode) => ReactNode;
  /**
   * Sorting hook to enforce display/queue ordering before updates.
   */
  sortBeforeUpdate?: (
    notifiers: (N & { key: Key })[],
  ) => (N & { key: Key })[];
}

function NotifierManager<N extends NotifierData>(
  props: NotifierManagerProps<N>,
) {
  const {
    controllerRef,
    defaultNotifiers = [],
    maxCount,
    render,
    renderContainer,
    sortBeforeUpdate,
  } = props;
  // 只有在呼叫端有提供 sortBeforeUpdate 時才執行排序，否則維持原本順序。
  const sortNotifiers = useCallback(
    (notifiers: (N & { key: Key })[]) =>
      sortBeforeUpdate ? sortBeforeUpdate(notifiers) : notifiers,
    [sortBeforeUpdate],
  );
  const [displayedNotifiers, setDisplayedNotifiers] = useState(() =>
    sortNotifiers(defaultNotifiers),
  );
  const [queuedNotifiers, setQueuedNotifiers] = useState<(N & { key: Key })[]>(
    [],
  );

  // 當有空位時，從 queue 中補上
  useEffect(() => {
    if (queuedNotifiers.length > 0) {
      const hasMaxCount = typeof maxCount === 'number';
      const availableSlots = hasMaxCount
        ? maxCount - displayedNotifiers.length
        : Infinity;

      if (availableSlots > 0) {
        const notifiersToDisplay = queuedNotifiers.slice(0, availableSlots);

        setDisplayedNotifiers((prev) =>
          sortNotifiers([...prev, ...notifiersToDisplay]),
        );
        setQueuedNotifiers((prev) => prev.slice(availableSlots));
      }
    }
  }, [displayedNotifiers.length, queuedNotifiers, maxCount, sortNotifiers]);

  const controller: NotifierController<N> = useMemo(
    () => ({
      add(notifier) {
        setDisplayedNotifiers((prev) => {
          const notifierIndex = prev.findIndex(
            ({ key }) => key === notifier.key,
          );

          // 如果已存在，則更新該訊息
          if (~notifierIndex) {
            const next = [...prev];

            next[notifierIndex] = notifier;

            return sortNotifiers(next);
          }

          // 新訊息：檢查是否超過 maxCount
          const hasMaxCount = typeof maxCount === 'number';

          if (hasMaxCount && prev.length >= maxCount) {
            if (sortBeforeUpdate) {
              // 需要排序時，先把舊有與新增併在一起排序，
              // 取前 maxCount 個顯示，其餘補進 queue。
              const allNotifiers = sortNotifiers([...prev, notifier]);
              const toDisplay = allNotifiers.slice(0, maxCount);
              const toQueue = allNotifiers.slice(maxCount);

              if (toQueue.length > 0) {
                setQueuedNotifiers((queue) => [...queue, ...toQueue]);
              }

              return toDisplay;
            }

            // 超過上限，加入 queue
            setQueuedNotifiers((queue) => [...queue, notifier]);

            return prev;
          }

          // 未超過上限，直接加到最後
          // 直接加入並依需求排序。
          return sortNotifiers([...prev, notifier]);
        });
      },
      remove(key: Key) {
        setDisplayedNotifiers((prev) => prev.filter((m) => m.key !== key));
        setQueuedNotifiers((prev) => prev.filter((m) => m.key !== key));
      },
    }),
    [maxCount, sortBeforeUpdate, sortNotifiers],
  );

  useImperativeHandle(controllerRef, () => controller, [controller]);

  const renderedNotifiers = displayedNotifiers.map((notifier) => (
    <Fragment key={notifier.key}>{render(notifier)}</Fragment>
  ));

  if (renderContainer) {
    if (!renderedNotifiers.length) {
      return null;
    }

    return renderContainer(renderedNotifiers);
  }

  return (
    <>
      {renderedNotifiers}
    </>
  );
}

export default NotifierManager;
