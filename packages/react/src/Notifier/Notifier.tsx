import { Key } from 'react';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';
import { NotifierData, RenderNotifier } from './typings';

export interface NotifierProps<N extends NotifierData> {
  notifier: N;
  notifierKey: Key;
  remove: (key: Key) => void;
  render: RenderNotifier<N>;
}

function Notifier<N extends NotifierData>(props: NotifierProps<N>) {
  const {
    notifier,
    notifierKey,
    remove,
    render,
  } = props;
  const { duration } = notifier;

  useIsomorphicLayoutEffect(() => {
    if (typeof duration === 'number') {
      const timer = window.setTimeout(
        () => remove(notifierKey),
        duration,
      );

      return () => {
        window.clearTimeout(timer);
      };
    }
  }, [duration, remove]);

  return (
    <>
      {render(notifier)}
    </>
  );
}

export default Notifier;
