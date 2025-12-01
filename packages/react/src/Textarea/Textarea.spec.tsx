import { createRef, useState } from 'react';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Textarea from '.';

function getTextareaElement(element: HTMLElement) {
  return element.getElementsByTagName('textarea')[0];
}

describe('<Textarea />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<Textarea ref={ref} />),
  );

  describeForwardRefToHTMLElement(HTMLTextAreaElement, (ref) =>
    render(<Textarea textareaRef={ref} />),
  );

  describeHostElementClassNameAppendable('custom-host', (className) =>
    render(<Textarea className={className} />),
  );

  it('should render host with TextField + Textarea classes and default type', () => {
    const { getHostHTMLElement } = render(<Textarea />);
    const host = getHostHTMLElement();

    expect(host.classList.contains('mzn-text-field')).toBe(true);
    expect(host.classList.contains('mzn-textarea')).toBe(true);
    expect(host.classList.contains('mzn-text-field--warning')).toBe(false);
    expect(host.classList.contains('mzn-text-field--error')).toBe(false);
  });

  it('should render textarea with mzn-textarea__textarea class', () => {
    const { getHostHTMLElement } = render(<Textarea className="foo" />);
    const textarea = getTextareaElement(getHostHTMLElement());

    expect(textarea.classList.contains('mzn-textarea__textarea')).toBe(true);
    expect(textarea.classList.contains('foo')).toBe(false);
  });

  it('should forward textareaRef to native textarea', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea textareaRef={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('should forward native props to textarea', () => {
    const { getHostHTMLElement } = render(
      <Textarea
        aria-label="內容"
        data-testid="textarea"
        defaultValue="foo"
        disabled
        id="foo-id"
        name="foo-name"
        placeholder="hint"
        readOnly
        rows={3}
      />,
    );
    const textarea = getTextareaElement(getHostHTMLElement());

    expect(textarea.getAttribute('aria-label')).toBe('內容');
    expect(textarea.getAttribute('data-testid')).toBe('textarea');
    expect(textarea.value).toBe('foo');
    expect(textarea.disabled).toBe(true);
    expect(textarea.readOnly).toBe(true);
    expect(textarea.id).toBe('foo-id');
    expect(textarea.name).toBe('foo-name');
    expect(textarea.placeholder).toBe('hint');
    expect(textarea.getAttribute('rows')).toBe('3');
  });

  it('default type disabled/readOnly should sync between TextField and textarea', () => {
    const { getHostHTMLElement: getDisabledHost } = render(
      <Textarea disabled />,
    );
    const disabledHost = getDisabledHost();
    const disabledTextarea = getTextareaElement(disabledHost);

    expect(disabledHost.classList.contains('mzn-text-field--disabled')).toBe(
      true,
    );
    expect(disabledTextarea.disabled).toBe(true);

    const { getHostHTMLElement: getReadonlyHost } = render(
      <Textarea readOnly />,
    );
    const readonlyHost = getReadonlyHost();
    const readonlyTextarea = getTextareaElement(readonlyHost);

    expect(readonlyHost.classList.contains('mzn-text-field--readonly')).toBe(
      true,
    );
    expect(readonlyHost.classList.contains('mzn-text-field--disabled')).toBe(
      false,
    );
    expect(readonlyTextarea.readOnly).toBe(true);
    expect(readonlyTextarea.disabled).toBe(false);
  });

  it('warning/error type should apply styles without blocking textarea input', () => {
    const { getHostHTMLElement: getWarningHost } = render(
      <Textarea type="warning" />,
    );
    const warningHost = getWarningHost();

    expect(warningHost.classList.contains('mzn-text-field--warning')).toBe(
      true,
    );
    expect(getTextareaElement(warningHost).disabled).toBe(false);

    const { getHostHTMLElement: getErrorHost } = render(
      <Textarea type="error" />,
    );
    const errorHost = getErrorHost();

    expect(errorHost.classList.contains('mzn-text-field--error')).toBe(true);
    expect(getTextareaElement(errorHost).readOnly).toBe(false);
  });

  it('should merge style and resize while keeping custom width by default', () => {
    const { getHostHTMLElement: getDefaultHost } = render(
      <Textarea style={{ width: '200px' }} />,
    );
    const defaultTextarea = getTextareaElement(getDefaultHost());

    expect(defaultTextarea.style.resize).toBe('none');
    expect(defaultTextarea.style.width).toBe('200px');

    const { getHostHTMLElement: getWithResizeHost } = render(
      <Textarea resize="vertical" style={{ color: 'rgb(0, 0, 0)' }} />,
    );
    const resizeTextarea = getTextareaElement(getWithResizeHost());

    expect(resizeTextarea.style.resize).toBe('vertical');
    expect(resizeTextarea.style.color).toBe('rgb(0, 0, 0)');
  });

  describe('control', () => {
    it('uncontrolled should update value and trigger onChange', () => {
      const handleChange = jest.fn();
      const { getHostHTMLElement } = render(
        <Textarea defaultValue="foo" onChange={handleChange} />,
      );
      const textarea = getTextareaElement(getHostHTMLElement());

      expect(textarea.value).toBe('foo');

      fireEvent.change(textarea, { target: { value: 'bar' } });

      expect(textarea.value).toBe('bar');
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('controlled should follow external state', () => {
      const Controlled = () => {
        const [value, setValue] = useState('foo');

        return (
          <Textarea
            onChange={(event) => setValue(event.target.value)}
            value={value}
          />
        );
      };

      const { getHostHTMLElement } = render(<Controlled />);
      const textarea = getTextareaElement(getHostHTMLElement());

      expect(textarea.value).toBe('foo');

      fireEvent.change(textarea, { target: { value: 'bar' } });
      expect(textarea.value).toBe('bar');

      fireEvent.change(textarea, { target: { value: '' } });
      expect(textarea.value).toBe('');
    });
  });
});
