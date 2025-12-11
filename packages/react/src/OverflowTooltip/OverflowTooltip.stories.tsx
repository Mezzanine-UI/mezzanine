import { Meta, StoryObj } from '@storybook/react-webpack5';
import OverflowTooltip, { OverflowTooltipProps } from '.';
import { OverflowCounterTag } from '.';
import { useRef } from 'react';
import Typography from '../Typography';

export default {
  title: 'Internal/OverflowTooltip',
  component: OverflowTooltip,
  subcomponents: { OverflowCounterTag },
} satisfies Meta<typeof OverflowTooltip>;

type TooltipStory = StoryObj<OverflowTooltipProps>;

export const Playground: TooltipStory = {
  args: {
    className: '',
    onTagDismiss: (tagIndex: number) => {
      // eslint-disable-next-line no-console
      console.log(`Dismiss tag at index: ${tagIndex}`);
    },
    open: true,
    placement: 'top-start',
    tags: ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5'],
    tagSize: 'main',
  },
  parameters: {
    controls: {
      include: ['className', 'placement', 'tagSize', 'tags', 'open'],
    },
  },
  render: function Render(args) {
    const anchorRef = useRef<HTMLDivElement | null>(null);

    return (
      <div style={{ padding: '100px' }}>
        <div
          ref={anchorRef}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '999px',
            backgroundColor: 'white',
          }}
        />
        <OverflowTooltip {...args} anchor={anchorRef} />
      </div>
    );
  },
};

export const States: TooltipStory = {
  args: {
    className: '',
    open: true,
    placement: 'top-start',
    tags: ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5'],
    tagSize: 'main',
  },
  parameters: { controls: { disable: true } },

  render: function Render(args) {
    const anchor1Ref = useRef<HTMLDivElement | null>(null);
    const anchor2Ref = useRef<HTMLDivElement | null>(null);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '100px',
          paddingTop: '100px',
        }}
      >
        <div
          ref={anchor1Ref}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '999px',
            backgroundColor: 'white',
          }}
        >
          <Typography variant="h2">Enabled</Typography>
        </div>
        <OverflowTooltip
          {...args}
          anchor={anchor1Ref}
          onTagDismiss={(tagIndex: number) => {
            // eslint-disable-next-line no-console
            console.log(`Dismiss tag at index: ${tagIndex}`);
          }}
        />

        <div
          ref={anchor2Ref}
          style={{
            width: 'fit-content',
            borderRadius: '999px',
            backgroundColor: 'white',
          }}
        >
          <Typography variant="h2">Read only</Typography>
        </div>
        <OverflowTooltip {...args} anchor={anchor2Ref} readOnly />
      </div>
    );
  },
};

type CounterTagStory = StoryObj<typeof OverflowCounterTag>;

export const OverflowCounterTagPlayground: CounterTagStory = {
  args: {
    className: '',
    onTagDismiss: (tagIndex: number) => {
      // eslint-disable-next-line no-console
      console.log(`Dismiss tag at index: ${tagIndex}`);
    },
    tags: ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5'],
    tagSize: 'main',
    placement: 'top-start',
  },
  parameters: {
    component: OverflowCounterTag,
    controls: {
      include: ['className', 'placement', 'tagSize', 'tags'],
    },
  },
  render: (args) => (
    <div style={{ padding: '100px' }}>
      <OverflowCounterTag {...args} />
    </div>
  ),
};
