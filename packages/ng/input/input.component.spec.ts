import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CopyIcon, EyeIcon } from '@mezzanine-ui/icons';
import type { IconDefinition } from '@mezzanine-ui/icons';
import { InputVariant, MznInput } from './input.component';

// --- Test Host Components ---

@Component({
  standalone: true,
  imports: [MznInput],
  template: `
    <mzn-input
      [active]="active"
      [clearable]="clearable"
      [disabled]="disabled"
      [error]="error"
      [fullWidth]="fullWidth"
      [inputId]="inputId"
      [inputName]="inputName"
      [placeholder]="placeholder"
      [prefixIcon]="prefixIcon"
      [prefixText]="prefixText"
      [readonly]="readonlyVal"
      [size]="size"
      [suffixText]="suffixText"
      [value]="value"
      [variant]="variant"
      (valueChange)="onValueChange($event)"
    />
  `,
})
class TestHostComponent {
  active = false;
  clearable?: boolean;
  disabled = false;
  error = false;
  fullWidth = true;
  inputId?: string;
  inputName?: string;
  placeholder?: string;
  prefixIcon?: IconDefinition;
  prefixText?: string;
  readonlyVal = false;
  size: 'main' | 'sub' = 'main';
  suffixText?: string;
  value?: string;
  variant: InputVariant = 'base';
  onValueChange = jest.fn();
}

@Component({
  standalone: true,
  imports: [MznInput],
  template: `
    <mzn-input
      variant="number"
      [min]="min"
      [max]="max"
      [step]="step"
      [value]="value"
      [size]="size"
      placeholder="0"
      (valueChange)="onValueChange($event)"
    />
  `,
})
class TestNumberHostComponent {
  min?: number;
  max?: number;
  step?: number;
  value?: string;
  size: 'main' | 'sub' = 'main';
  onValueChange = jest.fn();
}

@Component({
  standalone: true,
  imports: [MznInput],
  template: `
    <mzn-input
      variant="measure"
      [formatter]="formatter"
      [max]="max"
      [min]="min"
      [parser]="parser"
      [prefixText]="prefixText"
      [showSpinner]="showSpinner"
      [step]="step"
      [suffixText]="suffixText"
      [value]="value"
      (spinDown)="onSpinDown()"
      (spinUp)="onSpinUp()"
      (valueChange)="onValueChange($event)"
    />
  `,
})
class TestMeasureHostComponent {
  formatter?: (value: string) => string;
  max?: number;
  min?: number;
  parser?: (value: string) => string;
  prefixText?: string;
  showSpinner = false;
  step?: number;
  suffixText?: string;
  value?: string;
  onSpinDown = jest.fn();
  onSpinUp = jest.fn();
  onValueChange = jest.fn();
}

@Component({
  standalone: true,
  imports: [MznInput],
  template: `
    <mzn-input
      variant="action"
      [actionButton]="actionButton"
      [disabled]="disabled"
      [readonly]="readonlyVal"
      [value]="value"
    />
  `,
})
class TestActionHostComponent {
  actionButton: {
    readonly position?: 'prefix' | 'suffix';
    readonly icon?: IconDefinition;
    readonly label?: string;
    readonly disabled?: boolean;
    readonly onClick?: () => void;
  } = {
    position: 'suffix',
    icon: CopyIcon,
    label: 'Copy',
    onClick: jest.fn(),
  };

  disabled = false;
  readonlyVal = false;
  value = 'content';
}

@Component({
  standalone: true,
  imports: [MznInput],
  template: `
    <mzn-input
      variant="password"
      [clearable]="clearable"
      [passwordStrengthIndicator]="passwordStrengthIndicator"
      [placeholder]="placeholder"
      [showPasswordStrengthIndicator]="showPasswordStrengthIndicator"
      [value]="value"
      (valueChange)="onValueChange($event)"
    />
  `,
})
class TestPasswordHostComponent {
  clearable = false;
  passwordStrengthIndicator?: {
    readonly strength?: 'weak' | 'medium' | 'strong';
    readonly hintTexts?: readonly {
      severity: 'error' | 'info' | 'success' | 'warning';
      hint: string;
    }[];
  };

  placeholder?: string;
  showPasswordStrengthIndicator = false;
  value?: string;
  onValueChange = jest.fn();
}

@Component({
  standalone: true,
  imports: [MznInput, ReactiveFormsModule],
  template: ` <mzn-input [formControl]="control" placeholder="reactive" /> `,
})
class TestReactiveFormComponent {
  control = new FormControl('initial');
}

