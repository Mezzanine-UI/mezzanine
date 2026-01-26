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

export default {
  title: 'Navigation/Navigation',
} as Meta;

const userMenuOptions = [
  { id: 'member', name: '帳號設定' },
  { id: 'logout', name: '登出' },
];

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
      <NavigationOption title={'NavigationOption 1'}>
        <NavigationOption title={'NavigationOption 1-1-1'} />
      </NavigationOption>
      <NavigationOption title={'NavigationOption 2'}>
        <NavigationOption title={'NavigationOption 1-2-1'} />
      </NavigationOption>
      <NavigationOption title={'NavigationOption 3'}>
        <Badge variant="count-brand" count={5} />
        <NavigationOption title={'NavigationOption 3-1'} />
      </NavigationOption>
      <NavigationOption title={'NavigationOption 4'} />
      <>
        {Array.from(Array(20)).map((_, index) => (
          <NavigationOption title={'Nav' + index} key={index}>
            <NavigationOption title={'Nav' + index + ':Option'} />
          </NavigationOption>
        ))}
      </>
      <NavigationFooter>
        <NavigationUserMenu imgSrc="1" options={userMenuOptions}>
          User Name
        </NavigationUserMenu>
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
  const [collapsed, setCollapsed] = useState(true);

  const navChildren = (hasIcon: boolean, hasLogo: boolean) => (
    <>
      <NavigationHeader
        title="Navigation"
        onBrandClick={() => alert('Brand clicked')}
      >
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
          title={'Option 3-2'}
          icon={hasIcon ? UploadIcon : undefined}
        >
          <NavigationOption title={'Option 3-2-1'}>
            <NavigationOption title={'Option 3-2-1-1'} />
          </NavigationOption>
        </NavigationOption>
        <NavigationOption
          title={'Option 3-3'}
          icon={hasIcon ? UploadIcon : undefined}
        >
          <NavigationOption title={'Option 3-3-1'}>
            <NavigationOption title={'Option 3-3-1-1'} />
          </NavigationOption>
        </NavigationOption>
        <NavigationOption
          href="#option-3-4"
          title={'Option 3-4'}
          icon={hasIcon ? FolderIcon : undefined}
        />
        <NavigationOption
          onTriggerClick={(path, currentKey) => {
            alert(
              'Option 3-5 clicked' +
                path.join(' > ') +
                ', currentKey: ' +
                currentKey,
            );
          }}
          title={'Option 3-5'}
          icon={hasIcon ? FolderIcon : undefined}
        />
      </NavigationOptionCategory>
      <NavigationFooter>
        <NavigationUserMenu
          options={userMenuOptions}
          onSelect={(v) => {
            alert(v.name);
          }}
          imgSrc="1"
        >
          User Name
        </NavigationUserMenu>
        <NavigationIconButton icon={QuestionOutlineIcon} />
        <Badge variant="dot-error">
          <NavigationIconButton icon={NotificationIcon} />
        </Badge>
      </NavigationFooter>
    </>
  );

  return (
    <div style={{ display: 'flex', gap: '48px', height: 'calc(100vh - 32px)' }}>
      <Navigation filter onOptionClick={setActive} activatedPath={active}>
        {navChildren(true, true)}
      </Navigation>
      <Navigation filter onOptionClick={setActive} activatedPath={active}>
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
