
import { getUnits } from '@mezzanine-ui/core/time-panel';
import {
  cleanup,
  render,
  cleanupHook,
  fireEvent,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
} from '../../__test-utils__/common';
import {
  TimePanelColumn,
} from '.';

const testUnits = getUnits(0, 23, 1);

describe('<TimePanelColumn />', () => {
  Element.prototype.scrollTo = () => {};

  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<TimePanelColumn ref={ref} units={testUnits} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<TimePanelColumn units={testUnits} />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-time-panel-column')).toBeTruthy();
  });

  it('smooth scroll should be prevented on first render', () => {
    const scrollToSpy = jest.spyOn(Element.prototype, 'scrollTo');

    const { rerender } = render(<TimePanelColumn units={testUnits} activeUnit={10} />);

    expect(scrollToSpy).toBeCalledWith(expect.objectContaining({
      behavior: 'auto',
    }));

    rerender(<TimePanelColumn units={testUnits} activeUnit={11} />);

    expect(scrollToSpy).toBeCalledWith(expect.objectContaining({
      behavior: 'smooth',
    }));
  });

  describe('prop: onChange', () => {
    it('units should not have click handler if onChange is falsy', () => {
      const { getHostHTMLElement } = render(<TimePanelColumn units={testUnits} />);
      const element = getHostHTMLElement();
      const btnElements = element.querySelectorAll('.mzn-time-panel-column__button');

      btnElements.forEach((btnElement) => {
        expect(btnElement).toBeInstanceOf(HTMLButtonElement);
        expect((btnElement as HTMLButtonElement).onclick).toBe(null);
      });
    });

    it('should bind to units click handler', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <TimePanelColumn
          units={testUnits}
          onChange={onChange}
        />,
      );
      const element = getHostHTMLElement();
      const btnElements = element.querySelectorAll('.mzn-time-panel-column__button');

      btnElements.forEach((btnElement) => {
        fireEvent.click(btnElement);
        expect(onChange).toBeCalledTimes(1);

        onChange.mockClear();
      });
    });
  });

  describe('prop: prefix', () => {
    it('should not have prefix container if non-provided', () => {
      const { getHostHTMLElement } = render(
        <TimePanelColumn units={testUnits} />,
      );
      const element = getHostHTMLElement();
      const prefixContainer = element.querySelector('.mzn-time-panel-column__prefix');

      expect(prefixContainer).toBe(null);
    });

    it('should append prefix element under a div element', () => {
      const { getHostHTMLElement } = render(
        <TimePanelColumn
          units={testUnits}
          prefix="foo"
        />,
      );
      const element = getHostHTMLElement();
      const prefixContainer = element.querySelector('.mzn-time-panel-column__prefix');

      expect(prefixContainer).toBeInstanceOf(HTMLDivElement);
      expect(prefixContainer?.textContent).toBe('foo');
    });
  });
});