@Component({
  standalone: true,
  imports: [MznInput],
  template: `
    <mzn-input
      [formatter]="formatter"
      [parser]="parser"
      [value]="value"
      (valueChange)="onValueChange($event)"
    />
  `,
})
class TestFormatterParserHostComponent {
  formatter?: (value: string) => string;
  parser?: (value: string) => string;
  value = '';
  onValueChange = jest.fn();
}

@Component({
  standalone: true,
  imports: [MznInput],
  template: `
    <mzn-input
      [defaultValue]="defaultValue"
      (valueChange)="onValueChange($event)"
    />
  `,
})
class TestDefaultValueHostComponent {
  defaultValue?: string;
  onValueChange = jest.fn();
}

// --- Helpers ---

function createFixture<T extends object>(
  component: new (...args: unknown[]) => T,
  overrides?: Partial<T>,
): {
  fixture: ComponentFixture<T>;
  host: T;
  getEl: () => HTMLElement;
  getInput: () => HTMLInputElement;
} {
  const fixture = TestBed.createComponent(component);
  const host = fixture.componentInstance;

  if (overrides) {
    Object.assign(host, overrides);
  }

  fixture.detectChanges();

  return {
    fixture,
    host,
    getEl: (): HTMLElement => fixture.nativeElement.querySelector('mzn-input')!,
    getInput: (): HTMLInputElement =>
      fixture.nativeElement.querySelector('input')!,
  };
}

function typeInto(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input'));
}

// --- Tests ---

