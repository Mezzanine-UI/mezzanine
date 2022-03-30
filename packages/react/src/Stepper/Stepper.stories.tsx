import { Meta, Story } from '@storybook/react';
import { useState } from 'react';
import { PlusIcon } from '@mezzanine-ui/icons';
import { IconProps } from '../Icon';
import Stepper from './Stepper';
import Step from './Step';
import Typography from '../Typography';
import Button, { ButtonGroup } from '../Button';

export default {
  title: 'Navigation/Stepper',
} as Meta;

const exampleSteps = ['步驟一', '步驟二', '步驟三'];

export const Basic = () => {
  const completedIconProps : IconProps = { icon: PlusIcon };

  return (
    <Stepper activeStep={1}>
      <Step key="step1" title="step1" />
      <Step key="step2" title="step2" />
      <Step key="step3" title="step3" />
      <Step key="step4" title="step4" completedIconProps={completedIconProps} completed />
    </Stepper>
  );
};

export const State = () => (
  <div style={{
    boxSizing: 'border-box',
    width: '100%',
  }}
  >
    {Array.from(Array(5)).map((_, idx) => (
      <Stepper key={`${idx.toString()}`} activeStep={idx - 1}>
        {exampleSteps.map((label) => (
          <Step key={label} title={label} />
        ))}
      </Stepper>
    ))}
  </div>
);

interface PlaygroundArgs {
  stepCount: number,
  titleVariant: any,
}

export const Playground : Story<PlaygroundArgs> = ({
  stepCount, titleVariant,
}) => {
  const [current, setCurrent] = useState(-1);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const storyStepCount = Math.max(stepCount, 0);

  return (
    <div>
      <Stepper activeStep={current}>
        {Array.from(Array(storyStepCount)).map((_, idx) => (
          <Step
            key={exampleSteps[idx % 3] + idx.toString()}
            title={exampleSteps[idx % 3]}
            titleProps={{ variant: titleVariant }}
          />
        ))}
      </Stepper>
      <Typography align="center" variant="h4">
        activeStepIndex:
        {current}
      </Typography>
      <ButtonGroup
        color="primary"
        variant="contained"
        size="medium"
      >
        <Button onClick={prev}>Prev</Button>
        <Button onClick={next}>Next</Button>
      </ButtonGroup>
    </div>
  );
};

Playground.args = {
  titleVariant: 'button2',
  stepCount: 4,
};

Playground.argTypes = {
  titleVariant: {
    control: {
      type: 'inline-radio',
      options: ['button2', 'button3', 'button4'],
    },
  },
};
