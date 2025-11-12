import { cleanup, render } from '../../../__test-utils__';
import SlideFadeOverlay from '.';

// Mock Overlay Component
const mockOverlayRender = jest.fn();

jest.mock('../../Overlay', () => {
  return function MockOverlay(props: any) {
    mockOverlayRender(props);
    return <div>{props.children}</div>;
  };
});

window.scrollTo = jest.fn();

describe('<SlideFadeOverlay />', () => {
  afterEach(cleanup);

  describe('overlay', () => {
    const propsShouldPassed = [
      'className',
      'container',
      'disableCloseOnBackdropClick',
      'disablePortal',
      'onBackdropClick',
      'onClose',
      'open',
    ];

    it(`should pass ${propsShouldPassed.join(',')} to overlay`, () => {
      const container = document.createElement('div');
      const onBackdropClick = () => {};

      const onClose = () => {};

      render(
        <SlideFadeOverlay
          className="foo"
          container={container}
          disableCloseOnBackdropClick
          disablePortal
          onBackdropClick={onBackdropClick}
          onClose={onClose}
          open
        >
          <div />
        </SlideFadeOverlay>,
      );

      expect(mockOverlayRender).toHaveBeenCalledTimes(1);
      expect(mockOverlayRender).toHaveBeenCalledWith(
        expect.objectContaining({
          className: 'mzn-overlay-with-slide-fade foo',
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
});
