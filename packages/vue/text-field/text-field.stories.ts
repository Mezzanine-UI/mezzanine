import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, ref } from 'vue';
import {
  SearchIcon,
  EyeIcon,
  WarningFilledIcon,
  InfoFilledIcon,
  EyeInvisibleIcon,
  ChevronDownIcon,
} from '@mezzanine-ui/icons';
import type { TextFieldSize } from '@mezzanine-ui/core/text-field';
import MznIcon from '../icon/icon.vue';
import MznTextField from './text-field.vue';
import type { TextFieldProps } from './text-field.types';

export default {
  title: 'Internal/TextField',
  component: MznTextField,
} satisfies Meta<typeof MznTextField>;

type Story = StoryObj<TextFieldProps>;

const sizes: TextFieldSize[] = ['main', 'sub'];

export const Playground: Story = {
  argTypes: {
    size: {
      options: sizes,
      control: {
        type: 'select',
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    readonly: {
      control: {
        type: 'boolean',
      },
    },
    error: {
      control: {
        type: 'boolean',
      },
    },
    clearable: {
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    size: 'main',
    error: false,
    clearable: false,
  },
  render: (args) => ({
    components: { MznTextField },
    setup: () => {
      const value = ref('');

      return { args, value };
    },
    template: `
      <MznTextField
        :active="args.active"
        :clearable="args.clearable"
        :disabled="args.disabled"
        :error="args.error"
        :readonly="args.readonly"
        :size="args.size"
        @clear="value = ''"
      >
        <input
          v-model="value"
          type="text"
          placeholder="Enter text..."
          :disabled="args.disabled"
          :readonly="args.readonly"
        />
      </MznTextField>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { MznTextField },
    template: `
      <div style="display: inline-grid; grid-template-columns: 1fr; gap: 16px">
        <MznTextField size="main">
          <input type="text" placeholder="Main size" />
        </MznTextField>

        <MznTextField size="sub">
          <input type="text" placeholder="Sub size" />
        </MznTextField>
      </div>
    `,
  }),
};

export const States: Story = {
  render: () => ({
    components: { MznTextField },
    setup: () => ({ typingValue: ref('') }),
    template: `
      <div style="display: inline-grid; grid-template-columns: 1fr; gap: 16px">
        <MznTextField>
          <input v-model="typingValue" type="text" placeholder="Default state" />
        </MznTextField>
        <MznTextField readonly>
          <input type="text" value="Readonly state" readonly />
        </MznTextField>
        <MznTextField disabled>
          <input type="text" value="Disabled state" disabled />
        </MznTextField>
      </div>
    `,
  }),
};

export const ErrorState: Story = {
  render: () => ({
    components: { MznTextField, MznIcon },
    setup: () => ({ email: ref('invalid@'), WarningFilledIcon }),
    template: `
      <div style="display: inline-grid; grid-template-columns: 1fr; gap: 16px">
        <MznTextField error>
          <input v-model="email" type="email" placeholder="Error default" />
        </MznTextField>
        <MznTextField error>
          <template #suffix><MznIcon :icon="WarningFilledIcon" /></template>
          <input type="email" placeholder="Error with icon" />
        </MznTextField>
      </div>
    `,
  }),
};

const PasswordFieldExample = {
  components: { MznTextField, MznIcon },
  setup: () => {
    const showPassword = ref(false);
    const password = ref('secret123');
    const icon = computed(() =>
      showPassword.value ? EyeIcon : EyeInvisibleIcon,
    );

    return { showPassword, password, icon };
  },
  template: `
    <MznTextField>
      <template #suffix>
        <MznIcon :icon="icon" @click="showPassword = !showPassword" />
      </template>
      <input
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        placeholder="Password with toggle visibility"
      />
    </MznTextField>
  `,
};

export const WithAffix: Story = {
  render: () => ({
    components: { MznTextField, MznIcon, PasswordFieldExample },
    setup: () => ({ SearchIcon, InfoFilledIcon }),
    template: `
      <div style="display: inline-grid; grid-template-columns: 1fr; gap: 16px">
        <MznTextField>
          <template #prefix><MznIcon :icon="SearchIcon" /></template>
          <input type="text" placeholder="Prefix icon" />
        </MznTextField>

        <MznTextField>
          <template #suffix><MznIcon :icon="InfoFilledIcon" /></template>
          <input type="text" placeholder="Suffix icon" />
        </MznTextField>

        <PasswordFieldExample />
      </div>
    `,
  }),
};

export const Clearable: Story = {
  render: () => ({
    components: { MznTextField, MznIcon },
    setup: () => ({
      value1: ref('Clearable text'),
      value2: ref('With prefix icon'),
      SearchIcon,
    }),
    template: `
      <div style="display: inline-grid; grid-template-columns: 1fr; gap: 16px">
        <MznTextField clearable @clear="value1 = ''">
          <input v-model="value1" type="text" placeholder="Clearable (hover/focus to see)" />
        </MznTextField>

        <MznTextField clearable @clear="value2 = ''">
          <template #prefix><MznIcon :icon="SearchIcon" /></template>
          <input v-model="value2" type="text" placeholder="Clearable with prefix" />
        </MznTextField>
      </div>
    `,
  }),
};

export const ComponentsExample: Story = {
  render: () => ({
    components: { MznTextField, MznIcon },
    setup: () => {
      const textareaValue = ref('');
      const selectOpen = ref(false);
      const selectValue = ref('');
      const autocompleteValue = ref('');
      const autocompleteOpen = ref(false);
      const options = [
        'Option 1',
        'Option 2',
        'Option 3',
        'Very Long Option 4',
      ];
      const filteredOptions = computed(() =>
        options.filter((option) =>
          option.toLowerCase().includes(autocompleteValue.value.toLowerCase()),
        ),
      );

      function selectOption(option: string): void {
        selectValue.value = option;
        selectOpen.value = false;
      }

      function pickAutocomplete(option: string): void {
        autocompleteValue.value = option;
        autocompleteOpen.value = false;
      }

      return {
        ChevronDownIcon,
        SearchIcon,
        autocompleteOpen,
        autocompleteValue,
        filteredOptions,
        options,
        pickAutocomplete,
        selectOption,
        selectOpen,
        selectValue,
        textareaValue,
      };
    },
    template: `
      <div style="display: inline-grid; grid-template-columns: 1fr; gap: 32px; min-width: 320px">
        <div>
          <h3 style="margin-top: 0; margin-bottom: 8px">Textarea (with resize)</h3>
          <MznTextField v-slot="{ paddingClassName }">
            <textarea
              v-model="textareaValue"
              :class="paddingClassName"
              placeholder="Textarea with text-field padding"
              rows="4"
            />
          </MznTextField>
        </div>

        <div>
          <h3 style="margin-top: 0; margin-bottom: 8px">Select-like Component</h3>
          <div style="position: relative">
            <MznTextField
              role="combobox"
              :aria-expanded="selectOpen"
              aria-haspopup="listbox"
              aria-controls="select-listbox"
              :active="selectOpen"
              @click="selectOpen = !selectOpen"
              @keydown.enter.prevent="selectOpen = !selectOpen"
              @keydown.space.prevent="selectOpen = !selectOpen"
            >
              <template #suffix>
                <MznIcon
                  :icon="ChevronDownIcon"
                  :style="{ transform: selectOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }"
                />
              </template>
              <div style="width: 100%">
                <template v-if="selectValue">{{ selectValue }}</template>
                <span v-else style="color: #999">Select an option...</span>
              </div>
            </MznTextField>
            <div
              v-if="selectOpen"
              id="select-listbox"
              role="listbox"
              style="position: absolute; top: calc(100% + 4px); left: 0; right: 0; background: white; border: 1px solid #ddd; border-radius: 4px; max-height: 200px; overflow: auto; z-index: 1000; box-shadow: 0 2px 8px rgba(0,0,0,0.1)"
            >
              <div
                v-for="option in options"
                :key="option"
                role="option"
                :aria-selected="selectValue === option"
                :tabindex="0"
                :style="{ padding: '8px 12px', cursor: 'pointer', background: selectValue === option ? '#f0f0f0' : 'transparent' }"
                @click="selectOption(option)"
                @keydown.enter.prevent="selectOption(option)"
                @keydown.space.prevent="selectOption(option)"
              >{{ option }}</div>
            </div>
          </div>
        </div>

        <div>
          <h3 style="margin-top: 0; margin-bottom: 8px">AutoComplete-like Component</h3>
          <div style="position: relative">
            <MznTextField
              role="combobox"
              :aria-expanded="autocompleteOpen && filteredOptions.length > 0"
              aria-haspopup="listbox"
              aria-autocomplete="list"
              aria-controls="autocomplete-listbox"
              :clearable="!!autocompleteValue"
              @clear="autocompleteValue = ''; autocompleteOpen = false"
            >
              <template #prefix><MznIcon :icon="SearchIcon" /></template>
              <input
                v-model="autocompleteValue"
                type="text"
                placeholder="Type to search..."
                @input="autocompleteOpen = autocompleteValue.length > 0"
                @focus="autocompleteOpen = !!autocompleteValue"
              />
            </MznTextField>
            <div
              v-if="autocompleteOpen && filteredOptions.length > 0"
              id="autocomplete-listbox"
              role="listbox"
              style="position: absolute; top: calc(100% + 4px); left: 0; right: 0; background: white; border: 1px solid #ddd; border-radius: 4px; max-height: 200px; overflow: auto; z-index: 1000; box-shadow: 0 2px 8px rgba(0,0,0,0.1)"
            >
              <div
                v-for="option in filteredOptions"
                :key="option"
                role="option"
                :aria-selected="autocompleteValue === option"
                :tabindex="0"
                style="padding: 8px 12px; cursor: pointer"
                @click="pickAutocomplete(option)"
                @keydown.enter.prevent="pickAutocomplete(option)"
                @keydown.space.prevent="pickAutocomplete(option)"
              >{{ option }}</div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
