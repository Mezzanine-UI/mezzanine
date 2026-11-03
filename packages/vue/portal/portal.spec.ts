import { flushPromises, mount } from '@vue/test-utils';
import { createSSRApp, defineComponent, h, ref } from 'vue';
import MznPortal from './portal.vue';
import { initializePortals, resetPortals } from './portal-registry';
import {
  SSR_MARKUP,
  SSR_MARKUP_DISABLE_PORTAL,
  SsrApp,
} from './__fixtures__/ssr-app';

const child = () => h('div', { id: 'portal-test' }, 'hello');

const renderPortal = async (props: Record<string, unknown> = {}) => {
  const wrapper = mount(MznPortal, { props, slots: { default: child } });

  await flushPromises();

  return wrapper;
};

const alertContainer = () => document.getElementById('mzn-alert-container');
const defaultContainer = () => document.getElementById('mzn-portal-container');
const target = (container: HTMLElement | null) =>
  container?.querySelector('#portal-test') ?? null;

function expectPortaledInto(container: HTMLElement | null): void {
  const node = target(container);

  expect(node).toBeInstanceOf(Node);
  expect(node?.parentNode).toBe(container);
  expect(node?.textContent).toBe('hello');
  expect(node?.tagName.toLowerCase()).toBe('div');
}

describe('MznPortal', () => {
  beforeEach(() => {
    alertContainer()?.remove();
    defaultContainer()?.remove();
    resetPortals();
  });

  describe('default behavior', () => {
    it('should render children to the portal container by default', async () => {
      initializePortals();
      await renderPortal();

      expectPortaledInto(defaultContainer());
    });

    it('should auto-initialize the portal system if not initialized', async () => {
      await renderPortal();

      expect(defaultContainer()).toBeInstanceOf(Node);
      expectPortaledInto(defaultContainer());
    });
  });

  describe('prop: container', () => {
    it('should portal to the target container if provided', async () => {
      const container = document.createElement('div');

      document.body.appendChild(container);
      await renderPortal({ container });

      expectPortaledInto(container);
    });

    it('should portal to the target container if a container as ref is provided', async () => {
      const Testing = defineComponent({
        setup() {
          const destination = ref<HTMLElement | null>(null);

          return () => [
            h('div', { id: 'ref-container', ref: destination }),
            h(MznPortal, { container: destination }, { default: child }),
          ];
        },
      });

      mount(Testing, { attachTo: document.body });
      await flushPromises();

      expectPortaledInto(document.getElementById('ref-container'));
    });

    it.each([undefined, null])(
      'should portal to the default container if container is %s',
      async (container) => {
        initializePortals();
        await renderPortal({ container });

        expectPortaledInto(defaultContainer());
      },
    );
  });

  describe('prop: layer', () => {
    it('should render to the alert container for layer alert', async () => {
      initializePortals();
      await renderPortal({ layer: 'alert' });

      expectPortaledInto(alertContainer());
    });

    it.each(['default', undefined])(
      'should render to the default container for layer %s',
      async (layer) => {
        initializePortals();
        await renderPortal({ layer });

        expectPortaledInto(defaultContainer());
      },
    );

    it('should let a custom container override the layer', async () => {
      initializePortals();

      const container = document.createElement('div');

      document.body.appendChild(container);
      await renderPortal({ container, layer: 'alert' });

      expectPortaledInto(container);
      expect(target(alertContainer())).toBeNull();
    });
  });

  describe('prop: disablePortal', () => {
    it('should leave the content in place', async () => {
      const wrapper = await renderPortal({ disablePortal: true });

      expect(wrapper.element.tagName.toLowerCase()).toBe('div');
      expect(wrapper.text()).toBe('hello');
    });

    it('should leave the content in place even with a container', async () => {
      const container = document.createElement('div');

      document.body.appendChild(container);

      const wrapper = await renderPortal({ container, disablePortal: true });

      expect(wrapper.text()).toBe('hello');
      expect(container.contains(wrapper.element)).toBe(false);
    });

    it('should leave the content in place even with a layer', async () => {
      initializePortals();

      const wrapper = await renderPortal({
        disablePortal: true,
        layer: 'alert',
      });

      expect(wrapper.text()).toBe('hello');
      expect(target(alertContainer())).toBeNull();
    });
  });

  describe('hydration', () => {
    async function hydrate(markup: string, disablePortal = false) {
      const host = document.createElement('div');
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});

      host.innerHTML = markup;
      document.body.appendChild(host);

      const app = createSSRApp({ render: () => h(SsrApp, { disablePortal }) });

      app.mount(host);
      await flushPromises();

      const messages = [...warn.mock.calls, ...error.mock.calls].map((args) =>
        String(args[0]),
      );

      warn.mockRestore();
      error.mockRestore();

      return {
        cleanup: () => {
          app.unmount();
          host.remove();
        },
        host,
        mismatches: messages.filter((message) => /mismatch/i.test(message)),
      };
    }

    it('should still render in place on the first frame of a plain client mount', () => {
      const wrapper = mount(MznPortal, { slots: { default: child } });

      expect(wrapper.find('#portal-test').exists()).toBe(true);
    });

    it('should hydrate server markup without a mismatch and portal after mount', async () => {
      const { cleanup, mismatches } = await hydrate(SSR_MARKUP);

      expect(mismatches).toEqual([]);
      expectPortaledInto(defaultContainer());

      cleanup();
    });

    it('should hydrate server markup without a mismatch when disablePortal is set', async () => {
      const { cleanup, host, mismatches } = await hydrate(
        SSR_MARKUP_DISABLE_PORTAL,
        true,
      );

      expect(mismatches).toEqual([]);
      expect(target(host)).toBeInstanceOf(Node);

      cleanup();
    });
  });

  describe('portal containers structure', () => {
    it('should create both containers when initialized', () => {
      initializePortals();

      expect(alertContainer()).toBeInstanceOf(HTMLDivElement);
      expect(defaultContainer()).toBeInstanceOf(HTMLDivElement);
      expect(alertContainer()?.className).toBe('mzn-portal-alert');
      expect(defaultContainer()?.className).toBe('mzn-portal-default');
    });

    it('should only initialize once however many times it is called', () => {
      initializePortals();
      initializePortals();
      initializePortals();

      expect(document.querySelectorAll('#mzn-alert-container')).toHaveLength(1);
      expect(document.querySelectorAll('#mzn-portal-container')).toHaveLength(
        1,
      );
    });
  });
});
