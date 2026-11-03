import { defineComponent, h } from 'vue';
import MznPortal from '../portal.vue';

export const SsrApp = defineComponent({
  props: {
    disablePortal: { default: false, type: Boolean },
  },
  setup(props) {
    return () =>
      h('div', [
        h('p', 'probe'),
        h(
          MznPortal,
          { disablePortal: props.disablePortal },
          { default: () => h('div', { id: 'portal-test' }, 'hello') },
        ),
      ]);
  },
});

/**
 * What server-rendering `SsrApp` produces in Node, where there is no
 * `window`. Locked by `portal.ssr.spec.ts` (node environment) and hydrated by
 * `portal.spec.ts` (jsdom), which cannot produce it itself because jsdom
 * defines `window`.
 */
export const SSR_MARKUP = '<div><p>probe</p><!----></div>';

export const SSR_MARKUP_DISABLE_PORTAL =
  '<div><p>probe</p><!--[--><div id="portal-test">hello</div><!--]--></div>';