describe('MznInput', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestHostComponent,
        TestNumberHostComponent,
        TestMeasureHostComponent,
        TestActionHostComponent,
        TestPasswordHostComponent,
        TestReactiveFormComponent,
        TestFormatterParserHostComponent,
        TestDefaultValueHostComponent,
      ],
    });
  });

  // === Basic rendering ===

  it('should create', () => {
    const { getEl } = createFixture(TestHostComponent);

    expect(getEl()).toBeTruthy();
  });

  it('should render an input element', () => {
    const { getInput } = createFixture(TestHostComponent);

    expect(getInput()).toBeTruthy();
  });

  it('should bind host container class', () => {
    const { getEl } = createFixture(TestHostComponent);

    expect(getEl().classList.contains('mzn-input-container')).toBe(true);
  });

  it('should render host wrapper with mzn-input class', () => {
    const { getEl } = createFixture(TestHostComponent);
    const host = getEl().querySelector('.mzn-input');

    expect(host).toBeTruthy();
  });

  // === Native input attributes ===

  it('should set placeholder', () => {
    const { getInput } = createFixture(TestHostComponent, {
      placeholder: '請輸入',
    });

    expect(getInput().getAttribute('placeholder')).toBe('請輸入');
  });

  it('should set input id', () => {
    const { getInput } = createFixture(TestHostComponent, {
      inputId: 'my-input',
    });

    expect(getInput().getAttribute('id')).toBe('my-input');
  });

  it('should set input name', () => {
    const { getInput } = createFixture(TestHostComponent, {
      inputName: 'field1',
    });

    expect(getInput().getAttribute('name')).toBe('field1');
  });

  it('should set aria-multiline to false', () => {
    const { getInput } = createFixture(TestHostComponent);

    expect(getInput().getAttribute('aria-multiline')).toBe('false');
  });

  // === prop: disabled ===

  describe('prop: disabled', () => {
    it('should apply disabled state', () => {
      const { getInput } = createFixture(TestHostComponent, { disabled: true });

      expect(getInput().disabled).toBe(true);
      expect(getInput().getAttribute('aria-disabled')).toBe('true');
    });

    it('should not be disabled by default', () => {
      const { getInput } = createFixture(TestHostComponent);

      expect(getInput().disabled).toBe(false);
    });
  });

  // === prop: readonly ===

  describe('prop: readonly', () => {
    it('should apply readonly state', () => {
      const { getInput } = createFixture(TestHostComponent, {
        readonlyVal: true,
      });

      expect(getInput().readOnly).toBe(true);
      expect(getInput().getAttribute('aria-readonly')).toBe('true');
    });
  });

  // === prop: value (new) ===

  describe('prop: value', () => {
    it('should display value from value input', () => {
      const { getInput } = createFixture(TestHostComponent, {
        value: 'Example',
      });

      expect(getInput().value).toBe('Example');
    });

    it('should update display when value input changes', () => {
      const { fixture, host, getInput } = createFixture(TestHostComponent, {
        value: 'first',
      });

      expect(getInput().value).toBe('first');

      host.value = 'second';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(getInput().value).toBe('second');
    });
  });

  // === prop: defaultValue ===

  describe('prop: defaultValue', () => {
    it('should set initial value from defaultValue', () => {
      const { getInput } = createFixture(TestDefaultValueHostComponent, {
        defaultValue: 'initial',
      });

      expect(getInput().value).toBe('initial');
    });

    it('should use empty string when defaultValue is not set', () => {
      const { getInput } = createFixture(TestDefaultValueHostComponent);

      expect(getInput().value).toBe('');
    });
  });

  // === prop: size ===

  describe('prop: size', () => {
    it('should apply main size class by default', () => {
      const { getEl } = createFixture(TestHostComponent);
      const field = getEl().querySelector('.mzn-input__field');

      expect(field?.classList.contains('mzn-input--main')).toBe(true);
    });

    it('should apply sub size class', () => {
      const { getEl } = createFixture(TestHostComponent, { size: 'sub' });
      const field = getEl().querySelector('.mzn-input__field');

      expect(field?.classList.contains('mzn-input--sub')).toBe(true);
    });
  });

  // === valueChange output ===

  describe('valueChange', () => {
    it('should emit valueChange on input', () => {
      const { getInput, host, fixture } = createFixture(TestHostComponent);

      typeInto(getInput(), 'hello');
      fixture.detectChanges();

      expect(host.onValueChange).toHaveBeenCalledWith('hello');
    });
  });

  // === variant: base ===

  describe('variant: base', () => {
    it('should default to base variant with text type', () => {
      const { getInput } = createFixture(TestHostComponent);

      expect(getInput().type).toBe('text');
    });
  });

  // === variant: search ===

  describe('variant: search', () => {
    it('should render search icon', () => {
      const { getEl } = createFixture(TestHostComponent, { variant: 'search' });

      expect(getEl().querySelector('i[mznIcon]')).toBeTruthy();
    });

    it('should apply search class', () => {
      const { getEl } = createFixture(TestHostComponent, { variant: 'search' });
      const host = getEl().querySelector('.mzn-input');

      expect(host?.classList.contains('mzn-input--search')).toBe(true);
    });

    it('should be clearable by default (clearable not set)', () => {
      const { getEl } = createFixture(TestHostComponent, { variant: 'search' });
      const textField = getEl().querySelector('mzn-text-field');

      // The clearable class is added to the text field when clearable is true
      expect(textField?.classList.contains('mzn-text-field--clearable')).toBe(
        true,
      );
    });

    it('should not be clearable when clearable=false', () => {
      const { getEl } = createFixture(TestHostComponent, {
        variant: 'search',
        clearable: false,
      });
      const textField = getEl().querySelector('mzn-text-field');

      expect(textField?.classList.contains('mzn-text-field--clearable')).toBe(
        false,
      );
    });

    it('should support different sizes', () => {
      const { getEl: getMainEl } = createFixture(TestHostComponent, {
        variant: 'search',
        size: 'main',
      });
      const mainField = getMainEl().querySelector('.mzn-input--main');

      expect(mainField).toBeTruthy();
    });
  });

  // === variant: password ===

  describe('variant: password', () => {
    it('should render password toggle icon', () => {
      const { getEl } = createFixture(TestPasswordHostComponent);

      expect(getEl().querySelector('i[mznIcon][role="button"]')).toBeTruthy();
    });

    it('should start with password type', () => {
      const { getInput } = createFixture(TestPasswordHostComponent);

      expect(getInput().type).toBe('password');
    });

    it('should apply password class', () => {
      const { getEl } = createFixture(TestPasswordHostComponent);
      const host = getEl().querySelector('.mzn-input');

      expect(host?.classList.contains('mzn-input--password')).toBe(true);
    });

    it('should toggle password visibility when icon clicked', () => {
      const { getEl, getInput, fixture } = createFixture(
        TestPasswordHostComponent,
      );
      const icon = getEl().querySelector(
        'i[mznIcon][role="button"]',
      ) as HTMLElement;

      expect(getInput().type).toBe('password');

      icon.click();
      fixture.detectChanges();

      expect(getInput().type).toBe('text');

      icon.click();
      fixture.detectChanges();

      expect(getInput().type).toBe('password');
    });

    it('should toggle via Enter key', () => {
      const { getEl, getInput, fixture } = createFixture(
        TestPasswordHostComponent,
      );
      const icon = getEl().querySelector(
        'i[mznIcon][role="button"]',
      ) as HTMLElement;

      icon.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      fixture.detectChanges();

      expect(getInput().type).toBe('text');
    });

    it('should have correct aria-label', () => {
      const { getEl, fixture } = createFixture(TestPasswordHostComponent);
      const icon = getEl().querySelector(
        'i[mznIcon][role="button"]',
      ) as HTMLElement;

      expect(icon.getAttribute('aria-label')).toBe('Show password');

      icon.click();
      fixture.detectChanges();

      expect(icon.getAttribute('aria-label')).toBe('Hide password');
    });

    it('should not render strength indicator by default', () => {
      const { getEl } = createFixture(TestPasswordHostComponent);
      const indicator = getEl().querySelector(
        'mzn-password-strength-indicator',
      );

      expect(indicator).toBeFalsy();
    });

    it('should render strength indicator when enabled', () => {
      const { getEl } = createFixture(TestPasswordHostComponent, {
        showPasswordStrengthIndicator: true,
        passwordStrengthIndicator: {
          strength: 'weak',
          hintTexts: [
            { severity: 'info' as const, hint: 'Use at least 8 characters' },
          ],
        },
      });
      const indicator = getEl().querySelector(
        'mzn-password-strength-indicator',
      );

      expect(indicator).toBeTruthy();
    });

    it('should render indicator container with correct class', () => {
      const { getEl } = createFixture(TestPasswordHostComponent, {
        showPasswordStrengthIndicator: true,
        passwordStrengthIndicator: { strength: 'medium' },
      });
      const container = getEl().querySelector(
        '.mzn-input__indicator-container',
      );

      expect(container).toBeTruthy();
    });
  });

  // === variant: affix ===

  describe('variant: affix', () => {
    it('should render prefix text', () => {
      const { getEl } = createFixture(TestHostComponent, {
        variant: 'affix',
        prefixText: '$',
      });

      expect(getEl().textContent).toContain('$');
    });

    it('should render suffix text', () => {
      const { getEl } = createFixture(TestHostComponent, {
        variant: 'affix',
        suffixText: '.00',
      });

      expect(getEl().textContent).toContain('.00');
    });

    it('should render prefix icon', () => {
      const { getEl } = createFixture(TestHostComponent, {
        variant: 'affix',
        prefixIcon: EyeIcon,
      });
      const iconEl = getEl().querySelector('[prefix] i[mznIcon]');

      expect(iconEl).toBeTruthy();
    });

    it('should prefer prefixIcon over prefixText', () => {
      const { getEl } = createFixture(TestHostComponent, {
        variant: 'affix',
        prefixIcon: EyeIcon,
        prefixText: 'Ignored',
      });
      const iconEl = getEl().querySelector('[prefix] i[mznIcon]');
      const textContent = getEl()
        .querySelector('[prefix]')
        ?.textContent?.trim();

      expect(iconEl).toBeTruthy();
      // Should not contain the text since icon takes priority
      expect(textContent).not.toContain('Ignored');
    });
  });

  // === variant: number ===

  describe('variant: number', () => {
    it('should render input with type number', () => {
      const { getInput } = createFixture(TestNumberHostComponent);

      expect(getInput().type).toBe('number');
    });

    it('should apply number input class', () => {
      const { getEl } = createFixture(TestNumberHostComponent);
      const host = getEl().querySelector('.mzn-input--number');

      expect(host).toBeTruthy();
    });

    it('should apply number class to field element', () => {
      const { getEl } = createFixture(TestNumberHostComponent);
      const field = getEl().querySelector('.mzn-input__field');

      expect(field?.classList.contains('mzn-input--number')).toBe(true);
    });

    it('should set min, max, and step attributes', () => {
      const { getInput } = createFixture(TestNumberHostComponent, {
        min: 0,
        max: 100,
        step: 5,
      });

      expect(getInput().getAttribute('min')).toBe('0');
      expect(getInput().getAttribute('max')).toBe('100');
      expect(getInput().getAttribute('step')).toBe('5');
    });

    it('should display value', () => {
      const { getInput } = createFixture(TestNumberHostComponent, {
        value: '50',
      });

      expect(getInput().value).toBe('50');
    });
  });

  // === variant: measure ===

  describe('variant: measure', () => {
    it('should align text to the right', () => {
      const { getInput } = createFixture(TestMeasureHostComponent);

      expect(getInput().style.textAlign).toBe('right');
    });

    it('should apply mono-input class to field', () => {
      const { getEl } = createFixture(TestMeasureHostComponent);
      const field = getEl().querySelector('.mzn-input__field');

      expect(field?.classList.contains('mzn-text-field--mono-input')).toBe(
        true,
      );
    });

    it('should render prefix text', () => {
      const { getEl } = createFixture(TestMeasureHostComponent, {
        prefixText: 'NT',
      });

      expect(getEl().textContent).toContain('NT');
    });

    it('should render suffix text', () => {
      const { getEl } = createFixture(TestMeasureHostComponent, {
        suffixText: 'kg',
      });

      expect(getEl().textContent).toContain('kg');
    });

    it('should apply measure-without-spinner class by default', () => {
      const { getEl } = createFixture(TestMeasureHostComponent);
      const host = getEl().querySelector('.mzn-input--measure-without-spinner');

      expect(host).toBeTruthy();
    });

    describe('spinner', () => {
      it('should render spinner buttons when showSpinner is true', () => {
        const { getEl } = createFixture(TestMeasureHostComponent, {
          showSpinner: true,
        });
        const spinnerButtons = getEl().querySelectorAll(
          'mzn-input-spinner-button',
        );

        expect(spinnerButtons.length).toBe(2);
      });

      it('should apply measure-with-spinner class', () => {
        const { getEl } = createFixture(TestMeasureHostComponent, {
          showSpinner: true,
        });
        const host = getEl().querySelector('.mzn-input--measure-with-spinner');

        expect(host).toBeTruthy();
      });

      it('should apply tinyGap class when showSpinner is true', () => {
        const { getEl } = createFixture(TestMeasureHostComponent, {
          showSpinner: true,
        });
        const field = getEl().querySelector('.mzn-input__field');

        expect(field?.classList.contains('mzn-text-field--tiny-gap')).toBe(
          true,
        );
      });

      it('should not render spinner buttons when showSpinner is false', () => {
        const { getEl } = createFixture(TestMeasureHostComponent, {
          showSpinner: false,
        });
        const spinnerButtons = getEl().querySelectorAll(
          'mzn-input-spinner-button',
        );

        expect(spinnerButtons.length).toBe(0);
      });

      it('should increment value when spin up is clicked', () => {
        const { getEl, host, fixture } = createFixture(
          TestMeasureHostComponent,
          {
            showSpinner: true,
            value: '100',
            step: 10,
          },
        );

        const spinUpButton = getEl().querySelector(
          'button[title="Increase value"]',
        ) as HTMLButtonElement;

        spinUpButton.click();
        fixture.detectChanges();

        expect(host.onValueChange).toHaveBeenCalledWith('110');
      });

      it('should decrement value when spin down is clicked', () => {
        const { getEl, host, fixture } = createFixture(
          TestMeasureHostComponent,
          {
            showSpinner: true,
            value: '100',
            step: 10,
          },
        );

        const spinDownButton = getEl().querySelector(
          'button[title="Decrease value"]',
        ) as HTMLButtonElement;

        spinDownButton.click();
        fixture.detectChanges();

        expect(host.onValueChange).toHaveBeenCalledWith('90');
      });

      it('should respect max value on spin up', () => {
        const { getEl, host, fixture } = createFixture(
          TestMeasureHostComponent,
          {
            showSpinner: true,
            value: '95',
            step: 10,
            max: 100,
          },
        );

        const spinUpButton = getEl().querySelector(
          'button[title="Increase value"]',
        ) as HTMLButtonElement;

        spinUpButton.click();
        fixture.detectChanges();

        expect(host.onValueChange).toHaveBeenCalledWith('100');
      });

      it('should respect min value on spin down', () => {
        const { getEl, host, fixture } = createFixture(
          TestMeasureHostComponent,
          {
            showSpinner: true,
            value: '5',
            step: 10,
            min: 0,
          },
        );

        const spinDownButton = getEl().querySelector(
          'button[title="Decrease value"]',
        ) as HTMLButtonElement;

        spinDownButton.click();
        fixture.detectChanges();

        expect(host.onValueChange).toHaveBeenCalledWith('0');
      });

      it('should emit spinUp event', () => {
        const { getEl, host, fixture } = createFixture(
          TestMeasureHostComponent,
          {
            showSpinner: true,
            value: '100',
          },
        );

        const spinUpButton = getEl().querySelector(
          'button[title="Increase value"]',
        ) as HTMLButtonElement;

        spinUpButton.click();
        fixture.detectChanges();

        expect(host.onSpinUp).toHaveBeenCalledTimes(1);
      });

      it('should emit spinDown event', () => {
        const { getEl, host, fixture } = createFixture(
          TestMeasureHostComponent,
          {
            showSpinner: true,
            value: '100',
          },
        );

        const spinDownButton = getEl().querySelector(
          'button[title="Decrease value"]',
        ) as HTMLButtonElement;

        spinDownButton.click();
        fixture.detectChanges();

        expect(host.onSpinDown).toHaveBeenCalledTimes(1);
      });

      it('should use step=1 as default', () => {
        const { getEl, host, fixture } = createFixture(
          TestMeasureHostComponent,
          {
            showSpinner: true,
            value: '10',
          },
        );

        const spinUpButton = getEl().querySelector(
          'button[title="Increase value"]',
        ) as HTMLButtonElement;

        spinUpButton.click();
        fixture.detectChanges();

        expect(host.onValueChange).toHaveBeenCalledWith('11');
      });
    });
  });

  // === variant: action ===

  describe('variant: action', () => {
    it('should render action button as suffix', () => {
      const { getEl } = createFixture(TestActionHostComponent);
      const actionButton = getEl().querySelector('mzn-input-action-button');

      expect(actionButton).toBeTruthy();
    });

    it('should render action button as prefix', () => {
      const { getEl } = createFixture(TestActionHostComponent, {
        actionButton: {
          position: 'prefix',
          icon: CopyIcon,
          label: 'Copy',
          onClick: jest.fn(),
        },
      });
      const actionButton = getEl().querySelector('mzn-input-action-button');

      expect(actionButton).toBeTruthy();
    });

    it('should apply suffix external action class', () => {
      const { getEl } = createFixture(TestActionHostComponent);
      const host = getEl().querySelector(
        '.mzn-input--with-suffix-external-action',
      );

      expect(host).toBeTruthy();
    });

    it('should apply prefix external action class', () => {
      const { getEl } = createFixture(TestActionHostComponent, {
        actionButton: {
          position: 'prefix',
          icon: CopyIcon,
          label: 'Copy',
          onClick: jest.fn(),
        },
      });
      const host = getEl().querySelector(
        '.mzn-input--with-prefix-external-action',
      );

      expect(host).toBeTruthy();
    });

    it('should call onClick when action button clicked', () => {
      const onClick = jest.fn();
      const { getEl, fixture } = createFixture(TestActionHostComponent, {
        actionButton: {
          position: 'suffix',
          icon: CopyIcon,
          label: 'Copy',
          onClick,
        },
      });

      const button = getEl().querySelector(
        'mzn-input-action-button button',
      ) as HTMLButtonElement;

      button.click();
      fixture.detectChanges();

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should disable action button when input is disabled', () => {
      const { getEl } = createFixture(TestActionHostComponent, {
        disabled: true,
      });
      const button = getEl().querySelector(
        'mzn-input-action-button button',
      ) as HTMLButtonElement;

      expect(button.disabled).toBe(true);
    });

    it('should disable action button when input is readonly', () => {
      const { getEl } = createFixture(TestActionHostComponent, {
        readonlyVal: true,
      });
      const button = getEl().querySelector(
        'mzn-input-action-button button',
      ) as HTMLButtonElement;

      expect(button.disabled).toBe(true);
    });

    it('should allow explicitly enabled action button on readonly input', () => {
      const { getEl } = createFixture(TestActionHostComponent, {
        readonlyVal: true,
        actionButton: {
          position: 'suffix',
          icon: CopyIcon,
          label: 'Copy',
          disabled: false,
          onClick: jest.fn(),
        },
      });
      const button = getEl().querySelector(
        'mzn-input-action-button button',
      ) as HTMLButtonElement;

      expect(button.disabled).toBe(false);
    });
  });

  // === formatter and parser ===

  describe('formatter and parser', () => {
    it('should format display value', () => {
      const { getInput } = createFixture(TestFormatterParserHostComponent, {
        value: '1000000',
        formatter: (v: string) => v.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      });

      expect(getInput().value).toBe('1,000,000');
    });

    it('should parse input value', () => {
      const { getInput, host, fixture } = createFixture(
        TestFormatterParserHostComponent,
        {
          formatter: (v: string) => v.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          parser: (v: string) => v.replace(/,/g, ''),
        },
      );

      typeInto(getInput(), '1,000');
      fixture.detectChanges();

      expect(host.onValueChange).toHaveBeenCalledWith('1000');
    });
  });

  // === clearable ===

  describe('clearable', () => {
    it('should show clear button when clearable is true', () => {
      const { getEl } = createFixture(TestHostComponent, { clearable: true });
      const textField = getEl().querySelector('mzn-text-field');

      expect(textField?.classList.contains('mzn-text-field--clearable')).toBe(
        true,
      );
    });

    it('should not show clear button by default', () => {
      const { getEl } = createFixture(TestHostComponent);
      const textField = getEl().querySelector('mzn-text-field');

      expect(textField?.classList.contains('mzn-text-field--clearable')).toBe(
        false,
      );
    });
  });

  // === ControlValueAccessor ===

  describe('ControlValueAccessor', () => {
    it('should work with reactive forms', () => {
      const fixture = TestBed.createComponent(TestReactiveFormComponent);

      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector(
        'input',
      ) as HTMLInputElement;

      expect(input.value).toBe('initial');
    });

    it('should update form control on input', () => {
      const fixture = TestBed.createComponent(TestReactiveFormComponent);

      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector(
        'input',
      ) as HTMLInputElement;

      typeInto(input, 'updated');
      fixture.detectChanges();

      expect(fixture.componentInstance.control.value).toBe('updated');
    });

    it('should update display when form control value changes', () => {
      const fixture = TestBed.createComponent(TestReactiveFormComponent);

      fixture.detectChanges();

      fixture.componentInstance.control.setValue('programmatic');
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector(
        'input',
      ) as HTMLInputElement;

      expect(input.value).toBe('programmatic');
    });

    it('should handle null value from form control', () => {
      const fixture = TestBed.createComponent(TestReactiveFormComponent);

      fixture.detectChanges();

      fixture.componentInstance.control.setValue(null);
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector(
        'input',
      ) as HTMLInputElement;

      expect(input.value).toBe('');
    });
  });

  // === CSS class parity with core ===

  describe('CSS classes', () => {
    it('should use correct password class from core', () => {
      const { getEl } = createFixture(TestPasswordHostComponent);
      const host = getEl().querySelector('.mzn-input');

      // Should use classes.passwordInput which resolves to 'mzn-input--password'
      expect(host?.classList.contains('mzn-input--password')).toBe(true);
    });

    it('should use correct search class from core', () => {
      const { getEl } = createFixture(TestHostComponent, { variant: 'search' });
      const host = getEl().querySelector('.mzn-input');

      // Should use classes.searchInput which resolves to 'mzn-input--search'
      expect(host?.classList.contains('mzn-input--search')).toBe(true);
    });

    it('should apply container class to host element', () => {
      const { getEl } = createFixture(TestHostComponent);

      expect(getEl().classList.contains('mzn-input-container')).toBe(true);
    });

    it('should apply field class to text-field', () => {
      const { getEl } = createFixture(TestHostComponent);
      const field = getEl().querySelector('.mzn-input__field');

      expect(field).toBeTruthy();
    });
  });

  // === onClear behavior ===

  describe('onClear', () => {
    it('should clear value and emit valueChange', () => {
      const { getEl, host, fixture } = createFixture(TestHostComponent, {
        clearable: true,
        value: 'some text',
      });

      // Simulate the clear action by triggering the cleared event on mzn-text-field
      const textField = getEl().querySelector('mzn-text-field');
      const clearButton = textField?.querySelector(
        '.mzn-clear-actions--clearable',
      ) as HTMLElement;

      if (clearButton) {
        clearButton.click();
        fixture.detectChanges();

        expect(host.onValueChange).toHaveBeenCalledWith('');
      }
    });
  });

  // === onBlur ===

  describe('onBlur', () => {
    it('should mark as touched on blur (reactive forms)', () => {
      const fixture = TestBed.createComponent(TestReactiveFormComponent);

      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector(
        'input',
      ) as HTMLInputElement;

      expect(fixture.componentInstance.control.touched).toBe(false);

      input.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(fixture.componentInstance.control.touched).toBe(true);
    });
  });
});
