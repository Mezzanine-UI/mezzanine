import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznUploader } from './uploader.component';

export default {
  title: 'Data Entry/Upload/Uploader',
  component: MznUploader,
  decorators: [
    moduleMetadata({
      imports: [MznUploader],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  args: {
    accept: undefined,
    disabled: false,
    id: 'playground-upload',
    mode: 'basic',
    multiple: false,
    name: 'playground-upload',
    label: {
      uploadLabel: undefined,
      uploadingLabel: undefined,
      success: undefined,
      error: undefined,
      clickToUpload: 'Click to upload',
    },
    icon: {
      upload: undefined,
      error: undefined,
      success: undefined,
      zoom: undefined,
      document: undefined,
      download: undefined,
      reload: undefined,
      delete: undefined,
    },
    hints: [{ label: 'jpg/png files with a size less than 500KB.' }],
    type: 'base',
  },
  argTypes: {
    accept: {
      control: { type: 'text' },
      description: 'The accept attributes of native input element',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the input is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    mode: {
      options: ['basic', 'dropzone'],
      control: { type: 'select' },
      description: 'The mode for upload component.',
      table: {
        type: { summary: "'basic' | 'dropzone'" },
        defaultValue: { summary: "'basic'" },
      },
    },
    multiple: {
      control: { type: 'boolean' },
      description: 'Whether can select multiple files to upload',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    name: {
      control: { type: 'text' },
      description: 'The name attribute of the input element',
      table: {
        type: { summary: 'string' },
      },
    },
    id: {
      control: { type: 'text' },
      description: 'The id of input element',
      table: {
        type: { summary: 'string' },
      },
    },
    upload: {
      description: 'Fired after user selected files',
      table: {
        type: { summary: 'EventEmitter<File[]>' },
      },
    },
    change: {
      description: 'Invoked by native input change event',
      table: {
        type: { summary: 'EventEmitter<Event>' },
      },
    },
    inputProps: {
      control: false,
      table: { disable: true },
    },
    className: {
      control: false,
      table: { disable: true },
    },
    type: {
      options: ['base', 'button'],
      control: { type: 'select' },
      description: 'The type for upload component.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'base' },
      },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      onChange: (event: Event): void => {
        console.log('Uploader changed:', {
          files: (event.target as HTMLInputElement).files,
          name: args['name'],
        });
      },
      onUpload: (files: File[]): void => {
        console.log('Files uploaded:', files);
      },
    },
    template: `
      <label mznUploader
        [accept]="accept"
        [disabled]="disabled"
        [id]="id"
        [mode]="mode"
        [multiple]="multiple"
        [name]="name"
        [label]="label"
        [icon]="icon"
        [hints]="hints"
        [type]="type"
        (change)="onChange($event)"
        (upload)="onUpload($event)"
      ></label>
    `,
  }),
};
