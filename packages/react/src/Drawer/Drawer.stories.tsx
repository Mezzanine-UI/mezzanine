import React, { useCallback, useEffect, useState } from 'react';
import { StoryObj } from '@storybook/react-webpack5';
import {
  CheckedFilledIcon,
  ChevronLeftIcon,
  CloseIcon,
  InfoOutlineIcon,
  PlusIcon,
} from '@mezzanine-ui/icons';
import Drawer, { DrawerProps } from '.';
import { Button, Modal, Typography } from '../index';

// Icon mapping for Storybook controls
const iconOptions = {
  None: undefined,
  Check: CheckedFilledIcon,
  ChevronLeft: ChevronLeftIcon,
  Close: CloseIcon,
  InfoOutline: InfoOutlineIcon,
  Plus: PlusIcon,
};

export default {
  title: 'Feedback/Drawer',
};

const CustomComponent: React.FC<{ records: number[] }> = ({ records }) => {
  return (
    <div>
      {records.map((item) => (
        <div key={item}>{item}</div>
      ))}
    </div>
  );
};

export const Playground: StoryObj<DrawerProps> = {
  argTypes: {
    bottomGhostActionDisabled: {
      control: { type: 'boolean' },
      table: { category: 'Bottom Ghost Action' },
    },
    bottomGhostActionIcon: {
      control: { type: 'select' },
      mapping: iconOptions,
      options: Object.keys(iconOptions),
      table: { category: 'Bottom Ghost Action' },
    },
    bottomGhostActionIconType: {
      control: { type: 'select' },
      options: ['leading', 'trailing', 'icon-only'],
      table: { category: 'Bottom Ghost Action' },
    },
    bottomGhostActionLoading: {
      control: { type: 'boolean' },
      table: { category: 'Bottom Ghost Action' },
    },
    bottomGhostActionSize: {
      control: { type: 'select' },
      options: ['minor', 'main', 'major'],
      table: { category: 'Bottom Ghost Action' },
    },
    bottomGhostActionText: {
      control: { type: 'text' },
      table: { category: 'Bottom Ghost Action' },
    },
    bottomGhostActionVariant: {
      control: { type: 'select' },
      options: [
        'base-primary',
        'base-secondary',
        'base-ghost',
        'base-text-link',
      ],
      table: { category: 'Bottom Ghost Action' },
    },
    bottomPrimaryActionDisabled: {
      control: { type: 'boolean' },
      table: { category: 'Bottom Primary Action' },
    },
    bottomPrimaryActionIcon: {
      control: { type: 'select' },
      mapping: iconOptions,
      options: Object.keys(iconOptions),
      table: { category: 'Bottom Primary Action' },
    },
    bottomPrimaryActionIconType: {
      control: { type: 'select' },
      options: ['leading', 'trailing', 'icon-only'],
      table: { category: 'Bottom Primary Action' },
    },
    bottomPrimaryActionLoading: {
      control: { type: 'boolean' },
      table: { category: 'Bottom Primary Action' },
    },
    bottomPrimaryActionSize: {
      control: { type: 'select' },
      options: ['minor', 'main', 'major'],
      table: { category: 'Bottom Primary Action' },
    },
    bottomPrimaryActionText: {
      control: { type: 'text' },
      table: { category: 'Bottom Primary Action' },
    },
    bottomPrimaryActionVariant: {
      control: { type: 'select' },
      options: [
        'base-primary',
        'base-secondary',
        'base-ghost',
        'base-text-link',
      ],
      table: { category: 'Bottom Primary Action' },
    },
    bottomSecondaryActionDisabled: {
      control: { type: 'boolean' },
      table: { category: 'Bottom Secondary Action' },
    },
    bottomSecondaryActionIcon: {
      control: { type: 'select' },
      mapping: iconOptions,
      options: Object.keys(iconOptions),
      table: { category: 'Bottom Secondary Action' },
    },
    bottomSecondaryActionIconType: {
      control: { type: 'select' },
      options: ['leading', 'trailing', 'icon-only'],
      table: { category: 'Bottom Secondary Action' },
    },
    bottomSecondaryActionLoading: {
      control: { type: 'boolean' },
      table: { category: 'Bottom Secondary Action' },
    },
    bottomSecondaryActionSize: {
      control: { type: 'select' },
      options: ['minor', 'main', 'major'],
      table: { category: 'Bottom Secondary Action' },
    },
    bottomSecondaryActionText: {
      control: { type: 'text' },
      table: { category: 'Bottom Secondary Action' },
    },
    bottomSecondaryActionVariant: {
      control: { type: 'select' },
      options: [
        'base-primary',
        'base-secondary',
        'base-ghost',
        'base-text-link',
      ],
      table: { category: 'Bottom Secondary Action' },
    },
    disableCloseOnBackdropClick: {
      control: { type: 'boolean' },
      table: { category: 'Drawer Settings' },
    },
    disableCloseOnEscapeKeyDown: {
      control: { type: 'boolean' },
      table: { category: 'Drawer Settings' },
    },
    headerTitle: {
      control: { type: 'text' },
      table: { category: 'Drawer Settings' },
    },
    isBottomDisplay: {
      control: { type: 'boolean' },
      table: { category: 'Drawer Settings' },
    },
    isHeaderDisplay: {
      control: { type: 'boolean' },
      table: { category: 'Drawer Settings' },
    },
    size: {
      control: { type: 'radio' },
      options: ['narrow', 'medium', 'wide'],
      table: { category: 'Drawer Settings' },
    },
  },
  args: {
    bottomGhostActionDisabled: false,
    bottomGhostActionIcon: undefined,
    bottomGhostActionIconType: undefined,
    bottomGhostActionLoading: false,
    bottomGhostActionSize: undefined,
    bottomGhostActionText: '更多選項',
    bottomGhostActionVariant: 'base-ghost',
    bottomPrimaryActionDisabled: false,
    bottomPrimaryActionIcon: undefined,
    bottomPrimaryActionIconType: undefined,
    bottomPrimaryActionLoading: false,
    bottomPrimaryActionSize: undefined,
    bottomPrimaryActionText: '儲存變更',
    bottomPrimaryActionVariant: 'base-primary',
    bottomSecondaryActionDisabled: false,
    bottomSecondaryActionIcon: undefined,
    bottomSecondaryActionIconType: undefined,
    bottomSecondaryActionLoading: false,
    bottomSecondaryActionSize: undefined,
    bottomSecondaryActionText: '取消',
    bottomSecondaryActionVariant: 'base-secondary',
    disableCloseOnBackdropClick: false,
    disableCloseOnEscapeKeyDown: false,
    headerTitle: 'Drawer Title',
    isBottomDisplay: true,
    isHeaderDisplay: true,
    size: 'medium',
  },
  render: function Render({
    bottomGhostActionDisabled,
    bottomGhostActionIcon,
    bottomGhostActionIconType,
    bottomGhostActionLoading,
    bottomGhostActionSize,
    bottomGhostActionText,
    bottomGhostActionVariant,
    bottomPrimaryActionDisabled,
    bottomPrimaryActionIcon,
    bottomPrimaryActionIconType,
    bottomPrimaryActionLoading,
    bottomPrimaryActionSize,
    bottomPrimaryActionText,
    bottomPrimaryActionVariant,
    bottomSecondaryActionDisabled,
    bottomSecondaryActionIcon,
    bottomSecondaryActionIconType,
    bottomSecondaryActionLoading,
    bottomSecondaryActionSize,
    bottomSecondaryActionText,
    bottomSecondaryActionVariant,
    disableCloseOnBackdropClick,
    disableCloseOnEscapeKeyDown,
    headerTitle,
    isBottomDisplay,
    isHeaderDisplay,
    size,
  }) {
    const [open, setOpen] = useState(false);
    const [state, setState] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    useEffect(() => {
      setTimeout(() => {
        setState((prev) => [...prev.slice(0, 4)]);
      }, 2000);
    }, []);

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
          bottomGhostActionDisabled={bottomGhostActionDisabled}
          bottomGhostActionIcon={bottomGhostActionIcon}
          bottomGhostActionIconType={bottomGhostActionIconType}
          bottomGhostActionLoading={bottomGhostActionLoading}
          bottomGhostActionSize={bottomGhostActionSize}
          bottomGhostActionText={bottomGhostActionText}
          bottomGhostActionVariant={bottomGhostActionVariant}
          bottomOnGhostActionClick={handleClose}
          bottomOnPrimaryActionClick={handleClose}
          bottomOnSecondaryActionClick={handleClose}
          bottomPrimaryActionDisabled={bottomPrimaryActionDisabled}
          bottomPrimaryActionIcon={bottomPrimaryActionIcon}
          bottomPrimaryActionIconType={bottomPrimaryActionIconType}
          bottomPrimaryActionLoading={bottomPrimaryActionLoading}
          bottomPrimaryActionSize={bottomPrimaryActionSize}
          bottomPrimaryActionText={bottomPrimaryActionText}
          bottomPrimaryActionVariant={bottomPrimaryActionVariant}
          bottomSecondaryActionDisabled={bottomSecondaryActionDisabled}
          bottomSecondaryActionIcon={bottomSecondaryActionIcon}
          bottomSecondaryActionIconType={bottomSecondaryActionIconType}
          bottomSecondaryActionLoading={bottomSecondaryActionLoading}
          bottomSecondaryActionSize={bottomSecondaryActionSize}
          bottomSecondaryActionText={bottomSecondaryActionText}
          bottomSecondaryActionVariant={bottomSecondaryActionVariant}
          disableCloseOnBackdropClick={disableCloseOnBackdropClick}
          disableCloseOnEscapeKeyDown={disableCloseOnEscapeKeyDown}
          headerTitle={headerTitle}
          isBottomDisplay={isBottomDisplay}
          isHeaderDisplay={isHeaderDisplay}
          onClose={handleClose}
          open={open}
          size={size}
        >
          <CustomComponent records={state} />
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

export const WithControlBarButtonOnly: StoryObj<DrawerProps> = {
  render: function Render() {
    const [open, setOpen] = useState(false);

    const handleClose = useCallback(() => setOpen(false), []);

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="base-text-link">
          開啟 Drawer (僅控制列按鈕)
        </Button>

        <Drawer
          controlBarCustomButtonLabel="重置全部"
          controlBarOnCustomButtonClick={() => alert('重置')}
          controlBarShow
          headerTitle="設定"
          isHeaderDisplay
          onClose={handleClose}
          open={open}
          size="narrow"
        >
          <div style={{ padding: '16px' }}>
            <Typography variant="body">
              這個 Drawer 的控制列只有按鈕，沒有 Radio Group
            </Typography>
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

export const WithBottomActionStates: StoryObj<DrawerProps> = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClose = useCallback(() => setOpen(false), []);

    const handleSubmit = useCallback(() => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        handleClose();
      }, 2000);
    }, [handleClose]);

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="base-text-link">
          開啟 Drawer (按鈕狀態控制)
        </Button>

        <Drawer
          bottomGhostActionText="取消"
          bottomOnGhostActionClick={handleClose}
          bottomOnPrimaryActionClick={handleSubmit}
          bottomOnSecondaryActionClick={() => alert('返回上一步')}
          bottomPrimaryActionDisabled={loading}
          bottomPrimaryActionLoading={loading}
          bottomPrimaryActionText="提交"
          bottomSecondaryActionDisabled={loading}
          bottomSecondaryActionText="返回上一步"
          headerTitle="表單提交"
          isBottomDisplay
          isHeaderDisplay
          onClose={handleClose}
          open={open}
          size="medium"
        >
          <div style={{ padding: '16px' }}>
            <Typography variant="body">
              此範例展示如何使用 disabled 和 loading
              狀態來控制按鈕的行為和外觀。
            </Typography>
            <br />
            <Typography variant="body">
              點擊「提交」按鈕會顯示 loading 狀態，並在 2 秒後關閉 Drawer。
            </Typography>
          </div>
        </Drawer>
      </>
    );
  },
};

