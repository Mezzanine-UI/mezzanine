import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MznScrollbar } from './scrollbar.component';

@Component({
  standalone: true,
  imports: [MznScrollbar],
  template: `
    <mzn-scrollbar
      [defer]="defer"
      [disabled]="disabled"
      [maxHeight]="maxHeight"
      [maxWidth]="maxWidth"
      (viewportReady)="onViewportReady($event)"
    >
      <p>Content</p>
    </mzn-scrollbar>
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
    const el = fixture.nativeElement.querySelector('mzn-scrollbar');

    expect(el.classList.contains('mzn-scrollbar')).toBe(true);
  });

  it('should remove host class when disabled', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.disabled = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('mzn-scrollbar');

    expect(el.classList.contains('mzn-scrollbar')).toBe(false);
  });

  it('should apply maxHeight style', () => {
    const { fixture } = createFixture(TestHostComponent);
    const el = fixture.nativeElement.querySelector('mzn-scrollbar');

    expect(el.style.maxHeight).toBe('200px');
  });

  it('should apply maxWidth style', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.maxWidth = '400px';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('mzn-scrollbar');

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
