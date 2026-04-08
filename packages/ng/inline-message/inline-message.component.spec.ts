import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MznInlineMessage } from './inline-message.component';

@Component({
  standalone: true,
  imports: [MznInlineMessage],
  template: `
    <mzn-inline-message
      [severity]="severity"
      [content]="content"
      (closed)="onClosed()"
    />
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
      infoFixture.nativeElement.querySelector('mzn-clear-actions');

    expect(closeInfo).toBeTruthy();

    const { fixture: errorFixture } = createFixture({ severity: 'error' });
    const closeError =
      errorFixture.nativeElement.querySelector('mzn-clear-actions');

    expect(closeError).toBeNull();
  });

  it('should have accessibility attributes', () => {
    const { fixture } = createFixture();
    const el = fixture.nativeElement.querySelector('.mzn-inline-message');

    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-live')).toBe('polite');
  });
});
