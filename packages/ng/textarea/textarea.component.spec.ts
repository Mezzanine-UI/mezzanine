import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MznTextarea,
  TextareaResize,
  TextareaType,
} from './textarea.component';

@Component({
  standalone: true,
  imports: [MznTextarea],
  template: `
    <div
      mznTextarea
      [disabled]="disabled"
      [fullWidth]="fullWidth"
      [placeholder]="placeholder"
      [readonly]="readonly"
      [resize]="resize"
      [rows]="rows"
      [textareaClassName]="textareaClassName"
      [textareaId]="textareaId"
      [type]="type"
      (valueChange)="onValueChange($event)"
    ></div>
  `,
})
class TestHostComponent {
  disabled = false;
  fullWidth = true;
  placeholder?: string;
  readonly = false;
  resize: TextareaResize = 'none';
  rows?: number;
  textareaClassName?: string;
  textareaId?: string;
  type: TextareaType = 'default';
  onValueChange = jest.fn();
}

@Component({
  standalone: true,
  imports: [MznTextarea],
  template: ` <div class="custom-host" mznTextarea></div> `,
})
class TestStaticClassComponent {}

@Component({
  standalone: true,
  imports: [MznTextarea, ReactiveFormsModule],
  template: ` <div mznTextarea [formControl]="control"></div> `,
})
class TestReactiveFormComponent {
  control = new FormControl('initial text');
}

function createFixture(overrides: Partial<TestHostComponent> = {}): {
  fixture: ComponentFixture<TestHostComponent>;
  host: TestHostComponent;
  getEl: () => HTMLElement;
  getTextarea: () => HTMLTextAreaElement;
} {
  const fixture = TestBed.createComponent(TestHostComponent);
  const host = fixture.componentInstance;

  Object.assign(host, overrides);
  fixture.detectChanges();

  return {
    fixture,
    host,
    getEl: (): HTMLElement =>
      fixture.nativeElement.querySelector('[mznTextarea]')!,
    getTextarea: (): HTMLTextAreaElement =>
      fixture.nativeElement.querySelector('textarea')!,
  };
}

