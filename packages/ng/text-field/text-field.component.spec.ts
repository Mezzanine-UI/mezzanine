import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextFieldSize } from '@mezzanine-ui/core/text-field';
import { MznTextField } from './text-field.component';

@Component({
  standalone: true,
  imports: [MznTextField],
  template: `
    <mzn-text-field
      [active]="active"
      [clearable]="clearable"
      [disabled]="disabled"
      [error]="error"
      [fullWidth]="fullWidth"
      [hasPrefix]="hasPrefix"
      [hasSuffix]="hasSuffix"
      [readonly]="readonly"
      [size]="size"
      [warning]="warning"
      (cleared)="onCleared()"
    >
      <input [value]="inputValue" placeholder="test" />
    </mzn-text-field>
  `,
})
class TestHostComponent {
  active = false;
  clearable = false;
  disabled = false;
  error = false;
  fullWidth = true;
  hasPrefix = false;
  hasSuffix = false;
  inputValue = '';
  readonly = false;
  size: TextFieldSize = 'main';
  warning = false;
  onCleared = jest.fn();
}

function createFixture(overrides: Partial<TestHostComponent> = {}): {
  fixture: ComponentFixture<TestHostComponent>;
  host: TestHostComponent;
  getEl: () => HTMLElement;
} {
  const fixture = TestBed.createComponent(TestHostComponent);
  const host = fixture.componentInstance;

  Object.assign(host, overrides);
  fixture.detectChanges();

  return {
    fixture,
    host,
    getEl: (): HTMLElement =>
      fixture.nativeElement.querySelector('mzn-text-field')!,
  };
}

describe('MznTextField', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
  });

  it('should create', () => {
    const { getEl } = createFixture();

    expect(getEl()).toBeTruthy();
  });

  it('should apply host class', () => {
    const { getEl } = createFixture();

    expect(getEl().classList.contains('mzn-text-field')).toBe(true);
  });

  it('should apply main size class', () => {
    const { getEl } = createFixture();

    expect(getEl().classList.contains('mzn-text-field--main')).toBe(true);
  });

  it('should apply sub size class', () => {
    const { getEl } = createFixture({ size: 'sub' });

    expect(getEl().classList.contains('mzn-text-field--sub')).toBe(true);
  });

  it('should apply disabled class', () => {
    const { getEl } = createFixture({ disabled: true });

    expect(getEl().classList.contains('mzn-text-field--disabled')).toBe(true);
  });

  it('should apply error class', () => {
    const { getEl } = createFixture({ error: true });

    expect(getEl().classList.contains('mzn-text-field--error')).toBe(true);
  });

  it('should apply warning class', () => {
    const { getEl } = createFixture({ warning: true });

    expect(getEl().classList.contains('mzn-text-field--warning')).toBe(true);
  });

  it('should apply readonly class', () => {
    const { getEl } = createFixture({ readonly: true });

    expect(getEl().classList.contains('mzn-text-field--readonly')).toBe(true);
  });

  it('should apply full-width class', () => {
    const { getEl } = createFixture();

    expect(getEl().classList.contains('mzn-text-field--full-width')).toBe(true);
  });

  it('should apply active class', () => {
    const { getEl } = createFixture({ active: true });

    expect(getEl().classList.contains('mzn-text-field--active')).toBe(true);
  });

  it('should apply clearable class', () => {
    const { getEl } = createFixture({ clearable: true });

    expect(getEl().classList.contains('mzn-text-field--clearable')).toBe(true);
  });

  describe('slim gap', () => {
    it('should apply slim-gap class when both hasPrefix and hasSuffix are true', () => {
      const { getEl } = createFixture({ hasPrefix: true, hasSuffix: true });

      expect(getEl().classList.contains('mzn-text-field--slim-gap')).toBe(true);
    });

    it('should apply slim-gap class when clearable is true', () => {
      const { getEl } = createFixture({ clearable: true });

      expect(getEl().classList.contains('mzn-text-field--slim-gap')).toBe(true);
    });

    it('should not apply slim-gap class when only hasPrefix is true', () => {
      const { getEl } = createFixture({ hasPrefix: true });

      expect(getEl().classList.contains('mzn-text-field--slim-gap')).toBe(
        false,
      );
    });

    it('should not apply slim-gap class when only hasSuffix is true', () => {
      const { getEl } = createFixture({ hasSuffix: true });

      expect(getEl().classList.contains('mzn-text-field--slim-gap')).toBe(
        false,
      );
    });

    it('should not apply slim-gap class by default', () => {
      const { getEl } = createFixture();

      expect(getEl().classList.contains('mzn-text-field--slim-gap')).toBe(
        false,
      );
    });
  });

  it('should render projected input', () => {
    const { getEl } = createFixture();

    expect(getEl().querySelector('input')).toBeTruthy();
  });
});
