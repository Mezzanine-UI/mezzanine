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
      const {
        firstElementChild: textareaElement,
      } = element;

      console.log('textareaElement', textareaElement);

      expect(textareaElement?.getAttribute('value')).toBe('Talk about your story');
    });
  });

  describe('prop: error', () => {
    it('should add error style', () => {
      const { getHostHTMLElement } = render(<Textarea error />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-textarea--error')).toBeTruthy();
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

      expect(element.classList.contains('mzn-textarea--medium')).toBeTruthy();
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

  describe('onChange', () => {
    it('should set entered content to text state', () => {
      const { getHostHTMLElement } = render(<Textarea />);
      const element = getHostHTMLElement();

      const textareaElement = element.getElementsByTagName('textarea')[0];

      fireEvent.change(textareaElement, { target: { value: 'I will tell you the story' } });

      expect(textareaElement.getAttribute('value')).toBe('I will tell you the story');
    });
  });

  describe('prop: maxLength', () => {
    it('should enter content whose length is between 0 and max length and display annotation', () => {
      const { getHostHTMLElement } = render(<Textarea maxLength={8} />);
      const element = getHostHTMLElement();
      const {
        firstElementChild: textareaElement,
        lastElementChild: annotationElement,
        childElementCount,
      } = element;

      expect(childElementCount).toBe(2);
      expect(textareaElement?.tagName.toLowerCase()).toBe('textarea');
      expect(annotationElement?.tagName.toLowerCase()).toBe('span');

      expect(textareaElement?.getAttribute('maxlength')).toBe(8);
    });
  });
});
