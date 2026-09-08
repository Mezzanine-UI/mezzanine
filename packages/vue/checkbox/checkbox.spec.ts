import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import {
  checkboxClasses,
  checkboxGroupClasses,
} from '@mezzanine-ui/core/checkbox';
import MznCheckAll from './check-all.vue';
import MznCheckbox from './checkbox.vue';
import MznCheckboxGroup from './checkbox-group.vue';

describe('<MznCheckbox />', () => {
  it('should render an unchecked checkbox with its label', () => {
    const wrapper = mount(MznCheckbox, {
      props: { label: 'Agree', name: 'agree' },
    });

    expect(wrapper.get('input').element.checked).toBe(false);
    expect(wrapper.get(`.${checkboxClasses.label}`).text()).toBe('Agree');
  });

  it('should keep a controlled checkbox on the value it was given', async () => {
    const wrapper = mount(MznCheckbox, {
      props: { checked: false, label: 'Agree', name: 'agree' },
    });

    await wrapper.get('input').setValue(true);

    expect(wrapper.emitted('change')).toHaveLength(1);
    expect(wrapper.get('input').element.checked).toBe(false);
  });

  it('should follow its own state when uncontrolled', async () => {
    const wrapper = mount(MznCheckbox, {
      props: { defaultChecked: true, label: 'Agree', name: 'agree' },
    });

    expect(wrapper.get('input').element.checked).toBe(true);

    await wrapper.get('input').setValue(false);

    expect(wrapper.get('input').element.checked).toBe(false);
  });

  it('should report the indeterminate state on the input and to assistive tech', async () => {
    const wrapper = mount(MznCheckbox, {
      props: { indeterminate: true, label: 'Agree', name: 'agree' },
    });

    await nextTick();

    expect(wrapper.get('input').element.indeterminate).toBe(true);
    expect(wrapper.get('input').attributes('aria-checked')).toBe('mixed');
  });

  describe('chip mode', () => {
    it('should toggle from a click on the host itself', async () => {
      const wrapper = mount(MznCheckbox, {
        attachTo: document.body,
        props: { label: 'Chip', mode: 'chip', name: 'chip' },
      });

      await wrapper.get(`.${checkboxClasses.host}`).trigger('click');

      expect(wrapper.get('input').element.checked).toBe(true);
    });

    it('should not toggle when disabled', async () => {
      const wrapper = mount(MznCheckbox, {
        attachTo: document.body,
        props: { disabled: true, label: 'Chip', mode: 'chip', name: 'chip' },
      });

      await wrapper.get(`.${checkboxClasses.host}`).trigger('click');

      expect(wrapper.get('input').element.checked).toBe(false);
    });
  });

  describe('editable input', () => {
    it('should render the input as soon as `withEditInput` is set', () => {
      const wrapper = mount(MznCheckbox, {
        props: {
          label: 'Other',
          name: 'other',
          value: 'other',
          withEditInput: true,
        },
      });

      expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    });

    it('should drop the input while indeterminate and in chip mode', () => {
      const indeterminate = mount(MznCheckbox, {
        props: {
          indeterminate: true,
          label: 'Other',
          name: 'other',
          withEditInput: true,
        },
      });
      const chip = mount(MznCheckbox, {
        props: {
          label: 'Other',
          mode: 'chip',
          name: 'other',
          withEditInput: true,
        },
      });

      expect(indeterminate.find('input[type="text"]').exists()).toBe(false);
      expect(chip.find('input[type="text"]').exists()).toBe(false);
    });

    it('should default the input name and placeholder from the checkbox', async () => {
      const wrapper = mount(MznCheckbox, {
        props: {
          defaultChecked: true,
          id: 'other-checkbox',
          label: 'Other',
          name: 'other',
          withEditInput: true,
        },
      });

      await nextTick();

      const input = wrapper.get('input[type="text"]');

      expect(input.attributes('name')).toBe('other_input');
      expect(input.attributes('placeholder')).toBe('Please enter...');
    });
  });

  it('should throw when used inside a group without a value', () => {
    expect(() =>
      mount(MznCheckboxGroup, {
        props: { name: 'group' },
        slots: { default: () => h(MznCheckbox, { label: 'No value' }) },
      }),
    ).toThrow(/`value` is required/);
  });
});

