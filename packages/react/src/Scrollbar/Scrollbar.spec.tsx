import '@testing-library/jest-dom';
import { OverlayScrollbars } from 'overlayscrollbars';
import { cleanup, render } from '../../__test-utils__';
import Scrollbar from '.';

function getOptions(container: HTMLElement) {
  const host = container.querySelector<HTMLElement>('.mzn-scrollbar');
  const instance = host ? OverlayScrollbars(host) : undefined;

  if (!instance) throw new Error('OverlayScrollbars was not initialised');

  return instance.options();
}

describe('<Scrollbar />', () => {
  afterEach(cleanup);

  describe('options', () => {
    it('should scroll on both axes and auto-hide by default', () => {
      const { container } = render(
        <Scrollbar defer={false}>
          <div>content</div>
        </Scrollbar>,
      );
      const options = getOptions(container);

      expect(options.overflow).toEqual({ x: 'scroll', y: 'scroll' });
      expect(options.scrollbars.autoHide).toBe('scroll');
      expect(options.scrollbars.autoHideDelay).toBe(600);
      expect(options.scrollbars.clickScroll).toBe(true);
    });

    it('should respect a caller-supplied options.overflow', () => {
      const { container } = render(
        <Scrollbar defer={false} options={{ overflow: { x: 'hidden' } }}>
          <div>content</div>
        </Scrollbar>,
      );

      expect(getOptions(container).overflow).toEqual({
        x: 'hidden',
        y: 'scroll',
      });
    });

    it('should let options.scrollbars override the auto-hide defaults', () => {
      const { container } = render(
        <Scrollbar
          defer={false}
          options={{ scrollbars: { autoHide: 'never' } }}
        >
          <div>content</div>
        </Scrollbar>,
      );
      const { scrollbars } = getOptions(container);

      expect(scrollbars.autoHide).toBe('never');
      expect(scrollbars.autoHideDelay).toBe(600);
    });
  });

  describe('disabled', () => {
    it('should render a plain div without OverlayScrollbars', () => {
      const { container } = render(
        <Scrollbar disabled options={{ overflow: { x: 'hidden' } }}>
          <div>content</div>
        </Scrollbar>,
      );

      expect(container.querySelector('.mzn-scrollbar')).toBeNull();
      expect(container.querySelector('[data-overlayscrollbars]')).toBeNull();
    });
  });
});
