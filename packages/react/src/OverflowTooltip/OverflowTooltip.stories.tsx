import { Meta, StoryObj } from '@storybook/react-webpack5';
import OverflowTooltip, { OverflowTooltipProps } from '.';
import { useRef, useState } from 'react';
import Tag from '../Tag';

export default {
  title: 'Internal/OverflowTooltip',
  component: OverflowTooltip,
} satisfies Meta<typeof OverflowTooltip>;

type Story = StoryObj<OverflowTooltipProps>;

export const Playground: Story = {
  args: {
    open: false,
    tags: ['Tagaaa 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5ssss'],
    onTagDismiss: (tagIndex: number) => {
      // eslint-disable-next-line no-console
      console.log(`Dismiss tag at index: ${tagIndex}`);
    },
  },
  render: function Render(args) {
    const [open, setOpen] = useState(false);

    const anchorRef = useRef<HTMLElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);

    return (
      <div style={{ padding: '100px' }}>
        <Tag
          ref={anchorRef}
          type="overflow-counter"
          count={5}
          onClick={() => setOpen(true)}
        />

        <OverflowTooltip
          ref={tooltipRef}
          {...args}
          open={open}
          anchor={anchorRef.current}
        />
      </div>
    );
  },
};
