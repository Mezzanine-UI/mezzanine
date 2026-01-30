import { useCallback, useState } from 'react';
import { StoryObj } from '@storybook/react-webpack5';
import Drawer, { DrawerProps } from '.';
import { Button, Typography } from '../index';

export default {
  title: 'Feedback/Drawer',
};

export const Playground: StoryObj<DrawerProps> = {
  argTypes: {
    disableCloseOnBackdropClick: {
      control: {
        type: 'boolean',
      },
    },
    disableCloseOnEscapeKeyDown: {
      control: {
        type: 'boolean',
      },
    },
    isBottomDisplay: {
      control: {
        type: 'boolean',
      },
    },
    isHeaderDisplay: {
      control: {
        type: 'boolean',
      },
    },
    size: {
      control: {
        type: 'radio',
      },
      options: ['narrow', 'medium', 'wide'],
    },
  },
  args: {
    disableCloseOnBackdropClick: false,
    disableCloseOnEscapeKeyDown: false,
    isBottomDisplay: true,
    isHeaderDisplay: true,
    size: 'medium',
  },
  render: function Render({
    disableCloseOnBackdropClick,
    disableCloseOnEscapeKeyDown,
    isBottomDisplay,
    isHeaderDisplay,
    size,
  }) {
    const [open, setOpen] = useState(false);

    const handleClose = useCallback(() => setOpen(false), []);

    const handleClick = () => {
      setOpen(true);
    };

    return (
      <>
        <Button onClick={() => handleClick()} variant="base-text-link">
          OPEN
        </Button>

        <Drawer
          bottomGhostActionText="更多選項"
          bottomOnGhostActionClick={handleClose}
          bottomOnPrimaryActionClick={handleClose}
          bottomOnSecondaryActionClick={handleClose}
          bottomPrimaryActionText="儲存變更"
          bottomSecondaryActionText="取消"
          disableCloseOnBackdropClick={disableCloseOnBackdropClick}
          disableCloseOnEscapeKeyDown={disableCloseOnEscapeKeyDown}
          headerTitle="Drawer Title"
          isBottomDisplay={isBottomDisplay}
          isHeaderDisplay={isHeaderDisplay}
          onClose={handleClose}
          open={open}
          size={size}
        >
          content
        </Drawer>
      </>
    );
  },
};

export const WithControlBar: StoryObj<DrawerProps> = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState('all');

    const handleClose = useCallback(() => setOpen(false), []);

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="base-text-link">
          開啟 Drawer (預設控制列)
        </Button>

        <Drawer
          controlBarAllRadioLabel="全部"
          controlBarCustomButtonLabel="清除"
          controlBarDefaultValue="all"
          controlBarOnCustomButtonClick={() => alert('清除篩選')}
          controlBarOnRadioChange={(e) => setFilter(e.target.value)}
          controlBarReadRadioLabel="進行中"
          controlBarShow
          controlBarShowUnreadButton
          controlBarUnreadRadioLabel="已完成"
          controlBarValue={filter}
          headerTitle="內容篩選器"
          isHeaderDisplay
          onClose={handleClose}
          open={open}
          size="narrow"
        >
          <div style={{ padding: '16px' }}>
            <Typography variant="body">
              當前篩選:{' '}
              {filter === 'all'
                ? '全部'
                : filter === 'read'
                  ? '進行中'
                  : '已完成'}
            </Typography>
            <div style={{ marginTop: '16px' }}>
              <Typography variant="body">這是 Drawer 的內容區域</Typography>
            </div>
          </div>
        </Drawer>
      </>
    );
  },
};

export const WithCustomControlBar: StoryObj<DrawerProps> = {
  render: function Render() {
    const [open, setOpen] = useState(false);

    const handleClose = useCallback(() => setOpen(false), []);

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="base-text-link">
          開啟 Drawer (自訂控制列)
        </Button>

        <Drawer
          headerTitle="設定"
          isHeaderDisplay
          onClose={handleClose}
          open={open}
          renderControlBar={() => (
            <div
              style={{
                backgroundColor: '#f5f5f5',
                borderBottom: '2px solid #1976d2',
                padding: '12px 16px',
              }}
            >
              <div
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="text-link-body">快速操作</Typography>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    onClick={() => alert('重置')}
                    size="minor"
                    type="button"
                    variant="base-secondary"
                  >
                    重置
                  </Button>
                  <Button
                    onClick={() => alert('套用')}
                    size="minor"
                    type="button"
                    variant="base-primary"
                  >
                    套用
                  </Button>
                </div>
              </div>
            </div>
          )}
          size="medium"
        >
          <div style={{ padding: '16px' }}>
            <Typography variant="body">這是 Drawer 的內容區域</Typography>
          </div>
        </Drawer>
      </>
    );
  },
};
