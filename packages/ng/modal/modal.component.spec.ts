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
    <mzn-modal
      [open]="open"
      [size]="size"
      [modalStatusType]="'info'"
      [disablePortal]="true"
      [showModalHeader]="true"
      [showModalFooter]="true"
      (closed)="onClose()"
    >
      <mzn-modal-header title="Test Title" supportingText="Supporting" />
      <div class="mzn-modal__body-container">
        <p>Body content</p>
      </div>
      <mzn-modal-footer>
        <button class="cancel" (click)="onClose()">Cancel</button>
        <button class="confirm">Confirm</button>
      </mzn-modal-footer>
    </mzn-modal>
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
    <mzn-modal [open]="true" [showDismissButton]="false" [disablePortal]="true">
      <p>Minimal</p>
    </mzn-modal>
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

  it('should not render dialog when closed', () => {
    const { fixture } = createFixture(TestHostComponent);
    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');

    expect(dialog).toBeFalsy();
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

    const closeBtn = fixture.nativeElement.querySelector('mzn-clear-actions');

    expect(closeBtn).toBeTruthy();
  });

  it('should hide close button when showDismissButton is false', () => {
    const { fixture } = createFixture(TestMinimalComponent);

    fixture.detectChanges();

    const closeBtn = fixture.nativeElement.querySelector('mzn-clear-actions');

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
});
