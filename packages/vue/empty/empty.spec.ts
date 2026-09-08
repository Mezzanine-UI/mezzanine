import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { emptyClasses as classes } from '@mezzanine-ui/core/empty';
import { buttonClasses, buttonGroupClasses } from '@mezzanine-ui/core/button';
import MznButton from '../button/button.vue';
import MznEmpty from './empty.vue';
import type { EmptyProps } from './empty.types';

const renderEmpty = (props: Partial<EmptyProps> = {}, children?: unknown[]) =>
  mount(MznEmpty, {
    props: { title: 'nothing here', ...props } as EmptyProps,
    slots: children ? { default: () => children } : {},
  });

const buttons = (wrapper: ReturnType<typeof renderEmpty>) =>
  wrapper.findAll('button');

describe('MznEmpty', () => {
  it('should render the title and no description by default', () => {
    const wrapper = renderEmpty();

    expect(wrapper.get(`.${classes.title}`).text()).toBe('nothing here');
    expect(wrapper.find(`.${classes.description}`).exists()).toBe(false);
  });

  it('should render the description when given', () => {
    const wrapper = renderEmpty({ description: 'try again' });

    expect(wrapper.get(`.${classes.description}`).text()).toBe('try again');
  });

  it.each(['main', 'sub', 'minor'] as const)(
    'should apply the %s size class',
    (size) => {
      expect(renderEmpty({ size }).classes()).toContain(classes.size(size));
    },
  );

  describe('pictogram', () => {
    it('should render the large illustration at main size', () => {
      const wrapper = renderEmpty({ size: 'main', type: 'initial-data' });

      expect(wrapper.find(`svg.${classes.icon}`).exists()).toBe(true);
    });

    it('should render an icon at the smaller sizes', () => {
      const wrapper = renderEmpty({ size: 'sub', type: 'initial-data' });

      expect(wrapper.find(`i.${classes.icon}`).exists()).toBe(true);
      expect(wrapper.find(`svg.${classes.icon}`).exists()).toBe(false);
    });

    it('should render nothing for the custom type without a pictogram', () => {
      const wrapper = renderEmpty({ type: 'custom' });

      expect(wrapper.find(`.${classes.icon}`).exists()).toBe(false);
    });

    it('should render a custom pictogram over the preset one', () => {
      const wrapper = renderEmpty({
        pictogram: h('span', { id: 'custom' }),
        type: 'initial-data',
      });

      expect(wrapper.get(`.${classes.icon}`).find('#custom').exists()).toBe(
        true,
      );
      expect(wrapper.find(`svg.${classes.icon}`).exists()).toBe(false);
    });
  });

  describe('actions', () => {
    it('should render a single action as the secondary button', () => {
      const wrapper = renderEmpty({
        actions: { secondaryButton: { children: 'only' } },
      });

      expect(buttons(wrapper)).toHaveLength(1);
      expect(buttons(wrapper)[0].text()).toBe('only');
      expect(buttons(wrapper)[0].classes()).toContain(
        buttonClasses.variant('base-secondary'),
      );
    });

    it('should render secondary first, then primary', () => {
      const wrapper = renderEmpty({
        actions: {
          primaryButton: { children: 'go' },
          secondaryButton: { children: 'back' },
        },
      });
      const [first, second] = buttons(wrapper);

      expect(first.text()).toBe('back');
      expect(first.classes()).toContain(
        buttonClasses.variant('base-secondary'),
      );
      expect(second.text()).toBe('go');
      expect(second.classes()).toContain(buttonClasses.variant('base-primary'));
    });

    it('should treat a bare object as the secondary button', () => {
      const wrapper = renderEmpty({ actions: { children: 'solo' } });

      expect(buttons(wrapper)).toHaveLength(1);
      expect(buttons(wrapper)[0].classes()).toContain(
        buttonClasses.variant('base-secondary'),
      );
    });

    it('should pass the size down to the buttons', () => {
      const wrapper = renderEmpty({
        actions: { secondaryButton: { children: 'x' } },
        size: 'sub',
      });

      expect(buttons(wrapper)[0].classes()).toContain(
        buttonClasses.size('sub'),
      );
    });

    it('should keep the action listeners', async () => {
      const onClick = vi.fn();
      const wrapper = renderEmpty({
        actions: { secondaryButton: { children: 'x', onClick } },
      });

      await buttons(wrapper)[0].trigger('click');

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should render no action group at minor size', () => {
      const wrapper = renderEmpty({
        actions: { secondaryButton: { children: 'x' } },
        size: 'minor',
      });

      expect(wrapper.find(`.${buttonGroupClasses.host}`).exists()).toBe(false);
    });
  });

  describe('children', () => {
    it('should treat one child as the secondary button', () => {
      const wrapper = renderEmpty({}, [h(MznButton, null, () => 'one')]);

      expect(buttons(wrapper)[0].classes()).toContain(
        buttonClasses.variant('base-secondary'),
      );
    });

    it('should treat the second child as the primary button', () => {
      const wrapper = renderEmpty({}, [
        h(MznButton, null, () => 'one'),
        h(MznButton, null, () => 'two'),
      ]);
      const [first, second] = buttons(wrapper);

      expect(first.classes()).toContain(
        buttonClasses.variant('base-secondary'),
      );
      expect(second.classes()).toContain(buttonClasses.variant('base-primary'));
    });

    it('should warn and drop a third child', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const wrapper = renderEmpty({}, [
        h(MznButton, null, () => 'one'),
        h(MznButton, null, () => 'two'),
        h(MznButton, null, () => 'three'),
      ]);

      expect(buttons(wrapper)).toHaveLength(2);
      expect(warn).toHaveBeenCalled();

      warn.mockRestore();
    });

    it('should warn and drop anything that is not a button', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const wrapper = renderEmpty({}, [h('span', 'not a button')]);

      expect(buttons(wrapper)).toHaveLength(0);
      expect(warn).toHaveBeenCalled();

      warn.mockRestore();
    });

    it('should be ignored when actions are given', () => {
      const wrapper = renderEmpty(
        { actions: { secondaryButton: { children: 'from actions' } } },
        [h(MznButton, null, () => 'from children')],
      );

      expect(buttons(wrapper)).toHaveLength(1);
      expect(buttons(wrapper)[0].text()).toBe('from actions');
    });
  });
});
