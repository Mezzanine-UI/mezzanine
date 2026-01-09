import { Meta, StoryObj } from '@storybook/react-webpack5';
import { QuestionOutlineIcon } from '@mezzanine-ui/icons';
import DescriptionTitle from './DescriptionTitle';

export default {
  title: 'Data Display/Description/DescriptionTitle',
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
      <DescriptionTitle>Title</DescriptionTitle>
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

export const WidthTypes: TitleStory = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div style={{ width: 'fit-content' }}>
        <DescriptionTitle widthType="narrow">Narrow</DescriptionTitle>
        <div
          style={{
            width: '100%',
            height: 2,
            backgroundColor: '#F03740',
            opacity: 0.16,
          }}
        />
      </div>

      <div style={{ width: 'fit-content' }}>
        <DescriptionTitle widthType="wide">Wide</DescriptionTitle>
        <div
          style={{
            width: '100%',
            height: 2,
            backgroundColor: '#F03740',
            opacity: 0.16,
          }}
        />
      </div>

      <div style={{ width: 'auto' }}>
        <DescriptionTitle widthType="stretch">Stretch</DescriptionTitle>
        <div
          style={{
            width: '100%',
            height: 2,
            backgroundColor: '#F03740',
            opacity: 0.16,
          }}
        />
      </div>

      <div style={{ width: 'fit-content' }}>
        <DescriptionTitle widthType="hug">Hug</DescriptionTitle>
        <div
          style={{
            width: '100%',
            height: 2,
            backgroundColor: '#F03740',
            opacity: 0.16,
          }}
        />
      </div>
    </div>
  ),
};
