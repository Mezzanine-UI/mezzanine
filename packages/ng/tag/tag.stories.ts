import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { MznAutocomplete } from '@mezzanine-ui/ng/autocomplete';
import { MznButton } from '@mezzanine-ui/ng/button';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import { MznTag } from './tag.component';
import { MznTagGroup } from './tag-group.component';

export default {
  title: 'Data Display/Tag',
  decorators: [
    moduleMetadata({
      imports: [MznTag, MznTypography],
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
          <span mznTypography variant="h2">Static</span>
          <div style="display: flex; gap: 36px; align-items: flex-end;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span mznTag type="static" label="Tag" size="main"></span>
              <span mznTypography variant="body" style="margin-inline: auto;"
                >Enabled</span
              >
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span
                mznTag
                type="static"
                label="Tag"
                size="main"
                [readOnly]="true"
              ></span>
              <span mznTypography variant="body" style="margin-inline: auto;"
                >Read Only</span
              >
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          <span mznTypography variant="h2">Counter</span>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <span mznTag type="counter" label="Tag" size="main" [count]="5"></span>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          <span mznTypography variant="h2">Overflow Counter</span>
          <div style="display: flex; gap: 36px; align-items: flex-end;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span mznTag type="overflow-counter" size="main" [count]="5"></span>
              <span mznTypography variant="body" style="margin-inline: auto;"
                >Enabled</span
              >
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span
                mznTag
                type="overflow-counter"
                size="main"
                [count]="5"
                [disabled]="true"
              ></span>
              <span mznTypography variant="body" style="margin-inline: auto;"
                >Disabled</span
              >
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span
                mznTag
                type="overflow-counter"
                size="main"
                [count]="5"
                [readOnly]="true"
              ></span>
              <span mznTypography variant="body" style="margin-inline: auto;"
                >Read Only</span
              >
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          <span mznTypography variant="h2">Dismissable</span>
          <div style="display: flex; gap: 36px; align-items: flex-end;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span mznTag type="dismissable" label="Tag" size="main"></span>
              <span mznTypography variant="body" style="margin-inline: auto;"
                >Enabled</span
              >
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span
                mznTag
                class="is-hover"
                type="dismissable"
                label="Tag"
                size="main"
              ></span>
              <span mznTypography variant="body" style="margin-inline: auto;"
                >Hover</span
              >
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span
                mznTag
                type="dismissable"
                label="Tag"
                size="main"
                [active]="true"
              ></span>
              <span mznTypography variant="body" style="margin-inline: auto;"
                >Active</span
              >
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span
                mznTag
                type="dismissable"
                label="Tag"
                size="main"
                [disabled]="true"
              ></span>
              <span mznTypography variant="body" style="margin-inline: auto;"
                >Disabled</span
              >
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          <span mznTypography variant="h2">Addable</span>
          <div style="display: flex; gap: 36px; align-items: flex-end;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span mznTag type="addable" label="Tag" size="main"></span>
              <span mznTypography variant="body" style="margin-inline: auto;"
                >Enabled</span
              >
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span
                mznTag
                class="is-hover"
                type="addable"
                label="Tag"
                size="main"
              ></span>
              <span mznTypography variant="body" style="margin-inline: auto;"
                >Hover</span
              >
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span
                mznTag
                type="addable"
                label="Tag"
                size="main"
                [active]="true"
              ></span>
              <span mznTypography variant="body" style="margin-inline: auto;"
                >Active</span
              >
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span
                mznTag
                type="addable"
                label="Tag"
                size="main"
                [disabled]="true"
              ></span>
              <span mznTypography variant="body" style="margin-inline: auto;"
                >Disabled</span
              >
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

const autocompleteOptions: ReadonlyArray<DropdownOption> = [
  { id: 'design', name: 'Design' },
  { id: 'development', name: 'Development' },
  { id: 'product', name: 'Product' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'research', name: 'Research' },
  { id: 'data', name: 'Data' },
];

@Component({
  selector: 'story-tag-addable-interactive',
  standalone: true,
  imports: [FormsModule, MznAutocomplete, MznTag, MznTagGroup],
  template: `
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <div mznTagGroup>
        @for (id of selections; track id) {
          <span
            mznTag
            type="dismissable"
            [label]="getOptionName(id)"
            (close)="removeSelection(id)"
          ></span>
        }
        <span
          mznTag
          type="addable"
          [label]="open() ? '收起選單' : '新增標籤'"
          (mousedown)="$event.stopPropagation()"
          (click)="$event.stopPropagation(); toggleOpen()"
        ></span>
      </div>
      <div
        mznAutocomplete
        mode="multiple"
        inputPosition="inside"
        [addable]="true"
        [onInsert]="handleInsert"
        [onRemoveCreated]="handleRemoveCreated"
        [options]="options()"
        [open]="open()"
        placeholder="搜尋或新增標籤..."
        [(ngModel)]="selections"
        (visibilityChange)="closeDropdown()"
      ></div>
    </div>
  `,
})
class TagAddableInteractiveComponent {
  readonly options = signal<DropdownOption[]>([...autocompleteOptions]);
  readonly open = signal(false);
  selections: ReadonlyArray<string> = [];
  private nextId = autocompleteOptions.length + 1;

  readonly handleInsert = (
    text: string,
    currentOptions: ReadonlyArray<DropdownOption>,
  ): ReadonlyArray<DropdownOption> => {
    const newOption: DropdownOption = {
      id: `new-${this.nextId++}`,
      name: text,
    };
    const updated = [...currentOptions, newOption];

    this.options.set([...updated]);

    return updated;
  };

  readonly handleRemoveCreated = (
    cleanedOptions: ReadonlyArray<DropdownOption>,
  ): void => {
    this.options.set([...cleanedOptions]);
  };

  toggleOpen(): void {
    this.open.update((v) => !v);
  }

  closeDropdown(): void {
    this.open.set(false);
  }

  removeSelection(id: string): void {
    this.selections = this.selections.filter((s) => s !== id);
  }

  getOptionName(id: string): string {
    return this.options().find((o) => o.id === id)?.name ?? id;
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
  imports: [MznButton, MznTag, MznTagGroup],
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <button mznButton type="button" style="width: 120px;" (click)="addTag()">
        Add tag
      </button>

      <div mznTagGroup style="max-width: 320px;">
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
