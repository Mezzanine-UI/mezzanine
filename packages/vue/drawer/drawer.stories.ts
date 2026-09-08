import type { StoryObj } from '@storybook/vue3-vite';
import { h, onMounted, ref } from 'vue';
import type { FunctionalComponent } from 'vue';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';
import {
  CheckedFilledIcon,
  ChevronLeftIcon,
  ClockIcon,
  CloseIcon,
  DownloadIcon,
  InfoOutlineIcon,
  PlusIcon,
  UploadIcon,
} from '@mezzanine-ui/icons';
import MznButton from '../button/button.vue';
import MznModal from '../modal/modal.vue';
import MznTypography from '../typography/typography.vue';
import MznDrawer from './drawer.vue';
import type { DrawerProps } from './drawer.types';

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

const CustomComponent: FunctionalComponent<{ records: number[] }> = (props) =>
  h(
    'div',
    props.records.map((item) => h('div', { key: item }, item)),
  );

CustomComponent.props = { records: { required: true, type: Array } };

const STORY_COMPONENTS = {
  CustomComponent,
  MznButton,
  MznDrawer,
  MznModal,
  MznTypography,
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
  render: (args) => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const open = ref(false);
      const state = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      onMounted(() => {
        setTimeout(() => {
          state.value = state.value.slice(0, 4);
        }, 2000);
      });

      return {
        args,
        handleClose: (): void => {
          open.value = false;
        },
        open,
        state,
      };
    },
    template: `
      <MznButton variant="base-text-link" @click="open = true">OPEN</MznButton>

      <MznDrawer
        v-bind="args"
        :bottomOnGhostActionClick="handleClose"
        :bottomOnPrimaryActionClick="handleClose"
        :bottomOnSecondaryActionClick="handleClose"
        :contentKey="state.length"
        :open="open"
        @close="handleClose"
      >
        <CustomComponent :records="state" />
      </MznDrawer>
    `,
  }),
};

export const WithControlBar: StoryObj<DrawerProps> = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const open = ref(false);
      const filter = ref('all');

      return {
        filter,
        handleClose: (): void => {
          open.value = false;
        },
        onCustomButtonClick: (): void => {
          alert('清除篩選');
        },
        onRadioChange: (event: Event): void => {
          filter.value = (event.target as HTMLInputElement).value;
        },
        open,
      };
    },
    template: `
      <MznButton variant="base-text-link" @click="open = true">
        開啟 Drawer (預設控制列)
      </MznButton>

      <MznDrawer
        filterAreaAllRadioLabel="全部"
        filterAreaCustomButtonLabel="清除"
        filterAreaDefaultValue="all"
        :filterAreaOnCustomButtonClick="onCustomButtonClick"
        :filterAreaOnRadioChange="onRadioChange"
        filterAreaReadRadioLabel="進行中"
        filterAreaShow
        filterAreaShowUnreadButton
        filterAreaUnreadRadioLabel="已完成"
        :filterAreaValue="filter"
        headerTitle="內容篩選器"
        isHeaderDisplay
        :open="open"
        size="narrow"
        @close="handleClose"
      >
        <div style="padding: 16px">
          <MznTypography variant="body">
            當前篩選:
            {{ filter === 'all' ? '全部' : filter === 'read' ? '進行中' : '已完成' }}
          </MznTypography>
          <div style="margin-top: 16px">
            <MznTypography variant="body">這是 Drawer 的內容區域</MznTypography>
          </div>
        </div>
      </MznDrawer>
    `,
  }),
};

export const WithControlBarButtonOnly: StoryObj<DrawerProps> = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const open = ref(false);

      return {
        handleClose: (): void => {
          open.value = false;
        },
        onCustomButtonClick: (): void => {
          alert('重置');
        },
        open,
      };
    },
    template: `
      <MznButton variant="base-text-link" @click="open = true">
        開啟 Drawer (僅控制列按鈕)
      </MznButton>

      <MznDrawer
        filterAreaCustomButtonLabel="重置全部"
        :filterAreaOnCustomButtonClick="onCustomButtonClick"
        filterAreaShow
        headerTitle="設定"
        isHeaderDisplay
        :open="open"
        size="narrow"
        @close="handleClose"
      >
        <div style="padding: 16px">
          <MznTypography variant="body">
            這個 Drawer 的控制列只有按鈕，沒有 Radio Group
          </MznTypography>
        </div>
      </MznDrawer>
    `,
  }),
};

