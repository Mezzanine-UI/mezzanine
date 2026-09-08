import { mount } from '@vue/test-utils';
import { buttonClasses } from '@mezzanine-ui/core/button';
import { floatingButtonClasses as classes } from '@mezzanine-ui/core/floating-button';
import { PlusIcon } from '@mezzanine-ui/icons';
import MznFloatingButton from './floating-button.vue';
import type { FloatingButtonProps } from './floating-button.types';

function render(
  props: FloatingButtonProps = {},
  options: { attrs?: Record<string, unknown>; slot?: string } = {},
) {
  return mount(MznFloatingButton, {
    attrs: options.attrs,
    props,
    slots: options.slot ? { default: () => options.slot } : undefined,
  });
}

describe('<MznFloatingButton />', () => {
  it('should wrap a button in the host element', () => {
    const wrapper = render({}, { slot: 'Button' });

    expect(wrapper.classes()).toContain(classes.host);

    const button = wrapper.get('button');

    expect(button.classes()).toContain(classes.button);
    expect(button.text()).toBe('Button');
  });

  it('should pin the appearance the design gives it', () => {
    const wrapper = render();
    const button = wrapper.get('button');

    expect(button.classes()).toContain(buttonClasses.variant('base-primary'));
    expect(button.classes()).toContain(buttonClasses.size('main'));
  });

  it('should hide the button only when both autoHideWhenOpen and open are set', () => {
    const hidden = render({ autoHideWhenOpen: true, open: true });
    const openOnly = render({ open: true });
    const autoOnly = render({ autoHideWhenOpen: true });

    expect(hidden.get('button').classes()).toContain(classes.buttonHidden);
    expect(openOnly.get('button').classes()).not.toContain(
      classes.buttonHidden,
    );
    expect(autoOnly.get('button').classes()).not.toContain(
      classes.buttonHidden,
    );
  });

  it('should put a fallthrough class on the host and the rest on the button', async () => {
    const wrapper = render(
      {},
      { attrs: { class: 'foo', 'data-testid': 'floating' } },
    );

    expect(wrapper.classes()).toContain('foo');
    expect(wrapper.get('button').classes()).not.toContain('foo');
    expect(wrapper.get('button').attributes('data-testid')).toBe('floating');

    await wrapper.get('button').trigger('click');
  });

  it('should reach the button with a click listener', async () => {
    const onClick = vi.fn();
    const wrapper = mount(MznFloatingButton, { attrs: { onClick } });

    await wrapper.get('button').trigger('click');

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should forward the button props it inherits', () => {
    const wrapper = render({
      disabled: true,
      icon: PlusIcon,
      iconType: 'leading',
    });

    expect(wrapper.get('button').attributes('disabled')).toBeDefined();
    expect(wrapper.get('button').find('.mzn-icon').exists()).toBe(true);
  });
});
