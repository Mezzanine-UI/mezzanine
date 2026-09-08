import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h, ref } from 'vue';
import {
  DotHorizontalIcon,
  EditIcon,
  PlusIcon,
  TrashIcon,
} from '@mezzanine-ui/icons';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import MznAutoComplete from '../auto-complete/auto-complete.vue';
import MznButton from '../button/button.vue';
import MznDropdown from '../dropdown/dropdown.vue';
import MznFade from '../transition/fade.vue';
import MznTypography from '../typography/typography.vue';
import MznAccordionActions from './accordion-actions.vue';
import MznAccordionContent from './accordion-content.vue';
import MznAccordionGroup from './accordion-group.vue';
import MznAccordionTitle from './accordion-title.vue';
import MznAccordion from './accordion.vue';

export default {
  title: 'Data Display/Accordion',
} satisfies Meta;

type Story = StoryObj;

const STORY_COMPONENTS = {
  MznAccordion,
  MznAccordionActions,
  MznAccordionContent,
  MznAccordionGroup,
  MznAccordionTitle,
  MznAutoComplete,
  MznButton,
  MznFade,
  MznTypography,
};

export const Basic: Story = {
  render: () => ({
    components: STORY_COMPONENTS,
    template: `
      <div style="max-width: 680px; width: 100%; display: grid; gap: 32px">
        <MznTypography variant="h3">Accordion Group - Size Main</MznTypography>
        <MznAccordionGroup size="main">
          <MznAccordion title="付款方式" disabled>
            目前支援信用卡、Line Pay、Apple Pay 等多種付款方式，
            您可以在結帳時選擇最方便的付款選項。
          </MznAccordion>
          <MznAccordion title="運送政策" defaultExpanded>
            訂單成立後 1-3 個工作天內出貨，全台宅配約 1-2 天送達。 滿 $1,000
            享免運優惠，未滿則需支付 $80 運費。
          </MznAccordion>
          <MznAccordion title="退換貨須知">
            商品到貨後 7 天內可申請退換貨，請保持商品完整包裝。
            如有瑕疵或寄送錯誤，我們將負擔來回運費。
          </MznAccordion>
        </MznAccordionGroup>
        <MznTypography variant="h3">Accordion Group - Size Sub</MznTypography>
        <MznAccordionGroup size="sub">
          <MznAccordion title="付款方式" disabled>
            目前支援信用卡、Line Pay、Apple Pay 等多種付款方式，
            您可以在結帳時選擇最方便的付款選項。
          </MznAccordion>
          <MznAccordion title="運送政策" defaultExpanded>
            訂單成立後 1-3 個工作天內出貨，全台宅配約 1-2 天送達。 滿 $1,000
            享免運優惠，未滿則需支付 $80 運費。
          </MznAccordion>
          <MznAccordion title="退換貨須知">
            商品到貨後 7 天內可申請退換貨，請保持商品完整包裝。
            如有瑕疵或寄送錯誤，我們將負擔來回運費。
          </MznAccordion>
        </MznAccordionGroup>
      </div>
    `,
  }),
};

export const Controlled: Story = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const activeAccordion = ref(-1);

      return {
        activeAccordion,
        onChange: (index: number, open: boolean): void => {
          activeAccordion.value = open ? index : -1;
        },
      };
    },
    template: `
      <div style="max-width: 680px; width: 100%">
        <MznAccordionGroup>
          <MznAccordion
            :expanded="activeAccordion === 0"
            title="篩選條件"
            @change="(open) => onChange(0, open)"
          >
            您可以在此更新您的姓名、電子郵件與聯絡電話。 變更將在儲存後立即生效。
          </MznAccordion>
          <MznAccordion
            :expanded="activeAccordion === 1"
            title="安全性設定"
            @change="(open) => onChange(1, open)"
          >
            啟用雙重驗證以加強帳號安全，建議定期更換密碼，
            並避免使用與其他網站相同的密碼。
          </MznAccordion>
          <MznAccordion
            :expanded="activeAccordion === 2"
            title="通知偏好"
            @change="(open) => onChange(2, open)"
          >
            選擇您希望接收的通知類型，包含訂單更新、促銷活動、
            系統公告等，可隨時調整設定。
          </MznAccordion>
        </MznAccordionGroup>
      </div>
    `,
  }),
};

