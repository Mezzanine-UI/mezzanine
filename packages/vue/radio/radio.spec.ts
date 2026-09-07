import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { inputCheckClasses } from '@mezzanine-ui/core/_internal/input-check';
import { radioClasses } from '@mezzanine-ui/core/radio';
import { LightIcon } from '@mezzanine-ui/icons';
import MznRadio from './radio.vue';
import MznRadioGroup from './radio-group.vue';

describe('<MznRadio />', () => {
  it('should render a radio input inside a label', () => {
    const wrapper = mount(MznRadio, {
      props: { value: 'a' },
      slots: { default: () => 'Label' },
    });

    const input = wrapper.get('input');

    expect(input.attributes('type')).toBe('radio');
    expect(input.attributes('value')).toBe('a');
    expect(wrapper.get(`.${inputCheckClasses.label}`).text()).toBe('Label');
  });

  it('should mark the label as having one only when it renders', () => {
    const withLabel = mount(MznRadio, { slots: { default: () => 'Label' } });
    const bare = mount(MznRadio);

    expect(withLabel.get('label').classes()).toContain(
      inputCheckClasses.withLabel,
    );
    expect(bare.get('label').classes()).not.toContain(
      inputCheckClasses.withLabel,
    );
  });

  it('should follow its own state when uncontrolled', async () => {
    const wrapper = mount(MznRadio, { props: { defaultChecked: false } });

    expect(wrapper.get('input').element.checked).toBe(false);

    await wrapper.get('input').setValue(true);

    expect(wrapper.get('input').element.checked).toBe(true);
    expect(wrapper.emitted('change')).toHaveLength(1);
  });

  it('should stay on the value it was given when controlled', async () => {
    const wrapper = mount(MznRadio, { props: { checked: false } });

    await wrapper.get('input').setValue(true);

    expect(wrapper.get('input').element.checked).toBe(false);
    expect(wrapper.emitted('change')).toHaveLength(1);
  });

  it('should carry the error and disabled state', () => {
    const wrapper = mount(MznRadio, {
      props: { disabled: true, error: true },
      slots: { default: () => 'Label' },
    });

    expect(wrapper.get(`.${radioClasses.host}`).classes()).toContain(
      radioClasses.error,
    );
    expect(wrapper.get('input').attributes('disabled')).toBeDefined();
    expect(wrapper.get('label').classes()).toContain(
      inputCheckClasses.disabled,
    );
  });

  describe('type: segment', () => {
    it('should move the label inside the control and drop the outer one', () => {
      const wrapper = mount(MznRadio, {
        props: { icon: LightIcon, type: 'segment' },
        slots: { default: () => 'Option' },
      });

      expect(wrapper.get(`.${radioClasses.segmentedContainer}`).text()).toBe(
        'Option',
      );
      expect(wrapper.find(`.${inputCheckClasses.label}`).exists()).toBe(false);
      expect(wrapper.get(`.${radioClasses.host}`).classes()).toContain(
        radioClasses.segmented,
      );
    });

    it('should mark the container when it holds both an icon and text', () => {
      const both = mount(MznRadio, {
        props: { icon: LightIcon, type: 'segment' },
        slots: { default: () => 'Option' },
      });
      const iconOnly = mount(MznRadio, {
        props: { icon: LightIcon, type: 'segment' },
      });

      expect(
        both.get(`.${radioClasses.segmentedContainer}`).classes(),
      ).toContain(radioClasses.segmentedContainerWithIconText);
      expect(
        iconOnly.get(`.${radioClasses.segmentedContainer}`).classes(),
      ).not.toContain(radioClasses.segmentedContainerWithIconText);
    });
  });

  describe('withInputConfig', () => {
    it('should render the paired input only for the radio type', () => {
      const asRadio = mount(MznRadio, {
        props: { withInputConfig: { width: 140 } },
      });
      const asSegment = mount(MznRadio, {
        props: { type: 'segment', withInputConfig: { width: 140 } },
      });

      expect(asRadio.find('input[type="text"]').exists()).toBe(true);
      expect(asSegment.find('input[type="text"]').exists()).toBe(false);
    });

    it('should take the width it is given', () => {
      const wrapper = mount(MznRadio, {
        props: { withInputConfig: { width: 140 } },
      });
      const held = wrapper
        .get('input[type="text"]')
        .element.closest('div[style]') as HTMLElement;

      expect(held.style.width).toBe('140px');
    });

    it('should focus the paired input once the radio is picked', async () => {
      const wrapper = mount(MznRadio, {
        attachTo: document.body,
        props: { withInputConfig: {} },
      });

      await wrapper.get('input[type="radio"]').setValue(true);

      expect(document.activeElement).toBe(
        wrapper.get('input[type="text"]').element,
      );
    });

    it('should leave a disabled paired input alone', async () => {
      const wrapper = mount(MznRadio, {
        attachTo: document.body,
        props: { withInputConfig: { disabled: true } },
      });

      await wrapper.get('input[type="radio"]').setValue(true);

      expect(document.activeElement).not.toBe(
        wrapper.get('input[type="text"]').element,
      );
    });
  });
});

