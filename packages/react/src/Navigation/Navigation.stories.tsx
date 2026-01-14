import { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react-webpack5';
import {
  DownloadIcon,
  EyeIcon,
  FolderIcon,
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
  title: 'Navigation/Navigation',
} as Meta;

export const Basic: StoryFn<NavigationProps> = (args) => (
  <div style={{ display: 'grid', height: 'calc(100vh - 32px)' }}>
    <Navigation {...args}>
      <NavigationHeader title="Navigation">
        <span
          aria-label="logo"
          style={{
            height: '28px',
            width: '28px',
            backgroundColor: '#5D74E9',
            borderRadius: '4px',
          }}
        />
      </NavigationHeader>
      <NavigationOption title={'NavigationOption 1-1'}>
        <NavigationOption title={'NavigationOption 1-1-1'} />
      </NavigationOption>
      <NavigationOption title={'NavigationOption 1-2'}>
        <NavigationOption title={'NavigationOption 1-2-1'} />
      </NavigationOption>
      <NavigationOption title={'NavigationOption 1-3'}>
        <NavigationOption title={'NavigationOption 1-3-1'} />
      </NavigationOption>
      <NavigationOption title={'NavigationOption 1-4'} />
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

export const All: StoryFn<NavigationProps> = () => {
  const [active, setActive] = useState<string[]>();
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState(true);

  const navChildren = (hasIcon: boolean, hasLogo: boolean) => (
    <>
      <Input value={search} onChange={(e) => setSearch(e.target.value)} />
      <NavigationHeader title="Navigation">
        {hasLogo && (
          <span
            aria-label="logo"
            style={{
              height: '28px',
              width: '28px',
              backgroundColor: '#5D74E9',
              borderRadius: '4px',
            }}
          />
        )}
      </NavigationHeader>
      <NavigationOptionCategory title="Category Title 1">
        <NavigationOption
          title={'Option 1-1'}
          icon={hasIcon ? DownloadIcon : undefined}
        >
          <NavigationOption title={'Option 1-1-1'} />
        </NavigationOption>
        <NavigationOption
          title={'Option 1-2'}
          icon={hasIcon ? EyeIcon : undefined}
        >
          <NavigationOption title={'Option 1-2-1'} />
        </NavigationOption>
        <NavigationOption
          title={'Option 1-3'}
          icon={hasIcon ? UploadIcon : undefined}
        >
          <NavigationOption title={'Option 1-3-1'} />
        </NavigationOption>
        <NavigationOption
          title={'Option 1-4'}
          icon={hasIcon ? UploadIcon : undefined}
        />
      </NavigationOptionCategory>
      <NavigationOptionCategory title="Category Title 2">
        <NavigationOption
          title={'Option 2-1'}
          icon={hasIcon ? UploadIcon : undefined}
        >
          <NavigationOption title={'Option 2-1-1'}>
            <NavigationOption title={'Option 2-1-1-1'} />
          </NavigationOption>
        </NavigationOption>
      </NavigationOptionCategory>
      <NavigationOptionCategory title="Category Title 3">
        <NavigationOption
          title={'Option 3-1'}
          icon={hasIcon ? UploadIcon : undefined}
        >
          <NavigationOption title={'Option 3-1-1'}>
            <NavigationOption title={'Option 3-1-1-1'} />
          </NavigationOption>
        </NavigationOption>
        <NavigationOption
          title={'Option 4'}
          icon={hasIcon ? FolderIcon : undefined}
        />
        <NavigationOption
          title={'Option 5'}
          icon={hasIcon ? FolderIcon : undefined}
        />
      </NavigationOptionCategory>
      <NavigationFooter>
        <NavigationUserMenu imgSrc="1">User Name</NavigationUserMenu>
        <NavigationIconButton icon={QuestionOutlineIcon} />
        <Badge variant="dot-error">
          <NavigationIconButton icon={NotificationIcon} />
        </Badge>
      </NavigationFooter>
    </>
  );

  return (
    <div style={{ display: 'flex', gap: '48px', height: 'calc(100vh - 32px)' }}>
      <Navigation onOptionClick={setActive} activatedPath={active}>
        {navChildren(true, true)}
      </Navigation>
      <Navigation onOptionClick={setActive} activatedPath={active}>
        {navChildren(true, false)}
      </Navigation>
      <Navigation
        onOptionClick={setActive}
        activatedPath={active}
        collapsed={collapsed}
        onCollapseChange={setCollapsed}
      >
        {navChildren(false, true)}
      </Navigation>
      <p style={{ height: '20px' }}>{active?.join(' , ')}</p>
    </div>
  );
};

All.args = {};

All.argTypes = {};

All.parameters = {
  // 移除預設padding
  layout: 'fullscreen',
};
