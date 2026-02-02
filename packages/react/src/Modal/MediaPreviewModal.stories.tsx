import { StoryObj, Meta } from '@storybook/react-webpack5';
import { useState } from 'react';
import { MediaPreviewModal } from '.';
import Button from '../Button';

export default {
  component: MediaPreviewModal,
  title: 'Feedback/MediaPreviewModal',
} as Meta<typeof MediaPreviewModal>;

type UncontrolledArgs = {
  defaultIndex: number;
  disableCloseOnBackdropClick?: boolean;
  disableCloseOnEscapeKeyDown?: boolean;
  enableCircularNavigation?: boolean;
  showPaginationIndicator?: boolean;
};

const sampleImages = [
  'https://picsum.photos/id/10/2560/1920',
  'https://picsum.photos/id/20/2560/1920',
  'https://picsum.photos/id/30/2560/1920',
  'https://picsum.photos/id/40/2560/1920',
  'https://picsum.photos/id/50/2560/1920',
];

export const Playground: StoryObj<UncontrolledArgs> = {
  args: {
    defaultIndex: 0,
    disableCloseOnBackdropClick: false,
    disableCloseOnEscapeKeyDown: false,
    enableCircularNavigation: false,
    showPaginationIndicator: true,
  },
  render: function Render(args) {
    const {
      defaultIndex,
      disableCloseOnBackdropClick,
      disableCloseOnEscapeKeyDown,
      enableCircularNavigation,
      showPaginationIndicator,
    } = args;

    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="base-primary">
          Open Media Preview
        </Button>
        <MediaPreviewModal
          defaultIndex={defaultIndex}
          disableCloseOnBackdropClick={disableCloseOnBackdropClick}
          disableCloseOnEscapeKeyDown={disableCloseOnEscapeKeyDown}
          enableCircularNavigation={enableCircularNavigation}
          mediaItems={sampleImages}
          onClose={() => setOpen(false)}
          open={open}
          showPaginationIndicator={showPaginationIndicator}
        />
      </>
    );
  },
};

export const TrackingIndexChanges: StoryObj = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [lastIndex, setLastIndex] = useState<number | null>(null);

    return (
      <>
        <div style={{ marginBottom: '16px' }}>
          {lastIndex !== null && <p>Last viewed index: {lastIndex}</p>}
        </div>
        <Button onClick={() => setOpen(true)} variant="base-primary">
          Open Gallery (Track Index Changes)
        </Button>
        <MediaPreviewModal
          defaultIndex={2}
          mediaItems={sampleImages}
          onClose={() => setOpen(false)}
          onIndexChange={setLastIndex}
          open={open}
        />
      </>
    );
  },
};

export const SingleImage: StoryObj = {
  render: function Render() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="base-primary">
          Open Single Image
        </Button>
        <MediaPreviewModal
          mediaItems={[sampleImages[0]]}
          onClose={() => setOpen(false)}
          open={open}
        />
      </>
    );
  },
};

export const CircularNavigation: StoryObj = {
  render: function Render() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="base-primary">
          Open Gallery (Circular Navigation - Uncontrolled)
        </Button>
        <MediaPreviewModal
          enableCircularNavigation
          mediaItems={sampleImages}
          onClose={() => setOpen(false)}
          open={open}
        />
      </>
    );
  },
};

export const ControlledModeWithCircularNavigation: StoryObj = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
      // Implement circular navigation in controlled mode
      setCurrentIndex((prev) => (prev + 1) % sampleImages.length);
    };

    const handlePrev = () => {
      // Implement circular navigation in controlled mode
      setCurrentIndex(
        (prev) => (prev - 1 + sampleImages.length) % sampleImages.length,
      );
    };

    return (
      <>
        <div style={{ marginBottom: '16px' }}>
          <p>Current index: {currentIndex + 1}</p>
        </div>
        <Button onClick={() => setOpen(true)} variant="base-primary">
          Open Gallery (Circular Navigation - Controlled)
        </Button>
        <MediaPreviewModal
          currentIndex={currentIndex}
          mediaItems={sampleImages}
          onClose={() => setOpen(false)}
          onNext={handleNext}
          onPrev={handlePrev}
          open={open}
        />
      </>
    );
  },
};

