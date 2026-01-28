import { cleanup, fireEvent, render } from '../../__test-utils__';
import { describeHostElementClassNameAppendable } from '../../__test-utils__/common';
import { CalendarControls } from '.';

describe('<CalendarControls />', () => {
  afterEach(cleanup);

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<CalendarControls className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <CalendarControls>No Data</CalendarControls>,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-calendar-controls')).toBeTruthy();
  });

  it('should render children', () => {
    const { getHostHTMLElement } = render(
      <CalendarControls>foo</CalendarControls>,
    );
    const element = getHostHTMLElement();

    expect(element.textContent).toBe('foo');
  });

  describe('prop: onNext', () => {
    it('should render control button with chevron right icon and onNext as click handler', () => {
      const onNext = jest.fn();
      const { getByTitle } = render(
        <CalendarControls onNext={onNext}>No Data</CalendarControls>,
      );
      const buttonElement = getByTitle('Next Month');
      const iconElement = buttonElement.querySelector(
        '[data-icon-name="chevron-right"]',
      );

      expect(buttonElement).toBeInstanceOf(HTMLButtonElement);
      expect(
        buttonElement.classList.contains('mzn-calendar-controls__button'),
      ).toBe(true);
      expect(iconElement).not.toBeNull();

      fireEvent.click(buttonElement);

      expect(onNext).toHaveBeenCalled();
    });
  });

  describe('prop: onPrev', () => {
    it('should render control button with chevron left icon and onPrev as click handler', () => {
      const onPrev = jest.fn();
      const { getByTitle } = render(
        <CalendarControls onPrev={onPrev}>No Data</CalendarControls>,
      );
      const buttonElement = getByTitle('Previous Month');
      const iconElement = buttonElement.querySelector(
        '[data-icon-name="chevron-left"]',
      );

      expect(buttonElement).toBeInstanceOf(HTMLButtonElement);
      expect(
        buttonElement.classList.contains('mzn-calendar-controls__button'),
      ).toBe(true);
      expect(iconElement).not.toBeNull();

      fireEvent.click(buttonElement);

      expect(onPrev).toHaveBeenCalled();
    });
  });

  describe('prop: onDoubleNext', () => {
    it('should render control button with double chevron right icon and onDoubleNext as click handler', () => {
      const onDoubleNext = jest.fn();
      const { getByTitle } = render(
        <CalendarControls onDoubleNext={onDoubleNext}>
          No Data
        </CalendarControls>,
      );
      const buttonElement = getByTitle('Next Year');
      const iconElement = buttonElement.querySelector(
        '[data-icon-name="double-chevron-right"]',
      );

      expect(buttonElement).toBeInstanceOf(HTMLButtonElement);
      expect(
        buttonElement.classList.contains('mzn-calendar-controls__button'),
      ).toBe(true);
      expect(iconElement).not.toBeNull();

      fireEvent.click(buttonElement);

      expect(onDoubleNext).toHaveBeenCalled();
    });
  });

  describe('prop: onDoublePrev', () => {
    it('should render control button with double chevron left icon and onDoublePrev as click handler', () => {
      const onDoublePrev = jest.fn();
      const { getByTitle } = render(
        <CalendarControls onDoublePrev={onDoublePrev}>
          No Data
        </CalendarControls>,
      );
      const buttonElement = getByTitle('Previous Year');
      const iconElement = buttonElement.querySelector(
        '[data-icon-name="double-chevron-left"]',
      );

      expect(buttonElement).toBeInstanceOf(HTMLButtonElement);
      expect(
        buttonElement.classList.contains('mzn-calendar-controls__button'),
      ).toBe(true);
      expect(iconElement).not.toBeNull();

      fireEvent.click(buttonElement);

      expect(onDoublePrev).toHaveBeenCalled();
    });
  });

  describe('prop: disableOnNext', () => {
    it('should disable the next button with aria-disabled set to true', () => {
      const onNext = jest.fn();
      const { getByTitle } = render(
        <CalendarControls onNext={onNext} disableOnNext>
          No Data
        </CalendarControls>,
      );
      const buttonElement = getByTitle('Next Month') as HTMLButtonElement;

      expect(buttonElement.disabled).toBe(true);
      expect(buttonElement.hasAttribute('disabled')).toBe(true);
      expect(buttonElement.getAttribute('aria-disabled')).toBe('true');

      fireEvent.click(buttonElement);

      expect(onNext).not.toHaveBeenCalled();
    });
  });

  describe('prop: disableOnPrev', () => {
    it('should disable the prev button with aria-disabled set to true', () => {
      const onPrev = jest.fn();
      const { getByTitle } = render(
        <CalendarControls onPrev={onPrev} disableOnPrev>
          No Data
        </CalendarControls>,
      );
      const buttonElement = getByTitle('Previous Month') as HTMLButtonElement;

      expect(buttonElement.disabled).toBe(true);
      expect(buttonElement.hasAttribute('disabled')).toBe(true);
      expect(buttonElement.getAttribute('aria-disabled')).toBe('true');

      fireEvent.click(buttonElement);

      expect(onPrev).not.toHaveBeenCalled();
    });
  });

  describe('prop: disableOnDoubleNext', () => {
    it('should disable the double next button with aria-disabled set to true', () => {
      const onDoubleNext = jest.fn();
      const { getByTitle } = render(
        <CalendarControls onDoubleNext={onDoubleNext} disableOnDoubleNext>
          No Data
        </CalendarControls>,
      );
      const buttonElement = getByTitle('Next Year') as HTMLButtonElement;

      expect(buttonElement.disabled).toBe(true);
      expect(buttonElement.hasAttribute('disabled')).toBe(true);
      expect(buttonElement.getAttribute('aria-disabled')).toBe('true');

      fireEvent.click(buttonElement);

      expect(onDoubleNext).not.toHaveBeenCalled();
    });
  });

  describe('prop: disableOnDoublePrev', () => {
    it('should disable the double prev button with aria-disabled set to true', () => {
      const onDoublePrev = jest.fn();
      const { getByTitle } = render(
        <CalendarControls onDoublePrev={onDoublePrev} disableOnDoublePrev>
          No Data
        </CalendarControls>,
      );
      const buttonElement = getByTitle('Previous Year') as HTMLButtonElement;

      expect(buttonElement.disabled).toBe(true);
      expect(buttonElement.hasAttribute('disabled')).toBe(true);
      expect(buttonElement.getAttribute('aria-disabled')).toBe('true');

      fireEvent.click(buttonElement);

      expect(onDoublePrev).not.toHaveBeenCalled();
    });
  });
});
