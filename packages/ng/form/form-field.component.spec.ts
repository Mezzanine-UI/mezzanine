import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeverityWithInfo } from '@mezzanine-ui/system/severity';
import { FormFieldLayout } from '@mezzanine-ui/core/form';
import { FormControl, MZN_FORM_CONTROL } from './form-control';
import { MznFormField } from './form-field.component';

@Component({
  standalone: true,
  imports: [MznFormField],
  template: `
    <mzn-form-field
      [name]="name"
      [label]="label"
      [layout]="layout"
      [disabled]="disabled"
      [required]="required"
      [fullWidth]="fullWidth"
      [severity]="severity"
      [hintText]="hintText"
      [counter]="counter"
    >
      <input placeholder="test" />
    </mzn-form-field>
  `,
})
class TestHostComponent {
  counter?: string;
  disabled = false;
  fullWidth = false;
  hintText?: string;
  label?: string;
  layout: FormFieldLayout = FormFieldLayout.HORIZONTAL;
  name = 'test-field';
  required = false;
  severity: SeverityWithInfo = 'info';
}

@Component({
  selector: 'test-form-child',
  standalone: true,
  template: `<span class="child-result"
    >{{ formControl?.disabled }}-{{ formControl?.required }}-{{
      formControl?.severity
    }}</span
  >`,
})
class TestFormChildComponent {
  readonly formControl = inject<FormControl>(MZN_FORM_CONTROL, {
    optional: true,
  });
}

@Component({
  standalone: true,
  imports: [MznFormField, TestFormChildComponent],
  template: `
    <mzn-form-field
      name="parent"
      [disabled]="true"
      [required]="true"
      severity="error"
    >
      <test-form-child />
    </mzn-form-field>
  `,
})
class TestParentComponent {}

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
      fixture.nativeElement.querySelector('mzn-form-field')!,
  };
}

describe('MznFormField', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent, TestParentComponent, TestFormChildComponent],
    });
  });

  it('should create', () => {
    const { getEl } = createFixture();

    expect(getEl()).toBeTruthy();
  });

  it('should apply host and layout classes', () => {
    const { getEl } = createFixture();
    const el = getEl();

    expect(el.classList.contains('mzn-form-field')).toBe(true);
    expect(el.classList.contains('mzn-form-field--horizontal')).toBe(true);
  });

  it('should apply vertical layout class', () => {
    const { getEl } = createFixture({ layout: FormFieldLayout.VERTICAL });

    expect(getEl().classList.contains('mzn-form-field--vertical')).toBe(true);
  });

  it('should apply disabled class', () => {
    const { getEl } = createFixture({ disabled: true });

    expect(getEl().classList.contains('mzn-form-field--disabled')).toBe(true);
  });

  it('should apply full-width class', () => {
    const { getEl } = createFixture({ fullWidth: true });

    expect(getEl().classList.contains('mzn-form-field--full-width')).toBe(true);
  });

  it('should render label when provided', () => {
    const { getEl } = createFixture({ label: '使用者名稱' });

    expect(getEl().querySelector('label')?.textContent).toContain('使用者名稱');
  });

  it('should not render label when not provided', () => {
    const { getEl } = createFixture();

    expect(getEl().querySelector('label')).toBeNull();
  });

  it('should render hint text when provided', () => {
    const { getEl } = createFixture({ hintText: '格式不正確' });

    expect(getEl().textContent).toContain('格式不正確');
  });

  it('should render counter when provided', () => {
    const { getEl } = createFixture({ counter: '50/200' });

    expect(getEl().textContent).toContain('50/200');
  });

  it('should render required marker when required', () => {
    const { getEl } = createFixture({ label: '必填欄位', required: true });

    expect(
      getEl().querySelector('.mzn-form-field__label__required-marker'),
    ).toBeTruthy();
  });

  it('should provide FormControl to children via DI', () => {
    const fixture = TestBed.createComponent(TestParentComponent);

    fixture.detectChanges();

    const childResult = fixture.nativeElement.querySelector('.child-result');

    expect(childResult?.textContent).toContain('true-true-error');
  });
});
