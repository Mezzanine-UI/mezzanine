import {
  TestRenderer,
  cleanup,
  cleanupHook,
  renderHook,
} from '../../__test-utils__';
import SlideFadeOverlay from '../_internal/SlideFadeOverlay';
import useModalContainer from './useModalContainer';

describe('useTableFetchMore()', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  it('should apply Modal default props', () => {
    const { result } = renderHook(
      () => useModalContainer(),
    );

    const {
      Container,
      defaultOptions,
    } = result.current;

    const testInstance = TestRenderer.create(
      <Container>
        <div />
      </Container>,
    );

    const overlayInstance = testInstance.root.findByType(SlideFadeOverlay);

    expect(overlayInstance.props.className).toContain(defaultOptions.className);
    expect(overlayInstance.props.container).toBe(undefined);
    expect(overlayInstance.props.direction).toBe(defaultOptions.direction);
    expect(overlayInstance.props.disableCloseOnBackdropClick).toBe(defaultOptions.disableCloseOnBackdropClick);
    expect(overlayInstance.props.disablePortal).toBe(defaultOptions.disableCloseOnEscapeKeyDown);
    expect(overlayInstance.props.hideBackdrop).toBe(defaultOptions.hideBackdrop);
    expect(overlayInstance.props.invisibleBackdrop).toBe(defaultOptions.invisibleBackdrop);
    expect(overlayInstance.props.onBackdropClick).toBe(undefined);
    expect(overlayInstance.props.onClose).toBe(undefined);
    expect(overlayInstance.props.open).toBe(defaultOptions.open);
  });

  it('should override default props when custom props given', () => {
    const { result } = renderHook(
      () => useModalContainer(),
    );

    const container = () => document.createElement('div');
    const onBackdropClick = () => {};

    const onClose = () => {};

    const {
      Container,
    } = result.current;

    const testInstance = TestRenderer.create(
      <Container
        className="foo"
        container={container}
        direction="left"
        disableCloseOnBackdropClick
        disablePortal
        hideBackdrop
        invisibleBackdrop
        onBackdropClick={onBackdropClick}
        onClose={onClose}
        open
      >
        <div />
      </Container>,
    );

    const overlayInstance = testInstance.root.findByType(SlideFadeOverlay);

    expect(overlayInstance.props.className).toContain('foo');
    expect(overlayInstance.props.container).toBe(container);
    expect(overlayInstance.props.direction).toBe('left');
    expect(overlayInstance.props.disableCloseOnBackdropClick).toBe(true);
    expect(overlayInstance.props.disablePortal).toBe(true);
    expect(overlayInstance.props.hideBackdrop).toBe(true);
    expect(overlayInstance.props.invisibleBackdrop).toBe(true);
    expect(overlayInstance.props.onBackdropClick).toBe(onBackdropClick);
    expect(overlayInstance.props.onClose).toBe(onClose);
    expect(overlayInstance.props.open).toBe(true);
  });
});
