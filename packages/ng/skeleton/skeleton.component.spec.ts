import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TypographySemanticType } from '@mezzanine-ui/core/typography';
import { MznSkeleton } from './skeleton.component';

@Component({
  standalone: true,
  imports: [MznSkeleton],
  template: `
    <mzn-skeleton
      [circle]="circle"
      [height]="height"
      [variant]="variant"
      [width]="width"
    />
  `,
})
class TestHostComponent {
  circle = false;
  height?: number | string;
  variant?: TypographySemanticType;
  width?: number | string;
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
      fixture.nativeElement.querySelector('mzn-skeleton')!,
  };
}

describe('MznSkeleton', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
  });

  it('should create', () => {
    const { getEl } = createFixture();

    expect(getEl()).toBeTruthy();
  });

  describe('strip mode', () => {
    it('should apply strip classes when variant is set without height or circle', () => {
      const { getEl } = createFixture({ variant: 'h3' });
      const el = getEl();

      expect(el.classList.contains('mzn-skeleton')).toBe(true);
      expect(el.classList.contains('mzn-skeleton--strip--h3')).toBe(true);
    });

    it('should render bg span in strip mode', () => {
      const { getEl } = createFixture({ variant: 'body' });

      expect(getEl().querySelector('.mzn-skeleton--bg')).toBeTruthy();
    });

    it('should apply width style in strip mode', () => {
      const { getEl } = createFixture({ variant: 'h3', width: '200px' });

      expect(getEl().style.width).toBe('200px');
    });
  });

  describe('circle/square mode', () => {
    it('should apply bg class on host when no variant', () => {
      const { getEl } = createFixture({ height: '40px', width: '40px' });
      const el = getEl();

      expect(el.classList.contains('mzn-skeleton')).toBe(true);
      expect(el.classList.contains('mzn-skeleton--bg')).toBe(true);
    });

    it('should apply circle class', () => {
      const { getEl } = createFixture({
        circle: true,
        height: '40px',
        width: '40px',
      });

      expect(getEl().classList.contains('mzn-skeleton--circle')).toBe(true);
    });

    it('should apply height and width styles', () => {
      const { getEl } = createFixture({ height: '60px', width: '120px' });
      const el = getEl();

      expect(el.style.height).toBe('60px');
      expect(el.style.width).toBe('120px');
    });

    it('should handle numeric dimensions', () => {
      const { getEl } = createFixture({ height: 50, width: 100 });
      const el = getEl();

      expect(el.style.height).toBe('50px');
      expect(el.style.width).toBe('100px');
    });

    it('should not render bg span in square/circle mode', () => {
      const { getEl } = createFixture({ height: '40px' });

      expect(getEl().querySelector('.mzn-skeleton--bg')).toBeNull();
    });
  });

  it('should prefer height over variant (not strip mode)', () => {
    const { getEl } = createFixture({ variant: 'h3', height: '40px' });
    const el = getEl();

    expect(el.classList.contains('mzn-skeleton--strip--h3')).toBe(false);
    expect(el.classList.contains('mzn-skeleton--bg')).toBe(true);
  });
});
