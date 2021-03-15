import { createRef } from 'react';
import {
  cleanup,
  fireEvent,
  render,
} from '../../__test-utils__';
import Overlay from '.';

describe('<Overlay />', () => {
  afterEach(cleanup);

  describe('ref', () => {
    it('should forward ref to modal element', () => {
      const ref = createRef<HTMLDivElement>();

      render(
        <Overlay ref={ref} />,
      );

      const rootElement = document.body.querySelector('.mzn-overlay');

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toEqual(rootElement);
    });
  });

  describe('prop: children', () => {
    it('should render children', () => {
      const testChildren = 'foo';

      render(
        <Overlay>
          {testChildren}
        </Overlay>,
      );

      const rootElement = document.body.querySelector('.mzn-overlay');

      expect(rootElement?.textContent).toBe(testChildren);
    });
  });

  describe('prop: className', () => {
    it('should append class name on overlay element', () => {
      const className = 'foo';

      render(
        <Overlay className={className} />,
      );

      const rootElement = document.body.querySelector('.mzn-overlay');

      expect(rootElement?.classList.contains(className)).toBeTruthy();
    });
  });

  describe('backdrop', () => {
    [false, true].forEach((open) => {
      const message = open
        ? 'should render backdrop if open=true'
        : 'should not render backdrop if open=false';

      it(message, () => {
        render(
          <Overlay open={open} />,
        );

        const overlayElement = document.body.querySelector('.mzn-overlay')!;
        const { firstElementChild: backdropElement } = overlayElement;

        if (open) {
          expect(backdropElement!.classList.contains('mzn-overlay__backdrop')).toBeTruthy();
        } else {
          expect(backdropElement).toBe(null);
        }
      });
    });

    it('should not render backdrop if hideBackdrop=true', () => {
      render(
        <Overlay hideBackdrop open />,
      );

      const overlayElement = document.body.querySelector('.mzn-overlay')!;
      const { firstElementChild: backdropElement } = overlayElement;

      expect(overlayElement).toBeInstanceOf(HTMLElement);
      expect(backdropElement).toBe(null);
    });

    it('should fire onBackdropClick while backdrop clicked', () => {
      const onBackdropClick = jest.fn();

      render(
        <Overlay onBackdropClick={onBackdropClick} open />,
      );

      const backdropElement = document.body.querySelector('.mzn-overlay .mzn-overlay__backdrop')!;

      fireEvent.click(backdropElement!);

      expect(onBackdropClick).toBeCalledTimes(1);
    });

    it('should fire onClose while backdrop clicked', () => {
      const onClose = jest.fn();

      render(
        <Overlay onClose={onClose} open />,
      );

      const backdropElement = document.body.querySelector('.mzn-overlay .mzn-overlay__backdrop')!;

      fireEvent.click(backdropElement);

      expect(onClose).toBeCalledTimes(1);
    });

    it('should not fire onClose while backdrop clicked if disableCloseOnBackdropClick=true', () => {
      const onClose = jest.fn();

      render(
        <Overlay disableCloseOnBackdropClick onClose={onClose} open />,
      );

      const backdropElement = document.body.querySelector('.mzn-overlay .mzn-overlay__backdrop')!;

      fireEvent.click(backdropElement);

      expect(onClose).not.toBeCalled();
    });
  });
});
