import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MznPagination } from './pagination.component';

@Component({
  standalone: true,
  imports: [MznPagination],
  template: `
    <mzn-pagination
      [total]="total"
      [current]="current"
      [pageSize]="pageSize"
      [disabled]="disabled"
      (pageChanged)="onPageChange($event)"
    />
  `,
})
class TestHostComponent {
  total = 100;
  current = 1;
  pageSize = 10;
  disabled = false;
  lastPage = 0;

  onPageChange(page: number): void {
    this.lastPage = page;
    this.current = page;
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

describe('MznPagination', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
  });

  it('should render pagination nav', () => {
    const { fixture } = createFixture(TestHostComponent);
    const nav = fixture.nativeElement.querySelector('[role="navigation"]');

    expect(nav).toBeTruthy();
  });

  it('should render page buttons', () => {
    const { fixture } = createFixture(TestHostComponent);
    const buttons = fixture.nativeElement.querySelectorAll(
      'button[type="button"]',
    );

    // previous + pages + next
    expect(buttons.length).toBeGreaterThan(2);
  });

  it('should mark current page as active', () => {
    const { fixture } = createFixture(TestHostComponent);
    const activeBtn = fixture.nativeElement.querySelector(
      '.mzn-pagination-item--active',
    );

    expect(activeBtn).toBeTruthy();
    expect(activeBtn.textContent.trim()).toBe('1');
  });

  it('should disable previous on first page', () => {
    const { fixture } = createFixture(TestHostComponent);
    const buttons = fixture.nativeElement.querySelectorAll(
      'button[type="button"]',
    );
    const prevBtn = buttons[0];

    expect(prevBtn.disabled).toBe(true);
  });

  it('should emit pageChanged on click', () => {
    const { fixture, host } = createFixture(TestHostComponent);
    const buttons = fixture.nativeElement.querySelectorAll(
      'button[type="button"]',
    );

    // Click page 2 (should be one of the buttons)
    const page2Btn = Array.from(buttons).find(
      (b) => (b as HTMLElement).textContent?.trim() === '2',
    ) as HTMLButtonElement;

    expect(page2Btn).toBeTruthy();

    page2Btn.click();
    fixture.detectChanges();

    expect(host.lastPage).toBe(2);
  });

  it('should render ellipsis for many pages', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.current = 5;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    const ellipsis = fixture.nativeElement.querySelectorAll(
      '.mzn-pagination-item__ellipsis',
    );

    expect(ellipsis.length).toBeGreaterThan(0);
  });

  it('should disable next on last page', () => {
    const { fixture, host } = createFixture(TestHostComponent);

    host.current = 10;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll(
      'button[type="button"]',
    );
    const nextBtn = buttons[buttons.length - 1];

    expect(nextBtn.disabled).toBe(true);
  });
});
