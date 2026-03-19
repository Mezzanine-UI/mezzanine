import { Meta, StoryObj } from '@storybook/react-webpack5';
import { ChangeEvent } from 'react';
import type { UploaderProps } from '.';
import { Uploader } from '.';

export default {
  title: 'Data Entry/Upload/Uploader',
  component: Uploader,
} satisfies Meta<typeof Uploader>;

type Story = StoryObj<UploaderProps>;

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
    hints: [
      {
        label: 'jpg/png files with a size less than 500KB.',
      },
    ],
    onUpload: undefined,
    onChange: undefined,
    type: 'base',
  },
  argTypes: {
    accept: {
      control: {
        type: 'text',
      },
      description: 'The accept attributes of native input element',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      description: 'Whether the input is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    mode: {
      control: {
        type: 'select',
        options: ['basic', 'dropzone'],
      },
      description: 'The mode for upload component.',
      table: {
        type: { summary: "'basic' | 'dropzone'" },
        defaultValue: { summary: "'basic'" },
      },
    },
    multiple: {
      control: {
        type: 'boolean',
      },
      description: 'Whether can select multiple files to upload',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    name: {
      control: {
        type: 'text',
      },
      description: 'The name attribute of the input element',
      table: {
        type: { summary: 'string' },
      },
    },
    id: {
      control: {
        type: 'text',
      },
      description: 'The id of input element',
      table: {
        type: { summary: 'string' },
      },
    },
    onUpload: {
      description: 'Fired after user selected files',
      table: {
        type: { summary: '(files: File[]) => void' },
      },
    },
    onChange: {
      description: 'Invoked by input change event',
      table: {
        type: { summary: 'ChangeEventHandler<HTMLInputElement>' },
      },
    },
    inputProps: {
      control: false,
      table: {
        disable: true,
      },
    },
    inputRef: {
      control: false,
      table: {
        disable: true,
      },
    },
    className: {
      control: false,
      table: {
        disable: true,
      },
    },
    type: {
      control: {
        type: 'select',
        options: ['base', 'button'],
      },
      description: 'The type for upload component.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'base' },
      },
    },
  },
  render: (props: UploaderProps) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      // eslint-disable-next-line no-console
      console.log('Uploader changed:', {
        files: event.target.files,
        name: props.name,
      });
    };

    const handleUpload = (files: File[]) => {
      // eslint-disable-next-line no-console
      console.log('Files uploaded:', files);
    };

    return (
      <Uploader
        {...props}
        onChange={handleChange}
        onUpload={handleUpload}
      />
    );
  },
};
