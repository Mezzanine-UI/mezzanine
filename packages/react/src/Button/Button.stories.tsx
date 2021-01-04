import { PlusIcon, SearchIcon } from '@mezzanine-ui/icons';
import { boolean } from '@storybook/addon-knobs';
import Icon from '../Icon';
import Button from '.';

export default {
  title: 'Basic/Button',
};

export const Contained = () => (
  <div
    style={{
      display: 'inline-grid',
      gridTemplateColumns: 'repeat(4, min-content)',
      gap: '16px',
    }}
  >
    <Button variant="contained">primary</Button>
    <Button variant="contained" color="secondary">secondary</Button>
    <Button variant="contained" color="error">error</Button>
    <Button variant="contained" disabled>disabled</Button>
  </div>
);

export const Outlined = () => (
  <div
    style={{
      display: 'inline-grid',
      gridTemplateColumns: 'repeat(4, min-content)',
      gap: '16px',
    }}
  >
    <Button variant="outlined">primary</Button>
    <Button variant="outlined" color="secondary">secondary</Button>
    <Button variant="outlined" color="error">error</Button>
    <Button variant="outlined" disabled>disabled</Button>
  </div>
);

export const Text = () => (
  <div
    style={{
      display: 'inline-grid',
      gridTemplateColumns: 'repeat(4, min-content)',
      gap: '16px',
    }}
  >
    <Button>primary</Button>
    <Button color="secondary">secondary</Button>
    <Button color="error">error</Button>
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

export const Loading = () => {
  const loading = boolean('loading', true);

  return (
    <Button loading={loading} variant="contained">ok</Button>
  );
};
