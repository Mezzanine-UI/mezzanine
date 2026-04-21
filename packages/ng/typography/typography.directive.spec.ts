import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TypographyAlign,
  TypographyColor,
  TypographyDisplay,
} from '@mezzanine-ui/core/typography';
import { TypographySemanticType } from '@mezzanine-ui/system/typography';
import { MznTypography } from './typography.directive';

@Component({
  standalone: true,
  imports: [MznTypography],
  template: `
    <p
      mznTypography
      [variant]="variant"
      [align]="align"
      [color]="color"
      [display]="display"
      [ellipsis]="ellipsis"
      [noWrap]="noWrap"
      >Test</p
    >
  `,
})
class TestHostComponent {
  align?: TypographyAlign;
  color?: TypographyColor;
  display?: TypographyDisplay;
  ellipsis = false;
  noWrap = false;
  variant: TypographySemanticType = 'body';
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
    getEl: (): HTMLElement => fixture.nativeElement.querySelector('p')!,
  };
}

describe('MznTypography', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
  });

  it('should apply variant class', () => {
    const { getEl } = createFixture();

    expect(getEl().classList.contains('mzn-typography--body')).toBe(true);
  });

  it('should apply h1 variant class', () => {
    const { getEl } = createFixture({ variant: 'h1' });

    expect(getEl().classList.contains('mzn-typography--h1')).toBe(true);
    expect(getEl().classList.contains('mzn-typography--body')).toBe(false);
  });

  describe('all variants', () => {
    const allVariants: TypographySemanticType[] = [
      'h1',
      'h2',
      'h3',
      'body',
      'body-highlight',
      'body-mono',
      'body-mono-highlight',
      'text-link-body',
      'text-link-caption',
      'caption',
      'caption-highlight',
      'annotation',
      'annotation-highlight',
      'button',
      'button-highlight',
      'input',
      'input-mono',
      'input-highlight',
      'label-primary',
      'label-primary-highlight',
      'label-secondary',
    ];

    allVariants.forEach((variant) => {
      it(`should apply class for variant="${variant}"`, () => {
        const { getEl } = createFixture({ variant });

        expect(getEl().classList.contains(`mzn-typography--${variant}`)).toBe(
          true,
        );
      });
    });
  });

  it('should apply ellipsis class', () => {
    const { getEl } = createFixture({ ellipsis: true });

    expect(getEl().classList.contains('mzn-typography--ellipsis')).toBe(true);
  });

  it('should apply noWrap class', () => {
    const { getEl } = createFixture({ noWrap: true });

    expect(getEl().classList.contains('mzn-typography--nowrap')).toBe(true);
  });

  it('should apply align CSS variable when align is set', () => {
    const { getEl } = createFixture({ align: 'center' });
    const el = getEl();

    expect(el.classList.contains('mzn-typography--align')).toBe(true);
    expect(el.style.getPropertyValue('--mzn-typography-align')).toBe('center');
  });

  it('should apply color class and CSS variable when color is set', () => {
    const { getEl } = createFixture({ color: 'text-neutral' });
    const el = getEl();

    expect(el.classList.contains('mzn-typography--color')).toBe(true);
    expect(el.style.getPropertyValue('--mzn-typography-color')).toBeTruthy();
  });

  it('should set color CSS variable to "inherit" when color is "inherit"', () => {
    const { getEl } = createFixture({ color: 'inherit' });
    const el = getEl();

    expect(el.classList.contains('mzn-typography--color')).toBe(true);
    expect(el.style.getPropertyValue('--mzn-typography-color')).toBe('inherit');
  });

  it('should apply display class and CSS variable when display is set', () => {
    const { getEl } = createFixture({ display: 'block' });
    const el = getEl();

    expect(el.classList.contains('mzn-typography--display')).toBe(true);
    expect(el.style.getPropertyValue('--mzn-typography-display')).toBe('block');
  });
});
