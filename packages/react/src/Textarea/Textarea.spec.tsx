import {
  cleanup,
  render,
  fireEvent,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Textarea from '.';

describe('<Textarea />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLTextAreaElement,
    (ref) => render(<Textarea ref={ref} />),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<Textarea className={className} />),
  );

  describe('prop: value', () => {
    it('should set value prop as textarea value', () => {
      const { getHostHTMLElement } = render(<Textarea value="Talk about your story" />);
      const element = getHostHTMLElement();
      const textareaElement = element.getElementsByTagName('textarea')[0];

      expect(textareaElement?.value).toBe('Talk about your story');
    });
  });

  describe('prop: error', () => {
    it('should add error style', () => {
      const { getHostHTMLElement } = render(<Textarea error />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-input--error')).toBeTruthy();
      expect(element.classList.contains('textarea')).toBeTruthy();
    });
  });

  describe('prop: disabled', () => {
    it('should has disabled and aria-disabled attributes', () => {
      [false, true].forEach((disabled) => {
        const { getHostHTMLElement } = render(<Textarea disabled={disabled} />);
        const element = getHostHTMLElement();
        const textareaElement = element.getElementsByTagName('textarea')[0];

        expect(textareaElement.hasAttribute('disabled')).toBe(disabled);
        expect(textareaElement.getAttribute('aria-disabled')).toBe(`${disabled}`);
      });
    });
  });

  describe('prop: size', () => {
    it('should render size="medium" by default', () => {
      const { getHostHTMLElement } = render(<Textarea />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-input--medium')).toBeTruthy();
      expect(element.classList.contains('textarea')).toBeTruthy();
    });
  });

  describe('prop: placeholder', () => {
    it('should render the placeholder content', () => {
      const { getHostHTMLElement } = render(<Textarea placeholder="Enter a story" />);
      const element = getHostHTMLElement();
      const textareaElement = element.getElementsByTagName('textarea')[0];

      expect(textareaElement.getAttribute('placeholder')).toBe('Enter a story');
    });
  });

  describe('prop: onChange', () => {
    it('should set entered content to text state', () => {
      const { getHostHTMLElement } = render(<Textarea />);
      const element = getHostHTMLElement();

      const textareaElement = element.getElementsByTagName('textarea')[0];

      fireEvent.change(textareaElement, { target: { value: 'I will tell you the story' } });

      expect(textareaElement.value).toBe('I will tell you the story');
    });

    it('should execute passing onChange function when entering text', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(<Textarea onChange={onChange} />);
      const element = getHostHTMLElement();

      const textareaElement = element.getElementsByTagName('textarea')[0];

      fireEvent.change(textareaElement, { target: { value: 'I will tell you the story' } });

      expect(onChange).toBeCalledTimes(1);
    });
  });

  describe('prop: maxLength', () => {
    it('should restrict content length between 0 and max length and display current value length', () => {
      const { getHostHTMLElement } = render(
        <Textarea
          maxLength={8}
          value="hello"
        />,
      );
      const element = getHostHTMLElement();
      const {
        lastElementChild: countAnnotationElement,
        childElementCount,
      } = element;

      const textareaElement = element.getElementsByTagName('textarea')[0];

      expect(childElementCount).toBe(2);
      expect(textareaElement?.tagName.toLowerCase()).toBe('textarea');
      expect(countAnnotationElement?.tagName.toLowerCase()).toBe('span');
      expect(textareaElement?.maxLength).toBe(8);
      expect(countAnnotationElement?.innerHTML).toBe('5/8');
    });
  });

  describe('prop: clearable', () => {
    it('should render the clear button on the right side when input value exists', () => {
      const { getHostHTMLElement } = render(
        <Textarea
          clearable
          value="This is an apple"
        />,
      );
      const element = getHostHTMLElement();
      const {
        firstElementChild: textareaElement,

        lastElementChild: clearButtonElement,
        childElementCount,
      } = element;

      expect(childElementCount).toBe(2);
      expect(textareaElement?.tagName.toLowerCase()).toBe('textarea');
      expect(clearButtonElement?.tagName.toLowerCase()).toBe('button');
    });

    it('should clear value when click the clear button', () => {
      const { getHostHTMLElement } = render(
        <Textarea
          clearable
          value="This is an apple"
        />,
      );
      const element = getHostHTMLElement();
      const textareaElement = element.getElementsByTagName('textarea')[0];
      const clearButtonElement = element.getElementsByTagName('button')[0];

      fireEvent.click(clearButtonElement);

      expect(textareaElement.value).toBe('');
    });
  });
});
