import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { sliderClasses as classes } from '@mezzanine-ui/core/slider';
import { MinusIcon, PlusIcon } from '@mezzanine-ui/icons';
import MznSlider from './slider.vue';

const RAIL_RECT = {
  bottom: 100,
  height: 50,
  left: 0,
  right: 100,
  top: 0,
  width: 100,
  x: 0,
  y: 0,
  toJSON: () => ({}),
} as DOMRect;

describe('<MznSlider />', () => {
  beforeEach(() => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(
      RAIL_RECT,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the rail, the track and one handle for a single value', () => {
    const wrapper = mount(MznSlider, { props: { value: 50 } });

    expect(wrapper.classes()).toContain(classes.host);
    expect(wrapper.find(`.${classes.rail}`).exists()).toBe(true);
    expect(wrapper.find(`.${classes.track}`).exists()).toBe(true);
    expect(wrapper.findAll(`.${classes.handler}`)).toHaveLength(1);
    expect(wrapper.get(`.${classes.handler}`).attributes('aria-label')).toBe(
      'Slider Handler -1',
    );
  });

  it('should render two labelled handles for a range value', () => {
    const wrapper = mount(MznSlider, { props: { value: [20, 80] } });
    const handlers = wrapper.findAll(`.${classes.handler}`);

    expect(handlers).toHaveLength(2);
    expect(handlers[0].attributes('aria-label')).toBe('Slider Handler 0');
    expect(handlers[1].attributes('aria-label')).toBe('Slider Handler 1');
    expect(handlers[0].attributes('aria-valuenow')).toBe('20');
    expect(handlers[1].attributes('aria-valuenow')).toBe('80');
  });

  it('should write the track and handle positions as css variables', () => {
    const wrapper = mount(MznSlider, { props: { value: 40 } });

    expect(wrapper.attributes('style')).toContain(
      '--mzn-slider-track-width: 40%',
    );
    expect(wrapper.attributes('style')).toContain(
      '--mzn-slider-handler-position: 40%',
    );
  });

  describe('prop: disabled', () => {
    it('should mark the host and the handles as disabled', () => {
      const wrapper = mount(MznSlider, {
        props: { disabled: true, value: 50 },
      });

      expect(wrapper.classes()).toContain(classes.disabled);
      expect(
        wrapper.get(`.${classes.handler}`).attributes('aria-disabled'),
      ).toBe('true');
    });
  });

  describe('prop: withTick', () => {
    it('should slice the range into equal segments for a number', () => {
      const wrapper = mount(MznSlider, {
        props: { value: 50, withTick: 3 },
      });

      expect(
        wrapper.findAll(`.${classes.tick}`).map((tick) => tick.text()),
      ).toEqual(['0', '25', '50', '75', '100']);
    });

    it('should drop the given ticks that fall outside min…max', () => {
      const wrapper = mount(MznSlider, {
        props: { value: 50, withTick: [-10, 50, 200] },
      });

      expect(
        wrapper.findAll(`.${classes.tick}`).map((tick) => tick.text()),
      ).toEqual(['0', '50', '100']);
    });
  });

  describe('value validation', () => {
    it('should pull a single value back inside min…max', () => {
      const wrapper = mount(MznSlider, {
        props: { onChange: () => {}, value: 50 },
      });

      wrapper.setProps({ value: 150 });

      return nextTick().then(() => {
        expect(wrapper.emitted('change')?.at(-1)).toEqual([100]);
      });
    });

    it('should pull a range value back inside min…max', () => {
      const wrapper = mount(MznSlider, {
        props: { onChange: () => {}, value: [10, 50] },
      });

      wrapper.setProps({ value: [-10, 50] });

      return nextTick().then(() => {
        expect(wrapper.emitted('change')?.at(-1)).toEqual([[0, 50]]);
      });
    });
  });

  describe('prop: prefixIcon / suffixIcon', () => {
    it('should step the value by one step per click', async () => {
      const wrapper = mount(MznSlider, {
        props: {
          onChange: () => {},
          prefixIcon: MinusIcon,
          step: 5,
          suffixIcon: PlusIcon,
          value: 50,
        },
      });
      const [prefix, suffix] = wrapper.findAll(`.${classes.icon}`);

      await prefix.trigger('click');
      await suffix.trigger('click');

      expect(wrapper.emitted('change')).toEqual([[45], [55]]);
    });

    it('should move only the matching edge of a range', async () => {
      const wrapper = mount(MznSlider, {
        props: {
          onChange: () => {},
          prefixIcon: MinusIcon,
          suffixIcon: PlusIcon,
          value: [20, 70],
        },
      });
      const [prefix, suffix] = wrapper.findAll(`.${classes.icon}`);

      await prefix.trigger('click');
      await suffix.trigger('click');

      expect(wrapper.emitted('change')).toEqual([[[19, 70]], [[20, 71]]]);
    });

    it('should hand the click over when the consumer listens for it', async () => {
      const wrapper = mount(MznSlider, {
        props: {
          onChange: () => {},
          onPrefixIconClick: () => {},
          prefixIcon: MinusIcon,
          suffixIcon: PlusIcon,
          value: 50,
        },
      });
      const [prefix] = wrapper.findAll(`.${classes.icon}`);

      await prefix.trigger('click');

      expect(wrapper.emitted('prefixIconClick')).toHaveLength(1);
      expect(wrapper.emitted('change')).toBeUndefined();
    });

    it('should step on Enter and on Space', async () => {
      const wrapper = mount(MznSlider, {
        props: {
          onChange: () => {},
          prefixIcon: MinusIcon,
          suffixIcon: PlusIcon,
          value: 50,
        },
      });
      const [, suffix] = wrapper.findAll(`.${classes.icon}`);

      await suffix.trigger('keydown', { key: 'Enter' });
      await suffix.trigger('keydown', { key: ' ' });

      expect(wrapper.emitted('change')).toEqual([[51], [51]]);
    });

    it('should not offer the icons as buttons without a change listener', () => {
      const wrapper = mount(MznSlider, {
        props: { prefixIcon: MinusIcon, suffixIcon: PlusIcon, value: 50 },
      });
      const [prefix] = wrapper.findAll(`.${classes.icon}`);

      expect(prefix.attributes('role')).toBeUndefined();
      expect(prefix.attributes('tabindex')).toBeUndefined();
      expect(prefix.attributes('aria-label')).toBeUndefined();
    });
  });

  describe('pointer interactions', () => {
    it('should move the value to where the rail was pressed', async () => {
      const wrapper = mount(MznSlider, {
        props: { onChange: () => {}, value: 0 },
      });

      await wrapper.get(`.${classes.rail}`).trigger('mousedown', {
        clientX: 30,
      });

      expect(wrapper.emitted('change')).toEqual([[30]]);
    });

    it('should ignore a rail press when nothing listens for the change', async () => {
      const wrapper = mount(MznSlider, { props: { value: 0 } });

      await wrapper.get(`.${classes.rail}`).trigger('mousedown', {
        clientX: 30,
      });

      expect(wrapper.emitted('change')).toBeUndefined();
      expect(wrapper.get(`.${classes.handler}`).classes()).not.toContain(
        classes.handlerActive,
      );
    });

    it('should drag the pressed handle and keep the pair sorted', async () => {
      const wrapper = mount(MznSlider, {
        props: { onChange: () => {}, value: [20, 30] },
      });
      const [start] = wrapper.findAll(`.${classes.handler}`);

      await start.trigger('mousedown');
      await nextTick();

      expect(wrapper.findAll(`.${classes.handler}`)[0].classes()).toContain(
        classes.handlerActive,
      );

      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 50 }));

      expect(wrapper.emitted('change')).toEqual([[[30, 50]]]);

      document.dispatchEvent(new MouseEvent('mouseup'));
      await nextTick();

      expect(wrapper.findAll(`.${classes.handler}`)[0].classes()).not.toContain(
        classes.handlerActive,
      );
    });
  });

  describe('prop: withInput', () => {
    it('should render one input for a single value and two for a range', () => {
      const single = mount(MznSlider, {
        props: { value: 50, withInput: true },
      });
      const range = mount(MznSlider, {
        props: { value: [20, 70], withInput: true },
      });

      expect(single.findAll('input')).toHaveLength(1);
      expect((single.get('input').element as HTMLInputElement).value).toBe(
        '50',
      );
      expect(range.findAll('input')).toHaveLength(2);
      expect(
        range.findAll('input').map((input) => input.element.value),
      ).toEqual(['20', '70']);
    });

    it('should submit a typed value on Enter, clamped to min…max', async () => {
      const wrapper = mount(MznSlider, {
        props: { onChange: () => {}, value: 50, withInput: true },
      });
      const input = wrapper.get('input');

      await input.setValue('140');
      await input.trigger('keydown', { code: 'Enter' });

      expect(wrapper.emitted('change')).toEqual([[100]]);
    });

    it('should submit a typed value on blur', async () => {
      const wrapper = mount(MznSlider, {
        props: { onChange: () => {}, value: 50, withInput: true },
      });
      const input = wrapper.get('input');

      await input.setValue('30');
      await input.trigger('blur');

      expect(wrapper.emitted('change')).toEqual([[30]]);
    });

    it('should keep the pair ordered when the start input is submitted', async () => {
      const wrapper = mount(MznSlider, {
        props: { onChange: () => {}, value: [20, 70], withInput: true },
      });
      const [start] = wrapper.findAll('input');

      await start.setValue('30');
      await start.trigger('keydown', { code: 'Enter' });

      expect(wrapper.emitted('change')).toEqual([[[30, 70]]]);
    });

    it('should sort a range whose end input crossed the start', async () => {
      const wrapper = mount(MznSlider, {
        props: { onChange: () => {}, value: [20, 70], withInput: true },
      });
      const [, end] = wrapper.findAll('input');

      await end.setValue('10');
      await end.trigger('keydown', { code: 'Enter' });

      expect(wrapper.emitted('change')).toEqual([[[10, 20]]]);
    });

    it('should restore the typed value on Escape', async () => {
      const wrapper = mount(MznSlider, {
        props: { onChange: () => {}, value: 50, withInput: true },
      });
      const input = wrapper.get('input');

      await input.setValue('30');
      await input.trigger('keydown', { code: 'Escape' });

      expect(wrapper.emitted('change')).toBeUndefined();
      expect((input.element as HTMLInputElement).value).toBe('50');
    });

    it('should pass the disabled state down to the input', () => {
      const wrapper = mount(MznSlider, {
        props: {
          disabled: true,
          onChange: () => {},
          value: 50,
          withInput: true,
        },
      });

      expect(wrapper.get('input').attributes('disabled')).toBeDefined();
    });

    it('should leave the input inert without a change listener', async () => {
      const wrapper = mount(MznSlider, {
        props: { value: 50, withInput: true },
      });
      const input = wrapper.get('input');

      await input.setValue('30');
      await input.trigger('keydown', { code: 'Enter' });
      await input.trigger('blur');

      expect(wrapper.emitted('change')).toBeUndefined();
    });
  });
});
