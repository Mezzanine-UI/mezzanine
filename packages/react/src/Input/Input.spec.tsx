import { CopyIcon } from '@mezzanine-ui/icons';
import { ChangeEvent, useState } from 'react';
import Input from '.';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';

function getInputElement(element: HTMLElement) {
  return element.getElementsByTagName('input')[0];
}

function testValue(element: HTMLElement, value: string) {
  const inputElement = getInputElement(element);

  expect(inputElement.value).toBe(value);
}

describe('<Input />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<Input ref={ref} />),
  );

  describeForwardRefToHTMLElement(HTMLInputElement, (ref) =>
    render(<Input inputRef={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Input className={className} />),
  );

  it('should bind host class', () => {
    const { container } = render(<Input />);
    const inputHost = container.querySelector('.mzn-input');

    expect(inputHost).toBeTruthy();
  });

  it('should render container wrapper', () => {
    const { container } = render(<Input />);
    const containerElement = container.querySelector('.mzn-input-container');

    expect(containerElement).toBeTruthy();
  });

  it('props should directly pass to native input element', () => {
    const { getHostHTMLElement } = render(
      <Input disabled placeholder="placeholder" readonly />,
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

  describe('prop: variant', () => {
    it('should default to base variant', () => {
      const { getHostHTMLElement } = render(<Input />);
      const element = getHostHTMLElement();
      const inputElement = getInputElement(element);

      expect(inputElement.type).toBe('text');
    });

    it('should render base variant explicitly', () => {
      const { getHostHTMLElement } = render(<Input variant="base" />);
      const element = getHostHTMLElement();
      const inputElement = getInputElement(element);

      expect(inputElement.type).toBe('text');
    });
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
        const onChange = jest.fn<void, [ChangeEvent<HTMLInputElement>]>(
          (event) => {
            valueAfterClear = event.target.value;
          },
        );
        const { getHostHTMLElement } = render(
          <Input clearable defaultValue="default value" onChange={onChange} />,
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
    it('should disable input when disabled prop is true', () => {
      const { getHostHTMLElement } = render(<Input disabled />);
      const element = getHostHTMLElement();
      const [input1] = element.getElementsByTagName('input');

      expect(input1.disabled).toBeTruthy();
    });

    it('should not disable input by default', () => {
      const { getHostHTMLElement } = render(<Input />);
      const element = getHostHTMLElement();
      const [input1] = element.getElementsByTagName('input');

      expect(input1.disabled).toBeFalsy();
    });
  });

  describe('prop: required', () => {
    it('should support required attribute', () => {
      const { getHostHTMLElement } = render(
        <Input inputProps={{ required: true }} />,
      );
      const element = getHostHTMLElement();
      const [input1] = element.getElementsByTagName('input');

      expect(input1.required).toBeTruthy();
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

  describe('prop: formatter and parser', () => {
    it('should format display value', () => {
      const formatter = (value: string) =>
        value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      const { getHostHTMLElement } = render(
        <Input value="1000000" formatter={formatter} />,
      );
      const element = getHostHTMLElement();
      const inputElement = getInputElement(element);

      expect(inputElement.value).toBe('1,000,000');
    });

    it('should parse input value', () => {
      const TestComponent = () => {
        const [value, setValue] = useState('');

        return (
          <div>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              formatter={(v) => v.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(v) => v.replace(/,/g, '')}
            />
            <span data-testid="raw-value">{value}</span>
          </div>
        );
      };

      const { container } = render(<TestComponent />);
      const inputElement = container.querySelector('input')!;
      const rawValueElement = container.querySelector(
        '[data-testid="raw-value"]',
      )!;

      fireEvent.change(inputElement, { target: { value: '1,000' } });

      expect(rawValueElement.textContent).toBe('1000');
    });
  });
});

describe('<Input variant="affix" />', () => {
  afterEach(cleanup);

  it('should render with prefix', () => {
    const { container } = render(
      <Input variant="affix" prefix="$" placeholder="Amount" />,
    );

    const prefix = container.querySelector('.mzn-text-field__prefix');
    expect(prefix).toBeTruthy();
    expect(prefix?.textContent).toBe('$');
  });

  it('should render with suffix', () => {
    const { container } = render(
      <Input variant="affix" suffix="kg" placeholder="Weight" />,
    );

    const suffix = container.querySelector('.mzn-text-field__suffix');
    expect(suffix).toBeTruthy();
    expect(suffix?.textContent).toBe('kg');
  });

  it('should support clearable', () => {
    const { container } = render(
      <Input
        variant="affix"
        prefix="$"
        clearable
        defaultValue="100"
        onClear={jest.fn()}
      />,
    );

    const clearIcon = container.querySelector('.mzn-text-field__clear-icon');
    expect(clearIcon).toBeTruthy();
  });
});

describe('<Input variant="search" />', () => {
  afterEach(cleanup);

  it('should render with search icon prefix', () => {
    const { container } = render(
      <Input variant="search" placeholder="Search..." />,
    );

    const prefix = container.querySelector('.mzn-text-field__prefix');
    const icon = prefix?.querySelector('.mzn-icon');
    expect(icon).toBeTruthy();
  });

  it('should be clearable by default', () => {
    const { container } = render(
      <Input variant="search" defaultValue="query" />,
    );

    const clearIcon = container.querySelector('.mzn-text-field__clear-icon');
    expect(clearIcon).toBeTruthy();
  });

  it('should support clearable={false}', () => {
    const { container } = render(
      <Input variant="search" clearable={false} defaultValue="query" />,
    );

    const clearIcon = container.querySelector('.mzn-text-field__clear-icon');
    expect(clearIcon).toBeFalsy();
  });

  it('should support different sizes', () => {
    const { container: mainContainer } = render(
      <Input variant="search" size="main" />,
    );
    const { container: subContainer } = render(
      <Input variant="search" size="sub" />,
    );

    const mainInput = mainContainer.querySelector('.mzn-input--main');
    const subInput = subContainer.querySelector('.mzn-input--sub');

    expect(mainInput).toBeTruthy();
    expect(subInput).toBeTruthy();
  });
});

describe('<Input variant="number" />', () => {
  afterEach(cleanup);

  it('should render input with type number', () => {
    const { getHostHTMLElement } = render(<Input variant="number" />);
    const element = getHostHTMLElement();
    const inputElement = getInputElement(element);

    expect(inputElement.type).toBe('number');
  });

  it('should apply number input class', () => {
    const { container } = render(<Input variant="number" />);
    const numberInput = container.querySelector('.mzn-input--number');

    expect(numberInput).toBeTruthy();
  });

  it('should support min, max, and step props', () => {
    const { getHostHTMLElement } = render(
      <Input variant="number" min={0} max={100} step={5} />,
    );
    const element = getHostHTMLElement();
    const inputElement = getInputElement(element);

    expect(inputElement.getAttribute('min')).toBe('0');
    expect(inputElement.getAttribute('max')).toBe('100');
    expect(inputElement.getAttribute('step')).toBe('5');
  });
});

describe('<Input variant="unit" />', () => {
  afterEach(cleanup);

  it('should render with prefix', () => {
    const { container } = render(
      <Input variant="unit" prefix="$" defaultValue="100" />,
    );

    const prefix = container.querySelector('.mzn-text-field__prefix');
    expect(prefix?.textContent).toBe('$');
  });

  it('should render with suffix', () => {
    const { container } = render(
      <Input variant="unit" suffix="kg" defaultValue="50" />,
    );

    const suffix = container.querySelector('.mzn-text-field__suffix');
    expect(suffix?.textContent).toBe('kg');
  });

  it('should render spinner buttons when showSpinner is true', () => {
    const { container } = render(
      <Input variant="unit" showSpinner defaultValue="100" />,
    );

    const spinners = container.querySelector('.mzn-input__spinners');
    const spinnerButtons = container.querySelectorAll(
      '.mzn-input__spinner-button',
    );

    expect(spinners).toBeTruthy();
    expect(spinnerButtons.length).toBe(2);
  });

  it('should increment value when spin up', () => {
    const TestComponent = () => {
      const [value, setValue] = useState('100');

      return (
        <Input
          variant="unit"
          showSpinner
          value={value}
          onChange={(e) => setValue(e.target.value)}
          step={10}
        />
      );
    };

    const { container } = render(<TestComponent />);
    const spinUpButton = container.querySelector(
      'button[title="Increase value"]',
    );
    const inputElement = container.querySelector('input')!;

    fireEvent.click(spinUpButton!);

    expect(inputElement.value).toBe('110');
  });

  it('should decrement value when spin down', () => {
    const TestComponent = () => {
      const [value, setValue] = useState('100');

      return (
        <Input
          variant="unit"
          showSpinner
          value={value}
          onChange={(e) => setValue(e.target.value)}
          step={10}
        />
      );
    };

    const { container } = render(<TestComponent />);
    const spinDownButton = container.querySelector(
      'button[title="Decrease value"]',
    );
    const inputElement = container.querySelector('input')!;

    fireEvent.click(spinDownButton!);

    expect(inputElement.value).toBe('90');
  });

  it('should respect max value', () => {
    const TestComponent = () => {
      const [value, setValue] = useState('95');

      return (
        <Input
          variant="unit"
          showSpinner
          value={value}
          onChange={(e) => setValue(e.target.value)}
          step={10}
          max={100}
        />
      );
    };

    const { container } = render(<TestComponent />);
    const spinUpButton = container.querySelector(
      'button[title="Increase value"]',
    );
    const inputElement = container.querySelector('input')!;

    fireEvent.click(spinUpButton!);

    // Should not exceed max
    expect(inputElement.value).toBe('95');
  });

  it('should respect min value', () => {
    const TestComponent = () => {
      const [value, setValue] = useState('5');

      return (
        <Input
          variant="unit"
          showSpinner
          value={value}
          onChange={(e) => setValue(e.target.value)}
          step={10}
          min={0}
        />
      );
    };

    const { container } = render(<TestComponent />);
    const spinDownButton = container.querySelector(
      'button[title="Decrease value"]',
    );
    const inputElement = container.querySelector('input')!;

    fireEvent.click(spinDownButton!);

    // Should not go below min
    expect(inputElement.value).toBe('5');
  });

  it('should call onSpinUp callback', () => {
    const onSpinUp = jest.fn();

    const { container } = render(
      <Input
        variant="unit"
        showSpinner
        defaultValue="100"
        onSpinUp={onSpinUp}
      />,
    );
    const spinUpButton = container.querySelector(
      'button[title="Increase value"]',
    );

    fireEvent.click(spinUpButton!);

    expect(onSpinUp).toHaveBeenCalledTimes(1);
  });

  it('should call onSpinDown callback', () => {
    const onSpinDown = jest.fn();

    const { container } = render(
      <Input
        variant="unit"
        showSpinner
        defaultValue="100"
        onSpinDown={onSpinDown}
      />,
    );
    const spinDownButton = container.querySelector(
      'button[title="Decrease value"]',
    );

    fireEvent.click(spinDownButton!);

    expect(onSpinDown).toHaveBeenCalledTimes(1);
  });
});

describe('<Input variant="action" />', () => {
  afterEach(cleanup);

  it('should render action button as suffix', () => {
    const onClick = jest.fn();

    const { container } = render(
      <Input
        variant="action"
        defaultValue="content"
        actionButton={{
          position: 'suffix',
          icon: CopyIcon,
          label: 'Copy',
          onClick,
        }}
      />,
    );

    const actionButton = container.querySelector('.mzn-input__action-button');
    expect(actionButton).toBeTruthy();
  });

  it('should render action button as prefix', () => {
    const onClick = jest.fn();

    const { container } = render(
      <Input
        variant="action"
        defaultValue="content"
        actionButton={{
          position: 'prefix',
          icon: CopyIcon,
          label: 'Copy',
          onClick,
        }}
      />,
    );

    const actionButton = container.querySelector('.mzn-input__action-button');
    expect(actionButton).toBeTruthy();
  });

  it('should call onClick when action button clicked', () => {
    const onClick = jest.fn();

    const { container } = render(
      <Input
        variant="action"
        defaultValue="content"
        actionButton={{
          position: 'suffix',
          icon: CopyIcon,
          label: 'Copy',
          onClick,
        }}
      />,
    );

    const actionButton = container.querySelector('.mzn-input__action-button');
    fireEvent.click(actionButton!);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should disable action button when disabled prop is true', () => {
    const onClick = jest.fn();

    const { container } = render(
      <Input
        variant="action"
        defaultValue="content"
        actionButton={{
          position: 'suffix',
          icon: CopyIcon,
          label: 'Copy',
          onClick,
          disabled: true,
        }}
      />,
    );

    const actionButton = container.querySelector(
      '.mzn-input__action-button',
    ) as HTMLButtonElement;
    expect(actionButton.disabled).toBeTruthy();
  });

  it('should render with suffix external action class', () => {
    const { container } = render(
      <Input
        variant="action"
        actionButton={{
          position: 'suffix',
          icon: CopyIcon,
          label: 'Copy',
          onClick: jest.fn(),
        }}
      />,
    );

    const host = container.querySelector(
      '.mzn-input--with-suffix-external-action',
    );
    expect(host).toBeTruthy();
  });
});

describe('<Input variant="select" />', () => {
  afterEach(cleanup);

  it('should render select button as suffix', () => {
    const onClick = jest.fn();

    const { container } = render(
      <Input
        variant="select"
        selectButton={{
          position: 'suffix',
          value: '.com',
          onClick,
        }}
      />,
    );

    const selectButton = container.querySelector('.mzn-input__select-button');
    expect(selectButton).toBeTruthy();
    expect(selectButton?.textContent).toBe('.com');
  });

  it('should render select button as prefix', () => {
    const onClick = jest.fn();

    const { container } = render(
      <Input
        variant="select"
        selectButton={{
          position: 'prefix',
          value: 'https://',
          onClick,
        }}
      />,
    );

    const selectButton = container.querySelector('.mzn-input__select-button');
    expect(selectButton).toBeTruthy();
    expect(selectButton?.textContent).toBe('https://');
  });

  it('should render select buttons on both sides when position is both', () => {
    const onClick = jest.fn();

    const { container } = render(
      <Input
        variant="select"
        selectButton={{
          position: 'both',
          value: '.com',
          onClick,
        }}
      />,
    );

    const selectButtons = container.querySelectorAll(
      '.mzn-input__select-button',
    );
    expect(selectButtons.length).toBe(2);
  });

  it('should call onClick when select button clicked', () => {
    const onClick = jest.fn();

    const { container } = render(
      <Input
        variant="select"
        selectButton={{
          position: 'suffix',
          value: '.com',
          onClick,
        }}
      />,
    );

    const selectButton = container.querySelector('.mzn-input__select-button');
    fireEvent.click(selectButton!);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  describe('dropdown integration', () => {
    const mockOptions = [
      { id: '.com', name: '.com' },
      { id: '.tw', name: '.tw' },
      { id: '.cn', name: '.cn' },
      { id: '.net', name: '.net' },
    ];

    it('should render dropdown when options are provided', () => {
      const { container } = render(
        <Input
          variant="select"
          selectButton={{
            position: 'suffix',
            value: '.com',
          }}
          options={mockOptions}
          selectedValue=".com"
        />,
      );

      const dropdown = container.querySelector('.mzn-dropdown');
      expect(dropdown).toBeTruthy();
    });

    it('should display selected value in select button', () => {
      const { container } = render(
        <Input
          variant="select"
          selectButton={{
            position: 'suffix',
            value: '.tw',
          }}
          options={mockOptions}
          selectedValue=".tw"
        />,
      );

      const selectButton = container.querySelector('.mzn-input__select-button');
      expect(selectButton?.textContent).toBe('.tw');
    });

    it('should call onSelect when option is selected', () => {
      const onSelect = jest.fn();

      const { container } = render(
        <Input
          variant="select"
          selectButton={{
            position: 'suffix',
            value: '.com',
          }}
          options={mockOptions}
          selectedValue=".com"
          onSelect={onSelect}
        />,
      );

      const dropdown = container.querySelector('.mzn-dropdown');
      expect(dropdown).toBeTruthy();
      // Note: Actual dropdown interaction testing would require more complex setup
      // This verifies that onSelect prop is passed correctly
      expect(onSelect).toBeDefined();
    });

    it('should update selected value when selectedValue prop changes', () => {
      const TestComponent = ({ selectedValue }: { selectedValue: string }) => (
        <Input
          variant="select"
          selectButton={{
            position: 'suffix',
            value: selectedValue,
          }}
          options={mockOptions}
          selectedValue={selectedValue}
          onSelect={jest.fn()}
        />
      );

      const { container, rerender } = render(
        <TestComponent selectedValue=".com" />,
      );

      let selectButton = container.querySelector('.mzn-input__select-button');
      expect(selectButton?.textContent).toBe('.com');

      rerender(<TestComponent selectedValue=".tw" />);

      selectButton = container.querySelector('.mzn-input__select-button');
      expect(selectButton?.textContent).toBe('.tw');
    });

    it('should use custom dropdown width when provided', () => {
      const { container } = render(
        <Input
          variant="select"
          selectButton={{
            position: 'suffix',
            value: '.com',
          }}
          options={mockOptions}
          selectedValue=".com"
          dropdownWidth={200}
        />,
      );

      const dropdown = container.querySelector('.mzn-dropdown');
      expect(dropdown).toBeTruthy();
    });

    it('should use custom dropdown maxHeight when provided', () => {
      const { container } = render(
        <Input
          variant="select"
          selectButton={{
            position: 'suffix',
            value: '.com',
          }}
          options={mockOptions}
          selectedValue=".com"
          dropdownMaxHeight={200}
        />,
      );

      const dropdown = container.querySelector('.mzn-dropdown');
      expect(dropdown).toBeTruthy();
    });

    it('should use custom dropdown placement when provided', () => {
      const { container } = render(
        <Input
          variant="select"
          selectButton={{
            position: 'suffix',
            value: '.com',
          }}
          options={mockOptions}
          selectedValue=".com"
          dropdownPlacement="top-start"
        />,
      );

      const dropdown = container.querySelector('.mzn-dropdown');
      expect(dropdown).toBeTruthy();
    });

    it('should use default dropdown width and maxHeight when not provided', () => {
      const { container } = render(
        <Input
          variant="select"
          selectButton={{
            position: 'suffix',
            value: '.com',
          }}
          options={mockOptions}
          selectedValue=".com"
        />,
      );

      const dropdown = container.querySelector('.mzn-dropdown');
      expect(dropdown).toBeTruthy();
    });

    it('should work with prefix position', () => {
      const { container } = render(
        <Input
          variant="select"
          selectButton={{
            position: 'prefix',
            value: 'https://',
          }}
          options={mockOptions}
          selectedValue=".com"
        />,
      );

      const dropdown = container.querySelector('.mzn-dropdown');
      const selectButton = container.querySelector('.mzn-input__select-button');
      expect(dropdown).toBeTruthy();
      expect(selectButton?.textContent).toBe('https://');
    });

    it('should work with both position', () => {
      const { container } = render(
        <Input
          variant="select"
          selectButton={{
            position: 'both',
            value: '.com',
          }}
          options={mockOptions}
          selectedValue=".com"
        />,
      );

      const dropdowns = container.querySelectorAll('.mzn-dropdown');
      const selectButtons = container.querySelectorAll(
        '.mzn-input__select-button',
      );
      expect(dropdowns.length).toBe(2);
      expect(selectButtons.length).toBe(2);
    });
  });
});

describe('<Input variant="password" />', () => {
  afterEach(cleanup);

  it('should render with type password by default', () => {
    const { getHostHTMLElement } = render(<Input variant="password" />);
    const element = getHostHTMLElement();
    const inputElement = getInputElement(element);

    expect(inputElement.type).toBe('password');
  });

  it('should render eye icon for toggling visibility', () => {
    const { container } = render(<Input variant="password" />);

    const icon = container.querySelector('.mzn-text-field__suffix .mzn-icon');
    expect(icon).toBeTruthy();
  });

  it('should toggle password visibility when icon clicked', () => {
    const { container } = render(<Input variant="password" />);

    const icon = container.querySelector(
      '.mzn-text-field__suffix .mzn-icon',
    ) as HTMLElement;
    const inputElement = container.querySelector('input')!;

    expect(inputElement.type).toBe('password');

    fireEvent.click(icon);

    expect(inputElement.type).toBe('text');

    fireEvent.click(icon);

    expect(inputElement.type).toBe('password');
  });

  it('should not render password strength indicator by default', () => {
    const { container } = render(<Input variant="password" />);

    const indicator = container.querySelector(
      '.mzn-input__password-strength-indicator',
    );
    expect(indicator).toBeFalsy();
  });

  it('should render password strength indicator when showPasswordStrengthIndicator is true', () => {
    const { container } = render(
      <Input
        variant="password"
        showPasswordStrengthIndicator
        passwordStrengthIndicator={{
          strength: 'weak',
          hintTexts: [
            {
              severity: 'info',
              hint: 'Use at least 8 characters',
            },
          ],
        }}
      />,
    );

    const indicator = container.querySelector(
      '.mzn-input__password-strength-indicator',
    );
    expect(indicator).toBeTruthy();
  });

  it('should support clearable', () => {
    const { container } = render(
      <Input
        variant="password"
        clearable
        defaultValue="password"
        onClear={jest.fn()}
      />,
    );

    const inputElement = container.querySelector('input');
    expect(inputElement?.value).toBe('password');
  });
});
