import { useState } from 'react';
import { Meta } from '@storybook/react';
import Button from '../Button';
import { PopperPlacement } from '../Popper';
import Popover from '.';

export default {
  title: 'Utility/Popover',
} as Meta;

export const Placement = () => {
  const [currentPlacement, setCurrentPlacement] = useState<PopperPlacement>('top');
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  const renderButton = (placement: PopperPlacement) => (
    <Button
      onClick={(event) => {
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
        marginTop: 50,
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(5, max-content)',
        gridAutoRows: 'minmax(min-content, max-content)',
        gap: 30,
        justifyContent: 'center',
      }}
    >
      <Popover
        anchor={anchor}
        onClose={() => setAnchor(null)}
        open={Boolean(anchor)}
        options={{
          placement: currentPlacement,
        }}
        title="Title"
      >
        Content
      </Popover>
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
