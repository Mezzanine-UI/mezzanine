import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { hide } from '@floating-ui/dom';
import { resetPortals } from '../portal/portal-registry';
import MznPopper from './popper.vue';
import type {
  PopperController,
  PopperPlacement,
  PopperProps,
} from './popper.types';

const placements: PopperPlacement[] = [
  'bottom',
  'bottom-end',
  'bottom-start',
  'left',
  'left-end',
  'left-start',
  'right',
  'right-end',
  'right-start',
  'top',
  'top-end',
  'top-start',
];

const renderPopper = async (
  props: PopperProps = {},
  slot: () => unknown = () => h('div'),
) => {
  const wrapper = mount(MznPopper, {
    attachTo: document.body,
    props: { anchor: document.body, ...props },
    slots: { default: slot },
  });

  await flushPromises();

  return wrapper;
};

const popperContainer = (root: ParentNode = document.body) =>
  root.querySelector('div[data-popper-placement]');

const arrowElement = (root: ParentNode = document.body) =>
  root.querySelector('svg');

const controllerOf = (wrapper: { vm: unknown }) =>
  (wrapper.vm as { controllerRef: PopperController }).controllerRef;

describe('MznPopper', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    // The registry caches its containers, and the line above just detached
    // them: without a reset every later popper teleports into a node that is
    // no longer in the document.
    resetPortals();
  });

  it('should wrap children by popper container', async () => {
    await renderPopper({ open: true }, () => h('div', { id: 'bar' }, 'foo'));

    const content = popperContainer()?.firstElementChild;

    expect(content?.textContent).toBe('foo');
    expect(content?.getAttribute('id')).toBe('bar');
  });

  describe('prop: open', () => {
    it('should render open=false by default', async () => {
      await renderPopper();

      expect(popperContainer()).toBeNull();
    });

    it.each([false, true])(
      'should render the popper for open=%s',
      async (open) => {
        await renderPopper({ open });

        expect(!!popperContainer()).toBe(open);
      },
    );
  });

  describe('controllerRef', () => {
    it('should expose the floating results', async () => {
      const controller = controllerOf(await renderPopper({ open: true }));

      expect(controller.floatingStyles.value).toBeInstanceOf(Object);
      expect(controller.placement.value).toBeDefined();
      expect(controller.update).toBeInstanceOf(Function);
      expect(controller.x.value).toBeDefined();
      expect(controller.y.value).toBeDefined();
    });
  });

  describe('emit: placementChange', () => {
    it('should report the resolved placement when open', async () => {
      const wrapper = await renderPopper({
        open: true,
        options: { placement: 'top-start' },
      });

      expect(wrapper.emitted('placementChange')).toContainEqual(['top-start']);
    });
  });

  describe('prop: options', () => {
    it('should pass middleware through to the position computation', async () => {
      const controller = controllerOf(
        await renderPopper({ open: true, options: { middleware: [hide()] } }),
      );

      expect(popperContainer()).toBeTruthy();
      expect(controller.middlewareData.value.hide).toBeDefined();
    });

    it.each(placements)(
      'should change popper placement if placement=%s',
      async (placement) => {
        const controller = controllerOf(
          await renderPopper({ open: true, options: { placement } }),
        );

        expect(controller.placement.value).toBe(placement);
      },
    );
  });

  describe('prop: arrow', () => {
    it('should not render arrow by default', async () => {
      await renderPopper({ open: true });

      expect(arrowElement()).toBeNull();
    });

    it('should render arrow when arrow prop is provided', async () => {
      await renderPopper({
        arrow: { className: 'test-arrow', enabled: true, padding: 0 },
        open: true,
      });

      expect(arrowElement()?.classList.contains('test-arrow')).toBe(true);
    });

    it('should not render arrow when enabled is false', async () => {
      await renderPopper({
        arrow: { className: 'test-arrow', enabled: false, padding: 0 },
        open: true,
      });

      expect(arrowElement()).toBeNull();
    });

    it('should apply padding to arrow middleware', async () => {
      const wrapper = await renderPopper({
        arrow: { className: 'test-arrow', enabled: true, padding: 10 },
        open: true,
      });

      await flushPromises();

      expect(arrowElement()).not.toBeNull();
      expect(controllerOf(wrapper).middlewareData.value.arrow).toBeDefined();
    });
  });

  describe('prop: disablePortal', () => {
    const Container = (props: PopperProps) =>
      defineComponent({
        render: () =>
          h('div', { id: 'test-container' }, [
            h(
              MznPopper,
              { anchor: document.body, open: true, ...props },
              { default: () => h('div', { id: 'content' }) },
            ),
          ]),
      });

    it('should render in body by default', async () => {
      const wrapper = mount(Container({}), { attachTo: document.body });

      await flushPromises();

      expect(wrapper.element.querySelector('#content')).toBeNull();
      expect(document.body.querySelector('#content')).not.toBeNull();
    });

    it('should render in parent when disablePortal is true', async () => {
      const wrapper = mount(Container({ disablePortal: true }), {
        attachTo: document.body,
      });

      await flushPromises();

      expect(wrapper.element.querySelector('#content')).not.toBeNull();
    });
  });
});
