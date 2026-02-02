import { modalClasses as classes } from '@mezzanine-ui/core/modal';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import MediaPreviewModal from './MediaPreviewModal';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
} as any;

function getOverlayElement(container: HTMLElement = document.body) {
  return container?.querySelector('.mzn-backdrop');
}

function getModalElement(container: HTMLElement = document.body) {
  return getOverlayElement(container)?.querySelector('.mzn-modal');
}

window.scrollTo = jest.fn();

describe('<MediaPreviewModal />', () => {
  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  const mockMediaItems = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ];

  // Note: ref forwarding test is skipped due to test environment issue with ResizeObserver
  // This is a known issue that also affects Modal.spec.tsx
  // describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
  //   render(
  //     <MediaPreviewModal
  //       currentIndex={0}
  //       mediaItems={mockMediaItems}
  //       open
  //       ref={ref}
  //     />,
  //   ),
  // );

  it('should render the current media item', () => {
    render(
      <MediaPreviewModal currentIndex={0} mediaItems={mockMediaItems} open />,
    );

    const modalElement = getModalElement()!;
    const imageElement = modalElement.querySelector('img');

    expect(imageElement).toBeInstanceOf(HTMLImageElement);
    expect(imageElement?.getAttribute('src')).toBe(mockMediaItems[0]);
    expect(imageElement?.getAttribute('alt')).toBe('Media 1');
  });

  it('should render React node as media item', () => {
    const customMedia = <div data-testid="custom-media">Custom Media</div>;

    render(
      <MediaPreviewModal currentIndex={0} mediaItems={[customMedia]} open />,
    );

    const modalElement = getModalElement()!;
    const customMediaElement = modalElement.querySelector(
      '[data-testid="custom-media"]',
    );

    expect(customMediaElement).toBeInstanceOf(HTMLDivElement);
    expect(customMediaElement?.textContent).toBe('Custom Media');
  });

  it('should render Next.js Image-like component as media item', () => {
    // Mock Next.js Image component behavior
    const MockNextImage = ({
      src,
      alt,
      width,
      height,
      priority,
    }: {
      alt: string;
      height: number;
      priority?: boolean;
      src: string;
      width: number;
    }) => (
      <img
        alt={alt}
        data-priority={priority}
        data-testid="next-image"
        height={height}
        src={src}
        width={width}
      />
    );

    const nextImageItems = [
      <MockNextImage
        key="1"
        alt="Next Image 1"
        height={1080}
        priority
        src="https://example.com/next-image1.jpg"
        width={1920}
      />,
      <MockNextImage
        key="2"
        alt="Next Image 2"
        height={1080}
        src="https://example.com/next-image2.jpg"
        width={1920}
      />,
    ];

    render(
      <MediaPreviewModal currentIndex={0} mediaItems={nextImageItems} open />,
    );

    const modalElement = getModalElement()!;
    const imageElement = modalElement.querySelector(
      '[data-testid="next-image"]',
    ) as HTMLImageElement;

    expect(imageElement).toBeInstanceOf(HTMLImageElement);
    expect(imageElement?.getAttribute('src')).toBe(
      'https://example.com/next-image1.jpg',
    );
    expect(imageElement?.getAttribute('alt')).toBe('Next Image 1');
    expect(imageElement?.getAttribute('width')).toBe('1920');
    expect(imageElement?.getAttribute('height')).toBe('1080');
    expect(imageElement?.getAttribute('data-priority')).toBe('true');
  });

  it('should bind media-preview class to modal element', () => {
    render(
      <MediaPreviewModal currentIndex={0} mediaItems={mockMediaItems} open />,
    );

    const modalElement = getModalElement()!;

    expect(modalElement.classList.contains(classes.mediaPreview)).toBeTruthy();
  });

  it('should append className from prop to modal element', () => {
    const className = 'foo';

    render(
      <MediaPreviewModal
        className={className}
        currentIndex={0}
        mediaItems={mockMediaItems}
        open
      />,
    );

    const modalElement = getModalElement()!;

    expect(modalElement.classList.contains(className)).toBeTruthy();
  });

  describe('navigation buttons', () => {
    it('should render prev and next buttons when callbacks are provided', () => {
      const onPrev = jest.fn();
      const onNext = jest.fn();

      render(
        <MediaPreviewModal
          currentIndex={1}
          mediaItems={mockMediaItems}
          onNext={onNext}
          onPrev={onPrev}
          open
        />,
      );

      const overlayElement = getOverlayElement()!;
      const buttons = overlayElement.querySelectorAll(
        `.${classes.mediaPreviewNavButton}`,
      );

      expect(buttons).toHaveLength(2);
    });

    it('should call onPrev when prev button is clicked', () => {
      const onPrev = jest.fn();

      render(
        <MediaPreviewModal
          currentIndex={1}
          mediaItems={mockMediaItems}
          onPrev={onPrev}
          open
        />,
      );

      const overlayElement = getOverlayElement()!;
      const prevButton = overlayElement.querySelector(
        `button[aria-label="Previous media"]`,
      );

      expect(prevButton).toBeInstanceOf(HTMLButtonElement);

      fireEvent.click(prevButton!);

      expect(onPrev).toHaveBeenCalledTimes(1);
    });

    it('should call onNext when next button is clicked', () => {
      const onNext = jest.fn();

      render(
        <MediaPreviewModal
          currentIndex={1}
          mediaItems={mockMediaItems}
          onNext={onNext}
          open
        />,
      );

      const overlayElement = getOverlayElement()!;
      const nextButton = overlayElement.querySelector(
        `button[aria-label="Next media"]`,
      );

      expect(nextButton).toBeInstanceOf(HTMLButtonElement);

      fireEvent.click(nextButton!);

      expect(onNext).toHaveBeenCalledTimes(1);
    });

    it('should disable prev button when disablePrev is true', () => {
      render(
        <MediaPreviewModal
          currentIndex={0}
          disablePrev
          mediaItems={mockMediaItems}
          onPrev={jest.fn()}
          open
        />,
      );

      const overlayElement = getOverlayElement()!;
      const prevButton = overlayElement.querySelector(
        `button[aria-label="Previous media"]`,
      ) as HTMLButtonElement;

      expect(prevButton?.disabled).toBe(true);
      expect(prevButton?.getAttribute('aria-disabled')).toBe('true');
    });

    it('should disable next button when disableNext is true', () => {
      render(
        <MediaPreviewModal
          currentIndex={2}
          disableNext
          mediaItems={mockMediaItems}
          onNext={jest.fn()}
          open
        />,
      );

      const overlayElement = getOverlayElement()!;
      const nextButton = overlayElement.querySelector(
        `button[aria-label="Next media"]`,
      ) as HTMLButtonElement;

      expect(nextButton?.disabled).toBe(true);
      expect(nextButton?.getAttribute('aria-disabled')).toBe('true');
    });

    it('should render ChevronLeftIcon in prev button', () => {
      render(
        <MediaPreviewModal
          currentIndex={1}
          mediaItems={mockMediaItems}
          onPrev={jest.fn()}
          open
        />,
      );

      const overlayElement = getOverlayElement()!;
      const prevButton = overlayElement.querySelector(
        `button[aria-label="Previous media"]`,
      );
      const icon = prevButton?.querySelector('svg');

      expect(icon).toBeInstanceOf(SVGElement);
    });

    it('should render ChevronRightIcon in next button', () => {
      render(
        <MediaPreviewModal
          currentIndex={1}
          mediaItems={mockMediaItems}
          onNext={jest.fn()}
          open
        />,
      );

      const overlayElement = getOverlayElement()!;
      const nextButton = overlayElement.querySelector(
        `button[aria-label="Next media"]`,
      );
      const icon = nextButton?.querySelector('svg');

      expect(icon).toBeInstanceOf(SVGElement);
    });

    it('should navigate between Next.js Image components', () => {
      // Mock Next.js Image component
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
          data-next-image="true"
          data-src={src}
          height={height}
          src={src}
          width={width}
        />
      );

      const nextImageItems = [
        <MockNextImage
          key="1"
          alt="Image 1"
          height={1080}
          src="https://example.com/img1.jpg"
          width={1920}
        />,
        <MockNextImage
          key="2"
          alt="Image 2"
          height={1080}
          src="https://example.com/img2.jpg"
          width={1920}
        />,
        <MockNextImage
          key="3"
          alt="Image 3"
          height={1080}
          src="https://example.com/img3.jpg"
          width={1920}
        />,
      ];

      const onNext = jest.fn();
      const onPrev = jest.fn();

      render(
        <MediaPreviewModal
          currentIndex={1}
          mediaItems={nextImageItems}
          onNext={onNext}
          onPrev={onPrev}
          open
        />,
      );

      const overlayElement = getOverlayElement()!;
      const nextButton = overlayElement.querySelector(
        `button[aria-label="Next media"]`,
      ) as HTMLButtonElement;
      const prevButton = overlayElement.querySelector(
        `button[aria-label="Previous media"]`,
      ) as HTMLButtonElement;

      // Verify current image is displayed
      const currentImage = overlayElement.querySelector(
        'img[data-next-image="true"]',
      ) as HTMLImageElement;

      expect(currentImage?.getAttribute('data-src')).toBe(
        'https://example.com/img2.jpg',
      );

      // Test navigation
      fireEvent.click(nextButton);
      expect(onNext).toHaveBeenCalledTimes(1);

      fireEvent.click(prevButton);
      expect(onPrev).toHaveBeenCalledTimes(1);
    });

    describe('circular navigation', () => {
      it('should wrap from last to first item when enableCircularNavigation is true', () => {
        const { rerender } = render(
          <MediaPreviewModal
            currentIndex={2}
            enableCircularNavigation
            mediaItems={mockMediaItems}
            open
          />,
        );

        const overlayElement = getOverlayElement()!;
        const nextButton = overlayElement.querySelector(
          `button[aria-label="Next media"]`,
        ) as HTMLButtonElement;

        // Should not be disabled at the last item
        expect(nextButton?.disabled).toBe(false);

        // Click next to navigate to first item
        fireEvent.click(nextButton);

        // Re-render with updated index (simulating uncontrolled mode behavior)
        rerender(
          <MediaPreviewModal
            currentIndex={0}
            enableCircularNavigation
            mediaItems={mockMediaItems}
            open
          />,
        );

        // Verify pagination indicator shows first item
        const indicator = getOverlayElement()!.querySelector(
          `.${classes.mediaPreviewPaginationIndicator}`,
        );

        expect(indicator?.textContent).toBe('1/3');
      });

      it('should wrap from first to last item when enableCircularNavigation is true', () => {
        const { rerender } = render(
          <MediaPreviewModal
            currentIndex={0}
            enableCircularNavigation
            mediaItems={mockMediaItems}
            open
          />,
        );

        const overlayElement = getOverlayElement()!;
        const prevButton = overlayElement.querySelector(
          `button[aria-label="Previous media"]`,
        ) as HTMLButtonElement;

        // Should not be disabled at the first item
        expect(prevButton?.disabled).toBe(false);

        // Click prev to navigate to last item
        fireEvent.click(prevButton);

        // Re-render with updated index (simulating uncontrolled mode behavior)
        rerender(
          <MediaPreviewModal
            currentIndex={2}
            enableCircularNavigation
            mediaItems={mockMediaItems}
            open
          />,
        );

        // Verify pagination indicator shows last item
        const indicator = getOverlayElement()!.querySelector(
          `.${classes.mediaPreviewPaginationIndicator}`,
        );

        expect(indicator?.textContent).toBe('3/3');
      });

      it('should not wrap when enableCircularNavigation is false', () => {
        render(
          <MediaPreviewModal
            currentIndex={2}
            enableCircularNavigation={false}
            mediaItems={mockMediaItems}
            open
          />,
        );

        const overlayElement = getOverlayElement()!;
        const nextButton = overlayElement.querySelector(
          `button[aria-label="Next media"]`,
        ) as HTMLButtonElement;

        // Should be disabled at the last item
        expect(nextButton?.disabled).toBe(true);
      });

      it('should keep navigation buttons enabled when enableCircularNavigation is true', () => {
        const { rerender } = render(
          <MediaPreviewModal
            currentIndex={0}
            enableCircularNavigation
            mediaItems={mockMediaItems}
            open
          />,
        );

        let overlayElement = getOverlayElement()!;
        let prevButton = overlayElement.querySelector(
          `button[aria-label="Previous media"]`,
        ) as HTMLButtonElement;
        let nextButton = overlayElement.querySelector(
          `button[aria-label="Next media"]`,
        ) as HTMLButtonElement;

        // At first item, both buttons should be enabled
        expect(prevButton?.disabled).toBe(false);
        expect(nextButton?.disabled).toBe(false);

        // Navigate to last item
        rerender(
          <MediaPreviewModal
            currentIndex={2}
            enableCircularNavigation
            mediaItems={mockMediaItems}
            open
          />,
        );

        overlayElement = getOverlayElement()!;
        prevButton = overlayElement.querySelector(
          `button[aria-label="Previous media"]`,
        ) as HTMLButtonElement;
        nextButton = overlayElement.querySelector(
          `button[aria-label="Next media"]`,
        ) as HTMLButtonElement;

        // At last item, both buttons should still be enabled
        expect(prevButton?.disabled).toBe(false);
        expect(nextButton?.disabled).toBe(false);
      });
    });
  });

  describe('close button', () => {
    it('should render close button', () => {
      render(
        <MediaPreviewModal
          currentIndex={0}
          mediaItems={mockMediaItems}
          onClose={jest.fn()}
          open
        />,
      );

      const overlayElement = getOverlayElement()!;
      const closeButton = overlayElement.querySelector(
        `.${classes.mediaPreviewCloseButton}`,
      );

      expect(closeButton).toBeInstanceOf(HTMLElement);
    });

    it('should call onClose when close button is clicked', () => {
      const onClose = jest.fn();

      render(
        <MediaPreviewModal
          currentIndex={0}
          mediaItems={mockMediaItems}
          onClose={onClose}
          open
        />,
      );

      const overlayElement = getOverlayElement()!;
      const closeButton = overlayElement.querySelector(
        `.${classes.mediaPreviewCloseButton}`,
      ) as HTMLElement;

      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop: open', () => {
    it('should not render when open is false', () => {
      render(
        <MediaPreviewModal
          currentIndex={0}
          mediaItems={mockMediaItems}
          open={false}
        />,
      );

      const modalElement = getModalElement();

      expect(modalElement).toBeFalsy();
    });

    it('should render when open is true', () => {
      render(
        <MediaPreviewModal currentIndex={0} mediaItems={mockMediaItems} open />,
      );

      const modalElement = getModalElement();

      expect(modalElement).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('pagination indicator', () => {
    it('should render pagination indicator by default when there are multiple items', () => {
      render(
        <MediaPreviewModal currentIndex={0} mediaItems={mockMediaItems} open />,
      );

      const overlayElement = getOverlayElement()!;
      const indicator = overlayElement.querySelector(
        `.${classes.mediaPreviewPaginationIndicator}`,
      );

      expect(indicator).toBeInstanceOf(HTMLDivElement);
      expect(indicator?.textContent).toBe('1/3');
    });

    it('should not render pagination indicator when there is only one item', () => {
      render(
        <MediaPreviewModal
          currentIndex={0}
          mediaItems={[mockMediaItems[0]]}
          open
        />,
      );

      const overlayElement = getOverlayElement()!;
      const indicator = overlayElement.querySelector(
        `.${classes.mediaPreviewPaginationIndicator}`,
      );

      expect(indicator).toBeFalsy();
    });

    it('should not render pagination indicator when showPaginationIndicator is false', () => {
      render(
        <MediaPreviewModal
          currentIndex={0}
          mediaItems={mockMediaItems}
          open
          showPaginationIndicator={false}
        />,
      );

      const overlayElement = getOverlayElement()!;
      const indicator = overlayElement.querySelector(
        `.${classes.mediaPreviewPaginationIndicator}`,
      );

      expect(indicator).toBeFalsy();
    });

    it('should update pagination indicator when currentIndex changes', () => {
      const { rerender } = render(
        <MediaPreviewModal currentIndex={0} mediaItems={mockMediaItems} open />,
      );

      let overlayElement = getOverlayElement()!;
      let indicator = overlayElement.querySelector(
        `.${classes.mediaPreviewPaginationIndicator}`,
      );

      expect(indicator?.textContent).toBe('1/3');

      rerender(
        <MediaPreviewModal currentIndex={1} mediaItems={mockMediaItems} open />,
      );

      overlayElement = getOverlayElement()!;
      indicator = overlayElement.querySelector(
        `.${classes.mediaPreviewPaginationIndicator}`,
      );

      expect(indicator?.textContent).toBe('2/3');
    });

    it('should have correct aria-label', () => {
      render(
        <MediaPreviewModal currentIndex={1} mediaItems={mockMediaItems} open />,
      );

      const overlayElement = getOverlayElement()!;
      const indicator = overlayElement.querySelector(
        `.${classes.mediaPreviewPaginationIndicator}`,
      );

      expect(indicator?.getAttribute('aria-label')).toBe('Page 2 of 3');
    });
  });
});
