import { Story, Meta } from '@storybook/react';
import { PlusIcon, SearchIcon } from '@mezzanine-ui/icons';
import Icon from '../Icon';
import Button from '.';

export default {
  title: 'Basic/Button',
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
    <Button variant="contained" error>error</Button>
    <Button variant="contained" disabled>disabled</Button>
    <Button variant="outlined">primary</Button>
    <Button variant="outlined" color="secondary">secondary</Button>
    <Button variant="outlined" error>error</Button>
    <Button variant="outlined" disabled>disabled</Button>
    <Button>primary</Button>
    <Button color="secondary">secondary</Button>
    <Button error>error</Button>
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
      iconStart={<Icon icon={PlusIcon} />}
      color="secondary"
      variant="contained"
    >
      plus
    </Button>
    <Button
      iconEnd={<Icon icon={SearchIcon} />}
      variant="contained"
    >
      search
    </Button>
    <Button
      iconEnd={<Icon icon={SearchIcon} />}
      disabled
      variant="contained"
    >
      search
    </Button>
    <Button
      iconEnd={<Icon icon={SearchIcon} />}
      size="small"
      variant="contained"
    >
      search
    </Button>
    <Button
      iconEnd={<Icon icon={SearchIcon} />}
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
