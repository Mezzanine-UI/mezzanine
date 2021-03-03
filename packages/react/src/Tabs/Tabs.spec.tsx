import { Key, useState } from 'react';
import {
  cleanup,
  fireEvent,
  render,
  TestRenderer,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Tabs, { Tab, TabPane } from '.';

describe('<Tabs />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(
      <Tabs ref={ref}>
        <TabPane tab={(<Tab>tab</Tab>)}>
          tabPane
        </TabPane>
      </Tabs>,
    ),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(
      <Tabs className={className}>
        <TabPane tab={(<Tab>tab</Tab>)}>
          tabPane
        </TabPane>
      </Tabs>,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <Tabs>
        <TabPane tab={(<Tab>tab</Tab>)}>
          tabPane
        </TabPane>
      </Tabs>,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-tabs')).toBeTruthy();
  });

  describe('prop: onTabClick', () => {
    it('should be fired w/ key while some tab clicked', () => {
      const onTabClick = jest.fn();
      const { getHostHTMLElement } = render(
        <Tabs onTabClick={onTabClick}>
          <TabPane key="foo" tab={(<Tab>tab1</Tab>)}>
            tabPane1
          </TabPane>
        </Tabs>,
      );
      const element = getHostHTMLElement();
      const { firstElementChild: tabBarElement } = element;
      const { firstElementChild: tabElement } = tabBarElement!;

      fireEvent.click(tabElement!);

      expect(onTabClick).toBeCalledTimes(1);
      expect(onTabClick.mock.calls[0][0]).toBe('foo');
    });
  });

  describe('element structure', () => {
    it('should extract tabs of tab panes to tab bar and render active pane', () => {
      const { getHostHTMLElement } = render(
        <Tabs>
          <TabPane tab={(<Tab>tab0</Tab>)}>tabPane0</TabPane>
          <TabPane tab={(<Tab>tab1</Tab>)}>tabPane1</TabPane>
        </Tabs>,
      );
      const element = getHostHTMLElement();
      const {
        firstElementChild: tabBarElement,
        lastElementChild: tabPaneElement,
        childElementCount,
      } = element;

      expect(childElementCount).toBe(2);
      expect(tabBarElement!.classList.contains('mzn-tabs__tab-bar')).toBeTruthy();

      [...tabBarElement!.children].forEach((child, index) => {
        expect(child.classList.contains('mzn-tabs__tab')).toBeTruthy();
        expect(child.textContent).toBe(`tab${index}`);
        expect(child.textContent).toBe(`tab${index}`);
      });

      expect(tabPaneElement!.classList.contains('mzn-tabs__pane')).toBeTruthy();
      expect(tabPaneElement!.textContent).toBe('tabPane0');
    });

    it('should provide active to tab', () => {
      const testInstance = TestRenderer.create(
        <Tabs defaultActiveKey="bar">
          <TabPane key="foo" tab={(<Tab>foo</Tab>)}>foo</TabPane>
          <TabPane key="bar" tab={(<Tab>bar</Tab>)}>bar</TabPane>
        </Tabs>,
      );

      testInstance.root.findAllByType(Tab).forEach((tab, index) => {
        expect(tab.props.active).toBe(index === 1);
      });
    });

    describe('tab bar', () => {
      describe('prop: tabBarClassName', () => {
        it('should bind tab bar class', () => {
          const { getHostHTMLElement } = render(
            <Tabs>
              <TabPane tab={(<Tab>tab</Tab>)}>
                tabPane
              </TabPane>
            </Tabs>,
          );
          const element = getHostHTMLElement();
          const { firstElementChild: tabBarElement } = element;

          expect(tabBarElement!.classList.contains('mzn-tabs__tab-bar')).toBeTruthy();
        });

        it('should append tabBarClassName to className of tab bar', () => {
          const { getHostHTMLElement } = render(
            <Tabs tabBarClassName="foo">
              <TabPane tab={(<Tab>tab</Tab>)}>
                tabPane
              </TabPane>
            </Tabs>,
          );
          const element = getHostHTMLElement();
          const { firstElementChild: tabBarElement } = element;

          expect(tabBarElement!.classList.contains('foo')).toBeTruthy();
        });
      });
    });
  });

  describe('control', () => {
    function testActiveKey(ui: JSX.Element) {
      const testInstance = TestRenderer.create(ui);
      const [inactiveTabInstance, activeTabInstance] = testInstance.root.findAllByType(Tab);

      expect(inactiveTabInstance.props.active).toBeFalsy();
      expect(activeTabInstance.props.active).toBeTruthy();
    }

    it('should activate the tab which activeKey=key of its parent tab pane', () => {
      testActiveKey(
        <Tabs activeKey="1">
          <TabPane key="0" tab={(<Tab>tab1</Tab>)}>
            tabPane1
          </TabPane>
          <TabPane key="1" tab={(<Tab>tab2</Tab>)}>
            tabPane2
          </TabPane>
        </Tabs>,
      );
    });

    it('should activate the tab which defaultActiveKey=key of its parent tab pane if activeKey not passed', () => {
      testActiveKey(
        <Tabs defaultActiveKey="1">
          <TabPane key="0" tab={(<Tab>tab1</Tab>)}>
            tabPane1
          </TabPane>
          <TabPane key="1" tab={(<Tab>tab2</Tab>)}>
            tabPane2
          </TabPane>
        </Tabs>,
      );
    });

    it('should fire onChange while inactive tab clicked', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <Tabs onChange={onChange}>
          <TabPane tab={(<Tab>tab1</Tab>)}>
            tabPane1
          </TabPane>
          <TabPane tab={(<Tab>tab2</Tab>)}>
            tabPane2
          </TabPane>
        </Tabs>,
      );
      const element = getHostHTMLElement();
      const { firstElementChild: tabBarElement } = element;
      const { lastElementChild: inactiveTabElement } = tabBarElement!;

      fireEvent.click(inactiveTabElement!);

      expect(onChange).toBeCalledTimes(1);
      expect(onChange.mock.calls[0][0]).toBe(1);
    });

    function testControlled(ui: JSX.Element) {
      const { getHostHTMLElement } = render(ui);
      const element = getHostHTMLElement();
      const { firstElementChild: tabBarElement } = element;
      const { firstElementChild: activeTabElement, lastElementChild: inactiveTabElement } = tabBarElement!;
      let tabPaneElement = element.lastElementChild!;

      expect(activeTabElement!.classList.contains('mzn-tabs__tab--active')).toBeTruthy();
      expect(inactiveTabElement!.classList.contains('mzn-tabs__tab--active')).toBeFalsy();
      expect(tabPaneElement.textContent).toBe('tabPane1');

      fireEvent.click(inactiveTabElement!);
      tabPaneElement = element.lastElementChild!;

      expect(activeTabElement!.classList.contains('mzn-tabs__tab--active')).toBeFalsy();
      expect(inactiveTabElement!.classList.contains('mzn-tabs__tab--active')).toBeTruthy();
      expect(tabPaneElement.textContent).toBe('tabPane2');
    }

    it('uncontrolled', () => {
      testControlled(
        <Tabs>
          <TabPane tab={(<Tab>tab1</Tab>)}>
            tabPane1
          </TabPane>
          <TabPane tab={(<Tab>tab2</Tab>)}>
            tabPane2
          </TabPane>
        </Tabs>,
      );
    });

    it('controlled', () => {
      const ControlledTabs = () => {
        const [tabKey, setTabKey] = useState<Key>('1');

        return (
          <Tabs
            activeKey={tabKey}
            onChange={setTabKey}
          >
            <TabPane key="1" tab={(<Tab>tab1</Tab>)}>
              tabPane1
            </TabPane>
            <TabPane key="2" tab={(<Tab>tab2</Tab>)}>
              tabPane2
            </TabPane>
          </Tabs>
        );
      };

      testControlled(<ControlledTabs />);
    });
  });
});