describe('<MznCheckboxGroup />', () => {
  const options = [
    { label: 'One', value: '1' },
    { label: 'Two', value: '2' },
    { label: 'Three', value: '3', disabled: true },
  ];

  it('should render one checkbox per option, sharing the group name', () => {
    const wrapper = mount(MznCheckboxGroup, {
      props: { name: 'group', options },
    });

    const inputs = wrapper.findAll('input');

    expect(inputs).toHaveLength(3);
    expect(inputs.every((input) => input.attributes('name') === 'group')).toBe(
      true,
    );
    expect(inputs[2].attributes('disabled')).toBeDefined();
  });

  it('should report every selected value on change', async () => {
    const wrapper = mount(MznCheckboxGroup, {
      props: { name: 'group', options, value: ['1'] },
    });

    await wrapper.findAll('input')[1].setValue(true);

    const event = wrapper.emitted('change')?.[0][0] as {
      target: { values: string[] };
    };

    expect(event.target.values).toEqual(['1', '2']);
  });

  it('should disable every checkbox when the group is disabled', () => {
    const wrapper = mount(MznCheckboxGroup, {
      props: { disabled: true, name: 'group', options },
    });

    expect(
      wrapper
        .findAll('input')
        .every((input) => input.attributes('disabled') !== undefined),
    ).toBe(true);
  });

  describe('level control', () => {
    it('should render a level control that is not part of the group', () => {
      const wrapper = mount(MznCheckboxGroup, {
        props: {
          level: { active: true, label: 'Select all' },
          name: 'group',
          options,
        },
      });

      // Four inputs: the level control plus one per option. The level control
      // carries no `value`, which would throw if it saw the group context.
      const inputs = wrapper.findAll('input');

      expect(inputs).toHaveLength(4);
      expect(inputs[0].attributes('name')).toBe('group-level-control');
    });

    it('should sit inside the content wrapper in chip mode', () => {
      const wrapper = mount(MznCheckboxGroup, {
        props: {
          level: { active: true, label: 'Select all' },
          mode: 'chip',
          name: 'group',
          options,
        },
      });

      const wrapperEl = wrapper.get(`.${checkboxGroupClasses.contentWrapper}`);

      expect(wrapperEl.find('input[name="group-level-control"]').exists()).toBe(
        true,
      );
    });

    it('should be indeterminate while only some enabled options are selected', async () => {
      const wrapper = mount(MznCheckboxGroup, {
        props: {
          level: { active: true, label: 'Select all' },
          name: 'group',
          options,
          value: ['1'],
        },
      });

      await nextTick();

      expect(wrapper.findAll('input')[0].element.indeterminate).toBe(true);
    });

    it('should select every enabled option, keeping the selected disabled ones', async () => {
      const wrapper = mount(MznCheckboxGroup, {
        props: {
          level: { active: true, label: 'Select all' },
          name: 'group',
          options,
          value: ['3'],
        },
      });

      await wrapper.findAll('input')[0].setValue(true);

      const event = wrapper.emitted('change')?.[0][0] as {
        target: { values: string[] };
      };

      expect(event.target.values).toEqual(['1', '2', '3']);
    });

    it('should hand the event to a custom level handler instead', async () => {
      const onChange = vi.fn();
      const wrapper = mount(MznCheckboxGroup, {
        props: {
          level: { active: true, label: 'Select all', onChange },
          name: 'group',
          options,
        },
      });

      await wrapper.findAll('input')[0].setValue(true);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(wrapper.emitted('change')).toBeUndefined();
    });
  });
});

describe('<MznCheckAll />', () => {
  const options = [
    { label: 'One', value: '1' },
    { label: 'Two', value: '2' },
  ];

  function mountCheckAll(value: string[], onChange = vi.fn()) {
    const wrapper = mount(MznCheckAll, {
      props: { label: 'Check all' },
      slots: {
        default: () =>
          h(MznCheckboxGroup, { name: 'group', onChange, options, value }),
      },
    });

    return { onChange, wrapper };
  }

  it('should read the group it wraps to decide its own state', async () => {
    const { wrapper } = mountCheckAll(['1']);

    await nextTick();

    expect(wrapper.findAll('input')[0].element.indeterminate).toBe(true);
  });

  it('should check every option through the group handler', async () => {
    const { onChange, wrapper } = mountCheckAll([]);

    await wrapper.findAll('input')[0].setValue(true);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target.values).toEqual(['1', '2']);
  });
});
