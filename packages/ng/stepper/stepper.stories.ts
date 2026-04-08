import { Component } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { StepOrientation, StepType } from './step.component';
import { MznStepper } from './stepper.component';
import { MznStep } from './step.component';
import { MznStepperState } from './stepper-state';

const orientations: StepOrientation[] = ['horizontal', 'vertical'];
const types: StepType[] = ['number', 'dot'];

const meta: Meta<MznStepper> = {
  title: 'Navigation/Stepper',
  component: MznStepper,
  decorators: [
    moduleMetadata({
      imports: [MznStepper, MznStep],
    }),
  ],
};

export default meta;
type Story = StoryObj<MznStepper>;

export const Status: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: grid; gap: 32px;">
        <p style="font-weight: 600;">Status</p>
        <div style="display: grid; gap: 24px;">
          <mzn-stepper orientation="horizontal" type="number" [currentStep]="2">
            <mzn-step title="succeeded" />
            <mzn-step title="succeeded" />
            <mzn-step title="processing" />
            <mzn-step title="pending" />
          </mzn-stepper>
          <mzn-stepper orientation="horizontal" type="number" [currentStep]="2">
            <mzn-step title="succeeded" />
            <mzn-step title="error" [error]="true" />
            <mzn-step title="processing" />
            <mzn-step title="pending" />
          </mzn-stepper>
          <mzn-stepper orientation="horizontal" type="number" [currentStep]="2">
            <mzn-step title="succeeded" />
            <mzn-step title="error" [error]="true" />
            <mzn-step title="processing-error" [error]="true" />
            <mzn-step title="pending" />
          </mzn-stepper>
          <mzn-stepper orientation="horizontal" type="dot" [currentStep]="2">
            <mzn-step title="succeeded" />
            <mzn-step title="succeeded" />
            <mzn-step title="processing" />
            <mzn-step title="pending" />
          </mzn-stepper>
          <mzn-stepper orientation="horizontal" type="dot" [currentStep]="2">
            <mzn-step title="succeeded" />
            <mzn-step title="error" [error]="true" />
            <mzn-step title="processing" />
            <mzn-step title="pending" />
          </mzn-stepper>
          <mzn-stepper orientation="horizontal" type="dot" [currentStep]="2">
            <mzn-step title="succeeded" />
            <mzn-step title="error" [error]="true" />
            <mzn-step title="processing-error" [error]="true" />
            <mzn-step title="pending" />
          </mzn-stepper>
        </div>
        <div style="display: flex; justify-content: space-around;">
          <mzn-stepper orientation="vertical" type="number" [currentStep]="2">
            <mzn-step title="succeeded" />
            <mzn-step title="succeeded" />
            <mzn-step title="processing" />
            <mzn-step title="pending" />
          </mzn-stepper>
          <mzn-stepper orientation="vertical" type="number" [currentStep]="2">
            <mzn-step title="succeeded" />
            <mzn-step title="error" [error]="true" />
            <mzn-step title="processing" />
            <mzn-step title="pending" />
          </mzn-stepper>
          <mzn-stepper orientation="vertical" type="number" [currentStep]="2">
            <mzn-step title="succeeded" />
            <mzn-step title="error" [error]="true" />
            <mzn-step title="processing-error" [error]="true" />
            <mzn-step title="pending" />
          </mzn-stepper>
        </div>
        <div style="display: flex; justify-content: space-around;">
          <mzn-stepper orientation="vertical" type="dot" [currentStep]="2">
            <mzn-step title="succeeded" />
            <mzn-step title="succeeded" />
            <mzn-step title="processing" />
            <mzn-step title="pending" />
          </mzn-stepper>
          <mzn-stepper orientation="vertical" type="dot" [currentStep]="2">
            <mzn-step title="succeeded" />
            <mzn-step title="error" [error]="true" />
            <mzn-step title="processing" />
            <mzn-step title="pending" />
          </mzn-stepper>
          <mzn-stepper orientation="vertical" type="dot" [currentStep]="2">
            <mzn-step title="succeeded" />
            <mzn-step title="error" [error]="true" />
            <mzn-step title="processing-error" [error]="true" />
            <mzn-step title="pending" />
          </mzn-stepper>
        </div>
      </div>
    `,
  }),
};

export const Playground: Story = {
  argTypes: {
    currentStep: {
      control: {
        type: 'range',
        min: 0,
        max: 3,
        step: 1,
      },
      description: 'The current active step index (zero-based).',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    orientation: {
      options: orientations,
      control: { type: 'select' },
      description: 'The layout orientation of the stepper.',
      table: {
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: "'horizontal'" },
      },
    },
    type: {
      options: types,
      control: { type: 'select' },
      description: 'The indicator style of the stepper.',
      table: {
        type: { summary: "'number' | 'dot'" },
        defaultValue: { summary: "'number'" },
      },
    },
  },
  args: {
    currentStep: 1,
    orientation: 'horizontal',
    type: 'number',
  },
  render: (args) => ({
    props: args,
    template: `
      <mzn-stepper [currentStep]="currentStep" [orientation]="orientation" [type]="type">
        <mzn-step title="步驟一" description="請輸入基本資訊" />
        <mzn-step title="步驟二" description="核對填寫資料" />
        <mzn-step title="步驟三" description="完成送出" />
        <mzn-step title="步驟四" />
      </mzn-stepper>
    `,
  }),
};

/**
 * `MznStepperState` 對應 React 版 `useStepper` hook，
 * 提供 `nextStep`、`prevStep`、`goToStep` 等導航方法，
 * 以及 `isFirstStep`、`isLastStep` 邊界旗標。
 */
@Component({
  selector: 'mzn-stepper-with-navigation-demo',
  standalone: true,
  imports: [MznStepper, MznStep],
  template: `
    <div style="display: grid; gap: 32px;">
      <div style="display: grid; gap: 24px;">
        <p style="font-weight: 600;">currentStep: {{ state.currentStep() }}</p>
        <div style="display: flex; gap: 8px;">
          <button (click)="state.prevStep()" [disabled]="state.isFirstStep()"
            >Prev</button
          >
          <button (click)="state.nextStep()" [disabled]="state.isLastStep()"
            >Next</button
          >
        </div>
      </div>
      <div style="display: grid; gap: 24px;">
        <mzn-stepper
          orientation="horizontal"
          type="number"
          [currentStep]="state.currentStep()"
        >
          <mzn-step title="步驟一" description="請輸入基本資訊" />
          <mzn-step title="步驟二" description="核對填寫資料" />
          <mzn-step title="步驟三" description="完成送出" />
          <mzn-step title="步驟四" />
        </mzn-stepper>
        <mzn-stepper
          orientation="horizontal"
          type="dot"
          [currentStep]="state.currentStep()"
        >
          <mzn-step title="步驟一" description="請輸入基本資訊" />
          <mzn-step title="步驟二" description="核對填寫資料" />
          <mzn-step title="步驟三" description="完成送出" />
          <mzn-step title="步驟四" />
        </mzn-stepper>
      </div>
      <div style="display: flex; justify-content: space-around;">
        <mzn-stepper
          orientation="vertical"
          type="number"
          [currentStep]="state.currentStep()"
        >
          <mzn-step title="步驟一" description="請輸入基本資訊" />
          <mzn-step title="步驟二" description="核對填寫資料" />
          <mzn-step title="步驟三" description="完成送出" />
          <mzn-step title="步驟四" />
        </mzn-stepper>
        <mzn-stepper
          orientation="vertical"
          type="dot"
          [currentStep]="state.currentStep()"
        >
          <mzn-step title="步驟一" description="請輸入基本資訊" />
          <mzn-step title="步驟二" description="核對填寫資料" />
          <mzn-step title="步驟三" description="完成送出" />
          <mzn-step title="步驟四" />
        </mzn-stepper>
      </div>
    </div>
  `,
})
class WithNavigationDemoComponent {
  readonly state = new MznStepperState({ totalSteps: 4, defaultStep: 0 });
}

export const WithNavigation: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({
      imports: [WithNavigationDemoComponent],
    }),
  ],
  render: () => ({
    template: `<mzn-stepper-with-navigation-demo />`,
  }),
};
