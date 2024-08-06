import { RefObject, MouseEvent, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { Meta, StoryFn } from '@storybook/react';
import { MoreVerticalIcon } from '@mezzanine-ui/icons';
import AppBar, { AppBarBrand, AppBarMain, AppBarSupport } from '../AppBar';
import Button from '../Button/Button';
import Dropdown from '../Dropdown';
import Icon from '../Icon';
import Menu, { MenuItem } from '../Menu';
import PageFooter, { PageFooterProps } from './PageFooter';

export default {
  title: 'Navigation/PageFooter',
} as Meta;

const pageFooterArgs = {
  cancelText: 'cancel',
  confirmText: 'ok',
  danger: false,
  loading: false,
  onCancel: action('onCancel'),
  onConfirm: action('onConfirm'),
};

export const Basic: StoryFn<PageFooterProps> = ({
  cancelText,
  confirmText,
  danger,
  loading,
  onCancel,
  onConfirm,
}) => (
  <PageFooter
    cancelText={cancelText}
    confirmText={confirmText}
    confirmButtonProps={{
      type: 'submit',
    }}
    danger={danger}
    loading={loading}
    onCancel={onCancel}
    onConfirm={onConfirm}
  />
);

Basic.args = pageFooterArgs;

export const WithDropdown: StoryFn<PageFooterProps> = ({
  cancelText,
  confirmText,
  danger,
  loading,
  onCancel,
  onConfirm,
}) => {
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);

  const open = Boolean(anchor);

  const onClose = () => {
    setAnchor(null);
  };

  return (
    <PageFooter
      cancelText={cancelText}
      confirmText={confirmText}
      danger={danger}
      loading={loading}
      onCancel={onCancel}
      onConfirm={onConfirm}
    >
      <Dropdown
        menu={
          <Menu style={{ border: 0 }}>
            <MenuItem>item 1</MenuItem>
            <MenuItem>item 2</MenuItem>
            <MenuItem>item 3</MenuItem>
            <MenuItem>item 4</MenuItem>
          </Menu>
        }
        onClose={onClose}
        popperProps={{
          open,
        }}
      >
        {(ref) => (
          <Button
            ref={ref as RefObject<HTMLButtonElement>}
            onClick={(event: MouseEvent<HTMLButtonElement>) => {
              event.stopPropagation();
              setAnchor(
                anchor === event.currentTarget ? null : event.currentTarget,
              );
            }}
            suffix={<Icon icon={MoreVerticalIcon} />}
            variant="text"
          >
            Dropdown
          </Button>
        )}
      </Dropdown>
    </PageFooter>
  );
};

WithDropdown.args = pageFooterArgs;

export const WithAppBar: StoryFn<PageFooterProps> = ({
  cancelText,
  confirmText,
  danger,
  loading,
  onCancel,
  onConfirm,
}) => (
  <div
    style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}
  >
    <AppBar orientation="horizontal">
      <AppBarSupport>Support</AppBarSupport>
      <AppBarMain>Main</AppBarMain>
      <AppBarBrand>Brand</AppBarBrand>
    </AppBar>
    <PageFooter
      cancelText={cancelText}
      confirmText={confirmText}
      danger={danger}
      loading={loading}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  </div>
);

WithAppBar.args = pageFooterArgs;

export const WithMenuNavigation: StoryFn<PageFooterProps> = ({
  cancelText,
  confirmText,
  danger,
  loading,
  onCancel,
  onConfirm,
}) => (
  <div
    style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <AppBar orientation="horizontal">
      <AppBarSupport>Support</AppBarSupport>
      <AppBarMain>Main</AppBarMain>
      <AppBarBrand>Brand</AppBarBrand>
    </AppBar>
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <div
        style={{
          width: 200,
          backgroundColor: '#fff',
          border: 'solid 1px #d9d9d9',
        }}
      >
        MenuNavigation
      </div>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>CONTENT</div>
        <PageFooter
          cancelText={cancelText}
          confirmText={confirmText}
          danger={danger}
          loading={loading}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </div>
    </div>
  </div>
);

WithMenuNavigation.args = pageFooterArgs;
