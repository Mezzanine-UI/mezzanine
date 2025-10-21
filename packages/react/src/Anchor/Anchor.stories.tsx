import { Meta } from '@storybook/react-webpack5';
import Anchor from './Anchor';
import { useState } from 'react';
import Typography from '../Typography';

export default {
  title: 'Others/Anchor',
} as Meta;

const anchorList = [
  {
    id: 'Anchor1',
    name: 'Anchor1',
  },
  {
    id: 'Anchor2',
    name: 'Anchor2',
  },
  {
    id: 'lorem ipsum lorem ipsum lorem ipsum',
    name: 'lorem ipsum lorem ipsum lorem ipsum',
  },
  {
    id: 'Anchor4',
    name: 'Anchor4',
  },
  {
    id: 'Anchor5',
    name: 'Anchor5',
  },
];

export const Basics = () => {
  const [currentActiveId, setCurrentActiveId] = useState<string>(
    anchorList[0].id,
  );

  return (
    <div
      style={{
        display: 'grid',
        gridAutoFlow: 'row',
        gap: '12px',
      }}
    >
      <Typography variant="h4" color="secondary">
        Non Ellipsis
      </Typography>
      <Anchor
        activeAnchorId={currentActiveId}
        list={anchorList}
        maxWidth={180}
        onClick={(nextAnchorId) => setCurrentActiveId(nextAnchorId)}
      />
      <Typography variant="h4" color="secondary">
        Ellipsis
      </Typography>
      <Anchor
        activeAnchorId={currentActiveId}
        ellipsis
        list={anchorList}
        maxWidth={200}
        onClick={(nextAnchorId) => setCurrentActiveId(nextAnchorId)}
      />
    </div>
  );
};
