import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, h } from 'vue';
import MznButton from '../button/button.vue';
import MznButtonGroup from '../button/button-group.vue';
import MznTypography from '../typography/typography.vue';
import MznStep from './step.vue';
import MznStepper from './stepper.vue';
import { useStepper } from './use-stepper';

export default {
  title: 'Navigation/Stepper',
} as Meta;

const exampleSteps = ['步驟一', '步驟二', '步驟三'];
const exampleStepsDescription = ['步驟一敘述', '步驟二敘述', '步驟三敘述'];

interface PlaygroundArgs {
  stepCount: number;
}

const MockStepperExamples = {
  components: { MznStep, MznStepper },
  props: {
    currentStep: { type: Number, default: 0 },
    orientation: { type: String, default: 'horizontal' },
    type: { type: String, default: 'number' },
  },
  template: `
    <MznStepper :current-step="currentStep" :orientation="orientation" :type="type">
      <MznStep title="succeeded" />
      <MznStep title="succeeded" />
      <MznStep title="processing" />
      <MznStep title="pending" />
    </MznStepper>
    <MznStepper :current-step="currentStep" :orientation="orientation" :type="type">
      <MznStep title="succeeded" />
      <MznStep title="error" error />
      <MznStep title="processing" />
      <MznStep title="pending" />
    </MznStepper>
    <MznStepper :current-step="currentStep" :orientation="orientation" :type="type">
      <MznStep title="succeeded" />
      <MznStep title="error" error />
      <MznStep title="processing-error" error />
      <MznStep title="pending" />
    </MznStepper>
  `,
};

export const Status: StoryObj = {
  render: () => ({
    components: { MockStepperExamples, MznTypography },
    template: `
      <div style="display: grid; gap: 32px">
        <MznTypography variant="h3">Status</MznTypography>

        <div style="display: grid; gap: 24px">
          <MockStepperExamples orientation="horizontal" type="number" :current-step="2" />
          <MockStepperExamples orientation="horizontal" type="dot" :current-step="2" />
        </div>

        <div style="display: flex; justify-content: space-around">
          <MockStepperExamples orientation="vertical" type="number" :current-step="2" />
        </div>
        <div style="display: flex; justify-content: space-around">
          <MockStepperExamples orientation="vertical" type="dot" :current-step="2" />
        </div>
      </div>
    `,
  }),
};

/**
 * `currentStep: {{ n }}` interleaves text with an interpolation, which JSX
 * emits as two text nodes and a Vue template would merge into one — so it is
 * authored with `h()` (SKILL.md §7).
 */
const CurrentStepHeading = (props: { step: number }) =>
  h(MznTypography, { variant: 'h3' }, () => [`currentStep: ${props.step}`]);

const stepList = (
  count: number,
): { description: string; key: string; title: string }[] =>
  Array.from({ length: count }).map((_, idx) => ({
    description: exampleStepsDescription[idx % 3],
    key: exampleSteps[idx % 3] + idx.toString(),
    title: exampleSteps[idx % 3],
  }));

export const Playground: StoryObj<PlaygroundArgs> = {
  render: (args) => ({
    components: {
      CurrentStepHeading,
      MznButton,
      MznButtonGroup,
      MznStep,
      MznStepper,
    },
    setup: () => {
      const storyStepCount = Math.max(args.stepCount, 0);
      const { currentStep, nextStep, prevStep } = useStepper({
        defaultStep: 0,
        totalSteps: storyStepCount,
      });

      const steps = computed(() => stepList(storyStepCount));

      function onStepChange(stepIndex: number): void {
        // eslint-disable-next-line no-console
        console.log(`Horizontal Number Step Changed: ${stepIndex}`);
      }

      function onStepClick(index: number): void {
        alert(`Clicked step ${index + 1}`);
      }

      return {
        currentStep,
        nextStep,
        onStepChange,
        onStepClick,
        prevStep,
        steps,
      };
    },
    template: `
      <div style="display: grid; gap: 32px">
        <div style="display: grid; gap: 24px">
          <CurrentStepHeading :step="currentStep" />
          <MznButtonGroup color="primary">
            <MznButton @click="prevStep">Prev</MznButton>
            <MznButton @click="nextStep">Next</MznButton>
          </MznButtonGroup>
        </div>

        <br />

        <div style="display: grid; gap: 24px">
          <MznStepper
            orientation="horizontal"
            type="number"
            :current-step="currentStep"
            @step-change="onStepChange"
          >
            <MznStep
              v-for="(step, idx) in steps"
              :key="step.key"
              :title="step.title"
              :description="step.description"
              @click="onStepClick(idx)"
            />
          </MznStepper>

          <MznStepper orientation="horizontal" type="dot" :current-step="currentStep">
            <MznStep
              v-for="(step, idx) in steps"
              :key="step.key"
              :title="step.title"
              :description="step.description"
              @click="onStepClick(idx)"
            />
          </MznStepper>
        </div>

        <br />

        <div style="display: flex; justify-content: space-around">
          <MznStepper orientation="vertical" type="number" :current-step="currentStep">
            <MznStep
              v-for="(step, idx) in steps"
              :key="step.key"
              :title="step.title"
              :description="step.description"
              @click="onStepClick(idx)"
            />
          </MznStepper>

          <MznStepper orientation="vertical" type="dot" :current-step="currentStep">
            <MznStep
              v-for="(step, idx) in steps"
              :key="step.key"
              :title="step.title"
              :description="step.description"
              @click="onStepClick(idx)"
            />
          </MznStepper>
        </div>
      </div>
    `,
  }),
};

Playground.args = {
  stepCount: 4,
};

Playground.argTypes = {};
