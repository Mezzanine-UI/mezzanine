import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PlusIcon, MinusIcon } from '@mezzanine-ui/icons';
import { MznSlider } from './slider.component';

@Component({
  standalone: true,
  imports: [MznSlider, FormsModule],
  template: `
    <mzn-slider
      [(ngModel)]="value"
      [disabled]="disabled"
      [min]="min"
      [max]="max"
      [step]="step"
      [prefixIcon]="prefixIcon"
      [suffixIcon]="suffixIcon"
    />
  `,
})
class TestHostComponent {
  disabled = false;
  max = 100;
  min = 0;
  step = 1;
  value: number | [number, number] = 50;
  prefixIcon?: typeof PlusIcon;
  suffixIcon?: typeof PlusIcon;
}

async function createFixture(
  overrides: Partial<TestHostComponent> = {},
): Promise<{
  fixture: ComponentFixture<TestHostComponent>;
  host: TestHostComponent;
  getSlider: () => HTMLElement;
}> {
  const fixture = TestBed.createComponent(TestHostComponent);
  const host = fixture.componentInstance;

  Object.assign(host, overrides);
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();

  return {
    fixture,
    host,
    getSlider: (): HTMLElement =>
      fixture.nativeElement.querySelector('mzn-slider')!,
  };
}

describe('MznSlider', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
  });

  it('should render with host class', async () => {
    const { getSlider } = await createFixture();

    expect(getSlider().classList.contains('mzn-slider')).toBe(true);
  });

  it('should render rail and track', async () => {
    const { getSlider } = await createFixture();
    const rail = getSlider().querySelector('.mzn-slider__rail');
    const track = getSlider().querySelector('.mzn-slider__track');

    expect(rail).toBeTruthy();
    expect(track).toBeTruthy();
  });

  describe('single mode', () => {
    it('should render one handler', async () => {
      const { getSlider } = await createFixture({ value: 50 });
      const handlers = getSlider().querySelectorAll('[role="slider"]');

      expect(handlers.length).toBe(1);
    });

    it('should set aria attributes', async () => {
      const { getSlider } = await createFixture({
        value: 50,
        min: 0,
        max: 100,
      });
      const handler = getSlider().querySelector('[role="slider"]')!;

      expect(handler.getAttribute('aria-valuemin')).toBe('0');
      expect(handler.getAttribute('aria-valuemax')).toBe('100');
      expect(handler.getAttribute('aria-valuenow')).toBe('50');
    });
  });

  describe('range mode', () => {
    it('should render two handlers', async () => {
      const { getSlider } = await createFixture({
        value: [20, 80] as [number, number],
      });
      const handlers = getSlider().querySelectorAll('[role="slider"]');

      expect(handlers.length).toBe(2);
    });

    it('should set aria-valuenow on both handlers', async () => {
      const { getSlider } = await createFixture({
        value: [20, 80] as [number, number],
      });
      const handlers = getSlider().querySelectorAll('[role="slider"]');

      expect(handlers[0].getAttribute('aria-valuenow')).toBe('20');
      expect(handlers[1].getAttribute('aria-valuenow')).toBe('80');
    });
  });

  describe('disabled', () => {
    it('should apply disabled class', async () => {
      const { getSlider } = await createFixture({ disabled: true });

      expect(getSlider().classList.contains('mzn-slider--disabled')).toBe(true);
    });

    it('should set aria-disabled on handler', async () => {
      const { getSlider } = await createFixture({ disabled: true });
      const handler = getSlider().querySelector('[role="slider"]')!;

      expect(handler.getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('prefix/suffix icons', () => {
    it('should render prefix icon', async () => {
      const { getSlider } = await createFixture({ prefixIcon: MinusIcon });

      expect(getSlider().querySelector('i[mznIcon]')).toBeTruthy();
    });

    it('should render suffix icon', async () => {
      const { getSlider } = await createFixture({ suffixIcon: PlusIcon });

      expect(getSlider().querySelector('i[mznIcon]')).toBeTruthy();
    });

    it('should render both icons', async () => {
      const { getSlider } = await createFixture({
        prefixIcon: MinusIcon,
        suffixIcon: PlusIcon,
      });

      expect(getSlider().querySelectorAll('i[mznIcon]').length).toBe(2);
    });

    it('icon buttons should have role=button and tabindex', async () => {
      const { getSlider } = await createFixture({
        prefixIcon: MinusIcon,
        suffixIcon: PlusIcon,
      });
      const icons = getSlider().querySelectorAll('[role="button"]');

      expect(icons.length).toBe(2);
      icons.forEach((icon) => {
        expect(icon.getAttribute('tabindex')).toBe('0');
      });
    });
  });

  describe('css vars', () => {
    it('should apply css vars for single value', async () => {
      const { getSlider } = await createFixture({ value: 50 });
      const el = getSlider();

      // Should have slider css vars on the host
      expect(el.style.cssText).toBeTruthy();
    });
  });
});
