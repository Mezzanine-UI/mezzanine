import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { InputCheckSize } from '@mezzanine-ui/core/_internal/input-check';
import { MznInputCheck } from './input-check.component';

@Component({
  standalone: true,
  imports: [MznInputCheck],
  template: `
    <mzn-input-check
      [size]="size"
      [disabled]="disabled"
      [error]="error"
      [focused]="focused"
      [hint]="hint"
      [hasLabel]="hasLabel"
      [segmentedStyle]="segmentedStyle"
    >
      <input control type="checkbox" />
      {{ labelText }}
    </mzn-input-check>
  `,
})
class TestHostComponent {
  size: InputCheckSize = 'main';
  disabled = false;
  error = false;
  focused = false;
  hint?: string;
  hasLabel = true;
  segmentedStyle = false;
  labelText = 'Check label';
}

function createFixture(overrides: Partial<TestHostComponent> = {}): {
  fixture: ReturnType<typeof TestBed.createComponent<TestHostComponent>>;
  host: TestHostComponent;
  getHostElement: () => HTMLElement;
} {
  const fixture = TestBed.createComponent(TestHostComponent);
  const host = fixture.componentInstance;

  Object.assign(host, overrides);
  fixture.detectChanges();

  return {
    fixture,
    host,
    getHostElement: () =>
      fixture.nativeElement.querySelector('mzn-input-check') as HTMLElement,
  };
}

describe('MznInputCheck', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
  });

  it('should render with host class', () => {
    const { getHostElement } = createFixture();

    expect(getHostElement().classList.contains('mzn-input-check')).toBe(true);
  });

  it('should apply size class', () => {
    const { getHostElement } = createFixture({ size: 'sub' });

    expect(getHostElement().classList.contains('mzn-input-check--sub')).toBe(
      true,
    );
  });

  it('should apply disabled class', () => {
    const { getHostElement } = createFixture({ disabled: true });

    expect(
      getHostElement().classList.contains('mzn-input-check--disabled'),
    ).toBe(true);
  });

  it('should apply error class', () => {
    const { getHostElement } = createFixture({ error: true });

    expect(getHostElement().classList.contains('mzn-input-check--error')).toBe(
      true,
    );
  });

  it('should apply segmented class', () => {
    const { getHostElement } = createFixture({ segmentedStyle: true });

    expect(
      getHostElement().classList.contains('mzn-input-check--segmented'),
    ).toBe(true);
  });

  it('should apply with-label class when hasLabel is true', () => {
    const { getHostElement } = createFixture({ hasLabel: true });

    expect(
      getHostElement().classList.contains('mzn-input-check--with-label'),
    ).toBe(true);
  });

  it('should render control slot', () => {
    const { getHostElement } = createFixture();
    const control = getHostElement().querySelector('.mzn-input-check__control');

    expect(control?.querySelector('input[type="checkbox"]')).toBeTruthy();
  });

  it('should render hint text', () => {
    const { getHostElement } = createFixture({ hint: 'Some hint' });
    const hint = getHostElement().querySelector('.mzn-input-check__hint');

    expect(hint?.textContent).toBe('Some hint');
  });

  it('should apply focused class to control', () => {
    const { getHostElement } = createFixture({ focused: true });
    const control = getHostElement().querySelector('.mzn-input-check__control');

    expect(
      control?.classList.contains('mzn-input-check__control--focused'),
    ).toBe(true);
  });
});