export const WithBottomActionStates: StoryObj<DrawerProps> = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const open = ref(false);
      const loading = ref(false);

      const handleClose = (): void => {
        open.value = false;
      };

      return {
        handleClose,
        handleSubmit: (): void => {
          loading.value = true;
          setTimeout(() => {
            loading.value = false;
            handleClose();
          }, 2000);
        },
        loading,
        onSecondaryActionClick: (): void => {
          alert('返回上一步');
        },
        open,
      };
    },
    template: `
      <MznButton variant="base-text-link" @click="open = true">
        開啟 Drawer (按鈕狀態控制)
      </MznButton>

      <MznDrawer
        bottomGhostActionText="取消"
        :bottomOnGhostActionClick="handleClose"
        :bottomOnPrimaryActionClick="handleSubmit"
        :bottomOnSecondaryActionClick="onSecondaryActionClick"
        :bottomPrimaryActionDisabled="loading"
        :bottomPrimaryActionLoading="loading"
        bottomPrimaryActionText="提交"
        :bottomSecondaryActionDisabled="loading"
        bottomSecondaryActionText="返回上一步"
        headerTitle="表單提交"
        isBottomDisplay
        isHeaderDisplay
        :open="open"
        size="medium"
        @close="handleClose"
      >
        <div style="padding: 16px">
          <MznTypography variant="body">
            此範例展示如何使用 disabled 和 loading
            狀態來控制按鈕的行為和外觀。
          </MznTypography>
          <br />
          <MznTypography variant="body">
            點擊「提交」按鈕會顯示 loading 狀態，並在 2 秒後關閉 Drawer。
          </MznTypography>
        </div>
      </MznDrawer>
    `,
  }),
};

export const WithCustomButtonVariants: StoryObj<DrawerProps> = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const open = ref(false);

      return {
        CheckedFilledIcon,
        ChevronLeftIcon,
        CloseIcon,
        handleClose: (): void => {
          open.value = false;
        },
        open,
      };
    },
    template: `
      <MznButton variant="base-text-link" @click="open = true">
        開啟 Drawer (自訂按鈕樣式)
      </MznButton>

      <MznDrawer
        :bottomGhostActionIcon="CloseIcon"
        bottomGhostActionIconType="leading"
        bottomGhostActionText="關閉"
        bottomGhostActionVariant="base-text-link"
        :bottomOnGhostActionClick="handleClose"
        :bottomOnPrimaryActionClick="handleClose"
        :bottomOnSecondaryActionClick="handleClose"
        :bottomPrimaryActionIcon="CheckedFilledIcon"
        bottomPrimaryActionIconType="trailing"
        bottomPrimaryActionSize="minor"
        bottomPrimaryActionText="確認"
        :bottomSecondaryActionIcon="ChevronLeftIcon"
        bottomSecondaryActionIconType="leading"
        bottomSecondaryActionSize="minor"
        bottomSecondaryActionText="返回"
        headerTitle="自訂按鈕"
        isBottomDisplay
        isHeaderDisplay
        :open="open"
        size="medium"
        @close="handleClose"
      >
        <div style="padding: 16px">
          <MznTypography variant="body">
            此範例展示如何自訂按鈕的 variant、size、icon 和 iconType。
          </MznTypography>
        </div>
      </MznDrawer>
    `,
  }),
};

export const WithModalWhileDrawerOpen: StoryObj<DrawerProps> = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const drawerOpen = ref(false);
      const modalOpen = ref(false);

      return {
        drawerOpen,
        handleDrawerClose: (): void => {
          drawerOpen.value = false;
          modalOpen.value = false;
        },
        handleModalClose: (): void => {
          modalOpen.value = false;
        },
        handleModalConfirm: (): void => {
          modalOpen.value = false;
        },
        modalOpen,
      };
    },
    template: `
      <MznButton variant="base-text-link" @click="drawerOpen = true">
        開啟 Drawer (測試 Modal 互動)
      </MznButton>

      <MznDrawer
        headerTitle="Drawer 與 Modal 互動測試"
        isHeaderDisplay
        :open="drawerOpen"
        size="medium"
        @close="handleDrawerClose"
      >
        <div style="padding: 16px">
          <MznTypography variant="body">
            點擊下方按鈕可以在 Drawer 中打開一個
            Modal，用於測試兩者的層級和互動關係。
          </MznTypography>
          <div style="margin-top: 16px">
            <MznButton variant="base-primary" @click="modalOpen = true">
              打開 Modal
            </MznButton>
          </div>
        </div>
      </MznDrawer>

      <MznModal
        cancelText="取消"
        confirmText="確認"
        :disableCloseOnBackdropClick="false"
        :disableCloseOnEscapeKeyDown="false"
        modalStatusType="info"
        modalType="standard"
        :open="modalOpen"
        showCancelButton
        showDismissButton
        showModalFooter
        showModalHeader
        size="regular"
        title="基本 Modal"
        @cancel="handleModalClose"
        @close="handleModalClose"
        @confirm="handleModalConfirm"
      >
        <MznTypography variant="body">
          這是一個從 Drawer 中打開的基本 Modal。
        </MznTypography>
        <br />
        <MznTypography variant="body">
          測試 z-index 和背景遮罩是否正常運作。
        </MznTypography>
      </MznModal>
    `,
  }),
};

