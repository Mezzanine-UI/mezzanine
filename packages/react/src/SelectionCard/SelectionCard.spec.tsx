import { FileIcon } from '@mezzanine-ui/icons';
import { createRef } from 'react';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import SelectionCard from './SelectionCard';

describe('<SelectionCard />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLLabelElement, (ref) =>
    render(
      <SelectionCard
        ref={ref}
        selector="radio"
        text="Test"
        supportingText="Supporting text"
      />,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <SelectionCard
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
        <SelectionCard
          selector="radio"
          text="Radio Selection"
          supportingText="This is a radio button"
        />,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Radio Selection');
      expect(element.textContent).toContain('This is a radio button');
    });

    it('should return null and error when text is missing', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const { container } = render(
        <SelectionCard
          selector="radio"
          supportingText="Supporting text"
          text=""
        />,
      );

      expect(container.firstChild).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'SelectionCard: `text` (title) is required.',
      );

      consoleErrorSpy.mockRestore();
    });

    it('should warn when supportingText is missing but still render', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const { getHostHTMLElement } = render(
        <SelectionCard
          selector="radio"
          supportingText=""
          text="Test"
        />,
      );

      const element = getHostHTMLElement();
      expect(element).not.toBeNull();
      expect(element.textContent).toContain('Test');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'SelectionCard: `supportingText` is optional but strongly recommended for better accessibility.',
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('prop: selector', () => {
    it('should render radio input by default', () => {
      const { getHostHTMLElement } = render(
        <SelectionCard
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
        <SelectionCard
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
        <SelectionCard
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
        <SelectionCard
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
        <SelectionCard
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

    it('should prioritize checked over defaultChecked when both are provided', () => {
      const { getHostHTMLElement } = render(
        <SelectionCard
          checked={false}
          defaultChecked={true}
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      expect(input.checked).toBe(false);
      expect(input.getAttribute('aria-checked')).toBe('false');
    });
  });

  describe('prop: disabled', () => {
    it('should render disabled=false by default', () => {
      const { getHostHTMLElement } = render(
        <SelectionCard
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      expect(input.disabled).toBe(false);
      expect(element.getAttribute('aria-disabled')).toBeNull();
      expect(element.classList.contains('mzn-selection-card--disabled')).toBe(false);
    });

    it('should add disabled class and set aria-disabled when disabled=true', () => {
      const { getHostHTMLElement } = render(
        <SelectionCard
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
      expect(element.classList.contains('mzn-selection-card--disabled')).toBe(true);
    });

    it('should have disabled input when disabled=true', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <SelectionCard
          disabled={true}
          onChange={onChange}
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      // Input should be disabled (browser will prevent events naturally)
      expect(input.disabled).toBe(true);
    });
  });

  describe('prop: readonly', () => {
    it('should not render input when readonly=true', () => {
      const { getHostHTMLElement } = render(
        <SelectionCard
          readonly={true}
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input');

      expect(input).toBeNull();
      expect(element.classList.contains('mzn-selection-card--readonly')).toBe(true);
    });

    it('should render input when readonly=false', () => {
      const { getHostHTMLElement } = render(
        <SelectionCard
          readonly={false}
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input');

      expect(input).not.toBeNull();
      expect(element.classList.contains('mzn-selection-card--readonly')).toBe(false);
    });

    it('should call onClick when readonly and label is clicked', () => {
      const onClick = jest.fn();
      const { getHostHTMLElement } = render(
        <SelectionCard
          onClick={onClick}
          readonly={true}
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();

      fireEvent.click(element);

      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('prop: direction', () => {
    it('should render horizontal by default', () => {
      const { getHostHTMLElement } = render(
        <SelectionCard
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-selection-card--horizontal'),
      ).toBeTruthy();
    });

    it('should add vertical class when direction="vertical"', () => {
      const { getHostHTMLElement } = render(
        <SelectionCard
          direction="vertical"
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-selection-card--vertical'),
      ).toBeTruthy();
    });
  });

  describe('prop: image', () => {
    it('should render image when image URL is provided', () => {
      const { getHostHTMLElement } = render(
        <SelectionCard
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
        <SelectionCard
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

    it('should render image when image is a non-empty string', () => {
      const { getHostHTMLElement } = render(
        <SelectionCard
          image="invalid-url"
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const img = element.querySelector('img');
      const icon = element.querySelector('[aria-hidden="true"]');

      expect(img).not.toBeNull();
      expect(img?.getAttribute('src')).toBe('invalid-url');
      expect(icon).toBeNull();
    });

    it('should render icon when image is empty string', () => {
      const { getHostHTMLElement } = render(
        <SelectionCard
          image=""
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

    it('should render icon when image is only whitespace', () => {
      const { getHostHTMLElement } = render(
        <SelectionCard
          image="   "
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

    it('should prioritize image over customIcon when both are provided', () => {
      const CustomIcon = FileIcon;
      const { getHostHTMLElement } = render(
        <SelectionCard
          customIcon={CustomIcon}
          image="https://example.com/image.png"
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const img = element.querySelector('img');
      const icon = element.querySelector('[aria-hidden="true"]');

      expect(img).not.toBeNull();
      expect(icon).toBeNull();
    });
  });

  describe('prop: customIcon', () => {
    it('should use customIcon when provided', () => {
      const CustomIcon = FileIcon;
      const { getHostHTMLElement } = render(
        <SelectionCard
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
        <SelectionCard
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
        <SelectionCard
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
        <SelectionCard
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
        <SelectionCard
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
        <SelectionCard
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
        <SelectionCard
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
        <SelectionCard
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
        <SelectionCard
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
        <SelectionCard
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
  });

  describe('prop: inputRef', () => {
    it('should forward inputRef to input element', () => {
      const inputRef = createRef<HTMLInputElement>();
      const { getHostHTMLElement } = render(
        <SelectionCard
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
        <SelectionCard
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
        <SelectionCard
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
      const { getHostHTMLElement } = render(
        <SelectionCard
          id="test-id"
          selector="radio"
          text="Test"
          supportingText=""
        />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      // Component renders normally when supportingText is empty (it's optional)
      expect(element).not.toBeNull();
      expect(input.getAttribute('aria-describedby')).toBeNull();
    });

    it('should set aria-checked only for radio and checkbox when checked is provided', () => {
      const { getHostHTMLElement, rerender } = render(
        <SelectionCard
          checked={true}
          id="test-id"
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();
      const input = element.querySelector('input') as HTMLInputElement;

      expect(input.getAttribute('aria-checked')).toBe('true');

      rerender(
        <SelectionCard
          checked={true}
          id="test-id"
          selector="checkbox"
          text="Test"
          supportingText="Supporting text"
        />,
      );

      expect(input.getAttribute('aria-checked')).toBe('true');
    });
  });

  describe('prop: native HTML attributes', () => {
    it('should pass data attributes to label element', () => {
      const { getHostHTMLElement } = render(
        <SelectionCard
          data-testid="selection-test"
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();

      expect(element.getAttribute('data-testid')).toBe('selection-test');
    });

    it('should pass aria attributes to label element', () => {
      const { getHostHTMLElement } = render(
        <SelectionCard
          aria-label="Custom label"
          selector="radio"
          text="Test"
          supportingText="Supporting text"
        />,
      );
      const element = getHostHTMLElement();

      expect(element.getAttribute('aria-label')).toBe('Custom label');
    });
  });
});
