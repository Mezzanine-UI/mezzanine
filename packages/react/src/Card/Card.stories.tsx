import { Meta, Story } from '@storybook/react';
import Card, { CardProps } from './Card';
import ConfirmActions from '../ConfirmActions/ConfirmActions';

export default {
  title: 'Data Display/Card',
} as Meta;

type PlaygroundArgs = Required<Pick<CardProps, (
  'media' | 'style' | 'title' | 'subhead' | 'text' | 'footer'
)>>;

export const Playground: Story<PlaygroundArgs> = ({
  media, style, title, subhead, text, footer, ...args
}) => (
  <Card media={media} style={style} title={title} subhead={subhead} text={text} footer={footer} {...args} />
);

const exampleMedia : React.ReactNode = (
  <img
    alt="example"
    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
  />
);

const exampleFooter : React.ReactNode = (
  <ConfirmActions
    confirmText="Confirm"
    hideCancelButton
  />
);

Playground.args = {
  media: exampleMedia,
  style: { width: '375px' },
  title: 'Card title',
  subhead: 'subhead',
  text: 'Text texttext Text texttext Text texttext Text texttext Text texttext Text texttext ',
  footer: exampleFooter,
};

Playground.argTypes = {
};