export const CustomMedia: StoryObj = {
  render: function Render() {
    const [open, setOpen] = useState(false);

    const customMediaItems = [
      <div
        key="1"
        style={{
          alignItems: 'center',
          backgroundColor: '#f0f0f0',
          color: '#333',
          display: 'flex',
          fontSize: '24px',
          height: '400px',
          justifyContent: 'center',
          width: '600px',
        }}
      >
        Custom Content 1
      </div>,
      <div
        key="2"
        style={{
          alignItems: 'center',
          backgroundColor: '#e0e0e0',
          color: '#333',
          display: 'flex',
          fontSize: '24px',
          height: '400px',
          justifyContent: 'center',
          width: '600px',
        }}
      >
        Custom Content 2
      </div>,
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video
        controls
        key="3"
        src="https://www.w3schools.com/html/mov_bbb.mp4"
        style={{
          maxHeight: '600px',
          maxWidth: '800px',
        }}
      />,
    ];

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="base-primary">
          Open Custom Media
        </Button>
        <MediaPreviewModal
          mediaItems={customMediaItems}
          onClose={() => setOpen(false)}
          open={open}
        />
      </>
    );
  },
};

export const WithPaginationIndicator: StoryObj = {
  render: function Render() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="base-primary">
          Open Gallery with Pagination Indicator
        </Button>
        <MediaPreviewModal
          mediaItems={sampleImages}
          onClose={() => setOpen(false)}
          open={open}
          showPaginationIndicator
        />
      </>
    );
  },
};

export const HidePaginationIndicator: StoryObj = {
  render: function Render() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="base-primary">
          Open Gallery without Pagination Indicator
        </Button>
        <MediaPreviewModal
          mediaItems={sampleImages}
          onClose={() => setOpen(false)}
          open={open}
          showPaginationIndicator={false}
        />
      </>
    );
  },
};

export const MixedOrientations: StoryObj = {
  render: function Render() {
    const [open, setOpen] = useState(false);

    const mixedImages = [
      'https://picsum.photos/id/100/3840/2160',
      'https://picsum.photos/id/200/2160/3840',
      'https://picsum.photos/id/300/2048/2048',
      'https://picsum.photos/id/400/3840/2160',
      'https://picsum.photos/id/500/1920/2880',
    ];

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="base-primary">
          Open Mixed Aspect Ratios
        </Button>
        <MediaPreviewModal
          defaultIndex={2}
          mediaItems={mixedImages}
          onClose={() => setOpen(false)}
          open={open}
        />
      </>
    );
  },
};

export const WithNextImageComponent: StoryObj = {
  render: function Render() {
    const [open, setOpen] = useState(false);

    /**
     * Example of using Next.js Image component with MediaPreviewModal.
     * In a real Next.js project, you would import and use the actual Image component:
     *
     * import Image from 'next/image';
     *
     * const mediaItems = [
     *   <Image
     *     key="1"
     *     src="/path/to/image1.jpg"
     *     alt="Image 1"
     *     width={1920}
     *     height={1080}
     *     quality={90}
     *     priority
     *   />,
     *   <Image
     *     key="2"
     *     src="/path/to/image2.jpg"
     *     alt="Image 2"
     *     width={1920}
     *     height={1080}
     *     quality={90}
     *   />,
     * ];
     */

    // Mock Next.js Image component for demonstration purposes
    const MockNextImage = ({
      src,
      alt,
      width,
      height,
    }: {
      alt: string;
      height: number;
      src: string;
      width: number;
    }) => (
      <img
        alt={alt}
        src={src}
        style={{
          height: 'auto',
          maxHeight: '90vh',
          maxWidth: '90vw',
          objectFit: 'contain',
          width: 'auto',
        }}
        // Next.js Image would handle optimization and responsive loading
        width={width}
        height={height}
      />
    );

    const mediaItems = [
      <MockNextImage
        key="1"
        alt="Landscape 1"
        height={1920}
        src="https://picsum.photos/id/10/2560/1920"
        width={2560}
      />,
      <MockNextImage
        key="2"
        alt="Landscape 2"
        height={1920}
        src="https://picsum.photos/id/20/2560/1920"
        width={2560}
      />,
      <MockNextImage
        key="3"
        alt="Landscape 3"
        height={1920}
        src="https://picsum.photos/id/30/2560/1920"
        width={2560}
      />,
    ];

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="base-primary">
          Open with Next/Image (Mock)
        </Button>
        <MediaPreviewModal
          mediaItems={mediaItems}
          onClose={() => setOpen(false)}
          open={open}
        />
      </>
    );
  },
};
