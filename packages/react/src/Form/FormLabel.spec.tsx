import { InfoFilledIcon } from '@mezzanine-ui/icons';
import { FormFieldLayout } from '@mezzanine-ui/core/form';
import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { FormField, FormLabel } from '.';

describe('<FormLabel />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLLabelElement, (ref) =>
    render(<FormLabel labelText="Test" ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<FormLabel className={className} labelText="Test" />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<FormLabel labelText="Hello" />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-form-field__label')).toBeTruthy();
  });

  describe('prop: labelText', () => {
    it('should render label text', () => {
      const { getHostHTMLElement } = render(
        <FormLabel labelText="Test Label" />,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Test Label');
    });

    it('should render label text with colon', () => {
      const { container } = render(<FormLabel labelText="Username" />);
      const colonElement = container.querySelector(
        '.mzn-form-field__label__colon',
      );

      expect(colonElement).toBeTruthy();
      expect(colonElement?.textContent).toBe(':');
    });
  });

  describe('prop: htmlFor', () => {
    it('should bind htmlFor attribute', () => {
      const { getHostHTMLElement } = render(
        <FormLabel htmlFor="test-input" labelText="Test" />,
      );
      const element = getHostHTMLElement() as HTMLLabelElement;

      expect(element.htmlFor).toBe('test-input');
    });
  });

  describe('prop: optionalMarker', () => {
    it('should not render optional marker by default', () => {
      const { container } = render(<FormLabel labelText="Test" />);
      const optionalMarkerElement = container.querySelector(
        '.mzn-form-field__label__optional-marker',
      );

      expect(optionalMarkerElement).toBeFalsy();
    });

    it('should render optional marker when provided', () => {
      const { container } = render(
        <FormLabel labelText="Test" optionalMarker="(optional)" />,
      );
      const optionalMarkerElement = container.querySelector(
        '.mzn-form-field__label__optional-marker',
      );

      expect(optionalMarkerElement).toBeTruthy();
      expect(optionalMarkerElement?.textContent).toBe('(optional)');
    });
  });

  describe('prop: informationIcon', () => {
    it('should not render information icon by default', () => {
      const { container } = render(<FormLabel labelText="Test" />);
      const iconElement = container.querySelector(
        '.mzn-form-field__label__information-icon',
      );

      expect(iconElement).toBeFalsy();
    });

    it('should render information icon when provided', () => {
      const { container } = render(
        <FormLabel informationIcon={InfoFilledIcon} labelText="Test" />,
      );
      const iconElement = container.querySelector(
        '.mzn-form-field__label__information-icon',
      );

      expect(iconElement).toBeTruthy();
      expect(iconElement?.getAttribute('data-icon-name')).toBe(
        InfoFilledIcon.name,
      );
    });
  });

  describe('prop: informationText', () => {
    it('should render tooltip with information text when icon is provided', () => {
      const { container } = render(
        <FormLabel
          informationIcon={InfoFilledIcon}
          informationText="This is helpful information"
          labelText="Test"
        />,
      );
      const iconElement = container.querySelector(
        '.mzn-form-field__label__information-icon',
      );

      expect(iconElement).toBeTruthy();
    });

    it('should not render tooltip if informationIcon is not provided', () => {
      const { container } = render(
        <FormLabel
          informationText="This is helpful information"
          labelText="Test"
        />,
      );
      const iconElement = container.querySelector(
        '.mzn-form-field__label__information-icon',
      );

      expect(iconElement).toBeFalsy();
    });
  });

  describe('context: required', () => {
    [false, true].forEach((required) => {
      const message = required
        ? 'should render asterisk if required=true'
        : 'should not render asterisk if required=false';

      it(message, () => {
        const { container } = render(
          <FormField
            label="Test"
            name="test"
            required={required}
            layout={FormFieldLayout.VERTICAL}
          />,
        );
        const labelElement = container.querySelector('.mzn-form-field__label');
        const asteriskElement = labelElement?.querySelector(
          '.mzn-form-field__label__required-marker',
        );

        if (required) {
          expect(asteriskElement).toBeTruthy();
          expect(asteriskElement?.tagName.toLowerCase()).toBe('span');
          expect(asteriskElement?.textContent).toBe('*');
        } else {
          expect(asteriskElement).toBeFalsy();
        }
      });
    });
  });
});
