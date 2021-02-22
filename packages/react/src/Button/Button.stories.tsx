import { Story, Meta } from '@storybook/react';
import { PlusIcon, SearchIcon } from '@mezzanine-ui/icons';
import Icon from '../Icon';
import Button from '.';

export default {
  title: 'General/Button',
} as Meta;

export const Variants = () => (
  <div
    style={{
      display: 'inline-grid',
      gridTemplateColumns: 'repeat(4, min-content)',
      gap: '16px',
    }}
  >
    <Button variant="contained">primary</Button>
    <Button variant="contained" color="secondary">secondary</Button>
    <Button variant="contained" danger>danger</Button>
    <Button variant="contained" disabled>disabled</Button>
    <Button variant="outlined">primary</Button>
    <Button variant="outlined" color="secondary">secondary</Button>
    <Button variant="outlined" danger>danger</Button>
    <Button variant="outlined" disabled>disabled</Button>
    <Button>primary</Button>
    <Button color="secondary">secondary</Button>
    <Button danger>danger</Button>
    <Button disabled>disabled</Button>
  </div>
);

export const Sizes = () => (
  <div
    style={{
      display: 'inline-grid',
      gridTemplateColumns: 'repeat(3, min-content)',
      gap: '16px',
      alignItems: 'center',
    }}
  >
    <Button size="small">ok</Button>
    <Button>ok</Button>
    <Button size="large">ok</Button>
    <Button variant="outlined" size="small">ok</Button>
    <Button variant="outlined">ok</Button>
    <Button variant="outlined" size="large">ok</Button>
    <Button variant="contained" size="small">ok</Button>
    <Button variant="contained">ok</Button>
    <Button variant="contained" size="large">ok</Button>
  </div>
);

export const WithIcons = () => (
  <div
    style={{
      display: 'inline-grid',
      gridTemplateColumns: 'repeat(3, min-content)',
      gap: '16px',
      alignItems: 'center',
    }}
  >
    <Button
      prefix={<Icon icon={PlusIcon} />}
      color="secondary"
      variant="contained"
    >
      plus
    </Button>
    <Button
      suffix={<Icon icon={SearchIcon} />}
      variant="contained"
    >
      search
    </Button>
    <Button
      suffix={<Icon icon={SearchIcon} />}
      disabled
      variant="contained"
    >
      search
    </Button>
    <Button
      suffix={<Icon icon={SearchIcon} />}
      size="small"
      variant="contained"
    >
      search
    </Button>
    <Button
      suffix={<Icon icon={SearchIcon} />}
      size="large"
      variant="contained"
    >
      search
    </Button>
  </div>
);

interface LoadingStoryArgs {
  loading: boolean;
}

export const Loading: Story<LoadingStoryArgs> = ({ loading }) => (
  <Button loading={loading} variant="contained">ok</Button>
);

Loading.args = {
  loading: true,
};
