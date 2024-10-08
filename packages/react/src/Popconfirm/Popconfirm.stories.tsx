import { StoryFn, Meta } from '@storybook/react';
import { MouseEvent, useState } from 'react';
import { NotificationData } from '..';
import Button from '../Button';
import { PopperPlacement } from '../Popper';
import Popconfirm from './Popconfirm';

export default {
  title: 'Feedback/Popconfirm',
} as Meta;

export const Playground: StoryFn<NotificationData> = ({ ...props }) => {
  const [currentPlacement, setCurrentPlacement] =
    useState<PopperPlacement>('top');
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  const onClose = () => setAnchor(null);
  const renderButton = (placement: PopperPlacement) => (
    <Button
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setCurrentPlacement(placement);
        setAnchor(anchor === event.currentTarget ? null : event.currentTarget);
      }}
      variant="contained"
    >
      {placement}
    </Button>
  );

  return (
    <div
      style={{
        width: '100%',
        marginTop: 120,
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(5, max-content)',
        gridAutoRows: 'minmax(min-content, max-content)',
        gap: 30,
        justifyContent: 'center',
      }}
    >
      <Popconfirm
        {...props}
        anchor={anchor}
        open={Boolean(anchor)}
        onCancel={onClose}
        onConfirm={onClose}
        onClose={onClose}
        options={{
          placement: currentPlacement,
        }}
      />
      <div />
      {renderButton('top-start')}
      {renderButton('top')}
      {renderButton('top-end')}
      <div />
      {renderButton('left-start')}
      <div />
      <div />
      <div />
      {renderButton('right-start')}
      {renderButton('left')}
      <div />
      <div />
      <div />
      {renderButton('right')}
      {renderButton('left-end')}
      <div />
      <div />
      <div />
      {renderButton('right-end')}
      <div />
      {renderButton('bottom-start')}
      {renderButton('bottom')}
      {renderButton('bottom-end')}
      <div />
    </div>
  );
};

Playground.args = {
  cancelText: 'No',
  confirmText: 'Yes',
  title: 'Are you sure to delete this task?',
};
