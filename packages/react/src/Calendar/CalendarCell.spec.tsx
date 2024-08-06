import { cleanup, render } from '../../__test-utils__';
import { describeHostElementClassNameAppendable } from '../../__test-utils__/common';
import { CalendarCell } from '.';

describe('<CalendarCell />', () => {
  afterEach(cleanup);

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<CalendarCell className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<CalendarCell>No Data</CalendarCell>);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-calendar-cell')).toBeTruthy();
  });

  it('should render children', () => {
    const { getHostHTMLElement } = render(<CalendarCell>foo</CalendarCell>);
    const element = getHostHTMLElement();

    expect(element.textContent).toBe('foo');
  });

  describe('prop: active', () => {
    it('should contain mzn-calendar-cell--active class if active=true', () => {
      const { getHostHTMLElement } = render(
        <CalendarCell active>No Data</CalendarCell>,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-calendar-cell--active'),
      ).toBeTruthy();
    });
  });

  describe('prop: disabled', () => {
    it('should contain mzn-calendar-cell--disabled class if disabled=true', () => {
      const { getHostHTMLElement } = render(
        <CalendarCell disabled>No Data</CalendarCell>,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-calendar-cell--disabled'),
      ).toBeTruthy();
    });
  });

  describe('prop: today', () => {
    it('should contain mzn-calendar-cell--today class if today=true', () => {
      const { getHostHTMLElement } = render(
        <CalendarCell today>No Data</CalendarCell>,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-calendar-cell--today'),
      ).toBeTruthy();
    });
  });
});
