import type { ArgTypes } from '@storybook/react-webpack5';
import { Meta, StoryObj } from '@storybook/react-webpack5';
import { useCallback, useEffect, useState } from 'react';
import { action } from 'storybook/actions';
import type { CropperElementProps } from './CropperElement';
import CropperElement from './CropperElement';
import type { CropArea } from './typings';

const argTypes: Partial<ArgTypes<CropperElementProps>> = {
  aspectRatio: {
    control: {
      type: 'number',
    },
    description: 'Aspect ratio for the crop area (width / height)',
    table: {
      type: { summary: 'number' },
      defaultValue: { summary: 'undefined' },
    },
  },
  minHeight: {
    control: {
      type: 'number',
    },
    description: 'Minimum crop area height in pixels',
    table: {
      type: { summary: 'number' },
      defaultValue: { summary: '50' },
    },
  },
  minWidth: {
    control: {
      type: 'number',
    },
    description: 'Minimum crop area width in pixels',
    table: {
      type: { summary: 'number' },
      defaultValue: { summary: '50' },
    },
  },
  size: {
    control: {
      options: ['main', 'sub', 'minor'],
      type: 'radio',
    },
    description: 'The size of cropper',
    table: {
      defaultValue: { summary: "'main'" },
      type: { summary: 'CropperSize' },
    },
  },
};

export default {
  argTypes,
  component: CropperElement,
  title: 'Feedback/Cropper/CropperElement',
} satisfies Meta<typeof CropperElement>;

type Story = StoryObj<CropperElementProps>;

const DEFAULT_IMAGE_URL = 'https://rytass.com/logo.png';

function BasicStoryContent() {
  const [cropArea, setCropArea] = useState<CropArea | null>(null);

  const handleCropChange = useCallback((area: CropArea) => {
    setCropArea(area);
    action('onCropChange')(area);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: 'min(100%, 32rem)',
      }}
    >
      <CropperElement
        imageSrc={DEFAULT_IMAGE_URL}
        onCropChange={handleCropChange}
        aspectRatio={1 / 1}
      />
      {cropArea && (
        <div style={{ fontSize: '0.875rem' }}>
          <strong>裁切區域：</strong> x: {Math.round(cropArea.x)}, y:{' '}
          {Math.round(cropArea.y)}, width: {Math.round(cropArea.width)}, height:{' '}
          {Math.round(cropArea.height)}
        </div>
      )}
    </div>
  );
}

function AspectRatioStoryContent() {
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(16 / 9);
  const [cropArea, setCropArea] = useState<CropArea | null>(null);

  const handleCropChange = useCallback((area: CropArea) => {
    setCropArea(area);
    action('onCropChange')(area);
  }, []);

  const handleAspectRatioChange = useCallback((value: string) => {
    if (!value) {
      setAspectRatio(undefined);
      return;
    }

    if (value.includes('/')) {
      const [numerator, denominator] = value.split('/').map(Number.parseFloat);
      if (!Number.isNaN(numerator) && !Number.isNaN(denominator)) {
        setAspectRatio(numerator / denominator);
      }
      return;
    }

    const parsed = Number.parseFloat(value);
    if (!Number.isNaN(parsed)) {
      setAspectRatio(parsed);
    }
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: 'min(100%, 32rem)',
      }}
    >
      <div style={{ alignItems: 'center', display: 'flex', gap: '0.5rem' }}>
        <label style={{ alignItems: 'center', display: 'flex', gap: '0.5rem' }}>
          <strong>Aspect Ratio:</strong>
          <select
            onChange={(event) => handleAspectRatioChange(event.target.value)}
            style={{ minWidth: '7.5rem', padding: '0.25rem 0.5rem' }}
            value={
              aspectRatio === undefined
                ? ''
                : aspectRatio === 1
                  ? '1'
                  : Math.abs(aspectRatio - 16 / 9) < 0.001
                    ? '16/9'
                    : Math.abs(aspectRatio - 4 / 3) < 0.001
                      ? '4/3'
                      : Math.abs(aspectRatio - 3 / 2) < 0.001
                        ? '3/2'
                        : aspectRatio.toString()
            }
          >
            <option value="">Free</option>
            <option value="1">1:1</option>
            <option value="16/9">16:9</option>
            <option value="4/3">4:3</option>
            <option value="3/2">3:2</option>
          </select>
        </label>
        {aspectRatio !== undefined && (
          <span style={{ color: '#666', fontSize: '0.875rem' }}>
            當前比例: {aspectRatio.toFixed(3)}
          </span>
        )}
      </div>
      <CropperElement
        aspectRatio={aspectRatio}
        imageSrc={DEFAULT_IMAGE_URL}
        onCropChange={handleCropChange}
      />
      {cropArea && (
        <div style={{ fontSize: '0.875rem' }}>
          <strong>裁切區域：</strong> x: {Math.round(cropArea.x)}, y:{' '}
          {Math.round(cropArea.y)}, width: {Math.round(cropArea.width)}, height:{' '}
          {Math.round(cropArea.height)}
        </div>
      )}
    </div>
  );
}

function FileInputStoryContent() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !file.type.startsWith('image/')) return;

      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }

      setImageUrl(URL.createObjectURL(file));
    },
    [imageUrl],
  );

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: 'min(100%, 32rem)',
      }}
    >
      <input
        accept="image/*"
        onChange={handleFileChange}
        type="file"
      />
      {imageUrl && (
        <CropperElement
          imageSrc={imageUrl}
          aspectRatio={16 / 9}
          onCropChange={action('onCropChange')}
        />
      )}
    </div>
  );
}

export const Basic: Story = {
  render: () => <BasicStoryContent />,
};

export const WithAspectRatio: Story = {
  render: () => <AspectRatioStoryContent />,
};

export const WithFileInput: Story = {
  render: () => <FileInputStoryContent />,
};