export const Exclusive: Story = {
  render: () => ({
    components: STORY_COMPONENTS,
    template: `
      <div style="max-width: 680px; width: 100%">
        <MznAccordionGroup exclusive>
          <MznAccordion title="付款方式">
            目前支援信用卡、Line Pay、Apple Pay 等多種付款方式，
            您可以在結帳時選擇最方便的付款選項。
          </MznAccordion>
          <MznAccordion title="運送政策">
            訂單成立後 1-3 個工作天內出貨，全台宅配約 1-2 天送達。 滿 $1,000
            享免運優惠，未滿則需支付 $80 運費。
          </MznAccordion>
          <MznAccordion title="退換貨須知">
            商品到貨後 7 天內可申請退換貨，請保持商品完整包裝。
            如有瑕疵或寄送錯誤，我們將負擔來回運費。
          </MznAccordion>
        </MznAccordionGroup>
      </div>
    `,
  }),
};

export const WithActions: Story = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const open = ref(false);
      const anchor = ref<HTMLButtonElement | null>(null);

      const onClose = (): void => {
        anchor.value = null;
        open.value = false;
      };

      const suffixDropdown = {
        children: h(
          MznDropdown,
          {
            onClose,
            onSelect: () => {
              open.value = false;
            },
            onVisibilityChange: (visible: boolean) => {
              open.value = visible;
            },
            open: open.value,
            options: [
              { id: 'view', name: '查看' },
              { id: 'edit', name: '編輯', showUnderline: true },
              { id: 'delete', name: '刪除', validate: 'danger' as const },
            ],
            placement: 'bottom-end' as const,
          },
          {
            default: (triggerProps: Record<string, unknown>) =>
              h(MznButton, {
                ...triggerProps,
                icon: DotHorizontalIcon,
                iconType: 'icon-only',
                onClick: (event: MouseEvent) => {
                  event.stopPropagation();
                  const target = event.currentTarget as HTMLButtonElement;

                  anchor.value = anchor.value === target ? null : target;
                  (triggerProps.onClick as (e: MouseEvent) => void)(event);
                },
                size: 'sub',
                variant: 'base-text-link',
              }),
          },
        ),
      };

      return { suffixDropdown };
    },
    template: `
      <div style="max-width: 680px; width: 100%">
        <MznAccordionGroup>
          <MznAccordion>
            <MznAccordionTitle id="accordion-1">
              篩選條件
              <MznAccordionActions>
                <MznButton size="main" variant="base-text-link">
                  編輯
                </MznButton>
                <MznButton
                  color="danger"
                  size="main"
                  variant="destructive-text-link"
                >
                  刪除
                </MznButton>
              </MznAccordionActions>
            </MznAccordionTitle>
            <MznAccordionContent
              style="display: flex; flex-direction: column; gap: 12px"
            >
              <MznAutoComplete
                :options="[
                  { id: 'electronics', name: '電子產品' },
                  { id: 'clothing', name: '服飾配件' },
                  { id: 'food', name: '食品飲料' },
                ]"
                placeholder="選擇產品分類"
              />
              <MznAutoComplete
                :options="[
                  { id: 'on-sale', name: '上架中' },
                  { id: 'off-shelf', name: '已下架' },
                  { id: 'out-of-stock', name: '缺貨中' },
                ]"
                placeholder="選擇商品狀態"
              />
            </MznAccordionContent>
          </MznAccordion>
          <MznAccordion defaultExpanded>
            <MznAccordionTitle id="accordion-2">產品說明文件</MznAccordionTitle>
            <MznAccordionContent>
              包含產品規格書、使用手冊與保固條款，
              請於購買前詳閱相關文件以了解產品功能與限制。
            </MznAccordionContent>
          </MznAccordion>
          <MznAccordion>
            <MznAccordionTitle id="accordion-3" :actions="suffixDropdown">
              產品標籤
            </MznAccordionTitle>
            <MznAccordionContent>
              標籤可協助分類與搜尋產品，您可以為每個產品添加多個標籤，
              例如：熱銷、新品、限時優惠等。
            </MznAccordionContent>
          </MznAccordion>
        </MznAccordionGroup>
      </div>
    `,
  }),
};

