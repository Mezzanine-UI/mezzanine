import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MznAlertBanner, AlertBannerAction } from './alert-banner.component';

@Component({
  standalone: true,
  imports: [MznAlertBanner],
  template: `
    <mzn-alert-banner
      [severity]="severity"
      [message]="message"
      [closable]="closable"
      [actions]="actions"
      (closed)="onClosed()"
    />
  `,
})
class TestHostComponent {
  severity: 'info' | 'warning' | 'error' = 'info';
  message = 'Test alert';
  closable = true;
  actions: AlertBannerAction[] = [];
  onClosed = jest.fn();
}

function createFixture(overrides: Partial<TestHostComponent> = {}): {
  fixture: ReturnType<typeof TestBed.createComponent<TestHostComponent>>;
  host: TestHostComponent;
  getHostElement: () => HTMLElement;
} {
  const fixture = TestBed.createComponent(TestHostComponent);
  const host = fixture.componentInstance;

  Object.assign(host, overrides);
  fixture.detectChanges();

  return {
    fixture,
    host,
    getHostElement: () =>
      fixture.nativeElement.querySelector('.mzn-alert-banner') as HTMLElement,
  };
}

describe('MznAlertBanner', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent, NoopAnimationsModule],
    });
  });

  it('should render with host class', () => {
    const { getHostElement } = createFixture();

    expect(getHostElement()).toBeTruthy();
    expect(getHostElement().classList.contains('mzn-alert-banner')).toBe(true);
  });

  it('should apply severity class', () => {
    const { getHostElement } = createFixture({ severity: 'warning' });

    expect(
      getHostElement().classList.contains('mzn-alert-banner--warning'),
    ).toBe(true);
  });

  it('should render message text', () => {
    const { getHostElement } = createFixture({ message: 'Hello World' });

    expect(
      getHostElement().querySelector('.mzn-alert-banner__message')?.textContent,
    ).toContain('Hello World');
  });

  it('should render icon', () => {
    const { getHostElement } = createFixture();

    expect(getHostElement().querySelector('i[mznIcon]')).toBeTruthy();
  });

  it('should render close button when closable', () => {
    const { getHostElement } = createFixture({ closable: true });
    const closeBtn = getHostElement().querySelector('.mzn-alert-banner__close');

    expect(closeBtn).toBeTruthy();
  });

  it('should not render close button when not closable', () => {
    const { getHostElement } = createFixture({ closable: false });
    const closeBtn = getHostElement().querySelector('.mzn-alert-banner__close');

    expect(closeBtn).toBeNull();
  });

  it('should render actions', () => {
    const { getHostElement } = createFixture({
      actions: [
        { content: 'Action 1', onClick: jest.fn() },
        { content: 'Action 2', onClick: jest.fn() },
      ],
    });

    const actionBtns = getHostElement().querySelectorAll(
      '.mzn-alert-banner__actions button',
    );

    expect(actionBtns.length).toBe(2);
  });

  it('should cap actions at 2', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

    const { getHostElement } = createFixture({
      actions: [
        { content: 'A1', onClick: jest.fn() },
        { content: 'A2', onClick: jest.fn() },
        { content: 'A3', onClick: jest.fn() },
      ],
    });

    const actionBtns = getHostElement().querySelectorAll(
      '.mzn-alert-banner__actions button',
    );

    expect(actionBtns.length).toBe(2);
    consoleSpy.mockRestore();
  });
});
