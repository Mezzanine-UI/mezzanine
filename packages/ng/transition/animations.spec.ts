import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  mznFadeAnimation,
  mznCollapseAnimation,
  mznScaleAnimation,
  mznSlideRightAnimation,
  mznSlideTopAnimation,
  mznRotateAnimation,
  mznTranslateTopAnimation,
  mznTranslateBottomAnimation,
  mznTranslateLeftAnimation,
  mznTranslateRightAnimation,
} from './animations';
import { MznCollapse } from './collapse.directive';
import { MznFade } from './fade.directive';
import { MznRotate } from './rotate.directive';
import { MznScale } from './scale.directive';
import { MznSlide } from './slide.directive';
import { MznTranslate } from './translate.directive';

// ─── Animation Trigger Tests ─────────────────────

@Component({
  standalone: true,
  imports: [],
  animations: [
    mznFadeAnimation,
    mznCollapseAnimation,
    mznScaleAnimation,
    mznSlideRightAnimation,
    mznSlideTopAnimation,
    mznRotateAnimation,
    mznTranslateTopAnimation,
    mznTranslateBottomAnimation,
    mznTranslateLeftAnimation,
    mznTranslateRightAnimation,
  ],
  template: `
    @if (showFade) {
      <div @mznFade class="fade">fade</div>
    }
    <div [@mznCollapse]="collapsed" class="collapse">collapse</div>
    @if (showScale) {
      <div @mznScale class="scale">scale</div>
    }
    @if (showSlideRight) {
      <div @mznSlideRight class="slide-right">slide</div>
    }
    @if (showSlideTop) {
      <div @mznSlideTop class="slide-top">slide</div>
    }
    <div [@mznRotate]="rotated" class="rotate">rotate</div>
    @if (showTranslateTop) {
      <div @mznTranslateTop class="translate-top">translate</div>
    }
    @if (showTranslateBottom) {
      <div @mznTranslateBottom class="translate-bottom">translate</div>
    }
    @if (showTranslateLeft) {
      <div @mznTranslateLeft class="translate-left">translate</div>
    }
    @if (showTranslateRight) {
      <div @mznTranslateRight class="translate-right">translate</div>
    }
  `,
})
class TriggerTestHostComponent {
  showFade = true;
  collapsed = false;
  showScale = true;
  showSlideRight = true;
  showSlideTop = true;
  rotated = false;
  showTranslateTop = true;
  showTranslateBottom = true;
  showTranslateLeft = true;
  showTranslateRight = true;
}

function createTriggerFixture(
  overrides: Partial<TriggerTestHostComponent> = {},
): {
  fixture: ReturnType<typeof TestBed.createComponent<TriggerTestHostComponent>>;
  host: TriggerTestHostComponent;
} {
  const fixture = TestBed.createComponent(TriggerTestHostComponent);
  const host = fixture.componentInstance;

  Object.assign(host, overrides);
  fixture.detectChanges();

  return { fixture, host };
}

