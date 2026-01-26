import { StoryObj, Meta } from '@storybook/react-webpack5';
import { useState } from 'react';
import { MediaPreviewModal } from '.';
import Button from '../Button';

export default {
  component: MediaPreviewModal,
  title: 'Feedback/MediaPreviewModal',
} as Meta<typeof MediaPreviewModal>;

type PlaygroundArgs = {
  currentIndex: number;
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

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    currentIndex: 0,
    disableCloseOnBackdropClick: false,
    disableCloseOnEscapeKeyDown: false,
    showPaginationIndicator: true,
  },
  render: function Render(args) {
    const {
      currentIndex: initialIndex,
      disableCloseOnBackdropClick,
      disableCloseOnEscapeKeyDown,
      showPaginationIndicator,
    } = args;

    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const handlePrev = () => {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const handleNext = () => {
      setCurrentIndex((prev) => Math.min(sampleImages.length - 1, prev + 1));
    };

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="base-primary">
          Open Media Preview
        </Button>
        <MediaPreviewModal
          currentIndex={currentIndex}
          disableCloseOnBackdropClick={disableCloseOnBackdropClick}
          disableCloseOnEscapeKeyDown={disableCloseOnEscapeKeyDown}
          disableNext={currentIndex >= sampleImages.length - 1}
          disablePrev={currentIndex <= 0}
          mediaItems={sampleImages}
          onClose={handleClose}
          onNext={handleNext}
          onPrev={handlePrev}
          open={open}
          showPaginationIndicator={showPaginationIndicator}
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
          currentIndex={0}
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
    const [currentIndex, setCurrentIndex] = useState(0);

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
          Open Gallery (Circular Navigation)
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
    const [currentIndex, setCurrentIndex] = useState(0);

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

    const handlePrev = () => {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const handleNext = () => {
      setCurrentIndex((prev) =>
        Math.min(customMediaItems.length - 1, prev + 1),
      );
    };

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="base-primary">
          Open Custom Media
        </Button>
        <MediaPreviewModal
          currentIndex={currentIndex}
          disableNext={currentIndex >= customMediaItems.length - 1}
          disablePrev={currentIndex <= 0}
          mediaItems={customMediaItems}
          onClose={() => setOpen(false)}
          onNext={handleNext}
          onPrev={handlePrev}
          open={open}
        />
      </>
    );
  },
};

export const WithPaginationIndicator: StoryObj = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const handleNext = () => {
      setCurrentIndex((prev) => Math.min(sampleImages.length - 1, prev + 1));
    };

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="base-primary">
          Open Gallery with Pagination Indicator
        </Button>
        <MediaPreviewModal
          currentIndex={currentIndex}
          disableNext={currentIndex >= sampleImages.length - 1}
          disablePrev={currentIndex <= 0}
          mediaItems={sampleImages}
          onClose={() => setOpen(false)}
          onNext={handleNext}
          onPrev={handlePrev}
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
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const handleNext = () => {
      setCurrentIndex((prev) => Math.min(sampleImages.length - 1, prev + 1));
    };

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="base-primary">
          Open Gallery without Pagination Indicator
        </Button>
        <MediaPreviewModal
          currentIndex={currentIndex}
          disableNext={currentIndex >= sampleImages.length - 1}
          disablePrev={currentIndex <= 0}
          mediaItems={sampleImages}
          onClose={() => setOpen(false)}
          onNext={handleNext}
          onPrev={handlePrev}
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
    const [currentIndex, setCurrentIndex] = useState(0);

    const mixedImages = [
      'https://picsum.photos/id/100/3840/2160',
      'https://picsum.photos/id/200/2160/3840',
      'https://picsum.photos/id/300/2048/2048',
      'https://picsum.photos/id/400/3840/2160',
      'https://picsum.photos/id/500/1920/2880',
    ];

    const handlePrev = () => {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const handleNext = () => {
      setCurrentIndex((prev) => Math.min(mixedImages.length - 1, prev + 1));
    };

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="base-primary">
          Open Mixed Aspect Ratios
        </Button>
        <MediaPreviewModal
          currentIndex={currentIndex}
          disableNext={currentIndex >= mixedImages.length - 1}
          disablePrev={currentIndex <= 0}
          mediaItems={mixedImages}
          onClose={() => setOpen(false)}
          onNext={handleNext}
          onPrev={handlePrev}
          open={open}
        />
      </>
    );
  },
};
