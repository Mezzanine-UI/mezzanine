import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MznRadio } from './radio.component';
import { MznRadioGroup } from './radio-group.component';

@Component({
  standalone: true,
  imports: [MznRadio, FormsModule],
  template: `
    <mzn-radio [checked]="checked" [disabled]="disabled" value="test"
      >Label</mzn-radio
    >
  `,
})
class TestHostComponent {
  checked = false;
  disabled = false;
}

@Component({
  standalone: true,
  imports: [MznRadio, MznRadioGroup, FormsModule],
  template: `
    <mzn-radio-group [(ngModel)]="selected" name="color">
      <mzn-radio value="red">Red</mzn-radio>
      <mzn-radio value="blue">Blue</mzn-radio>
      <mzn-radio value="green">Green</mzn-radio>
    </mzn-radio-group>
  `,
})
class TestGroupComponent {
  selected = 'red';
}

function createFixture<T>(component: new () => T): {
  fixture: ReturnType<typeof TestBed.createComponent<T>>;
  host: T;
} {
  const fixture = TestBed.createComponent(component);

  fixture.detectChanges();

  return { fixture, host: fixture.componentInstance };
}

describe('MznRadio', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent, TestGroupComponent],
    });
  });

  it('should render the radio input', () => {
    const { fixture } = createFixture(TestHostComponent);
    const input = fixture.nativeElement.querySelector('input[type="radio"]');

    expect(input).toBeTruthy();
  });

  it('should reflect checked state', () => {
    const { fixture, host } = createFixture(TestHostComponent);
    const input = fixture.nativeElement.querySelector(
      'input[type="radio"]',
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
      'input[type="radio"]',
    ) as HTMLInputElement;

    expect(input.disabled).toBe(false);

    host.disabled = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    expect(input.disabled).toBe(true);
  });

  it('should render label text', () => {
    const { fixture } = createFixture(TestHostComponent);

    expect(fixture.nativeElement.textContent).toContain('Label');
  });
});

describe('MznRadioGroup', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestGroupComponent],
    });
  });

  it('should render group with radio children', () => {
    const { fixture } = createFixture(TestGroupComponent);
    const radios = fixture.nativeElement.querySelectorAll(
      'input[type="radio"]',
    );

    expect(radios.length).toBe(3);
  });

  it('should reflect group value via ngModel', async () => {
    const { fixture } = createFixture(TestGroupComponent);

    await fixture.whenStable();
    fixture.detectChanges();

    const radios = fixture.nativeElement.querySelectorAll(
      'input[type="radio"]',
    ) as NodeListOf<HTMLInputElement>;

    expect(radios[0].checked).toBe(true);
    expect(radios[1].checked).toBe(false);
  });

  it('should select value on click', async () => {
    const { fixture, host } = createFixture(TestGroupComponent);

    await fixture.whenStable();
    fixture.detectChanges();

    const radios = fixture.nativeElement.querySelectorAll(
      'input[type="radio"]',
    ) as NodeListOf<HTMLInputElement>;

    radios[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.selected).toBe('blue');
  });
});
