import { InputSize } from '@mezzanine-ui/core/input';
import { PlusIcon } from '@mezzanine-ui/icons';
import {
  cleanup,
  render,
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

  describe('prop: inputSize', () => {
    it('should render inputSize="medium" by default', () => {
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
      expect(iconStartWrapperElement?.firstElementChild?.tagName.toLowerCase()).toBe('svg');
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
      expect(iconEndWrapperElement?.firstElementChild?.tagName.toLowerCase()).toBe('svg');
      expect(iconEndWrapperElement?.firstElementChild?.getAttribute('data-icon-name')).toBe(PlusIcon.name);
    });
  });

  describe('prop: textStart', () => {
    it('should render the text on the left side', () => {
      const { getHostHTMLElement } = render(<Input textStart="Start" />);
      const element = getHostHTMLElement();
      const {
        firstElementChild: textStartElement,
        lastElementChild: inputElement,
        childElementCount,
      } = element;

      expect(childElementCount).toBe(2);
      expect(textStartElement?.tagName.toLowerCase()).toBe('span');
      expect(inputElement?.tagName.toLowerCase()).toBe('input');
    });
  });

  describe('prop: textEnd', () => {
    it('should render the text on the right side', () => {
      const { getHostHTMLElement } = render(<Input textEnd="End" />);
      const element = getHostHTMLElement();
      const {
        firstElementChild: inputElement,
        lastElementChild: textEndElement,
        childElementCount,
      } = element;

      expect(childElementCount).toBe(2);
      expect(inputElement?.tagName.toLowerCase()).toBe('input');
      expect(textEndElement?.tagName.toLowerCase()).toBe('span');
    });
  });
});
