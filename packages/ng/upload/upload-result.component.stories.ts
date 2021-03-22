import { action } from '@storybook/addon-actions';
import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { MznUploadResultModule } from '.';

export default {
  title: 'Data Entry/Upload/UploadResult',
  decorators: [
    moduleMetadata({
      imports: [MznUploadResultModule],
    }),
  ],
} as Meta;

interface BasicStoryArgs {
  onDelete: any;
  onDownload: any;
}

export const Basic: Story<BasicStoryArgs> = (args) => ({
  props: args,
  template: `
    <div
      [ngStyle]="{
        display: 'inline-grid',
        gridAutoFlow: 'row',
        gap: '16px',
        width: '400px'
      }"
    >
      <mzn-upload-result
        name="123.jpg"
        (delete)="onDelete($event)"
        (download)="onDownload($event)"
        status="done"
        [percentage]="100"
      ></mzn-upload-result>
      <mzn-upload-result
        name="456.jpg"
        [percentage]="40"
        status="loading"
        ></mzn-upload-result>
      <mzn-upload-result
        name="789.jpg"
        [percentage]="60"
        status="loading"
      ></mzn-upload-result>
      <mzn-upload-result
        name="long_file_name_long_long_long_long_long_long_long.jpg"
        (delete)="onDelete($event)"
        [percentage]="60"
        status="error"
      ></mzn-upload-result>
    </div>
  `,
});

Basic.args = {
  onDelete: action('onDelete'),
  onDownload: action('onDownload'),
};

export const Sizes: Story = () => ({
  template: `
    <div
      [ngStyle]="{
        display: 'inline-grid',
        gridAutoFlow: 'row',
        gap: '16px'
      }"
    >
      <mzn-upload-result
        name="123.jpg"
        size="large"
        status="done"
      ></mzn-upload-result>
      <mzn-upload-result
        name="123.jpg"
        status="done"
      ></mzn-upload-result>
      <mzn-upload-result
        name="123.jpg"
        size="small"
        status="done"
      ></mzn-upload-result>
    </div>
  `,
});
