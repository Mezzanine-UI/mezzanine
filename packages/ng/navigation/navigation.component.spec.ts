import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MznNavigation } from './navigation.component';
import { MznNavigationOption } from './navigation-option.component';
import { MznNavigationHeader } from './navigation-header.component';
import { MznNavigationFooter } from './navigation-footer.component';
import { MznNavigationOptionCategory } from './navigation-option-category.component';

@Component({
  standalone: true,
  imports: [
    MznNavigation,
    MznNavigationOption,
    MznNavigationHeader,
    MznNavigationFooter,
    MznNavigationOptionCategory,
  ],
  template: `
    <mzn-navigation [collapsed]="collapsed">
      <mzn-navigation-header>
        <span title>App</span>
      </mzn-navigation-header>
      <mzn-navigation-option title="首頁" href="/" />
      <mzn-navigation-option title="設定" [hasChildren]="true">
        <mzn-navigation-option title="一般" href="/settings/general" />
      </mzn-navigation-option>
      <mzn-navigation-option-category title="管理">
        <mzn-navigation-option title="使用者" href="/users" />
      </mzn-navigation-option-category>
      <mzn-navigation-footer>
        <span>Footer</span>
      </mzn-navigation-footer>
    </mzn-navigation>
  `,
})
class TestHostComponent {
  collapsed = false;
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
      fixture.nativeElement.querySelector('mzn-navigation')!,
  };
}

describe('MznNavigation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
  });

  it('should create', () => {
    const { getEl } = createFixture();

    expect(getEl()).toBeTruthy();
    expect(getEl().classList.contains('mzn-navigation')).toBe(true);
  });

  it('should apply expand class by default', () => {
    const { getEl } = createFixture();

    expect(getEl().classList.contains('mzn-navigation--expand')).toBe(true);
  });

  it('should apply collapsed class', () => {
    const { getEl } = createFixture({ collapsed: true });

    expect(getEl().classList.contains('mzn-navigation--collapsed')).toBe(true);
  });

  it('should render header', () => {
    const { getEl } = createFixture();

    expect(getEl().querySelector('mzn-navigation-header')).toBeTruthy();
  });

  it('should render footer', () => {
    const { getEl } = createFixture();

    expect(getEl().querySelector('mzn-navigation-footer')).toBeTruthy();
    expect(getEl().textContent).toContain('Footer');
  });

  it('should render options', () => {
    const { getEl } = createFixture();
    const options = getEl().querySelectorAll('mzn-navigation-option');

    // 首頁, 設定, 一般(子), 使用者(分類內)
    expect(options.length).toBeGreaterThanOrEqual(3);
  });

  it('should render option category', () => {
    const { getEl } = createFixture();
    const category = getEl().querySelector('mzn-navigation-option-category');

    expect(category).toBeTruthy();
    expect(category?.textContent).toContain('管理');
  });

  it('should apply basic class for leaf options', () => {
    const { getEl } = createFixture();
    const homeOption = getEl().querySelector(
      'mzn-navigation-option[data-id="首頁"]',
    );

    expect(homeOption?.classList.contains('mzn-navigation-option--basic')).toBe(
      true,
    );
  });

  it('should not show children of collapsed group option', () => {
    const { getEl } = createFixture();
    const settingsOption = getEl().querySelector(
      'mzn-navigation-option[data-id="設定"]',
    );

    // Children should not be visible when not open
    expect(settingsOption?.querySelector('ul')).toBeNull();
  });

  it('should toggle group option on click', () => {
    const { fixture, getEl } = createFixture();
    const settingsOption = getEl().querySelector(
      'mzn-navigation-option[data-id="設定"]',
    );
    const trigger = settingsOption?.querySelector(
      '[role="menuitem"]',
    ) as HTMLElement;

    trigger?.click();
    fixture.detectChanges();

    expect(settingsOption?.querySelector('ul')).toBeTruthy();
  });

  it('should activate option on click', () => {
    const { fixture, getEl } = createFixture();
    const homeOption = getEl().querySelector(
      'mzn-navigation-option[data-id="首頁"]',
    );
    const trigger = homeOption?.querySelector(
      '[role="menuitem"]',
    ) as HTMLElement;

    trigger?.click();
    fixture.detectChanges();

    expect(
      homeOption?.classList.contains('mzn-navigation-option--active'),
    ).toBe(true);
  });
});
