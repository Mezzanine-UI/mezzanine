import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OverlayScrollbars, type PartialOptions } from 'overlayscrollbars';
import { MznScrollbar } from './scrollbar.component';

@Component({
  standalone: true,
  imports: [MznScrollbar],
  template: `
    <div
      mznScrollbar
      [defer]="defer"
      [disabled]="disabled"
      [maxHeight]="maxHeight"
      [maxWidth]="maxWidth"
      (viewportReady)="onViewportReady($event)"
    >
      <p>Content</p>
    </div>
  `,
})
class TestHostComponent {
  defer: boolean | { timeout?: number } = false;
  disabled = false;
  maxHeight = '200px';
  maxWidth: string | undefined = undefined;
  viewportReadyPayload: {
    viewport: HTMLDivElement;
    instance?: unknown;
  } | null = null;

  onViewportReady(payload: {
    viewport: HTMLDivElement;
    instance?: unknown;
  }): void {
    this.viewportReadyPayload = payload;
  }
}

function createFixture<T>(component: new () => T): {
  fixture: ReturnType<typeof TestBed.createComponent<T>>;
  host: T;
} {
  const fixture = TestBed.createComponent(component);

  fixture.detectChanges();

  return { fixture, host: fixture.componentInstance };
}

describe('MznScrollbar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
  });

  it('should render with host class when enabled', () => {
    const { fixture } = createFixture(TestHostComponent);
    const el = fixture.nativeElement.querySelector('[mznScrollbar]');

    expect(el.classList.contains('mzn-scrollbar')).toBe(true);
  });

  it('should remove host class when disabled', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.disabled = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('[mznScrollbar]');

    expect(el.classList.contains('mzn-scrollbar')).toBe(false);
  });

  it('should apply maxHeight style', () => {
    const { fixture } = createFixture(TestHostComponent);
    const el = fixture.nativeElement.querySelector('[mznScrollbar]');

    expect(el.style.maxHeight).toBe('200px');
  });

  it('should apply maxWidth style', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.maxWidth = '400px';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('[mznScrollbar]');

    expect(el.style.maxWidth).toBe('400px');
  });

  it('should render projected content', () => {
    const { fixture } = createFixture(TestHostComponent);

    expect(fixture.nativeElement.textContent).toContain('Content');
  });

  it('should emit viewportReady with viewport element when disabled', async () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.disabled = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    await fixture.whenStable();

    expect(host.viewportReadyPayload).toBeTruthy();
    expect(host.viewportReadyPayload?.viewport).toBeTruthy();
  });
});

@Component({
  standalone: true,
  imports: [MznScrollbar],
  template: `
    <div mznScrollbar [defer]="false" [options]="options">
      <p>Content</p>
    </div>
  `,
})
class OptionsHostComponent {
  options: PartialOptions | undefined = undefined;
}

describe('MznScrollbar options', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [OptionsHostComponent] });
  });

  async function getOptions(
    options: PartialOptions | undefined,
  ): Promise<ReturnType<OverlayScrollbars['options']>> {
    const fixture = TestBed.createComponent(OptionsHostComponent);

    fixture.componentInstance.options = options;
    fixture.detectChanges();
    await fixture.whenStable();

    const el = fixture.nativeElement.querySelector('[mznScrollbar]');
    const instance = OverlayScrollbars(el);

    if (!instance) throw new Error('OverlayScrollbars was not initialised');

    return instance.options();
  }

  it('should scroll on both axes and auto-hide by default', async () => {
    const options = await getOptions(undefined);

    expect(options.overflow).toEqual({ x: 'scroll', y: 'scroll' });
    expect(options.scrollbars.autoHide).toBe('scroll');
    expect(options.scrollbars.autoHideDelay).toBe(600);
  });

  it('should respect a caller-supplied options.overflow', async () => {
    const options = await getOptions({ overflow: { x: 'hidden' } });

    expect(options.overflow).toEqual({ x: 'hidden', y: 'scroll' });
  });
});
