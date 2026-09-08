import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import MznPortal from './portal.vue';
import { initializePortals, resetPortals } from './portal-registry';

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
