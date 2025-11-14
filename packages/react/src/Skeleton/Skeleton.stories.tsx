import { Meta } from '@storybook/react-webpack5';
import Skeleton from '.';
import Typography from '../Typography';

export default {
  title: 'Feedback/Skeleton',
} as Meta;

export const Basic = () => (
  <div
    style={{
      display: 'inline-grid',
      gap: 16,
      alignItems: 'center',
      backgroundColor: '#ffffff',
    }}
  >
    <Typography>Type Strip</Typography>
    <div style={{ width: '480px', gap: 8, display: 'grid' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <Typography style={{ flexShrink: 0 }} variant="h1">
          variant: h1
        </Typography>
        <Skeleton variant="h1" />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Typography style={{ flexShrink: 0 }} variant="h2">
          variant: h2
        </Typography>
        <Skeleton variant="h2" />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Typography style={{ flexShrink: 0 }} variant="body">
          variant: body
        </Typography>
        <Skeleton variant="body" />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Typography style={{ flexShrink: 0 }} variant="label-primary">
          variant: label-primary
        </Typography>
        <Skeleton variant="label-primary" />
      </div>
    </div>

    <Typography>Type Circle</Typography>
    <div style={{ width: '32px' }}>
      <Skeleton circle />
    </div>
    <Skeleton circle width={48} />

    <Typography>Type Square</Typography>
    <div style={{ width: '120px', height: '80px' }}>
      <Skeleton />
    </div>
    <Skeleton width={120} height={120} />

    <Typography>Group Example</Typography>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Skeleton circle width={36} />
      <Skeleton variant="body" />
    </div>
    <div style={{ display: 'grid' }}>
      <Skeleton variant="body" />
      <Skeleton variant="body" />
      <Skeleton variant="body" />
    </div>
  </div>
);