export const IconOnly: Story = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => ({
      EditIcon,
      TrashIcon,
      stopPropagation: (event: MouseEvent): void => {
        event.stopPropagation();
      },
    }),
    template: `
      <div style="max-width: 680px; width: 100%">
        <MznAccordionGroup>
          <MznAccordion>
            <MznAccordionTitle id="icon-only-1">
              篩選條件
              <MznAccordionActions>
                <MznButton
                  :icon="EditIcon"
                  iconType="icon-only"
                  aria-label="編輯篩選條件"
                  title="編輯篩選條件"
                  size="main"
                  variant="base-text-link"
                  @click="stopPropagation"
                />
                <MznButton
                  color="danger"
                  :icon="TrashIcon"
                  iconType="icon-only"
                  aria-label="刪除篩選條件"
                  title="刪除篩選條件"
                  size="main"
                  variant="destructive-text-link"
                  @click="stopPropagation"
                />
              </MznAccordionActions>
            </MznAccordionTitle>
            <MznAccordionContent>
              您可以在此設定搜尋篩選條件，包含日期範圍、分類、狀態等篩選選項。
            </MznAccordionContent>
          </MznAccordion>
          <MznAccordion defaultExpanded>
            <MznAccordionTitle id="icon-only-2">
              產品說明文件
              <MznAccordionActions>
                <MznButton
                  :icon="EditIcon"
                  iconType="icon-only"
                  size="main"
                  variant="base-text-link"
                  @click="stopPropagation"
                />
                <MznButton
                  color="danger"
                  :icon="TrashIcon"
                  iconType="icon-only"
                  size="main"
                  variant="destructive-text-link"
                  @click="stopPropagation"
                />
              </MznAccordionActions>
            </MznAccordionTitle>
            <MznAccordionContent>
              包含產品規格書、使用手冊與保固條款，
              請於購買前詳閱相關文件以了解產品功能與限制。
            </MznAccordionContent>
          </MznAccordion>
          <MznAccordion>
            <MznAccordionTitle id="icon-only-3">
              退換貨須知
              <MznAccordionActions>
                <MznButton
                  :icon="EditIcon"
                  iconType="icon-only"
                  size="main"
                  variant="base-text-link"
                  @click="stopPropagation"
                />
                <MznButton
                  color="danger"
                  :icon="TrashIcon"
                  iconType="icon-only"
                  size="main"
                  variant="destructive-text-link"
                  @click="stopPropagation"
                />
              </MznAccordionActions>
            </MznAccordionTitle>
            <MznAccordionContent>
              商品到貨後 7 天內可申請退換貨，請保持商品完整包裝。
              如有瑕疵或寄送錯誤，我們將負擔來回運費。
            </MznAccordionContent>
          </MznAccordion>
        </MznAccordionGroup>
      </div>
    `,
  }),
};

