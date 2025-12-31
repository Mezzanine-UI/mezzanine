import { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react-webpack5';
import {
  DownloadIcon,
  EyeIcon,
  NotificationIcon,
  QuestionOutlineIcon,
  UploadIcon,
} from '@mezzanine-ui/icons';
import Navigation, { NavigationProps } from '.';
import NavigationOption from './NavigationOption';
import NavigationHeader from './NavigationHeader';
import NavigationFooter from './NavigationFooter';
import NavigationIconButton from './NavigationIconButton';
import NavigationUserMenu from './NavigationUserMenu';
import Badge from '../Badge';
import NavigationOptionCategory from './NavigationOptionCategory';
import Input from '../Input';

export default {
  title: 'V1/Navigation',
} as Meta;

export const Playground: StoryFn<NavigationProps> = () => {
  const [active, setActive] = useState<string[]>();

  return (
    <div style={{ height: '60vh' }}>
      <p style={{ height: '20px' }}>{active?.join(' , ')}</p>
      <Navigation onOptionClick={setActive} activatedPath={active}>
        <Input variant="search" />
        <NavigationHeader>
          <span
            aria-label="logo"
            style={{
              height: '28px',
              width: '28px',
              backgroundColor: '#5D74E9',
              borderRadius: '4px',
            }}
          />
          NavigationHeader
        </NavigationHeader>
        <NavigationOptionCategory title="Category Title 1">
          <NavigationOption
            key={'NavigationOption 1-1'}
            title={'NavigationOption 1-1'}
            icon={DownloadIcon}
          >
            <NavigationOption
              key={'NavigationOption 1-1-1'}
              title={'NavigationOption 1-1-1'}
            />
          </NavigationOption>
          <NavigationOption
            key={'NavigationOption 1-2'}
            title={'NavigationOption 1-2'}
            icon={EyeIcon}
          >
            <NavigationOption
              key={'NavigationOption 1-2-1'}
              title={'NavigationOption 1-2-1'}
            />
          </NavigationOption>
          <NavigationOption
            key={'NavigationOption 1-3'}
            title={'NavigationOption 1-3'}
            icon={UploadIcon}
          >
            <NavigationOption
              key={'NavigationOption 1-3-1'}
              title={'NavigationOption 1-3-1'}
            />
          </NavigationOption>
          <NavigationOption
            key={'NavigationOption 1-4'}
            title={'NavigationOption 1-4'}
          />
        </NavigationOptionCategory>
        <NavigationOptionCategory title="Category Title 2">
          <NavigationOption
            key={'NavigationOption 2-1'}
            title={'NavigationOption 2-1'}
          >
            <NavigationOption
              key={'NavigationOption 2-1-1'}
              title={'NavigationOption 2-1-1'}
            />
          </NavigationOption>
        </NavigationOptionCategory>
        <NavigationFooter>
          <NavigationUserMenu imgSrc="1">User Name</NavigationUserMenu>
          <NavigationIconButton icon={QuestionOutlineIcon} />
          <Badge variant="dot-error">
            <NavigationIconButton icon={NotificationIcon} />
          </Badge>
        </NavigationFooter>
      </Navigation>
    </div>
  );
};

Playground.args = {};

Playground.argTypes = {};
