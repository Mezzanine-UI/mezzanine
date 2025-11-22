import { Meta, StoryObj } from '@storybook/react-webpack5';
import OverflowTooltip, { OverflowTooltipProps } from '.';
import { OverflowCounterTag } from '.';
import { useRef } from 'react';

export default {
  title: 'Internal/OverflowTooltip',
  component: OverflowTooltip,
  subcomponents: { OverflowCounterTag },
} satisfies Meta<typeof OverflowTooltip>;

type TooltipStory = StoryObj<OverflowTooltipProps>;

export const Playground: TooltipStory = {
  args: {
    open: false,
    tags: ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5'],
    onTagDismiss: (tagIndex: number) => {
      // eslint-disable-next-line no-console
      console.log(`Dismiss tag at index: ${tagIndex}`);
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
        <OverflowTooltip {...args} anchor={anchorRef} open={true} />
      </div>
    );
  },
};

type CounterTagStory = StoryObj<typeof OverflowCounterTag>;

export const OverflowCounterTagPlayground: CounterTagStory = {
  args: {
    tags: ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5'],
    tagSize: 'main',
  },
  render: (args) => (
    <div style={{ padding: '100px' }}>
      <OverflowCounterTag
        {...args}
        onTagDismiss={(index) => {
          // eslint-disable-next-line no-console
          console.log(`Dismiss tag at index: ${index}`);
        }}
      />
    </div>
  ),
};