export const DisabledWithActions: Story = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => ({
      EditIcon,
      TrashIcon,
      stopPropagation: (event: MouseEvent): void => {
        event.stopPropagation();
      },
    }),
    template: `
      <div style="max-width: 680px; width: 100%">
        <MznAccordionGroup>
          <MznAccordion disabled>
            <MznAccordionTitle id="disabled-1">
              篩選條件
              <MznAccordionActions>
                <MznButton
                  disabled
                  :icon="EditIcon"
                  iconType="icon-only"
                  aria-label="編輯"
                  title="編輯"
                  size="main"
                  variant="base-text-link"
                  @click="stopPropagation"
                />
                <MznButton
                  color="danger"
                  disabled
                  :icon="TrashIcon"
                  iconType="icon-only"
                  aria-label="刪除"
                  title="刪除"
                  size="main"
                  variant="destructive-text-link"
                  @click="stopPropagation"
                />
              </MznAccordionActions>
            </MznAccordionTitle>
            <MznAccordionContent>
              此手風琴目前為停用狀態，無法展開或收合。
            </MznAccordionContent>
          </MznAccordion>
          <MznAccordion>
            <MznAccordionTitle id="disabled-2">
              運送政策
              <MznAccordionActions>
                <MznButton
                  :icon="EditIcon"
                  iconType="icon-only"
                  aria-label="編輯"
                  title="編輯"
                  size="main"
                  variant="base-text-link"
                  @click="stopPropagation"
                />
                <MznButton
                  color="danger"
                  :icon="TrashIcon"
                  iconType="icon-only"
                  aria-label="刪除"
                  title="刪除"
                  size="main"
                  variant="destructive-text-link"
                  @click="stopPropagation"
                />
              </MznAccordionActions>
            </MznAccordionTitle>
            <MznAccordionContent>
              訂單成立後 1-3 個工作天內出貨，全台宅配約 1-2 天送達。
            </MznAccordionContent>
          </MznAccordion>
        </MznAccordionGroup>
      </div>
    `,
  }),
};

interface AccordionItem {
  id: number;
  content: string;
  title: string;
  visible: boolean;
}

const fadeDuration = {
  enter: MOTION_DURATION.fast,
  exit: MOTION_DURATION.fast,
};
const fadeEasing = {
  enter: MOTION_EASING.standard,
  exit: MOTION_EASING.standard,
};

export const DeleteTransition: Story = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const items = ref<AccordionItem[]>([
        {
          content: '目前支援信用卡、Line Pay、Apple Pay 等多種付款方式。',
          id: 1,
          title: '付款方式',
          visible: true,
        },
        {
          content: '訂單成立後 1-3 個工作天內出貨，全台宅配約 1-2 天送達。',
          id: 2,
          title: '運送政策',
          visible: true,
        },
        {
          content: '商品到貨後 7 天內可申請退換貨，請保持商品完整包裝。',
          id: 3,
          title: '退換貨須知',
          visible: true,
        },
      ]);
      const nextId = ref(4);

      return {
        PlusIcon,
        TrashIcon,
        fadeDuration,
        fadeEasing,
        handleAdd: (): void => {
          items.value = [
            ...items.value,
            {
              content: '這是新增的手風琴內容，可在此填寫詳細說明。',
              id: nextId.value,
              title: `新增項目 ${nextId.value}`,
              visible: true,
            },
          ];
          nextId.value += 1;
        },
        handleDelete: (id: number): void => {
          items.value = items.value.map((item) =>
            item.id === id ? { ...item, visible: false } : item,
          );
        },
        handleExited: (id: number): void => {
          items.value = items.value.filter((item) => item.id !== id);
        },
        items,
      };
    },
    template: `
      <div style="display: grid; gap: 16px; max-width: 680px; width: 100%">
        <MznAccordionGroup>
          <MznFade
            v-for="item in items"
            :key="item.id"
            appear
            :duration="fadeDuration"
            :easing="fadeEasing"
            :in="item.visible"
            @exited="handleExited(item.id)"
          >
            <div>
              <MznAccordion>
                <MznAccordionTitle :id="'delete-transition-' + item.id">
                  {{ item.title }}
                  <MznAccordionActions>
                    <MznButton
                      aria-label="Delete accordion item"
                      color="danger"
                      :icon="TrashIcon"
                      iconType="icon-only"
                      size="main"
                      variant="destructive-text-link"
                      @click="(event) => { event.stopPropagation(); handleDelete(item.id); }"
                    />
                  </MznAccordionActions>
                </MznAccordionTitle>
                <MznAccordionContent>{{ item.content }}</MznAccordionContent>
              </MznAccordion>
            </div>
          </MznFade>
        </MznAccordionGroup>
        <div>
          <MznButton :icon="PlusIcon" variant="base-secondary" @click="handleAdd">
            新增手風琴
          </MznButton>
        </div>
      </div>
    `,
  }),
};
