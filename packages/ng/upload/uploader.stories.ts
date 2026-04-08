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
      onFileSelect: (fileList: FileList): void => {
        console.log('Files selected:', fileList);
      },
    },
    template: `
      <label mznUploader
        accept=".pdf,.doc,.docx"
        [multiple]="true"
        (fileSelect)="onFileSelect($event)"
      >
        <span>點擊或拖放檔案至此區域上傳</span>
      </label>
    `,
  }),
};
