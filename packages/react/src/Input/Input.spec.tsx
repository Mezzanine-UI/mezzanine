import { InputSize } from '@mezzanine-ui/core/input';
import { PlusIcon } from '@mezzanine-ui/icons';
import {
  cleanup,
  render,
  fireEvent,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Icon from '../Icon';
import Input from '.';

describe('<Input />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLInputElement,
    (ref) => render(<Input ref={ref} />),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<Input className={className} />),
  );

  describe('prop: error', () => {
    it('should add error style', () => {
      const { getHostHTMLElement } = render(<Input error />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-input--error')).toBeTruthy();
    });
  });

  describe('prop: disabled', () => {
    it('should has disabled and aria-disabled attributes', () => {
      [false, true].forEach((disabled) => {
        const { getHostHTMLElement } = render(<Input disabled={disabled} />);
        const element = getHostHTMLElement();
        const inputElement = element.getElementsByTagName('input')[0];

        expect(inputElement.hasAttribute('disabled')).toBe(disabled);
        expect(inputElement.getAttribute('aria-disabled')).toBe(`${disabled}`);
      });
    });
  });

  describe('prop: size', () => {
    it('should render size="medium" by default', () => {
      const { getHostHTMLElement } = render(<Input />);
      const element = getHostHTMLElement();
      const inputElement = element.getElementsByTagName('input')[0];

      expect(inputElement.classList.contains('mzn-input--medium')).toBeTruthy();
    });

    const sizes: InputSize[] = [
      'small',
      'medium',
      'large',
    ];

    sizes.forEach((size) => {
      it(`should add class if size="${size}"`, () => {
        const { getHostHTMLElement } = render(<Input size={size} />);
        const element = getHostHTMLElement();
        const inputElement = element.getElementsByTagName('input')[0];

        expect(inputElement.classList.contains(`mzn-input--${size}`)).toBeTruthy();
      });
    });
  });

  describe('prop: placeholder', () => {
    it('should render the placeholder content', () => {
      const { getHostHTMLElement } = render(<Input placeholder="Enter Text" />);
      const element = getHostHTMLElement();
      const inputElement = element.getElementsByTagName('input')[0];

      expect(inputElement.getAttribute('placeholder')).toBe('Enter Text');
    });
  });

  describe('prop: inputPrefix', () => {
    it('should render the icon on the left side', () => {
      const { getHostHTMLElement } = render(<Input inputPrefix={<Icon icon={PlusIcon} />} />);
      const element = getHostHTMLElement();
      const {
        firstElementChild: inputPrefixWrapperElement,
        lastElementChild: inputElement,
        childElementCount,
      } = element;

      expect(childElementCount).toBe(2);
      expect(inputPrefixWrapperElement?.firstElementChild?.tagName.toLowerCase()).toBe('i');
      expect(inputPrefixWrapperElement?.firstElementChild?.getAttribute('data-icon-name')).toBe(PlusIcon.name);
      expect(inputElement?.tagName.toLowerCase()).toBe('input');
    });
  });

  describe('prop: inputSuffix', () => {
    it('should render the icon on the right side', () => {
      const { getHostHTMLElement } = render(<Input inputSuffix={<Icon icon={PlusIcon} />} />);
      const element = getHostHTMLElement();
      const {
        firstElementChild: inputElement,
        lastElementChild: inputSuffixWrapperElement,
        childElementCount,
      } = element;

      expect(childElementCount).toBe(2);
      expect(inputElement?.tagName.toLowerCase()).toBe('input');
      expect(inputSuffixWrapperElement?.firstElementChild?.tagName.toLowerCase()).toBe('i');
      expect(inputSuffixWrapperElement?.firstElementChild?.getAttribute('data-icon-name')).toBe(PlusIcon.name);
    });

    it('should render the text on the right side', () => {
      const { getHostHTMLElement } = render(<Input inputSuffix="End" />);
      const element = getHostHTMLElement();
      const {
        firstElementChild: inputElement,
        lastElementChild: inputSuffixWrapperElement,
        childElementCount,
      } = element;

      expect(childElementCount).toBe(2);
      expect(inputElement?.tagName.toLowerCase()).toBe('input');
      expect(inputSuffixWrapperElement?.innerHTML).toBe('End');
    });
  });

  describe('prop: clearable', () => {
    it('should render the clear button on the right side when input value exists', () => {
      const { getHostHTMLElement } = render(
        <Input
          clearable
          value="entered text"
        />,
      );
      const element = getHostHTMLElement();
      const {
        lastElementChild: clearButtonElement,
        childElementCount,
      } = element;

      const inputElement = element.getElementsByTagName('input')[0];

      expect(childElementCount).toBe(2);
      expect(inputElement?.tagName.toLowerCase()).toBe('input');
      expect(clearButtonElement?.tagName.toLowerCase()).toBe('button');
    });

    it('should clear value when click the clear button', () => {
      const { getHostHTMLElement } = render(
        <Input
          clearable
          value="entered text"
        />,
      );
      const element = getHostHTMLElement();
      const inputElement = element.getElementsByTagName('input')[0];
      const clearButtonElement = element.getElementsByTagName('button')[0];

      fireEvent.click(clearButtonElement);

      expect(inputElement.getAttribute('value')).toBe('');
    });
  });

  describe('prop: value', () => {
    it('should set value prop to input value', () => {
      const { getHostHTMLElement } = render(<Input value="Tom Hardy" />);
      const element = getHostHTMLElement();
      const {
        firstElementChild: inputElement,
      } = element;

      expect(inputElement?.getAttribute('value')).toBe('Tom Hardy');
    });
  });

  describe('prop: onChange', () => {
    it('should set entered content to text state', () => {
      const { getHostHTMLElement } = render(<Input />);
      const element = getHostHTMLElement();

      const inputElement = element.getElementsByTagName('input')[0];

      fireEvent.change(inputElement, { target: { value: 'I will tell you the story' } });

      expect(inputElement.value).toBe('I will tell you the story');
    });

    it('should execute passing onChange function when entering text', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(<Input onChange={onChange} />);
      const element = getHostHTMLElement();

      const inputElement = element.getElementsByTagName('input')[0];

      fireEvent.change(inputElement, { target: { value: 'Don Diablo' } });

      expect(onChange).toBeCalledTimes(1);
    });
  });
});
