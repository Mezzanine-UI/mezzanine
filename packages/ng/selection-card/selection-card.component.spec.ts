import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MznSelectionCard } from './selection-card.component';

@Component({
  standalone: true,
  imports: [MznSelectionCard],
  template: `
    <mzn-selection-card
      selector="radio"
      text="Option A"
      supportingText="Description"
      [checked]="checked"
      [disabled]="disabled"
      value="a"
    />
  `,
})
class TestHostComponent {
  checked = false;
  disabled = false;
}

@Component({
  standalone: true,
  imports: [MznSelectionCard],
  template: `
    <mzn-selection-card
      selector="checkbox"
      text="Readonly"
      [readonly]="true"
      [checked]="true"
    />
  `,
})
class TestReadonlyComponent {}

function createFixture<T>(component: new () => T): {
  fixture: ReturnType<typeof TestBed.createComponent<T>>;
  host: T;
} {
  const fixture = TestBed.createComponent(component);

  fixture.detectChanges();

  return { fixture, host: fixture.componentInstance };
}

describe('MznSelectionCard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent, TestReadonlyComponent],
    });
  });

  it('should render the selection card', () => {
    const { fixture } = createFixture(TestHostComponent);
    const el = fixture.nativeElement.querySelector('.mzn-selection-card');

    expect(el).toBeTruthy();
  });

  it('should render text and supporting text', () => {
    const { fixture } = createFixture(TestHostComponent);
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Option A');
    expect(text).toContain('Description');
  });

  it('should render radio input', () => {
    const { fixture } = createFixture(TestHostComponent);
    const input = fixture.nativeElement.querySelector('input[type="radio"]');

    expect(input).toBeTruthy();
  });

  it('should apply selected class when checked', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.checked = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('.mzn-selection-card');

    expect(el.classList.contains('mzn-selection-card--selected')).toBe(true);
  });

  it('should apply disabled class', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.disabled = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('.mzn-selection-card');

    expect(el.classList.contains('mzn-selection-card--disabled')).toBe(true);
  });

  it('should not render input in readonly mode', () => {
    const { fixture } = createFixture(TestReadonlyComponent);
    const input = fixture.nativeElement.querySelector('input');

    expect(input).toBeNull();
  });
});
