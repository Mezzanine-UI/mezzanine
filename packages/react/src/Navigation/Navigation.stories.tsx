
import { Key, useState } from 'react';
import { Meta, Story } from '@storybook/react';
import {
  DownloadIcon,
  EyeIcon,
  SearchIcon,
  UploadIcon,
  CheckCircleFilledIcon,
} from '@mezzanine-ui/icons';
import Navigation, { NavigationProps, NavigationItem } from '.';
import NavigationSubMenu from './NavigationSubMenu';

export default {
  title: 'Navigation/Navigation',
} as Meta;

const dataset = [
  {
    text: '1',
    icon: DownloadIcon,
  },
  {
    text: '2',
    icon: EyeIcon,
  },
  {
    text: '3',
    icon: SearchIcon,
  },
  {
    text: '4',
    icon: UploadIcon,
  },
  {
    text: '5',
    icon: CheckCircleFilledIcon,
    subMenu: [
      {
        text: '6',
        icon: UploadIcon,
      },
      {
        text: '7',
        icon: DownloadIcon,
      },
    ],
  },
  {
    text: '8',
    icon: CheckCircleFilledIcon,
    subMenu: [
      {
        text: '9',
        icon: UploadIcon,
      },
      {
        text: '10',
        icon: DownloadIcon,
      },
    ],
  },
];

export const Playground:Story<NavigationProps> = ({
  orientation,
}) => {
  const [active, setActive] = useState<Key | null | undefined>();

  return (
    <div style={{
      height: '100vh',
    }}
    >
      <Navigation
        orientation={orientation}
        onClick={setActive}
        activeKey={active}
      >
        {
          dataset.map((data) => (
            data.subMenu ? (
              <NavigationSubMenu
                title={data.text}
                icon={data.icon}
                key={data.text}
              >
                {data.subMenu.map((subMenuItem) => (
                  <NavigationItem
                    icon={subMenuItem.icon}
                    key={subMenuItem.text}
                  >
                    {subMenuItem.text}
                  </NavigationItem>
                ))}
              </NavigationSubMenu>
            ) : (
              <NavigationItem
                key={data.text}
                icon={data.icon}
              >
                {data.text}
              </NavigationItem>
            )))
        }
      </Navigation>
    </div>
  );
};

Playground.args = {
  orientation: 'horizontal',
};

Playground.argTypes = {
  orientation: {
    control: {
      type: 'select',
      options: [
        'horizontal',
        'vertical',
      ],
    },
  },
};
