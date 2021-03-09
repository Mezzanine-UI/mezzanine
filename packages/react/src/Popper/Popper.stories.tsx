import { MouseEvent, useState } from 'react';
import { Meta } from '@storybook/react';
import Button from '../Button';
import Typography from '../Typography';
import Popper, { PopperPlacement } from '.';

export default {
  title: 'Utility/Popper',
} as Meta;

const demoPopperContent = (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 80,
      padding: 10,
      boxShadow: '0px 2px 4px grey',
      borderRadius: 5,
    }}
  >
    <Typography color="text-primary">
      Content
    </Typography>
  </div>
);

export const Basic = () => {
  const [anchorRef, setAnchorRef] = useState<HTMLButtonElement | null>(null);

  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
      }}
    >
      <Popper
        anchor={anchorRef}
        open={Boolean(anchorRef)}
      >
        {demoPopperContent}
      </Popper>
      <Button
        variant="contained"
        onMouseEnter={(event: MouseEvent<HTMLButtonElement>) => setAnchorRef(event.currentTarget)}
        onMouseLeave={() => setAnchorRef(null)}
      >
        Hover me
      </Button>
      <Button
        variant="contained"
        onClick={(event: MouseEvent<HTMLButtonElement>) => setAnchorRef(
          anchorRef === event.currentTarget ? null : event.currentTarget,
        )}
      >
        Click me
      </Button>
    </div>
  );
};

export const Placement = () => {
  const [popperPlacement, setPopperPlacement] = useState<PopperPlacement>('top');
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  const renderButton = (placement: PopperPlacement) => (
    <Button
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        setPopperPlacement(placement);
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
      <Popper
        anchor={anchor}
        open={Boolean(anchor)}
        options={{
          placement: popperPlacement,
        }}
      >
        {demoPopperContent}
      </Popper>
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
