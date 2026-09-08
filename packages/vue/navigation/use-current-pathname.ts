import { onBeforeUnmount, onMounted, ref } from 'vue';
import type { Ref } from 'vue';

/**
 * 目前網址的 pathname，並跟著上一頁／下一頁更新。
 *
 * 初值是 `null`：React 端在 effect 裡才讀 `window.location`，伺服器端渲染時沒有
 * window，兩邊的第一個 render 因此都拿不到路徑。
 *
 * @example
 * ```ts
 * const pathname = useCurrentPathname();
 * ```
 */
export function useCurrentPathname(): Ref<string | null> {
  const pathname = ref<string | null>(null);

  const handleChange = (): void => {
    pathname.value = window.location.pathname;
  };

  onMounted(() => {
    handleChange();
    window.addEventListener('popstate', handleChange);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('popstate', handleChange);
  });

  return pathname;
}