export const WithCustomButtonVariants: StoryObj<DrawerProps> = {
  render: function Render() {
    const [open, setOpen] = useState(false);

    const handleClose = useCallback(() => setOpen(false), []);

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="base-text-link">
          開啟 Drawer (自訂按鈕樣式)
        </Button>

        <Drawer
          bottomGhostActionIcon={CloseIcon}
          bottomGhostActionIconType="leading"
          bottomGhostActionText="關閉"
          bottomGhostActionVariant="base-text-link"
          bottomOnGhostActionClick={handleClose}
          bottomOnPrimaryActionClick={handleClose}
          bottomOnSecondaryActionClick={handleClose}
          bottomPrimaryActionIcon={CheckedFilledIcon}
          bottomPrimaryActionIconType="trailing"
          bottomPrimaryActionSize="minor"
          bottomPrimaryActionText="確認"
          bottomSecondaryActionIcon={ChevronLeftIcon}
          bottomSecondaryActionIconType="leading"
          bottomSecondaryActionSize="minor"
          bottomSecondaryActionText="返回"
          headerTitle="自訂按鈕"
          isBottomDisplay
          isHeaderDisplay
          onClose={handleClose}
          open={open}
          size="medium"
        >
          <div style={{ padding: '16px' }}>
            <Typography variant="body">
              此範例展示如何自訂按鈕的 variant、size、icon 和 iconType。
            </Typography>
          </div>
        </Drawer>
      </>
    );
  },
};

