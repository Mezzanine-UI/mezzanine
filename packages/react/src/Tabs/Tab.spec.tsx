import {
  cleanup,
  render,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { Tab } from '.';

describe('<Tab />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLButtonElement,
    (ref) => render(<Tab ref={ref} />),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<Tab className={className} />),
  );

  it('should wrap children by button', () => {
    const { getHostHTMLElement } = render(<Tab>tab</Tab>);
    const element = getHostHTMLElement();

    expect(element.tagName.toLowerCase()).toBe('button');
    expect(element.textContent).toBe('tab');
  });

  describe('prop: active', () => {
    it('should be render active=false by default', () => {
      const { getHostHTMLElement } = render(<Tab>tab</Tab>);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-tabs__tab--active')).toBeFalsy();
    });

    [false, true].forEach((active) => {
      const message = active
        ? 'should active if active=true'
        : 'should inactive if active=false';

      it(message, () => {
        const { getHostHTMLElement } = render(<Tab active={active}>tab</Tab>);
        const element = getHostHTMLElement();

        expect(element.classList.contains('mzn-tabs__tab--active')).toBe(active);
      });
    });
  });

  describe('prop: disabled', () => {
    it('should has disabled and aria-disabled attributes', () => {
      [false, true].forEach((disabled) => {
        const { getHostHTMLElement } = render(
          <Tab disabled={disabled}>tab</Tab>,
        );
        const element = getHostHTMLElement();

        expect(element.hasAttribute('disabled')).toBe(disabled);
        expect(element.getAttribute('aria-disabled')).toBe(`${disabled}`);
      });
    });

    it('aria-disabled from props should not override', () => {
      const { getHostHTMLElement } = render(
        <Tab aria-disabled={false} disabled>tab</Tab>,
      );
      const element = getHostHTMLElement();

      expect(element.getAttribute('aria-disabled')).toBeTruthy();
    });
  });
});
