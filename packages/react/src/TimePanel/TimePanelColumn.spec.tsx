import { getUnits } from '@mezzanine-ui/core/time-panel';
import { cleanup, render, cleanupHook, fireEvent } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import { TimePanelColumn } from '.';

const testUnits = getUnits(0, 23, 1);

describe('<TimePanelColumn />', () => {
  Element.prototype.scrollTo = () => {};

  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<TimePanelColumn ref={ref} units={testUnits} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <TimePanelColumn units={testUnits} />,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-time-panel-column')).toBeTruthy();
  });

  describe('prop: onChange', () => {
    it('should bind to units click handler', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <TimePanelColumn units={testUnits} onChange={onChange} />,
      );
      const element = getHostHTMLElement();
      const btnElements = element.querySelectorAll(
        '.mzn-time-panel-column__button',
      );

      btnElements.forEach((btnElement) => {
        fireEvent.click(btnElement);
        expect(onChange).toHaveBeenCalledTimes(1);

        onChange.mockClear();
      });
    });
  });
});
