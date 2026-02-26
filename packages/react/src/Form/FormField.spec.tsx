import {
  ControlFieldSlotLayout,
  FormFieldCounterColor,
  FormFieldDensity,
  FormFieldLabelSpacing,
  FormFieldLayout,
} from '@mezzanine-ui/core/form';
import { SeverityWithInfo } from '@mezzanine-ui/system/severity';
import { InfoOutlineIcon } from '@mezzanine-ui/icons';
import { useContext } from 'react';
import { cleanup, cleanupHook, render, renderHook } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { FormControlContext, FormField } from '.';
import Input from '../Input';

describe('<FormField />', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <FormField
        ref={ref}
        label="Test"
        name="test"
        layout={FormFieldLayout.VERTICAL}
      />,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <FormField
        className={className}
        label="Test"
        name="test"
        layout={FormFieldLayout.VERTICAL}
      />,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <FormField label="Test" name="test" layout={FormFieldLayout.VERTICAL} />,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-form-field')).toBeTruthy();
  });

  it('should provide formControl', () => {
    const firstProps = {
      disabled: true,
      fullWidth: true,
      required: true,
    };

    const { result, rerender } = renderHook(
      () => useContext(FormControlContext),
      {
        wrapper: ({ children }) => (
          <FormField
            {...firstProps}
            label="Test"
            name="test"
            layout={FormFieldLayout.VERTICAL}
          >
            {children}
          </FormField>
        ),
      },
    );

    expect(result.current).toEqual({
      ...firstProps,
      severity: 'info', // Default severity
    });

    const secondProps = {
      disabled: false,
      fullWidth: false,
      required: false,
      severity: 'error' as SeverityWithInfo,
    };

    rerender();
    // Need to re-render with new wrapper since props changed
    const { result: result2 } = renderHook(
      () => useContext(FormControlContext),
      {
        wrapper: ({ children }) => (
          <FormField
            {...secondProps}
            label="Test"
            name="test"
            layout={FormFieldLayout.VERTICAL}
          >
            {children}
          </FormField>
        ),
      },
    );
    expect(result2.current).toEqual(secondProps);
  });

  describe('prop: disabled', () => {
    function testDisabled(element: HTMLElement, disabled: boolean) {
      expect(element.classList.contains('mzn-form-field--disabled')).toBe(
        disabled,
      );
    }

    it('should render disabled by default', () => {
      const { getHostHTMLElement } = render(
        <FormField
          label="Test"
          name="test"
          layout={FormFieldLayout.VERTICAL}
        />,
      );
      const element = getHostHTMLElement();

      testDisabled(element, false);
    });

    [false, true].forEach((disabled) => {
      const message = disabled
        ? 'should add disabled class if disabled=true'
        : 'should not add disabled class if disabled=false';

      it(message, () => {
        const { getHostHTMLElement } = render(
          <FormField
            disabled={disabled}
            label="Test"
            name="test"
            layout={FormFieldLayout.VERTICAL}
          />,
        );
        const element = getHostHTMLElement();

        testDisabled(element, disabled);
      });
    });
  });

  describe('prop: fullWidth', () => {
    function testFullWidth(element: HTMLElement, fullWidth: boolean) {
      expect(element.classList.contains('mzn-form-field--full-width')).toBe(
        fullWidth,
      );
    }

    it('should render fullWidth by default', () => {
      const { getHostHTMLElement } = render(
        <FormField
          label="Test"
          name="test"
          layout={FormFieldLayout.VERTICAL}
        />,
      );
      const element = getHostHTMLElement();

      testFullWidth(element, false);
    });

    [false, true].forEach((fullWidth) => {
      const message = fullWidth
        ? 'should add fullWidth class if fullWidth=true'
        : 'should not add fullWidth class if fullWidth=false';

      it(message, () => {
        const { getHostHTMLElement } = render(
          <FormField
            fullWidth={fullWidth}
            label="Test"
            name="test"
            layout={FormFieldLayout.VERTICAL}
          />,
        );
        const element = getHostHTMLElement();

        testFullWidth(element, fullWidth);
      });
    });
  });

  describe('prop: layout', () => {
    it('should apply layout class for all FormFieldLayout enum values', () => {
      // This test ensures TypeScript enum and SCSS styles are in sync
      Object.values(FormFieldLayout).forEach((layout) => {
        const { getHostHTMLElement } = render(
          <FormField label="Test Label" name="test-field" layout={layout} />,
        );
        const element = getHostHTMLElement();

        // Check that the layout class is applied
        expect(
          element.classList.contains(`mzn-form-field--${layout}`),
        ).toBeTruthy();
      });
    });

    it('should add horizontal class if layout=HORIZONTAL', () => {
      const { getHostHTMLElement } = render(
        <FormField
          label="Test Label"
          name="test-field"
          layout={FormFieldLayout.HORIZONTAL}
        />,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-form-field--horizontal'),
      ).toBeTruthy();
    });

    it('should add vertical class if layout=VERTICAL', () => {
      const { getHostHTMLElement } = render(
        <FormField
          label="Test Label"
          name="test-field"
          layout={FormFieldLayout.VERTICAL}
        />,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-form-field--vertical'),
      ).toBeTruthy();
    });
  });

  describe('prop: density', () => {
    it('should apply density class for all FormFieldDensity enum values when layout is not vertical', () => {
      // This test ensures TypeScript enum and SCSS styles are in sync
      Object.values(FormFieldDensity).forEach((density) => {
        const { getHostHTMLElement } = render(
          <FormField
            density={density}
            label="Test Label"
            layout={FormFieldLayout.HORIZONTAL}
            name="test-field"
          />,
        );
        const element = getHostHTMLElement();

        // Check that the density class is applied
        expect(
          element.classList.contains(`mzn-form-field--${density}`),
        ).toBeTruthy();
      });
    });

    it('should not apply density class when layout is vertical', () => {
      const { getHostHTMLElement } = render(
        <FormField
          density={FormFieldDensity.BASE}
          label="Test Label"
          layout={FormFieldLayout.VERTICAL}
          name="test-field"
        />,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-form-field--base')).toBeFalsy();
    });

    it('should not add density class if density is omitted and layout is horizontal', () => {
      const { getHostHTMLElement } = render(
        <FormField
          label="Test Label"
          layout={FormFieldLayout.HORIZONTAL}
          name="test-field"
        />,
      );
      const element = getHostHTMLElement();

      Object.values(FormFieldDensity).forEach((density) => {
        expect(
          element.classList.contains(`mzn-form-field--${density}`),
        ).toBeFalsy();
      });
    });
  });

  describe('prop: label', () => {
    it('should render label text', () => {
      const { container } = render(
        <FormField
          label="Test Label"
          name="test"
          layout={FormFieldLayout.VERTICAL}
        />,
      );
      const labelElement = container.querySelector('.mzn-form-field__label');

      expect(labelElement).toBeTruthy();
      expect(labelElement?.textContent).toContain('Test Label');
    });

    it('should bind htmlFor with name prop', () => {
      const { container } = render(
        <FormField
          label="Test Label"
          name="test-field"
          layout={FormFieldLayout.VERTICAL}
        />,
      );
      const labelElement = container.querySelector(
        '.mzn-form-field__label',
      ) as HTMLLabelElement;

      expect(labelElement?.htmlFor).toBe('test-field');
    });
  });

  describe('prop: labelOptionalMarker', () => {
    it('should not render optional marker by default', () => {
      const { container } = render(
        <FormField
          label="Test"
          name="test"
          layout={FormFieldLayout.VERTICAL}
        />,
      );
      const optionalMarkerElement = container.querySelector(
        '.mzn-form-field__label__optional-marker',
      );

      expect(optionalMarkerElement).toBeFalsy();
    });

    it('should render optional marker when provided', () => {
      const { container } = render(
        <FormField
          label="Test"
          labelOptionalMarker="(optional)"
          name="test"
          layout={FormFieldLayout.VERTICAL}
        />,
      );
      const optionalMarkerElement = container.querySelector(
        '.mzn-form-field__label__optional-marker',
      );

      expect(optionalMarkerElement).toBeTruthy();
      expect(optionalMarkerElement?.textContent).toBe('(optional)');
    });
  });

  describe('prop: labelInformationIcon', () => {
    it('should not render information icon by default', () => {
      const { container } = render(
        <FormField
          label="Test"
          name="test"
          layout={FormFieldLayout.VERTICAL}
        />,
      );
      const iconElement = container.querySelector(
        '.mzn-form-field__label__information-icon',
      );

      expect(iconElement).toBeFalsy();
    });

    it('should render information icon when provided', () => {
      const { container } = render(
        <FormField
          label="Test"
          labelInformationIcon={InfoOutlineIcon}
          name="test"
          layout={FormFieldLayout.VERTICAL}
        />,
      );
      const iconElement = container.querySelector(
        '.mzn-form-field__label__information-icon',
      );

      expect(iconElement).toBeTruthy();
      expect(iconElement?.getAttribute('data-icon-name')).toBe(
        InfoOutlineIcon.name,
      );
    });
  });

  describe('prop: labelInformationText', () => {
    it('should render tooltip with information text when icon is provided', () => {
      const { container } = render(
        <FormField
          label="Test"
          labelInformationIcon={InfoOutlineIcon}
          labelInformationText="This is helpful information"
          name="test"
          layout={FormFieldLayout.VERTICAL}
        />,
      );
      const iconElement = container.querySelector(
        '.mzn-form-field__label__information-icon',
      );

      expect(iconElement).toBeTruthy();
    });
  });

  describe('prop: labelSpacing', () => {
    it('should apply default main spacing', () => {
      const { container } = render(
        <FormField
          label="Test"
          name="test"
          layout={FormFieldLayout.HORIZONTAL}
        />,
      );
      const labelAreaElement = container.querySelector(
        '.mzn-form-field__label-area',
      );

      expect(
        labelAreaElement?.classList.contains(
          'mzn-form-field__label-area--main',
        ),
      ).toBeTruthy();
    });

    it('should apply main spacing class', () => {
      const { container } = render(
        <FormField
          label="Test"
          labelSpacing={FormFieldLabelSpacing.MAIN}
          name="test"
          layout={FormFieldLayout.HORIZONTAL}
        />,
      );
      const labelAreaElement = container.querySelector(
        '.mzn-form-field__label-area',
      );

      expect(
        labelAreaElement?.classList.contains(
          'mzn-form-field__label-area--main',
        ),
      ).toBeTruthy();
    });

    it('should apply sub spacing class', () => {
      const { container } = render(
        <FormField
          label="Test"
          labelSpacing={FormFieldLabelSpacing.SUB}
          name="test"
          layout={FormFieldLayout.HORIZONTAL}
        />,
      );
      const labelAreaElement = container.querySelector(
        '.mzn-form-field__label-area',
      );

      expect(
        labelAreaElement?.classList.contains('mzn-form-field__label-area--sub'),
      ).toBeTruthy();
    });

    it('should apply spacing class for all FormFieldLabelSpacing enum values when layout is not vertical', () => {
      Object.values(FormFieldLabelSpacing).forEach((spacing) => {
        const { container } = render(
          <FormField
            label="Test"
            labelSpacing={spacing}
            name="test"
            layout={FormFieldLayout.HORIZONTAL}
          />,
        );
        const labelAreaElement = container.querySelector(
          '.mzn-form-field__label-area',
        );

        expect(
          labelAreaElement?.classList.contains(
            `mzn-form-field__label-area--${spacing}`,
          ),
        ).toBeTruthy();
      });
    });

    it('should not apply spacing class when layout is vertical', () => {
      const { container } = render(
        <FormField
          label="Test"
          labelSpacing={FormFieldLabelSpacing.MAIN}
          name="test"
          layout={FormFieldLayout.VERTICAL}
        />,
      );
      const labelAreaElement = container.querySelector(
        '.mzn-form-field__label-area',
      );

      expect(
        labelAreaElement?.classList.contains(
          'mzn-form-field__label-area--main',
        ),
      ).toBeFalsy();
      expect(
        labelAreaElement?.classList.contains('mzn-form-field__label-area--sub'),
      ).toBeFalsy();
    });
  });

  describe('prop: controlFieldSlotLayout', () => {
    it('should apply default main layout', () => {
      const { container } = render(
        <FormField label="Test" name="test" layout={FormFieldLayout.VERTICAL}>
          <Input />
        </FormField>,
      );
      const controlFieldSlotElement = container.querySelector(
        '.mzn-form-field__control-field-slot--main',
      );

      expect(controlFieldSlotElement).toBeTruthy();
    });

    it('should apply main layout class', () => {
      const { container } = render(
        <FormField
          controlFieldSlotLayout={ControlFieldSlotLayout.MAIN}
          label="Test"
          name="test"
          layout={FormFieldLayout.VERTICAL}
        >
          <Input />
        </FormField>,
      );
      const controlFieldSlotElement = container.querySelector(
        '.mzn-form-field__control-field-slot--main',
      );

      expect(controlFieldSlotElement).toBeTruthy();
    });

    it('should apply sub layout class', () => {
      const { container } = render(
        <FormField
          controlFieldSlotLayout={ControlFieldSlotLayout.SUB}
          label="Test"
          name="test"
          layout={FormFieldLayout.VERTICAL}
        >
          <Input />
        </FormField>,
      );
      const controlFieldSlotElement = container.querySelector(
        '.mzn-form-field__control-field-slot--sub',
      );

      expect(controlFieldSlotElement).toBeTruthy();
    });

    it('should apply layout class for all ControlFieldSlotLayout enum values', () => {
      Object.values(ControlFieldSlotLayout).forEach((layout) => {
        const { container } = render(
          <FormField
            controlFieldSlotLayout={layout}
            label="Test"
            name="test"
            layout={FormFieldLayout.VERTICAL}
          >
            <Input />
          </FormField>,
        );
        const controlFieldSlotElement = container.querySelector(
          `.mzn-form-field__control-field-slot--${layout}`,
        );

        expect(controlFieldSlotElement).toBeTruthy();
      });
    });
  });

  describe('prop: required', () => {
    it('should not render asterisk by default', () => {
      const { container } = render(
        <FormField
          label="Test"
          name="test"
          layout={FormFieldLayout.VERTICAL}
        />,
      );
      const asteriskElement = container.querySelector(
        '.mzn-form-field__label__required-marker',
      );

      expect(asteriskElement).toBeFalsy();
    });

    it('should render asterisk when required=true', () => {
      const { container } = render(
        <FormField
          label="Test"
          name="test"
          required
          layout={FormFieldLayout.VERTICAL}
        />,
      );
      const asteriskElement = container.querySelector(
        '.mzn-form-field__label__required-marker',
      );

      expect(asteriskElement).toBeTruthy();
      expect(asteriskElement?.textContent).toBe('*');
    });
  });

  describe('prop: hintText', () => {
    it('should not render hint text by default', () => {
      const { container } = render(
        <FormField label="Test" name="test" layout={FormFieldLayout.VERTICAL}>
          <Input />
        </FormField>,
      );
      const hintTextElement = container.querySelector(
        '.mzn-form-field__hint-text',
      );

      expect(hintTextElement).toBeFalsy();
    });

    it('should render hint text when provided', () => {
      const { container } = render(
        <FormField
          hintText="This is a hint"
          label="Test"
          name="test"
          layout={FormFieldLayout.VERTICAL}
        >
          <Input />
        </FormField>,
      );
      const hintTextElement = container.querySelector(
        '.mzn-form-field__hint-text',
      );

      expect(hintTextElement).toBeTruthy();
      expect(hintTextElement?.textContent).toContain('This is a hint');
    });
  });

  describe('prop: hintTextIcon', () => {
    it('should render hint text icon when provided', () => {
      const { container } = render(
        <FormField
          hintText="This is a hint"
          hintTextIcon={InfoOutlineIcon}
          label="Test"
          name="test"
          layout={FormFieldLayout.VERTICAL}
        >
          <Input />
        </FormField>,
      );
      const hintTextArea = container.querySelector(
        '.mzn-form-field__hint-text',
      );
      const iconElement = hintTextArea?.querySelector('i');

      expect(iconElement).toBeTruthy();
      expect(iconElement?.getAttribute('data-icon-name')).toBe(
        InfoOutlineIcon.name,
      );
    });
  });

  describe('prop: showHintTextIcon', () => {
    it('should not render any icon when showHintTextIcon=false even with severity', () => {
      const { container } = render(
        <FormField
          hintText="This is a hint"
          label="Test"
          name="test"
          severity="error"
          showHintTextIcon={false}
          layout={FormFieldLayout.VERTICAL}
        >
          <Input />
        </FormField>,
      );
      const hintTextArea = container.querySelector(
        '.mzn-form-field__hint-text',
      );
      const iconElement = hintTextArea?.querySelector('i');

      expect(iconElement).toBeFalsy();
    });

    it('should not render any icon when showHintTextIcon=false even with custom hintTextIcon', () => {
      const { container } = render(
        <FormField
          hintText="This is a hint"
          hintTextIcon={InfoOutlineIcon}
          label="Test"
          name="test"
          showHintTextIcon={false}
          layout={FormFieldLayout.VERTICAL}
        >
          <Input />
        </FormField>,
      );
      const hintTextArea = container.querySelector(
        '.mzn-form-field__hint-text',
      );
      const iconElement = hintTextArea?.querySelector('i');

      expect(iconElement).toBeFalsy();
    });
  });

  describe('prop: severity', () => {
    it('should apply default info severity to hint text', () => {
      const { container } = render(
        <FormField
          hintText="This is a hint"
          label="Test"
          name="test"
          layout={FormFieldLayout.VERTICAL}
        >
          <Input />
        </FormField>,
      );
      const hintTextElement = container.querySelector(
        '.mzn-form-field__hint-text',
      );

      expect(
        hintTextElement?.classList.contains('mzn-form-field__hint-text--info'),
      ).toBeTruthy();
    });

    const severities: SeverityWithInfo[] = [
      'info',
      'warning',
      'error',
      'success',
    ];

    severities.forEach((severity) => {
      it(`should apply ${severity} severity class to hint text`, () => {
        const { container } = render(
          <FormField
            hintText="This is a hint"
            label="Test"
            name="test"
            severity={severity}
            layout={FormFieldLayout.VERTICAL}
          >
            <Input />
          </FormField>,
        );
        const hintTextElement = container.querySelector(
          '.mzn-form-field__hint-text',
        );

        expect(
          hintTextElement?.classList.contains(
            `mzn-form-field__hint-text--${severity}`,
          ),
        ).toBeTruthy();
      });
    });
  });

  describe('prop: counter', () => {
    it('should not render counter by default', () => {
      const { container } = render(
        <FormField label="Test" name="test" layout={FormFieldLayout.VERTICAL}>
          <Input />
        </FormField>,
      );
      const counterElement = container.querySelector(
        '.mzn-form-field__counter',
      );

      expect(counterElement).toBeFalsy();
    });

    it('should render counter when provided', () => {
      const { container } = render(
        <FormField
          counter="10/100"
          label="Test"
          name="test"
          layout={FormFieldLayout.VERTICAL}
        >
          <Input />
        </FormField>,
      );
      const counterElement = container.querySelector(
        '.mzn-form-field__counter',
      );

      expect(counterElement).toBeTruthy();
      expect(counterElement?.textContent).toBe('10/100');
    });
  });

  describe('prop: counterColor', () => {
    it('should apply default info color to counter', () => {
      const { container } = render(
        <FormField
          counter="10/100"
          label="Test"
          name="test"
          layout={FormFieldLayout.VERTICAL}
        >
          <Input />
        </FormField>,
      );
      const counterElement = container.querySelector(
        '.mzn-form-field__counter',
      );

      expect(
        counterElement?.classList.contains('mzn-form-field__counter--info'),
      ).toBeTruthy();
    });

    [
      FormFieldCounterColor.INFO,
      FormFieldCounterColor.WARNING,
      FormFieldCounterColor.ERROR,
    ].forEach((color) => {
      it(`should apply ${color} color class to counter`, () => {
        const { container } = render(
          <FormField
            counter="10/100"
            counterColor={color}
            label="Test"
            name="test"
            layout={FormFieldLayout.VERTICAL}
          >
            <Input />
          </FormField>,
        );
        const counterElement = container.querySelector(
          '.mzn-form-field__counter',
        );

        expect(
          counterElement?.classList.contains(
            `mzn-form-field__counter--${color}`,
          ),
        ).toBeTruthy();
      });
    });
  });

  describe('prop: children', () => {
    it('should render children inside data entry area', () => {
      const { container } = render(
        <FormField label="Test" name="test" layout={FormFieldLayout.VERTICAL}>
          <Input placeholder="test input" />
        </FormField>,
      );
      const dataEntryElement = container.querySelector(
        '.mzn-form-field__data-entry',
      );
      const inputElement = container.querySelector('input');

      expect(dataEntryElement).toBeTruthy();
      expect(inputElement).toBeTruthy();
      expect(inputElement?.placeholder).toBe('test input');
    });

    it('should render multiple children', () => {
      const { container } = render(
        <FormField label="Test" name="test" layout={FormFieldLayout.VERTICAL}>
          <Input placeholder="input 1" />
          <Input placeholder="input 2" />
        </FormField>,
      );
      const inputElements = container.querySelectorAll('input');

      expect(inputElements.length).toBe(2);
      expect(inputElements[0].placeholder).toBe('input 1');
      expect(inputElements[1].placeholder).toBe('input 2');
    });
  });
});
