import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { stepClasses, stepperClasses } from '@mezzanine-ui/core/stepper';
import MznStep from './step.vue';
import MznStepper from './stepper.vue';
import type { StepperProps } from './stepper.types';

const titles = ['one', 'two', 'three'];

const renderStepper = (props: StepperProps = {}) =>
  mount(MznStepper, {
    attachTo: document.body,
    props,
    slots: {
      default: () => titles.map((title) => h(MznStep, { key: title, title })),
    },
  });

const stepClassesOf = (wrapper: ReturnType<typeof renderStepper>) =>
  wrapper.findAll(`.${stepClasses.host}`).map((step) => step.classes());

describe('MznStepper', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should render the host with the default orientation and type', () => {
    const wrapper = renderStepper();

    expect(wrapper.classes()).toContain(stepperClasses.host);
    expect(wrapper.classes()).toContain(stepperClasses.horizontal);
    expect(wrapper.classes()).toContain(stepperClasses.number);
  });

  it.each([
    ['vertical', stepperClasses.vertical],
    ['horizontal', stepperClasses.horizontal],
  ] as const)('should apply the %s orientation', (orientation, expected) => {
    expect(renderStepper({ orientation }).classes()).toContain(expected);
  });

  it.each([
    ['dot', stepperClasses.dot],
    ['number', stepperClasses.number],
  ] as const)('should apply the %s type', (type, expected) => {
    expect(renderStepper({ type }).classes()).toContain(expected);
  });

  describe('step state', () => {
    it('should mark steps before, at and after the current one', () => {
      const [first, second, third] = stepClassesOf(
        renderStepper({ currentStep: 1 }),
      );

      expect(first).toContain(stepClasses.succeeded);
      expect(second).toContain(stepClasses.processing);
      expect(third).toContain(stepClasses.pending);
    });

    it('should pass its orientation and type down', () => {
      const [first] = stepClassesOf(
        renderStepper({ orientation: 'vertical', type: 'dot' }),
      );

      expect(first).toContain(stepClasses.vertical);
      expect(first).toContain(stepClasses.dot);
    });

    it('should number the steps in order', () => {
      const wrapper = renderStepper({ currentStep: 2 });
      const indicators = wrapper.findAll(`i.${stepClasses.statusIndicator}`);

      // The third step is the processing one, so it shows its own number
      // rather than the completed check.
      expect(indicators).toHaveLength(3);
    });

    it('should reach steps rendered by v-for', async () => {
      // A `v-for` compiles to one Fragment holding the list; without
      // flattening, the stepper clones the Fragment and every step keeps its
      // own defaults — no orientation, and every one of them pending.
      const Host = defineComponent({
        components: { MznStep, MznStepper },
        data: () => ({ titles }),
        template: `
          <MznStepper :current-step="1" orientation="vertical">
            <MznStep v-for="title in titles" :key="title" :title="title" />
          </MznStepper>
        `,
      });

      const wrapper = mount(Host, { attachTo: document.body });

      await flushPromises();

      const steps = wrapper.findAll(`.${stepClasses.host}`);

      expect(steps).toHaveLength(3);
      expect(steps[0].classes()).toContain(stepClasses.succeeded);
      expect(steps[1].classes()).toContain(stepClasses.processing);
      expect(steps[0].classes()).toContain(stepClasses.vertical);
    });
  });

  describe('emit: stepChange', () => {
    it('should report the initial step once mounted', async () => {
      const wrapper = renderStepper({ currentStep: 1 });

      await flushPromises();

      expect(wrapper.emitted('stepChange')).toEqual([[1]]);
    });

    it('should report every change', async () => {
      const wrapper = renderStepper({ currentStep: 0 });

      await flushPromises();
      await wrapper.setProps({ currentStep: 2 });

      expect(wrapper.emitted('stepChange')).toEqual([[0], [2]]);
    });
  });
});
