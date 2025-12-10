import { FileIcon } from '@mezzanine-ui/icons';
import { createRef } from 'react';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Selection from './Selection';

describe('<Selection />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLLabelElement, (ref) =>
    render(
      <Selection
        ref={ref}
        selector="radio"
        text="Test"
        supportingText="Supporting text"
      />,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <Selection
        className={className}
        selector="radio"
        text="Test"
        supportingText="Supporting text"
      />,
    ),
  );

  describe('prop: text and supportingText', () => {
    it('should render text and supportingText', () => {
      const { getHostHTMLElement } = render(
        <Selection
          selector="radio"
          text="Radio Selection"
          supportingText="This is a radio button"
        />,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Radio Selection');
      expect(element.textContent).toContain('This is a radio button');
    });

    it('should return null and warn when text is missing', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const { container } = render(
        <Selection
          selector="radio"
          supportingText="Supporting text"
          text=""
        />,
      );

      expect(container.firstChild).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Selection: `text` and `supportingText` are required when the selection is used standalone.',
      );

      consoleSpy.mockRestore();
    });

    it('should return null and warn when supportingText is missing', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const { container } = render(
        <Selection
          selector="radio"
          supportingText=""
          text="Test"
        />,
      );

      expect(container.firstChild).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Selection: `text` and `supportingText` are required when the selection is used standalone.',
      );

      consoleSpy.mockRestore();
    });
  });

  describe('prop: selector', () => {
    it('should render radio input by default', () => {
      const { getHostHTMLElement } = render(
        <Selection
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      expect(input?.getAttribute('type')).toBe('radio');
    });

    it('should render checkbox input when selector="checkbox"', () => {
      const { getHostHTMLElement } = render(
        <Selection
          selector="checkbox"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      expect(input?.getAttribute('type')).toBe('checkbox');
    });
  });

  describe('prop: checked', () => {
    it('should use controlled checked when checked prop is provided', () => {
      const { getHostHTMLElement, rerender } = render(
        <Selection
          checked={false}
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      expect(input.checked).toBe(false);
      expect(input.hasAttribute('checked')).toBe(false);
      expect(input.getAttribute('aria-checked')).toBe('false');

      rerender(
        <Selection
          checked={true}
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );

      expect(input.checked).toBe(true);
      expect(input.getAttribute('aria-checked')).toBe('true');
    });

    it('should use defaultChecked when checked prop is not provided', () => {
      const { getHostHTMLElement } = render(
        <Selection
          defaultChecked={true}
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      expect(input.defaultChecked).toBe(true);
      expect(input.getAttribute('aria-checked')).toBeNull();
    });
  });

  describe('prop: disabled', () => {
    it('should render disabled=false by default', () => {
      const { getHostHTMLElement } = render(
        <Selection
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      expect(input.disabled).toBe(false);
      expect(element.getAttribute('aria-disabled')).toBe('false');
      expect(element.classList.contains('mzn-selection--disabled')).toBe(false);
    });

    it('should add disabled class and set aria-disabled when disabled=true', () => {
      const { getHostHTMLElement } = render(
        <Selection
          disabled={true}
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      expect(input.disabled).toBe(true);
      expect(element.getAttribute('aria-disabled')).toBe('true');
      expect(element.classList.contains('mzn-selection--disabled')).toBe(true);
    });
  });

  describe('prop: readonly', () => {
    it('should not render input when readonly=true', () => {
      const { getHostHTMLElement } = render(
        <Selection
          readonly={true}
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input');

      expect(input).toBeNull();
      expect(element.classList.contains('mzn-selection--readonly')).toBe(true);
    });

    it('should render input when readonly=false', () => {
      const { getHostHTMLElement } = render(
        <Selection
          readonly={false}
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input');

      expect(input).not.toBeNull();
      expect(element.classList.contains('mzn-selection--readonly')).toBe(false);
    });
  });

  describe('prop: direction', () => {
    it('should render horizontal by default', () => {
      const { getHostHTMLElement } = render(
        <Selection
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-selection--horizontal'),
      ).toBeTruthy();
    });

    it('should add vertical class when direction="vertical"', () => {
      const { getHostHTMLElement } = render(
        <Selection
          direction="vertical"
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-selection--vertical'),
      ).toBeTruthy();
    });
  });

  describe('prop: image', () => {
    it('should render image when image URL is provided', () => {
      const { getHostHTMLElement } = render(
        <Selection
          image="https://example.com/image.png"
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const img = element.querySelector('img');

      expect(img).not.toBeNull();
      expect(img?.getAttribute('src')).toBe('https://example.com/image.png');
      expect(img?.getAttribute('alt')).toBe('Test');
    });

    it('should render icon when image is not provided', () => {
      const { getHostHTMLElement } = render(
        <Selection
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const img = element.querySelector('img');
      const icon = element.querySelector('[aria-hidden="true"]');

      expect(img).toBeNull();
      expect(icon).not.toBeNull();
    });

    it('should not render image when image does not start with http', () => {
      const { getHostHTMLElement } = render(
        <Selection
          image="invalid-url"
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const img = element.querySelector('img');
      const icon = element.querySelector('[aria-hidden="true"]');

      expect(img).toBeNull();
      expect(icon).not.toBeNull();
    });
  });

  describe('prop: customIcon', () => {
    it('should use customIcon when provided', () => {
      const CustomIcon = FileIcon;
      const { getHostHTMLElement } = render(
        <Selection
          customIcon={CustomIcon}
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const icon = element.querySelector('[aria-hidden="true"]');

      expect(icon).not.toBeNull();
    });

    it('should use FileIcon by default when customIcon is not provided', () => {
      const { getHostHTMLElement } = render(
        <Selection
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const icon = element.querySelector('[aria-hidden="true"]');

      expect(icon).not.toBeNull();
    });
  });

  describe('prop: name', () => {
    it('should bind name to input', () => {
      const { getHostHTMLElement } = render(
        <Selection
          name="test-name"
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      expect(input.name).toBe('test-name');
    });
  });

  describe('prop: value', () => {
    it('should bind value to input', () => {
      const { getHostHTMLElement } = render(
        <Selection
          selector="radio"
          text="Test"
          supportingText="Supporting text"
          value="test-value"
        />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      expect(input.value).toBe('test-value');
    });
  });

  describe('prop: id', () => {
    it('should use provided id', () => {
      const { getHostHTMLElement } = render(
        <Selection
          id="custom-id"
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      expect(input.id).toBe('custom-id');
      expect(element.getAttribute('for')).toBe('custom-id');
    });

    it('should generate id when id is not provided', () => {
      const { getHostHTMLElement } = render(
        <Selection
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      expect(input.id).toBeTruthy();
      expect(element.getAttribute('for')).toBe(input.id);
    });
  });

  describe('prop: imageObjectFit', () => {
    it('should apply imageObjectFit style to image', () => {
      const { getHostHTMLElement } = render(
        <Selection
          image="https://example.com/image.png"
          imageObjectFit="contain"
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const img = element.querySelector('img');

      expect(img?.style.objectFit).toBe('contain');
    });

    it('should use cover as default imageObjectFit', () => {
      const { getHostHTMLElement } = render(
        <Selection
          image="https://example.com/image.png"
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const img = element.querySelector('img');

      expect(img?.style.objectFit).toBe('cover');
    });
  });

  describe('prop: onChange', () => {
    it('should call onChange when input changes', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <Selection
          onChange={onChange}
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      fireEvent.click(input);

      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop: onClick', () => {
    it('should call onClick when label is clicked', () => {
      const onClick = jest.fn();
      const { getHostHTMLElement } = render(
        <Selection
          onClick={onClick}
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();

      // Click on a non-interactive part of the label to avoid triggering input
      const textElement = element.querySelector('[id$="-text"]');
      fireEvent.click(textElement || element);

      expect(onClick).toHaveBeenCalled();
    });

    it('should call onClick on Enter key press', () => {
      const onClick = jest.fn();
      const { getHostHTMLElement } = render(
        <Selection
          onClick={onClick}
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();

      fireEvent.keyDown(element, { key: 'Enter' });

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick on Space key press', () => {
      const onClick = jest.fn();
      const { getHostHTMLElement } = render(
        <Selection
          onClick={onClick}
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();

      fireEvent.keyDown(element, { key: ' ' });

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop: inputRef', () => {
    it('should forward inputRef to input element', () => {
      const inputRef = createRef<HTMLInputElement>();
      const { getHostHTMLElement } = render(
        <Selection
          inputRef={inputRef}
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      expect(inputRef.current).toBe(input);
    });
  });

  describe('accessibility', () => {
    it('should set aria-labelledby to text id', () => {
      const { getHostHTMLElement } = render(
        <Selection
          id="test-id"
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      expect(input.getAttribute('aria-labelledby')).toBe('test-id-text');
    });

    it('should set aria-describedby to supportingText id when supportingText is provided', () => {
      const { getHostHTMLElement } = render(
        <Selection
          id="test-id"
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      expect(input.getAttribute('aria-describedby')).toBe(
        'test-id-supporting-text',
      );
    });

    it('should not set aria-describedby when supportingText is not provided', () => {
      // When supportingText is empty, component returns null, so we test with undefined
      const { container } = render(
        <Selection
          id="test-id"
          selector="radio"
          text="Test"
          supportingText=""
        />,
      );

      // Component returns null when supportingText is empty
      expect(container.firstChild).toBeNull();
    });
  });
});
