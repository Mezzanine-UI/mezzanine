import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { Component, computed, signal } from '@angular/core';
import { TextFieldSize } from '@mezzanine-ui/core/text-field';
import {
  ChevronDownIcon,
  SearchIcon,
  EyeInvisibleIcon,
  InfoFilledIcon,
  WarningFilledIcon,
} from '@mezzanine-ui/icons';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznTextField } from './text-field.component';

const sizes: TextFieldSize[] = ['main', 'sub'];

/**
 * 外部型別,將 `MznTextField` component 與透過 `hostDirectives` 掛上的
 * `MznTextFieldHost` directive 的 inputs 合併,讓 Storybook 的 argTypes
 * 能同時看到兩邊的屬性(`disabled` / `error` / `readOnly` 等由 directive 暴露)。
 */
type MznTextFieldArgs = MznTextField & {
  disabled: boolean;
  error: boolean;
  readonly: boolean;
  size: TextFieldSize;
};

const meta: Meta<MznTextFieldArgs> = {
  title: 'Internal/TextField',
  component: MznTextField,
  decorators: [moduleMetadata({ imports: [MznTextField, MznIcon] })],
};

export default meta;
type Story = StoryObj<MznTextFieldArgs>;

export const Playground: Story = {
  argTypes: {
    clearable: {
      control: { type: 'boolean' },
      description: 'If true, shows a clear button when the field has a value.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'If true, the field is disabled.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    error: {
      control: { type: 'boolean' },
      description: 'If true, the field shows an error state.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    readonly: {
      control: { type: 'boolean' },
      description: 'If true, the field is read-only.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    size: {
      options: sizes,
      control: { type: 'select' },
      description: 'The size of the text field.',
      table: {
        type: { summary: "'main' | 'sub'" },
        defaultValue: { summary: "'main'" },
      },
    },
  },
  args: {
    size: 'main',
    error: false,
    clearable: false,
    disabled: false,
    readonly: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div mznTextField [size]="size" [error]="error" [clearable]="clearable" [disabled]="disabled" [readonly]="readonly">
        <input placeholder="Enter text..." [disabled]="disabled" [readOnly]="readonly" />
      </div>
    `,
  }),
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: inline-grid; grid-template-columns: 1fr; gap: 16px;">
        <div mznTextField size="main">
          <input placeholder="Main size" />
        </div>
        <div mznTextField size="sub">
          <input placeholder="Sub size" />
        </div>
      </div>
    `,
  }),
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: inline-grid; grid-template-columns: 1fr; gap: 16px;">
        <div mznTextField>
          <input type="text" placeholder="Default state" />
        </div>
        <div mznTextField [readonly]="true">
          <input type="text" value="Readonly state" [readOnly]="true" />
        </div>
        <div mznTextField [disabled]="true">
          <input type="text" value="Disabled state" [disabled]="true" />
        </div>
      </div>
    `,
  }),
};

export const ErrorState: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { WarningFilledIcon },
    template: `
      <div style="display: inline-grid; grid-template-columns: 1fr; gap: 16px;">
        <div mznTextField [error]="true">
          <input type="email" placeholder="Error default" value="invalid@" />
        </div>
        <div mznTextField [error]="true" [hasSuffix]="true">
          <input type="email" placeholder="Error with icon" />
          <i mznIcon suffix [icon]="WarningFilledIcon" ></i>
        </div>
      </div>
    `,
  }),
};

export const WithAffix: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      SearchIcon,
      InfoFilledIcon,
      EyeInvisibleIcon,
      showPassword: false,
    },
    template: `
      <div style="display: inline-grid; grid-template-columns: 1fr; gap: 16px;">
        <div mznTextField [hasPrefix]="true">
          <i mznIcon prefix [icon]="SearchIcon" ></i>
          <input type="text" placeholder="Prefix icon" />
        </div>
        <div mznTextField [hasSuffix]="true">
          <input type="text" placeholder="Suffix icon" />
          <i mznIcon suffix [icon]="InfoFilledIcon" ></i>
        </div>
        <div mznTextField [hasSuffix]="true">
          <input type="password" placeholder="Password with toggle visibility" value="secret123" />
          <i mznIcon suffix [icon]="EyeInvisibleIcon" ></i>
        </div>
      </div>
    `,
  }),
};

export const Clearable: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { SearchIcon },
    template: `
      <div style="display: inline-grid; grid-template-columns: 1fr; gap: 16px;">
        <div mznTextField [clearable]="true">
          <input type="text" placeholder="Clearable (hover/focus to see)" value="Clearable text" />
        </div>
        <div mznTextField [clearable]="true" [hasPrefix]="true">
          <i mznIcon prefix [icon]="SearchIcon" ></i>
          <input type="text" placeholder="Clearable with prefix" value="With prefix icon" />
        </div>
      </div>
    `,
  }),
};

/**
 * 對齊 React `TextField.stories.tsx:270-494` 的 ComponentsExample:
 * 把 TextField 當底層 primitive 示範怎麼實作 Textarea + Select-like
 * + AutoComplete-like 三種高階元件。
 *
 * - Textarea: [noPadding]="true" + 手動套 input-padding class 讓
 *   resize handle 可達 host 邊界(React 的 children function 模式)。
 * - Select-like: role="combobox" + aria-expanded,點擊 host 切換
 *   listbox 的絕對定位浮層,suffix 的 ChevronDown 隨 open 旋轉。
 * - AutoComplete-like: prefix 搜尋 icon + clearable(有值時顯示 close
 *   button),輸入框 keystroke filter 選項清單,listbox 只在有命中選項
 *   時顯示。
 */
@Component({
  selector: 'story-text-field-components-example',
  standalone: true,
  imports: [MznTextField, MznIcon],
  template: `
    <div
      style="display: inline-grid; grid-template-columns: 1fr; gap: 32px; min-width: 320px;"
    >
      <!-- Textarea (with resize) -->
      <div>
        <h3 style="margin-top: 0; margin-bottom: 8px;"
          >Textarea (with resize)</h3
        >
        <div mznTextField [noPadding]="true">
          <textarea
            class="mzn-text-field__input-padding mzn-text-field__input-padding--main"
            placeholder="Textarea with text-field padding"
            rows="4"
            [value]="textareaValue()"
            (input)="onTextareaInput($event)"
          ></textarea>
        </div>
      </div>

      <!-- Select-like Component -->
      <div>
        <h3 style="margin-top: 0; margin-bottom: 8px;"
          >Select-like Component</h3
        >
        <div style="position: relative;">
          <div
            mznTextField
            [active]="selectOpen()"
            [hasSuffix]="true"
            role="combobox"
            [attr.aria-expanded]="selectOpen()"
            aria-haspopup="listbox"
            aria-controls="select-listbox"
            tabindex="0"
            (click)="toggleSelect()"
            (keydown)="onSelectKeyDown($event)"
          >
            <div style="width: 100%;">
              @if (selectValue()) {
                {{ selectValue() }}
              } @else {
                <span style="color: #999;">Select an option...</span>
              }
            </div>
            <i
              mznIcon
              suffix
              [icon]="chevronDownIcon"
              [style.transform]="
                selectOpen() ? 'rotate(180deg)' : 'rotate(0deg)'
              "
              style="transition: transform 0.2s;"
            ></i>
          </div>
          @if (selectOpen()) {
            <div
              id="select-listbox"
              role="listbox"
              style="position: absolute; top: calc(100% + 4px); left: 0; right: 0; background: white; border: 1px solid #ddd; border-radius: 4px; max-height: 200px; overflow: auto; z-index: 1000; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);"
            >
              @for (opt of options; track opt) {
                <div
                  role="option"
                  [attr.aria-selected]="selectValue() === opt"
                  tabindex="0"
                  [style.background]="
                    selectValue() === opt ? '#f0f0f0' : 'transparent'
                  "
                  style="padding: 8px 12px; cursor: pointer;"
                  (click)="pickSelect(opt)"
                  (keydown.enter)="pickSelect(opt)"
                  (keydown.space)="$event.preventDefault(); pickSelect(opt)"
                >
                  {{ opt }}
                </div>
              }
            </div>
          }
        </div>
      </div>

      <!-- AutoComplete-like Component -->
      <div>
        <h3 style="margin-top: 0; margin-bottom: 8px;"
          >AutoComplete-like Component</h3
        >
        <div style="position: relative;">
          <div
            mznTextField
            [hasPrefix]="true"
            [clearable]="autocompleteValue().length > 0"
            role="combobox"
            [attr.aria-expanded]="
              autocompleteOpen() && filteredOptions().length > 0
            "
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-controls="autocomplete-listbox"
            (cleared)="clearAutocomplete()"
          >
            <i mznIcon prefix [icon]="searchIcon"></i>
            <input
              type="text"
              placeholder="Type to search..."
              [value]="autocompleteValue()"
              (input)="onAutocompleteInput($event)"
              (focus)="
                autocompleteValue().length > 0 && autocompleteOpen.set(true)
              "
            />
          </div>
          @if (autocompleteOpen() && filteredOptions().length > 0) {
            <div
              id="autocomplete-listbox"
              role="listbox"
              style="position: absolute; top: calc(100% + 4px); left: 0; right: 0; background: white; border: 1px solid #ddd; border-radius: 4px; max-height: 200px; overflow: auto; z-index: 1000; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);"
            >
              @for (opt of filteredOptions(); track opt) {
                <div
                  role="option"
                  [attr.aria-selected]="autocompleteValue() === opt"
                  tabindex="0"
                  style="padding: 8px 12px; cursor: pointer;"
                  (click)="pickAutocomplete(opt)"
                  (keydown.enter)="pickAutocomplete(opt)"
                  (keydown.space)="
                    $event.preventDefault(); pickAutocomplete(opt)
                  "
                >
                  {{ opt }}
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
class TextFieldComponentsExampleComponent {
  protected readonly chevronDownIcon = ChevronDownIcon;
  protected readonly searchIcon = SearchIcon;
  protected readonly options = [
    'Option 1',
    'Option 2',
    'Option 3',
    'Very Long Option 4',
  ];

  protected readonly textareaValue = signal('');

  protected readonly selectOpen = signal(false);
  protected readonly selectValue = signal('');

  protected readonly autocompleteValue = signal('');
  protected readonly autocompleteOpen = signal(false);

  protected readonly filteredOptions = computed(() => {
    const keyword = this.autocompleteValue().toLowerCase();

    return this.options.filter((opt) => opt.toLowerCase().includes(keyword));
  });

  toggleSelect(): void {
    this.selectOpen.update((v) => !v);
  }

  onSelectKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleSelect();
    }
  }

  pickSelect(opt: string): void {
    this.selectValue.set(opt);
    this.selectOpen.set(false);
  }

  onTextareaInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;

    this.textareaValue.set(value);
  }

  onAutocompleteInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.autocompleteValue.set(value);
    this.autocompleteOpen.set(value.length > 0);
  }

  pickAutocomplete(opt: string): void {
    this.autocompleteValue.set(opt);
    this.autocompleteOpen.set(false);
  }

  clearAutocomplete(): void {
    this.autocompleteValue.set('');
    this.autocompleteOpen.set(false);
  }
}

export const ComponentsExample: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({ imports: [TextFieldComponentsExampleComponent] }),
  ],
  render: () => ({
    template: `<story-text-field-components-example />`,
  }),
};
