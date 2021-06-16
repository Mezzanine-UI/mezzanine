import { Meta } from '@storybook/react';
import Skeleton from '.';

export default {
  title: 'Feedback/Skeleton',
} as Meta;

export const Basic = () => (
  <div style={{
    display: 'inline-grid',
    gap: 16,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  }}
  >
    <Skeleton type="circle" />
    <Skeleton width={300} />
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Skeleton width={40} height={40} type="circle" />
      <div style={{ alignItems: 'center' }}>
        <Skeleton width="250px" height="16px" style={{ margin: '8px' }} />
        <Skeleton style={{ width: '250px', height: '16px', margin: '8px' }} />
      </div>
    </div>
  </div>
);