describe('Animation Triggers', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TriggerTestHostComponent, NoopAnimationsModule],
    });
  });

  describe('mznFadeAnimation', () => {
    it('should render the element when visible', () => {
      const { fixture } = createTriggerFixture({ showFade: true });
      const el = fixture.nativeElement.querySelector('.fade') as HTMLElement;

      expect(el).toBeTruthy();
    });

    it('should start leave animation when hidden', () => {
      const { fixture, host } = createTriggerFixture({ showFade: true });

      expect(() => {
        host.showFade = false;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        fixture.detectChanges();
      }).not.toThrow();
    });
  });

  describe('mznCollapseAnimation', () => {
    it('should render the collapse element', () => {
      const { fixture } = createTriggerFixture({ collapsed: false });
      const el = fixture.nativeElement.querySelector(
        '.collapse',
      ) as HTMLElement;

      expect(el).toBeTruthy();
    });

    it('should toggle state without error', () => {
      const { fixture, host } = createTriggerFixture({ collapsed: false });

      host.collapsed = true;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      fixture.detectChanges();

      const el = fixture.nativeElement.querySelector(
        '.collapse',
      ) as HTMLElement;

      expect(el).toBeTruthy();
    });
  });

  describe('mznScaleAnimation', () => {
    it('should render the element when visible', () => {
      const { fixture } = createTriggerFixture({ showScale: true });
      const el = fixture.nativeElement.querySelector('.scale') as HTMLElement;

      expect(el).toBeTruthy();
    });

    it('should start leave animation when hidden', () => {
      const { fixture, host } = createTriggerFixture({ showScale: true });

      expect(() => {
        host.showScale = false;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        fixture.detectChanges();
      }).not.toThrow();
    });
  });

  describe('mznSlideRightAnimation', () => {
    it('should render the element when visible', () => {
      const { fixture } = createTriggerFixture({ showSlideRight: true });
      const el = fixture.nativeElement.querySelector(
        '.slide-right',
      ) as HTMLElement;

      expect(el).toBeTruthy();
    });
  });

  describe('mznSlideTopAnimation', () => {
    it('should render the element when visible', () => {
      const { fixture } = createTriggerFixture({ showSlideTop: true });
      const el = fixture.nativeElement.querySelector(
        '.slide-top',
      ) as HTMLElement;

      expect(el).toBeTruthy();
    });
  });

  describe('mznRotateAnimation', () => {
    it('should render with initial state', () => {
      const { fixture } = createTriggerFixture({ rotated: false });
      const el = fixture.nativeElement.querySelector('.rotate') as HTMLElement;

      expect(el).toBeTruthy();
    });

    it('should toggle rotation without error', () => {
      const { fixture, host } = createTriggerFixture({ rotated: false });

      host.rotated = true;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      fixture.detectChanges();

      const el = fixture.nativeElement.querySelector('.rotate') as HTMLElement;

      expect(el).toBeTruthy();
    });
  });

  describe('mznTranslate animations', () => {
    it('should render translate-top element', () => {
      const { fixture } = createTriggerFixture({ showTranslateTop: true });

      expect(
        fixture.nativeElement.querySelector('.translate-top'),
      ).toBeTruthy();
    });

    it('should render translate-bottom element', () => {
      const { fixture } = createTriggerFixture({ showTranslateBottom: true });

      expect(
        fixture.nativeElement.querySelector('.translate-bottom'),
      ).toBeTruthy();
    });

    it('should render translate-left element', () => {
      const { fixture } = createTriggerFixture({ showTranslateLeft: true });

      expect(
        fixture.nativeElement.querySelector('.translate-left'),
      ).toBeTruthy();
    });

    it('should render translate-right element', () => {
      const { fixture } = createTriggerFixture({ showTranslateRight: true });

      expect(
        fixture.nativeElement.querySelector('.translate-right'),
      ).toBeTruthy();
    });
  });
});

// ─── Directive/Component Wrapper Tests ───────────

@Component({
  standalone: true,
  imports: [MznCollapse],
  template: `
    <mzn-collapse [in]="expanded" [collapsedHeight]="collapsedHeight">
      <div class="collapse-content" style="height: 100px;">Content</div>
    </mzn-collapse>
  `,
})
class CollapseTestComponent {
  expanded = false;
  collapsedHeight: string | number = 0;
}

@Component({
  standalone: true,
  imports: [MznFade],
  template: `
    <mzn-fade [in]="visible">
      <div class="fade-content">Fade content</div>
    </mzn-fade>
  `,
})
class FadeTestComponent {
  visible = false;
}

@Component({
  standalone: true,
  imports: [MznRotate],
  template: `
    <span mznRotate [in]="rotated" [degrees]="degrees" class="rotate-target"
      >arrow</span
    >
  `,
})
class RotateTestComponent {
  rotated = false;
  degrees = 180;
}

@Component({
  standalone: true,
  imports: [MznScale],
  template: `
    <mzn-scale [in]="visible" [transformOrigin]="origin">
      <div class="scale-content">Scale content</div>
    </mzn-scale>
  `,
})
class ScaleTestComponent {
  visible = false;
  origin = 'center';
}

@Component({
  standalone: true,
  imports: [MznSlide],
  template: `
    <mzn-slide [in]="visible" [from]="from">
      <div class="slide-content">Slide content</div>
    </mzn-slide>
  `,
})
class SlideTestComponent {
  visible = false;
  from: 'right' | 'top' = 'right';
}

@Component({
  standalone: true,
  imports: [MznTranslate],
  template: `
    <mzn-translate [in]="visible" [from]="from">
      <div class="translate-content">Translate content</div>
    </mzn-translate>
  `,
})
class TranslateTestComponent {
  visible = false;
  from: 'top' | 'bottom' | 'left' | 'right' = 'top';
}

