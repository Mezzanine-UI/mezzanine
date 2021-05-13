import { Meta, Story } from '@storybook/react';
import { EyeIcon, MoreVerticalIcon } from '@mezzanine-ui/icons';
import Icon from '../Icon';
import Card, { CardProps } from './Card';
import CardActions from './CardActions';
import { TypographyProps } from '../Typography';

export default {
  title: 'Data Display/Card',
} as Meta;

type PlaygroundArgs = Required<CardProps>;

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
  <CardActions confirmText="other" />
);
const exampleActionsOkClose = (
  <CardActions
    confirmText="OK"
    cancelText="Close"
  />
);

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
        // height: '300px',
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

const exampleTitleProps : TypographyProps = {
  variant: 'h3',
};

export const Playground: Story<PlaygroundArgs> = ({
  cover, style, title, titleProps, subtitle, subtitleProps, description, descriptionProps, actions, ...args
}) => (
  <Card
    actions={actions}
    cover={cover}
    description={description}
    descriptionProps={descriptionProps}
    title={title}
    titleProps={titleProps}
    style={style}
    subtitle={subtitle}
    subtitleProps={subtitleProps}
    {...args}
  />
);

Playground.args = {
  cover: exampleCover,
  style: { width: '375px' },
  title: 'Card title',
  titleProps: exampleTitleProps,
  subtitle: 'subtitle~',
  subtitleProps: undefined,
  // eslint-disable-next-line max-len
  description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. In nisi temporibus eligendi voluptatem eum necessitatibus illum sint id earum et, quis sunt soluta, esse, autem minima ipsam libero eveniet molestiae?',
  descriptionProps: undefined,
  actions: exampleActionsConfirm,
};

Playground.argTypes = {
  title: {
    control: {
      type: 'text',
    },
  },
};