export const WithModalWhileDrawerOpen: StoryObj<DrawerProps> = {
  render: function Render() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const handleDrawerClose = useCallback(() => {
      setDrawerOpen(false);
      setModalOpen(false);
    }, []);
    const handleModalClose = useCallback(() => setModalOpen(false), []);
    const handleModalConfirm = useCallback(() => {
      setModalOpen(false);
    }, []);

    return (
      <>
        <Button onClick={() => setDrawerOpen(true)} variant="base-text-link">
          開啟 Drawer (測試 Modal 互動)
        </Button>

        <Drawer
          headerTitle="Drawer 與 Modal 互動測試"
          isHeaderDisplay
          onClose={handleDrawerClose}
          open={drawerOpen}
          size="medium"
        >
          <div style={{ padding: '16px' }}>
            <Typography variant="body">
              點擊下方按鈕可以在 Drawer 中打開一個
              Modal，用於測試兩者的層級和互動關係。
            </Typography>
            <div style={{ marginTop: '16px' }}>
              <Button onClick={() => setModalOpen(true)} variant="base-primary">
                打開 Modal
              </Button>
            </div>
          </div>
        </Drawer>

        <Modal
          cancelText="取消"
          confirmText="確認"
          disableCloseOnBackdropClick={false}
          disableCloseOnEscapeKeyDown={false}
          modalStatusType="info"
          modalType="standard"
          onCancel={handleModalClose}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
          open={modalOpen}
          showCancelButton
          showDismissButton
          showModalFooter
          showModalHeader
          size="regular"
          title="基本 Modal"
        >
          <Typography variant="body">
            這是一個從 Drawer 中打開的基本 Modal。
          </Typography>
          <br />
          <Typography variant="body">
            測試 z-index 和背景遮罩是否正常運作。
          </Typography>
        </Modal>
      </>
    );
  },
};
