import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MznBackdrop } from './backdrop.component';

@Component({
  standalone: true,
  imports: [MznBackdrop],
  template: `
    <mzn-backdrop
      [open]="open"
      [variant]="variant"
      [disableCloseOnBackdropClick]="disableCloseOnBackdropClick"
      [disableScrollLock]="disableScrollLock"
      [disablePortal]="true"
      (backdropClick)="onBackdropClick()"
      (closed)="onClosed()"
    >
      <div class="backdrop-content">Content</div>
    </mzn-backdrop>
  `,
})
class TestHostComponent {
  open = false;
  variant: 'dark' | 'light' = 'dark';
  disableCloseOnBackdropClick = false;
  disableScrollLock = true;
  onBackdropClick = jest.fn();
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
      fixture.nativeElement.querySelector('.mzn-backdrop') as HTMLElement,
  };
}

describe('MznBackdrop', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent, NoopAnimationsModule],
    });
  });

  it('should render with host class', () => {
    const { getHostElement } = createFixture();

    expect(getHostElement()).toBeTruthy();
    expect(getHostElement().classList.contains('mzn-backdrop')).toBe(true);
  });

  it('should apply open class when open', () => {
    const { getHostElement } = createFixture({ open: true });

    expect(getHostElement().classList.contains('mzn-backdrop--open')).toBe(
      true,
    );
  });

  it('should not apply open class when closed', () => {
    const { getHostElement } = createFixture({ open: false });

    expect(getHostElement().classList.contains('mzn-backdrop--open')).toBe(
      false,
    );
  });

  it('should render backdrop overlay when open', () => {
    const { getHostElement } = createFixture({ open: true });

    expect(
      getHostElement().querySelector('.mzn-backdrop__backdrop'),
    ).toBeTruthy();
  });

  it('should apply dark variant by default', () => {
    const { getHostElement } = createFixture({ open: true });

    expect(
      getHostElement().querySelector('.mzn-backdrop__backdrop--dark'),
    ).toBeTruthy();
  });

  it('should apply light variant', () => {
    const { getHostElement } = createFixture({ open: true, variant: 'light' });

    expect(
      getHostElement().querySelector('.mzn-backdrop__backdrop--light'),
    ).toBeTruthy();
  });

  it('should render content', () => {
    const { getHostElement } = createFixture({ open: true });

    expect(getHostElement().querySelector('.backdrop-content')).toBeTruthy();
  });

  it('should emit backdropClick and closed on backdrop click', () => {
    const { getHostElement, host } = createFixture({ open: true });
    const backdrop = getHostElement().querySelector(
      '.mzn-backdrop__backdrop',
    ) as HTMLElement;

    backdrop.click();

    expect(host.onBackdropClick).toHaveBeenCalledTimes(1);
    expect(host.onClosed).toHaveBeenCalledTimes(1);
  });

  it('should not emit closed when disableCloseOnBackdropClick is true', () => {
    const { getHostElement, host } = createFixture({
      open: true,
      disableCloseOnBackdropClick: true,
    });
    const backdrop = getHostElement().querySelector(
      '.mzn-backdrop__backdrop',
    ) as HTMLElement;

    backdrop.click();

    expect(host.onBackdropClick).toHaveBeenCalledTimes(1);
    expect(host.onClosed).not.toHaveBeenCalled();
  });
});
