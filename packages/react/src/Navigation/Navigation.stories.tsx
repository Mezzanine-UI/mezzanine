import { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react-webpack5';
import {
  CalendarIcon,
  DownloadIcon,
  FileIcon,
  FolderIcon,
  HomeIcon,
  ListIcon,
  NotificationIcon,
  QuestionOutlineIcon,
  SystemIcon,
  UploadIcon,
  UserIcon,
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
      <NavigationHeader title="Mezzanine">
        <span
          aria-label="logo"
          style={{
            backgroundColor: '#5D74E9',
            borderRadius: '4px',
            height: '28px',
            width: '28px',
          }}
        />
      </NavigationHeader>
      <NavigationOption icon={HomeIcon} title={'首頁'} />
      <NavigationOption icon={FileIcon} title={'數據分析'}>
        <NavigationOption title={'流量報表'} />
        <NavigationOption title={'轉換率分析'} />
      </NavigationOption>
      <NavigationOption icon={ListIcon} title={'訂單管理'}>
        <Badge count={5} variant="count-brand" />
        <NavigationOption title={'待處理訂單'} />
        <NavigationOption title={'已完成訂單'} />
      </NavigationOption>
      <NavigationOption icon={UserIcon} title={'會員管理'} />
      <>
        {Array.from(Array(5)).map((_, index) => (
          <NavigationOption
            icon={FolderIcon}
            key={index}
            title={`專案 ${index + 1}`}
          >
            <NavigationOption title={'專案設定'} />
            <NavigationOption title={'成員管理'} />
          </NavigationOption>
        ))}
      </>
      <NavigationFooter>
        <NavigationUserMenu
          imgSrc="https://i.pravatar.cc/150?u=admin"
          options={userMenuOptions}
        >
          王小明
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
        onBrandClick={() => alert('返回首頁')}
        title="企業管理平台"
      >
        {hasLogo && (
          <span
            aria-label="logo"
            style={{
              backgroundColor: '#5D74E9',
              borderRadius: '4px',
              height: '28px',
              width: '28px',
            }}
          />
        )}
      </NavigationHeader>
      <NavigationOptionCategory title="主要功能">
        <NavigationOption
          icon={hasIcon ? HomeIcon : undefined}
          title={'儀表板'}
        />
        <NavigationOption
          icon={hasIcon ? FileIcon : undefined}
          title={'數據分析'}
        >
          <NavigationOption title={'銷售報表'} />
          <NavigationOption title={'流量分析'} />
          <NavigationOption title={'用戶行為'} />
        </NavigationOption>
        <NavigationOption
          icon={hasIcon ? ListIcon : undefined}
          title={'訂單管理'}
        >
          <NavigationOption title={'全部訂單'} />
          <NavigationOption title={'待出貨'} />
          <NavigationOption title={'退換貨處理'} />
        </NavigationOption>
      </NavigationOptionCategory>
      <NavigationOptionCategory title="內容管理">
        <NavigationOption
          icon={hasIcon ? FileIcon : undefined}
          title={'文章管理'}
        >
          <NavigationOption title={'文章列表'}>
            <NavigationOption title={'已發布'} />
            <NavigationOption title={'草稿'} />
          </NavigationOption>
          <NavigationOption title={'分類設定'} />
        </NavigationOption>
        <NavigationOption
          icon={hasIcon ? FolderIcon : undefined}
          title={'媒體庫'}
        >
          <NavigationOption title={'圖片'} />
          <NavigationOption title={'影片'} />
          <NavigationOption title={'文件'} />
        </NavigationOption>
      </NavigationOptionCategory>
      <NavigationOptionCategory title="系統設定">
        <NavigationOption
          icon={hasIcon ? UserIcon : undefined}
          title={'用戶管理'}
        >
          <NavigationOption title={'用戶列表'}>
            <NavigationOption title={'活躍用戶'} />
            <NavigationOption title={'停用帳號'} />
          </NavigationOption>
          <NavigationOption title={'角色權限'} />
        </NavigationOption>
        <NavigationOption
          icon={hasIcon ? CalendarIcon : undefined}
          title={'排程任務'}
        >
          <NavigationOption title={'定時任務'}>
            <NavigationOption title={'資料備份'} />
            <NavigationOption title={'報表寄送'} />
          </NavigationOption>
          <NavigationOption title={'執行紀錄'} />
        </NavigationOption>
        <NavigationOption
          icon={hasIcon ? SystemIcon : undefined}
          title={'系統設定'}
        >
          <NavigationOption title={'基本設定'}>
            <NavigationOption title={'網站資訊'} />
            <NavigationOption title={'SEO 設定'} />
          </NavigationOption>
          <NavigationOption title={'安全性設定'} />
        </NavigationOption>
        <NavigationOption
          href="#download-center"
          icon={hasIcon ? DownloadIcon : undefined}
          title={'下載中心'}
        />
        <NavigationOption
          icon={hasIcon ? UploadIcon : undefined}
          onTriggerClick={(path, currentKey) => {
            alert(`匯入資料：${path.join(' > ')}，目前項目：${currentKey}`);
          }}
          title={'匯入資料'}
        />
      </NavigationOptionCategory>
      <NavigationFooter>
        <NavigationUserMenu
          imgSrc="https://i.pravatar.cc/150?u=manager"
          onSelect={(v) => {
            alert(v.name);
          }}
          options={userMenuOptions}
        >
          李經理
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
      <Navigation activatedPath={active} filter onOptionClick={setActive}>
        {navChildren(true, true)}
      </Navigation>
      <Navigation activatedPath={active} filter onOptionClick={setActive}>
        {navChildren(true, false)}
      </Navigation>
      <Navigation
        activatedPath={active}
        collapsed={collapsed}
        onCollapseChange={setCollapsed}
        onOptionClick={setActive}
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
