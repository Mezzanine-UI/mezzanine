import { Component } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznStepper } from './stepper.component';
import { MznStep } from './step.component';
import { MznButton, MznButtonGroup } from '@mezzanine-ui/ng/button';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import { MznStepperState } from './stepper-state';

const meta: Meta<MznStepper> = {
  title: 'Navigation/Stepper',
  component: MznStepper,
  decorators: [
    moduleMetadata({
      imports: [MznStepper, MznStep, MznTypography],
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
        <h3 mznTypography variant="h3">Status</h3>
        <div style="display: grid; gap: 24px;">
          <div mznStepper orientation="horizontal" type="number" [currentStep]="2">
            <div mznStep title="succeeded" ></div>
            <div mznStep title="succeeded" ></div>
            <div mznStep title="processing" ></div>
            <div mznStep title="pending" ></div>
          </div>
          <div mznStepper orientation="horizontal" type="number" [currentStep]="2">
            <div mznStep title="succeeded" ></div>
            <div mznStep title="error" [error]="true" ></div>
            <div mznStep title="processing" ></div>
            <div mznStep title="pending" ></div>
          </div>
          <div mznStepper orientation="horizontal" type="number" [currentStep]="2">
            <div mznStep title="succeeded" ></div>
            <div mznStep title="error" [error]="true" ></div>
            <div mznStep title="processing-error" [error]="true" ></div>
            <div mznStep title="pending" ></div>
          </div>
          <div mznStepper orientation="horizontal" type="dot" [currentStep]="2">
            <div mznStep title="succeeded" ></div>
            <div mznStep title="succeeded" ></div>
            <div mznStep title="processing" ></div>
            <div mznStep title="pending" ></div>
          </div>
          <div mznStepper orientation="horizontal" type="dot" [currentStep]="2">
            <div mznStep title="succeeded" ></div>
            <div mznStep title="error" [error]="true" ></div>
            <div mznStep title="processing" ></div>
            <div mznStep title="pending" ></div>
          </div>
          <div mznStepper orientation="horizontal" type="dot" [currentStep]="2">
            <div mznStep title="succeeded" ></div>
            <div mznStep title="error" [error]="true" ></div>
            <div mznStep title="processing-error" [error]="true" ></div>
            <div mznStep title="pending" ></div>
          </div>
        </div>
        <div style="display: flex; justify-content: space-around;">
          <div mznStepper orientation="vertical" type="number" [currentStep]="2">
            <div mznStep title="succeeded" ></div>
            <div mznStep title="succeeded" ></div>
            <div mznStep title="processing" ></div>
            <div mznStep title="pending" ></div>
          </div>
          <div mznStepper orientation="vertical" type="number" [currentStep]="2">
            <div mznStep title="succeeded" ></div>
            <div mznStep title="error" [error]="true" ></div>
            <div mznStep title="processing" ></div>
            <div mznStep title="pending" ></div>
          </div>
          <div mznStepper orientation="vertical" type="number" [currentStep]="2">
            <div mznStep title="succeeded" ></div>
            <div mznStep title="error" [error]="true" ></div>
            <div mznStep title="processing-error" [error]="true" ></div>
            <div mznStep title="pending" ></div>
          </div>
        </div>
        <div style="display: flex; justify-content: space-around;">
          <div mznStepper orientation="vertical" type="dot" [currentStep]="2">
            <div mznStep title="succeeded" ></div>
            <div mznStep title="succeeded" ></div>
            <div mznStep title="processing" ></div>
            <div mznStep title="pending" ></div>
          </div>
          <div mznStepper orientation="vertical" type="dot" [currentStep]="2">
            <div mznStep title="succeeded" ></div>
            <div mznStep title="error" [error]="true" ></div>
            <div mznStep title="processing" ></div>
            <div mznStep title="pending" ></div>
          </div>
          <div mznStepper orientation="vertical" type="dot" [currentStep]="2">
            <div mznStep title="succeeded" ></div>
            <div mznStep title="error" [error]="true" ></div>
            <div mznStep title="processing-error" [error]="true" ></div>
            <div mznStep title="pending" ></div>
          </div>
        </div>
      </div>
    `,
  }),
};

@Component({
  selector: 'mzn-stepper-playground-demo',
  standalone: true,
  imports: [MznStepper, MznStep, MznTypography, MznButton, MznButtonGroup],
  template: `
    <div style="display: grid; gap: 32px;">
      <div style="display: grid; gap: 24px;">
        <h3 mznTypography variant="h3"
          >currentStep: {{ state.currentStep() }}</h3
        >
        <div mznButtonGroup color="primary">
          <button mznButton (click)="state.prevStep()">Prev</button>
          <button mznButton (click)="state.nextStep()">Next</button>
        </div>
      </div>

      <br />

      <div style="display: grid; gap: 24px;">
        <div
          mznStepper
          orientation="horizontal"
          type="number"
          [currentStep]="state.currentStep()"
        >
          <div
            mznStep
            title="步驟一"
            description="步驟一敘述"
            [interactive]="true"
            (click)="onStepClick(1)"
          ></div>
          <div
            mznStep
            title="步驟二"
            description="步驟二敘述"
            [interactive]="true"
            (click)="onStepClick(2)"
          ></div>
          <div
            mznStep
            title="步驟三"
            description="步驟三敘述"
            [interactive]="true"
            (click)="onStepClick(3)"
          ></div>
          <div
            mznStep
            title="步驟一"
            description="步驟一敘述"
            [interactive]="true"
            (click)="onStepClick(4)"
          ></div>
        </div>
        <div
          mznStepper
          orientation="horizontal"
          type="dot"
          [currentStep]="state.currentStep()"
        >
          <div
            mznStep
            title="步驟一"
            description="步驟一敘述"
            [interactive]="true"
            (click)="onStepClick(1)"
          ></div>
          <div
            mznStep
            title="步驟二"
            description="步驟二敘述"
            [interactive]="true"
            (click)="onStepClick(2)"
          ></div>
          <div
            mznStep
            title="步驟三"
            description="步驟三敘述"
            [interactive]="true"
            (click)="onStepClick(3)"
          ></div>
          <div
            mznStep
            title="步驟一"
            description="步驟一敘述"
            [interactive]="true"
            (click)="onStepClick(4)"
          ></div>
        </div>
      </div>

      <br />

      <div style="display: flex; justify-content: space-around;">
        <div
          mznStepper
          orientation="vertical"
          type="number"
          [currentStep]="state.currentStep()"
        >
          <div
            mznStep
            title="步驟一"
            description="步驟一敘述"
            [interactive]="true"
            (click)="onStepClick(1)"
          ></div>
          <div
            mznStep
            title="步驟二"
            description="步驟二敘述"
            [interactive]="true"
            (click)="onStepClick(2)"
          ></div>
          <div
            mznStep
            title="步驟三"
            description="步驟三敘述"
            [interactive]="true"
            (click)="onStepClick(3)"
          ></div>
          <div
            mznStep
            title="步驟一"
            description="步驟一敘述"
            [interactive]="true"
            (click)="onStepClick(4)"
          ></div>
        </div>
        <div
          mznStepper
          orientation="vertical"
          type="dot"
          [currentStep]="state.currentStep()"
        >
          <div
            mznStep
            title="步驟一"
            description="步驟一敘述"
            [interactive]="true"
            (click)="onStepClick(1)"
          ></div>
          <div
            mznStep
            title="步驟二"
            description="步驟二敘述"
            [interactive]="true"
            (click)="onStepClick(2)"
          ></div>
          <div
            mznStep
            title="步驟三"
            description="步驟三敘述"
            [interactive]="true"
            (click)="onStepClick(3)"
          ></div>
          <div
            mznStep
            title="步驟一"
            description="步驟一敘述"
            [interactive]="true"
            (click)="onStepClick(4)"
          ></div>
        </div>
      </div>
    </div>
  `,
})
class PlaygroundDemoComponent {
  readonly state = new MznStepperState({ totalSteps: 4, defaultStep: 0 });

  onStepClick(step: number): void {
    // eslint-disable-next-line no-console
    console.log(`Clicked step ${step}`);
  }
}

export const Playground: Story = {
  args: {
    stepCount: 4,
  } as Record<string, unknown>,
  argTypes: {},
  decorators: [
    moduleMetadata({
      imports: [PlaygroundDemoComponent],
    }),
  ],
  render: () => ({
    template: `<mzn-stepper-playground-demo />`,
  }),
};
