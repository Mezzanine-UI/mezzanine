import { Component, input, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { type Placement } from '@floating-ui/dom';
import { MznAutocomplete } from '@mezzanine-ui/ng/autocomplete';
import { MznTag } from '@mezzanine-ui/ng/tag';
import { MznTextField } from '@mezzanine-ui/ng/text-field';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import { DotVerticalIcon } from '@mezzanine-ui/icons';
import { MznIcon } from '../icon/icon.component';
import { MznDropdown } from './dropdown.component';
import { MznButton } from '../button/button.directive';

const meta: Meta<MznDropdown> = {
  title: 'Internal/Dropdown',
  component: MznDropdown,
  decorators: [
    moduleMetadata({
      imports: [MznButton, MznDropdown],
    }),
  ],
};

export default meta;

type Story = StoryObj;

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

/**
 * Playground 對齊 React:`<Dropdown><Button/></Dropdown>` — Dropdown root div
 * 即 story 根節點,trigger button 投影進 root 內(default ng-content)。
 */
export const Playground: Story = {
  argTypes: {
    disabled: {
      control: 'boolean',
      description: '是否禁用下拉選單。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    placement: {
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
      control: { type: 'select' },
      description: '下拉選單的定位方向。',
      table: {
        type: {
          summary:
            "'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'bottom-start' | 'left-start' | 'right-start' | 'top-end' | 'bottom-end' | 'left-end' | 'right-end' | 'auto' | 'auto-start' | 'auto-end'",
        },
        defaultValue: { summary: "'bottom-start'" },
      },
    },
  },
  args: {
    disabled: false,
    placement: 'bottom-start',
  },
  render: (args) => ({
    props: {
      ...args,
      options: simpleOptions,
      open: false,
      value: undefined as string | undefined,
      selectedLabel: '請選擇',
      onSelect(option: DropdownOption): void {
        this.value = option.id;
        this.selectedLabel = option.name;
      },
    },
    template: `
      <div
        mznDropdown
        [anchor]="anchor"
        [disabled]="disabled"
        [open]="open"
        [options]="options"
        [placement]="placement"
        [value]="value"
        (select)="onSelect($event)"
        (close)="open = false"
      >
        <button
          #anchor
          mznButton
          variant="base-primary"
          (click)="open = !open"
        >
          {{ selectedLabel }}
        </button>
      </div>
    `,
  }),
};

/**
 * 對齊 React `AutoCompleteExample`:React 用 `<AutoComplete>` 元件,Angular
 * 對應的是 `[mznAutocomplete]`。Story 根節點為 width:320px 的容器,對齊
 * React 的最外層 `<div style={{ width: 320 }}>`。
 */
@Component({
  selector: '[storyDropdownAutocomplete]',
  standalone: true,
  imports: [MznAutocomplete, MznTag],
  host: { style: 'display: block;' },
  template: `
    <div style="width: 320px;">
      <div mznTag label="Combobox with AutoComplete"></div>
      <div style="margin-top: 12px;">
        <div
          mznAutocomplete
          [fullWidth]="true"
          [menuMaxHeight]="300"
          mode="single"
          [options]="options"
          placeholder="Type or select a state..."
        ></div>
      </div>
    </div>
  `,
})
class DropdownAutoCompleteComponent {
  readonly options = usStatesOptions;
}

export const AutoCompleteExample: Story = {
  decorators: [moduleMetadata({ imports: [DropdownAutoCompleteComponent] })],
  render: () => ({
    template: `<div storyDropdownAutocomplete></div>`,
  }),
};

/**
 * 對齊 React `<Dropdown inputPosition="inside">` 的 `isInline` 分支:
 * 不用 popper,整個 dropdown in-flow 渲染。Story 根節點為 flex column 容器,
 * 對齊 React 最外層 `<div style={{ display:'flex', flexDirection:'column',
 * gap:'24px', maxWidth:'400px' }}>`。
 */
@Component({
  selector: '[storyDropdownInside]',
  standalone: true,
  imports: [MznDropdown, MznTextField],
  host: {
    style:
      'display: flex; flex-direction: column; gap: 24px; max-width: 400px;',
  },
  template: `
    <div>
      <div
        style="display: flex; gap: 8px; align-items: flex-start; flex-direction: column;"
      >
        <div style="flex: 1;">
          <div
            mznDropdown
            inputPosition="inside"
            [followText]="inputValue()"
            [isMatchInputValue]="true"
            [open]="open()"
            [options]="filteredOptions()"
            [maxHeight]="360"
            [value]="selectedId()"
            (select)="onSelect($event)"
            (close)="open.set(false)"
          >
            <div mznDropdownHeader>
              <div mznTextField (click)="open.set(!open())">
                <input
                  type="text"
                  [attr.value]="inputValue()"
                  [value]="inputValue()"
                  (input)="onInput($event)"
                  (focus)="open.set(true)"
                  placeholder="請選擇或輸入..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
class DropdownInsideComponent {
  readonly open = signal(false);
  readonly inputValue = signal('');
  readonly selectedId = signal<string | undefined>(undefined);

  readonly filteredOptions = (): DropdownOption[] => {
    const keyword = this.inputValue().trim().toLowerCase();

    if (!keyword) return usStatesOptions;

    return usStatesOptions.filter((o) =>
      o.name.toLowerCase().includes(keyword),
    );
  };

  onInput(event: Event): void {
    this.inputValue.set((event.target as HTMLInputElement).value);
    this.open.set(true);
  }

  onSelect(option: DropdownOption): void {
    this.inputValue.set(option.name);
    this.selectedId.set(option.id);
    this.open.set(false);
  }
}

export const Inside: Story = {
  decorators: [moduleMetadata({ imports: [DropdownInsideComponent] })],
  render: () => ({
    template: `<div storyDropdownInside></div>`,
  }),
};

/**
 * 單一 placement cell:對齊 React `PlacementItem`,width 160px,Tag +
 * Dropdown(trigger button 投影進 Dropdown root 內)。`globalPortal=false`
 * 讓 Dropdown popup 保留在原 DOM 位置(對齊 React 同設定)。
 */
@Component({
  selector: '[storyDropdownPlacementItem]',
  standalone: true,
  imports: [MznButton, MznDropdown, MznIcon, MznTag],
  host: {
    style:
      'display: flex; flex-direction: column; align-items: center; gap: 8px; width: 160px;',
  },
  template: `
    <div mznTag [label]="label()"></div>
    <div
      mznDropdown
      [anchor]="anchor"
      [open]="open()"
      [options]="options"
      [placement]="placement()"
      [globalPortal]="false"
      [value]="value()"
      (select)="onSelect($event)"
      (close)="open.set(false)"
    >
      <button
        #anchor
        mznButton
        variant="base-secondary"
        size="minor"
        (click)="toggle()"
      >
        @if (selectedName()) {
          {{ selectedName() }}
        } @else {
          <i mznIcon [icon]="dotVerticalIcon"></i>
        }
      </button>
    </div>
  `,
})
class DropdownPlacementItemComponent {
  readonly dotVerticalIcon = DotVerticalIcon;
  readonly options = simpleOptions;
  readonly value = signal<string | undefined>(undefined);
  readonly open = signal(false);

  readonly label = input<string>('');
  readonly placement = input<Placement>('bottom-start');

  selectedName(): string | undefined {
    return this.options.find((o) => o.id === this.value())?.name;
  }

  toggle(): void {
    this.open.set(!this.open());
  }

  onSelect(option: DropdownOption): void {
    this.value.set(option.id);
  }
}

@Component({
  selector: '[storyDropdownPlacement]',
  standalone: true,
  imports: [DropdownPlacementItemComponent],
  host: {
    style:
      'display: inline-grid; gap: 30px; grid-auto-rows: minmax(min-content, max-content); grid-template-columns: repeat(5, max-content); justify-content: center; margin-top: 50px; width: 100%;',
  },
  template: `
    <div></div>
    <div
      storyDropdownPlacementItem
      [label]="'Top Start'"
      [placement]="'top-start'"
    ></div>
    <div storyDropdownPlacementItem [label]="'Top'" [placement]="'top'"></div>
    <div
      storyDropdownPlacementItem
      [label]="'Top End'"
      [placement]="'top-end'"
    ></div>
    <div></div>
    <div
      storyDropdownPlacementItem
      [label]="'Left Start'"
      [placement]="'left-start'"
    ></div>
    <div></div>
    <div></div>
    <div></div>
    <div
      storyDropdownPlacementItem
      [label]="'Right Start'"
      [placement]="'right-start'"
    ></div>
    <div storyDropdownPlacementItem [label]="'Left'" [placement]="'left'"></div>
    <div></div>
    <div></div>
    <div></div>
    <div
      storyDropdownPlacementItem
      [label]="'Right'"
      [placement]="'right'"
    ></div>
    <div
      storyDropdownPlacementItem
      [label]="'Left End'"
      [placement]="'left-end'"
    ></div>
    <div></div>
    <div></div>
    <div></div>
    <div
      storyDropdownPlacementItem
      [label]="'Right End'"
      [placement]="'right-end'"
    ></div>
    <div></div>
    <div
      storyDropdownPlacementItem
      [label]="'Bottom Start'"
      [placement]="'bottom-start'"
    ></div>
    <div
      storyDropdownPlacementItem
      [label]="'Bottom'"
      [placement]="'bottom'"
    ></div>
    <div
      storyDropdownPlacementItem
      [label]="'Bottom End'"
      [placement]="'bottom-end'"
    ></div>
    <div></div>
  `,
})
class DropdownPlacementComponent {}

export const PlacementExample: Story = {
  decorators: [moduleMetadata({ imports: [DropdownPlacementComponent] })],
  render: () => ({
    template: `<div storyDropdownPlacement></div>`,
  }),
};

@Component({
  selector: '[storyDropdownControlled]',
  standalone: true,
  imports: [MznDropdown, MznButton],
  host: {
    style:
      'display: flex; flex-direction: column; gap: 12px; max-width: 240px;',
  },
  template: `
    <div style="display: flex; gap: 8px;">
      <button
        mznButton
        size="minor"
        variant="base-primary"
        (mousedown)="$event.stopPropagation()"
        (click)="$event.stopPropagation(); open.set(true)"
      >
        開啟
      </button>
      <button
        mznButton
        size="minor"
        variant="base-secondary"
        (mousedown)="$event.stopPropagation()"
        (click)="$event.stopPropagation(); open.set(false)"
      >
        關閉
      </button>
    </div>
    <div
      mznDropdown
      [anchor]="anchor"
      [open]="open()"
      [options]="options"
      [value]="value()"
      (select)="onSelect($event)"
      (close)="open.set(false)"
    >
      <button #anchor mznButton variant="base-primary" (click)="toggle()">
        {{ selectedLabel() }}
      </button>
    </div>
  `,
})
class DropdownControlledComponent {
  readonly options = simpleOptions;
  readonly open = signal(false);
  readonly value = signal<string | undefined>(undefined);

  selectedLabel(): string {
    const matched = this.options.find((o) => o.id === this.value());

    return matched?.name ?? '請選擇';
  }

  toggle(): void {
    this.open.set(!this.open());
  }

  onSelect(option: DropdownOption): void {
    this.value.set(option.id);
  }
}

export const ControlledVisibility: Story = {
  decorators: [moduleMetadata({ imports: [DropdownControlledComponent] })],
  render: () => ({
    template: `<div storyDropdownControlled></div>`,
  }),
};

@Component({
  selector: '[storyDropdownLoadMore]',
  standalone: true,
  imports: [MznDropdown, MznButton, MznTag, MznTypography],
  host: {
    style:
      'display: flex; flex-direction: column; gap: 12px; max-width: 320px;',
  },
  template: `
    <div
      mznTag
      [label]="'已載入 ' + options().length + ' / ' + total + ' 個選項'"
    ></div>
    <div style="display: flex; gap: 8px; align-items: center;">
      <div
        mznDropdown
        [anchor]="anchor"
        [open]="open()"
        [options]="options()"
        [value]="value()"
        [maxHeight]="300"
        [status]="loading() ? 'loading' : undefined"
        loadingPosition="bottom"
        loadingText="載入中..."
        placement="right-start"
        (select)="onSelect($event)"
        (close)="open.set(false)"
        (reachBottom)="loadMore()"
      >
        <button #anchor mznButton variant="base-primary" (click)="toggle()">
          {{ selectedLabel() }}
        </button>
      </div>
    </div>
    <div style="font-size: 12px; color: #666;">
      @if (loading()) {
        <div mznTypography>正在載入更多選項...</div>
      }
      @if (!hasMore() && !loading()) {
        <div mznTypography>已載入所有選項</div>
      }
    </div>
  `,
})
class DropdownLoadMoreComponent {
  readonly total = usStatesOptions.length;
  readonly open = signal(false);
  readonly value = signal<string | undefined>(undefined);
  readonly options = signal<DropdownOption[]>(usStatesOptions.slice(0, 10));
  readonly loading = signal(false);
  readonly hasMore = signal(true);

  selectedLabel(): string {
    const matched = this.options().find((o) => o.id === this.value());

    return matched?.name ?? '請選擇';
  }

  toggle(): void {
    this.open.set(!this.open());
  }

  onSelect(option: DropdownOption): void {
    this.value.set(option.id);
  }

  loadMore(): void {
    if (this.loading() || !this.hasMore()) return;

    this.loading.set(true);

    setTimeout(() => {
      const current = this.options().length;
      const next = usStatesOptions.slice(current, current + 10);

      if (next.length === 0) {
        this.hasMore.set(false);
      } else {
        this.options.update((prev) => [...prev, ...next]);
      }

      this.loading.set(false);
    }, 1000);
  }
}

export const LoadMoreOnReachBottom: Story = {
  decorators: [moduleMetadata({ imports: [DropdownLoadMoreComponent] })],
  render: () => ({
    template: `<div storyDropdownLoadMore></div>`,
  }),
};
