import { Meta, StoryObj } from '@storybook/react-webpack5';
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
    </div>
  ),
};
