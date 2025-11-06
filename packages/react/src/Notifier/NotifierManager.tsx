import {
  useState,
  useImperativeHandle,
  Key,
  useMemo,
  RefObject,
  Fragment,
  useEffect,
} from 'react';
import { NotifierData, NotifierConfig, RenderNotifier } from './typings';

export interface NotifierController<N extends NotifierData> {
  add: (notifier: N & { key: Key }) => void;
  remove: (key: Key) => void;
}

export interface NotifierManagerProps<N extends NotifierData>
  extends Pick<NotifierConfig, 'maxCount'> {
  controllerRef: RefObject<NotifierController<N> | null>;
  defaultNotifiers?: (N & { key: Key })[];
  render: RenderNotifier<N>;
}

function NotifierManager<N extends NotifierData>(
  props: NotifierManagerProps<N>,
) {
  const { controllerRef, defaultNotifiers = [], maxCount, render } = props;
  const [displayedNotifiers, setDisplayedNotifiers] =
    useState(defaultNotifiers);
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

        setDisplayedNotifiers((prev) => [...prev, ...notifiersToDisplay]);
        setQueuedNotifiers((prev) => prev.slice(availableSlots));
      }
    }
  }, [displayedNotifiers.length, queuedNotifiers, maxCount]);

  const controller: NotifierController<N> = useMemo(
    () => ({
      add(notifier) {
        setDisplayedNotifiers((prev) => {
          const notifierIndex = prev.findIndex(
            ({ key }) => key === notifier.key,
          );

          // 如果已存在，則更新該訊息
          if (~notifierIndex) {
            return [
              ...prev.slice(0, notifierIndex),
              notifier,
              ...prev.slice(notifierIndex + 1, prev.length),
            ];
          }

          // 新訊息：檢查是否超過 maxCount
          const hasMaxCount = typeof maxCount === 'number';

          if (hasMaxCount && prev.length >= maxCount) {
            // 超過上限，加入 queue
            setQueuedNotifiers((queue) => [...queue, notifier]);

            return prev;
          }

          // 未超過上限，直接加到最後
          return [...prev, notifier];
        });
      },
      remove(key: Key) {
        setDisplayedNotifiers((prev) => prev.filter((m) => m.key !== key));
        setQueuedNotifiers((prev) => prev.filter((m) => m.key !== key));
      },
    }),
    [maxCount],
  );

  useImperativeHandle(controllerRef, () => controller, [controller]);

  return (
    <>
      {displayedNotifiers.map((notifier) => (
        <Fragment key={notifier.key}>{render(notifier)}</Fragment>
      ))}
    </>
  );
}

export default NotifierManager;
