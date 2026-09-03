import { flushPromises, mount } from '@vue/test-utils';
import { PlusIcon } from '@mezzanine-ui/icons';
import { buttonClasses as classes } from '@mezzanine-ui/core/button';
import { iconClasses as spinClasses } from '@mezzanine-ui/core/spin';
import { tooltipClasses } from '@mezzanine-ui/core/tooltip';
import { resetPortals } from '../portal/portal-registry';
import MznButton from './button.vue';
import type { ButtonProps } from './button.types';

const variants = [
  'base-primary',
  'base-secondary',
  'base-tertiary',
  'base-ghost',
  'base-dashed',
  'base-text-link',
  'destructive-primary',
  'destructive-secondary',
  'destructive-ghost',
  'destructive-text-link',
  'inverse',
  'inverse-ghost',
] as const;

const renderButton = (
  props: ButtonProps = {},
  options: { attrs?: Record<string, unknown>; text?: string } = {},
) =>
  mount(MznButton, {
    attachTo: document.body,
    attrs: options.attrs,
    props,
    slots: { default: () => options.text ?? 'label' },
  });

describe('MznButton', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    // See PORTING-PLAYBOOK P16.
    resetPortals();
  });

  it('should render the text content', () => {
    const wrapper = renderButton();

    expect(wrapper.element.tagName.toLowerCase()).toBe('button');
    expect(wrapper.text()).toBe('label');
    expect(wrapper.classes()).toContain(classes.host);
  });

  it('should not render children in icon-only mode', () => {
    // The tooltip branch renders the popper alongside the trigger, so the
    // component has no single root and the button has to be looked up.
    const button = renderButton({
      icon: PlusIcon,
      iconType: 'icon-only',
    }).get('button');

    expect(button.text()).not.toContain('label');
    expect(button.classes()).toContain(classes.iconOnly);
  });

  describe('prop: variant', () => {
    it('should render base-primary by default', () => {
      expect(renderButton().classes()).toContain(
        classes.variant('base-primary'),
      );
    });

    it.each(variants)('should add the class for %s', (variant) => {
      expect(renderButton({ variant }).classes()).toContain(
        classes.variant(variant),
      );
    });
  });

  describe('prop: size', () => {
    it('should render main by default', () => {
      expect(renderButton().classes()).toContain(classes.size('main'));
    });

    it.each(['main', 'sub', 'minor'] as const)(
      'should add the class for %s',
      (size) => {
        expect(renderButton({ size }).classes()).toContain(classes.size(size));
      },
    );
  });

  describe('prop: disabled', () => {
    it('should set disabled and aria-disabled', () => {
      const wrapper = renderButton({ disabled: true });

      expect(wrapper.classes()).toContain(classes.disabled);
      expect(wrapper.attributes('disabled')).toBe('');
      expect(wrapper.attributes('aria-disabled')).toBe('true');
    });

    it('should render aria-disabled false when enabled', () => {
      expect(renderButton().attributes('aria-disabled')).toBe('false');
    });

    it('should swallow clicks while disabled', async () => {
      const onClick = vi.fn();
      const wrapper = renderButton({ disabled: true }, { attrs: { onClick } });

      await wrapper.trigger('click');

      expect(onClick).not.toHaveBeenCalled();
    });

    it('should forward clicks while enabled', async () => {
      const onClick = vi.fn();
      const wrapper = renderButton({}, { attrs: { onClick } });

      await wrapper.trigger('click');

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop: loading', () => {
    it('should add the loading class and render a spinner', () => {
      const wrapper = renderButton({ loading: true });

      expect(wrapper.classes()).toContain(classes.loading);
      expect(wrapper.find(`.${spinClasses.spin}`).exists()).toBe(true);
    });

    it('should replace the icon with the spinner', () => {
      const wrapper = renderButton({
        icon: PlusIcon,
        iconType: 'leading',
        loading: true,
      });

      expect(wrapper.find(`.${spinClasses.spin}`).exists()).toBe(true);
      expect(wrapper.find('.mzn-icon').exists()).toBe(false);
      expect(wrapper.text()).not.toContain('label');
    });

    it('should swallow clicks while loading', async () => {
      const onClick = vi.fn();
      const wrapper = renderButton({ loading: true }, { attrs: { onClick } });

      await wrapper.trigger('click');

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('prop: icon', () => {
    it('should render the icon before the text when leading', () => {
      const wrapper = renderButton({ icon: PlusIcon, iconType: 'leading' });

      expect(wrapper.classes()).toContain(classes.iconLeading);
      expect(
        wrapper.element.firstElementChild?.classList.contains('mzn-icon'),
      ).toBe(true);
      expect(wrapper.text()).toContain('label');
    });

    it('should render the icon after the text when trailing', () => {
      const wrapper = renderButton({ icon: PlusIcon, iconType: 'trailing' });

      expect(wrapper.classes()).toContain(classes.iconTrailing);
      expect(
        wrapper.element.lastElementChild?.classList.contains('mzn-icon'),
      ).toBe(true);
      expect(wrapper.text()).toContain('label');
    });

    it('should render no icon without one', () => {
      expect(renderButton().find('.mzn-icon').exists()).toBe(false);
    });
  });

  describe('tooltip in icon-only mode', () => {
    it('should show the children as a tooltip on hover', async () => {
      const wrapper = renderButton(
        { icon: PlusIcon, iconType: 'icon-only' },
        { text: 'add item' },
      );

      await wrapper.get('button').trigger('mouseenter');
      await flushPromises();

      const tooltip = document.body.querySelector(`.${tooltipClasses.host}`);

      expect(tooltip?.textContent).toBe('add item');
      expect(wrapper.get('button').attributes('aria-describedby')).toBe(
        tooltip?.id,
      );
    });

    it('should not show a tooltip when disabledTooltip is set', async () => {
      const wrapper = renderButton({
        disabledTooltip: true,
        icon: PlusIcon,
        iconType: 'icon-only',
      });

      await wrapper.get('button').trigger('mouseenter');
      await flushPromises();

      expect(document.body.querySelector(`.${tooltipClasses.host}`)).toBeNull();
    });

    it('should keep a consumer aria-describedby alongside the tooltip id', async () => {
      const wrapper = renderButton(
        { icon: PlusIcon, iconType: 'icon-only' },
        { attrs: { 'aria-describedby': 'hint' } },
      );

      await wrapper.get('button').trigger('mouseenter');
      await flushPromises();

      const tooltip = document.body.querySelector(`.${tooltipClasses.host}`);

      expect(wrapper.get('button').attributes('aria-describedby')).toBe(
        `hint ${tooltip?.id}`,
      );
    });

    it('should still call a consumer focus handler', async () => {
      const onFocus = vi.fn();
      const wrapper = renderButton(
        { icon: PlusIcon, iconType: 'icon-only' },
        { attrs: { onFocus } },
      );

      await wrapper.get('button').trigger('focus');

      expect(onFocus).toHaveBeenCalledTimes(1);
    });
  });

  describe('attributes', () => {
    it('should append a consumer class', () => {
      expect(renderButton({}, { attrs: { class: 'foo' } }).classes()).toContain(
        'foo',
      );
    });

    it('should forward unknown attributes', () => {
      const wrapper = renderButton({}, { attrs: { 'data-testid': 'x' } });

      expect(wrapper.attributes('data-testid')).toBe('x');
    });
  });
});
