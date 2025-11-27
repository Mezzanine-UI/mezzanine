import { useContext, useState } from 'react';
import { cleanup, fireEvent, render, renderHook } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { createWrapper } from '../../__test-utils__/render';
import CheckAll from './CheckAll';
import Checkbox from './Checkbox';
import CheckboxGroup, { CheckboxGroupLevelConfig } from './CheckboxGroup';
import { CheckboxGroupContext, CheckboxGroupContextValue } from './CheckboxGroupContext';

const defaultOptions = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3', disabled: true },
  { label: 'Option 4', value: '4' },
];

describe('<CheckboxGroup />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<CheckboxGroup ref={ref} options={defaultOptions} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<CheckboxGroup className={className} options={defaultOptions} />),
  );

  it('should bind role="group" by default', () => {
    const { getHostHTMLElement } = render(
      <CheckboxGroup options={defaultOptions} />,
    );
    const element = getHostHTMLElement();

    expect(element.getAttribute('role')).toBe('group');
  });

  it('should render checkboxes from options', () => {
    const { getHostHTMLElement } = render(
      <CheckboxGroup options={defaultOptions} />,
    );
    const element = getHostHTMLElement();
    const inputs = element.querySelectorAll('input[type="checkbox"]');

    expect(inputs.length).toBe(4);
  });

  it('should render children when provided', () => {
    const { getHostHTMLElement } = render(
      <CheckboxGroup name="test-group">
        <Checkbox label="Child 1" name="test-group" value="1" />
        <Checkbox label="Child 2" name="test-group" value="2" />
      </CheckboxGroup>,
    );
    const element = getHostHTMLElement();
    const inputs = element.querySelectorAll('input[type="checkbox"]');

    expect(inputs.length).toBe(2);
  });

  describe('prop: layout', () => {
    it('should render layout="horizontal" by default', () => {
      const { getHostHTMLElement } = render(
        <CheckboxGroup options={defaultOptions} />,
      );
      const element = getHostHTMLElement();
      const contentWrapper = element.querySelector(
        '.mzn-checkbox-group--content-wrapper',
      );

      expect(
        contentWrapper?.classList.contains('mzn-checkbox-group--horizontal'),
      ).toBeTruthy();
    });

    it('should add layout class', () => {
      const { getHostHTMLElement } = render(
        <CheckboxGroup layout="vertical" options={defaultOptions} />,
      );
      const element = getHostHTMLElement();
      const contentWrapper = element.querySelector(
        '.mzn-checkbox-group--content-wrapper',
      );

      expect(
        contentWrapper?.classList.contains('mzn-checkbox-group--vertical'),
      ).toBeTruthy();
    });
  });

  describe('prop: mode', () => {
    it('should apply mode to all checkboxes', () => {
      const { getHostHTMLElement } = render(
        <CheckboxGroup mode="chip" options={defaultOptions} />,
      );
      const element = getHostHTMLElement();
      const checkboxes = element.querySelectorAll('.mzn-checkbox--chip');

      expect(checkboxes.length).toBe(4);
    });

    it('should add mode class to content wrapper', () => {
      const { getHostHTMLElement } = render(
        <CheckboxGroup mode="chip" options={defaultOptions} />,
      );
      const element = getHostHTMLElement();
      const contentWrapper = element.querySelector(
        '.mzn-checkbox-group--content-wrapper',
      );

      expect(
        contentWrapper?.classList.contains('mzn-checkbox-group--chip'),
      ).toBeTruthy();
    });
  });

  describe('prop: disabled', () => {
    it('should disable all checkboxes when disabled=true', () => {
      const { getHostHTMLElement } = render(
        <CheckboxGroup disabled options={defaultOptions} />,
      );
      const element = getHostHTMLElement();
      const inputs = element.querySelectorAll('input[type="checkbox"]');

      inputs.forEach((input) => {
        expect((input as HTMLInputElement).disabled).toBe(true);
      });
    });
  });

  describe('prop: name', () => {
    it('should set name on all checkboxes', () => {
      const { getHostHTMLElement } = render(
        <CheckboxGroup name="group-name" options={defaultOptions} />,
      );
      const element = getHostHTMLElement();
      const inputs = element.querySelectorAll('input[type="checkbox"]');

      inputs.forEach((input) => {
        expect((input as HTMLInputElement).name).toBe('group-name');
      });
    });
  });

  describe('control', () => {
    it('uncontrolled', () => {
      const onChange = jest.fn();
      const { getHostHTMLElement } = render(
        <CheckboxGroup
          defaultValue={['1']}
          onChange={onChange}
          options={defaultOptions}
        />,
      );
      const element = getHostHTMLElement();
      const inputs = element.querySelectorAll('input[type="checkbox"]');
      const firstInput = inputs[0] as HTMLInputElement;
      const secondInput = inputs[1] as HTMLInputElement;

      expect(firstInput.checked).toBe(true);
      expect(secondInput.checked).toBe(false);

      fireEvent.click(secondInput);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(secondInput.checked).toBe(true);
    });

    it('controlled', () => {
      const TestingComponent = () => {
        const [value, setValue] = useState<string[]>(['1']);

        return (
          <CheckboxGroup
            onChange={(event) => {
              const newValue = event.target.values || [];
              setValue(newValue);
            }}
            options={defaultOptions}
            value={value}
          />
        );
      };

      const { getHostHTMLElement } = render(<TestingComponent />);
      const element = getHostHTMLElement();
      const inputs = element.querySelectorAll('input[type="checkbox"]');
      const firstInput = inputs[0] as HTMLInputElement;
      const secondInput = inputs[1] as HTMLInputElement;

      expect(firstInput.checked).toBe(true);
      expect(secondInput.checked).toBe(false);

      fireEvent.click(secondInput);

      expect(firstInput.checked).toBe(true);
      expect(secondInput.checked).toBe(true);
    });
  });

  describe('prop: level', () => {
    it('should render level control when level.active=true', () => {
      const level: CheckboxGroupLevelConfig = {
        active: true,
        label: 'Select All',
      };
      const { getHostHTMLElement } = render(
        <CheckboxGroup level={level} options={defaultOptions} />,
      );
      const element = getHostHTMLElement();
      const levelCheckbox = element.querySelector(
        '.mzn-checkbox:first-child',
      );

      expect(levelCheckbox).toBeTruthy();
      expect(levelCheckbox?.textContent).toContain('Select All');
    });

    it('should not render level control when level.active=false', () => {
      const level: CheckboxGroupLevelConfig = {
        active: false,
      };
      const { getHostHTMLElement } = render(
        <CheckboxGroup level={level} options={defaultOptions} />,
      );
      const element = getHostHTMLElement();
      const checkboxes = element.querySelectorAll('.mzn-checkbox');

      expect(checkboxes.length).toBe(4);
    });

    it('should not render level control when mode="chip"', () => {
      const level: CheckboxGroupLevelConfig = {
        active: true,
        label: 'Select All',
      };
      const { getHostHTMLElement } = render(
        <CheckboxGroup level={level} mode="chip" options={defaultOptions} />,
      );
      const element = getHostHTMLElement();
      const checkboxes = element.querySelectorAll('.mzn-checkbox');

      // Should only have 4 checkboxes (from options), no level control
      expect(checkboxes.length).toBe(4);
    });

    it('should check all when level control is checked', () => {
      const TestingComponent = () => {
        const [value, setValue] = useState<string[]>([]);
        const level: CheckboxGroupLevelConfig = {
          active: true,
          label: 'Select All',
        };

        return (
          <CheckboxGroup
            level={level}
            onChange={(event) => {
              const newValue = event.target.values || [];
              setValue(newValue);
            }}
            options={defaultOptions}
            value={value}
          />
        );
      };

      const { getHostHTMLElement } = render(<TestingComponent />);
      const element = getHostHTMLElement();
      const levelCheckbox = element.querySelector(
        '.mzn-checkbox:first-child input',
      ) as HTMLInputElement;

      fireEvent.click(levelCheckbox);

      const inputs = element.querySelectorAll('input[type="checkbox"]');
      const enabledInputs = Array.from(inputs).filter(
        (input) => !(input as HTMLInputElement).disabled,
      ) as HTMLInputElement[];

      // All enabled checkboxes should be checked
      enabledInputs.forEach((input) => {
        if (!input.disabled) {
          expect(input.checked).toBe(true);
        }
      });
    });

    it('should show indeterminate state when some options are selected', () => {
      const level: CheckboxGroupLevelConfig = {
        active: true,
        label: 'Select All',
      };
      const { getHostHTMLElement } = render(
        <CheckboxGroup level={level} options={defaultOptions} value={['1']} />,
      );
      const element = getHostHTMLElement();
      const levelCheckbox = element.querySelector(
        '.mzn-checkbox:first-child',
      );

      expect(
        levelCheckbox?.classList.contains('mzn-checkbox--indeterminate'),
      ).toBeTruthy();
    });

    it('should use custom onChange for level control', () => {
      const customOnChange = jest.fn();
      const level: CheckboxGroupLevelConfig = {
        active: true,
        label: 'Select All',
        onChange: customOnChange,
      };
      const { getHostHTMLElement } = render(
        <CheckboxGroup level={level} options={defaultOptions} />,
      );
      const element = getHostHTMLElement();
      const levelCheckbox = element.querySelector(
        '.mzn-checkbox:first-child input',
      ) as HTMLInputElement;

      fireEvent.click(levelCheckbox);

      expect(customOnChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('CheckboxGroupContext', () => {
    it('should provide CheckboxGroupContext', () => {
      const expectProps: CheckboxGroupContextValue = {
        disabled: true,
        name: 'foo',
        value: ['bar'],
        onChange: jest.fn(),
      };

      const { result } = renderHook(() => useContext(CheckboxGroupContext), {
        wrapper: createWrapper(CheckboxGroup, expectProps),
      });

      function testCheckboxGroupContextValue() {
        const { onChange, ...other } = result.current!;

        expect(other).toEqual({
          disabled: expectProps.disabled,
          name: expectProps.name,
          value: expectProps.value,
        });
        expect(typeof onChange).toBe('function');
      }

      testCheckboxGroupContextValue();
    });
  });

  describe('error handling', () => {
    const originalError = console.error;
    const originalWarn = console.warn;

    beforeEach(() => {
      console.error = jest.fn();
      console.warn = jest.fn();
    });

    afterEach(() => {
      console.error = originalError;
      console.warn = originalWarn;
    });

    it('should warn when both children and options are provided', () => {
      const invalidProps: any = {
        options: defaultOptions,
        children: <Checkbox value="1" />,
      };
      render(<CheckboxGroup {...invalidProps} />);

      expect(console.error).toHaveBeenCalled();
    });

    it('should warn when neither children nor options are provided', () => {
      const invalidProps: any = {};
      render(<CheckboxGroup {...invalidProps} />);

      expect(console.error).toHaveBeenCalled();
    });

    it('should warn when level.active=true but no options', () => {
      const level: CheckboxGroupLevelConfig = {
        active: true,
      };
      render(
        <CheckboxGroup level={level}>
          <Checkbox value="1" />
        </CheckboxGroup>,
      );

      expect(console.warn).toHaveBeenCalled();
    });
  });
});

describe('<CheckAll />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <CheckAll ref={ref}>
        <CheckboxGroup options={defaultOptions} />
      </CheckAll>,
    ),
  );

  it('should render check all checkbox', () => {
    const { getHostHTMLElement } = render(
      <CheckAll>
        <CheckboxGroup options={defaultOptions} />
      </CheckAll>,
    );
    const element = getHostHTMLElement();
    const checkboxes = element.querySelectorAll('.mzn-checkbox');

    expect(checkboxes.length).toBe(5); // 1 check all + 4 options
  });

  it('should use custom label', () => {
    const { getHostHTMLElement } = render(
      <CheckAll label="全選">
        <CheckboxGroup options={defaultOptions} />
      </CheckAll>,
    );
    const element = getHostHTMLElement();
    const checkAllCheckbox = element.querySelector('.mzn-checkbox:first-child');

    expect(checkAllCheckbox?.textContent).toContain('全選');
  });

  it('should be checked when all enabled options are selected', () => {
    const { getHostHTMLElement } = render(
      <CheckAll>
        <CheckboxGroup options={defaultOptions} value={['1', '2', '4']} />
      </CheckAll>,
    );
    const element = getHostHTMLElement();
    const checkAllCheckbox = element.querySelector(
      '.mzn-checkbox:first-child input',
    ) as HTMLInputElement;

    expect(checkAllCheckbox.checked).toBe(true);
  });

  it('should be indeterminate when some options are selected', () => {
    const { getHostHTMLElement } = render(
      <CheckAll>
        <CheckboxGroup options={defaultOptions} value={['1']} />
      </CheckAll>,
    );
    const element = getHostHTMLElement();
    const checkAllCheckbox = element.querySelector(
      '.mzn-checkbox:first-child',
    );

    expect(
      checkAllCheckbox?.classList.contains('mzn-checkbox--indeterminate'),
    ).toBeTruthy();
  });

  it('should be unchecked when no options are selected', () => {
    const { getHostHTMLElement } = render(
      <CheckAll>
        <CheckboxGroup options={defaultOptions} value={[]} />
      </CheckAll>,
    );
    const element = getHostHTMLElement();
    const checkAllCheckbox = element.querySelector(
      '.mzn-checkbox:first-child input',
    ) as HTMLInputElement;

    expect(checkAllCheckbox.checked).toBe(false);
  });

  it('should select all when check all is clicked', () => {
    const TestingComponent = () => {
      const [value, setValue] = useState<string[]>([]);

      return (
        <CheckAll>
          <CheckboxGroup
            onChange={(event) => {
              const newValue = event.target.values || [];
              setValue(newValue);
            }}
            options={defaultOptions}
            value={value}
          />
        </CheckAll>
      );
    };

    const { getHostHTMLElement } = render(<TestingComponent />);
    const element = getHostHTMLElement();
    const checkAllCheckbox = element.querySelector(
      '.mzn-checkbox:first-child input',
    ) as HTMLInputElement;

    fireEvent.click(checkAllCheckbox);

    const inputs = element.querySelectorAll('input[type="checkbox"]');
    const enabledInputs = Array.from(inputs)
      .slice(1) // Skip check all checkbox
      .filter((input) => !(input as HTMLInputElement).disabled) as HTMLInputElement[];

    enabledInputs.forEach((input) => {
      expect(input.checked).toBe(true);
    });
  });

  it('should deselect all when check all is clicked again', () => {
    const TestingComponent = () => {
      const [value, setValue] = useState<string[]>(['1', '2', '4']);

      return (
        <CheckAll>
          <CheckboxGroup
            onChange={(event) => {
              const newValue = event.target.values || [];
              setValue(newValue);
            }}
            options={defaultOptions}
            value={value}
          />
        </CheckAll>
      );
    };

    const { getHostHTMLElement } = render(<TestingComponent />);
    const element = getHostHTMLElement();
    const checkAllCheckbox = element.querySelector(
      '.mzn-checkbox:first-child input',
    ) as HTMLInputElement;

    expect(checkAllCheckbox.checked).toBe(true);

    fireEvent.click(checkAllCheckbox);

    const inputs = element.querySelectorAll('input[type="checkbox"]');
    const enabledInputs = Array.from(inputs)
      .slice(1) // Skip check all checkbox
      .filter((input) => !(input as HTMLInputElement).disabled) as HTMLInputElement[];

    enabledInputs.forEach((input) => {
      expect(input.checked).toBe(false);
    });
  });

  it('should preserve disabled options when selecting all', () => {
    const TestingComponent = () => {
      const [value, setValue] = useState<string[]>(['3']); // Option 3 is disabled

      return (
        <CheckAll>
          <CheckboxGroup
            onChange={(event) => {
              const newValue = event.target.values || [];
              setValue(newValue);
            }}
            options={defaultOptions}
            value={value}
          />
        </CheckAll>
      );
    };

    const { getHostHTMLElement } = render(<TestingComponent />);
    const element = getHostHTMLElement();
    const checkAllCheckbox = element.querySelector(
      '.mzn-checkbox:first-child input',
    ) as HTMLInputElement;
    const disabledInput = Array.from(
      element.querySelectorAll('input[type="checkbox"]'),
    ).find((input) => (input as HTMLInputElement).disabled) as HTMLInputElement;

    expect(disabledInput.checked).toBe(true);

    fireEvent.click(checkAllCheckbox);

    // Disabled option should still be checked
    expect(disabledInput.checked).toBe(true);
  });

  it('should be disabled when disabled prop is true', () => {
    const { getHostHTMLElement } = render(
      <CheckAll disabled>
        <CheckboxGroup options={defaultOptions} />
      </CheckAll>,
    );
    const element = getHostHTMLElement();
    const checkAllCheckbox = element.querySelector(
      '.mzn-checkbox:first-child input',
    ) as HTMLInputElement;

    expect(checkAllCheckbox.disabled).toBe(true);
  });

  it('should use default label when label is not provided', () => {
    const { getHostHTMLElement } = render(
      <CheckAll>
        <CheckboxGroup options={defaultOptions} />
      </CheckAll>,
    );
    const element = getHostHTMLElement();
    const checkAllCheckbox = element.querySelector('.mzn-checkbox:first-child');

    expect(checkAllCheckbox?.textContent).toContain('Check All');
  });

  it('should handle empty options array', () => {
    const { getHostHTMLElement } = render(
      <CheckAll>
        <CheckboxGroup options={[]} />
      </CheckAll>,
    );
    const element = getHostHTMLElement();
    const checkAllCheckbox = element.querySelector(
      '.mzn-checkbox:first-child input',
    ) as HTMLInputElement;

    expect(checkAllCheckbox.checked).toBe(false);
  });

  it('should not call onChange when CheckboxGroup has no onChange', () => {
    const { getHostHTMLElement } = render(
      <CheckAll>
        <CheckboxGroup options={defaultOptions} />
      </CheckAll>,
    );
    const element = getHostHTMLElement();
    const checkAllCheckbox = element.querySelector(
      '.mzn-checkbox:first-child input',
    ) as HTMLInputElement;

    // Should not throw error when clicked without onChange
    expect(() => {
      fireEvent.click(checkAllCheckbox);
    }).not.toThrow();
  });

  it('should handle all options disabled', () => {
    const allDisabledOptions = [
      { label: 'Option 1', value: '1', disabled: true },
      { label: 'Option 2', value: '2', disabled: true },
    ];
    const { getHostHTMLElement } = render(
      <CheckAll>
        <CheckboxGroup options={allDisabledOptions} value={['1', '2']} />
      </CheckAll>,
    );
    const element = getHostHTMLElement();
    const checkAllCheckbox = element.querySelector(
      '.mzn-checkbox:first-child input',
    ) as HTMLInputElement;

    // When all options are disabled, check all should be unchecked
    expect(checkAllCheckbox.checked).toBe(false);
  });
});

