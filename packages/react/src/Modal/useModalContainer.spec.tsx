import { cleanup, cleanupHook, renderHook, render } from '../../__test-utils__';
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
