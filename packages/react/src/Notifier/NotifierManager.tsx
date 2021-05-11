import {
  useState,
  useImperativeHandle,
  Key,
  useMemo,
  RefObject,
} from 'react';
import {
  NotifierData,
  NotifierConfig,
  RenderNotifier,
} from './typings';

export interface NotifierController<N extends NotifierData> {
  add: (notifier: N & { key: Key; }) => void;
  remove: (key: Key) => void;
}

export interface NotifierManagerProps<N extends NotifierData> extends Pick<NotifierConfig, 'maxCount'> {
  controllerRef: RefObject<NotifierController<N>>;
  defaultNotifiers?: (N & { key: Key; })[];
  render: RenderNotifier<N>;
}

function NotifierManager<N extends NotifierData>(props: NotifierManagerProps<N>) {
  const {
    controllerRef,
    defaultNotifiers = [],
    maxCount,
    render,
  } = props;
  const [notifiers, setNotifiers] = useState(defaultNotifiers);
  const notifiersShouldRendered = typeof maxCount === 'number' && notifiers.length > maxCount
    ? notifiers.slice(0, maxCount)
    : notifiers;
  const controller: NotifierController<N> = useMemo(() => ({
    add(notifier) {
      setNotifiers((prev) => {
        const notifierIndex = prev.findIndex(({ key }) => key === notifier.key);

        return ~notifierIndex
          ? [
            ...prev.slice(0, notifierIndex),
            notifier,
            ...prev.slice(notifierIndex + 1, prev.length),
          ]
          : [...prev, notifier];
      });
    },
    remove(key: Key) {
      setNotifiers((prev) => prev.filter((m) => m.key !== key));
    },
  }), []);

  useImperativeHandle(controllerRef, () => controller, [controller]);

  return (
    <>
      {notifiersShouldRendered.map((notifier) => render(notifier))}
    </>
  );
}

export default NotifierManager;
