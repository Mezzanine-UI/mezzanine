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
