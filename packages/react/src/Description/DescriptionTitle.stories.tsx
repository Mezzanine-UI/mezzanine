import { Meta, StoryObj } from '@storybook/react-webpack5';
import { QuestionOutlineIcon } from '@mezzanine-ui/icons';
import DescriptionTitle from './DescriptionTitle';

export default {
  title: 'Data Display/Description/DescriptionTitle',
  component: DescriptionTitle,
} as Meta;

type TitleStory = StoryObj<typeof DescriptionTitle>;

export const Playground: TitleStory = {
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