describe('MznCollapse', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CollapseTestComponent],
    });
  });

  it('should render projected content', () => {
    const fixture = TestBed.createComponent(CollapseTestComponent);

    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(
      '.collapse-content',
    ) as HTMLElement;

    expect(el).toBeTruthy();
    expect(el.textContent).toBe('Content');
  });

  it('should set visibility hidden when collapsed with 0 height', () => {
    const fixture = TestBed.createComponent(CollapseTestComponent);

    fixture.detectChanges();
    const root = fixture.nativeElement.querySelector(
      'mzn-collapse > div',
    ) as HTMLElement;

    expect(root.style.visibility).toBe('hidden');
  });

  it('should toggle expand without error', () => {
    const fixture = TestBed.createComponent(CollapseTestComponent);
    const host = fixture.componentInstance;

    fixture.detectChanges();

    expect(() => {
      host.expanded = true;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
    }).not.toThrow();
  });
});

describe('MznFade', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FadeTestComponent],
    });
  });

  it('should render projected content', () => {
    const fixture = TestBed.createComponent(FadeTestComponent);

    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(
      '.fade-content',
    ) as HTMLElement;

    expect(el).toBeTruthy();
  });

  it('should set opacity 0 and visibility hidden when not in', () => {
    const fixture = TestBed.createComponent(FadeTestComponent);

    fixture.detectChanges();
    const root = fixture.nativeElement.querySelector(
      'mzn-fade > div',
    ) as HTMLElement;

    expect(root.style.opacity).toBe('0');
    expect(root.style.visibility).toBe('hidden');
  });

  it('should toggle visible without error', () => {
    const fixture = TestBed.createComponent(FadeTestComponent);
    const host = fixture.componentInstance;

    fixture.detectChanges();

    expect(() => {
      host.visible = true;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
    }).not.toThrow();
  });
});

describe('MznRotate', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RotateTestComponent],
    });
  });

  it('should render the host element', () => {
    const fixture = TestBed.createComponent(RotateTestComponent);

    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(
      '.rotate-target',
    ) as HTMLElement;

    expect(el).toBeTruthy();
  });

  it('should apply rotate(0deg) when not in', () => {
    const fixture = TestBed.createComponent(RotateTestComponent);

    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(
      '.rotate-target',
    ) as HTMLElement;

    expect(el.style.transform).toBe('rotate(0deg)');
  });

  it('should apply rotation when in is true', () => {
    const fixture = TestBed.createComponent(RotateTestComponent);
    const host = fixture.componentInstance;

    host.rotated = true;
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(
      '.rotate-target',
    ) as HTMLElement;

    expect(el.style.transform).toBe('rotate(180deg)');
  });

  it('should support custom degrees', () => {
    const fixture = TestBed.createComponent(RotateTestComponent);
    const host = fixture.componentInstance;

    host.rotated = true;
    host.degrees = 90;
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(
      '.rotate-target',
    ) as HTMLElement;

    expect(el.style.transform).toBe('rotate(90deg)');
  });
});

describe('MznScale', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ScaleTestComponent],
    });
  });

  it('should render projected content', () => {
    const fixture = TestBed.createComponent(ScaleTestComponent);

    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(
      '.scale-content',
    ) as HTMLElement;

    expect(el).toBeTruthy();
  });

  it('should set initial exited styles', () => {
    const fixture = TestBed.createComponent(ScaleTestComponent);

    fixture.detectChanges();
    const root = fixture.nativeElement.querySelector(
      'mzn-scale > div',
    ) as HTMLElement;

    expect(root.style.opacity).toBe('0');
    expect(root.style.transform).toContain('scale');
  });
});

describe('MznSlide', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SlideTestComponent],
    });
  });

  it('should render projected content', () => {
    const fixture = TestBed.createComponent(SlideTestComponent);

    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(
      '.slide-content',
    ) as HTMLElement;

    expect(el).toBeTruthy();
  });

  it('should set initial transform for right slide', () => {
    const fixture = TestBed.createComponent(SlideTestComponent);

    fixture.detectChanges();
    const root = fixture.nativeElement.querySelector(
      'mzn-slide > div',
    ) as HTMLElement;

    expect(root.style.transform).toContain('100%');
  });
});

describe('MznTranslate', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateTestComponent],
    });
  });

  it('should render projected content', () => {
    const fixture = TestBed.createComponent(TranslateTestComponent);

    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(
      '.translate-content',
    ) as HTMLElement;

    expect(el).toBeTruthy();
  });

  it('should set initial transform for top translate', () => {
    const fixture = TestBed.createComponent(TranslateTestComponent);

    fixture.detectChanges();
    const root = fixture.nativeElement.querySelector(
      'mzn-translate > div',
    ) as HTMLElement;

    expect(root.style.opacity).toBe('0');
    expect(root.style.transform).toContain('-4px');
  });
});
