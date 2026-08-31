import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MznInlineMessage } from './inline-message.component';

@Component({
  standalone: true,
  imports: [MznInlineMessage],
  template: `
    <div
      mznInlineMessage
      [severity]="severity"
      [content]="content"
      (closed)="onClosed()"
    ></div>
  `,
})
class TestHostComponent {
  severity: 'info' | 'warning' | 'error' = 'info';
  content = 'Test message';
  closedCount = 0;
  onClosed(): void {
    this.closedCount++;
  }
}

/** Consumer overriding the live-region defaults. */
@Component({
  standalone: true,
  imports: [MznInlineMessage],
  template: `
    <div
      mznInlineMessage
      severity="error"
      content="送出失敗"
      role="alert"
      aria-live="assertive"
    ></div>
  `,
})
class OverriddenLiveRegionHost {}

function createFixture(overrides: Partial<TestHostComponent> = {}): {
  fixture: ReturnType<typeof TestBed.createComponent<TestHostComponent>>;
  host: TestHostComponent;
} {
  const fixture = TestBed.createComponent(TestHostComponent);
  const host = fixture.componentInstance;

  Object.assign(host, overrides);
  fixture.detectChanges();

  return { fixture, host };
}

describe('MznInlineMessage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
  });

  it('should render the inline message', () => {
    const { fixture } = createFixture();
    const el = fixture.nativeElement.querySelector('.mzn-inline-message');

    expect(el).toBeTruthy();
  });

  it('should display content text', () => {
    const { fixture } = createFixture({ content: 'Hello world' });

    expect(fixture.nativeElement.textContent).toContain('Hello world');
  });

  it('should apply severity class', () => {
    const { fixture } = createFixture({ severity: 'error' });
    const el = fixture.nativeElement.querySelector('.mzn-inline-message');

    expect(el.classList.contains('mzn-inline-message--error')).toBe(true);
  });

  it('should show close button only for info severity', () => {
    const { fixture: infoFixture } = createFixture({ severity: 'info' });
    const closeInfo =
      infoFixture.nativeElement.querySelector('[mznClearActions]');

    expect(closeInfo).toBeTruthy();

    const { fixture: errorFixture } = createFixture({ severity: 'error' });
    const closeError =
      errorFixture.nativeElement.querySelector('[mznClearActions]');

    expect(closeError).toBeNull();
  });

  it('should have accessibility attributes', () => {
    const { fixture } = createFixture();
    const el = fixture.nativeElement.querySelector('.mzn-inline-message');

    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-live')).toBe('polite');
  });
  describe('live region', () => {
    it('should default to a polite status region', () => {
      const { fixture } = createFixture();
      const el = fixture.nativeElement.querySelector(
        '[mznInlineMessage]',
      ) as HTMLElement;

      expect(el.getAttribute('role')).toBe('status');
      expect(el.getAttribute('aria-live')).toBe('polite');
    });

    it('should let the caller override role and aria-live', () => {
      const fixture = TestBed.createComponent(OverriddenLiveRegionHost);

      fixture.detectChanges();

      // role="status" + aria-live="polite" queues behind whatever is being
      // announced; a failed destructive action needs to interrupt.
      const el = fixture.nativeElement.querySelector(
        '[mznInlineMessage]',
      ) as HTMLElement;

      expect(el.getAttribute('role')).toBe('alert');
      expect(el.getAttribute('aria-live')).toBe('assertive');
    });
  });
});
