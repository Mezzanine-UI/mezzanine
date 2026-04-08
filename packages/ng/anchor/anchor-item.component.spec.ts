import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MznAnchorItem } from './anchor-item.component';
import type { AnchorItemData } from './typings';

@Component({
  standalone: true,
  imports: [MznAnchorItem],
  template: `
    <mzn-anchor-item
      [autoScrollTo]="autoScrollTo"
      [className]="className"
      [clickHandler]="clickHandler"
      [disabled]="disabled"
      [href]="href"
      [itemId]="itemId"
      [itemTitle]="itemTitle"
      [level]="level"
      [name]="name"
      [parentAutoScrollTo]="parentAutoScrollTo"
      [parentDisabled]="parentDisabled"
      [subAnchors]="subAnchors"
    />
  `,
})
class TestHostComponent {
  autoScrollTo?: boolean;
  className?: string;
  clickHandler?: VoidFunction;
  disabled?: boolean;
  href = '#target';
  itemId = 'target';
  itemTitle?: string;
  level = 1;
  name = 'Target';
  parentAutoScrollTo = false;
  parentDisabled = false;
  subAnchors?: readonly AnchorItemData[];
}

function createFixture(overrides: Partial<TestHostComponent> = {}): {
  fixture: ComponentFixture<TestHostComponent>;
  host: TestHostComponent;
  getLink: () => HTMLAnchorElement;
  getItem: () => HTMLElement;
} {
  const fixture = TestBed.createComponent(TestHostComponent);
  const host = fixture.componentInstance;

  Object.assign(host, overrides);
  fixture.detectChanges();

  const item = fixture.nativeElement.querySelector(
    'mzn-anchor-item',
  ) as HTMLElement;

  return {
    fixture,
    host,
    getLink: (): HTMLAnchorElement =>
      item.querySelector('a') as HTMLAnchorElement,
    getItem: (): HTMLElement => item,
  };
}

describe('MznAnchorItem', () => {
  const originalHash = window.location.hash;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestHostComponent] });
  });

  afterEach(() => {
    window.history.replaceState(
      null,
      '',
      window.location.pathname + originalHash,
    );
  });

  it('should render with required inputs', () => {
    const { getLink } = createFixture();

    expect(getLink()).toBeTruthy();
    expect(getLink().getAttribute('href')).toBe('#target');
    expect(getLink().textContent).toContain('Target');
  });

  it('should apply anchor-item host class', () => {
    const { getLink } = createFixture();

    expect(getLink().classList.contains('mzn-anchor__anchorItem')).toBe(true);
  });

  it('should apply custom className', () => {
    const { getLink } = createFixture({ className: 'extra-class' });

    expect(getLink().classList.contains('extra-class')).toBe(true);
  });

  it('should mark as disabled when disabled input is true', () => {
    const { getLink } = createFixture({ disabled: true });

    expect(
      getLink().classList.contains('mzn-anchor__anchorItem--disabled'),
    ).toBe(true);
    expect(getLink().getAttribute('aria-disabled')).toBe('true');
    expect(getLink().getAttribute('tabindex')).toBe('-1');
  });

  it('should inherit disabled from parent', () => {
    const { getLink } = createFixture({ parentDisabled: true });

    expect(getLink().getAttribute('aria-disabled')).toBe('true');
  });

  it('should prevent click when disabled', () => {
    const clickHandler = jest.fn();
    const { getLink } = createFixture({ disabled: true, clickHandler });

    getLink().click();

    expect(clickHandler).not.toHaveBeenCalled();
  });

  it('should invoke clickHandler on click', () => {
    const clickHandler = jest.fn();
    const { getLink } = createFixture({ clickHandler });

    getLink().click();

    expect(clickHandler).toHaveBeenCalledTimes(1);
  });

  it('should update location hash on click', () => {
    window.history.replaceState(null, '', window.location.pathname);

    const { getLink } = createFixture({
      href: '#section-a',
      itemId: 'section-a',
    });

    getLink().click();

    expect(window.location.hash).toBe('#section-a');
  });

  it('should mark as active when hash matches', () => {
    window.history.replaceState(
      null,
      '',
      window.location.pathname + '#active-target',
    );

    const { getLink } = createFixture({
      href: '#active-target',
      itemId: 'active-target',
    });

    expect(getLink().classList.contains('mzn-anchor__anchorItem--active')).toBe(
      true,
    );
  });

  it('should apply title attribute', () => {
    const { getLink } = createFixture({ itemTitle: 'Tooltip' });

    expect(getLink().getAttribute('title')).toBe('Tooltip');
  });

  it('should render nested children up to MAX_NESTING_LEVEL', () => {
    const { getItem } = createFixture({
      subAnchors: [
        { id: 'child-1', name: 'Child 1', href: '#child-1' },
        { id: 'child-2', name: 'Child 2', href: '#child-2' },
      ],
    });

    const nested = getItem().querySelector('.mzn-anchor__nested');

    expect(nested).toBeTruthy();
    expect(nested?.querySelectorAll('mzn-anchor-item').length).toBe(2);
  });

  it('should not render children beyond MAX_NESTING_LEVEL (level 3)', () => {
    const { getItem } = createFixture({
      level: 3,
      subAnchors: [{ id: 'deep', name: 'Deep', href: '#deep' }],
    });

    const nested = getItem().querySelector('.mzn-anchor__nested');

    expect(nested).toBeNull();
  });
});
