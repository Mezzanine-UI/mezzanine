import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { type Placement } from '@floating-ui/dom';
import { MznDropdown } from './dropdown.component';
import { MznButton } from '../button/button.directive';

const meta: Meta<MznDropdown> = {
  title: 'Internal/Dropdown',
  component: MznDropdown,
  decorators: [
    moduleMetadata({
      imports: [MznButton],
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

@Component({
  selector: 'story-dropdown-playground',
  standalone: true,
  imports: [MznDropdown, MznButton],
  template: `
    <div style="padding: 40px;">
      <button #anchor mznButton variant="base-primary" (click)="toggle()">
        {{ selectedLabel() }}
      </button>
      <div
        mznDropdown
        [anchor]="anchor"
        [disabled]="disabled()"
        [open]="open()"
        [options]="options"
        [placement]="placement()"
        [value]="value()"
        (selected)="onSelect($event)"
        (closed)="open.set(false)"
      ></div>
    </div>
  `,
})
class DropdownPlaygroundComponent {
  readonly options = simpleOptions;
  readonly open = signal(false);
  readonly value = signal<string | undefined>(undefined);

  disabled = signal(false);
  placement = signal<Placement>('bottom-start');

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
  decorators: [moduleMetadata({ imports: [DropdownPlaygroundComponent] })],
  render: (args) => ({
    props: args,
    template: `<story-dropdown-playground [disabled]="disabled" [placement]="placement" />`,
  }),
};

@Component({
  selector: 'story-dropdown-autocomplete',
  standalone: true,
  imports: [MznDropdown, MznButton],
  template: `
    <div style="width: 320px; padding: 40px;">
      <div style="margin-bottom: 8px; font-size: 13px; font-weight: 600;"
        >Combobox with AutoComplete</div
      >
      <div style="margin-top: 12px; position: relative;">
        <input
          #anchor
          type="text"
          [value]="inputValue()"
          (input)="onInput($event)"
          (focus)="open.set(true)"
          placeholder="Type or select a state..."
          style="width: 100%; padding: 8px; box-sizing: border-box;"
        />
        <div
          mznDropdown
          [anchor]="anchor"
          [open]="open()"
          [options]="filteredOptions()"
          [value]="selectedId()"
          (selected)="onSelect($event)"
          (closed)="open.set(false)"
        ></div>
      </div>
    </div>
  `,
})
class DropdownAutoCompleteComponent {
  readonly open = signal(false);
  readonly inputValue = signal('');
  readonly selectedId = signal<string | undefined>(undefined);

  readonly filteredOptions = (() => {
    const filterFn = () => {
      const keyword = this.inputValue().trim().toLowerCase();
      if (!keyword) return usStatesOptions;
      return usStatesOptions.filter((o) =>
        o.name.toLowerCase().includes(keyword),
      );
    };
    return filterFn;
  })();

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

export const AutoCompleteExample: Story = {
  decorators: [moduleMetadata({ imports: [DropdownAutoCompleteComponent] })],
  render: () => ({
    template: `<story-dropdown-autocomplete />`,
  }),
};

@Component({
  selector: 'story-dropdown-inside',
  standalone: true,
  imports: [MznDropdown, MznButton],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 24px; max-width: 400px; padding: 40px;"
    >
      <div
        style="display: flex; gap: 8px; align-items: flex-start; flex-direction: column;"
      >
        <div style="flex: 1;">
          <input
            #anchor
            type="text"
            [value]="inputValue()"
            (input)="onInput($event)"
            (focus)="open.set(true)"
            placeholder="請選擇或輸入..."
            style="width: 100%; padding: 8px; box-sizing: border-box;"
          />
          <div
            mznDropdown
            [anchor]="anchor"
            [open]="open()"
            [options]="filteredOptions()"
            [value]="selectedId()"
            (selected)="onSelect($event)"
            (closed)="open.set(false)"
          ></div>
        </div>
      </div>
    </div>
  `,
})
class DropdownInsideComponent {
  readonly open = signal(false);
  readonly inputValue = signal('');
  readonly selectedId = signal<string | undefined>(undefined);

  readonly filteredOptions = (() => {
    const filterFn = () => {
      const keyword = this.inputValue().trim().toLowerCase();
      if (!keyword) return usStatesOptions;
      return usStatesOptions.filter((o) =>
        o.name.toLowerCase().includes(keyword),
      );
    };
    return filterFn;
  })();

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
    template: `<story-dropdown-inside />`,
  }),
};

@Component({
  selector: 'story-dropdown-placement',
  standalone: true,
  imports: [MznDropdown, MznButton],
  template: `
    <div
      style="display: inline-grid; gap: 30px; grid-auto-rows: minmax(min-content, max-content); grid-template-columns: repeat(5, max-content); justify-content: center; margin-top: 50px; width: 100%;"
    >
      <div></div>
      <div
        style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 120px;"
      >
        <span style="font-size: 12px;">Top Start</span>
        <button
          #anchor1
          mznButton
          variant="base-secondary"
          (click)="togglePlacement('top-start', anchor1)"
          >...</button
        >
        <div
          mznDropdown
          [anchor]="anchor1"
          [open]="isOpen('top-start')"
          [options]="options"
          placement="top-start"
          (selected)="closeAll()"
          (closed)="closeAll()"
        ></div>
      </div>
      <div
        style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 120px;"
      >
        <span style="font-size: 12px;">Top</span>
        <button
          #anchor2
          mznButton
          variant="base-secondary"
          (click)="togglePlacement('top', anchor2)"
          >...</button
        >
        <div
          mznDropdown
          [anchor]="anchor2"
          [open]="isOpen('top')"
          [options]="options"
          placement="top"
          (selected)="closeAll()"
          (closed)="closeAll()"
        ></div>
      </div>
      <div
        style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 120px;"
      >
        <span style="font-size: 12px;">Top End</span>
        <button
          #anchor3
          mznButton
          variant="base-secondary"
          (click)="togglePlacement('top-end', anchor3)"
          >...</button
        >
        <div
          mznDropdown
          [anchor]="anchor3"
          [open]="isOpen('top-end')"
          [options]="options"
          placement="top-end"
          (selected)="closeAll()"
          (closed)="closeAll()"
        ></div>
      </div>
      <div></div>
      <div
        style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 120px;"
      >
        <span style="font-size: 12px;">Left Start</span>
        <button
          #anchor4
          mznButton
          variant="base-secondary"
          (click)="togglePlacement('left-start', anchor4)"
          >...</button
        >
        <div
          mznDropdown
          [anchor]="anchor4"
          [open]="isOpen('left-start')"
          [options]="options"
          placement="left-start"
          (selected)="closeAll()"
          (closed)="closeAll()"
        ></div>
      </div>
      <div></div><div></div><div></div>
      <div
        style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 120px;"
      >
        <span style="font-size: 12px;">Right Start</span>
        <button
          #anchor5
          mznButton
          variant="base-secondary"
          (click)="togglePlacement('right-start', anchor5)"
          >...</button
        >
        <div
          mznDropdown
          [anchor]="anchor5"
          [open]="isOpen('right-start')"
          [options]="options"
          placement="right-start"
          (selected)="closeAll()"
          (closed)="closeAll()"
        ></div>
      </div>
      <div
        style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 120px;"
      >
        <span style="font-size: 12px;">Left</span>
        <button
          #anchor6
          mznButton
          variant="base-secondary"
          (click)="togglePlacement('left', anchor6)"
          >...</button
        >
        <div
          mznDropdown
          [anchor]="anchor6"
          [open]="isOpen('left')"
          [options]="options"
          placement="left"
          (selected)="closeAll()"
          (closed)="closeAll()"
        ></div>
      </div>
      <div></div><div></div><div></div>
      <div
        style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 120px;"
      >
        <span style="font-size: 12px;">Right</span>
        <button
          #anchor7
          mznButton
          variant="base-secondary"
          (click)="togglePlacement('right', anchor7)"
          >...</button
        >
        <div
          mznDropdown
          [anchor]="anchor7"
          [open]="isOpen('right')"
          [options]="options"
          placement="right"
          (selected)="closeAll()"
          (closed)="closeAll()"
        ></div>
      </div>
      <div
        style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 120px;"
      >
        <span style="font-size: 12px;">Left End</span>
        <button
          #anchor8
          mznButton
          variant="base-secondary"
          (click)="togglePlacement('left-end', anchor8)"
          >...</button
        >
        <div
          mznDropdown
          [anchor]="anchor8"
          [open]="isOpen('left-end')"
          [options]="options"
          placement="left-end"
          (selected)="closeAll()"
          (closed)="closeAll()"
        ></div>
      </div>
      <div></div><div></div><div></div>
      <div
        style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 120px;"
      >
        <span style="font-size: 12px;">Right End</span>
        <button
          #anchor9
          mznButton
          variant="base-secondary"
          (click)="togglePlacement('right-end', anchor9)"
          >...</button
        >
        <div
          mznDropdown
          [anchor]="anchor9"
          [open]="isOpen('right-end')"
          [options]="options"
          placement="right-end"
          (selected)="closeAll()"
          (closed)="closeAll()"
        ></div>
      </div>
      <div></div>
      <div
        style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 120px;"
      >
        <span style="font-size: 12px;">Bottom Start</span>
        <button
          #anchor10
          mznButton
          variant="base-secondary"
          (click)="togglePlacement('bottom-start', anchor10)"
          >...</button
        >
        <div
          mznDropdown
          [anchor]="anchor10"
          [open]="isOpen('bottom-start')"
          [options]="options"
          placement="bottom-start"
          (selected)="closeAll()"
          (closed)="closeAll()"
        ></div>
      </div>
      <div
        style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 120px;"
      >
        <span style="font-size: 12px;">Bottom</span>
        <button
          #anchor11
          mznButton
          variant="base-secondary"
          (click)="togglePlacement('bottom', anchor11)"
          >...</button
        >
        <div
          mznDropdown
          [anchor]="anchor11"
          [open]="isOpen('bottom')"
          [options]="options"
          placement="bottom"
          (selected)="closeAll()"
          (closed)="closeAll()"
        ></div>
      </div>
      <div
        style="display: flex; flex-direction: column; align-items: center; gap: 8px; width: 120px;"
      >
        <span style="font-size: 12px;">Bottom End</span>
        <button
          #anchor12
          mznButton
          variant="base-secondary"
          (click)="togglePlacement('bottom-end', anchor12)"
          >...</button
        >
        <div
          mznDropdown
          [anchor]="anchor12"
          [open]="isOpen('bottom-end')"
          [options]="options"
          placement="bottom-end"
          (selected)="closeAll()"
          (closed)="closeAll()"
        ></div>
      </div>
      <div></div>
    </div>
  `,
})
class DropdownPlacementComponent {
  readonly options = simpleOptions;
  readonly openPlacement = signal<string | null>(null);

  isOpen(placement: string): boolean {
    return this.openPlacement() === placement;
  }

  togglePlacement(placement: string, _anchor: HTMLElement): void {
    this.openPlacement.set(
      this.openPlacement() === placement ? null : placement,
    );
  }

  closeAll(): void {
    this.openPlacement.set(null);
  }
}

export const PlacementExample: Story = {
  decorators: [moduleMetadata({ imports: [DropdownPlacementComponent] })],
  render: () => ({
    template: `<story-dropdown-placement />`,
  }),
};

@Component({
  selector: 'story-dropdown-controlled',
  standalone: true,
  imports: [MznDropdown, MznButton],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 12px; max-width: 240px; padding: 40px;"
    >
      <div style="display: flex; gap: 8px;">
        <button
          mznButton
          size="minor"
          variant="base-primary"
          (mousedown)="$event.stopPropagation()"
          (click)="$event.stopPropagation(); open.set(true)"
          >開啟</button
        >
        <button
          mznButton
          size="minor"
          variant="base-secondary"
          (mousedown)="$event.stopPropagation()"
          (click)="$event.stopPropagation(); open.set(false)"
          >關閉</button
        >
      </div>
      <button #anchor mznButton variant="base-primary" (click)="toggle()">{{
        selectedLabel()
      }}</button>
      <div
        mznDropdown
        [anchor]="anchor"
        [open]="open()"
        [options]="options"
        [value]="value()"
        (selected)="onSelect($event)"
        (closed)="open.set(false)"
      ></div>
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
    this.open.set(false);
  }
}

export const ControlledVisibility: Story = {
  decorators: [moduleMetadata({ imports: [DropdownControlledComponent] })],
  render: () => ({
    template: `<story-dropdown-controlled />`,
  }),
};

@Component({
  selector: 'story-dropdown-load-more',
  standalone: true,
  imports: [MznDropdown, MznButton],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 12px; max-width: 320px; padding: 40px;"
    >
      <div style="font-size: 13px;"
        >已載入 {{ options().length }} / {{ total }} 個選項</div
      >
      <div style="display: flex; gap: 8px; align-items: center;">
        <button #anchor mznButton variant="base-primary" (click)="toggle()">{{
          selectedLabel()
        }}</button>
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
          (selected)="onSelect($event)"
          (closed)="open.set(false)"
          (reachBottom)="loadMore()"
        ></div>
      </div>
      @if (loading()) {
        <div style="font-size: 12px; color: #666;">正在載入更多選項...</div>
      }
      @if (!hasMore() && !loading()) {
        <div style="font-size: 12px; color: #666;">已載入所有選項</div>
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
    template: `<story-dropdown-load-more />`,
  }),
};
