import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MznBreadcrumb, BreadcrumbItemData } from './breadcrumb.component';
import { MznBreadcrumbItem } from './breadcrumb-item.component';

@Component({
  standalone: true,
  imports: [MznBreadcrumb],
  template: `<mzn-breadcrumb [items]="items" />`,
})
class TestHostComponent {
  items: readonly BreadcrumbItemData[] = [
    { name: '首頁', href: '/' },
    { name: '產品', href: '/products' },
    { name: '目前頁面' },
  ];
}

function createFixture(overrides: Partial<TestHostComponent> = {}): {
  fixture: ComponentFixture<TestHostComponent>;
  host: TestHostComponent;
  getEl: () => HTMLElement;
} {
  const fixture = TestBed.createComponent(TestHostComponent);
  const host = fixture.componentInstance;

  Object.assign(host, overrides);
  fixture.detectChanges();

  return {
    fixture,
    host,
    getEl: (): HTMLElement =>
      fixture.nativeElement.querySelector('mzn-breadcrumb')!,
  };
}

describe('MznBreadcrumb', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
  });

  it('should create', () => {
    const { getEl } = createFixture();

    expect(getEl()).toBeTruthy();
    expect(getEl().classList.contains('mzn-breadcrumb')).toBe(true);
  });

  it('should have aria-label', () => {
    const { getEl } = createFixture();

    expect(getEl().getAttribute('aria-label')).toBe('Breadcrumb');
  });

  it('should render all items', () => {
    const { getEl } = createFixture();
    const items = getEl().querySelectorAll('mzn-breadcrumb-item');

    expect(items).toHaveLength(3);
  });

  it('should render separator icons between items', () => {
    const { getEl } = createFixture();
    const icons = getEl().querySelectorAll('i[mznIcon]');

    expect(icons).toHaveLength(2);
  });

  it('should mark last item as current', () => {
    const { getEl } = createFixture();
    const items = getEl().querySelectorAll('mzn-breadcrumb-item');
    const last = items[items.length - 1];

    expect(last.classList.contains('mzn-breadcrumb__item--current')).toBe(true);
  });

  it('should render links for non-current items', () => {
    const { getEl } = createFixture();
    const links = getEl().querySelectorAll('a');

    expect(links).toHaveLength(2);
    expect(links[0].getAttribute('href')).toBe('/');
  });

  it('should render span for current item', () => {
    const { getEl } = createFixture();
    const items = getEl().querySelectorAll('mzn-breadcrumb-item');
    const last = items[items.length - 1];

    expect(last.querySelector('a')).toBeNull();
    expect(last.textContent).toContain('目前頁面');
  });
});

describe('MznBreadcrumbItem', () => {
  it('should create standalone', () => {
    TestBed.configureTestingModule({
      imports: [MznBreadcrumbItem],
    });

    const fixture = TestBed.createComponent(MznBreadcrumbItem);

    fixture.componentRef.setInput('name', '測試');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('測試');
  });
});
