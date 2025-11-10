import { Meta, StoryFn } from '@storybook/react-webpack5';
import { useState } from 'react';
import Stepper from './Stepper';
import Step from './Step';
import Typography from '../Typography';
import Button, { ButtonGroup } from '../Button';

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
      <Stepper orientation="horizontal" type="number" processingStep={1}>
        <Step title={'processing'} status="processing" />
        <Step title={'pending'} status="pending" />
        <Step title={'succeeded'} status="succeeded" />
        <Step title={'error'} status="error" />
        <Step title={'disabled'} status="disabled" />
      </Stepper>
      <Stepper orientation="horizontal" type="dot" processingStep={1}>
        <Step title={'processing'} status="processing" />
        <Step title={'pending'} status="pending" />
        <Step title={'succeeded'} status="succeeded" />
        <Step title={'error'} status="error" />
        <Step title={'disabled'} status="disabled" />
      </Stepper>
    </div>

    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
      }}
    >
      <Stepper orientation="vertical" type="number" processingStep={1}>
        <Step title={'processing'} status="processing" />
        <Step title={'pending'} status="pending" />
        <Step title={'succeeded'} status="succeeded" />
        <Step title={'error'} status="error" />
        <Step title={'disabled'} status="disabled" />
      </Stepper>
      <Stepper orientation="vertical" type="dot" processingStep={1}>
        <Step title={'processing'} status="processing" />
        <Step title={'pending'} status="pending" />
        <Step title={'succeeded'} status="succeeded" />
        <Step title={'error'} status="error" />
        <Step title={'disabled'} status="disabled" />
      </Stepper>
    </div>
  </div>
);

export const Playground: StoryFn<PlaygroundArgs> = ({ stepCount }) => {
  const [current, setCurrent] = useState(1);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const storyStepCount = Math.max(stepCount, 0);

  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      {/* step controller */}
      <div style={{ display: 'grid', gap: '24px' }}>
        <Typography variant="h3">{`processingStep: ${current}`}</Typography>
        <ButtonGroup color="primary">
          <Button onClick={prev}>Prev</Button>
          <Button onClick={next}>Next</Button>
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
          processingStep={current}
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
        <Stepper orientation="horizontal" type="dot" processingStep={current}>
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
        <Stepper orientation="vertical" type="number" processingStep={current}>
          {Array.from(Array(storyStepCount)).map((_, idx) => (
            <Step
              key={exampleSteps[idx % 3] + idx.toString()}
              title={exampleSteps[idx % 3]}
              description={exampleStepsDescription[idx % 3]}
              onClick={() => alert(`Clicked step ${idx + 1}`)}
            />
          ))}
        </Stepper>
        <Stepper orientation="vertical" type="dot" processingStep={current}>
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
