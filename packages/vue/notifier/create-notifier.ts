import { defineComponent, Fragment, h, render } from 'vue';
import type { VNodeChild } from 'vue';
import { createNotifierManager } from './notifier-manager';
import type {
  CreateNotifierProps,
  Notifier,
  NotifierConfig,
  NotifierData,
  NotifierKey,
} from './notifier.types';

/**
 * 建立一個 notifier 的工廠函式。
 *
 * 呼叫 `add` 時才會建立容器並掛載一個獨立的 Vue 渲染樹，與 React 版一樣不依附
 * 在呼叫端的元件樹上 —— 這也是 D11 所指的「以 Vue 的方式設計」：React 用
 * `createRoot().render()`，Vue 用 runtime 的 `render()`，`render(null, el)`
 * 對應 React 的 `root.render(null)` 卸載。
 *
 * @example
 * ```ts
 * import { createNotifier } from '@mezzanine-ui/vue/notifier';
 *
 * const notifier = createNotifier({
 *   duration: 3000,
 *   maxCount: 4,
 *   render: ({ children }) => h('div', null, children),
 *   setRoot: (root) => {
 *     root.style.position = 'fixed';
 *   },
 * });
 *
 * const key = notifier.add({ children: 'saved' });
 * notifier.remove(key);
 * ```
 *
 * @see MznMessage 建於此工廠之上的訊息元件
 */
export function createNotifier<
  N extends NotifierData,
  C extends NotifierConfig = NotifierConfig,
>(props: CreateNotifierProps<N, C>): Notifier<N, C> {
  const {
    config: configProp,
    duration,
    maxCount,
    render: renderNotifier,
    renderContainer,
    setRoot,
    sortBeforeUpdate,
    ...restNotifierProps
  } = props;

  let container: HTMLDivElement | null = null;
  let currentConfig = {
    duration,
    maxCount,
    ...configProp,
  };
  let lastGeneratedKey = 0;

  const manager = createNotifierManager<N>({ maxCount, sortBeforeUpdate });

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

  const Manager = defineComponent({
    name: 'MznNotifierManager',
    setup() {
      return () => {
        const rendered = manager.displayed.value.map((notifier) =>
          h(Fragment, { key: notifier.key }, [
            renderNotifier(notifier) as VNodeChild,
          ]),
        );

        if (renderContainer) {
          if (rendered.length === 0) return null;

          return renderContainer(rendered);
        }

        return rendered;
      };
    },
  });

  function ensureInitialized(): void {
    if (container || typeof document === 'undefined') return;

    container = document.createElement('div');

    if (setRoot) setRoot(container);

    render(h(Manager), container);
  }

  return {
    add(notifier) {
      ensureInitialized();

      if (container === null) return 'NOT_SET';

      document.body.appendChild(container);

      const key = notifier.key ?? generateKey();

      const resolved = {
        ...restNotifierProps,
        ...notifier,
        ...currentConfig,
        duration: notifier.duration ?? currentConfig.duration,
        key,
        instanceKey: key,
      } as N & { key: NotifierKey };

      manager.add(resolved);

      return key;
    },
    config(config) {
      currentConfig = {
        ...currentConfig,
        ...config,
      };
    },
    destroy() {
      if (container === null) return;

      render(null, container);

      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    },
    getConfig() {
      return currentConfig as C;
    },
    remove(key) {
      manager.remove(key);
    },
  };
}