describe('<MznRadioGroup />', () => {
  const options = [
    { id: 'a', name: 'A' },
    { id: 'b', name: 'B' },
    { id: 'c', name: 'C', disabled: true },
  ];

  it('should render one radio per option', () => {
    const wrapper = mount(MznRadioGroup, { props: { options } });

    const inputs = wrapper.findAll('input');

    expect(inputs).toHaveLength(3);
    expect(inputs[2].attributes('disabled')).toBeDefined();
    expect(wrapper.find('[role="radiogroup"]').exists()).toBe(true);
  });

  it('should prefer the slot over the options', () => {
    const wrapper = mount(MznRadioGroup, {
      props: { options },
      slots: { default: () => h(MznRadio, { value: 'only' }) },
    });

    expect(wrapper.findAll('input')).toHaveLength(1);
  });

  it('should hand its name, size and type down to every radio', () => {
    const wrapper = mount(MznRadioGroup, {
      props: { name: 'group', options, size: 'sub', type: 'segment' },
    });

    expect(
      wrapper.findAll('input').every((i) => i.attributes('name') === 'group'),
    ).toBe(true);
    expect(wrapper.get(`.${radioClasses.host}`).classes()).toContain(
      radioClasses.segmented,
    );
    expect(wrapper.get(`.${radioClasses.host}`).classes()).toContain(
      radioClasses.size('sub'),
    );
  });

  it('should check the radio whose value matches the group', () => {
    const wrapper = mount(MznRadioGroup, {
      props: { options, value: 'b' },
    });

    expect(wrapper.findAll('input').map((i) => i.element.checked)).toEqual([
      false,
      true,
      false,
    ]);
  });

  it('should report a pick and move the selection when uncontrolled', async () => {
    const wrapper = mount(MznRadioGroup, {
      props: { defaultValue: 'a', options },
    });

    await wrapper.findAll('input')[1].setValue(true);
    await nextTick();

    expect(wrapper.emitted('change')).toHaveLength(1);
    expect(wrapper.findAll('input').map((i) => i.element.checked)).toEqual([
      false,
      true,
      false,
    ]);
  });

  it('should disable every radio when the group is disabled', () => {
    const wrapper = mount(MznRadioGroup, {
      props: { disabled: true, options },
    });

    expect(
      wrapper
        .findAll('input')
        .every((i) => i.attributes('disabled') !== undefined),
    ).toBe(true);
  });

  it('should lay the group out the way it is told', () => {
    const wrapper = mount(MznRadioGroup, {
      props: { options, orientation: 'vertical' },
    });

    expect(
      wrapper.get('[role="radiogroup"]').attributes('aria-orientation'),
    ).toBe('vertical');
  });
});
