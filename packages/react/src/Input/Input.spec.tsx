import { PlusIcon } from '@mezzanine-ui/icons';
import { ChangeEvent, useState, KeyboardEvent } from 'react';
import {
  act,
  cleanup,
  render,
  cleanupHook,
  TestRenderer,
  fireEvent,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Icon from '../Icon';
import TextField from '../TextField';
import { FormField } from '../Form';
import Input from '.';
import { TagsType } from '../Form/useInputWithTagsModeValue';

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
        value="foo"
      />,
    );
    const testInstance = testRenderer.root;
    const textFieldInstance = testInstance.findByType(TextField);

    expect(textFieldInstance.props.active).toBe(true);
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

  describe('prop: disabled', () => {
    it('should use disabled from form control if disabled not passed', () => {
      const { getHostHTMLElement } = render(
        <FormField disabled>
          <Input />
          <Input disabled={false} />
        </FormField>,
      );
      const element = getHostHTMLElement();
      const [input1, input2] = element.getElementsByTagName('input');

      expect(input1.disabled).toBeTruthy();
      expect(input2.disabled).toBeFalsy();
    });
  });

  describe('prop: error', () => {
    it('should use severity from form control if error not passed', () => {
      const testInstance = TestRenderer.create(
        <FormField severity="error">
          <Input />
          <Input error={false} />
        </FormField>,
      );
      const [textField1, textField2] = testInstance.root.findAllByType(TextField);

      expect(textField1.props.error).toBe(true);
      expect(textField2.props.error).toBe(false);
    });
  });

  describe('prop: fullWidth', () => {
    it('should use fullWidth from form control if fullWidth not passed', () => {
      const testInstance = TestRenderer.create(
        <FormField fullWidth>
          <Input />
          <Input fullWidth={false} />
        </FormField>,
      );
      const [textField1, textField2] = testInstance.root.findAllByType(TextField);

      expect(textField1.props.fullWidth).toBeTruthy();
      expect(textField2.props.fullWidth).toBeFalsy();
    });
  });

  describe('prop: required', () => {
    it('should use required from form control if required not passed', () => {
      const { getHostHTMLElement } = render(
        <FormField required>
          <Input />
          <Input required={false} />
        </FormField>,
      );
      const element = getHostHTMLElement();
      const [input1, input2] = element.getElementsByTagName('input');

      expect(input1.required).toBeTruthy();
      expect(input2.required).toBeFalsy();
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

describe('<Input tags="default" />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<Input ref={ref} mode="default" />),
  );

  describeForwardRefToHTMLElement(
    HTMLInputElement,
    (ref) => render(<Input inputRef={ref} mode="default" />),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<Input mode="default" className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<Input mode="default" />);
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
        mode="default"
        prefix={prefix}
        size="large"
        suffix={suffix}
        value="foo"
      />,
    );
    const testInstance = testRenderer.root;
    const textFieldInstance = testInstance.findByType(TextField);

    expect(textFieldInstance.props.active).toBe(true);
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
        mode="default"
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
            mode="default"
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
              mode="default"
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
          <Input mode="default" />
          <Input mode="default" disabled={false} />
        </FormField>,
      );
      const element = getHostHTMLElement();
      const [input1, input2] = element.getElementsByTagName('input');

      expect(input1.disabled).toBeTruthy();
      expect(input2.disabled).toBeFalsy();
    });
  });

  describe('prop: error', () => {
    it('should use severity from form control if error not passed', () => {
      const testInstance = TestRenderer.create(
        <FormField severity="error">
          <Input mode="default" />
          <Input mode="default" error={false} />
        </FormField>,
      );
      const [textField1, textField2] = testInstance.root.findAllByType(TextField);

      expect(textField1.props.error).toBe(true);
      expect(textField2.props.error).toBe(false);
    });
  });

  describe('prop: fullWidth', () => {
    it('should use fullWidth from form control if fullWidth not passed', () => {
      const testInstance = TestRenderer.create(
        <FormField fullWidth>
          <Input mode="default" />
          <Input mode="default" fullWidth={false} />
        </FormField>,
      );
      const [textField1, textField2] = testInstance.root.findAllByType(TextField);

      expect(textField1.props.fullWidth).toBeTruthy();
      expect(textField2.props.fullWidth).toBeFalsy();
    });
  });

  describe('prop: onKeyDown', () => {
    it('should called onKeyDown as key down event emit', () => {
      jest.useFakeTimers();

      const onKeyDown = jest.fn<void, [KeyboardEvent<HTMLInputElement>]>(() => {});

      const { getHostHTMLElement } = render(<Input mode="default" inputProps={{ onKeyDown }} />);
      const element = getHostHTMLElement();
      const inputElement = getInputElement(element);

      act(() => {
        fireEvent.keyDown(inputElement, { key: '1', code: 'Digit1', keyCode: 49 });
        fireEvent.keyDown(inputElement, { key: '2', code: 'Digit2', keyCode: 50 });

        jest.runAllTimers();
      });

      expect(onKeyDown).toHaveBeenCalled();
      expect(onKeyDown).toHaveBeenCalledTimes(2);
    });
  });

  describe('prop: required', () => {
    it('should use required from form control if required not passed', () => {
      const { getHostHTMLElement } = render(
        <FormField required>
          <Input mode="default" />
          <Input mode="default" required={false} />
        </FormField>,
      );
      const element = getHostHTMLElement();
      const [input1, input2] = element.getElementsByTagName('input');

      expect(input1.required).toBeTruthy();
      expect(input2.required).toBeFalsy();
    });
  });

  describe('control', () => {
    it('uncontrolled', () => {
      const { getHostHTMLElement } = render(<Input mode="default" defaultValue="foo" />);
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
          mode="default"
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

describe('<Input mode="tags" />', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  const stringifyTags = (element: Element) => JSON.stringify(
    Array
      .from(element.querySelectorAll('.mzn-tag__label'))
      .filter((tag) => tag)
      .map((tag) => tag.textContent) as string[],
  );

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<Input ref={ref} mode="tags" />),
  );

  describeForwardRefToHTMLElement(
    HTMLInputElement,
    (ref) => render(<Input inputRef={ref} mode="tags" />),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<Input className={className} mode="tags" />),
  );

  it('should bind tagsMode class', () => {
    const { getHostHTMLElement } = render(<Input mode="tags" />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-input__tags-mode')).toBeTruthy();
  });

  it('should bind tagsModeInputOnTop class', () => {
    const { getHostHTMLElement } = render(<Input mode="tags" tagsProps={{ inputPosition: 'top' }} />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-input__tags-mode__input-on-top')).toBeTruthy();
  });

  it('props should pass to TextField', () => {
    const prefix = <Icon icon={PlusIcon} />;
    const suffix = <Icon icon={PlusIcon} />;
    const testRenderer = TestRenderer.create(
      <Input
        mode="tags"
        clearable
        disabled
        error
        fullWidth
        prefix={prefix}
        size="large"
        suffix={suffix}
        value="foo"
      />,
    );
    const testInstance = testRenderer.root;
    const textFieldInstance = testInstance.findByType(TextField);

    expect(textFieldInstance.props.active).toBe(true);
    expect(textFieldInstance.props.clearable).toBe(true);
    expect(textFieldInstance.props.disabled).toBe(true);
    expect(textFieldInstance.props.error).toBe(true);
    expect(textFieldInstance.props.fullWidth).toBe(true);
    expect(textFieldInstance.props.prefix).toStrictEqual(prefix);
    expect(textFieldInstance.props.size).toBe('large');
    expect(textFieldInstance.props.suffix).toStrictEqual(suffix);
  });

  describe('prop: initialTagsValue', () => {
    function testClearable(element: HTMLElement) {
      const clearIconElement = element.querySelector('.mzn-text-field__clear-icon');

      fireEvent.click(clearIconElement!);

      testValue(element, '');
    }

    it('should render initial tags value', () => {
      const { getHostHTMLElement } = render(
        <Input
          clearable
          mode="tags"
          defaultValue="default value"
          tagsProps={{
            initialTagsValue: ['1', '2', '3', '4'],
          }}
        />,
      );
      const element = getHostHTMLElement();

      const beforeClear = stringifyTags(element);

      expect(beforeClear).toBe(JSON.stringify(['1', '2', '3', '4']));
      testClearable(element);

      const afterClear = stringifyTags(element);

      expect(afterClear).toBe(JSON.stringify([]));
    });

    it('should render initial tags with trimmed value', () => {
      const { getHostHTMLElement } = render(
        <Input
          clearable
          mode="tags"
          defaultValue="default value"
          inputProps={{
            maxLength: 1,
          }}
          tagsProps={{
            initialTagsValue: [' 1 ', ' 2 ', '  3', '4'],
          }}
        />,
      );
      const element = getHostHTMLElement();

      const beforeClear = stringifyTags(element);

      expect(beforeClear).toBe(JSON.stringify(['1', '2', '3', '4']));
      testClearable(element);

      const afterClear = stringifyTags(element);

      expect(afterClear).toBe(JSON.stringify([]));
    });
  });

  describe('prop: maxTagsLength', () => {
    it('should sliced initial tags when initial-tags-value is overflow', () => {
      const { getHostHTMLElement } = render(
        <Input
          mode="tags"
          defaultValue="default value"
          tagsProps={{
            maxTagsLength: 2,
            initialTagsValue: ['1', '2', '3', '4'],
          }}
        />,
      );

      const element = getHostHTMLElement();

      const currentRenderedTags = stringifyTags(element);

      expect(currentRenderedTags).toBe(JSON.stringify(['1', '2']));
    });

    it('should render at most given maxTagsLength tags', () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(
        <Input
          clearable
          mode="tags"
          tagsProps={{
            maxTagsLength: 2,
          }}
        />,
      );

      const element = getHostHTMLElement();
      const inputElement = getInputElement(element);

      act(() => {
        inputElement.value = '1';
        testValue(element, '1');
        fireEvent.keyDown(inputElement, { key: 'Enter' });

        inputElement.value = '2';
        testValue(element, '2');
        fireEvent.keyDown(inputElement, { key: 'Enter' });

        inputElement.value = '3';
        testValue(element, '3');
        fireEvent.keyDown(inputElement, { key: 'Enter' });

        jest.runAllTimers();
      });

      const currentRenderedTags = stringifyTags(element);

      expect(currentRenderedTags).toBe(JSON.stringify(['1', '2']));
    });
  });

  describe('prop: onTagsChange', () => {
    it('should be called as tags changed', () => {
      jest.useFakeTimers();

      let tags: TagsType = [];

      const onTagsChange = jest.fn<void, [TagsType]>((newTags) => {
        tags = newTags;
      });

      const { getHostHTMLElement } = render(
        <Input
          mode="tags"
          tagsProps={{
            onTagsChange,
          }}
        />,
      );

      const element = getHostHTMLElement();
      const inputElement = getInputElement(element);

      act(() => {
        inputElement.value = '1';
        testValue(element, '1');
        fireEvent.keyDown(inputElement, { key: 'Enter' });

        inputElement.value = '2';
        testValue(element, '2');
        fireEvent.keyDown(inputElement, { key: 'Enter' });

        inputElement.value = '3';
        testValue(element, '3');
        fireEvent.keyDown(inputElement, { key: 'Enter' });

        jest.runAllTimers();
      });

      expect(onTagsChange).toHaveBeenCalledTimes(3);
      expect(JSON.stringify(tags)).toBe(JSON.stringify(['1', '2', '3']));
    });
  });

  it('should be return number[] if input type is number', () => {
    jest.useFakeTimers();

    let tags: TagsType = [];

    const onTagsChange = jest.fn<void, [TagsType]>((newTags) => {
      tags = newTags;
    });

    const { getHostHTMLElement } = render(
      <Input
        clearable
        mode="tags"
        tagsProps={{ onTagsChange }}
      />,
    );

    const element = getHostHTMLElement();
    const inputElement = getInputElement(element);

    inputElement.type = 'number';

    act(() => {
      inputElement.value = '1';
      fireEvent.keyDown(inputElement, { key: 'Enter' });

      inputElement.value = '2';
      fireEvent.keyDown(inputElement, { key: 'Enter' });

      inputElement.value = '3';
      fireEvent.keyDown(inputElement, { key: 'Enter' });

      jest.runAllTimers();
    });

    expect(onTagsChange).toHaveBeenCalledTimes(3);
    expect(JSON.stringify(tags)).toBe(JSON.stringify([1, 2, 3]));
  });

  it('should remove tag as clearable button be clicked', () => {
    jest.useFakeTimers();

    let tags: TagsType = [];

    const onTagsChange = jest.fn<void, [TagsType]>((newTags) => {
      tags = newTags;
    });

    render(
      <Input
        clearable
        mode="tags"
        tagsProps={{
          onTagsChange,
          initialTagsValue: ['1', '2', '3'],
        }}
      />,
    );

    const closeButtonElements = Array.from(document
      .documentElement.getElementsByClassName('mzn-tag__close-icon'));

    act(() => {
      fireEvent.click(closeButtonElements[0]);
      fireEvent.click(closeButtonElements[1]);

      jest.runAllTimers();
    });

    expect(onTagsChange).toHaveBeenCalledTimes(2);
    expect(JSON.stringify(tags)).toBe(JSON.stringify(['3']));
  });
});
