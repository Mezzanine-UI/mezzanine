import { Component, computed, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznTag } from './tag.component';

export default {
  title: 'Data Display/Tag',
  decorators: [
    moduleMetadata({
      imports: [MznTag],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  argTypes: {
    type: {
      options: [
        'static',
        'counter',
        'dismissable',
        'addable',
        'overflow-counter',
      ],
      control: { type: 'select' },
    },
    size: {
      options: ['main', 'sub', 'minor'],
      control: { type: 'inline-radio' },
    },
    count: { control: { type: 'number' } },
    active: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    readOnly: { control: { type: 'boolean' } },
    label: { control: { type: 'text' } },
  },
  args: {
    type: 'static',
    label: 'Tag',
    size: 'main',
    count: 5,
    disabled: false,
    active: false,
    readOnly: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <span mznTag
        [type]="type"
        [label]="label"
        [size]="size"
        [count]="count"
        [disabled]="disabled"
        [active]="active"
        [readOnly]="readOnly"
      ></span>
    `,
  }),
};

export const Types: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 48px;">
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <h2>Static</h2>
          <div style="display: flex; gap: 36px; align-items: flex-end;">
            <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
              <span mznTag type="static" label="Tag" size="main" ></span>
              <span style="font-size: 12px; color: #6b7280;">Enabled</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
              <span mznTag type="static" label="Tag" size="main" [readOnly]="true" ></span>
              <span style="font-size: 12px; color: #6b7280;">Read Only</span>
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          <h2>Counter</h2>
          <span mznTag type="counter" label="Tag" size="main" [count]="5" ></span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          <h2>Overflow Counter</h2>
          <div style="display: flex; gap: 36px; align-items: flex-end;">
            <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
              <span mznTag type="overflow-counter" size="main" [count]="5" ></span>
              <span style="font-size: 12px; color: #6b7280;">Enabled</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
              <span mznTag type="overflow-counter" size="main" [count]="5" [disabled]="true" ></span>
              <span style="font-size: 12px; color: #6b7280;">Disabled</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
              <span mznTag type="overflow-counter" size="main" [count]="5" [readOnly]="true" ></span>
              <span style="font-size: 12px; color: #6b7280;">Read Only</span>
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          <h2>Dismissable</h2>
          <div style="display: flex; gap: 36px; align-items: flex-end;">
            <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
              <span mznTag type="dismissable" label="Tag" size="main" ></span>
              <span style="font-size: 12px; color: #6b7280;">Enabled</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
              <span mznTag class="is-hover" type="dismissable" label="Tag" size="main" ></span>
              <span style="font-size: 12px; color: #6b7280;">Hover</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
              <span mznTag type="dismissable" label="Tag" size="main" [active]="true" ></span>
              <span style="font-size: 12px; color: #6b7280;">Active</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
              <span mznTag type="dismissable" label="Tag" size="main" [disabled]="true" ></span>
              <span style="font-size: 12px; color: #6b7280;">Disabled</span>
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          <h2>Addable</h2>
          <div style="display: flex; gap: 36px; align-items: flex-end;">
            <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
              <span mznTag type="addable" label="Tag" size="main" ></span>
              <span style="font-size: 12px; color: #6b7280;">Enabled</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
              <span mznTag class="is-hover" type="addable" label="Tag" size="main" ></span>
              <span style="font-size: 12px; color: #6b7280;">Hover</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
              <span mznTag type="addable" label="Tag" size="main" [active]="true" ></span>
              <span style="font-size: 12px; color: #6b7280;">Active</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
              <span mznTag type="addable" label="Tag" size="main" [disabled]="true" ></span>
              <span style="font-size: 12px; color: #6b7280;">Disabled</span>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; gap: 72px;">
        <div style="display: flex; flex-direction: column; gap: 48px;">
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <h2>Static</h2>
            <div style="display: flex; gap: 36px; align-items: flex-end;">
              <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                <span mznTag type="static" label="Tag" size="main" ></span>
                <span style="font-size: 12px; color: #6b7280;">Main</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                <span mznTag type="static" label="Tag" size="sub" ></span>
                <span style="font-size: 12px; color: #6b7280;">Sub</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                <span mznTag type="static" label="Tag" size="minor" ></span>
                <span style="font-size: 12px; color: #6b7280;">Minor</span>
              </div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 16px;">
            <h2>Counter</h2>
            <div style="display: flex; gap: 36px; align-items: flex-end;">
              <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                <span mznTag type="counter" label="Tag" size="main" [count]="5" ></span>
                <span style="font-size: 12px; color: #6b7280;">Main</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                <span mznTag type="counter" label="Tag" size="sub" [count]="5" ></span>
                <span style="font-size: 12px; color: #6b7280;">Sub</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                <span mznTag type="counter" label="Tag" size="minor" [count]="5" ></span>
                <span style="font-size: 12px; color: #6b7280;">Minor</span>
              </div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 16px;">
            <h2>Overflow Counter</h2>
            <div style="display: flex; gap: 36px; align-items: flex-end;">
              <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                <span mznTag type="overflow-counter" size="main" [count]="5" ></span>
                <span style="font-size: 12px; color: #6b7280;">Main</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                <span mznTag type="overflow-counter" size="sub" [count]="5" ></span>
                <span style="font-size: 12px; color: #6b7280;">Sub</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                <span mznTag type="overflow-counter" size="minor" [count]="5" ></span>
                <span style="font-size: 12px; color: #6b7280;">Minor</span>
              </div>
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 48px;">
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <h2>Dismissable</h2>
            <div style="display: flex; gap: 36px; align-items: flex-end;">
              <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                <span mznTag type="dismissable" label="Tag" size="main" ></span>
                <span style="font-size: 12px; color: #6b7280;">Main</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                <span mznTag type="dismissable" label="Tag" size="sub" ></span>
                <span style="font-size: 12px; color: #6b7280;">Sub</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                <span mznTag type="dismissable" label="Tag" size="minor" ></span>
                <span style="font-size: 12px; color: #6b7280;">Minor</span>
              </div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 16px;">
            <h2>Addable</h2>
            <div style="display: flex; gap: 36px; align-items: flex-end;">
              <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                <span mznTag type="addable" label="Tag" size="main" ></span>
                <span style="font-size: 12px; color: #6b7280;">Main</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                <span mznTag type="addable" label="Tag" size="sub" ></span>
                <span style="font-size: 12px; color: #6b7280;">Sub</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                <span mznTag type="addable" label="Tag" size="minor" ></span>
                <span style="font-size: 12px; color: #6b7280;">Minor</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

@Component({
  selector: 'story-tag-addable-interactive',
  standalone: true,
  imports: [MznTag],
  template: `
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <div
        style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;"
      >
        @for (tag of tags(); track tag) {
          <span
            mznTag
            type="dismissable"
            [label]="tag"
            (close)="removeTag(tag)"
          ></span>
        }
        <span
          mznTag
          type="addable"
          [label]="open() ? '收起選單' : '新增標籤'"
          (tagClick)="toggleOpen()"
        ></span>
      </div>
      @if (open()) {
        <div
          style="display: flex; gap: 8px; flex-wrap: wrap; padding: 8px; border: 1px solid #e5e7eb; border-radius: 4px;"
        >
          @for (option of availableOptions(); track option) {
            <span
              mznTag
              type="addable"
              [label]="option"
              (tagClick)="addTag(option)"
            ></span>
          }
        </div>
      }
    </div>
  `,
})
class TagAddableInteractiveComponent {
  readonly tags = signal<string[]>([]);
  readonly open = signal(false);
  readonly allOptions = [
    'Design',
    'Development',
    'Product',
    'Marketing',
    'Research',
    'Data',
  ];

  readonly availableOptions = computed((): string[] =>
    this.allOptions.filter((opt) => !this.tags().includes(opt)),
  );

  toggleOpen(): void {
    this.open.update((v) => !v);
  }

  addTag(tag: string): void {
    this.tags.update((prev) => [...prev, tag]);
    this.open.set(false);
  }

  removeTag(tag: string): void {
    this.tags.update((prev) => prev.filter((t) => t !== tag));
  }
}

export const Addable_Interactive: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({
      imports: [TagAddableInteractiveComponent],
    }),
  ],
  render: () => ({
    template: `<story-tag-addable-interactive />`,
  }),
};

@Component({
  selector: 'story-tag-group',
  standalone: true,
  imports: [MznTag],
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <button
        type="button"
        style="width: 120px; padding: 6px 16px; background: #2563eb; color: #fff; border: none; border-radius: 4px; cursor: pointer;"
        (click)="addTag()"
        >Add tag</button
      >

      <div
        style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap; max-width: 320px;"
      >
        @for (tag of tags(); track tag; let i = $index) {
          <span
            mznTag
            type="dismissable"
            [label]="tag"
            (close)="removeTag(i)"
          ></span>
        }
      </div>
    </div>
  `,
})
class TagGroupComponent {
  readonly tags = signal(['Tag1', 'Tag2', 'Tag3', 'Tag4', 'Tag5']);

  addTag(): void {
    this.tags.update((prev) => [...prev, `Tag${prev.length + 1}`]);
  }

  removeTag(index: number): void {
    this.tags.update((prev) => prev.filter((_, i) => i !== index));
  }
}

export const Tag_Group: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({
      imports: [TagGroupComponent],
    }),
  ],
  render: () => ({
    template: `<story-tag-group />`,
  }),
};
