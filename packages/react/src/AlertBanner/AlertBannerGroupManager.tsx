import type { Key } from 'react';
import {
  Fragment,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import type {
  NotifierController,
  NotifierManagerProps,
} from '../Notifier/NotifierManager';
import type { AlertBannerData } from './AlertBanner';
import AlertBannerGroup from './AlertBannerGroup';

type AlertBannerNotifier = AlertBannerData &
  Required<Pick<AlertBannerData, 'createdAt'>> & { key: Key };

function getPriority(severity: AlertBannerData['severity']) {
  if (severity === 'info') {
    return 1;
  }

  return 0;
}

function sortNotifiers(notifiers: AlertBannerNotifier[]) {
  return [...notifiers].sort((a, b) => {
    const priorityDiff = getPriority(a.severity) - getPriority(b.severity);

    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    if (a.createdAt !== b.createdAt) {
      return b.createdAt - a.createdAt;
    }

    return 0;
  });
}

export default function AlertBannerGroupManager(
  props: NotifierManagerProps<AlertBannerNotifier>,
) {
  const { controllerRef, defaultNotifiers = [], maxCount, render } = props;
  const [displayedNotifiers, setDisplayedNotifiers] = useState(() =>
    sortNotifiers(defaultNotifiers),
  );
  const [queuedNotifiers, setQueuedNotifiers] = useState<
    AlertBannerNotifier[]
  >([]);

  useEffect(() => {
    if (queuedNotifiers.length === 0) {
      return;
    }

    const hasMaxCount = typeof maxCount === 'number';
    const availableSlots = hasMaxCount
      ? maxCount - displayedNotifiers.length
      : Infinity;

    if (availableSlots > 0) {
      const notifiersToDisplay = queuedNotifiers.slice(0, availableSlots);

      setDisplayedNotifiers((prev) =>
        sortNotifiers([...prev, ...notifiersToDisplay]),
      );
      setQueuedNotifiers((prev) => prev.slice(notifiersToDisplay.length));
    }
  }, [displayedNotifiers.length, maxCount, queuedNotifiers]);

  const controller: NotifierController<AlertBannerNotifier> = useMemo(
    () => ({
      add(notifier) {
        setDisplayedNotifiers((prev) => {
          const notifierIndex = prev.findIndex(
            ({ key }) => key === notifier.key,
          );

          if (~notifierIndex) {
            const next = [...prev];

            next[notifierIndex] = notifier;

            return sortNotifiers(next);
          }

          const hasMaxCount = typeof maxCount === 'number';

          if (hasMaxCount && prev.length >= maxCount) {
            // if reach maxCount, sort all notifiers (including new)
            // keep the first maxCount notifiers (highest priority)
            // the rest are added to queue
            const allNotifiers = sortNotifiers([...prev, notifier]);
            const toDisplay = allNotifiers.slice(0, maxCount);
            const toQueue = allNotifiers.slice(maxCount);

            // add the rest to queue
            setQueuedNotifiers((queue) => [...queue, ...toQueue]);

            // return the first maxCount notifiers
            return toDisplay;
          }

          return sortNotifiers([...prev, notifier]);
        });
      },
      remove(key) {
        setDisplayedNotifiers((prev) => prev.filter((n) => n.key !== key));
        setQueuedNotifiers((prev) => prev.filter((n) => n.key !== key));
      },
    }),
    [maxCount],
  );

  useImperativeHandle(controllerRef, () => controller, [controller]);

  if (!displayedNotifiers.length) {
    return null;
  }

  return (
    <AlertBannerGroup>
      {displayedNotifiers.map((notifier) => (
        <Fragment key={notifier.key}>{render(notifier)}</Fragment>
      ))}
    </AlertBannerGroup>
  );
}

