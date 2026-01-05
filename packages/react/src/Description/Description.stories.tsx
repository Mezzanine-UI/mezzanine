import { Meta, StoryObj } from '@storybook/react-webpack5';
import { QuestionOutlineIcon } from '@mezzanine-ui/icons';
import DescriptionTitle from './DescriptionTitle';

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
      <DescriptionTitle>Title</DescriptionTitle>
      <DescriptionTitle badge="dot-success">Title</DescriptionTitle>
      <DescriptionTitle icon={QuestionOutlineIcon}>Title</DescriptionTitle>
      <DescriptionTitle badge="dot-success" icon={QuestionOutlineIcon}>
        Title
      </DescriptionTitle>
    </div>
  ),
};
