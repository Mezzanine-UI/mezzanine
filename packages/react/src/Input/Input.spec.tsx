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

      expect(element.classList.contains('mzn-input--medium')).toBeTruthy();
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

        expect(element.classList.contains(`mzn-input--${size}`)).toBeTruthy();
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

  describe('prop: iconStart', () => {
    it('should render the icon on the left side', () => {
      const { getHostHTMLElement } = render(<Input iconStart={<Icon icon={PlusIcon} />} />);
      const element = getHostHTMLElement();
      const {
        firstElementChild: iconStartWrapperElement,
        lastElementChild: inputElement,
        childElementCount,
      } = element;

      expect(childElementCount).toBe(2);
      expect(iconStartWrapperElement?.firstElementChild?.tagName.toLowerCase()).toBe('i');
      expect(iconStartWrapperElement?.firstElementChild?.getAttribute('data-icon-name')).toBe(PlusIcon.name);
      expect(inputElement?.tagName.toLowerCase()).toBe('input');
    });
  });

  describe('prop: iconEnd', () => {
    it('should render the icon on the right side', () => {
      const { getHostHTMLElement } = render(<Input iconEnd={<Icon icon={PlusIcon} />} />);
      const element = getHostHTMLElement();
      const {
        firstElementChild: inputElement,
        lastElementChild: iconEndWrapperElement,
        childElementCount,
      } = element;

      expect(childElementCount).toBe(2);
      expect(inputElement?.tagName.toLowerCase()).toBe('input');
      expect(iconEndWrapperElement?.firstElementChild?.tagName.toLowerCase()).toBe('i');
      expect(iconEndWrapperElement?.firstElementChild?.getAttribute('data-icon-name')).toBe(PlusIcon.name);
    });
  });

  describe('prop: textEnd', () => {
    it('should render the text on the right side', () => {
      const { getHostHTMLElement } = render(<Input textEnd="End" />);
      const element = getHostHTMLElement();
      const {
        firstElementChild: inputElement,
        lastElementChild: textEndWrapperElement,
        childElementCount,
      } = element;

      expect(childElementCount).toBe(2);
      expect(inputElement?.tagName.toLowerCase()).toBe('input');
      expect(textEndWrapperElement?.innerHTML).toBe('End');
    });
  });

  describe('prop: clearable', () => {
    it('should render the clear button on the right side', () => {
      const { getHostHTMLElement } = render(<Input clearable />);
      const element = getHostHTMLElement();
      const {
        firstElementChild: inputElement,
        lastElementChild: clearButtonElement,
        childElementCount,
      } = element;

      expect(childElementCount).toBe(2);
      expect(inputElement?.tagName.toLowerCase()).toBe('input');
      expect(clearButtonElement?.tagName.toLowerCase()).toBe('button');
    });

    it('should clear value when click the clear button', () => {
      const { getHostHTMLElement } = render(<Input clearable />);
      const element = getHostHTMLElement();
      const {
        firstElementChild: inputElement,
        lastElementChild: clearButtonElement,
      } = element;

      if (inputElement && clearButtonElement) {
        fireEvent.change(inputElement, { target: { value: 'entered content' } });

        fireEvent.click(clearButtonElement);

        expect(inputElement.getAttribute('value')).toBe('');
      }
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
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(<Input onChange={onChange} />);
      const element = getHostHTMLElement();

      const inputElement = element.getElementsByTagName('input')[0];

      fireEvent.change(inputElement, { target: { value: 'Don Diablo' } });

      expect(onChange).toBeCalled();
      expect(inputElement.value).toBe('Don Diablo');
    });
  });
});
