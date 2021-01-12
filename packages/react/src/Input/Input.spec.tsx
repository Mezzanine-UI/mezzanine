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

  // describe('prop: numberOnly', () => {
  //   it('should enter number only content', () => {
  //     const { getHostHTMLElement } = render(<Input numberOnly />);
  //     const element = getHostHTMLElement();
  //     const {
  //       firstElementChild: inputElement,
  //     } = element;

  //     if (inputElement) {
  //       fireEvent.change(inputElement, { target: { value: 'a123' } });
  //       const inputValue = inputElement.getAttribute('value');

  //       if (inputValue) {
  //         expect(/^\d*$/.test(inputValue)).toBeTruthy();
  //         expect(inputValue).toBe('123');
  //       }
  //     }
  //   });

  //   it('should enter number only content and be less than max width ', () => {
  //     const { getHostHTMLElement } = render(
  //       <Input
  //         numberOnly
  //         maxLength={6}
  //       />,
  //     );
  //     const element = getHostHTMLElement();
  //     const {
  //       firstElementChild: inputElement,
  //     } = element;

  //     if (inputElement) {
  //       fireEvent.change(inputElement, { target: { value: 'a123bc45d67e8' } });
  //       const inputValue = inputElement.getAttribute('value');

  //       if (inputValue) {
  //         expect(/^\d*$/.test(inputValue)).toBeTruthy();
  //         expect(inputValue).toBe('123456');
  //       }
  //     }
  //   });
  // });

  // describe('prop: alphabetOnly', () => {
  //   it('should enter alphabet only content', () => {
  //     const { getHostHTMLElement } = render(<Input alphabetOnly />);
  //     const element = getHostHTMLElement();
  //     const {
  //       firstElementChild: inputElement,
  //     } = element;

  //     if (inputElement) {
  //       fireEvent.change(inputElement, { target: { value: 'AbC3' } });
  //       const inputValue = inputElement.getAttribute('value');

  //       if (inputValue) {
  //         expect(/[^a-z]/i.test(inputValue)).toBeFalsy();
  //         expect(inputValue).toBe('AbC');
  //       }
  //     }
  //   });

  //   it('should enter alphabet only content and be less than max width ', () => {
  //     const { getHostHTMLElement } = render(
  //       <Input
  //         alphabetOnly
  //         maxLength={6}
  //       />,
  //     );
  //     const element = getHostHTMLElement();
  //     const {
  //       firstElementChild: inputElement,
  //     } = element;

  //     if (inputElement) {
  //       fireEvent.change(inputElement, { target: { value: 'A12bC34D5efG7h8' } });
  //       const inputValue = inputElement.getAttribute('value');

  //       if (inputValue) {
  //         expect(/[^a-z]/i.test(inputValue)).toBeFalsy();
  //         expect(inputValue).toBe('AbCDef');
  //       }
  //     }
  //   });
  // });

  // describe('prop: alphabetNumberOnly', () => {
  //   it('should enter alphabet and number only', () => {
  //     const { getHostHTMLElement } = render(<Input alphabetNumberOnly />);
  //     const element = getHostHTMLElement();
  //     const {
  //       firstElementChild: inputElement,
  //     } = element;

  //     if (inputElement) {
  //       fireEvent.change(inputElement, { target: { value: '*Ab/C3' } });
  //       const inputValue = inputElement.getAttribute('value');

  //       if (inputValue) {
  //         expect(/[^a-zA-Z0-9]/.test(inputValue)).toBeFalsy();
  //         expect(inputValue).toBe('AbC3');
  //       }
  //     }
  //   });

  //   it('should enter alphabet and number only content and be less than max width ', () => {
  //     const { getHostHTMLElement } = render(
  //       <Input
  //         alphabetNumberOnly
  //         maxLength={6}
  //       />,
  //     );
  //     const element = getHostHTMLElement();
  //     const {
  //       firstElementChild: inputElement,
  //     } = element;

  //     if (inputElement) {
  //       fireEvent.change(inputElement, { target: { value: '*A1bC#34%D5+' } });
  //       const inputValue = inputElement.getAttribute('value');

  //       if (inputValue) {
  //         expect(/[^a-zA-Z0-9]/i.test(inputValue)).toBeFalsy();
  //         expect(inputValue).toBe('A1bC34');
  //       }
  //     }
  //   });
  // });

  // describe('prop: maxLength', () => {
  //   it('should enter content whose length is between 0 and max length', () => {
  //     const { getHostHTMLElement } = render(<Input maxLength={8} />);
  //     const element = getHostHTMLElement();
  //     const {
  //       firstElementChild: inputElement,
  //     } = element;

  //     if (inputElement) {
  //       fireEvent.change(inputElement, { target: { value: '0123456789' } });
  //       const inputValue = inputElement.getAttribute('value');

  //       if (inputValue) {
  //         expect(inputValue).toBe('01234567');
  //       }
  //     }
  //   });
  // });
});
