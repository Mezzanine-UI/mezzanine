import { Meta, Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import { UploadButton, UploadResult, UploadResultProps } from '.';
import ConfigProvider from '../Provider';

export default {
  title: 'Data Entry/Upload/UploadResult',
} as Meta;

interface BasicStoryArgs {
  onDelete: VoidFunction;
  onDownload: VoidFunction;
}

export const Basic: Story<BasicStoryArgs> = ({ onDelete, onDownload }) => (
  <div
    style={{
      display: 'inline-grid',
      gridAutoFlow: 'row',
      gap: '16px',
      width: 400,
    }}
  >
    <UploadResult
      name="123.jpg"
      onDownload={onDownload}
      onDelete={onDelete}
      percentage={100}
      status="done"
    />
    <UploadResult
      name="456.jpg"
      percentage={40}
      status="loading"
    />
    <UploadResult
      name="789.jpg"
      percentage={60}
      status="loading"
    />
    <UploadResult
      name="long_file_name_long_long_long_long_long_long_long.jpg"
      onDelete={onDelete}
      percentage={60}
      status="error"
    />
  </div>
);

Basic.args = {
  onDelete: action('onDelete'),
  onDownload: action('onDownload'),
};

export const Sizes: Story = () => (
  <div
    style={{
      display: 'inline-grid',
      gridAutoFlow: 'row',
      gap: '16px',
    }}
  >
    <ConfigProvider size="large">
      <UploadResult
        name="123.jpg"
        status="done"
      />
    </ConfigProvider>
    <UploadResult
      name="123.jpg"
      status="done"
    />
    <UploadResult
      name="123.jpg"
      size="small"
      status="done"
    />
  </div>
);

interface ListStoryArgs {
  onDownload: NonNullable<UploadResultProps['onDownload']>;
}

export const List: Story<ListStoryArgs> = ({ onDownload }) => {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div
      style={{
        display: 'inline-grid',
        gridAutoFlow: 'row',
        gap: '16px',
      }}
    >
      <div>
        <UploadButton
          multiple
          variant="outlined"
          accept="image/*"
          onUpload={((uploadFiles) => setFiles((prev) => [...prev, ...uploadFiles]))}
        >
          upload
        </UploadButton>
      </div>
      {files.map((file) => (
        <UploadResult
          key={file.name}
          name={file.name}
          onDownload={onDownload}
          onDelete={() => setFiles(files.filter((f) => (f !== file)))}
          status="done"
        />
      ))}
    </div>
  );
};

List.args = {
  onDownload: action('onDownload'),
};
