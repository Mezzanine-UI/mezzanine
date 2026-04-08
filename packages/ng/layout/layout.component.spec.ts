import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { MznLayout } from './layout.component';
import { MznLayoutMain } from './layout-main.component';
import { MznLayoutLeftPanel } from './layout-left-panel.component';
import { MznLayoutRightPanel } from './layout-right-panel.component';

@Component({
  standalone: true,
  imports: [MznLayout, MznLayoutMain, MznLayoutLeftPanel, MznLayoutRightPanel],
  template: `
    <mzn-layout>
      <mzn-layout-left-panel [open]="leftOpen()"
        >Left Panel</mzn-layout-left-panel
      >
      <mzn-layout-main>Main Content</mzn-layout-main>
      <mzn-layout-right-panel [open]="rightOpen()"
        >Right Panel</mzn-layout-right-panel
      >
    </mzn-layout>
  `,
})
class TestHostComponent {
  readonly leftOpen = signal(false);
  readonly rightOpen = signal(false);
}

function createFixture(): {
  fixture: ComponentFixture<TestHostComponent>;
  host: TestHostComponent;
  getLayoutElement: () => HTMLElement;
} {
  const fixture = TestBed.createComponent(TestHostComponent);

  fixture.detectChanges();

  return {
    fixture,
    host: fixture.componentInstance,
    getLayoutElement: (): HTMLElement =>
      fixture.nativeElement.querySelector('mzn-layout')!,
  };
}

