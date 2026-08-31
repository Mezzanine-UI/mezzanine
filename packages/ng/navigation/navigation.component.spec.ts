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
    <div mznNavigation [collapsed]="collapsed">
      <div mznNavigationHeader>
        <span title>App</span>
      </div>
      <mzn-navigation-option title="首頁" href="/" />
      <mzn-navigation-option title="設定" [hasChildren]="true">
        <mzn-navigation-option title="一般" href="/settings/general" />
      </mzn-navigation-option>
      <mzn-navigation-option-category title="管理">
        <mzn-navigation-option title="使用者" href="/users" />
      </mzn-navigation-option-category>
      <div mznNavigationFooter>
        <span>Footer</span>
      </div>
    </div>
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
      fixture.nativeElement.querySelector('[mznNavigation]')!,
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

    expect(getEl().querySelector('[mznNavigationHeader]')).toBeTruthy();
  });

  it('should render footer', () => {
    const { getEl } = createFixture();

    expect(getEl().querySelector('[mznNavigationFooter]')).toBeTruthy();
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
    const homeOption = getEl().querySelector('li[data-id="首頁"]');

    expect(homeOption?.classList.contains('mzn-navigation-option--basic')).toBe(
      true,
    );
  });

  it('should not show children of collapsed group option', () => {
    const { getEl } = createFixture();
    const settingsOption = getEl().querySelector('li[data-id="設定"]');

    // Children should not be visible when not open
    expect(settingsOption?.querySelector('ul')).toBeNull();
  });

  it('should toggle group option on click', () => {
    const { fixture, getEl } = createFixture();
    const settingsOption = getEl().querySelector('li[data-id="設定"]');
    const trigger = settingsOption?.querySelector(
      '.mzn-navigation-option__content',
    ) as HTMLElement;

    trigger?.click();
    fixture.detectChanges();

    expect(settingsOption?.querySelector('ul')).toBeTruthy();
  });

  it('should activate option on click', () => {
    const { fixture, getEl } = createFixture();
    const homeOption = getEl().querySelector('li[data-id="首頁"]');
    const trigger = homeOption?.querySelector(
      '.mzn-navigation-option__content',
    ) as HTMLElement;

    trigger?.click();
    fixture.detectChanges();

    expect(
      homeOption?.classList.contains('mzn-navigation-option--active'),
    ).toBe(true);
  });
  it('should not claim menuitem anywhere in the navigation', () => {
    const { getEl } = createFixture();

    // `menuitem` requires a menu/menubar/group ancestor Navigation never
    // renders, and promises a keyboard model this component does not have.
    expect(getEl().querySelectorAll('[role="menuitem"]').length).toBe(0);
  });

  it('should expose option triggers as buttons', () => {
    const { getEl } = createFixture();
    const content = getEl().querySelector('.mzn-navigation-option__content');

    expect(content?.getAttribute('role')).toBe('button');
  });

  it('should keep native list semantics on the option category', () => {
    const { getEl } = createFixture();
    const category = getEl().querySelector(
      '.mzn-navigation-option-category',
    ) as HTMLElement;

    expect(category.getAttribute('role')).toBeNull();
    expect(category.tagName).toBe('LI');
  });

  it('should label the nested option list with the category title', () => {
    const { getEl } = createFixture();
    const category = getEl().querySelector(
      '.mzn-navigation-option-category',
    ) as HTMLElement;
    const nestedList = category.querySelector('ul') as HTMLElement;
    const labelledBy = nestedList.getAttribute('aria-labelledby');

    expect(labelledBy).toBeTruthy();
    expect(category.querySelector(`#${labelledBy}`)?.textContent).toBe('管理');
  });
  it('should name the collapse toggle and report its state', () => {
    const { getEl } = createFixture();
    const toggle = getEl().querySelector(
      '.mzn-navigation-icon-button',
    ) as HTMLElement;

    expect(toggle.getAttribute('aria-label')).toBe('Toggle navigation');
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
  });

  it('should report aria-expanded on a group option', () => {
    const { fixture, getEl } = createFixture();
    const settings = getEl().querySelector('li[data-id="設定"]')!;
    const content = settings.querySelector(
      '.mzn-navigation-option__content',
    ) as HTMLElement;

    expect(content.getAttribute('aria-expanded')).toBe('false');

    content.click();
    fixture.detectChanges();

    expect(content.getAttribute('aria-expanded')).toBe('true');
  });

  it('should not put aria-expanded on a leaf option', () => {
    const { getEl } = createFixture();
    const home = getEl().querySelector('li[data-id="首頁"]')!;
    const content = home.querySelector(
      '.mzn-navigation-option__content',
    ) as HTMLElement;

    expect(content.getAttribute('aria-expanded')).toBeNull();
  });
});
