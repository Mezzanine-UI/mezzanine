
import {
  cleanup,
  render,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import {
  TimePanelAction,
} from '.';

describe('<TimePanelAction />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<TimePanelAction ref={ref} />),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<TimePanelAction className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<TimePanelAction />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-time-panel-action')).toBeTruthy();
  });

  describe('prop: confirmText', () => {
    it('default to "OK"', () => {
      const { getHostHTMLElement } = render(<TimePanelAction />);
      const element = getHostHTMLElement();
      const buttonElement = element.querySelector('.mzn-button');

      expect(buttonElement?.textContent).toBe('OK');
    });

    it('should pass to button element', () => {
      const { getHostHTMLElement } = render(<TimePanelAction confirmText="foo" />);
      const element = getHostHTMLElement();
      const buttonElement = element.querySelector('.mzn-button');

      expect(buttonElement?.textContent).toBe('foo');
    });
  });
});
