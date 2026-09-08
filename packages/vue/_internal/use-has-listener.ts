import { getCurrentInstance } from 'vue';

/**
 * Reports whether the parent attached a listener for an event.
 *
 * React components branch on the handler prop being present — CalendarControls
 * renders its next button only when it was given an `onNext`. Vue gives no
 * such signal: a declared emit's listener is stripped out of `useAttrs()`, and
 * `defineEmits` says only which events exist, not which are listened to.
 * `instance.vnode.props` still carries them.
 *
 * The returned value is a **function**, not a computed: the vnode is replaced
 * on every update and is not reactive, so the answer has to be read afresh
 * during each render.
 */
export function useHasListener(): (event: string) => boolean {
  const instance = getCurrentInstance();

  return (event: string): boolean => {
    const key = `on${event.charAt(0).toUpperCase()}${event.slice(1)}`;

    return Boolean(instance?.vnode.props?.[key]);
  };
}
