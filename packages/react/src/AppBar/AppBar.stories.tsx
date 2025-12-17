import { StoryFn, Meta } from '@storybook/react-webpack5';
import {
  EyeIcon,
  DownloadIcon,
  SearchIcon,
  UploadIcon,
  TimesIcon,
  CheckCircleFilledIcon,
} from '@mezzanine-ui/icons';
import { useCallback, useState } from 'react';
import AppBar, { AppBarProps } from '.';
import AppBarBrand from './AppBarBrand';
import AppBarMain from './AppBarMain';
import AppBarSupport from './AppBarSupport';
import Icon from '../Icon';
import Typography from '../Typography';
import Button from '../Button';
import Drawer from '../Drawer';
import Input from '../Input';
import Navigation, { NavigationItem, NavigationSubMenu } from '../Navigation';

export default {
  title: 'Navigation/AppBar',
} as Meta;

type PlaygroundStoryArgs = AppBarProps;

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

export const Playground: StoryFn<PlaygroundStoryArgs> = ({ orientation }) => (
  <div
    style={{
      height: '100vh',
    }}
  >
    <AppBar orientation={orientation}>
      <AppBarSupport>
        <Button variant="contained">Login</Button>
        <Button variant="outlined">Button</Button>
      </AppBarSupport>
      <AppBarMain>
        <Navigation orientation={orientation}>
          {dataset.map((data) =>
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
              <NavigationItem key={data.text} icon={data.icon}>
                {data.text}
              </NavigationItem>
            ),
          )}
        </Navigation>
        <div
          style={{
            marginLeft: 'auto',
          }}
        >
          <Input
            placeholder="search"
            prefix={<Icon icon={SearchIcon} />}
            clearable
          />
        </div>
      </AppBarMain>
      <AppBarBrand>
        <Icon
          color="primary"
          style={{
            height: '42px',
            width: '42px',
          }}
          icon={EyeIcon}
        />
        <Typography color="primary" variant="h2">
          Eyes
        </Typography>
      </AppBarBrand>
    </AppBar>
  </div>
);

export const WithDrawer = () => {
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => setOpen(false), []);

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <>
      <Button onClick={() => handleClick()} variant="contained">
        OPEN
      </Button>
      <Drawer onClose={handleClose} open={open} placement="right">
        <AppBar orientation="vertical">
          <AppBarSupport>
            <Button variant="contained">Login</Button>
            <Button variant="outlined">Button</Button>
          </AppBarSupport>
          <AppBarMain>
            <Input
              placeholder="search"
              prefix={<Icon icon={SearchIcon} />}
              clearable
            />
            <Navigation orientation="vertical">
              {dataset.map((data) =>
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
                  <NavigationItem key={data.text} icon={data.icon}>
                    {data.text}
                  </NavigationItem>
                ),
              )}
            </Navigation>
          </AppBarMain>
          <AppBarBrand>
            <Icon
              style={{
                height: '42px',
                width: '42px',
                cursor: 'pointer',
                marginLeft: 'auto',
              }}
              onClick={handleClose}
              color="secondary"
              icon={TimesIcon}
            />
          </AppBarBrand>
        </AppBar>
      </Drawer>
    </>
  );
};

Playground.args = {
  orientation: 'horizontal',
};

Playground.argTypes = {
  orientation: {
    options: ['horizontal', 'vertical'],
    control: {
      type: 'select',
    },
  },
};
