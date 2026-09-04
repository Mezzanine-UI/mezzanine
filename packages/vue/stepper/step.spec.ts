import { mount } from '@vue/test-utils';
import { stepClasses as classes } from '@mezzanine-ui/core/stepper';
import MznStep from './step.vue';
import type { StepProps } from './step.types';

const renderStep = (
  props: StepProps = {},
  attrs: Record<string, unknown> = {},
) => mount(MznStep, { attrs, props: { title: 'step', ...props } });

describe('MznStep', () => {
  it('should render the title and no description by default', () => {
    const wrapper = renderStep();

    expect(wrapper.get(`.${classes.title}`).text()).toBe('step');
    expect(wrapper.find(`.${classes.description}`).exists()).toBe(false);
  });

  it('should render the description when given', () => {
    const wrapper = renderStep({ description: 'why' });

    expect(wrapper.get(`.${classes.description}`).text()).toBe('why');
  });

  describe('status', () => {
    it.each([
      ['processing', classes.processing],
      ['pending', classes.pending],
      ['succeeded', classes.succeeded],
    ] as const)('should apply the %s class', (status, expected) => {
      expect(renderStep({ status }).classes()).toContain(expected);
    });

    it('should mark an error outside processing', () => {
      const wrapper = renderStep({ error: true, status: 'succeeded' });

      expect(wrapper.classes()).toContain(classes.error);
      expect(wrapper.classes()).not.toContain(classes.succeeded);
    });

    it('should mark a processing error separately', () => {
      const wrapper = renderStep({ error: true, status: 'processing' });

      expect(wrapper.classes()).toContain(classes.processingError);
      expect(wrapper.classes()).not.toContain(classes.error);
    });
  });

  describe('indicator', () => {
    it('should render an icon for the number type', () => {
      const wrapper = renderStep({ index: 2, type: 'number' });

      expect(wrapper.find(`i.${classes.statusIndicator}`).exists()).toBe(true);
      expect(wrapper.find(`.${classes.statusIndicatorDot}`).exists()).toBe(
        false,
      );
    });

    it('should render a dot for the dot type', () => {
      const wrapper = renderStep({ type: 'dot' });

      expect(wrapper.find(`.${classes.statusIndicatorDot}`).exists()).toBe(
        true,
      );
      expect(wrapper.find(`i.${classes.statusIndicator}`).exists()).toBe(false);
    });
  });

  describe('interactive', () => {
    it('should stay inert without a click listener', () => {
      const wrapper = renderStep();

      expect(wrapper.classes()).not.toContain(classes.interactive);
      expect(wrapper.attributes('role')).toBeUndefined();
      expect(wrapper.attributes('tabindex')).toBeUndefined();
    });

    it('should become a button when a click listener is bound', () => {
      const wrapper = renderStep({}, { onClick: () => {} });

      expect(wrapper.classes()).toContain(classes.interactive);
      expect(wrapper.attributes('role')).toBe('button');
      expect(wrapper.attributes('tabindex')).toBe('0');
    });

    it.each(['Enter', ' '])('should click on %s', async (key) => {
      const onClick = vi.fn();
      const wrapper = renderStep({}, { onClick });

      await wrapper.trigger('keydown', { key });

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should ignore other keys', async () => {
      const onClick = vi.fn();
      const wrapper = renderStep({}, { onClick });

      await wrapper.trigger('keydown', { key: 'a' });

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  it('should render disabled as a bare boolean attribute', () => {
    // React leaves `disabled` in its rest props, so a div gets `disabled=""`.
    expect(renderStep({ disabled: true }).attributes('disabled')).toBe('');
    expect(renderStep().attributes('disabled')).toBeUndefined();
  });
});
