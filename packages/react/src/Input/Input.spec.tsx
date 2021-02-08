import { PlusIcon } from '@mezzanine-ui/icons';
import { ChangeEvent, useState } from 'react';
import {
  cleanup,
  render,
  TestRenderer,
  fireEvent,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Icon from '../Icon';
import TextField from '../TextField';
import Input from '.';

function getInputElement(element: HTMLElement) {
  return element.getElementsByTagName('input')[0];
}

function testValue(element: HTMLElement, value: string) {
  const inputElement = getInputElement(element);

  expect(inputElement.value).toBe(value);
}

describe('<Input />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<Input ref={ref} />),
  );

  describeForwardRefToHTMLElement(
    HTMLInputElement,
    (ref) => render(<Input inputRef={ref} />),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<Input className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<Input />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-input')).toBeTruthy();
  });

  it('props should pass to TextField', () => {
    const prefix = <Icon icon={PlusIcon} />;
    const suffix = <Icon icon={PlusIcon} />;
    const testRenderer = TestRenderer.create(
      <Input
        clearable
        disabled
        error
        fullWidth
        prefix={prefix}
        size="large"
        suffix={suffix}
      />,
    );
    const testInstance = testRenderer.root;
    const textFieldInstance = testInstance.findByType(TextField);

    expect(textFieldInstance.props.clearable).toBe(true);
    expect(textFieldInstance.props.disabled).toBe(true);
    expect(textFieldInstance.props.error).toBe(true);
    expect(textFieldInstance.props.fullWidth).toBe(true);
    expect(textFieldInstance.props.prefix).toStrictEqual(prefix);
    expect(textFieldInstance.props.size).toBe('large');
    expect(textFieldInstance.props.suffix).toStrictEqual(suffix);
  });

  it('props should directly pass to native input element', () => {
    const { getHostHTMLElement } = render(
      <Input
        disabled
        placeholder="placeholder"
        readOnly
      />,
    );
    const element = getHostHTMLElement();
    const inputElement = getInputElement(element);

    expect(inputElement.getAttribute('aria-disabled')).toBe('true');
    expect(inputElement.getAttribute('aria-multiline')).toBe('false');
    expect(inputElement.getAttribute('aria-readonly')).toBe('true');
    expect(inputElement.hasAttribute('disabled')).toBe(true);
    expect(inputElement.getAttribute('placeholder')).toBe('placeholder');
    expect(inputElement.hasAttribute('readonly')).toBe(true);
  });

  describe('prop: clearable', () => {
    function testClearable(element: HTMLElement) {
      const clearIconElement = element.querySelector('.mzn-text-field__clear-icon');

      fireEvent.click(clearIconElement!);

      testValue(element, '');
    }

    describe('should clear value when click the clear icon', () => {
      it('uncontrolled', () => {
        let valueAfterClear = 'not empty';
        const onChange = jest.fn<void, [ChangeEvent<HTMLInputElement>]>((event) => {
          valueAfterClear = event.target.value;
        });
        const { getHostHTMLElement } = render(
          <Input
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
            <Input
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

  describe('control', () => {
    it('uncontrolled', () => {
      const { getHostHTMLElement } = render(<Input defaultValue="foo" />);
      const element = getHostHTMLElement();
      const inputElement = getInputElement(element);

      testValue(element, 'foo');

      inputElement.value = 'bar';
      fireEvent.change(inputElement);
      testValue(element, 'bar');

      inputElement.value = '';
      fireEvent.change(inputElement);
      testValue(element, '');
    });
  });

  it('controlled', () => {
    const ControlledInput = () => {
      const [value, setValue] = useState('foo');

      return (
        <Input
          onChange={(event) => setValue(event.target.value)}
          value={value}
        />
      );
    };
    const { getHostHTMLElement } = render(<ControlledInput />);
    const element = getHostHTMLElement();
    const inputElement = getInputElement(element);

    testValue(element, 'foo');

    inputElement.value = 'bar';
    fireEvent.change(inputElement);
    testValue(element, 'bar');

    inputElement.value = '';
    fireEvent.change(inputElement);
    testValue(element, '');
  });
});
