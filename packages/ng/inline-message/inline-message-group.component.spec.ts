import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  InlineMessageGroupItem,
  MznInlineMessageGroup,
} from './inline-message-group.component';

@Component({
  standalone: true,
  imports: [MznInlineMessageGroup],
  template: `
    <mzn-inline-message-group
      [items]="items"
      (itemClose)="onItemClose($event)"
    />
  `,
})
class TestHostComponent {
  items: ReadonlyArray<InlineMessageGroupItem> = [];
  closedKeys: Array<string | number> = [];

  onItemClose(key: string | number): void {
    this.closedKeys.push(key);
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

describe('MznInlineMessageGroup', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
  });

  it('should render with host class mzn-inline-message-group', () => {
    const { fixture } = createFixture();
    const el = fixture.nativeElement.querySelector('.mzn-inline-message-group');

    expect(el).toBeTruthy();
  });

  it('should have role="region" and aria-live="polite"', () => {
    const { fixture } = createFixture();
    const el = fixture.nativeElement.querySelector('mzn-inline-message-group');

    expect(el.getAttribute('role')).toBe('region');
    expect(el.getAttribute('aria-live')).toBe('polite');
  });

  it('should render items as MznInlineMessage components', () => {
    const items: ReadonlyArray<InlineMessageGroupItem> = [
      { key: 'info-1', severity: 'info', content: 'Info message' },
      { key: 'error-1', severity: 'error', content: 'Error message' },
    ];
    const { fixture } = createFixture({ items });
    const messages =
      fixture.nativeElement.querySelectorAll('mzn-inline-message');

    expect(messages.length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Info message');
    expect(fixture.nativeElement.textContent).toContain('Error message');
  });

  it('should emit itemClose with key when item is closed', () => {
    const items: ReadonlyArray<InlineMessageGroupItem> = [
      { key: 'info-1', severity: 'info', content: 'Info message' },
    ];
    const { fixture, host } = createFixture({ items });
    const clearBtn = fixture.nativeElement.querySelector(
      'mzn-clear-actions button',
    );

    clearBtn?.click();
    fixture.detectChanges();

    expect(host.closedKeys).toContain('info-1');
  });
});
