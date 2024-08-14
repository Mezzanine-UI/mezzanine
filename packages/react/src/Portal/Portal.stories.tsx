import { Meta } from '@storybook/react';
import { useRef } from 'react';
import Typography from '../Typography';
import Portal from './Portal';

export default {
  title: 'Utility/Portal',
} as Meta;

const demoElement = (
  <div
    style={{
      width: '100px',
      height: '100px',
      backgroundImage:
        'radial-gradient(circle, #778de8, #7b83c6, #797aa6, #737287, #6a6a6a)',
      borderRadius: '100%',
    }}
  />
);

export const Common = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        style={{
          width: '100%',
          height: '100px',
          backgroundColor: '#d9d9d9',
        }}
      >
        <Typography>The container wrapping portal.</Typography>
        <Portal container={containerRef}>{demoElement}</Portal>
      </div>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100px',
          backgroundColor: '#e5e5e5',
        }}
      >
        <Typography>The portal destination.</Typography>
      </div>
    </>
  );
};
