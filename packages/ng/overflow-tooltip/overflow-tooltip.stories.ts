import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ChevronDownIcon } from '@mezzanine-ui/icons';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznTag } from '@mezzanine-ui/ng/tag';
import { MznOverflowTooltip } from './overflow-tooltip.component';
import { MznOverflowCounterTag } from './overflow-counter-tag.component';

export default {
  title: 'Internal/OverflowTooltip',
  decorators: [
    moduleMetadata({
      imports: [MznOverflowTooltip, MznOverflowCounterTag],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

// ─── Playground ─────────────────────────────────────────────────────

@Component({
  selector: 'story-overflow-tooltip-playground',
  standalone: true,
  imports: [MznOverflowTooltip],
  template: `
    <div style="padding: 100px;">
      <div
        #anchorEl
        style="width: 32px; height: 32px; border-radius: 999px; background: white;"
      ></div>
      <div
        mznOverflowTooltip
        [anchor]="anchorElRef()!"
        [className]="className"
        [open]="open"
        [placement]="placement"
        [readOnly]="readOnly"
        [tagSize]="tagSize"
        [tags]="tags"
        (tagDismiss)="onDismiss($event)"
      ></div>
    </div>
  `,
})
class PlaygroundComponent {
  readonly anchorElRef = viewChild<ElementRef<HTMLElement>>('anchorEl');

  className = '';
  open = true;
  placement: string = 'top-start';
  readOnly = false;
  tagSize: string = 'main';
  tags: string[] = ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5'];

  onDismiss(index: number): void {
    console.log(`Dismiss tag at index: ${index}`);
  }
}

export const Playground: Story = {
  decorators: [moduleMetadata({ imports: [PlaygroundComponent] })],
  argTypes: {
    className: {
      control: 'text',
      description: '額外 CSS class。',
      table: { type: { summary: 'string' }, defaultValue: { summary: '' } },
    },
    open: {
      control: 'boolean',
      description: '是否開啟。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    placement: {
      options: [
        'top-start',
        'top',
        'top-end',
        'bottom-start',
        'bottom',
        'bottom-end',
      ],
      control: { type: 'select' },
      description: 'Popper 定位方向。',
      table: {
        type: { summary: 'Placement' },
        defaultValue: { summary: "'top-start'" },
      },
    },
    readOnly: {
      control: 'boolean',
      description: '是否唯讀。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    tagSize: {
      options: ['main', 'small', 'large'],
      control: { type: 'select' },
      description: '標籤尺寸。',
      table: {
        type: { summary: 'TagSize' },
        defaultValue: { summary: "'main'" },
      },
    },
    tags: {
      control: 'object',
      description: '標籤清單。',
      table: { type: { summary: 'string[]' } },
    },
  },
  args: {
    className: '',
    open: true,
    placement: 'top-start',
    readOnly: false,
    tagSize: 'main',
    tags: ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5'],
  },
  render: (args) => ({
    props: args,
    template: `<story-overflow-tooltip-playground
      [className]="className"
      [open]="open"
      [placement]="placement"
      [readOnly]="readOnly"
      [tagSize]="tagSize"
      [tags]="tags"
    />`,
  }),
};

// ─── States ─────────────────────────────────────────────────────────

@Component({
  selector: 'story-overflow-tooltip-states',
  standalone: true,
  imports: [MznOverflowTooltip],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 100px; padding-top: 100px;"
    >
      <div>
        <div
          #anchor1El
          style="width: 32px; height: 32px; border-radius: 999px; background: white;"
        >
          <span style="font-size: 18px; font-weight: 700;">Dismissable</span>
        </div>
        <div
          mznOverflowTooltip
          [anchor]="anchor1ElRef()!"
          [open]="true"
          [tags]="tags"
          (tagDismiss)="onDismiss($event)"
        ></div>
      </div>
      <div>
        <div
          #anchor2El
          style="width: fit-content; border-radius: 999px; background: white;"
        >
          <span style="font-size: 18px; font-weight: 700;">Read Only</span>
        </div>
        <div
          mznOverflowTooltip
          [anchor]="anchor2ElRef()!"
          [open]="true"
          [readOnly]="true"
          [tags]="tags"
          (tagDismiss)="onDismiss($event)"
        ></div>
      </div>
    </div>
  `,
})
class StatesComponent {
  readonly anchor1ElRef = viewChild<ElementRef<HTMLElement>>('anchor1El');
  readonly anchor2ElRef = viewChild<ElementRef<HTMLElement>>('anchor2El');

  readonly tags = ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5'];

  onDismiss(index: number): void {
    console.log(`Dismiss tag at index: ${index}`);
  }
}

export const States: Story = {
  decorators: [moduleMetadata({ imports: [StatesComponent] })],
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `<story-overflow-tooltip-states />`,
  }),
};

// ─── Placement ──────────────────────────────────────────────────────

@Component({
  selector: 'story-overflow-tooltip-placement',
  standalone: true,
  imports: [MznOverflowTooltip],
  template: `
    <div
      style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; padding: 24px;"
    >
      @for (item of placements; track item.placement) {
        <div
          [style.display]="'flex'"
          [style.flex-direction]="'column'"
          [style.align-items]="'flex-start'"
          [style.gap]="'8px'"
          [style.padding-top]="
            item.placement.startsWith('bottom') ? '0' : '80px'
          "
          [style.padding-bottom]="
            item.placement.startsWith('bottom') ? '80px' : '0'
          "
        >
          <span style="font-size: 12px; color: #888;">{{
            item.placement
          }}</span>
          <div
            #triggerEl
            style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border: 1px solid #d9d9d9; border-radius: 4px; background: white; font-size: 14px; white-space: nowrap;"
          >
            Tag 1 &times;&nbsp;<strong>+ 3</strong>
          </div>
          <div
            mznOverflowTooltip
            [anchor]="triggerEl"
            [open]="true"
            [placement]="item.placement"
            [tags]="tags"
            (tagDismiss)="noop()"
          ></div>
        </div>
      }
    </div>
  `,
})
class PlacementComponent {
  readonly placements = [
    { placement: 'top-start' },
    { placement: 'top' },
    { placement: 'top-end' },
    { placement: 'bottom-start' },
    { placement: 'bottom' },
    { placement: 'bottom-end' },
  ];

  readonly tags = ['Option 2', 'Option 3', 'Option 4', 'Option 5'];

  noop(): void {}
}

export const Placement: Story = {
  decorators: [moduleMetadata({ imports: [PlacementComponent] })],
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `<story-overflow-tooltip-placement />`,
  }),
};

// ─── PlacementOnClick ────────────────────────────────────────────────

@Component({
  selector: 'story-overflow-tooltip-placement-on-click',
  standalone: true,
  imports: [MznIcon, MznOverflowCounterTag, MznTag],
  template: `
    <div
      style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; padding: 24px;"
    >
      @for (item of placements; track item.placement) {
        <div
          [style.display]="'flex'"
          [style.flex-direction]="'column'"
          [style.align-items]="'flex-start'"
          [style.gap]="'8px'"
          [style.padding-top]="
            item.placement.startsWith('bottom') ? '0' : '100px'
          "
          [style.padding-bottom]="
            item.placement.startsWith('bottom') ? '100px' : '0'
          "
        >
          <span style="font-size: 12px; color: #888;">{{
            item.placement
          }}</span>
          <div
            style="display: inline-flex; align-items: center; gap: 4px; padding: 0 8px; border: 1px solid #d9d9d9; border-radius: 4px; background: white; min-width: 200px; height: 36px; box-sizing: border-box;"
          >
            <div
              style="flex: 1; display: flex; align-items: center; gap: 4px; overflow: hidden;"
            >
              <span
                mznTag
                type="dismissable"
                label="Option 1"
                size="main"
                (close)="noop()"
              ></span>
              <span
                mznOverflowCounterTag
                [placement]="item.placement"
                [tags]="tags"
                tagSize="main"
                (tagDismiss)="noop()"
              ></span>
            </div>
            <i
              mznIcon
              [icon]="chevronDownIcon"
              style="color: #8c8c8c; flex-shrink: 0;"
            ></i>
          </div>
        </div>
      }
    </div>
  `,
})
class PlacementOnClickComponent {
  readonly placements = [
    { placement: 'top-start' },
    { placement: 'top' },
    { placement: 'top-end' },
    { placement: 'bottom-start' },
    { placement: 'bottom' },
    { placement: 'bottom-end' },
  ];

  readonly tags = ['Option 2', 'Option 3', 'Option 4', 'Option 5'];

  protected readonly chevronDownIcon = ChevronDownIcon;

  noop(): void {}
}

export const PlacementOnClick: Story = {
  decorators: [moduleMetadata({ imports: [PlacementOnClickComponent] })],
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `<story-overflow-tooltip-placement-on-click />`,
  }),
};

// ─── SingleTag ──────────────────────────────────────────────────────

@Component({
  selector: 'story-overflow-tooltip-single-tag',
  standalone: true,
  imports: [MznOverflowTooltip],
  template: `
    <div style="padding: 100px;">
      <div
        #anchorEl
        style="width: 32px; height: 32px; border-radius: 999px; background: white;"
      ></div>
      <div
        mznOverflowTooltip
        [anchor]="anchorElRef()!"
        [open]="true"
        [tags]="['Tag 1']"
        (tagDismiss)="noop()"
      ></div>
    </div>
  `,
})
class SingleTagComponent {
  readonly anchorElRef = viewChild<ElementRef<HTMLElement>>('anchorEl');

  noop(): void {}
}

export const SingleTag: Story = {
  decorators: [moduleMetadata({ imports: [SingleTagComponent] })],
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `<story-overflow-tooltip-single-tag />`,
  }),
};

// ─── DismissableTags ────────────────────────────────────────────────

@Component({
  selector: 'story-overflow-tooltip-dismissable',
  standalone: true,
  imports: [MznOverflowTooltip],
  template: `
    <div style="padding: 100px;">
      <div
        #anchorEl
        style="width: 32px; height: 32px; border-radius: 999px; background: white;"
      ></div>
      <div
        mznOverflowTooltip
        [anchor]="anchorElRef()!"
        [open]="true"
        [tags]="tags()"
        (tagDismiss)="dismiss($event)"
      ></div>
    </div>
  `,
})
class DismissableTagsComponent {
  readonly anchorElRef = viewChild<ElementRef<HTMLElement>>('anchorEl');

  readonly tags = signal(['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5']);

  dismiss(index: number): void {
    this.tags.update((prev) => prev.filter((_, i) => i !== index));
  }
}

export const DismissableTags: Story = {
  decorators: [moduleMetadata({ imports: [DismissableTagsComponent] })],
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `<story-overflow-tooltip-dismissable />`,
  }),
};

// ─── OverflowCounterTagPlayground ───────────────────────────────────

export const OverflowCounterTagPlayground: Story = {
  argTypes: {
    className: {
      control: 'text',
      description: '額外 CSS class。',
      table: { type: { summary: 'string' }, defaultValue: { summary: '' } },
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    placement: {
      options: [
        'top-start',
        'top',
        'top-end',
        'bottom-start',
        'bottom',
        'bottom-end',
      ],
      control: { type: 'select' },
      description: 'Popper 定位方向。',
      table: {
        type: { summary: 'Placement' },
        defaultValue: { summary: "'top-start'" },
      },
    },
    readOnly: {
      control: 'boolean',
      description: '是否唯讀。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    tagSize: {
      options: ['main', 'small', 'large'],
      control: { type: 'select' },
      description: '標籤尺寸。',
      table: {
        type: { summary: 'TagSize' },
        defaultValue: { summary: "'main'" },
      },
    },
    tags: {
      control: 'object',
      description: '標籤清單。',
      table: { type: { summary: 'string[]' } },
    },
  },
  args: {
    className: '',
    disabled: false,
    placement: 'top-start',
    readOnly: false,
    tagSize: 'main',
    tags: ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5'],
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 100px;">
        <span mznOverflowCounterTag
          [className]="className"
          [disabled]="disabled"
          [placement]="placement"
          [readOnly]="readOnly"
          [tagSize]="tagSize"
          [tags]="tags"
        ></span>
      </div>
    `,
  }),
};
