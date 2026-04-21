import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagSize, TagType } from '@mezzanine-ui/core/tag';
import { MznTag } from './tag.component';

@Component({
  standalone: true,
  imports: [MznTag],
  template: `
    <mzn-tag
      [type]="type"
      [label]="label"
      [size]="size"
      [count]="count"
      [disabled]="disabled"
      [active]="active"
      (close)="onClose($event)"
      (tagClick)="onClick($event)"
    />
  `,
})
class TestHostComponent {
  active = false;
  count?: number;
  disabled = false;
  label = 'Test';
  size: TagSize = 'main';
  type: TagType = 'static';

  onClose = jest.fn();
  onClick = jest.fn();
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
    getEl: (): HTMLElement => fixture.nativeElement.querySelector('mzn-tag')!,
  };
}

describe('MznTag', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
  });

  it('should create', () => {
    const { getEl } = createFixture();

    expect(getEl()).toBeTruthy();
  });

  it('should apply host class and type class', () => {
    const { getEl } = createFixture();
    const el = getEl();

    expect(el.classList.contains('mzn-tag')).toBe(true);
    expect(el.classList.contains('mzn-tag--static')).toBe(true);
  });

  it('should render label for static type', () => {
    const { getEl } = createFixture();

    expect(getEl().querySelector('.mzn-tag__label')?.textContent).toContain(
      'Test',
    );
  });

  it('should apply size class', () => {
    const { getEl } = createFixture({ size: 'sub' });

    expect(getEl().classList.contains('mzn-tag--sub')).toBe(true);
  });

  it('should render close button for dismissable type', () => {
    const { getEl } = createFixture({ type: 'dismissable' });

    expect(getEl().querySelector('.mzn-tag__close-button')).toBeTruthy();
  });

  it('should emit close event when close button is clicked', () => {
    const { getEl, host } = createFixture({ type: 'dismissable' });
    const closeBtn = getEl().querySelector(
      '.mzn-tag__close-button',
    ) as HTMLButtonElement;

    closeBtn?.click();

    expect(host.onClose).toHaveBeenCalled();
  });

  it('should apply disabled class', () => {
    const { getEl } = createFixture({ disabled: true });

    expect(getEl().classList.contains('mzn-tag--disabled')).toBe(true);
  });

  it('should apply active class', () => {
    const { getEl } = createFixture({ active: true });

    expect(getEl().classList.contains('mzn-tag--active')).toBe(true);
  });

  it('should render as button for addable type', () => {
    const { getEl } = createFixture({ type: 'addable' });

    expect(getEl().querySelector('button')).toBeTruthy();
  });

  it('should render badge for counter type', () => {
    const { getEl } = createFixture({ type: 'counter', count: 5 });

    expect(getEl().querySelector('mzn-badge')).toBeTruthy();
  });
});
