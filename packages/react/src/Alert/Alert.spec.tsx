import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Alert, { AlertSeverity } from '.';

describe('<Alert />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<Alert ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Alert className={className} />),
  );

  it('should render the text and wrap it under a p element', () => {
    const { getHostHTMLElement, getByText } = render(<Alert>Hello</Alert>);
    const element = getHostHTMLElement();
    const messageElement = getByText('Hello');

    expect(element.textContent).toBe('Hello');
    expect(messageElement.textContent).toBe('Hello');
    expect(messageElement.tagName.toLowerCase()).toBe('p');
    expect(
      messageElement.classList.contains('mzn-alert__message'),
    ).toBeTruthy();
  });

  it('should not render the message if no children', () => {
    const { getHostHTMLElement } = render(<Alert />);
    const element = getHostHTMLElement();

    expect(element.querySelector('.mzn-alert_message')?.textContent).toBe(
      undefined,
    );
  });

  describe('prop: onClose', () => {
    it('should be fired on click event', () => {
      const onClose = jest.fn();
      const { getHostHTMLElement } = render(<Alert onClose={onClose} />);
      const element = getHostHTMLElement();
      const closeBtn = element.querySelector('.mzn-alert__close-icon') as Node;

      fireEvent.click(closeBtn);

      expect(onClose).toBeCalledTimes(1);
    });
  });

  describe('prop: severity', () => {
    it('should render severity="success" by default', () => {
      const { getHostHTMLElement } = render(<Alert />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-alert--success')).toBeTruthy();
    });

    const severities: AlertSeverity[] = ['success', 'warning', 'error'];

    severities.forEach((severity) => {
      it(`should add class if type="${severity}"`, () => {
        const { getHostHTMLElement } = render(<Alert severity={severity} />);
        const element = getHostHTMLElement();

        expect(
          element.classList.contains(`mzn-alert--${severity}`),
        ).toBeTruthy();
      });
    });
  });
});
