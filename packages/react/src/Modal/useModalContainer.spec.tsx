import { cleanup, cleanupHook, renderHook, render } from '../../__test-utils__';
import useModalContainer from './useModalContainer';

const renderMockSliderFadeOverlay = jest.fn();

jest.mock('../_internal/SlideFadeOverlay', () => {
  return function MockRenderSlideFadeOverlay(props: any) {
    renderMockSliderFadeOverlay(props);
    return <div data-testid="mock-slide-fade-overlay">Mock Overlay</div>;
  };
});

describe('useModalContainer()', () => {
  beforeEach(() => {
    renderMockSliderFadeOverlay.mockClear();
  });

  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  it('should apply Modal default props', () => {
    const { result } = renderHook(() => useModalContainer());

    const { Container, defaultOptions } = result.current;

    render(
      <Container>
        <div />
      </Container>,
    );

    expect(renderMockSliderFadeOverlay).toHaveBeenCalledWith(
      expect.objectContaining({
        className: defaultOptions.className,
        container: undefined,
        direction: defaultOptions.direction,
        disableCloseOnBackdropClick: defaultOptions.disableCloseOnBackdropClick,
        disablePortal: defaultOptions.disableCloseOnEscapeKeyDown,
        onBackdropClick: undefined,
        onClose: undefined,
        open: defaultOptions.open,
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
        direction="left"
        disableCloseOnBackdropClick
        disablePortal
        onBackdropClick={onBackdropClick}
        onClose={onClose}
        open
      >
        <div />
      </Container>,
    );

    expect(renderMockSliderFadeOverlay).toHaveBeenCalledWith(
      expect.objectContaining({
        className: 'foo',
        container,
        direction: 'left',
        disableCloseOnBackdropClick: true,
        disablePortal: true,
        onBackdropClick,
        onClose,
        open: true,
      }),
    );
  });
});
