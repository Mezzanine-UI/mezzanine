import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ClearActionsEmbeddedVariant,
  ClearActionsStandardVariant,
  ClearActionsType,
} from '@mezzanine-ui/core/clear-actions';
import { MznClearActions } from './clear-actions.component';

@Component({
  standalone: true,
  imports: [MznClearActions],
  template: `
    <mzn-clear-actions
      [type]="type"
      [variant]="variant"
      (clicked)="onClicked($event)"
    />
  `,
})
class TestHostComponent {
  type: ClearActionsType = 'standard';
  variant?: ClearActionsEmbeddedVariant | ClearActionsStandardVariant;
  onClicked = jest.fn();
}

function createFixture(overrides: Partial<TestHostComponent> = {}): {
  fixture: ComponentFixture<TestHostComponent>;
  host: TestHostComponent;
  getButton: () => HTMLButtonElement;
} {
  const fixture = TestBed.createComponent(TestHostComponent);
  const host = fixture.componentInstance;

  Object.assign(host, overrides);
  fixture.detectChanges();

  return {
    fixture,
    host,
    getButton: (): HTMLButtonElement =>
      fixture.nativeElement.querySelector('button[aria-label="Close"]')!,
  };
}

describe('MznClearActions', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
  });

  it('should create', () => {
    const { getButton } = createFixture();

    expect(getButton()).toBeTruthy();
  });

  it('should apply host, type, and variant classes', () => {
    const { getButton } = createFixture();
    const btn = getButton();

    expect(btn.classList.contains('mzn-clear-actions')).toBe(true);
    expect(btn.classList.contains('mzn-clear-actions--type-standard')).toBe(
      true,
    );
    expect(btn.classList.contains('mzn-clear-actions--variant-base')).toBe(
      true,
    );
  });

  it('should have type="button" and aria-label="Close"', () => {
    const { getButton } = createFixture();
    const btn = getButton();

    expect(btn.getAttribute('type')).toBe('button');
    expect(btn.getAttribute('aria-label')).toBe('Close');
  });

  it('should render CloseIcon for standard type', () => {
    const { getButton } = createFixture();

    expect(getButton().querySelector('i[mznIcon]')).toBeTruthy();
  });

  it('should emit clicked event on click', () => {
    const { getButton, host } = createFixture();

    getButton().click();

    expect(host.onClicked).toHaveBeenCalledTimes(1);
  });

  it('should apply embedded type with contrast variant', () => {
    const { getButton } = createFixture({ type: 'embedded' });
    const btn = getButton();

    expect(btn.classList.contains('mzn-clear-actions--type-embedded')).toBe(
      true,
    );
    expect(btn.classList.contains('mzn-clear-actions--variant-contrast')).toBe(
      true,
    );
  });

  it('should apply embedded type with emphasis variant', () => {
    const { getButton } = createFixture({
      type: 'embedded',
      variant: 'emphasis',
    });

    expect(
      getButton().classList.contains('mzn-clear-actions--variant-emphasis'),
    ).toBe(true);
  });

  it('should apply standard type with inverse variant', () => {
    const { getButton } = createFixture({
      type: 'standard',
      variant: 'inverse',
    });

    expect(
      getButton().classList.contains('mzn-clear-actions--variant-inverse'),
    ).toBe(true);
  });

  it('should apply clearable type with default variant', () => {
    const { getButton } = createFixture({ type: 'clearable' });
    const btn = getButton();

    expect(btn.classList.contains('mzn-clear-actions--type-clearable')).toBe(
      true,
    );
    expect(btn.classList.contains('mzn-clear-actions--variant-default')).toBe(
      true,
    );
  });
});
