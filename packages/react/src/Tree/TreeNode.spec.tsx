import { TreeSize } from '@mezzanine-ui/core/tree';
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
import {
  TreeNode,
} from '.';
import Typography, { TypographyVariant } from '../Typography';
import Checkbox from '../Checkbox';
import ConfigProvider from '../Provider';

describe('<TreeNode />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLLIElement,
    (ref) => render(<TreeNode ref={ref} value="foo" label="bar" />),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<TreeNode className={className} value="foo" label="bar" />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<TreeNode value="foo" label="bar" />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-tree-node')).toBeTruthy();
  });

  it('should render icon if children is provided', () => {
    const { getHostHTMLElement } = render(
      <TreeNode value="foo" label="bar">
        <span>foo</span>
      </TreeNode>,
    );
    const element = getHostHTMLElement();
    const [caretElement] = element.getElementsByClassName('mzn-icon');

    expect(caretElement).toBeInstanceOf(HTMLElement);
    expect(caretElement.classList.contains('mzn-tree-node__caret')).toBe(true);
  });

  describe('prop: disabled', () => {
    it('should apply disable layout if disabled=true', () => {
      const { getHostHTMLElement } = render(
        <TreeNode
          value="foo"
          label="bar"
          disabled
        />,
      );

      const element = getHostHTMLElement();
      const labelElement = element.querySelector('.mzn-tree-node__label');

      expect(labelElement?.classList.contains('mzn-tree-node__label--disabled'));
    });
  });

  describe('prop: indeterminate', () => {
    it('should apply indeterminate layout if indeterminate=true', () => {
      const { getHostHTMLElement } = render(
        <TreeNode
          value="foo"
          label="bar"
          indeterminate
        />,
      );

      const element = getHostHTMLElement();
      const labelElement = element.querySelector('.mzn-tree-node__label');

      expect(labelElement?.classList.contains('mzn-tree-node__label--indeterminate'));
    });

    it('should pass indeterminate to Checkbox on multiple mode if indeterminate=true', () => {
      const testInstance = TestRenderer.create(
        <TreeNode
          value="foo"
          label="bar"
          multiple
          indeterminate
        />,
      );

      const checkboxInstance = testInstance.root.findByType(Checkbox);

      expect(checkboxInstance.props.indeterminate).toBe(true);
    });
  });

  describe('prop: label', () => {
    it('should label be rendered under Typography', () => {
      const testInstance = TestRenderer.create(
        <TreeNode
          value="foo"
          label="bar"
          selected
        />,
      );

      const typographyInstance = testInstance.root.findByType(Typography);

      expect(typographyInstance.props.children).toEqual('bar');
    });

    it('should label be rendered under Checkbox if multiple=true', () => {
      const testInstance = TestRenderer.create(
        <TreeNode
          value="foo"
          label="bar"
          multiple
          selected
        />,
      );

      const checkboxInstance = testInstance.root.findByType(Checkbox);

      expect(checkboxInstance.props.children).toEqual('bar');
    });
  });

  describe('prop: multiple', () => {
    it('label should be rendered as Checkbox if multiple=true', () => {
      const { getHostHTMLElement } = render(
        <TreeNode value="foo" label="bar" multiple />,
      );

      const element = getHostHTMLElement();
      const [checkboxElement] = element.getElementsByClassName('mzn-input-check');

      expect(checkboxElement).toBeInstanceOf(HTMLLabelElement);
      expect(checkboxElement.textContent).toBe('bar');
    });
  });

  describe('prop: onExpand', () => {
    it('caret icon has no click handler by default', () => {
      const { getHostHTMLElement } = render(
        <TreeNode value="foo" label="bar">
          <span>foo</span>
        </TreeNode>,
      );
      const element = getHostHTMLElement();
      const [caretElement] = element.getElementsByClassName('mzn-icon');

      expect((caretElement as HTMLElement).onclick).toBe(null);
    });

    it('onExpand should be pass to caret click handler and receive the value as its argument', () => {
      const onExpand = jest.fn();
      const { getHostHTMLElement } = render(
        <TreeNode value="foo" label="bar" onExpand={onExpand}>
          <span>foo</span>
        </TreeNode>,
      );

      const element = getHostHTMLElement();
      const [caretElement] = element.getElementsByClassName('mzn-icon');

      fireEvent.click(caretElement);

      expect(onExpand).toBeCalledTimes(1);
      expect(onExpand).toBeCalledWith('foo');
    });
  });

  describe('prop: onSelect', () => {
    it('label has no click event by default', () => {
      const { getHostHTMLElement } = render(
        <TreeNode value="foo" label="bar" />,
      );

      const element = getHostHTMLElement();
      const labelElement = element.querySelector('.mzn-tree-node__label');

      expect((labelElement as HTMLElement).onclick).toBe(null);
    });

    it('onSelect should bind to label and receives value as its argument', () => {
      const onSelect = jest.fn();
      const { getHostHTMLElement } = render(
        <TreeNode
          value="foo"
          label="bar"
          selectable
          onSelect={onSelect}
        />,
      );

      const element = getHostHTMLElement();
      const labelElement = element.querySelector('.mzn-tree-node__label');

      fireEvent.click(labelElement!);
      expect(onSelect).toBeCalledTimes(1);
      expect(onSelect).toBeCalledWith('foo');
    });

    it('onSelect should bind to checkbox and receives value as its argument when multiple=true', () => {
      const onSelect = jest.fn();
      const { getHostHTMLElement } = render(
        <TreeNode
          value="foo"
          label="bar"
          multiple
          selectable
          onSelect={onSelect}
        />,
      );
      const element = getHostHTMLElement();
      const checkboxElement = element.querySelector('.mzn-input-check');

      fireEvent.click(checkboxElement!);
      expect(onSelect).toBeCalledTimes(1);
      expect(onSelect).toBeCalledWith('foo');
    });
  });

  describe('prop: selectable', () => {
    it('default to false and label should not have click handler', () => {
      const { getHostHTMLElement } = render(
        <TreeNode
          value="foo"
          label="bar"
        />,
      );
      const element = getHostHTMLElement();
      const labelElement = element.querySelector('.mzn-tree-node__label');

      expect((labelElement as HTMLElement).onclick).toBe(null);
    });

    it('should apply selectable layouts if no children and selectable=true', () => {
      const { getHostHTMLElement } = render(
        <TreeNode
          value="foo"
          label="bar"
          selectable
        />,
      );
      const element = getHostHTMLElement();
      const labelElement = element.querySelector('.mzn-tree-node__label');

      expect(labelElement?.classList.contains('mzn-tree-node__label--selectable'));
    });

    it('should not bind onSelect handler if selectable is falsy', () => {
      const onSelect = jest.fn();
      const { getHostHTMLElement } = render(
        <TreeNode
          value="foo"
          label="bar"
          onSelect={onSelect}
        />,
      );
      const element = getHostHTMLElement();
      const labelElement = element.querySelector('.mzn-tree-node__label');

      expect((labelElement as HTMLElement).onclick).toBe(null);
    });
  });

  describe('prop: selected', () => {
    it('should apply selected layout if selected=true', () => {
      const { getHostHTMLElement } = render(
        <TreeNode
          value="foo"
          label="bar"
          selected
        />,
      );

      const element = getHostHTMLElement();
      const labelElement = element.querySelector('.mzn-tree-node__label');

      expect(labelElement?.classList.contains('mzn-tree-node__label--active'));
    });

    it('should set checked on checkbox in multiple mode if selected=true', () => {
      const testInstance = TestRenderer.create(
        <TreeNode
          value="foo"
          label="bar"
          multiple
          selected
        />,
      );

      const checkboxInstance = testInstance.root.findByType(Checkbox);

      expect(checkboxInstance.props.checked).toBe(true);
    });
  });

  describe('prop: size', () => {
    it('default to "medium"', () => {
      const testInstance = TestRenderer.create(
        <TreeNode
          value="foo"
          label="bar"
        />,
      );

      const typographyInstance = testInstance.root.findByType(Typography);

      expect(typographyInstance.props.variant).toEqual('input2');
    });

    it('should accept ConfigProvider context size changes', () => {
      const testInstance = TestRenderer.create(
        <ConfigProvider size="large">
          <TreeNode
            value="foo"
            label="bar"
          />
        </ConfigProvider>,
      );

      const typographyInstance = testInstance.root.findByType(Typography);

      expect(typographyInstance.props.variant).toEqual('input1');
    });

    const sizes: TreeSize[] = ['small', 'medium', 'large'];
    const textVariants: TypographyVariant[] = ['input3', 'input2', 'input1'];

    sizes.forEach((size, i) => {
      const textVariant = textVariants[i];

      it(`should render label with variant:${textVariant} if size="${size}"`, () => {
        const testInstance = TestRenderer.create(
          <TreeNode
            value="foo"
            label="bar"
            size={size}
          />,
        );

        const typographyInstance = testInstance.root.findByType(Typography);

        expect(typographyInstance.props.variant).toEqual(textVariant);
      });
    });
  });
});
