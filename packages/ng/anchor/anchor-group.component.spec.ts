import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MznAnchorGroup } from './anchor-group.component';
import { AnchorItemData } from './typings';

@Component({
  standalone: true,
  imports: [MznAnchorGroup],
  template: `
    <mzn-anchor-group [anchors]="anchors" [className]="className" />
  `,
})
class TestHostComponent {
  anchors: AnchorItemData[] = [
    { id: 'section1', name: 'Section 1', href: '#section1' },
    { id: 'section2', name: 'Section 2', href: '#section2' },
  ];

  className?: string;
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
      fixture.nativeElement.querySelector('mzn-anchor-group')!,
  };
}

describe('MznAnchorGroup', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
  });

  it('should create', () => {
    const { getEl } = createFixture();

    expect(getEl()).toBeTruthy();
  });

  it('should apply host class', () => {
    const { getEl } = createFixture();

    expect(getEl().classList.contains('mzn-anchor')).toBe(true);
  });

  it('should render anchor items', () => {
    const { getEl } = createFixture();
    const items = getEl().querySelectorAll('.mzn-anchor__anchorItem');

    expect(items.length).toBe(2);
  });

  it('should render anchor item names', () => {
    const { getEl } = createFixture();
    const links = getEl().querySelectorAll('a');

    expect(links[0].textContent).toContain('Section 1');
    expect(links[1].textContent).toContain('Section 2');
  });

  it('should render anchor item hrefs', () => {
    const { getEl } = createFixture();
    const links = getEl().querySelectorAll('a');

    expect(links[0].getAttribute('href')).toBe('#section1');
    expect(links[1].getAttribute('href')).toBe('#section2');
  });

  it('should render nested children', () => {
    const { getEl } = createFixture({
      anchors: [
        {
          id: 'parent',
          name: 'Parent',
          href: '#parent',
          children: [{ id: 'child1', name: 'Child 1', href: '#child1' }],
        },
      ],
    });

    const nested = getEl().querySelector('.mzn-anchor__nested');

    expect(nested).toBeTruthy();
    expect(nested?.querySelector('a')?.textContent).toContain('Child 1');
  });

  it('should apply disabled state', () => {
    const { getEl } = createFixture({
      anchors: [
        { id: 'disabled', name: 'Disabled', href: '#disabled', disabled: true },
      ],
    });

    const link = getEl().querySelector('a');

    expect(link?.classList.contains('mzn-anchor__anchorItem--disabled')).toBe(
      true,
    );
    expect(link?.getAttribute('aria-disabled')).toBe('true');
    expect(link?.getAttribute('tabindex')).toBe('-1');
  });

  it('should handle click and update hash', () => {
    const onClick = jest.fn();
    const { getEl } = createFixture({
      anchors: [
        { id: 'clickable', name: 'Click Me', href: '#clickable', onClick },
      ],
    });

    const link = getEl().querySelector('a')!;

    link.click();

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should prevent click when disabled', () => {
    const onClick = jest.fn();
    const { getEl } = createFixture({
      anchors: [
        {
          id: 'disabled',
          name: 'Disabled',
          href: '#disabled',
          disabled: true,
          onClick,
        },
      ],
    });

    const link = getEl().querySelector('a')!;

    link.click();

    expect(onClick).not.toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    const { getEl } = createFixture({ className: 'custom-class' });

    expect(getEl().classList.contains('mzn-anchor')).toBe(true);
    expect(getEl().classList.contains('custom-class')).toBe(true);
  });
});
