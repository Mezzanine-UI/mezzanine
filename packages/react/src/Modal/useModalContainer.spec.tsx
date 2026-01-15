import { cleanup, cleanupHook, renderHook, render, fireEvent } from '../../__test-utils__';
import useModalContainer from './useModalContainer';

const renderMockBackdrop = jest.fn();

jest.mock('../Backdrop', () => {
  return function MockRenderBackdrop(props: any) {
    renderMockBackdrop(props);
    return <div data-testid="mock-backdrop">{props.children}</div>;
  };
});

describe('useModalContainer()', () => {
  beforeEach(() => {
    renderMockBackdrop.mockClear();
  });

  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  describe('default props', () => {
    it('should apply Modal default props', () => {
      const { result } = renderHook(() => useModalContainer());

      const { Container, defaultOptions } = result.current;

      render(
        <Container open>
          <div />
        </Container>,
      );

      expect(renderMockBackdrop).toHaveBeenCalledWith(
        expect.objectContaining({
          className: defaultOptions.className,
          container: undefined,
          disableCloseOnBackdropClick: defaultOptions.disableCloseOnBackdropClick,
          disablePortal: defaultOptions.disablePortal,
          onBackdropClick: undefined,
          onClose: undefined,
          open: true,
        }),
      );
    });

    it('should override default props when custom props given', () => {
      const { result } = renderHook(() => useModalContainer());

      const container = document.createElement('div');
      const onBackdropClick = () => {};

      const onClose = () => {};

      const { Container } = result.current;

      render(
        <Container
          className="foo"
          container={container}
          disableCloseOnBackdropClick
          disablePortal
          onBackdropClick={onBackdropClick}
          onClose={onClose}
          open
        >
          <div />
        </Container>,
      );

      expect(renderMockBackdrop).toHaveBeenCalledWith(
        expect.objectContaining({
          className: 'foo',
          container,
          disableCloseOnBackdropClick: true,
          disablePortal: true,
          onBackdropClick,
          onClose,
          open: true,
        }),
      );
    });
  });

  describe('prop: disableCloseOnEscapeKeyDown', () => {
    it('should be false by default', () => {
      const { result } = renderHook(() => useModalContainer());
      const { defaultOptions } = result.current;

      expect(defaultOptions.disableCloseOnEscapeKeyDown).toBe(false);
    });

    it('should allow escape key to close by default', () => {
      const { result } = renderHook(() => useModalContainer());
      const onClose = jest.fn();
      const { Container } = result.current;

      render(
        <Container open onClose={onClose}>
          <div>Content</div>
        </Container>,
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClose).toHaveBeenCalled();
    });

    it('should prevent escape key close when disableCloseOnEscapeKeyDown=true', () => {
      const { result } = renderHook(() => useModalContainer());
      const onClose = jest.fn();
      const { Container } = result.current;

      render(
        <Container open onClose={onClose} disableCloseOnEscapeKeyDown>
          <div>Content</div>
        </Container>,
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('open/close state', () => {
    it('should not render when open=false', () => {
      const { result } = renderHook(() => useModalContainer());
      const { Container } = result.current;

      const { container } = render(
        <Container open={false}>
          <div>Content</div>
        </Container>,
      );

      expect(container.querySelector('[data-testid="mock-backdrop"]')).toBeNull();
    });

    it('should render when open=true', () => {
      const { result } = renderHook(() => useModalContainer());
      const { Container } = result.current;

      const { container } = render(
        <Container open>
          <div>Content</div>
        </Container>,
      );

      expect(container.querySelector('[data-testid="mock-backdrop"]')).toBeTruthy();
    });
  });

  describe('prop: children', () => {
    it('should render children content', () => {
      const { result } = renderHook(() => useModalContainer());
      const { Container } = result.current;

      const { getByText } = render(
        <Container open>
          <div>Test Content</div>
        </Container>,
      );

      expect(getByText('Test Content')).toBeTruthy();
    });

    it('should render multiple children', () => {
      const { result } = renderHook(() => useModalContainer());
      const { Container } = result.current;

      const { getByText } = render(
        <Container open>
          <div>First</div>
          <div>Second</div>
        </Container>,
      );

      expect(getByText('First')).toBeTruthy();
      expect(getByText('Second')).toBeTruthy();
    });
  });

  describe('prop: onClose', () => {
    it('should not call onClose when not provided', () => {
      const { result } = renderHook(() => useModalContainer());
      const { Container } = result.current;

      render(
        <Container open>
          <div>Content</div>
        </Container>,
      );

      expect(() => {
        fireEvent.keyDown(document, { key: 'Escape' });
      }).not.toThrow();
    });

    it('should call onClose when escape key pressed', () => {
      const { result } = renderHook(() => useModalContainer());
      const onClose = jest.fn();
      const { Container } = result.current;

      render(
        <Container open onClose={onClose}>
          <div>Content</div>
        </Container>,
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
