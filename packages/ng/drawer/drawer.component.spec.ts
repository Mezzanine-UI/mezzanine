import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MznDrawer } from './drawer.component';

@Component({
  standalone: true,
  imports: [MznDrawer],
  template: `
    <mzn-drawer
      [open]="open"
      [size]="size"
      [disablePortal]="true"
      headerTitle="Test Drawer"
      (closed)="onClose()"
    >
      <p class="content">Drawer content</p>
      <div mznDrawerBottom class="bottom-area">
        <button class="confirm">Confirm</button>
      </div>
    </mzn-drawer>
  `,
})
class TestHostComponent {
  open = false;
  size: 'medium' | 'narrow' | 'wide' = 'medium';
  onClose(): void {
    this.open = false;
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

describe('MznDrawer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TestHostComponent],
    });
  });

  it('should not render when closed', () => {
    const { fixture } = createFixture(TestHostComponent);
    const drawer = fixture.nativeElement.querySelector('.mzn-drawer');

    expect(drawer).toBeFalsy();
  });

  it('should render when open', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const drawer = fixture.nativeElement.querySelector('.mzn-drawer');

    expect(drawer).toBeTruthy();
  });

  it('should apply size class', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    host.size = 'wide';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const drawer = fixture.nativeElement.querySelector('.mzn-drawer');

    expect(drawer.classList.contains('mzn-drawer--wide')).toBe(true);
  });

  it('should render header title', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector('.mzn-drawer__header');

    expect(header).toBeTruthy();
    expect(header.textContent).toContain('Test Drawer');
  });

  it('should render close button in header', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const closeBtn = fixture.nativeElement.querySelector('mzn-clear-actions');

    expect(closeBtn).toBeTruthy();
  });

  it('should render content', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const content = fixture.nativeElement.querySelector('.content');

    expect(content).toBeTruthy();
    expect(content.textContent).toContain('Drawer content');
  });

  it('should render bottom area', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.open = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    fixture.detectChanges();

    const bottom = fixture.nativeElement.querySelector('.bottom-area');

    expect(bottom).toBeTruthy();
  });
});
