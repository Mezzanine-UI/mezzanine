<script setup lang="ts">
import { isRef, onMounted, ref, watch } from 'vue';
import { getContainer } from './portal-registry';
import type { PortalProps } from './portal.types';

/**
 * 將內容渲染到 DOM 樹的其他位置。
 *
 * 未指定 `container` 時會送進 Mezzanine 的 portal 容器（依 `layer` 決定 alert 或
 * default，容器在第一個 Portal 掛載時自動建立）；`container` 可傳入 DOM 元素或
 * template ref 以覆寫目的地。`disablePortal` 會讓內容留在原本的位置。
 *
 * 目的地在掛載後才解析，因此第一次繪製時內容仍在原地 —— 這與 React 版一致，
 * 也是 template ref 能作為目的地的原因：ref 要等元素掛載後才有值。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useTemplateRef } from 'vue';
 * import { MznPortal } from '@mezzanine-ui/vue/portal';
 *
 * const destination = useTemplateRef('destination');
 * <\/script>
 *
 * <template>
 *   <MznPortal>
 *     <div>Rendered into the default portal layer</div>
 *   </MznPortal>
 *
 *   <div ref="destination" />
 *   <MznPortal :container="destination">
 *     <div>Rendered into the div above</div>
 *   </MznPortal>
 *
 *   <MznPortal disable-portal>
 *     <div>Left exactly where it is</div>
 *   </MznPortal>
 * </template>
 * ```
 */
/**
 * Nothing is rendered on the server: the destination is a DOM node that only
 * exists in the browser, and React's Portal returns null there for the same
 * reason.
 */
const isClient = typeof window !== 'undefined';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PortalProps>(), {
  container: undefined,
  disablePortal: false,
  layer: 'default',
});

defineSlots<{
  /**
   * The element you want to portal.
   */
  default?: () => unknown;
}>();

const container = ref<HTMLElement | null>(null);

function resolveContainer(): void {
  if (props.disablePortal) return;

  if (props.container) {
    container.value = isRef(props.container)
      ? props.container.value
      : props.container;

    return;
  }

  container.value = getContainer(props.layer);
}

/**
 * Resolved after mount and re-resolved when any input changes, mirroring
 * React's effect — including the ref's current element, so a destination that
 * mounts later is picked up.
 */
onMounted(resolveContainer);

watch(
  [
    (): PortalProps['container'] => props.container,
    (): boolean => props.disablePortal,
    (): PortalProps['layer'] => props.layer,
    (): HTMLElement | null =>
      isRef(props.container) ? props.container.value : null,
  ],
  resolveContainer,
  { flush: 'post' },
);
</script>

<template>
  <Teleport v-if="isClient && !disablePortal && container" :to="container">
    <slot />
  </Teleport>
  <slot v-else-if="isClient" />
</template>
