import { Meta, StoryObj } from '@storybook/react-webpack5';
import { CopyIcon } from '@mezzanine-ui/icons';
import DescriptionContent from './DescriptionContent';

export default {
  title: 'Data Display/Description/DescriptionContent',
  component: DescriptionContent,
} as Meta;

type ContentStory = StoryObj<typeof DescriptionContent>;

export const Playground: ContentStory = {
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
        99,000
      </DescriptionContent>
      <DescriptionContent size="sub" type="statistic">
        99,000
      </DescriptionContent>
      <DescriptionContent type="trend-up">88%</DescriptionContent>
      <DescriptionContent type="trend-down">60%</DescriptionContent>
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
