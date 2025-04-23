import { RefObject, MouseEvent, useState } from 'react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MoreHorizontalIcon,
} from '@mezzanine-ui/icons';
import { Size } from '@mezzanine-ui/system/size';
import { Meta } from '@storybook/react';
import Dropdown from './Dropdown';
import Menu, { MenuItem, MenuSize } from '../Menu';
import Button from '../Button';
import Icon from '../Icon';

export default {
  title: 'Navigation/Dropdown',
} as Meta;

const demoMenu = (size?: MenuSize) => (
  <Menu size={size} style={{ border: 0 }}>
    <MenuItem>item 1</MenuItem>
    <MenuItem active>item 2</MenuItem>
    <MenuItem disabled>item 3</MenuItem>
    <MenuItem>item 4</MenuItem>
  </Menu>
);

const offsetModifier = {
  name: 'offset',
  options: {
    offset: [0, 8],
  },
};

export const Basic = () => {
  const [current, setCurrent] = useState<'basic' | 'button' | ''>('');
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);

  const open = Boolean(anchor);

  const onClose = () => {
    setAnchor(null);
    setCurrent('');
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: 30,
      }}
    >
      <Dropdown
        menu={demoMenu()}
        onClose={onClose}
        popperProps={{
          open: open && current === 'basic',
        }}
      >
        {(ref) => (
          <Button
            ref={ref as RefObject<HTMLButtonElement | null>}
            onClick={(event: MouseEvent<HTMLButtonElement>) => {
              event.stopPropagation();
              setAnchor(
                anchor === event.currentTarget ? null : event.currentTarget,
              );
              setCurrent('basic');
            }}
            suffix={
              <Icon
                icon={
                  open && current === 'basic' ? ChevronUpIcon : ChevronDownIcon
                }
              />
            }
            variant="text"
          >
            Basic
          </Button>
        )}
      </Dropdown>
      <Dropdown
        menu={demoMenu()}
        onClose={() => {
          setAnchor(null);
          setCurrent('');
        }}
        popperProps={{
          open: open && current === 'button',
          options: {
            modifiers: [offsetModifier],
          },
        }}
      >
        {(ref) => (
          <Button
            ref={ref as RefObject<HTMLButtonElement | null>}
            onClick={(event: MouseEvent<HTMLButtonElement>) => {
              event.stopPropagation();
              setAnchor(
                anchor === event.currentTarget ? null : event.currentTarget,
              );
              setCurrent('button');
            }}
            suffix={<Icon icon={MoreHorizontalIcon} />}
            variant="outlined"
          >
            With Offset
          </Button>
        )}
      </Dropdown>
    </div>
  );
};

export const Sizes = () => {
  const [current, setCurrent] = useState<Size | ''>('');
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);

  const open = Boolean(anchor);

  const onClose = () => {
    setAnchor(null);
    setCurrent('');
  };

  const sizes: Size[] = ['small', 'medium', 'large'];

  return (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(3, min-content)',
        gap: '16px',
        alignItems: 'center',
      }}
    >
      {sizes.map((size) => (
        <Dropdown
          key={size}
          menu={demoMenu(size)}
          onClose={onClose}
          popperProps={{
            open: open && current === size,
          }}
        >
          {(ref) => (
            <Button
              ref={ref as RefObject<HTMLButtonElement | null>}
              onClick={(event: MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation();
                setAnchor(
                  anchor === event.currentTarget ? null : event.currentTarget,
                );
                setCurrent(size);
              }}
              size={size}
              suffix={
                <Icon
                  icon={
                    open && current === size ? ChevronUpIcon : ChevronDownIcon
                  }
                />
              }
              variant="outlined"
            >
              {size}
            </Button>
          )}
        </Dropdown>
      ))}
    </div>
  );
};
