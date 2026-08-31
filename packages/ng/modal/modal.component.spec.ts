import { Component } from '@angular/core';
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

  it('should keep the dialog mounted but hidden when closed', () => {
    const { fixture } = createFixture(TestHostComponent);
    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');
    const presentation = fixture.nativeElement.querySelector(
      '[role="presentation"]',
    );

    // The modal keeps its content mounted and expresses open/closed through
    // the backdrop's fade and the dialog's scale, mirroring React's <Modal>.
    expect(dialog).toBeTruthy();
    expect(presentation?.getAttribute('aria-hidden')).toBe('true');
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

    it('should not claim aria-modal while closed', () => {
      createFixture(TestHostComponent);

      const dialog = document.querySelector<HTMLElement>('[role="dialog"]')!;

      expect(dialog.getAttribute('aria-modal')).toBeNull();
    });
  });
});
