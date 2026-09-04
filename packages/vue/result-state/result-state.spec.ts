import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { resultStateClasses as classes } from '@mezzanine-ui/core/result-state';
import { buttonClasses, buttonGroupClasses } from '@mezzanine-ui/core/button';
import MznButton from '../button/button.vue';
import MznResultState from './result-state.vue';
import type { ResultStateProps } from './result-state.types';

const renderResultState = (
  props: Partial<ResultStateProps> = {},
  children?: unknown[],
) =>
  mount(MznResultState, {
    props: { title: 'done', ...props } as ResultStateProps,
    slots: children ? { default: () => children } : {},
  });

const buttons = (wrapper: ReturnType<typeof renderResultState>) =>
  wrapper.findAll('button');

describe('MznResultState', () => {
  it('should render the title in a heading and no description by default', () => {
    const wrapper = renderResultState();

    expect(wrapper.get(`h3.${classes.title}`).text()).toBe('done');
    expect(wrapper.find(`.${classes.description}`).exists()).toBe(false);
  });

  it('should render the description when given', () => {
    const wrapper = renderResultState({ description: 'all good' });

    expect(wrapper.get(`.${classes.description}`).text()).toBe('all good');
  });

  it.each([
    'information',
    'success',
    'help',
    'warning',
    'error',
    'failure',
  ] as const)('should apply the %s type class', (type) => {
    expect(renderResultState({ type }).classes()).toContain(classes.type(type));
  });

  it.each(['main', 'sub'] as const)('should apply the %s size', (size) => {
    expect(renderResultState({ size }).classes()).toContain(classes.size(size));
  });

  it('should render an icon for the type', () => {
    expect(renderResultState().find(`i.${classes.icon}`).exists()).toBe(true);
  });

  it('should render no action group without actions or children', () => {
    expect(
      renderResultState().find(`.${buttonGroupClasses.host}`).exists(),
    ).toBe(false);
  });

  describe('actions', () => {
    it('should render a single action as the secondary button', () => {
      const wrapper = renderResultState({
        actions: { secondaryButton: { children: 'only' } },
      });

      expect(buttons(wrapper)).toHaveLength(1);
      expect(buttons(wrapper)[0].text()).toBe('only');
      expect(buttons(wrapper)[0].classes()).toContain(
        buttonClasses.variant('base-secondary'),
      );
    });

    it('should render secondary first, then primary', () => {
      const wrapper = renderResultState({
        actions: {
          primaryButton: { children: 'retry' },
          secondaryButton: { children: 'back' },
        },
      });
      const [first, second] = buttons(wrapper);

      expect(first.text()).toBe('back');
      expect(second.text()).toBe('retry');
      expect(second.classes()).toContain(buttonClasses.variant('base-primary'));
    });

    it('should pass the size down to the buttons', () => {
      const wrapper = renderResultState({
        actions: { secondaryButton: { children: 'x' } },
        size: 'sub',
      });

      expect(buttons(wrapper)[0].classes()).toContain(
        buttonClasses.size('sub'),
      );
    });

    it('should keep the action listeners', async () => {
      const onClick = vi.fn();
      const wrapper = renderResultState({
        actions: { secondaryButton: { children: 'x', onClick } },
      });

      await buttons(wrapper)[0].trigger('click');

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should still show actions at sub size, unlike Empty at minor', () => {
      const wrapper = renderResultState({
        actions: { secondaryButton: { children: 'x' } },
        size: 'sub',
      });

      expect(wrapper.find(`.${buttonGroupClasses.host}`).exists()).toBe(true);
    });
  });

  describe('children', () => {
    it('should map one child to secondary and two to secondary then primary', () => {
      const one = renderResultState({}, [h(MznButton, null, () => 'one')]);

      expect(buttons(one)[0].classes()).toContain(
        buttonClasses.variant('base-secondary'),
      );

      const two = renderResultState({}, [
        h(MznButton, null, () => 'one'),
        h(MznButton, null, () => 'two'),
      ]);

      expect(buttons(two)[1].classes()).toContain(
        buttonClasses.variant('base-primary'),
      );
    });

    it('should be ignored when actions are given', () => {
      const wrapper = renderResultState(
        { actions: { secondaryButton: { children: 'from actions' } } },
        [h(MznButton, null, () => 'from children')],
      );

      expect(buttons(wrapper)).toHaveLength(1);
      expect(buttons(wrapper)[0].text()).toBe('from actions');
    });

    it('should warn and drop anything that is not a button', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const wrapper = renderResultState({}, [h('span', 'nope')]);

      expect(buttons(wrapper)).toHaveLength(0);
      expect(warn).toHaveBeenCalledWith(
        'Only Button components are allowed as children of ResultState.',
      );

      warn.mockRestore();
    });
  });
});
