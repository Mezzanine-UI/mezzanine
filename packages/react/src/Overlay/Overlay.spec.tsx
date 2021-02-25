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

  describe('prop: hideBackdrop', () => {
    it('should not render backdrop if hideBackdrop=true', () => {
      render(
        <Overlay hideBackdrop />,
      );

      const backdropElement = document.body.querySelector('.mzn-overlay .mzn-overlay__backdrop')!;

      expect(backdropElement).toBe(null);
    });
  });

  describe('prop: onBackdropClick', () => {
    it('should fired if backdrop clicked', () => {
      const onBackdropClick = jest.fn();

      render(
        <Overlay onBackdropClick={onBackdropClick} />,
      );

      const backdropElement = document.body.querySelector('.mzn-overlay .mzn-overlay__backdrop')!;

      fireEvent.click(backdropElement!);

      expect(onBackdropClick).toBeCalledTimes(1);
    });
  });
});
