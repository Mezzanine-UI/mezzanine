import { mount } from '@vue/test-utils';
import { h } from 'vue';
import {
  buttonClasses,
  buttonGroupClasses as classes,
} from '@mezzanine-ui/core/button';
import MznButton from './button.vue';
import MznButtonGroup from './button-group.vue';
import type { ButtonGroupProps } from './button-group.types';

const renderGroup = (
  props: ButtonGroupProps = {},
  children = [h(MznButton, null, () => 'one'), h(MznButton, null, () => 'two')],
) =>
  mount(MznButtonGroup, {
    attachTo: document.body,
    props,
    slots: { default: () => children },
  });

const buttons = (wrapper: ReturnType<typeof renderGroup>) =>
  wrapper.findAll('button');

describe('MznButtonGroup', () => {
  it('should wrap the buttons in a group host', () => {
    const wrapper = renderGroup();

    expect(wrapper.classes()).toContain(classes.host);
    expect(wrapper.attributes('role')).toBe('group');
    expect(wrapper.attributes('aria-orientation')).toBe('horizontal');
    expect(buttons(wrapper)).toHaveLength(2);
  });

  it('should let a consumer override the role', () => {
    const wrapper = mount(MznButtonGroup, {
      attrs: { role: 'toolbar' },
      slots: { default: () => h(MznButton, null, () => 'one') },
    });

    expect(wrapper.attributes('role')).toBe('toolbar');
  });

  describe('prop: orientation', () => {
    it.each(['horizontal', 'vertical'] as const)(
      'should apply the %s orientation',
      (orientation) => {
        const wrapper = renderGroup({ orientation });

        expect(wrapper.classes()).toContain(classes.orientation(orientation));
        expect(wrapper.attributes('aria-orientation')).toBe(orientation);
      },
    );
  });

  describe('prop: fullWidth', () => {
    it('should not stretch by default', () => {
      expect(renderGroup().classes()).not.toContain(classes.fullWidth);
    });

    it('should stretch when set', () => {
      expect(renderGroup({ fullWidth: true }).classes()).toContain(
        classes.fullWidth,
      );
    });
  });

  describe('prop: variant', () => {
    it('should pass its variant to children', () => {
      const wrapper = renderGroup({ variant: 'base-ghost' });

      buttons(wrapper).forEach((button) => {
        expect(button.classes()).toContain(buttonClasses.variant('base-ghost'));
      });
    });

    it('should not override a child that sets its own', () => {
      const wrapper = renderGroup({ variant: 'base-ghost' }, [
        h(MznButton, { variant: 'inverse' }, () => 'one'),
        h(MznButton, null, () => 'two'),
      ]);
      const [first, second] = buttons(wrapper);

      expect(first.classes()).toContain(buttonClasses.variant('inverse'));
      expect(second.classes()).toContain(buttonClasses.variant('base-ghost'));
    });
  });

  describe('prop: size', () => {
    it('should pass its size to children', () => {
      const wrapper = renderGroup({ size: 'minor' });

      buttons(wrapper).forEach((button) => {
        expect(button.classes()).toContain(buttonClasses.size('minor'));
      });
    });

    it('should not override a child that sets its own', () => {
      const wrapper = renderGroup({ size: 'minor' }, [
        h(MznButton, { size: 'large' as never }, () => 'one'),
        h(MznButton, null, () => 'two'),
      ]);
      const [first, second] = buttons(wrapper);

      expect(first.classes()).toContain(buttonClasses.size('large' as never));
      expect(second.classes()).toContain(buttonClasses.size('minor'));
    });
  });

  describe('prop: disabled', () => {
    it('should disable every child', () => {
      const wrapper = renderGroup({ disabled: true });

      buttons(wrapper).forEach((button) => {
        expect(button.attributes('disabled')).toBe('');
      });
    });

    it('should let a child opt out with disabled=false', () => {
      const wrapper = renderGroup({ disabled: true }, [
        h(MznButton, { disabled: false }, () => 'one'),
        h(MznButton, null, () => 'two'),
      ]);
      const [first, second] = buttons(wrapper);

      expect(first.attributes('disabled')).toBeUndefined();
      expect(second.attributes('disabled')).toBe('');
    });
  });
});
