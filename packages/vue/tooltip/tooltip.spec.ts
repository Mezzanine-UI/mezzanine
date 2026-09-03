import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { tooltipClasses } from '@mezzanine-ui/core/tooltip';
import { resetPortals } from '../portal/portal-registry';
import MznTooltip from './tooltip.vue';
import type { TooltipProps, TooltipTriggerProps } from './tooltip.types';

const trigger = (payload: TooltipTriggerProps) =>
  h('button', { ...payload, type: 'button' }, 'trigger');

const renderTooltip = async (
  props: TooltipProps = {},
  attrs: Record<string, unknown> = {},
) => {
  const wrapper = mount(MznTooltip, {
    attachTo: document.body,
    attrs,
    props: { title: 'tip', ...props },
    slots: { default: trigger },
  });

  await flushPromises();

  return wrapper;
};

const tooltip = () =>
  document.body.querySelector<HTMLElement>(`.${tooltipClasses.host}`);

const arrow = () =>
  document.body.querySelector<SVGElement>(`.${tooltipClasses.arrow}`);

describe('MznTooltip', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    // See PORTING-PLAYBOOK P16.
    resetPortals();
  });

  it('should fade the tooltip in when it appears', async () => {
    const wrapper = await renderTooltip();

    await wrapper.get('button').trigger('mouseenter');
    await flushPromises();

    // React's Fade writes opacity and a transition onto the popper element;
    // Vue's Transition cannot reach it through the portal, so the component
    // drives the fade itself. Without that, both are empty strings.
    expect(tooltip()?.style.opacity).toBe('1');
    expect(tooltip()?.style.transition).toContain('opacity');
  });

  it('should render the trigger and no tooltip until hovered', async () => {
    const wrapper = await renderTooltip();

    expect(wrapper.get('button').text()).toBe('trigger');
    expect(tooltip()).toBeNull();
  });

  describe('pointer flow', () => {
    it('should show on mouseenter and hide after the leave delay', async () => {
      vi.useFakeTimers();

      const wrapper = await renderTooltip({ mouseLeaveDelay: 0.1 });

      await wrapper.get('button').trigger('mouseenter');
      await flushPromises();

      expect(tooltip()).not.toBeNull();
      expect(tooltip()?.textContent).toBe('tip');

      await wrapper.get('button').trigger('mouseleave');
      vi.advanceTimersByTime(100);
      await flushPromises();

      expect(tooltip()).toBeNull();

      vi.useRealTimers();
    });

    it('should respect mouseLeaveDelay', async () => {
      vi.useFakeTimers();

      const wrapper = await renderTooltip({ mouseLeaveDelay: 0.5 });

      await wrapper.get('button').trigger('mouseenter');
      await flushPromises();
      await wrapper.get('button').trigger('mouseleave');

      vi.advanceTimersByTime(100);
      await flushPromises();

      expect(tooltip()).not.toBeNull();

      vi.advanceTimersByTime(400);
      await flushPromises();

      expect(tooltip()).toBeNull();

      vi.useRealTimers();
    });

    it('should stay visible while the tooltip itself is hovered', async () => {
      vi.useFakeTimers();

      const wrapper = await renderTooltip();

      await wrapper.get('button').trigger('mouseenter');
      await flushPromises();
      await wrapper.get('button').trigger('mouseleave');

      tooltip()?.dispatchEvent(new MouseEvent('mouseenter'));
      vi.advanceTimersByTime(200);
      await flushPromises();

      expect(tooltip()).not.toBeNull();

      vi.useRealTimers();
    });

    it('should be invisible when no title is given', async () => {
      const wrapper = await renderTooltip({ title: undefined });

      await wrapper.get('button').trigger('mouseenter');
      await flushPromises();

      expect(tooltip()).toBeNull();
    });
  });

  describe('prop: open', () => {
    it('should be visible when open is true', async () => {
      await renderTooltip({ open: true });

      expect(tooltip()).not.toBeNull();
    });

    it('should stay visible while open even after the pointer leaves', async () => {
      vi.useFakeTimers();

      const wrapper = await renderTooltip({ open: true });

      await wrapper.get('button').trigger('mouseenter');
      await wrapper.get('button').trigger('mouseleave');
      vi.advanceTimersByTime(200);
      await flushPromises();

      expect(tooltip()).not.toBeNull();

      vi.useRealTimers();
    });
  });

  describe('prop: arrow', () => {
    it('should render an arrow by default', async () => {
      await renderTooltip({ open: true });

      expect(arrow()).not.toBeNull();
    });

    it('should not render an arrow when disabled', async () => {
      await renderTooltip({ arrow: false, open: true });

      expect(arrow()).toBeNull();
    });
  });

  describe('title', () => {
    it('should render the title slot over the prop', async () => {
      mount(MznTooltip, {
        attachTo: document.body,
        props: { open: true, title: 'from prop' },
        slots: { default: trigger, title: () => h('b', 'from slot') },
      });

      await flushPromises();

      expect(tooltip()?.textContent).toBe('from slot');
    });

    it('should open on hover when only the title slot is given', async () => {
      const wrapper = mount(MznTooltip, {
        attachTo: document.body,
        slots: { default: trigger, title: () => 'slot only' },
      });

      await flushPromises();
      await wrapper.get('button').trigger('mouseenter');
      await flushPromises();

      expect(tooltip()?.textContent).toBe('slot only');
    });
  });

  describe('attributes', () => {
    it('should bind the host class and append a consumer class', async () => {
      await renderTooltip({ open: true }, { class: 'foo' });

      expect(tooltip()?.classList.contains(tooltipClasses.host)).toBe(true);
      expect(tooltip()?.classList.contains('foo')).toBe(true);
    });

    it('should default role to tooltip and let a consumer override it', async () => {
      await renderTooltip({ open: true });

      expect(tooltip()?.getAttribute('role')).toBe('tooltip');

      document.body.innerHTML = '';
      resetPortals();

      await renderTooltip({ open: true }, { role: 'status' });

      expect(tooltip()?.getAttribute('role')).toBe('status');
    });

    it('should use a consumer id for the tooltip', async () => {
      await renderTooltip({ open: true }, { id: 'my-tip' });

      expect(tooltip()?.getAttribute('id')).toBe('my-tip');
    });
  });

  describe('portal', () => {
    it('should not portal by default', async () => {
      const Host = defineComponent({
        render: () =>
          h('div', { id: 'host' }, [
            h(MznTooltip, { open: true, title: 'tip' }, { default: trigger }),
          ]),
      });

      const wrapper = mount(Host, { attachTo: document.body });

      await flushPromises();

      expect(
        wrapper.element.querySelector(`.${tooltipClasses.host}`),
      ).not.toBeNull();
    });

    it('should portal to the container when disablePortal is false', async () => {
      const Host = defineComponent({
        render: () =>
          h('div', { id: 'host' }, [
            h(
              MznTooltip,
              { disablePortal: false, open: true, title: 'tip' },
              { default: trigger },
            ),
          ]),
      });

      const wrapper = mount(Host, { attachTo: document.body });

      await flushPromises();

      expect(
        wrapper.element.querySelector(`.${tooltipClasses.host}`),
      ).toBeNull();
      expect(
        document
          .getElementById('mzn-portal-container')
          ?.querySelector(`.${tooltipClasses.host}`),
      ).not.toBeNull();
    });
  });

  describe('accessibility', () => {
    it('should wire aria-describedby to the tooltip id while open', async () => {
      const wrapper = await renderTooltip({ open: true }, { id: 'my-tip' });

      expect(wrapper.get('button').attributes('aria-describedby')).toBe(
        'my-tip',
      );
    });

    it('should not describe the trigger while closed', async () => {
      const wrapper = await renderTooltip();

      expect(
        wrapper.get('button').attributes('aria-describedby'),
      ).toBeUndefined();
    });

    it('should open on keyboard focus and close on blur', async () => {
      const wrapper = await renderTooltip();
      const button = wrapper.get('button');

      (button.element as HTMLButtonElement).focus();
      await button.trigger('focus');
      await flushPromises();

      expect(tooltip()).not.toBeNull();

      await button.trigger('blur');
      await flushPromises();

      expect(tooltip()).toBeNull();
    });

    it('should not open when the element is not actually focused', async () => {
      const wrapper = await renderTooltip();

      await wrapper.get('button').trigger('focus');
      await flushPromises();

      expect(tooltip()).toBeNull();
    });

    it('should dismiss on Escape while the pointer stays on the trigger', async () => {
      const wrapper = await renderTooltip();

      await wrapper.get('button').trigger('mouseenter');
      await flushPromises();

      expect(tooltip()).not.toBeNull();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await flushPromises();

      expect(tooltip()).toBeNull();
    });

    it('should reopen after an Escape dismissal once entered again', async () => {
      const wrapper = await renderTooltip();

      await wrapper.get('button').trigger('mouseenter');
      await flushPromises();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await flushPromises();

      await wrapper.get('button').trigger('mouseenter');
      await flushPromises();

      expect(tooltip()).not.toBeNull();
    });

    it('should keep a controlled open tooltip visible on Escape', async () => {
      await renderTooltip({ open: true });

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await flushPromises();

      expect(tooltip()).not.toBeNull();
    });
  });
});