describe('MznLayout', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
  });

  it('should create layout with host class', () => {
    const { getLayoutElement } = createFixture();

    expect(getLayoutElement().classList.contains('mzn-layout')).toBe(true);
  });

  it('should render content-wrapper', () => {
    const { getLayoutElement } = createFixture();
    const wrapper = getLayoutElement().querySelector(
      '.mzn-layout__content-wrapper',
    );

    expect(wrapper).toBeTruthy();
  });

  it('should render main content', () => {
    const { getLayoutElement } = createFixture();
    const main = getLayoutElement().querySelector('mzn-layout-main');

    expect(main).toBeTruthy();
    expect(main?.classList.contains('mzn-layout__main')).toBe(true);

    const content = main?.querySelector('.mzn-layout__main__content');

    expect(content?.textContent?.trim()).toBe('Main Content');
  });

  it('should render left panel when open', () => {
    const { fixture, host, getLayoutElement } = createFixture();

    host.leftOpen.set(true);
    fixture.detectChanges();

    const panel = getLayoutElement().querySelector('mzn-layout-left-panel');

    expect(panel).toBeTruthy();

    const aside = panel?.querySelector('.mzn-layout__side-panel-content');

    expect(aside).toBeTruthy();
    expect(aside?.textContent?.trim()).toBe('Left Panel');
  });

  it('should hide left panel when closed', () => {
    const { getLayoutElement } = createFixture();
    const panel = getLayoutElement().querySelector('mzn-layout-left-panel');

    expect(panel?.querySelector('.mzn-layout__side-panel-content')).toBeNull();
  });

  it('should render right panel when open', () => {
    const { fixture, host, getLayoutElement } = createFixture();

    host.rightOpen.set(true);
    fixture.detectChanges();

    const panel = getLayoutElement().querySelector('mzn-layout-right-panel');

    expect(panel).toBeTruthy();

    const aside = panel?.querySelector('.mzn-layout__side-panel-content');

    expect(aside).toBeTruthy();
    expect(aside?.textContent?.trim()).toBe('Right Panel');
  });

  it('should apply side panel classes', () => {
    const { fixture, host, getLayoutElement } = createFixture();

    host.leftOpen.set(true);
    host.rightOpen.set(true);
    fixture.detectChanges();

    const leftPanel = getLayoutElement().querySelector('mzn-layout-left-panel');
    const rightPanel = getLayoutElement().querySelector(
      'mzn-layout-right-panel',
    );

    expect(leftPanel?.classList.contains('mzn-layout__side-panel')).toBe(true);
    expect(leftPanel?.classList.contains('mzn-layout__side-panel--left')).toBe(
      true,
    );
    expect(rightPanel?.classList.contains('mzn-layout__side-panel')).toBe(true);
    expect(
      rightPanel?.classList.contains('mzn-layout__side-panel--right'),
    ).toBe(true);
  });

  it('should render divider with separator role in left panel', () => {
    const { fixture, host, getLayoutElement } = createFixture();

    host.leftOpen.set(true);
    fixture.detectChanges();

    const divider = getLayoutElement().querySelector(
      'mzn-layout-left-panel [role="separator"]',
    );

    expect(divider).toBeTruthy();
    expect(divider?.classList.contains('mzn-layout__divider')).toBe(true);
  });

  it('should render divider with separator role in right panel', () => {
    const { fixture, host, getLayoutElement } = createFixture();

    host.rightOpen.set(true);
    fixture.detectChanges();

    const divider = getLayoutElement().querySelector(
      'mzn-layout-right-panel [role="separator"]',
    );

    expect(divider).toBeTruthy();
    expect(divider?.classList.contains('mzn-layout__divider')).toBe(true);
  });

  describe('divider ARIA attributes', () => {
    it('should have aria-orientation="vertical" on left panel divider', () => {
      const { fixture, host, getLayoutElement } = createFixture();

      host.leftOpen.set(true);
      fixture.detectChanges();

      const divider = getLayoutElement().querySelector(
        'mzn-layout-left-panel [role="separator"]',
      );

      expect(divider?.getAttribute('aria-orientation')).toBe('vertical');
      expect(divider?.getAttribute('aria-label')).toBe('Resize left panel');
      expect(divider?.getAttribute('aria-valuemin')).toBe('240');
      expect(divider?.getAttribute('aria-valuenow')).toBeTruthy();
      expect(divider?.getAttribute('tabindex')).toBe('0');
    });

    it('should have aria-orientation="vertical" on right panel divider', () => {
      const { fixture, host, getLayoutElement } = createFixture();

      host.rightOpen.set(true);
      fixture.detectChanges();

      const divider = getLayoutElement().querySelector(
        'mzn-layout-right-panel [role="separator"]',
      );

      expect(divider?.getAttribute('aria-orientation')).toBe('vertical');
      expect(divider?.getAttribute('aria-label')).toBe('Resize right panel');
      expect(divider?.getAttribute('aria-valuemin')).toBe('240');
      expect(divider?.getAttribute('aria-valuenow')).toBeTruthy();
      expect(divider?.getAttribute('tabindex')).toBe('0');
    });
  });

  describe('keyboard resize', () => {
    beforeEach(() => {
      // JSDOM has clientWidth=0 by default; mock a realistic viewport width
      Object.defineProperty(document.documentElement, 'clientWidth', {
        value: 1200,
        configurable: true,
      });
      // JSDOM has offsetWidth=0 for all elements; computeMaxWidth() reads
      // mainEl.offsetWidth, so mock it to allow expansion above current width
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
        value: 1200,
        configurable: true,
      });
    });

    it('should expand left panel width on ArrowRight', () => {
      const { fixture, host, getLayoutElement } = createFixture();

      host.leftOpen.set(true);
      fixture.detectChanges();

      const panel = getLayoutElement().querySelector(
        'mzn-layout-left-panel',
      ) as HTMLElement;
      const initialWidth = parseFloat(panel.style.inlineSize);
      const divider = panel.querySelector('[role="separator"]') as HTMLElement;

      divider.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
      );
      fixture.detectChanges();

      const newWidth = parseFloat(panel.style.inlineSize);

      expect(newWidth).toBe(initialWidth + 10);
    });

    it('should shrink left panel width on ArrowLeft', () => {
      const { fixture, host, getLayoutElement } = createFixture();

      host.leftOpen.set(true);
      fixture.detectChanges();

      const panel = getLayoutElement().querySelector(
        'mzn-layout-left-panel',
      ) as HTMLElement;
      const initialWidth = parseFloat(panel.style.inlineSize);
      const divider = panel.querySelector('[role="separator"]') as HTMLElement;

      divider.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }),
      );
      fixture.detectChanges();

      const newWidth = parseFloat(panel.style.inlineSize);

      expect(newWidth).toBe(initialWidth - 10);
    });

    it('should expand right panel width on ArrowLeft', () => {
      const { fixture, host, getLayoutElement } = createFixture();

      host.rightOpen.set(true);
      fixture.detectChanges();

      const panel = getLayoutElement().querySelector(
        'mzn-layout-right-panel',
      ) as HTMLElement;
      const initialWidth = parseFloat(panel.style.inlineSize);
      const divider = panel.querySelector('[role="separator"]') as HTMLElement;

      divider.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }),
      );
      fixture.detectChanges();

      const newWidth = parseFloat(panel.style.inlineSize);

      expect(newWidth).toBe(initialWidth + 10);
    });

    it('should not go below MIN_PANEL_WIDTH (240px)', () => {
      const { fixture, host, getLayoutElement } = createFixture();

      host.leftOpen.set(true);
      fixture.detectChanges();

      const panel = getLayoutElement().querySelector(
        'mzn-layout-left-panel',
      ) as HTMLElement;
      const divider = panel.querySelector('[role="separator"]') as HTMLElement;

      // Press ArrowLeft many times to try going below minimum
      for (let i = 0; i < 20; i++) {
        divider.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }),
        );
      }

      fixture.detectChanges();

      const newWidth = parseFloat(panel.style.inlineSize);

      expect(newWidth).toBe(240);
    });
  });

  describe('drag resize', () => {
    it('should apply dragging class on mousedown and remove on mouseup', () => {
      const { fixture, host, getLayoutElement } = createFixture();

      host.leftOpen.set(true);
      fixture.detectChanges();

      const divider = getLayoutElement().querySelector(
        'mzn-layout-left-panel [role="separator"]',
      ) as HTMLElement;

      divider.dispatchEvent(
        new MouseEvent('mousedown', { clientX: 320, bubbles: true }),
      );
      fixture.detectChanges();

      expect(divider.classList.contains('mzn-layout__divider--dragging')).toBe(
        true,
      );

      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      fixture.detectChanges();

      expect(divider.classList.contains('mzn-layout__divider--dragging')).toBe(
        false,
      );
    });
  });

  describe('initial width clamping', () => {
    it('should clamp defaultWidth to MIN_PANEL_WIDTH', () => {
      @Component({
        standalone: true,
        imports: [MznLayout, MznLayoutMain, MznLayoutLeftPanel],
        template: `
          <mzn-layout>
            <mzn-layout-left-panel [open]="true" [defaultWidth]="100"
              >Content</mzn-layout-left-panel
            >
            <mzn-layout-main>Main</mzn-layout-main>
          </mzn-layout>
        `,
      })
      class SmallWidthHost {}

      TestBed.configureTestingModule({ imports: [SmallWidthHost] });
      const fix = TestBed.createComponent(SmallWidthHost);

      fix.detectChanges();

      const panel = fix.nativeElement.querySelector(
        'mzn-layout-left-panel',
      ) as HTMLElement;

      expect(parseFloat(panel.style.inlineSize)).toBe(240);
    });
  });
});
