import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MznCheckbox } from './checkbox.component';
import { MznCheckboxGroup } from './checkbox-group.component';

@Component({
  standalone: true,
  imports: [MznCheckbox, FormsModule],
  template: `
    <mzn-checkbox [checked]="checked" [disabled]="disabled" [value]="'test'"
      >Label</mzn-checkbox
    >
  `,
})
class TestHostComponent {
  checked = false;
  disabled = false;
}

@Component({
  standalone: true,
  imports: [MznCheckbox, MznCheckboxGroup, FormsModule],
  template: `
    <mzn-checkbox-group [(ngModel)]="values" name="fruits">
      <mzn-checkbox value="apple">Apple</mzn-checkbox>
      <mzn-checkbox value="banana">Banana</mzn-checkbox>
      <mzn-checkbox value="cherry">Cherry</mzn-checkbox>
    </mzn-checkbox-group>
  `,
})
class TestGroupComponent {
  values: string[] = ['apple'];
}

@Component({
  standalone: true,
  imports: [MznCheckbox, FormsModule],
  template: `
    <mzn-checkbox mode="chip" size="minor" [checked]="checked"
      >Chip Label</mzn-checkbox
    >
  `,
})
class TestChipComponent {
  checked = true;
}

function createFixture<T>(component: new () => T): {
  fixture: ReturnType<typeof TestBed.createComponent<T>>;
  host: T;
} {
  const fixture = TestBed.createComponent(component);

  fixture.detectChanges();

  return { fixture, host: fixture.componentInstance };
}

describe('MznCheckbox', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent, TestGroupComponent, TestChipComponent],
    });
  });

  it('should render the checkbox', () => {
    const { fixture } = createFixture(TestHostComponent);
    const input = fixture.nativeElement.querySelector('input[type="checkbox"]');

    expect(input).toBeTruthy();
  });

  it('should reflect checked state', () => {
    const { fixture, host } = createFixture(TestHostComponent);
    const input = fixture.nativeElement.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;

    expect(input.checked).toBe(false);

    host.checked = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    expect(input.checked).toBe(true);
  });

  it('should reflect disabled state', () => {
    const { fixture, host } = createFixture(TestHostComponent);
    const input = fixture.nativeElement.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;

    expect(input.disabled).toBe(false);

    host.disabled = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    expect(input.disabled).toBe(true);
  });

  it('should render in chip mode', () => {
    const { fixture } = createFixture(TestChipComponent);
    const el = fixture.nativeElement.querySelector('.mzn-checkbox');

    expect(el).toBeTruthy();
    expect(el.classList.contains('mzn-checkbox--chip')).toBe(true);
  });

  it('should render label text', () => {
    const { fixture } = createFixture(TestHostComponent);

    expect(fixture.nativeElement.textContent).toContain('Label');
  });
});

describe('MznCheckboxGroup', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestGroupComponent],
    });
  });

  it('should render group with children', () => {
    const { fixture } = createFixture(TestGroupComponent);
    const checkboxes = fixture.nativeElement.querySelectorAll(
      'input[type="checkbox"]',
    );

    expect(checkboxes.length).toBe(3);
  });

  it('should reflect group value via ngModel', async () => {
    const { fixture } = createFixture(TestGroupComponent);

    await fixture.whenStable();
    fixture.detectChanges();

    const checkboxes = fixture.nativeElement.querySelectorAll(
      'input[type="checkbox"]',
    ) as NodeListOf<HTMLInputElement>;

    // apple is pre-selected
    expect(checkboxes[0].checked).toBe(true);
    expect(checkboxes[1].checked).toBe(false);
  });

  it('should toggle value on click', async () => {
    const { fixture, host } = createFixture(TestGroupComponent);

    await fixture.whenStable();
    fixture.detectChanges();

    const checkboxes = fixture.nativeElement.querySelectorAll(
      'input[type="checkbox"]',
    ) as NodeListOf<HTMLInputElement>;

    // Click banana
    checkboxes[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.values).toContain('banana');
    expect(host.values).toContain('apple');
  });
});
