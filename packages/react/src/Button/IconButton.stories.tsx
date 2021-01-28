import { Meta } from '@storybook/react';
import { PlusIcon } from '@mezzanine-ui/icons';
import Icon from '../Icon';
import { IconButton } from '.';

export default {
  title: 'General/Button/IconButton',
} as Meta;

export const All = () => (
  <div
    style={{
      display: 'inline-grid',
      gridTemplateColumns: 'repeat(3, min-content)',
      gap: '16px',
      alignItems: 'center',
    }}
  >
    <IconButton variant="outlined" size="small">
      <Icon icon={PlusIcon} />
    </IconButton>
    <IconButton color="secondary" variant="outlined">
      <Icon icon={PlusIcon} />
    </IconButton>
    <IconButton disabled variant="outlined" size="large">
      <Icon icon={PlusIcon} />
    </IconButton>
    <IconButton variant="contained" size="small">
      <Icon icon={PlusIcon} />
    </IconButton>
    <IconButton color="secondary" variant="contained">
      <Icon icon={PlusIcon} />
    </IconButton>
    <IconButton disabled variant="contained" size="large">
      <Icon icon={PlusIcon} />
    </IconButton>
  </div>
);
