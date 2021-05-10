import {
  cleanup,
  fireEvent,
  render,
} from '../../__test-utils__';
import {
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { CalendarControls } from '.';

describe('<CalendarCell />', () => {
  afterEach(cleanup);

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<CalendarControls className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<CalendarControls>No Data</CalendarControls>);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-calendar-controls')).toBeTruthy();
  });

  it('should render children', () => {
    const { getHostHTMLElement } = render(<CalendarControls>foo</CalendarControls>);
    const element = getHostHTMLElement();

    expect(element.textContent).toBe('foo');
  });

  describe('prop: onNext', () => {
    it('should render control button with chevron right icon and onNext as click handler', () => {
      const onNext = jest.fn();
      const { getHostHTMLElement } = render(<CalendarControls onNext={onNext}>No Data</CalendarControls>);
      const element = getHostHTMLElement();
      const [buttonElement] = element.getElementsByTagName('button');
      const iconElement = element.querySelector('[data-icon-name="chevron-right"]');

      expect(buttonElement.classList.contains('mzn-calendar-button')).toBe(true);
      expect(buttonElement.classList.contains('mzn-calendar-controls__icon-button')).toBe(true);
      expect(buttonElement.classList.contains('mzn-calendar-controls__next')).toBe(true);
      expect(buttonElement.contains(iconElement)).toBe(true);

      fireEvent.click(buttonElement);

      expect(onNext).toBeCalled();
    });
  });

  describe('prop: onPrev', () => {
    it('should render control button with chevron left icon and onPrev as click handler', () => {
      const onPrev = jest.fn();
      const { getHostHTMLElement } = render(<CalendarControls onPrev={onPrev}>No Data</CalendarControls>);
      const element = getHostHTMLElement();
      const [buttonElement] = element.getElementsByTagName('button');
      const iconElement = element.querySelector('[data-icon-name="chevron-left"]');

      expect(buttonElement.classList.contains('mzn-calendar-button')).toBe(true);
      expect(buttonElement.classList.contains('mzn-calendar-controls__icon-button')).toBe(true);
      expect(buttonElement.classList.contains('mzn-calendar-controls__prev')).toBe(true);
      expect(buttonElement.contains(iconElement)).toBe(true);

      fireEvent.click(buttonElement);

      expect(onPrev).toBeCalled();
    });
  });

  describe('prop: disableOnNext', () => {
    it('should disable the next button with aria-disabled set to true', () => {
      const onNext = jest.fn();
      const { getHostHTMLElement } = render(
        <CalendarControls
          onNext={onNext}
          disableOnNext
        >
          No Data
        </CalendarControls>,
      );
      const element = getHostHTMLElement();
      const [buttonElement] = element.getElementsByTagName('button');

      expect(buttonElement.classList.contains('mzn-calendar-button--disabled')).toBe(true);
      expect(buttonElement.disabled).toBe(true);
      expect(buttonElement.hasAttribute('disabled')).toBe(true);
      expect(buttonElement.getAttribute('aria-disabled')).toBe('true');

      fireEvent.click(buttonElement);

      expect(onNext).not.toBeCalled();
    });
  });

  describe('prop: disableOnPrev', () => {
    it('should disable the prev button with aria-disabled set to true', () => {
      const onPrev = jest.fn();
      const { getHostHTMLElement } = render(
        <CalendarControls
          onPrev={onPrev}
          disableOnPrev
        >
          No Data
        </CalendarControls>,
      );
      const element = getHostHTMLElement();
      const [buttonElement] = element.getElementsByTagName('button');

      expect(buttonElement.classList.contains('mzn-calendar-button--disabled')).toBe(true);
      expect(buttonElement.disabled).toBe(true);
      expect(buttonElement.hasAttribute('disabled')).toBe(true);
      expect(buttonElement.getAttribute('aria-disabled')).toBe('true');

      fireEvent.click(buttonElement);

      expect(onPrev).not.toBeCalled();
    });
  });
});
