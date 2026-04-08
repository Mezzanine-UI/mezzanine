import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MznFloatingButton } from './floating-button.component';

@Component({
  standalone: true,
  imports: [MznFloatingButton],
  template: `
    <mzn-floating-button [autoHideWhenOpen]="autoHideWhenOpen" [open]="open">
      <button>FAB</button>
    </mzn-floating-button>
  `,
})
class TestHostComponent {
  autoHideWhenOpen = false;
  open = false;
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
      fixture.nativeElement.querySelector('mzn-floating-button')!,
  };
}

describe('MznFloatingButton', () => {
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

    expect(getEl().classList.contains('mzn-floating-button')).toBe(true);
  });

  it('should render projected content', () => {
    const { getEl } = createFixture();

    expect(getEl().querySelector('button')?.textContent).toContain('FAB');
  });

  it('should apply button class to host element', () => {
    const { getEl } = createFixture();

    expect(getEl().classList.contains('mzn-floating-button__button')).toBe(
      true,
    );
  });

  it('should not apply hidden class by default', () => {
    const { getEl } = createFixture();

    expect(
      getEl().classList.contains('mzn-floating-button__button--hidden'),
    ).toBe(false);
  });

  it('should apply hidden class when autoHideWhenOpen and open are both true', () => {
    const { getEl } = createFixture({ autoHideWhenOpen: true, open: true });

    expect(
      getEl().classList.contains('mzn-floating-button__button--hidden'),
    ).toBe(true);
  });

  it('should not apply hidden class when only autoHideWhenOpen is true', () => {
    const { getEl } = createFixture({ autoHideWhenOpen: true, open: false });

    expect(
      getEl().classList.contains('mzn-floating-button__button--hidden'),
    ).toBe(false);
  });

  it('should not apply hidden class when only open is true', () => {
    const { getEl } = createFixture({ autoHideWhenOpen: false, open: true });

    expect(
      getEl().classList.contains('mzn-floating-button__button--hidden'),
    ).toBe(false);
  });
});
