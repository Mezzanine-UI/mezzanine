import { Meta, StoryFn } from '@storybook/react';
import { EyeIcon, MoreVerticalIcon } from '@mezzanine-ui/icons';
import Icon from '../Icon';
import Card, { CardProps } from './Card';
import CardActions from './CardActions';
import { TypographyProps } from '../Typography';

export default {
  title: 'Data Display/Card',
} as Meta;

interface PlaygroundArgs extends CardProps {
  coverUri: string,
  titleVariant: any,
  actionsTemplate: any,
}

const exampleCover = (
  <img
    alt=""
    style={{ width: '100%' }}
    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
  />
);

const otherActions = (
  <div>
    <Icon
      style={{
        padding: '4px',
        fontSize: '24px',
      }}
      icon={MoreVerticalIcon}
    />
    <Icon
      style={{
        padding: '4px',
        fontSize: '24px',
      }}
      icon={EyeIcon}
    />
  </div>
);

const exampleActionsWithIcon = (
  <CardActions
    otherActions={otherActions}
    confirmText="OK"
    cancelText="Close"
  />
);

const exampleActionsConfirm = (
  <CardActions confirmText="Confirm" />
);
const exampleActionsOkClose = (
  <CardActions
    confirmText="OK"
    cancelText="Close"
  />
);

const playgroundDefaultStyle = {
  width: '375px',
};

export const Playground: StoryFn<PlaygroundArgs> = ({
  coverUri, title, titleVariant, subtitle, description, actionsTemplate, ...args
}) => {
  const playgroundDefaultCover = (
    <img
      alt=""
      style={{ width: '100%' }}
      src={coverUri}
    />
  );

  const exampleTitleProps : TypographyProps = {
    variant: titleVariant,
  };

  const exampleActions : { [template:string] : JSX.Element } = {
    Confirm: exampleActionsConfirm,
    OkClose: exampleActionsOkClose,
    OkCloseAndIcon: exampleActionsWithIcon,
  };

  return (
    <Card
      actions={exampleActions[actionsTemplate]}
      cover={playgroundDefaultCover}
      description={description}
      title={title}
      titleProps={exampleTitleProps}
      style={playgroundDefaultStyle}
      subtitle={subtitle}
      {...args}
    />
  );
};

Playground.args = {
  coverUri: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
  title: 'Card title',
  titleVariant: 'h3',
  subtitle: 'subtitle~',
  // eslint-disable-next-line max-len
  description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. In nisi temporibus eligendi voluptatem eum necessitatibus illum sint id earum et, quis sunt soluta, esse, autem minima ipsam libero eveniet molestiae?',
  actionsTemplate: 'Confirm',
};

Playground.argTypes = {
  coverUri: {
    control: {
      type: 'text',
    },
  },
  titleVariant: {
    control: {
      type: 'inline-radio',
      options: ['h3', 'h2', 'body1'],
    },
  },
  actionsTemplate: {
    control: {
      type: 'inline-radio',
      options: ['Confirm', 'OkClose', 'OkCloseAndIcon'],
    },
  },
};

export const Basic = () => {
  const style = { width: '375px' };
  const title = 'title1';
  const subtitle = 'subtitle';
  // eslint-disable-next-line max-len
  const text = 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vel voluptatibus magni natus aliquid doloremque quidem, eveniet explicabo iusto. Possimus nemo temporibus deleniti. Asperiores consectetur deserunt repudiandae eligendi distinctio ducimus exercitationem.';

  return (
    <div
      style={{
        display: 'inline-grid',
        gap: '16px',
      }}
    >
      <Card
        style={style}
        title={title}
      />
      <Card
        style={style}
        title={title}
        subtitle={subtitle}
      />
      <Card
        style={style}
        description={text}
        actions={exampleActionsWithIcon}
      />
      <Card
        style={style}
        title={title}
        subtitle={subtitle}
        description={text}
        actions={exampleActionsOkClose}
      />
      <Card
        cover={exampleCover}
        title={title}
        subtitle={subtitle}
      />
    </div>
  );
};

export const Group = () => {
  const style = { width: '300px' };
  const title = 'card title';
  const subtitle = 'subtitle';
  // eslint-disable-next-line max-len
  const textLong = 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vel voluptatibus magni natus aliquid doloremque quidem, eveniet explicabo iusto. Possimus nemo temporibus deleniti. Asperiores consectetur deserunt repudiandae eligendi distinctio ducimus exercitationem.';
  // eslint-disable-next-line max-len
  const textShort = 'Lorem ipsum dolor sit amet consectetur. Asperiores consectetur deserunt repudiandae eligendi distinctio ducimus exercitationem.';

  return (
    <div
      style={{
        display: 'grid',
        justifyItems: 'start',
        gridTemplateColumns: 'repeat(4, min-content)',
        gap: '16px',
      }}
    >
      <Card
        cover={exampleCover}
        style={style}
        title={title}
        description={textShort}
        actions={exampleActionsWithIcon}
      />
      <Card
        style={style}
        title={title}
        subtitle={subtitle}
      />
      <Card
        style={style}
        title={title}
        subtitle={subtitle}
        description={textLong}
        actions={exampleActionsOkClose}
      />
      <Card
        style={style}
        description={textShort}
      />
      <Card
        cover={exampleCover}
        style={style}
        title={title}
        description={textShort}
        actions={exampleActionsOkClose}
      />
      <Card
        style={style}
        title={title}
      />
      <Card
        style={style}
        title={title}
        subtitle={subtitle}
        description={textLong}
        actions={exampleActionsOkClose}
      />
      <Card
        cover={exampleCover}
        style={style}
        actions={exampleActionsOkClose}
      />
    </div>
  );
};
