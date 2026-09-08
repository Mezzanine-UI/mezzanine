import { mount } from '@vue/test-utils';
import { textFieldClasses } from '@mezzanine-ui/core/text-field';
import { textareaClasses } from '@mezzanine-ui/core/textarea';
import MznTextarea from './textarea.vue';
import type { TextareaProps } from './textarea.types';

type MountOptions = {
  attrs?: Record<string, unknown>;
  props?: TextareaProps;
};

const render = ({ attrs, props }: MountOptions = {}) =>
  mount(MznTextarea, { attrs, props });

describe('MznTextarea', () => {
  it('should render the text field frame and the textarea host class', () => {
    const wrapper = render();

    expect(wrapper.classes()).toContain(textFieldClasses.host);
    expect(wrapper.classes()).toContain(textareaClasses.host);
    expect(wrapper.classes()).not.toContain(textFieldClasses.warning);
    expect(wrapper.classes()).not.toContain(textFieldClasses.error);
  });

  it('should put a consumer class on the frame and never on the textarea', () => {
    const wrapper = render({ attrs: { class: 'foo' } });
    const textarea = wrapper.get('textarea');

    expect(wrapper.classes()).toContain('foo');
    expect(textarea.classes()).toContain(textareaClasses.textarea);
    expect(textarea.classes()).not.toContain('foo');
  });

  it('should append textareaClassName to the textarea', () => {
    const textarea = render({ props: { textareaClassName: 'bar' } }).get(
      'textarea',
    );

    expect(textarea.classes()).toContain(textareaClasses.textarea);
    expect(textarea.classes()).toContain('bar');
  });

  it('should expose the native textarea as textareaRef', () => {
    const wrapper = render();

    expect(
      (wrapper.vm as unknown as { textareaRef: unknown }).textareaRef,
    ).toBe(wrapper.get('textarea').element);
  });

  it('should forward native attributes to the textarea', () => {
    const wrapper = render({
      attrs: {
        'aria-label': '內容',
        'data-testid': 'textarea',
        id: 'foo-id',
        name: 'foo-name',
        placeholder: 'hint',
        rows: 3,
      },
    });
    const textarea = wrapper.get('textarea');

    expect(textarea.attributes('aria-label')).toBe('內容');
    expect(textarea.attributes('data-testid')).toBe('textarea');
    expect(textarea.attributes('id')).toBe('foo-id');
    expect(textarea.attributes('name')).toBe('foo-name');
    expect(textarea.attributes('placeholder')).toBe('hint');
    expect(textarea.attributes('rows')).toBe('3');
    expect(wrapper.attributes('placeholder')).toBeUndefined();
  });

  describe('interactive state', () => {
    it('should sync disabled between the frame and the textarea', () => {
      const wrapper = render({ props: { disabled: true } });

      expect(wrapper.classes()).toContain(textFieldClasses.disabled);
      expect(wrapper.get('textarea').element.disabled).toBe(true);
    });

    it('should sync readOnly without marking the frame disabled', () => {
      const wrapper = render({ props: { readOnly: true } });
      const textarea = wrapper.get('textarea').element;

      expect(wrapper.classes()).toContain(textFieldClasses.readonly);
      expect(wrapper.classes()).not.toContain(textFieldClasses.disabled);
      expect(textarea.readOnly).toBe(true);
      expect(textarea.disabled).toBe(false);
    });

    it('should let disabled win over readOnly, as React does', () => {
      const wrapper = render({ props: { disabled: true, readOnly: true } });

      expect(wrapper.classes()).toContain(textFieldClasses.disabled);
      expect(wrapper.classes()).not.toContain(textFieldClasses.readonly);
    });
  });

  describe('type', () => {
    it('should apply the warning style without blocking input', () => {
      const wrapper = render({ props: { type: 'warning' } });

      expect(wrapper.classes()).toContain(textFieldClasses.warning);
      expect(wrapper.get('textarea').element.disabled).toBe(false);
    });

    it('should apply the error style without blocking input', () => {
      const wrapper = render({ props: { type: 'error' } });

      expect(wrapper.classes()).toContain(textFieldClasses.error);
      expect(wrapper.get('textarea').element.readOnly).toBe(false);
    });

    it('should ignore disabled and readOnly outside the default type', () => {
      const wrapper = render({
        props: { disabled: true, readOnly: true, type: 'error' },
      });

      expect(wrapper.classes()).not.toContain(textFieldClasses.disabled);
      expect(wrapper.classes()).not.toContain(textFieldClasses.readonly);
    });
  });

  describe('resize', () => {
    it('should default to none and render no resize handle', () => {
      const wrapper = render();

      expect(wrapper.get('textarea').element.style.resize).toBe('none');
      expect(wrapper.find(`.${textareaClasses.resizer}`).exists()).toBe(false);
    });

    it.each(['both', 'horizontal', 'vertical'] as const)(
      'should render the resize handle for %s',
      (resize) => {
        const wrapper = render({ props: { resize } });

        expect(wrapper.get('textarea').element.style.resize).toBe(resize);
        expect(wrapper.find(`.${textareaClasses.resizer}`).exists()).toBe(true);
      },
    );

    it('should let a consumer style override resize', () => {
      const textarea = render({
        attrs: { style: { resize: 'both', width: '200px' } },
        props: { resize: 'none' },
      }).get('textarea').element;

      expect(textarea.style.resize).toBe('both');
      expect(textarea.style.width).toBe('200px');
    });
  });

  describe('value', () => {
    it('should read and write through the native textarea', async () => {
      const wrapper = render({ attrs: { value: 'foo' } });
      const textarea = wrapper.get('textarea');

      expect(textarea.element.value).toBe('foo');

      await textarea.setValue('bar');

      expect(textarea.element.value).toBe('bar');
    });

    it('should forward input listeners to the textarea', async () => {
      const onInput = vi.fn();

      await render({ attrs: { onInput } }).get('textarea').setValue('bar');

      expect(onInput).toHaveBeenCalledTimes(1);
    });
  });

  it('should keep the ARIA input semantics on the native textarea', () => {
    const wrapper = render({ attrs: { 'aria-label': 'Change summary' } });

    expect(wrapper.attributes('role')).toBe('presentation');
    expect(wrapper.get('textarea').attributes('aria-label')).toBe(
      'Change summary',
    );
  });
});
