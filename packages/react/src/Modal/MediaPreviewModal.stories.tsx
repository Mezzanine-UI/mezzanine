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
    showPaginationIndicator: true,
  },
  render: function Render(args) {
    const {
      defaultIndex,
      disableCloseOnBackdropClick,
      disableCloseOnEscapeKeyDown,
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
          mediaItems={sampleImages}
          onClose={() => setOpen(false)}
          open={open}
          showPaginationIndicator={showPaginationIndicator}
        />
      </>
    );
  },
};

export const UncontrolledWithCallback: StoryObj = {
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

export const ControlledCircularNavigation: StoryObj = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Custom circular navigation logic requires controlled mode
    const handlePrev = () => {
      setCurrentIndex(
        (prev) => (prev - 1 + sampleImages.length) % sampleImages.length,
      );
    };

    const handleNext = () => {
      setCurrentIndex((prev) => (prev + 1) % sampleImages.length);
    };

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="base-primary">
          Controlled: Circular Navigation
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
