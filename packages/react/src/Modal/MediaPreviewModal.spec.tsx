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
