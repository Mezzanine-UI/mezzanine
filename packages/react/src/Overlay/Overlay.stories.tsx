import { StoryFn, Meta } from '@storybook/react';
import Overlay, { OverlayProps } from './Overlay';

export default {
  title: 'Utility/Overlay',
} as Meta;

type PlaygroundArgs = Required<
  Pick<OverlayProps, 'disablePortal' | 'hideBackdrop' | 'open'>
>;

export const Playground: StoryFn<PlaygroundArgs> = ({
  disablePortal,
  hideBackdrop,
  open,
}) => (
  <div
    style={{
      position: 'relative',
      width: 200,
      height: 200,
      border: '1px solid var(--mzn-color-primary)',
    }}
  >
    <Overlay
      disablePortal={disablePortal}
      hideBackdrop={hideBackdrop}
      open={open}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'var(--mzn-text-primary)',
      }}
    >
      Content
    </Overlay>
  </div>
);

Playground.args = {
  disablePortal: false,
  hideBackdrop: false,
  open: true,
};
