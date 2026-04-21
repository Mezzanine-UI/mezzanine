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
    <mzn-textarea
      [disabled]="disabled"
      [placeholder]="placeholder"
      [readonly]="readonly"
      [resize]="resize"
      [rows]="rows"
      [type]="type"
      (valueChange)="onValueChange($event)"
    />
  `,
})
class TestHostComponent {
  disabled = false;
  placeholder?: string;
  readonly = false;
  resize: TextareaResize = 'none';
  rows?: number;
  type: TextareaType = 'default';
  onValueChange = jest.fn();
}

@Component({
  standalone: true,
  imports: [MznTextarea, ReactiveFormsModule],
  template: ` <mzn-textarea [formControl]="control" /> `,
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
      fixture.nativeElement.querySelector('mzn-textarea')!,
    getTextarea: (): HTMLTextAreaElement =>
      fixture.nativeElement.querySelector('textarea')!,
  };
}

describe('MznTextarea', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent, TestReactiveFormComponent],
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
