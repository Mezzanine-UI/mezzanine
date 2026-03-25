import { Meta, StoryObj } from '@storybook/react-webpack5';
import OverflowTooltip, { OverflowTooltipProps } from '.';
import { OverflowCounterTag } from '.';
import { useRef, useState } from 'react';
import Typography from '../Typography';
import Icon from '../Icon';
import { ChevronDownIcon } from '@mezzanine-ui/icons';
import Tag from '../Tag';

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

const PLACEMENT_TAGS = ['Option 2', 'Option 3', 'Option 4', 'Option 5'];

function PlacementItem({
  label,
  placement,
}: {
  label: string;
  placement: OverflowTooltipProps['placement'];
}) {
  const anchorRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '8px',
        paddingTop: placement?.startsWith('bottom') ? '0' : '80px',
        paddingBottom: placement?.startsWith('bottom') ? '80px' : '0',
      }}
    >
      <Typography variant="caption">{label}</Typography>
      <div
        ref={anchorRef}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          backgroundColor: 'white',
          fontSize: '14px',
          whiteSpace: 'nowrap',
        }}
      >
        Tag 1 × &nbsp;<strong>+ 3</strong>
      </div>
      <OverflowTooltip
        anchor={anchorRef}
        onTagDismiss={() => {}}
        open
        placement={placement}
        tags={PLACEMENT_TAGS}
        tagSize="main"
      />
    </div>
  );
}

export const Placement: TooltipStory = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          padding: '24px',
        }}
      >
        <PlacementItem label="top-start" placement="top-start" />
        <PlacementItem label="top" placement="top" />
        <PlacementItem label="top-end" placement="top-end" />
        <PlacementItem label="bottom-start" placement="bottom-start" />
        <PlacementItem label="bottom" placement="bottom" />
        <PlacementItem label="bottom-end" placement="bottom-end" />
      </div>
    );
  },
};

const MOCK_VISIBLE_TAG = 'Option 1';

function MockSelectWithOverflow({
  placement,
}: {
  placement: OverflowTooltipProps['placement'];
}) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '0 8px',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        backgroundColor: 'white',
        minWidth: '200px',
        height: '36px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          overflow: 'hidden',
        }}
      >
        <Tag
          type="dismissable"
          label={MOCK_VISIBLE_TAG}
          onClose={() => {}}
          size="main"
        />
        <OverflowCounterTag
          onTagDismiss={() => {}}
          placement={placement}
          tags={PLACEMENT_TAGS}
          tagSize="main"
        />
      </div>
      <Icon
        icon={ChevronDownIcon}
        style={{ color: '#8c8c8c', flexShrink: 0 }}
      />
    </div>
  );
}

export const PlacementOnClick: TooltipStory = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          padding: '24px',
        }}
      >
        {(
          [
            'top-start',
            'top',
            'top-end',
            'bottom-start',
            'bottom',
            'bottom-end',
          ] as OverflowTooltipProps['placement'][]
        ).map((placement) => (
          <div
            key={placement}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '8px',
              paddingTop: placement?.startsWith('bottom') ? '0' : '100px',
              paddingBottom: placement?.startsWith('bottom') ? '100px' : '0',
            }}
          >
            <Typography variant="caption">{placement}</Typography>
            <MockSelectWithOverflow placement={placement} />
          </div>
        ))}
      </div>
    );
  },
};

export const SingleTag: TooltipStory = {
  parameters: { controls: { disable: true } },
  render: function Render() {
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
        <OverflowTooltip
          anchor={anchorRef}
          onTagDismiss={() => {}}
          open
          placement="top-start"
          tags={['Tag 1']}
          tagSize="main"
        />
      </div>
    );
  },
};

export const DismissableTags: TooltipStory = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const anchorRef = useRef<HTMLDivElement | null>(null);
    const [tags, setTags] = useState([
      'Tag 1',
      'Tag 2',
      'Tag 3',
      'Tag 4',
      'Tag 5',
    ]);

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
        <OverflowTooltip
          anchor={anchorRef}
          onTagDismiss={(tagIndex) =>
            setTags((prev) => prev.filter((_, i) => i !== tagIndex))
          }
          open
          placement="top-start"
          tags={tags}
          tagSize="main"
        />
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
    disabled: false,
    readOnly: false,
  },
  parameters: {
    component: OverflowCounterTag,
    controls: {
      include: [
        'className',
        'placement',
        'tagSize',
        'tags',
        'disabled',
        'readOnly',
      ],
    },
  },
  render: (args) => (
    <div style={{ padding: '100px' }}>
      <OverflowCounterTag {...args} />
    </div>
  ),
};
