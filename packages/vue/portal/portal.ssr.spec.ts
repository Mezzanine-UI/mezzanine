// @vitest-environment node
import { renderToString } from '@vue/server-renderer';
import { createSSRApp, h } from 'vue';
import {
  SSR_MARKUP,
  SSR_MARKUP_DISABLE_PORTAL,
  SsrApp,
} from './__fixtures__/ssr-app';

const renderApp = (disablePortal = false): Promise<string> =>
  renderToString(createSSRApp({ render: () => h(SsrApp, { disablePortal }) }));

describe('MznPortal server rendering', () => {
  it('should run without a DOM', () => {
    expect(typeof window).toBe('undefined');
  });

  it('should emit no portal content in server markup', async () => {
    expect(await renderApp()).toBe(SSR_MARKUP);
  });

  it('should emit children in place when disablePortal is set', async () => {
    expect(await renderApp(true)).toBe(SSR_MARKUP_DISABLE_PORTAL);
  });
});
