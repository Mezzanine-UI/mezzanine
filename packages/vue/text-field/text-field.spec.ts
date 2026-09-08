import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { textFieldClasses } from '@mezzanine-ui/core/text-field';
import MznTextField from './text-field.vue';
import type { TextFieldProps } from './text-field.types';

const withInput = (props: TextFieldProps = {}) =>
  mount(MznTextField, {
    props,
    slots: { default: () => h('input', { type: 'text' }) },
  });

describe('MznTextField', () => {
  it('should render the host with the size and full-width defaults', () => {
    const wrapper = withInput();

    expect(wrapper.classes()).toContain(textFieldClasses.host);
    expect(wrapper.classes()).toContain(textFieldClasses.main);
    expect(wrapper.classes()).toContain(textFieldClasses.fullWidth);
  });

  it('should allow full width to be turned off', () => {
    expect(withInput({ fullWidth: false }).classes()).not.toContain(
      textFieldClasses.fullWidth,
    );
  });

  it.each([
    ['main', textFieldClasses.main],
    ['sub', textFieldClasses.sub],
  ] as const)('applies the %s size class', (size, expected) => {
    expect(withInput({ size }).classes()).toContain(expected);
  });

  it.each([
    [{ active: true }, textFieldClasses.active],
    [{ clearable: true }, textFieldClasses.clearable],
    [{ disabled: true }, textFieldClasses.disabled],
    [{ error: true }, textFieldClasses.error],
    [{ readonly: true }, textFieldClasses.readonly],
    [{ warning: true }, textFieldClasses.warning],
  ] as [TextFieldProps, string][])(
    'applies the state class for %o',
    (props, expected) => {
      expect(withInput(props).classes()).toContain(expected);
    },
  );

  describe('role', () => {
    it('should fall back to textbox', () => {
      expect(withInput().attributes('role')).toBe('textbox');
    });

    it('should fall back to button when a click listener is bound', () => {
      const wrapper = mount(MznTextField, {
        attrs: { onClick: () => {} },
        slots: { default: () => h('input') },
      });

      expect(wrapper.attributes('role')).toBe('button');
    });

    it('should let an explicit role win', () => {
      const wrapper = mount(MznTextField, {
        attrs: { role: 'combobox' },
        slots: { default: () => h('input') },
      });

      expect(wrapper.attributes('role')).toBe('combobox');
    });
  });

  describe('padding control', () => {
    it('should keep its own padding for a plain slot', () => {
      expect(withInput().classes()).not.toContain(textFieldClasses.noPadding);
    });

    it('should hand padding over when the slot reads paddingClassName', () => {
      const wrapper = mount(MznTextField, {
        slots: {
          default: ({ paddingClassName }: { paddingClassName: string }) =>
            h('textarea', { class: paddingClassName }),
        },
      });

      expect(wrapper.classes()).toContain(textFieldClasses.noPadding);
      expect(wrapper.find('textarea').classes()).toContain(
        textFieldClasses.inputPadding,
      );
    });
  });

  describe('affixes', () => {
    it('should render prefix and suffix wrappers only when given', () => {
      expect(withInput().find(`.${textFieldClasses.prefix}`).exists()).toBe(
        false,
      );

      const wrapper = mount(MznTextField, {
        slots: {
          default: () => h('input'),
          prefix: () => h('span', 'P'),
          suffix: () => h('span', 'S'),
        },
      });

      expect(wrapper.find(`.${textFieldClasses.prefix}`).text()).toBe('P');
      expect(wrapper.find(`.${textFieldClasses.suffix}`).text()).toBe('S');
    });

    it('should apply the slim gap when both affixes are present', () => {
      const wrapper = mount(MznTextField, {
        slots: {
          default: () => h('input'),
          prefix: () => h('span', 'P'),
          suffix: () => h('span', 'S'),
        },
      });

      expect(wrapper.classes()).toContain(textFieldClasses.slimGap);
    });
  });

  describe('clear', () => {
    it('should render the clear button when clearable', () => {
      const wrapper = withInput({ clearable: true });

      expect(wrapper.find(`.${textFieldClasses.clearIcon}`).exists()).toBe(
        true,
      );
    });

    it('should emit clear', async () => {
      const wrapper = withInput({ clearable: true });

      await wrapper.find(`.${textFieldClasses.clearIcon}`).trigger('click');

      expect(wrapper.emitted('clear')).toHaveLength(1);
    });

    it('should not emit clear while disabled', async () => {
      const wrapper = withInput({ clearable: true, disabled: true });

      await wrapper.find(`.${textFieldClasses.clearIcon}`).trigger('click');

      expect(wrapper.emitted('clear')).toBeUndefined();
    });
  });

  it('should stop click propagation, matching React', async () => {
    const outer = vi.fn();
    const wrapper = mount(
      {
        components: { MznTextField },
        template:
          '<div @click="outer"><MznTextField><input /></MznTextField></div>',
        setup: () => ({ outer }),
      },
      { attachTo: document.body },
    );

    await wrapper.find(`.${textFieldClasses.host}`).trigger('click');

    expect(outer).not.toHaveBeenCalled();
  });
});
