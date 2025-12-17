import { Key, useState, type JSX } from 'react';
import { cleanup, fireEvent, render, act } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Tabs, { Tab, TabPane } from '.';

// Mock Tab to track props while preserving structure
const mockTabRender = jest.fn();
const OriginalTab = jest.requireActual('./Tab').default;

jest.mock('./Tab', () => {
  return function MockTab(props: any) {
    mockTabRender(props);
    // Use the original Tab component to maintain proper structure
    const React = require('react');
    return React.createElement(OriginalTab, props);
  };
});

describe('<Tabs />', () => {
  afterEach(() => {
    cleanup();
    mockTabRender.mockClear();
  });

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <Tabs ref={ref}>
        <TabPane tab={<Tab>tab</Tab>}>tabPane</TabPane>
      </Tabs>,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <Tabs className={className}>
        <TabPane tab={<Tab>tab</Tab>}>tabPane</TabPane>
      </Tabs>,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <Tabs>
        <TabPane tab={<Tab>tab</Tab>}>tabPane</TabPane>
      </Tabs>,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-tabs')).toBeTruthy();
  });

  describe('element structure', () => {
    it('should extract tabs of tab panes to tab bar and render active pane', () => {
      const { getHostHTMLElement } = render(
        <Tabs>
          <TabPane tab={<Tab>tab0</Tab>}>tabPane0</TabPane>
          <TabPane tab={<Tab>tab1</Tab>}>tabPane1</TabPane>
        </Tabs>,
      );
      const element = getHostHTMLElement();
      const {
        firstElementChild: tabBarElement,
        lastElementChild: tabPaneElement,
        childElementCount,
      } = element;
      const { firstElementChild: tabsOverflowElement } = tabBarElement!;
      const { firstElementChild: tabsElement } = tabsOverflowElement!;

      expect(childElementCount).toBe(2);
      expect(tabsElement!.classList.contains('mzn-tabs__tabs')).toBeTruthy();

      [...tabsElement!.children].forEach((child, index) => {
        expect(child.classList.contains('mzn-tabs__tab')).toBeTruthy();
        expect(child.textContent).toBe(`tab${index}`);
        expect(child.textContent).toBe(`tab${index}`);
      });

      expect(tabPaneElement!.classList.contains('mzn-tabs__pane')).toBeTruthy();
      expect(tabPaneElement!.textContent).toBe('tabPane0');
    });

    describe('tab bar', () => {
      describe('prop: tabBarClassName', () => {
        it('should wrapped tab bar by overflow wrapper', () => {
          const { getHostHTMLElement } = render(
            <Tabs>
              <TabPane tab={<Tab>tab</Tab>}>tabPane</TabPane>
            </Tabs>,
          );
          const element = getHostHTMLElement();
          const { firstElementChild: tabBarElement } = element;
          const { firstElementChild: tabsOverflowElement } = tabBarElement!;

          expect(
            tabsOverflowElement!.classList.contains('mzn-tabs--overflow'),
          ).toBeTruthy();
        });

        it('should append tabBarClassName to className of tab bar', () => {
          const { getHostHTMLElement } = render(
            <Tabs tabBarClassName="foo">
              <TabPane tab={<Tab>tab</Tab>}>tabPane</TabPane>
            </Tabs>,
          );
          const element = getHostHTMLElement();
          const { firstElementChild: tabBarElement } = element;

          expect(tabBarElement!.classList.contains('foo')).toBeTruthy();
        });
      });
    });
  });

  describe('overflow', () => {
    Object.defineProperty(HTMLDivElement.prototype, 'scrollWidth', {
      configurable: true,
      value: 400,
    });
    Object.defineProperty(HTMLDivElement.prototype, 'clientWidth', {
      configurable: true,
      value: 200,
    });

    it('should render button on the right when overflow', () => {
      const { getHostHTMLElement } = render(
        <div style={{ width: 200 }}>
          <Tabs>
            {Array.from('ABCDEFG').map((tab) => (
              <TabPane key={tab} tab={<Tab>{tab}</Tab>}>
                {tab}
              </TabPane>
            ))}
          </Tabs>
        </div>,
      );

      const element = getHostHTMLElement();
      const tabsOverflowElement = element.querySelector('.mzn-tabs--overflow');
      const { lastElementChild: rightBtnElement } = tabsOverflowElement!;

      expect(rightBtnElement!.tagName.toLowerCase()).toBe('button');
      expect(rightBtnElement!.getAttribute('aria-label')).toBe('scrollToRight');
      expect(
        rightBtnElement!.classList.contains('mzn-tabs__scroll-btn'),
      ).toBeTruthy();
    });

    it('should render button on the left if scroll the tabs', () => {
      const { getHostHTMLElement } = render(
        <div style={{ width: 200 }}>
          <Tabs>
            {Array.from('ABCD').map((tab) => (
              <TabPane key={tab} tab={<Tab>{tab}</Tab>}>
                {tab}
              </TabPane>
            ))}
          </Tabs>
        </div>,
      );

      const element = getHostHTMLElement();
      const tabsOverflowElement = element.querySelector('.mzn-tabs--overflow');
      const tabsElement = element.querySelector('.mzn-tabs__tabs');

      act(() => {
        tabsElement!.scrollLeft = 10;
        tabsElement!.dispatchEvent(new window.Event('scroll'));
      });

      const { firstElementChild } = tabsOverflowElement!;

      expect(firstElementChild!.tagName.toLowerCase()).toBe('button');
      expect(firstElementChild!.getAttribute('aria-label')).toBe(
        'scrollToLeft',
      );
      expect(
        firstElementChild!.classList.contains('mzn-tabs__scroll-btn'),
      ).toBeTruthy();
    });

    it('should scroll tabs to right when click', () => {
      const { getHostHTMLElement } = render(
        <div style={{ width: 200 }}>
          <Tabs>
            {Array.from('ABCDEFG').map((tab) => (
              <TabPane key={tab} tab={<Tab>{tab}</Tab>}>
                {tab}
              </TabPane>
            ))}
          </Tabs>
        </div>,
      );

      const element = getHostHTMLElement();
      const tabsOverflowElement = element.querySelector('.mzn-tabs--overflow');
      const tabsElement = element.querySelector('.mzn-tabs__tabs');
      const { lastElementChild: rightBtnElement } = tabsOverflowElement!;
      const scrollEnd = tabsElement!.scrollWidth - tabsElement!.clientWidth;

      tabsElement!.scrollTo = jest.fn();

      fireEvent.click(rightBtnElement!);

      act(() => {
        tabsElement!.scrollLeft = scrollEnd;
        tabsElement!.dispatchEvent(new window.Event('scroll'));
      });

      expect(tabsElement!.scrollTo).toHaveBeenCalled();
      expect(tabsElement!.scrollLeft).toBe(scrollEnd);
    });

    it('should scroll tabs to left when click', () => {
      const { getHostHTMLElement } = render(
        <div style={{ width: 200 }}>
          <Tabs>
            {Array.from('ABCD').map((tab) => (
              <TabPane key={tab} tab={<Tab>{tab}</Tab>}>
                {tab}
              </TabPane>
            ))}
          </Tabs>
        </div>,
      );

      const element = getHostHTMLElement();
      const tabsOverflowElement = element.querySelector('.mzn-tabs--overflow');
      const tabsElement = element.querySelector('.mzn-tabs__tabs');

      tabsElement!.scrollTo = jest.fn();

      act(() => {
        tabsElement!.scrollLeft = 10;
        tabsElement!.dispatchEvent(new window.Event('scroll'));
      });

      const { firstElementChild: leftBtnElement } = tabsOverflowElement!;

      fireEvent.click(leftBtnElement!);

      act(() => {
        tabsElement!.scrollLeft = 0;
        tabsElement!.dispatchEvent(new window.Event('scroll'));
      });

      expect(tabsElement!.scrollTo).toHaveBeenCalled();
      expect(tabsElement!.scrollLeft).toBe(0);
    });
  });

  describe('prop: onTabClick', () => {
    it('should be fired w/ key while some tab clicked', () => {
      const onTabClick = jest.fn();
      const { getHostHTMLElement } = render(
        <Tabs onTabClick={onTabClick}>
          <TabPane key="foo" tab={<Tab>tab1</Tab>}>
            tabPane1
          </TabPane>
        </Tabs>,
      );
      const element = getHostHTMLElement();
      const tabsElement = element.querySelector('.mzn-tabs__tabs');
      const { firstElementChild: tabElement } = tabsElement!;

      fireEvent.click(tabElement!);

      expect(onTabClick).toHaveBeenCalledTimes(1);
      expect(onTabClick.mock.calls[0][0]).toBe('foo');
    });
  });

  describe('prop: actions', () => {
    it('should render actions on the right side of tab bar', () => {
      const { getHostHTMLElement } = render(
        <Tabs actions={<button type="button">action</button>}>
          <TabPane key="foo" tab={<Tab>tab1</Tab>}>
            tabPane1
          </TabPane>
        </Tabs>,
      );

      const element = getHostHTMLElement();
      const { firstElementChild: tabBarElement } = element;
      const { lastElementChild: actionElement } = tabBarElement!;

      expect(actionElement!.tagName.toLowerCase()).toBe('button');
      expect(actionElement!.textContent).toBe('action');
    });
  });

  it('should provide active to tab', () => {
    render(
      <Tabs defaultActiveKey="bar">
        <TabPane key="foo" tab={<Tab>foo</Tab>}>
          foo
        </TabPane>
        <TabPane key="bar" tab={<Tab>bar</Tab>}>
          bar
        </TabPane>
      </Tabs>,
    );

    const calls = mockTabRender.mock.calls;
    expect(calls[0][0].active).toBe(false);
    expect(calls[1][0].active).toBe(true);
  });

  describe('control', () => {
    function testActiveKey(ui: JSX.Element) {
      mockTabRender.mockClear();
      render(ui);

      const calls = mockTabRender.mock.calls;
      expect(calls[0][0].active).toBeFalsy();
      expect(calls[1][0].active).toBeTruthy();
    }

    it('should activate the tab which activeKey=key of its parent tab pane', () => {
      testActiveKey(
        <Tabs activeKey="1">
          <TabPane key="0" tab={<Tab>tab1</Tab>}>
            tabPane1
          </TabPane>
          <TabPane key="1" tab={<Tab>tab2</Tab>}>
            tabPane2
          </TabPane>
        </Tabs>,
      );
    });

    it('should activate the tab which defaultActiveKey=key of its parent tab pane if activeKey not passed', () => {
      testActiveKey(
        <Tabs defaultActiveKey="1">
          <TabPane key="0" tab={<Tab>tab1</Tab>}>
            tabPane1
          </TabPane>
          <TabPane key="1" tab={<Tab>tab2</Tab>}>
            tabPane2
          </TabPane>
        </Tabs>,
      );
    });

    it('should fire onChange while inactive tab clicked', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <Tabs onChange={onChange}>
          <TabPane tab={<Tab>tab1</Tab>}>tabPane1</TabPane>
          <TabPane tab={<Tab>tab2</Tab>}>tabPane2</TabPane>
        </Tabs>,
      );
      const element = getHostHTMLElement();
      const tabsElement = element.querySelector('.mzn-tabs__tabs');
      const { lastElementChild: inactiveTabElement } = tabsElement!;

      fireEvent.click(inactiveTabElement!);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][0]).toBe(1);
    });

    function testControlled(ui: JSX.Element) {
      const { getHostHTMLElement } = render(ui);
      const element = getHostHTMLElement();
      const tabsElement = element.querySelector('.mzn-tabs__tabs');
      const {
        firstElementChild: activeTabElement,
        lastElementChild: inactiveTabElement,
      } = tabsElement!;
      let tabPaneElement = element.lastElementChild!;

      expect(
        activeTabElement!.classList.contains('mzn-tabs__tab--active'),
      ).toBeTruthy();
      expect(
        inactiveTabElement!.classList.contains('mzn-tabs__tab--active'),
      ).toBeFalsy();
      expect(tabPaneElement.textContent).toBe('tabPane1');

      fireEvent.click(inactiveTabElement!);
      tabPaneElement = element.lastElementChild!;

      expect(
        activeTabElement!.classList.contains('mzn-tabs__tab--active'),
      ).toBeFalsy();
      expect(
        inactiveTabElement!.classList.contains('mzn-tabs__tab--active'),
      ).toBeTruthy();
      expect(tabPaneElement.textContent).toBe('tabPane2');
    }

    it('uncontrolled', () => {
      testControlled(
        <Tabs>
          <TabPane tab={<Tab>tab1</Tab>}>tabPane1</TabPane>
          <TabPane tab={<Tab>tab2</Tab>}>tabPane2</TabPane>
        </Tabs>,
      );
    });

    it('controlled', () => {
      const ControlledTabs = () => {
        const [tabKey, setTabKey] = useState<Key>('1');

        return (
          <Tabs activeKey={tabKey} onChange={setTabKey}>
            <TabPane key="1" tab={<Tab>tab1</Tab>}>
              tabPane1
            </TabPane>
            <TabPane key="2" tab={<Tab>tab2</Tab>}>
              tabPane2
            </TabPane>
          </Tabs>
        );
      };

      testControlled(<ControlledTabs />);
    });
  });
});
