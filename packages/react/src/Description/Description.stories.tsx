import { Meta, StoryObj } from '@storybook/react-webpack5';
import { QuestionOutlineIcon, CopyIcon } from '@mezzanine-ui/icons';
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
      <DescriptionContent size="main">Main Content</DescriptionContent>
      <DescriptionContent size="sub">Sub Content</DescriptionContent>
      <DescriptionContent size="main" type="statistic">
        Main Statistic
      </DescriptionContent>
      <DescriptionContent size="sub" type="statistic">
        Sub Statistic
      </DescriptionContent>
      <DescriptionContent type="trend-up">Trend Up</DescriptionContent>
      <DescriptionContent type="trend-down">Trend Down</DescriptionContent>
      <DescriptionContent
        icon={CopyIcon}
        onClickIcon={() => {
          // eslint-disable-next-line no-console
          console.log('click icon');
        }}
      >
        With Icon
      </DescriptionContent>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <DescriptionGroup widthType="narrow">
        <DescriptionTitle>Title</DescriptionTitle>
        <DescriptionContent>Content</DescriptionContent>
      </DescriptionGroup>
      <DescriptionGroup orientation="vertical">
        <DescriptionTitle>Title</DescriptionTitle>
        <DescriptionContent>Content</DescriptionContent>
      </DescriptionGroup>
    </div>
  ),
};
