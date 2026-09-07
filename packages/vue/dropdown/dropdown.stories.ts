import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, defineComponent, ref } from 'vue';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';
import { DotVerticalIcon } from '@mezzanine-ui/icons';
import MznAutoComplete from '../auto-complete/auto-complete.vue';
import MznButton from '../button/button.vue';
import MznIcon from '../icon/icon.vue';
import type { SelectValue } from '../select/select.types';
import MznTag from '../tag/tag.vue';
import MznTextField from '../text-field/text-field.vue';
import MznDropdown from './dropdown.vue';

export default {
  component: MznDropdown,
  title: 'Internal/Dropdown',
} as Meta;

type Story = StoryObj<typeof MznDropdown>;

const simpleOptions: DropdownOption[] = [
  { name: '選項 1', id: 'option-1' },
  { name: '選項 2', id: 'option-2' },
  { name: '選項 3', id: 'option-3' },
];

const usStatesOptions: DropdownOption[] = [
  { id: 'al', name: 'Alabama' },
  { id: 'ak', name: 'Alaska' },
  { id: 'as', name: 'American Samoa' },
  { id: 'az', name: 'Arizona' },
  { id: 'ar', name: 'Arkansas' },
  { id: 'ca', name: 'California' },
  { id: 'co', name: 'Colorado' },
  { id: 'ct', name: 'Connecticut' },
  { id: 'de', name: 'Delaware' },
  { id: 'dc', name: 'District of Columbia' },
  { id: 'fl', name: 'Florida' },
  { id: 'ga', name: 'Georgia' },
  { id: 'gm', name: 'Guam' },
  { id: 'hi', name: 'Hawaii' },
  { id: 'id', name: 'Idaho' },
  { id: 'il', name: 'Illinois' },
  { id: 'in', name: 'Indiana' },
  { id: 'ia', name: 'Iowa' },
  { id: 'ks', name: 'Kansas' },
  { id: 'ky', name: 'Kentucky' },
  { id: 'la', name: 'Louisiana' },
  { id: 'me', name: 'Maine' },
  { id: 'md', name: 'Maryland' },
  { id: 'ma', name: 'Massachusetts' },
  { id: 'mi', name: 'Michigan' },
  { id: 'mn', name: 'Minnesota' },
  { id: 'ms', name: 'Mississippi' },
  { id: 'mo', name: 'Missouri' },
  { id: 'mt', name: 'Montana' },
  { id: 'ne', name: 'Nebraska' },
  { id: 'nv', name: 'Nevada' },
  { id: 'nh', name: 'New Hampshire' },
  { id: 'nj', name: 'New Jersey' },
  { id: 'nm', name: 'New Mexico' },
  { id: 'ny', name: 'New York' },
  { id: 'nc', name: 'North Carolina' },
  { id: 'nd', name: 'North Dakota' },
  { id: 'mp', name: 'Northern Marianas Islands' },
  { id: 'oh', name: 'Ohio' },
  { id: 'ok', name: 'Oklahoma' },
  { id: 'or', name: 'Oregon' },
  { id: 'pa', name: 'Pennsylvania' },
  { id: 'pr', name: 'Puerto Rico' },
  { id: 'ri', name: 'Rhode Island' },
  { id: 'sc', name: 'South Carolina' },
  { id: 'sd', name: 'South Dakota' },
  { id: 'tn', name: 'Tennessee' },
  { id: 'tx', name: 'Texas' },
  { id: 'ut', name: 'Utah' },
  { id: 'vt', name: 'Vermont' },
  { id: 'va', name: 'Virginia' },
  { id: 'vi', name: 'Virgin Islands' },
  { id: 'wa', name: 'Washington' },
  { id: 'wv', name: 'West Virginia' },
  { id: 'wi', name: 'Wisconsin' },
  { id: 'wy', name: 'Wyoming' },
];

export const Playground: Story = {
  argTypes: {
    placement: {
      control: 'select',
      options: [
        'top',
        'bottom',
        'left',
        'right',
        'top-start',
        'bottom-start',
        'left-start',
        'right-start',
        'top-end',
        'bottom-end',
        'left-end',
        'right-end',
        'auto',
        'auto-start',
        'auto-end',
      ],
    },
    showDropdownActions: {
      control: 'boolean',
      defaultValue: false,
    },
    type: {
      control: 'select',
      options: ['default', 'checkbox', 'tree'],
    },
  },
  args: {
    disabled: false,
    options: simpleOptions,
    placement: 'bottom-start',
    showDropdownActions: false,
    type: 'default',
  },
  render: (args) => ({
    components: { MznButton, MznDropdown },
    setup: () => {
      const value = ref<string | undefined>(undefined);
      const selectedLabel = computed(
        (): string =>
          simpleOptions.find((option) => option.id === value.value)?.name ??
          '請選擇',
      );

      return { args, selectedLabel, value };
    },
    template: `
      <MznDropdown v-bind="args" :value="value" @select="value = $event.id">
        <template #default="triggerProps">
          <MznButton v-bind="triggerProps" variant="base-primary">{{ selectedLabel }}</MznButton>
        </template>
      </MznDropdown>
    `,
  }),
};