describe('MznTextarea', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestHostComponent,
        TestReactiveFormComponent,
        TestStaticClassComponent,
      ],
    });
  });

  it('should create', () => {
    const { getEl } = createFixture();

    expect(getEl()).toBeTruthy();
  });

  it('should render a textarea element', () => {
    const { getTextarea } = createFixture();

    expect(getTextarea()).toBeTruthy();
  });

  it('should set placeholder', () => {
    const { getTextarea } = createFixture({ placeholder: '輸入內容' });

    expect(getTextarea().getAttribute('placeholder')).toBe('輸入內容');
  });

  it('should set rows', () => {
    const { getTextarea } = createFixture({ rows: 5 });

    expect(getTextarea().getAttribute('rows')).toBe('5');
  });

  it('should apply disabled state', () => {
    const { getTextarea } = createFixture({ disabled: true });

    expect(getTextarea().disabled).toBe(true);
  });

  it('should apply readonly state', () => {
    const { getTextarea } = createFixture({ readonly: true });

    expect(getTextarea().readOnly).toBe(true);
  });

  it('should render the host itself as the text field frame', () => {
    const { getEl } = createFixture();
    const host = getEl();

    expect(host.className.split(' ').sort()).toEqual([
      'mzn-text-field',
      'mzn-text-field--full-width',
      'mzn-text-field--main',
      'mzn-textarea',
    ]);
    expect(host.getAttribute('role')).toBe('presentation');
    expect(host.firstElementChild?.tagName).toBe('TEXTAREA');
  });

  it('should keep consumer classes on the host', () => {
    const fixture = TestBed.createComponent(TestStaticClassComponent);

    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('[mznTextarea]');

    expect(host.classList.contains('custom-host')).toBe(true);
    expect(host.classList.contains('mzn-textarea')).toBe(true);
  });

  it('should append textareaClassName to the native textarea', () => {
    const { getTextarea } = createFixture({ textareaClassName: 'bar' });

    const { classList } = getTextarea();

    expect(classList).toContain('mzn-textarea__textarea');
    expect(classList).toContain('bar');
  });

  it('should forward textareaId to the native textarea only', () => {
    const { getEl, getTextarea } = createFixture({ textareaId: 'foo-id' });

    expect(getTextarea().id).toBe('foo-id');
    expect(getEl().hasAttribute('id')).toBe(false);
    expect(getEl().hasAttribute('textareaid')).toBe(false);
  });

  it('should reflect disabled and readonly on the frame, disabled first', () => {
    expect(createFixture({ disabled: true }).getEl().classList).toContain(
      'mzn-text-field--disabled',
    );
    expect(createFixture({ readonly: true }).getEl().classList).toContain(
      'mzn-text-field--readonly',
    );

    const both = createFixture({ disabled: true, readonly: true }).getEl();

    expect(both.classList).toContain('mzn-text-field--disabled');
    expect(both.classList).not.toContain('mzn-text-field--readonly');
  });

  it('should map type to the warning and error frame states', () => {
    expect(createFixture({ type: 'warning' }).getEl().classList).toContain(
      'mzn-text-field--warning',
    );

    const error = createFixture({ type: 'error', disabled: true }).getEl();

    expect(error.classList).toContain('mzn-text-field--error');
    expect(error.classList).not.toContain('mzn-text-field--disabled');
  });

  it('should toggle the typing state on input and blur', () => {
    const { fixture, getEl, getTextarea } = createFixture();

    getTextarea().dispatchEvent(new Event('mousedown'));
    fixture.detectChanges();
    expect(getEl().classList).toContain('mzn-text-field--typing');

    getTextarea().dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(getEl().classList).not.toContain('mzn-text-field--typing');

    getTextarea().value = 'abc';
    getTextarea().dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(getEl().classList).toContain('mzn-text-field--typing');
  });

  it('should take the full width of its container by default', () => {
    const { getEl } = createFixture();

    expect(getEl().classList.contains('mzn-text-field--full-width')).toBe(true);
  });

  it('should not take the full width when fullWidth is false', () => {
    const { getEl } = createFixture({ fullWidth: false });

    expect(getEl().classList.contains('mzn-text-field--full-width')).toBe(
      false,
    );
  });

  it('should not leak the fullWidth attribute onto the host', () => {
    const { getEl } = createFixture();

    expect(getEl().hasAttribute('fullwidth')).toBe(false);
  });

  it('should apply resize style', () => {
    const { getTextarea } = createFixture({ resize: 'vertical' });

    expect(getTextarea().style.resize).toBe('vertical');
  });

  it('should show resize icon when resize is not none', () => {
    const { getEl } = createFixture({ resize: 'vertical' });

    expect(getEl().querySelector('i[mznIcon]')).toBeTruthy();
  });

  it('should not show resize icon when resize is none', () => {
    const { getEl } = createFixture({ resize: 'none' });

    expect(getEl().querySelector('i[mznIcon]')).toBeNull();
  });

  it('should emit valueChange on input', () => {
    const { getTextarea, host, fixture } = createFixture();
    const ta = getTextarea();

    ta.value = 'new text';
    ta.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(host.onValueChange).toHaveBeenCalledWith('new text');
  });

  describe('type variants', () => {
    it('should not disable when type is error', () => {
      const { getTextarea } = createFixture({ type: 'error', disabled: true });

      expect(getTextarea().disabled).toBe(false);
    });

    it('should not make readonly when type is warning', () => {
      const { getTextarea } = createFixture({
        type: 'warning',
        readonly: true,
      });

      expect(getTextarea().readOnly).toBe(false);
    });
  });

  describe('ControlValueAccessor', () => {
    it('should work with reactive forms', () => {
      const fixture = TestBed.createComponent(TestReactiveFormComponent);

      fixture.detectChanges();

      const textarea = fixture.nativeElement.querySelector(
        'textarea',
      ) as HTMLTextAreaElement;

      expect(textarea.value).toBe('initial text');
    });

    it('should update form control on input', () => {
      const fixture = TestBed.createComponent(TestReactiveFormComponent);

      fixture.detectChanges();

      const textarea = fixture.nativeElement.querySelector(
        'textarea',
      ) as HTMLTextAreaElement;

      textarea.value = 'updated text';
      textarea.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(fixture.componentInstance.control.value).toBe('updated text');
    });
  });
});
