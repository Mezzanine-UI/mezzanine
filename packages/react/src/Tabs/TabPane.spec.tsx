import {
  cleanup,
  render,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { Tab, TabPane } from '.';

describe('<TabPane />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<TabPane ref={ref} tab={(<Tab>tab</Tab>)} />),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<TabPane className={className} tab={(<Tab>tab</Tab>)} />),
  );

  it('should wrap children by div', () => {
    const { getHostHTMLElement } = render(
      <TabPane tab={(<Tab>tab</Tab>)}>
        <div data-test>
          foo
        </div>
      </TabPane>,
    );
    const element = getHostHTMLElement();
    const { firstElementChild } = element;

    expect(firstElementChild!.hasAttribute('data-test')).toBeTruthy();
    expect(firstElementChild!.textContent).toBe('foo');
  });

  describe('prop: tab', () => {
    it('should not pass tab element to props of div', () => {
      const { getHostHTMLElement } = render(
        <TabPane tab={(<Tab>tab</Tab>)}>
          tabPane
        </TabPane>,
      );
      const element = getHostHTMLElement();

      expect(element.getAttribute('tab')).toBe(null);
    });
  });
});
