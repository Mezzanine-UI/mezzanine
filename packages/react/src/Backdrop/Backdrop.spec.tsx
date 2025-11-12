import { createRef } from 'react';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import Backdrop from '.';
import { resetPortals } from '../Portal/portalRegistry';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
} as any;

describe('<Backdrop />', () => {
  beforeEach(() => {
    // Clean up portal containers
    document.getElementById('mzn-alert-container')?.remove();
    document.getElementById('mzn-portal-container')?.remove();
    resetPortals();
  });

  afterEach(cleanup);

  describe('ref', () => {
    it('should forward ref to modal element', () => {
      const ref = createRef<HTMLDivElement>();

      render(<Backdrop ref={ref} />);

      const rootElement = document.body.querySelector('.mzn-backdrop');

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toEqual(rootElement);
    });
  });

  describe('prop: children', () => {
    it('should render children', () => {
      const testChildren = 'foo';

      render(<Backdrop>{testChildren}</Backdrop>);

      const rootElement = document.body.querySelector('.mzn-backdrop');

      expect(rootElement?.textContent).toBe(testChildren);
    });
  });

  describe('prop: className', () => {
    it('should append class name on backdrop element', () => {
      const className = 'foo';

      render(<Backdrop className={className} />);

      const rootElement = document.body.querySelector('.mzn-backdrop');

      expect(rootElement?.classList.contains(className)).toBeTruthy();
    });
  });

  describe('backdrop', () => {
    [false, true].forEach((open) => {
      const message = open
        ? 'should render backdrop if open=true'
        : 'should not render backdrop if open=false';

      it(message, () => {
        render(<Backdrop open={open} />);

        const backdropElement = document.body.querySelector(
          '.mzn-backdrop__backdrop',
        );

        if (open) {
          expect(backdropElement).toBeInstanceOf(HTMLElement);
          expect(
            backdropElement!.classList.contains('mzn-backdrop__backdrop'),
          ).toBeTruthy();
        } else {
          expect(backdropElement).toBe(null);
        }
      });
    });

    it('should fire onBackdropClick while backdrop clicked', () => {
      const onBackdropClick = jest.fn();

      render(<Backdrop onBackdropClick={onBackdropClick} open />);

      const backdropElement = document.body.querySelector(
        '.mzn-backdrop .mzn-backdrop__backdrop',
      )!;

      fireEvent.click(backdropElement!);

      expect(onBackdropClick).toHaveBeenCalledTimes(1);
    });

    it('should fire onClose while backdrop clicked', () => {
      const onClose = jest.fn();

      render(<Backdrop onClose={onClose} open />);

      const backdropElement = document.body.querySelector(
        '.mzn-backdrop .mzn-backdrop__backdrop',
      )!;

      fireEvent.click(backdropElement);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not fire onClose while backdrop clicked if disableCloseOnBackdropClick=true', () => {
      const onClose = jest.fn();

      render(<Backdrop disableCloseOnBackdropClick onClose={onClose} open />);

      const backdropElement = document.body.querySelector(
        '.mzn-backdrop .mzn-backdrop__backdrop',
      )!;

      fireEvent.click(backdropElement);

      expect(onClose).not.toHaveBeenCalled();
    });
  });
});
