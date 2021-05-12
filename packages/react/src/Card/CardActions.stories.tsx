import { Meta } from '@storybook/react';
import { EyeIcon, MoreVerticalIcon } from '@mezzanine-ui/icons';
import Icon from '../Icon';
import CardActions from './CardActions';

export default {
  title: 'Data Display/Card/CardActions',
} as Meta;

export const Basic = () => {
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

  return (
    <div
      style={{
        display: 'inline-grid',
        gap: '16px',
        width: 350,
      }}
    >
      <CardActions
        otherActions={otherActions}
        confirmText="OK"
        cancelText="Close"
      />
    </div>
  );
};

