import { MouseEvent, useState } from 'react';
import { Meta, StoryObj } from '@storybook/react-webpack5';
import { flip, offset, shift } from '@floating-ui/react-dom';
import Button from '../Button';
import Typography from '../Typography';
import Popper, { PopperPlacement } from '.';
import { getCSSVariableValue } from '../utils/get-css-variable-value';

export default {
  title: 'Utility/Popper',
  component: Popper,
} as Meta<typeof Popper>;

type Story = StoryObj<typeof Popper>;

const DemoPopperContent = () => (
  <div
    style={{
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 5,
      boxShadow: '0px 2px 4px grey',
      display: 'flex',
      justifyContent: 'center',
      padding: 10,
      width: 80,
    }}
  >
    <Typography color="text-neutral">Content</Typography>
  </div>
);

const BasicExample = () => {
  const [anchorRef, setAnchorRef] = useState<HTMLButtonElement | null>(null);

  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
      }}
    >
      <Popper anchor={anchorRef} open={Boolean(anchorRef)}>
        <DemoPopperContent />
      </Popper>
      <Button
        onMouseEnter={(event: MouseEvent<HTMLButtonElement>) =>
          setAnchorRef(event.currentTarget)
        }
        onMouseLeave={() => setAnchorRef(null)}
        variant="base-primary"
      >
        Hover me
      </Button>
      <Button
        onClick={(event: MouseEvent<HTMLButtonElement>) =>
          setAnchorRef(
            anchorRef === event.currentTarget ? null : event.currentTarget,
          )
        }
        variant="base-primary"
      >
        Click me
      </Button>
    </div>
  );
};

export const Basic: Story = {
  render: () => <BasicExample />,
};

const PlacementExample = () => {
  const [popperPlacement, setPopperPlacement] =
    useState<PopperPlacement>('top');
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  const renderButton = (placement: PopperPlacement) => (
    <Button
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        setPopperPlacement(placement);
        setAnchor(anchor === event.currentTarget ? null : event.currentTarget);
      }}
      variant="base-primary"
    >
      {placement}
    </Button>
  );

  return (
    <div
      style={{
        display: 'inline-grid',
        gap: 30,
        gridAutoRows: 'minmax(min-content, max-content)',
        gridTemplateColumns: 'repeat(5, max-content)',
        justifyContent: 'center',
        marginTop: 50,
        width: '100%',
      }}
    >
      <Popper
        anchor={anchor}
        open={Boolean(anchor)}
        options={{
          placement: popperPlacement,
          middleware: [
            offset({
              mainAxis:
                Number(
                  getCSSVariableValue('--mzn-spacing-gap-base').replace(
                    'rem',
                    '',
                  ),
                ) * 16,
            }),
          ],
        }}
      >
        <DemoPopperContent />
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

export const Placement: Story = {
  render: () => <PlacementExample />,
};

const WithArrowExample = () => {
  const [popperPlacement, setPopperPlacement] =
    useState<PopperPlacement>('top');
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  const renderButton = (placement: PopperPlacement) => (
    <Button
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        setPopperPlacement(placement);
        setAnchor(anchor === event.currentTarget ? null : event.currentTarget);
      }}
      variant="base-primary"
    >
      {placement}
    </Button>
  );

  return (
    <div
      style={{
        display: 'inline-grid',
        gap: 30,
        gridAutoRows: 'minmax(min-content, max-content)',
        gridTemplateColumns: 'repeat(5, max-content)',
        justifyContent: 'center',
        marginTop: 50,
        width: '100%',
      }}
    >
      <Popper
        anchor={anchor}
        arrow={{
          className: 'foo',
          enabled: true,
          padding: 0,
        }}
        open={Boolean(anchor)}
        options={{
          placement: popperPlacement,
          middleware: [
            offset({
              mainAxis:
                Number(
                  getCSSVariableValue('--mzn-spacing-gap-base').replace(
                    'rem',
                    '',
                  ),
                ) * 16,
            }),
          ],
        }}
      >
        <DemoPopperContent />
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

export const WithArrow: Story = {
  render: () => <WithArrowExample />,
};

const WithMiddlewareExample = () => {
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        height: '200vh',
        paddingTop: '50vh',
      }}
    >
      <div>Scroll to test flip and shift middleware</div>
      <Popper
        anchor={anchor}
        arrow={{
          className: 'custom-arrow',
          enabled: true,
          padding: 0,
        }}
        open={Boolean(anchor)}
        options={{
          placement: 'top',
          middleware: [
            offset({
              mainAxis:
                Number(
                  getCSSVariableValue('--mzn-spacing-gap-base').replace(
                    'rem',
                    '',
                  ),
                ) * 16,
            }),
            shift(),
            flip({ fallbackAxisSideDirection: 'end' }),
          ],
        }}
      >
        <DemoPopperContent />
      </Popper>
      <Button
        onClick={(event: MouseEvent<HTMLButtonElement>) =>
          setAnchor(anchor === event.currentTarget ? null : event.currentTarget)
        }
        variant="base-primary"
      >
        Click me (with flip & shift)
      </Button>
    </div>
  );
};

export const WithMiddleware: Story = {
  render: () => <WithMiddlewareExample />,
};

const DisablePortalExample = () => {
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);

  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        position: 'relative',
      }}
    >
      <Popper
        anchor={anchor}
        disablePortal
        open={Boolean(anchor)}
        options={{
          placement: 'bottom',
          middleware: [
            offset({
              mainAxis:
                Number(
                  getCSSVariableValue('--mzn-spacing-gap-base').replace(
                    'rem',
                    '',
                  ),
                ) * 16,
            }),
          ],
        }}
      >
        <DemoPopperContent />
      </Popper>
      <Button
        onClick={(event: MouseEvent<HTMLButtonElement>) =>
          setAnchor(anchor === event.currentTarget ? null : event.currentTarget)
        }
        variant="base-primary"
      >
        Click me (no portal)
      </Button>
    </div>
  );
};

export const DisablePortal: Story = {
  render: () => <DisablePortalExample />,
};
