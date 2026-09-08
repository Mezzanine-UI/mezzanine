import { mount } from '@vue/test-utils';
import { computed } from 'vue';
import { toggleClasses } from '@mezzanine-ui/core/toggle';
import { formControlKey } from '../_internal/form-control';
import MznToggle from './toggle.vue';
import type { ToggleProps } from './toggle.types';

const render = (props: ToggleProps = {}) => mount(MznToggle, { props });

const input = (wrapper: ReturnType<typeof render>) =>
  wrapper.get('input').element as HTMLInputElement;

function expectChecked(
  wrapper: ReturnType<typeof render>,
  checked: boolean,
): void {
  expect(wrapper.classes().includes(toggleClasses.checked)).toBe(checked);
  expect(wrapper.get('input').attributes('aria-checked')).toBe(`${checked}`);
}

function expectDisabled(
  wrapper: ReturnType<typeof render>,
  disabled: boolean,
): void {
  expect(input(wrapper).disabled).toBe(disabled);
  expect(wrapper.get('input').attributes('disabled')).toBe(
    disabled ? '' : undefined,
  );
  expect(wrapper.get('input').attributes('aria-disabled')).toBe(`${disabled}`);
}

describe('MznToggle', () => {
  it('should render a checkbox inside the toggle host', () => {
    const wrapper = render();

    expect(wrapper.classes()).toContain(toggleClasses.host);
    expect(wrapper.find(`.${toggleClasses.inputContainer}`).exists()).toBe(
      true,
    );
    expect(wrapper.find(`.${toggleClasses.knob}`).exists()).toBe(true);
    expect(wrapper.get('input').attributes('type')).toBe('checkbox');
  });

  describe('prop: checked', () => {
    it.each([false, true])('should render checked=%s', (checked) => {
      expectChecked(render({ checked }), checked);
    });

    it.each([false, true])(
      'should let checked=%s override the opposite defaultChecked',
      (checked) => {
        expectChecked(render({ checked, defaultChecked: !checked }), checked);
      },
    );
  });

  describe('prop: defaultChecked', () => {
    it('should be checked by default', () => {
      expectChecked(render({ defaultChecked: true }), true);
    });
  });

  describe('prop: disabled', () => {
    it.each([false, true])(
      'should bind the disabled class and attributes for %s',
      (disabled) => {
        const wrapper = render({ disabled });

        expect(wrapper.classes().includes(toggleClasses.disabled)).toBe(
          disabled,
        );
        expectDisabled(wrapper, disabled);
      },
    );

    it('should render no aria-disabled when neither prop nor form control says', () => {
      expect(render().get('input').attributes('aria-disabled')).toBeUndefined();
    });

    it('should inherit disabled from the form control, and let the prop win', () => {
      const global = {
        provide: {
          [formControlKey as symbol]: computed(() => ({
            disabled: true,
            fullWidth: false,
            required: false,
          })),
        },
      };

      expectDisabled(mount(MznToggle, { global }), true);
      expectDisabled(
        mount(MznToggle, { global, props: { disabled: false } }),
        false,
      );
    });
  });

  describe('prop: size', () => {
    it('should render size main by default', () => {
      const wrapper = render();

      expect(wrapper.classes()).toContain(toggleClasses.main);
      expect(wrapper.classes()).not.toContain(toggleClasses.sub);
    });

    it('should add the sub class for size sub', () => {
      const wrapper = render({ size: 'sub' });

      expect(wrapper.classes()).toContain(toggleClasses.sub);
      expect(wrapper.classes()).not.toContain(toggleClasses.main);
    });
  });

  describe('prop: label', () => {
    it('should render the label when provided', () => {
      const text = render({ label: 'Test Label' }).get(
        `.${toggleClasses.textContainer}`,
      );

      expect(text.text()).toContain('Test Label');
    });

    it('should render no text container without a label', () => {
      expect(render().find(`.${toggleClasses.textContainer}`).exists()).toBe(
        false,
      );
    });
  });

  describe('prop: supportingText', () => {
    it('should render supporting text alongside the label', () => {
      const text = render({
        label: 'Test Label',
        supportingText: 'Supporting text',
      }).get(`.${toggleClasses.textContainer}`);

      expect(text.text()).toContain('Test Label');
      expect(text.text()).toContain('Supporting text');
    });

    it('should render nothing without a label', () => {
      expect(
        render({ supportingText: 'Supporting text' })
          .find(`.${toggleClasses.textContainer}`)
          .exists(),
      ).toBe(false);
    });
  });

  describe('prop: inputProps', () => {
    it('should forward inputProps to the input', () => {
      const wrapper = render({ inputProps: { name: 'toggle-name' } });

      expect(wrapper.get('input').attributes('name')).toBe('toggle-name');
    });
  });

  describe('control', () => {
    it('should track its own value when uncontrolled', async () => {
      const wrapper = render();

      await wrapper.get('input').setValue(true);
      expectChecked(wrapper, true);

      await wrapper.get('input').setValue(false);
      expectChecked(wrapper, false);
    });

    it('should stay on the controlled value until the prop changes', async () => {
      const wrapper = render({ checked: false });

      await wrapper.get('input').setValue(true);

      expectChecked(wrapper, false);
      expect(input(wrapper).checked).toBe(false);

      await wrapper.setProps({ checked: true });

      expectChecked(wrapper, true);
    });

    it('should emit change and update:checked once per real change', async () => {
      const wrapper = render();

      await wrapper.get('input').setValue(true);

      expect(wrapper.emitted('change')).toHaveLength(1);
      expect(wrapper.emitted('update:checked')).toEqual([[true]]);
    });

    it('should not emit when the value did not move', async () => {
      const wrapper = render({ defaultChecked: true });

      await wrapper.get('input').setValue(true);

      expect(wrapper.emitted('change')).toBeUndefined();
    });
  });
});
