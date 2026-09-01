import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MznModal } from './modal.component';
import { MznModalHeader } from './modal-header.component';
import { MznModalFooter } from './modal-footer.component';

@Component({
  standalone: true,
  imports: [MznModal, MznModalHeader, MznModalFooter],
  template: `
    <div
      mznModal
      [open]="open"
      [size]="size"
      [modalStatusType]="'info'"
      [disablePortal]="true"
      [showModalHeader]="true"
      [showModalFooter]="true"
      (closed)="onClose()"
    >
      <div mznModalHeader title="Test Title" supportingText="Supporting"></div>
      <div class="mzn-modal__body-container">
        <p>Body content</p>
      </div>
      <div mznModalFooter>
        <button class="cancel" (click)="onClose()">Cancel</button>
        <button class="confirm">Confirm</button>
      </div>
    </div>
  `,
})
class TestHostComponent {
  open = false;
  size: 'narrow' | 'regular' | 'tight' | 'wide' = 'regular';
  onClose(): void {
    this.open = false;
  }
}

@Component({
  standalone: true,
  imports: [MznModal],
  template: `
    <div
      mznModal
      [open]="true"
      [showDismissButton]="false"
      [disablePortal]="true"
    >
      <p>Minimal</p>
    </div>
  `,
})
class TestMinimalComponent {}

/** Dialog with two focusable children, driven by a signal. */
@Component({
  standalone: true,
  imports: [MznModal],
  template: `
    <div mznModal [open]="open()" [disablePortal]="true">
      <button type="button">first</button>
      <button type="button">last</button>
    </div>
  `,
})
class FocusModelHost {
  readonly open = signal(false);
}

function createFixture<T>(component: new () => T): {
  fixture: ReturnType<typeof TestBed.createComponent<T>>;
  host: T;
} {
  const fixture = TestBed.createComponent(component);

  fixture.detectChanges();

  return { fixture, host: fixture.componentInstance };
}

describe('MznModal', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TestHostComponent, TestMinimalComponent],
    });
  });

  it('should not render dialog when closed', () => {
    createFixture(TestHostComponent);

    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it('should render dialog when open', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');

    expect(dialog).toBeTruthy();
  });

  it('should apply size class', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    host.size = 'wide';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');

    expect(dialog).toBeTruthy();
    expect(dialog.classList.contains('mzn-modal--wide')).toBe(true);
  });

  it('should render header title', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector(
      '.mzn-modal__header__title',
    );

    expect(title).toBeTruthy();
    expect(title?.textContent).toContain('Test Title');
  });

  it('should render close button by default', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const closeBtn = fixture.nativeElement.querySelector('[mznClearActions]');

    expect(closeBtn).toBeTruthy();
  });

  it('should hide close button when showDismissButton is false', () => {
    const { fixture } = createFixture(TestMinimalComponent);

    fixture.detectChanges();

    const closeBtn = fixture.nativeElement.querySelector('[mznClearActions]');

    expect(closeBtn).toBeFalsy();
  });

  it('should render footer content', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const confirmBtn = fixture.nativeElement.querySelector('.confirm');

    expect(confirmBtn).toBeTruthy();
    expect(confirmBtn?.textContent).toContain('Confirm');
  });
  describe('dialog semantics', () => {
    it('should mark the open dialog as modal', () => {
      const { fixture, host } = createFixture(TestHostComponent);

      host.open = true;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      const dialog = document.querySelector<HTMLElement>('[role="dialog"]')!;

      // role="dialog" alone does not tell assistive technology that the content
      // behind the dialog is inert.
      expect(dialog.getAttribute('aria-modal')).toBe('true');
    });

    it('should not render a dialog at all while closed', () => {
      createFixture(TestHostComponent);

      expect(document.querySelector('[role="dialog"]')).toBeNull();
    });
  });
  describe('focus model', () => {
    function wrapperOf(): HTMLElement {
      return document.querySelector<HTMLElement>(
        '.mzn-modal__content-wrapper',
      )!;
    }

    function focusablesOf(): HTMLButtonElement[] {
      return Array.from(
        wrapperOf().querySelectorAll<HTMLButtonElement>('button'),
      );
    }

    it('should move focus into the dialog when it opens', async () => {
      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule, FocusModelHost],
      });

      const fixture = TestBed.createComponent(FocusModelHost);

      fixture.detectChanges();

      const outside = document.createElement('button');

      outside.textContent = 'outside';
      document.body.appendChild(outside);
      outside.focus();

      expect(document.activeElement).toBe(outside);

      fixture.componentInstance.open.set(true);
      fixture.detectChanges();
      await Promise.resolve();

      expect(document.activeElement?.textContent).toBe('first');

      outside.remove();
    });

    it('should restore focus to the previously focused element on close', async () => {
      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule, FocusModelHost],
      });

      const fixture = TestBed.createComponent(FocusModelHost);

      fixture.detectChanges();

      const trigger = document.createElement('button');

      trigger.textContent = 'trigger';
      document.body.appendChild(trigger);
      trigger.focus();

      fixture.componentInstance.open.set(true);
      fixture.detectChanges();
      await Promise.resolve();

      expect(document.activeElement?.textContent).toBe('first');

      fixture.componentInstance.open.set(false);
      fixture.detectChanges();

      expect(document.activeElement).toBe(trigger);

      trigger.remove();
    });

    it('should cycle Tab from the last focusable back to the first', async () => {
      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule, FocusModelHost],
      });

      const fixture = TestBed.createComponent(FocusModelHost);

      fixture.componentInstance.open.set(true);
      fixture.detectChanges();
      await Promise.resolve();

      const focusable = focusablesOf();

      focusable[focusable.length - 1].focus();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));

      expect(document.activeElement).toBe(focusable[0]);
    });

    it('should cycle Shift+Tab from the first focusable back to the last', async () => {
      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule, FocusModelHost],
      });

      const fixture = TestBed.createComponent(FocusModelHost);

      fixture.componentInstance.open.set(true);
      fixture.detectChanges();
      await Promise.resolve();

      const focusable = focusablesOf();

      focusable[0].focus();
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true }),
      );

      expect(document.activeElement).toBe(focusable[focusable.length - 1]);
    });

    it('should pull focus back in when it has escaped the dialog', async () => {
      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule, FocusModelHost],
      });

      const fixture = TestBed.createComponent(FocusModelHost);

      fixture.componentInstance.open.set(true);
      fixture.detectChanges();
      await Promise.resolve();

      const outside = document.createElement('button');

      outside.textContent = 'outside';
      document.body.appendChild(outside);
      outside.focus();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));

      expect(document.activeElement?.textContent).toBe('first');

      outside.remove();
    });
  });
});
