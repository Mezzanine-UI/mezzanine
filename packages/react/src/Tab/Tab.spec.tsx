import { tabClasses } from '@mezzanine-ui/core/tab';
import { cleanup, render, fireEvent } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Tab from './Tab';
import TabItem from './TabItem';

describe('<Tab />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <Tab activeKey="1" ref={ref}>
        <TabItem key="1">tab</TabItem>
      </Tab>,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <Tab activeKey="1" className={className}>
        <TabItem key="1">tab</TabItem>
      </Tab>,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <Tab activeKey="1">
        <TabItem key="1">tab</TabItem>
      </Tab>,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains(tabClasses.host)).toBeTruthy();
  });

  it('should render children', () => {
    const { getHostHTMLElement } = render(
      <Tab activeKey="1">
        <TabItem key="1">TabItem 1</TabItem>
        <TabItem key="2">TabItem 2</TabItem>
      </Tab>,
    );
    const element = getHostHTMLElement();
    const buttons = element.querySelectorAll('button');

    expect(buttons.length).toBe(2);
  });

  describe('prop: direction', () => {
    it('should render horizontal by default', () => {
      const { getHostHTMLElement } = render(
        <Tab activeKey="1">
          <TabItem key="1">tab</TabItem>
        </Tab>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains(tabClasses.tabHorizontal)).toBeTruthy();
    });

    it('should render horizontal when direction="horizontal"', () => {
      const { getHostHTMLElement } = render(
        <Tab activeKey="1" direction="horizontal">
          <TabItem key="1">tab</TabItem>
        </Tab>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains(tabClasses.tabHorizontal)).toBeTruthy();
    });

    it('should render vertical when direction="vertical"', () => {
      const { getHostHTMLElement } = render(
        <Tab activeKey="1" direction="vertical">
          <TabItem key="1">tab</TabItem>
        </Tab>,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains(tabClasses.tabVertical)).toBeTruthy();
    });
  });

  describe('prop: activeKey', () => {
    it('should set active class on matching TabItem', () => {
      const { getHostHTMLElement } = render(
        <Tab activeKey="2">
          <TabItem key="1">TabItem 1</TabItem>
          <TabItem key="2">TabItem 2</TabItem>
        </Tab>,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll('button');

      expect(buttons[0].classList.contains(tabClasses.tabItemActive)).toBe(
        false,
      );
      expect(buttons[1].classList.contains(tabClasses.tabItemActive)).toBe(
        true,
      );
    });
  });

  describe('prop: onChange', () => {
    it('should call onChange when TabItem is clicked', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <Tab activeKey="1" onChange={onChange}>
          <TabItem key="1">TabItem 1</TabItem>
          <TabItem key="2">TabItem 2</TabItem>
        </Tab>,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll('button');

      fireEvent.click(buttons[1]);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith('2');
    });

    it('should not call onChange when disabled TabItem is clicked', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <Tab activeKey="1" onChange={onChange}>
          <TabItem key="1">TabItem 1</TabItem>
          <TabItem disabled key="2">
            TabItem 2
          </TabItem>
        </Tab>,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll('button');

      fireEvent.click(buttons[1]);

      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