export const AutoCompleteExample: Story = {
  render: () => ({
    components: { MznAutoComplete, MznTag },
    setup: () => {
      const selectedOption = ref<SelectValue | null>(null);

      return {
        options: usStatesOptions.map((option) => ({
          id: option.id,
          name: option.name,
        })),
        selectedOption,
      };
    },
    template: `
      <div style="width: 320px">
        <MznTag label="Combobox with AutoComplete" />
        <div style="margin-top: 12px">
          <MznAutoComplete
            :menu-max-height="300"
            mode="single"
            :options="options"
            placeholder="Type or select a state..."
            :value="selectedOption"
            @change="selectedOption = $event"
          />
        </div>
      </div>
    `,
  }),
};

export const Inside: Story = {
  render: () => ({
    components: { MznDropdown, MznTextField },
    setup: () => {
      const inputValue = ref('');
      const open = ref(false);
      const selectedId = ref<string | undefined>(undefined);

      const filteredOptions = computed((): DropdownOption[] => {
        const keyword = inputValue.value.trim().toLowerCase();

        if (!keyword) return usStatesOptions;

        return usStatesOptions.filter((option) =>
          option.name.toLowerCase().includes(keyword),
        );
      });

      return {
        filteredOptions,
        handleSelect: (option: DropdownOption): void => {
          inputValue.value = option.name;
          selectedId.value = option.id;
        },
        inputValue,
        open,
        selectedId,
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 400px">
        <div>
          <div style="display: flex; gap: 8px; align-items: flex-start; flex-direction: column">
            <div style="flex: 1">
              <MznDropdown
                input-position="inside"
                is-match-input-value
                :max-height="360"
                :open="open"
                :options="filteredOptions"
                :follow-text="inputValue"
                same-width
                :value="selectedId"
                @select="handleSelect"
                @visibility-change="open = $event"
              >
                <template #default="triggerProps">
                  <MznTextField v-bind="triggerProps">
                    <input
                      placeholder="請選擇或輸入..."
                      type="text"
                      :value="inputValue"
                      @input="inputValue = $event.target.value"
                    />
                  </MznTextField>
                </template>
              </MznDropdown>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

/** React's `PlacementItem`: one labelled dropdown per placement. */
const PlacementItem = defineComponent({
  name: 'PlacementItem',
  components: { MznButton, MznDropdown, MznIcon, MznTag },
  props: {
    label: { type: String, required: true },
    placement: { type: String, required: true },
  },
  setup: () => {
    const value = ref<string | undefined>(undefined);
    const selectedName = computed(
      (): string | undefined =>
        simpleOptions.find((option) => option.id === value.value)?.name,
    );

    return { DotVerticalIcon, selectedName, simpleOptions, value };
  },
  template: `
    <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 160px">
      <MznTag :label="label" />
      <MznDropdown
        :options="simpleOptions"
        :placement="placement"
        :value="value"
        :global-portal="false"
        @select="value = $event.id"
      >
        <template #default="triggerProps">
          <MznButton v-bind="triggerProps" variant="base-secondary" size="minor">
            <template v-if="selectedName">{{ selectedName }}</template>
            <MznIcon v-else :icon="DotVerticalIcon" />
          </MznButton>
        </template>
      </MznDropdown>
    </div>
  `,
});

export const PlacementExample: Story = {
  render: () => ({
    components: { PlacementItem },
    setup: () => ({
      gridStyle:
        'display: inline-grid; gap: 30px; grid-auto-rows: minmax(min-content, max-content); grid-template-columns: repeat(5, max-content); justify-content: center; margin-top: 50px; width: 100%',
    }),
    template: `
      <div :style="gridStyle">
        <div />
        <PlacementItem label="Top Start" placement="top-start" />
        <PlacementItem label="Top" placement="top" />
        <PlacementItem label="Top End" placement="top-end" />
        <div />
        <PlacementItem label="Left Start" placement="left-start" />
        <div />
        <div />
        <div />
        <PlacementItem label="Right Start" placement="right-start" />
        <PlacementItem label="Left" placement="left" />
        <div />
        <div />
        <div />
        <PlacementItem label="Right" placement="right" />
        <PlacementItem label="Left End" placement="left-end" />
        <div />
        <div />
        <div />
        <PlacementItem label="Right End" placement="right-end" />
        <div />
        <PlacementItem label="Bottom Start" placement="bottom-start" />
        <PlacementItem label="Bottom" placement="bottom" />
        <PlacementItem label="Bottom End" placement="bottom-end" />
        <div />
      </div>
    `,
  }),
};

export const ControlledVisibility: Story = {
  render: () => ({
    components: { MznButton, MznDropdown },
    setup: () => {
      const open = ref(false);
      const value = ref<string | undefined>(undefined);
      const selectedLabel = computed(
        (): string =>
          simpleOptions.find((option) => option.id === value.value)?.name ??
          '請選擇',
      );

      return {
        handleSelect: (option: DropdownOption): void => {
          // Close the dropdown when an option is selected
          value.value = option.id;
          open.value = false;
        },
        open,
        selectedLabel,
        setOpen: (event: MouseEvent, next: boolean): void => {
          event.stopPropagation();
          open.value = next;
        },
        simpleOptions,
        stopPropagation: (event: MouseEvent) => event.stopPropagation(),
        value,
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 240px">
        <div style="display: flex; gap: 8px">
          <MznButton
            size="minor"
            variant="base-primary"
            @click="setOpen($event, true)"
            @mousedown="stopPropagation"
          >
            開啟
          </MznButton>
          <MznButton
            size="minor"
            variant="base-secondary"
            @click="setOpen($event, false)"
            @mousedown="stopPropagation"
          >
            關閉
          </MznButton>
        </div>
        <MznDropdown
          :open="open"
          :options="simpleOptions"
          :value="value"
          @select="handleSelect"
          @visibility-change="open = $event"
        >
          <template #default="triggerProps">
            <MznButton v-bind="triggerProps" variant="base-primary">{{ selectedLabel }}</MznButton>
          </template>
        </MznDropdown>
      </div>
    `,
  }),
};

export const LoadMoreOnReachBottom: Story = {
  render: () => ({
    components: { MznButton, MznDropdown, MznTag },
    setup: () => {
      const options = ref<DropdownOption[]>(usStatesOptions.slice(0, 10));
      const value = ref<string | undefined>(undefined);
      const loading = ref(false);
      const hasMore = ref(true);
      const hasReachedBottom = ref(false);

      const selectedLabel = computed(
        (): string =>
          options.value.find((option) => option.id === value.value)?.name ??
          '請選擇',
      );

      const loadMore = (): void => {
        if (loading.value || !hasMore.value) return;

        loading.value = true;

        // 模擬異步加載數據
        setTimeout(() => {
          const currentCount = options.value.length;
          const nextBatch = usStatesOptions.slice(
            currentCount,
            currentCount + 10,
          );

          if (nextBatch.length === 0) {
            hasMore.value = false;
          } else {
            options.value = [...options.value, ...nextBatch];
          }

          loading.value = false;
          hasReachedBottom.value = false;
        }, 1000);
      };

      return {
        handleLeaveBottom: () => {
          hasReachedBottom.value = false;
        },
        handleReachBottom: () => {
          if (!hasReachedBottom.value && !loading.value) {
            hasReachedBottom.value = true;
            loadMore();
          }
        },
        hasMore,
        loadedLabel: computed(
          (): string =>
            `已載入 ${options.value.length} / ${usStatesOptions.length} 個選項`,
        ),
        loading,
        options,
        selectedLabel,
        value,
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 320px">
        <MznTag :label="loadedLabel" />
        <div style="display: flex; gap: 8px; align-items: center">
          <MznDropdown
            :max-height="300"
            :options="options"
            :status="loading ? 'loading' : undefined"
            loading-position="bottom"
            loading-text="載入中..."
            :value="value"
            placement="right-start"
            @leave-bottom="handleLeaveBottom"
            @reach-bottom="handleReachBottom"
            @select="value = $event.id"
          >
            <template #default="triggerProps">
              <MznButton v-bind="triggerProps" variant="base-primary">{{ selectedLabel }}</MznButton>
            </template>
          </MznDropdown>
        </div>
        <div style="font-size: 12px; color: #666">
          <div v-if="loading">正在載入更多選項...</div>
          <div v-if="!hasMore">已載入所有選項</div>
        </div>
      </div>
    `,
  }),
};
