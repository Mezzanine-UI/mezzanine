import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Selection from './Selection';
import SelectionGroup from './SelectionGroup';

const defaultSelections = [
  {
    name: 'test-group',
    selector: 'radio' as const,
    supportingText: 'Option 1',
    text: '選項 1',
    value: 'option-1',
  },
  {
    name: 'test-group',
    selector: 'radio' as const,
    supportingText: 'Option 2',
    text: '選項 2',
    value: 'option-2',
  },
  {
    name: 'test-group',
    selector: 'radio' as const,
    supportingText: 'Option 3',
    text: '選項 3',
    value: 'option-3',
  },
];

describe('<SelectionGroup />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <SelectionGroup ref={ref} selections={defaultSelections} />,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <SelectionGroup className={className} selections={defaultSelections} />,
    ),
  );

  describe('prop: children', () => {
    it('should render children Selection components', () => {
      const { getHostHTMLElement } = render(
        <SelectionGroup>
          <Selection
            name="test-group"
            selector="radio"
            supportingText="Child 1"
            text="選項 1"
            value="option-1"
          />
          <Selection
            name="test-group"
            selector="radio"
            supportingText="Child 2"
            text="選項 2"
            value="option-2"
          />
        </SelectionGroup>,
      );
      const element = getHostHTMLElement();
      const inputs = element.querySelectorAll('input[type="radio"]');

      expect(inputs.length).toBe(2);
    });

    it('should render single child Selection component', () => {
      const { getHostHTMLElement } = render(
        <SelectionGroup>
          <Selection
            name="test-group"
            selector="radio"
            supportingText="Single child"
            text="選項 1"
            value="option-1"
          />
        </SelectionGroup>,
      );
      const element = getHostHTMLElement();
      const inputs = element.querySelectorAll('input[type="radio"]');

      expect(inputs.length).toBe(1);
    });
  });

  describe('prop: selections', () => {
    it('should render Selection components from selections array', () => {
      const { getHostHTMLElement } = render(
        <SelectionGroup selections={defaultSelections} />,
      );
      const element = getHostHTMLElement();
      const inputs = element.querySelectorAll('input[type="radio"]');

      expect(inputs.length).toBe(3);
    });

    it('should pass all props to rendered Selection components', () => {
      const selections = [
        {
          checked: true,
          disabled: true,
          name: 'test-group',
          selector: 'radio' as const,
          supportingText: 'Test option',
          text: '測試選項',
          value: 'test-value',
        },
      ];
      const { getHostHTMLElement } = render(
        <SelectionGroup selections={selections} />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input[type="radio"]') as HTMLInputElement;

      expect(input.checked).toBe(true);
      expect(input.disabled).toBe(true);
      expect(input.name).toBe('test-group');
      expect(input.value).toBe('test-value');
    });

    it('should render checkbox selections', () => {
      const checkboxSelections = [
        {
          name: 'test-checkbox',
          selector: 'checkbox' as const,
          supportingText: 'Checkbox 1',
          text: '選項 1',
          value: 'option-1',
        },
        {
          name: 'test-checkbox',
          selector: 'checkbox' as const,
          supportingText: 'Checkbox 2',
          text: '選項 2',
          value: 'option-2',
        },
      ];
      const { getHostHTMLElement } = render(
        <SelectionGroup selections={checkboxSelections} />,
      );
      const element = getHostHTMLElement();
      const inputs = element.querySelectorAll('input[type="checkbox"]');

      expect(inputs.length).toBe(2);
    });

    it('should use value as key, fallback to index when value is missing', () => {
      const selectionsWithoutValue = [
        {
          name: 'test-group',
          selector: 'radio' as const,
          supportingText: 'Option 1',
          text: '選項 1',
        },
        {
          name: 'test-group',
          selector: 'radio' as const,
          supportingText: 'Option 2',
          text: '選項 2',
        },
      ];
      const { container } = render(
        <SelectionGroup selections={selectionsWithoutValue} />,
      );
      const selections = container.querySelectorAll('.mzn-selection');

      expect(selections.length).toBe(2);
    });
  });

  describe('mutual exclusivity', () => {
    it('should prioritize children when both children and selections are provided', () => {
      const { getHostHTMLElement } = render(
        <SelectionGroup selections={defaultSelections}>
          <Selection
            name="test-group"
            selector="radio"
            supportingText="Child option"
            text="子選項"
            value="child-option"
          />
        </SelectionGroup>,
      );
      const element = getHostHTMLElement();
      const inputs = element.querySelectorAll('input[type="radio"]');

      // Should only render the child, not the selections
      expect(inputs.length).toBe(1);
      expect((inputs[0] as HTMLInputElement).value).toBe('child-option');
    });
  });

  describe('prop: className', () => {
    it('should apply custom className', () => {
      const { getHostHTMLElement } = render(
        <SelectionGroup className="custom-class" selections={defaultSelections} />,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('custom-class')).toBeTruthy();
      expect(element.classList.contains('mzn-selection-group')).toBeTruthy();
    });
  });

  describe('prop: other div props', () => {
    it('should pass other props to div element', () => {
      const { getHostHTMLElement } = render(
        <SelectionGroup
          data-testid="selection-group"
          id="test-id"
          selections={defaultSelections}
        />,
      );
      const element = getHostHTMLElement();

      expect(element.getAttribute('data-testid')).toBe('selection-group');
      expect(element.getAttribute('id')).toBe('test-id');
    });

    it('should not pass selections prop to div element', () => {
      const { getHostHTMLElement } = render(
        <SelectionGroup selections={defaultSelections} />,
      );
      const element = getHostHTMLElement();

      expect(element.getAttribute('selections')).toBeNull();
    });
  });

  describe('interaction', () => {
    it('should handle radio selection changes', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <SelectionGroup
          selections={[
            {
              name: 'test-radio',
              onChange,
              selector: 'radio' as const,
              supportingText: 'Option 1',
              text: '選項 1',
              value: 'option-1',
            },
            {
              name: 'test-radio',
              onChange,
              selector: 'radio' as const,
              supportingText: 'Option 2',
              text: '選項 2',
              value: 'option-2',
            },
          ]}
        />,
      );
      const element = getHostHTMLElement();
      const inputs = element.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;

      fireEvent.click(inputs[1]);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('should handle checkbox selection changes', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <SelectionGroup
          selections={[
            {
              name: 'test-checkbox',
              onChange,
              selector: 'checkbox' as const,
              supportingText: 'Checkbox 1',
              text: '選項 1',
              value: 'option-1',
            },
            {
              name: 'test-checkbox',
              onChange,
              selector: 'checkbox' as const,
              supportingText: 'Checkbox 2',
              text: '選項 2',
              value: 'option-2',
            },
          ]}
        />,
      );
      const element = getHostHTMLElement();
      const inputs = element.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;

      fireEvent.click(inputs[0]);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(inputs[0].checked).toBe(true);

      fireEvent.click(inputs[1]);
      expect(onChange).toHaveBeenCalledTimes(2);
      expect(inputs[1].checked).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should render empty when neither children nor selections provided', () => {
      const { getHostHTMLElement } = render(
        <SelectionGroup />,
      );
      const element = getHostHTMLElement();

      expect(element.children.length).toBe(0);
    });

    it('should render empty selections array', () => {
      const { getHostHTMLElement } = render(
        <SelectionGroup selections={[]} />,
      );
      const element = getHostHTMLElement();

      expect(element.children.length).toBe(0);
    });

    it('should handle selections with images', () => {
      const selectionsWithImages = [
        {
          image: 'https://example.com/image1.png',
          name: 'test-group',
          selector: 'radio' as const,
          supportingText: 'Option with image',
          text: '選項 1',
          value: 'option-1',
        },
      ];
      const { getHostHTMLElement } = render(
        <SelectionGroup selections={selectionsWithImages} />,
      );
      const element = getHostHTMLElement();
      const image = element.querySelector('img');

      expect(image).not.toBeNull();
      expect(image?.getAttribute('src')).toBe('https://example.com/image1.png');
    });

    it('should handle selections with different directions', () => {
      const selections = [
        {
          direction: 'vertical' as const,
          name: 'test-group',
          selector: 'radio' as const,
          supportingText: 'Vertical option',
          text: '選項 1',
          value: 'option-1',
        },
        {
          direction: 'horizontal' as const,
          name: 'test-group',
          selector: 'radio' as const,
          supportingText: 'Horizontal option',
          text: '選項 2',
          value: 'option-2',
        },
      ];
      const { getHostHTMLElement } = render(
        <SelectionGroup selections={selections} />,
      );
      const element = getHostHTMLElement();
      const verticalSelection = element.querySelector('.mzn-selection--vertical');
      const horizontalSelection = element.querySelector('.mzn-selection--horizontal');

      expect(verticalSelection).not.toBeNull();
      expect(horizontalSelection).not.toBeNull();
    });

    it('should handle selections with empty string image', () => {
      const selectionsWithEmptyImage = [
        {
          image: '',
          name: 'test-group',
          selector: 'radio' as const,
          supportingText: 'Option with empty image',
          text: '選項 1',
          value: 'option-1',
        },
      ];
      const { getHostHTMLElement } = render(
        <SelectionGroup selections={selectionsWithEmptyImage} />,
      );
      const element = getHostHTMLElement();
      const img = element.querySelector('img');
      const icon = element.querySelector('[aria-hidden="true"]');

      expect(img).toBeNull();
      expect(icon).not.toBeNull();
    });

    it('should handle selections with customIcon', () => {
      const { FileIcon } = require('@mezzanine-ui/icons');
      const selectionsWithCustomIcon = [
        {
          customIcon: FileIcon,
          name: 'test-group',
          selector: 'radio' as const,
          supportingText: 'Option with custom icon',
          text: '選項 1',
          value: 'option-1',
        },
      ];
      const { getHostHTMLElement } = render(
        <SelectionGroup selections={selectionsWithCustomIcon} />,
      );
      const element = getHostHTMLElement();
      const icon = element.querySelector('[aria-hidden="true"]');

      expect(icon).not.toBeNull();
    });

    it('should handle selections with onClick', () => {
      const onClick = jest.fn();
      const selectionsWithOnClick = [
        {
          name: 'test-group',
          onClick,
          selector: 'radio' as const,
          supportingText: 'Option with onClick',
          text: '選項 1',
          value: 'option-1',
        },
      ];
      const { getHostHTMLElement } = render(
        <SelectionGroup selections={selectionsWithOnClick} />,
      );
      const element = getHostHTMLElement();
      // Click on a non-interactive part to avoid triggering input
      const textElement = element.querySelector('[id$="-text"]');

      fireEvent.click(textElement || element.querySelector('label')!);

      expect(onClick).toHaveBeenCalled();
    });

    it('should handle selections with other native HTML attributes', () => {
      const selectionsWithAttributes = [
        {
          'data-testid': 'selection-1',
          name: 'test-group',
          selector: 'radio' as const,
          supportingText: 'Option with attributes',
          text: '選項 1',
          value: 'option-1',
        },
      ];
      const { getHostHTMLElement } = render(
        <SelectionGroup selections={selectionsWithAttributes} />,
      );
      const element = getHostHTMLElement();
      const label = element.querySelector('label');

      expect(label?.getAttribute('data-testid')).toBe('selection-1');
    });
  });
});

