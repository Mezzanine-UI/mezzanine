import { Meta } from '@storybook/react-webpack5';
import { useEffect } from 'react';
import Button, { ButtonGroup } from '../Button';
import Message from '.';

export default {
  title: 'Feedback/Message',
} as Meta;

function createRandomNumber() {
  return Math.floor(Math.random() ** 7 * 1000000);
}

export const Basic = () => {
  useEffect(() => () => Message.destroy(), []);

  return (
    <ButtonGroup orientation="vertical">
      <Button
        variant="contained"
        onClick={() => {
          Message.add({
            children: `${createRandomNumber()}`,
          });
        }}
      >
        add
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          Message.success(`${createRandomNumber()}`);
        }}
      >
        success
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          Message.warning(`${createRandomNumber()}`);
        }}
      >
        warning
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          Message.error(`${createRandomNumber()}`);
        }}
      >
        error
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          Message.info(`${createRandomNumber()}`);
        }}
      >
        info
      </Button>
    </ButtonGroup>
  );
};
