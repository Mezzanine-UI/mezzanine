import { Component, ElementRef, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MznPopconfirm } from './popconfirm.component';

@Component({
  standalone: true,
  imports: [MznPopconfirm],
  template: `
    <button #anchor>Delete</button>
    <mzn-popconfirm
      [anchor]="anchorRef()"
      [open]="open"
      title="Are you sure?"
      confirmText="OK"
      cancelText="Cancel"
      [disableClickAway]="true"
      (confirmed)="onConfirm()"
      (cancelled)="onCancel()"
    />
  `,
})
class TestHostComponent {
  readonly anchorRef = viewChild.required<ElementRef<HTMLElement>>('anchor');
  open = false;
  confirmed = false;
  cancelled = false;

  onConfirm(): void {
    this.confirmed = true;
  }

  onCancel(): void {
    this.cancelled = true;
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

describe('MznPopconfirm', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TestHostComponent],
    });
  });

  it('should not render content when closed', () => {
    const { fixture } = createFixture(TestHostComponent);
    const el = fixture.nativeElement.querySelector('.mzn-popconfirm');

    expect(el).toBeFalsy();
  });

  it('should render when open', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('.mzn-popconfirm');

    expect(el).toBeTruthy();
  });

  it('should render title', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.mzn-popconfirm__title');

    expect(title?.textContent).toContain('Are you sure?');
  });

  it('should render icon', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('i[mznIcon]');

    expect(icon).toBeTruthy();
  });

  it('should emit confirmed on confirm click', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const confirmBtn = fixture.nativeElement.querySelector(
      '.mzn-popconfirm__confirm-btn',
    );

    confirmBtn.click();
    fixture.detectChanges();

    expect(host.confirmed).toBe(true);
  });

  it('should emit cancelled on cancel click', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const cancelBtn = fixture.nativeElement.querySelector(
      '.mzn-popconfirm__cancel-btn',
    );

    cancelBtn.click();
    fixture.detectChanges();

    expect(host.cancelled).toBe(true);
  });
});
