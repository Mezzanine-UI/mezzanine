import { ChangeEvent, useState } from 'react';
import { cleanup, render, TestRenderer, fireEvent } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import TextField from '../TextField';
import { FormField } from '../Form';
import Textarea from '.';
import ConfigProvider from '../Provider';

function getTextareaElement(element: HTMLElement) {
  return element.getElementsByTagName('textarea')[0];
}

function testValue(element: HTMLElement, value: string) {
  const textareaElement = getTextareaElement(element);

  expect(textareaElement.value).toBe(value);
}

describe('<Textarea />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<Textarea ref={ref} />),
  );

  describeForwardRefToHTMLElement(HTMLTextAreaElement, (ref) =>
    render(<Textarea textareaRef={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Textarea className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<Textarea />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-textarea')).toBeTruthy();
  });

  it('props should pass to TextField', () => {
    const testRenderer = TestRenderer.create(
      <Textarea clearable disabled error fullWidth size="large" value="foo" />,
    );
    const testInstance = testRenderer.root;
    const textFieldInstance = testInstance.findByType(TextField);

    expect(textFieldInstance.props.active).toBe(true);
    expect(textFieldInstance.props.clearable).toBe(true);
    expect(textFieldInstance.props.disabled).toBe(true);
    expect(textFieldInstance.props.error).toBe(true);
    expect(textFieldInstance.props.fullWidth).toBe(true);
    expect(textFieldInstance.props.size).toBe('large');
  });

  it('should accept ConfigProvider context changes', () => {
    const testRenderer = TestRenderer.create(
      <ConfigProvider size="small">
        <Textarea />
      </ConfigProvider>,
    );
    const testInstance = testRenderer.root;
    const textFieldInstance = testInstance.findByType(TextField);

    expect(textFieldInstance.props.size).toBe('small');
  });

  it('props should directly pass to native textarea element', () => {
    const { getHostHTMLElement } = render(
      <Textarea disabled placeholder="placeholder" readOnly rows={4} />,
    );
    const element = getHostHTMLElement();
    const textareaElement = getTextareaElement(element);

    expect(textareaElement.getAttribute('aria-disabled')).toBe('true');
    expect(textareaElement.getAttribute('aria-multiline')).toBe('true');
    expect(textareaElement.getAttribute('aria-readonly')).toBe('true');
    expect(textareaElement.hasAttribute('disabled')).toBe(true);
    expect(textareaElement.getAttribute('placeholder')).toBe('placeholder');
    expect(textareaElement.hasAttribute('readonly')).toBe(true);
    expect(textareaElement.getAttribute('rows')).toBe('4');
  });

  describe('prop: clearable', () => {
    function testClearable(element: HTMLElement) {
      const clearIconElement = element.querySelector(
        '.mzn-text-field__clear-icon',
      );

      fireEvent.click(clearIconElement!);

      testValue(element, '');
    }

    describe('should clear value when click the clear icon', () => {
      it('uncontrolled', () => {
        let valueAfterClear = 'not empty';
        const onChange = jest.fn<void, [ChangeEvent<HTMLTextAreaElement>]>(
          (event) => {
            valueAfterClear = event.target.value;
          },
        );
        const { getHostHTMLElement } = render(
          <Textarea
            clearable
            defaultValue="default value"
            onChange={onChange}
          />,
        );
        const element = getHostHTMLElement();

        testClearable(element);
        expect(valueAfterClear).toBe('');
      });

      it('controlled', () => {
        const TestComponent = () => {
          const [value, setValue] = useState('not empty');

          return (
            <Textarea
              clearable
              onChange={(event) => setValue(event.target.value)}
              value={value}
            />
          );
        };

        const { getHostHTMLElement } = render(<TestComponent />);
        const element = getHostHTMLElement();

        testClearable(element);
      });
    });
  });

  describe('prop: disabled', () => {
    it('should use disabled from form control if disabled not passed', () => {
      const { getHostHTMLElement } = render(
        <FormField disabled>
          <Textarea />
          <Textarea disabled={false} />
        </FormField>,
      );
      const element = getHostHTMLElement();
      const [textarea1, textarea2] = element.getElementsByTagName('textarea');

      expect(textarea1.disabled).toBeTruthy();
      expect(textarea2.disabled).toBeFalsy();
    });
  });

  describe('prop: error', () => {
    it('should use severity from form control if error not passed', () => {
      const testInstance = TestRenderer.create(
        <FormField severity="error">
          <Textarea />
          <Textarea error={false} />
        </FormField>,
      );
      const [textField1, textField2] =
        testInstance.root.findAllByType(TextField);

      expect(textField1.props.error).toBe(true);
      expect(textField2.props.error).toBe(false);
    });
  });

  describe('prop: fullWidth', () => {
    it('should use fullWidth from form control if fullWidth not passed', () => {
      const testInstance = TestRenderer.create(
        <FormField fullWidth>
          <Textarea />
          <Textarea fullWidth={false} />
        </FormField>,
      );
      const [textField1, textField2] =
        testInstance.root.findAllByType(TextField);

      expect(textField1.props.fullWidth).toBeTruthy();
      expect(textField2.props.fullWidth).toBeFalsy();
    });
  });

  describe('prop: required', () => {
    it('should use required from form control if required not passed', () => {
      const { getHostHTMLElement } = render(
        <FormField required>
          <Textarea />
          <Textarea required={false} />
        </FormField>,
      );
      const element = getHostHTMLElement();
      const [textarea1, textarea2] = element.getElementsByTagName('textarea');

      expect(textarea1.required).toBeTruthy();
      expect(textarea2.required).toBeFalsy();
    });
  });

  describe('control', () => {
    it('uncontrolled', () => {
      const { getHostHTMLElement } = render(<Textarea defaultValue="foo" />);
      const element = getHostHTMLElement();
      const textareaElement = getTextareaElement(element);

      testValue(element, 'foo');

      textareaElement.value = 'bar';
      fireEvent.change(textareaElement);
      testValue(element, 'bar');

      textareaElement.value = '';
      fireEvent.change(textareaElement);
      testValue(element, '');
    });
  });

  it('controlled', () => {
    const ControlledTextarea = () => {
      const [value, setValue] = useState('foo');

      return (
        <Textarea
          onChange={(event) => setValue(event.target.value)}
          value={value}
        />
      );
    };

    const { getHostHTMLElement } = render(<ControlledTextarea />);
    const element = getHostHTMLElement();
    const textareaElement = getTextareaElement(element);

    testValue(element, 'foo');

    textareaElement.value = 'bar';
    fireEvent.change(textareaElement);
    testValue(element, 'bar');

    textareaElement.value = '';
    fireEvent.change(textareaElement);
    testValue(element, '');
  });

  describe('prop: maxLength', () => {
    it('should apply attribute maxLength to textarea and render count element', () => {
      const { getHostHTMLElement } = render(
        <Textarea maxLength={8} value="hello" />,
      );
      const element = getHostHTMLElement();
      const { lastElementChild: countElement, childElementCount } = element;

      expect(childElementCount).toBe(2);
      expect(countElement?.tagName.toLowerCase()).toBe('span');
      expect(
        countElement?.classList.contains('mzn-textarea__count'),
      ).toBeTruthy();
      expect(countElement?.innerHTML).toBe('5/8');
    });

    it('should bind upper limit class if ', () => {
      const { getHostHTMLElement } = render(
        <Textarea maxLength={5} value="hello" />,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-textarea--upper-limit'),
      ).toBeTruthy();
    });
  });
});
