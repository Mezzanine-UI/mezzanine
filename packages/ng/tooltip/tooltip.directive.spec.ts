import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MznTooltip } from './tooltip.directive';

@Component({
  standalone: true,
  imports: [MznTooltip],
  template: `
    <button
      [mznTooltip]="title"
      [tooltipPlacement]="placement"
      [tooltipArrow]="arrow"
      [tooltipOffset]="tooltipOffset"
      class="trigger"
    >
      Hover me
    </button>
  `,
})
class TestHostComponent {
  title = 'Tooltip text';
  placement: 'top' | 'bottom' | 'left' | 'right' = 'top';
  arrow = true;
  tooltipOffset = 4;
}

function createFixture(overrides: Partial<TestHostComponent> = {}): {
  fixture: ReturnType<typeof TestBed.createComponent<TestHostComponent>>;
  host: TestHostComponent;
  getTrigger: () => HTMLElement;
} {
  const fixture = TestBed.createComponent(TestHostComponent);
  const host = fixture.componentInstance;

  Object.assign(host, overrides);
  fixture.detectChanges();

  return {
    fixture,
    host,
    getTrigger: () =>
      fixture.nativeElement.querySelector('.trigger') as HTMLElement,
  };
}

describe('MznTooltip', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
  });

  afterEach(() => {
    document.querySelectorAll('.mzn-tooltip').forEach((el) => el.remove());
  });

  it('should not show tooltip initially', () => {
    createFixture();

    const tooltip = document.querySelector(
      '.mzn-tooltip',
    ) as HTMLElement | null;

    expect(tooltip).toBeNull();
  });

  it('should show tooltip on mouseenter', () => {
    const { getTrigger } = createFixture();

    getTrigger().dispatchEvent(new MouseEvent('mouseenter'));

    const tooltip = document.querySelector('.mzn-tooltip') as HTMLElement;

    expect(tooltip).toBeTruthy();
    expect(tooltip.textContent).toContain('Tooltip text');
  });

  it('should hide tooltip on mouseleave after delay', fakeAsync(() => {
    const { getTrigger } = createFixture();

    getTrigger().dispatchEvent(new MouseEvent('mouseenter'));

    expect(document.querySelector('.mzn-tooltip')).toBeTruthy();

    getTrigger().dispatchEvent(new MouseEvent('mouseleave'));
    tick(150);

    const tooltip = document.querySelector('.mzn-tooltip') as HTMLElement;

    expect(tooltip.style.display).toBe('none');
  }));

  it('should render arrow element when tooltipArrow is true', () => {
    const { getTrigger } = createFixture({ arrow: true });

    getTrigger().dispatchEvent(new MouseEvent('mouseenter'));

    expect(document.querySelector('.mzn-tooltip__arrow')).toBeTruthy();
  });

  it('should not render arrow when tooltipArrow is false', () => {
    const { getTrigger } = createFixture({ arrow: false });

    getTrigger().dispatchEvent(new MouseEvent('mouseenter'));

    expect(document.querySelector('.mzn-tooltip__arrow')).toBeNull();
  });

  it('should not show tooltip when title is empty', () => {
    const { getTrigger } = createFixture({ title: '' });

    getTrigger().dispatchEvent(new MouseEvent('mouseenter'));

    expect(document.querySelector('.mzn-tooltip')).toBeNull();
  });

  it('should clean up on destroy', fakeAsync(() => {
    const { fixture, getTrigger } = createFixture();

    getTrigger().dispatchEvent(new MouseEvent('mouseenter'));

    expect(document.querySelector('.mzn-tooltip')).toBeTruthy();

    fixture.destroy();
    tick(200);

    const tooltip = document.querySelector(
      '.mzn-tooltip',
    ) as HTMLElement | null;

    expect(tooltip === null || tooltip.style.display === 'none').toBe(true);
  }));
  describe('accessibility', () => {
    function getTooltip(): HTMLElement | null {
      return document.querySelector<HTMLElement>('.mzn-tooltip');
    }

    function isShown(): boolean {
      const el = getTooltip();

      return el !== null && el.style.display !== 'none';
    }

    it('should open on keyboard focus and close on blur', () => {
      const { getTrigger } = createFixture();
      const trigger = getTrigger();

      expect(isShown()).toBe(false);

      trigger.dispatchEvent(new FocusEvent('focus'));

      expect(isShown()).toBe(true);
      expect(getTooltip()!.textContent).toContain('Tooltip text');

      trigger.dispatchEvent(new FocusEvent('blur'));

      expect(isShown()).toBe(false);
    });

    it('should expose the tooltip through role and aria-describedby', () => {
      const { fixture, getTrigger } = createFixture();
      const trigger = getTrigger();

      expect(trigger.getAttribute('aria-describedby')).toBeNull();

      trigger.dispatchEvent(new FocusEvent('focus'));
      fixture.detectChanges();

      const describedBy = trigger.getAttribute('aria-describedby');

      expect(describedBy).toBeTruthy();

      const tooltip = document.getElementById(describedBy!);

      expect(tooltip).not.toBeNull();
      expect(tooltip!.getAttribute('role')).toBe('tooltip');
      expect(tooltip!.textContent).toContain('Tooltip text');
    });

    it('should dismiss on Escape while the pointer stays on the trigger', () => {
      const { getTrigger } = createFixture();
      const trigger = getTrigger();

      trigger.dispatchEvent(new MouseEvent('mouseenter'));

      expect(isShown()).toBe(true);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(isShown()).toBe(false);
    });

    it('should reopen after an Escape dismissal once entered again', () => {
      const { getTrigger } = createFixture();
      const trigger = getTrigger();

      trigger.dispatchEvent(new MouseEvent('mouseenter'));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(isShown()).toBe(false);

      trigger.dispatchEvent(new MouseEvent('mouseenter'));

      expect(isShown()).toBe(true);
    });

    it('should stay open on blur while the pointer is still over the trigger', () => {
      const { getTrigger } = createFixture();
      const trigger = getTrigger();

      trigger.dispatchEvent(new MouseEvent('mouseenter'));
      trigger.dispatchEvent(new FocusEvent('focus'));
      trigger.dispatchEvent(new FocusEvent('blur'));

      expect(isShown()).toBe(true);
    });
  });
});
