import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MznToggle } from './toggle.component';

@Component({
  standalone: true,
  imports: [MznToggle, FormsModule],
  template: ` <mzn-toggle [(ngModel)]="enabled" label="Enable" /> `,
})
class TestHostComponent {
  enabled = false;
}

@Component({
  standalone: true,
  imports: [MznToggle],
  template: `
    <mzn-toggle [disabled]="true" [checked]="true" label="Disabled" />
  `,
})
class TestDisabledComponent {}

function createFixture<T>(component: new () => T): {
  fixture: ReturnType<typeof TestBed.createComponent<T>>;
  host: T;
} {
  const fixture = TestBed.createComponent(component);

  fixture.detectChanges();

  return { fixture, host: fixture.componentInstance };
}

describe('MznToggle', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent, TestDisabledComponent],
    });
  });

  it('should render the toggle', () => {
    const { fixture } = createFixture(TestHostComponent);
    const el = fixture.nativeElement.querySelector('.mzn-toggle');

    expect(el).toBeTruthy();
  });

  it('should render label text', () => {
    const { fixture } = createFixture(TestHostComponent);

    expect(fixture.nativeElement.textContent).toContain('Enable');
  });

  it('should toggle on click', async () => {
    const { fixture, host } = createFixture(TestHostComponent);

    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;

    input.checked = true;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.enabled).toBe(true);
  });

  it('should not toggle when disabled', () => {
    const { fixture } = createFixture(TestDisabledComponent);
    const el = fixture.nativeElement.querySelector('.mzn-toggle');

    expect(el.classList.contains('mzn-toggle--disabled')).toBe(true);
  });

  it('should apply checked class', async () => {
    const { fixture } = createFixture(TestHostComponent);

    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;

    input.checked = true;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('.mzn-toggle');

    expect(el.classList.contains('mzn-toggle--checked')).toBe(true);
  });
});