export const WithFilterBarDropdown: StoryObj<DrawerProps> = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const open = ref(false);
      const selected = ref('');

      const filterOptions: DropdownOption[] = [
        { id: 'import', name: '匯入', icon: DownloadIcon },
        { id: 'export', name: '匯出', icon: UploadIcon, showUnderline: true },
        { id: 'past-version', name: '過去版本', icon: ClockIcon },
      ];

      return {
        filterOptions,
        handleClose: (): void => {
          open.value = false;
        },
        onSelect: (option: DropdownOption): void => {
          selected.value = option.id;
        },
        open,
        selected,
      };
    },
    template: `
      <MznButton variant="base-text-link" @click="open = true">
        開啟 Drawer (篩選 Dropdown)
      </MznButton>

      <MznDrawer
        filterAreaAllRadioLabel="今日"
        filterAreaReadRadioLabel="本月"
        filterAreaShow
        :filterAreaOnSelect="onSelect"
        :filterAreaOptions="filterOptions"
        headerTitle="篩選器 Dropdown 示範"
        isHeaderDisplay
        :open="open"
        size="narrow"
        @close="handleClose"
      >
        <div style="padding: 16px">
          <MznTypography variant="body">
            已選擇篩選：{{ selected || '（尚未選擇）' }}
          </MznTypography>
        </div>
      </MznDrawer>
    `,
  }),
};

export const WithFilterAreaOnCustomButton: StoryObj<DrawerProps> = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const open = ref(false);

      return {
        handleClose: (): void => {
          open.value = false;
        },
        onCustomButtonClick: (): void => {
          alert('清除篩選');
        },
        open,
      };
    },
    template: `
      <MznButton variant="base-text-link" @click="open = true">
        開啟 Drawer (篩選 Dropdown)
      </MznButton>

      <MznDrawer
        filterAreaAllRadioLabel="今日"
        filterAreaReadRadioLabel="本月"
        filterAreaShow
        :filterAreaOnCustomButtonClick="onCustomButtonClick"
        headerTitle="篩選器 Dropdown 示範"
        isHeaderDisplay
        :open="open"
        size="narrow"
        @close="handleClose"
      />
    `,
  }),
};

export const WithContentKeyAutoFallback: StoryObj<DrawerProps> = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const open = ref(false);
      const state = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      return {
        handleClose: (): void => {
          open.value = false;
        },
        handleReduceItems: (): void => {
          state.value = state.value.slice(0, 3);
        },
        handleReset: (): void => {
          state.value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        },
        open,
        state,
      };
    },
    template: `
      <MznButton variant="base-text-link" @click="open = true">
        開啟 Drawer (自動清理機制測試)
      </MznButton>

      <MznDrawer
        headerTitle="自動清理機制測試"
        isHeaderDisplay
        :open="open"
        size="medium"
        @close="handleClose"
      >
        <div style="padding: 16px">
          <MznTypography variant="body">目前項目數量: {{ state.length }}</MznTypography>
          <MznTypography variant="body" style="margin-top: 8px">
            沒有傳入 contentKey，但當 Drawer 重新開啟時會自動清理內容。
          </MznTypography>
          <div style="margin-top: 16px">
            <MznButton size="minor" variant="base-secondary" @click="handleReduceItems">
              減少到 3 個項目
            </MznButton>
            <MznButton
              size="minor"
              style="margin-left: 8px"
              variant="base-secondary"
              @click="handleReset"
            >
              重置為 10 個項目
            </MznButton>
          </div>
          <div style="margin-top: 16px">
            <CustomComponent :records="state" />
          </div>
          <MznTypography variant="body" style="margin-top: 16px">
            測試步驟:
            <br />
            1. 減少到 3 個項目（可能會看到殘留）
            <br />
            2. 關閉並重新開啟 Drawer（自動清理）
            <br />
            3. 應該只會看到 3 個項目
          </MznTypography>
        </div>
      </MznDrawer>
    `,
  }),
};
