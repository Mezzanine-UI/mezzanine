import { Meta, StoryObj } from '@storybook/react-webpack5';
import { QuestionOutlineIcon } from '@mezzanine-ui/icons';
import DescriptionTitle from './DescriptionTitle';
import DescriptionContent from './DescriptionContent';
import DescriptionGroup from './DescriptionGroup';

export default {
  title: 'Data Display/Description',
} as Meta;

type Story = StoryObj<typeof DescriptionTitle>;

export const Title: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <DescriptionTitle widthType="narrow">Narrow</DescriptionTitle>
      <DescriptionTitle widthType="wide">Wide</DescriptionTitle>
      <DescriptionTitle widthType="stretch">Stretch</DescriptionTitle>
      <DescriptionTitle widthType="hug">Hug</DescriptionTitle>
      <DescriptionTitle badge="dot-success">Title</DescriptionTitle>
      <DescriptionTitle
        tooltip="tooltip"
        tooltipPlacement="top-end"
        icon={QuestionOutlineIcon}
      >
        Title
      </DescriptionTitle>
      <DescriptionTitle badge="dot-success" icon={QuestionOutlineIcon}>
        Title
      </DescriptionTitle>
    </div>
  ),
};

export const Content: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <DescriptionContent>Content</DescriptionContent>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <DescriptionGroup widthType="wide">
      <DescriptionTitle>Title</DescriptionTitle>
      <DescriptionContent>Content</DescriptionContent>
    </DescriptionGroup>
  ),
};
