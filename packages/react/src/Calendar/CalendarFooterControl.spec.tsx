import { cleanup, fireEvent, render } from '../../__test-utils__';
import { describeHostElementClassNameAppendable } from '../../__test-utils__/common';
import CalendarFooterControl from './CalendarFooterControl';

describe('<CalendarFooterControl />', () => {
  afterEach(cleanup);

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<CalendarFooterControl className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<CalendarFooterControl />);
    const element = getHostHTMLElement();

    expect(
      element.classList.contains('mzn-calendar-footer-control'),
    ).toBeTruthy();
  });

  it('should render children', () => {
    const { getByText } = render(
      <CalendarFooterControl>Today</CalendarFooterControl>,
    );
    const button = getByText('Today');

    expect(button).toBeInstanceOf(HTMLButtonElement);
  });

  describe('prop: onClick', () => {
    it('should call onClick when button is clicked', () => {
      const onClick = jest.fn();
      const { getByText } = render(
        <CalendarFooterControl onClick={onClick}>Today</CalendarFooterControl>,
      );
      const button = getByText('Today');

      fireEvent.click(button);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not throw error if onClick is not provided', () => {
      const { getByText } = render(
        <CalendarFooterControl>Today</CalendarFooterControl>,
      );
      const button = getByText('Today');

      expect(() => {
        fireEvent.click(button);
      }).not.toThrow();
    });
  });
});
