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
      <DescriptionContent> Content</DescriptionContent>
      <DescriptionContent variant="statistic">99,000</DescriptionContent>
      <DescriptionContent variant="trend-up">88%</DescriptionContent>
      <DescriptionContent variant="trend-down">60%</DescriptionContent>
      <DescriptionContent
        variant="with-icon"
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

export const Sizes: ContentStory = {
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
      <DescriptionContent size="main" variant="statistic">
        99,000 (main)
      </DescriptionContent>
      <DescriptionContent size="sub" variant="statistic">
        99,000 (sub)
      </DescriptionContent>
    </div>
  ),
};
