import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznUploader } from './uploader.component';

export default {
  title: 'Data Entry/Upload/Uploader',
  decorators: [
    moduleMetadata({
      imports: [MznUploader],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  render: () => ({
    props: {
      onUpload: (files: File[]): void => {
        console.log('Files selected:', files);
      },
    },
    template: `
      <label mznUploader
        accept=".pdf,.doc,.docx"
        mode="dropzone"
        [fillWidth]="true"
        [multiple]="true"
        (upload)="onUpload($event)"
      ></label>
    `,
  }),
};
