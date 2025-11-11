import { Meta, StoryFn } from '@storybook/react-webpack5';
import Stepper from './Stepper';
import Step from './Step';
import Typography from '../Typography';
import Button, { ButtonGroup } from '../Button';
import { useStepper } from './useStepper';

export default {
  title: 'Navigation/Stepper',
} as Meta;

const exampleSteps = ['步驟一', '步驟二', '步驟三'];
const exampleStepsDescription = ['步驟一敘述', '步驟二敘述', '步驟三敘述'];

interface PlaygroundArgs {
  stepCount: number;
}

export const Status = () => (
  <div
    style={{
      display: 'grid',
      gap: '32px',
    }}
  >
    <Typography variant="h3">{`Status`}</Typography>

    <div
      style={{
        display: 'grid',
        gap: '24px',
      }}
    >
      <Stepper orientation="horizontal" type="number" currentStep={0}>
        <Step title={'processing'} status="processing" />
        <Step title={'pending'} status="pending" />
        <Step title={'succeeded'} status="succeeded" />
        <Step title={'error'} error />
        <Step title={'disabled'} disabled />
      </Stepper>
      <Stepper orientation="horizontal" type="dot" currentStep={0}>
        <Step title={'processing'} status="processing" />
        <Step title={'pending'} status="pending" />
        <Step title={'succeeded'} status="succeeded" />
        <Step title={'error'} error />
        <Step title={'disabled'} disabled />
      </Stepper>
    </div>

    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
      }}
    >
      <Stepper orientation="vertical" type="number" currentStep={0}>
        <Step title={'processing'} status="processing" />
        <Step title={'pending'} status="pending" />
        <Step title={'succeeded'} status="succeeded" />
        <Step title={'error'} error />
        <Step title={'disabled'} disabled />
      </Stepper>
      <Stepper orientation="vertical" type="dot" currentStep={0}>
        <Step title={'processing'} status="processing" />
        <Step title={'pending'} status="pending" />
        <Step title={'succeeded'} status="succeeded" />
        <Step title={'error'} error />
        <Step title={'disabled'} disabled />
      </Stepper>
    </div>
  </div>
);

export const Playground: StoryFn<PlaygroundArgs> = ({ stepCount }) => {
  const { currentStep, nextStep, prevStep } = useStepper({
    defaultStep: 0,
    totalSteps: Math.max(stepCount, 0),
  });

  const storyStepCount = Math.max(stepCount, 0);

  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      {/* step controller */}
      <div style={{ display: 'grid', gap: '24px' }}>
        <Typography variant="h3">{`currentStep: ${currentStep}`}</Typography>
        <ButtonGroup color="primary">
          <Button onClick={prevStep}>Prev</Button>
          <Button onClick={nextStep}>Next</Button>
        </ButtonGroup>
      </div>

      <br />

      <div
        style={{
          display: 'grid',
          gap: '24px',
        }}
      >
        <Stepper
          orientation="horizontal"
          type="number"
          onStepChange={(stepIndex) =>
            // eslint-disable-next-line no-console
            console.log(`Horizontal Number Step Changed: ${stepIndex}`)
          }
          currentStep={currentStep}
        >
          {Array.from(Array(storyStepCount)).map((_, idx) => (
            <Step
              key={exampleSteps[idx % 3] + idx.toString()}
              title={exampleSteps[idx % 3]}
              description={exampleStepsDescription[idx % 3]}
              onClick={() => alert(`Clicked step ${idx + 1}`)}
            />
          ))}
        </Stepper>

        <Stepper orientation="horizontal" type="dot" currentStep={currentStep}>
          {Array.from(Array(storyStepCount)).map((_, idx) => (
            <Step
              key={exampleSteps[idx % 3] + idx.toString()}
              title={exampleSteps[idx % 3]}
              description={exampleStepsDescription[idx % 3]}
              onClick={() => alert(`Clicked step ${idx + 1}`)}
            />
          ))}
        </Stepper>
      </div>

      <br />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
        }}
      >
        <Stepper orientation="vertical" type="number" currentStep={currentStep}>
          {Array.from(Array(storyStepCount)).map((_, idx) => (
            <Step
              key={exampleSteps[idx % 3] + idx.toString()}
              title={exampleSteps[idx % 3]}
              description={exampleStepsDescription[idx % 3]}
              onClick={() => alert(`Clicked step ${idx + 1}`)}
            />
          ))}
        </Stepper>

        <Stepper orientation="vertical" type="dot" currentStep={currentStep}>
          {Array.from(Array(storyStepCount)).map((_, idx) => (
            <Step
              key={exampleSteps[idx % 3] + idx.toString()}
              title={exampleSteps[idx % 3]}
              description={exampleStepsDescription[idx % 3]}
              onClick={() => alert(`Clicked step ${idx + 1}`)}
            />
          ))}
        </Stepper>
      </div>
    </div>
  );
};

Playground.args = {
  stepCount: 4,
};

Playground.argTypes = {};
