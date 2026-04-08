import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptySize } from '@mezzanine-ui/core/empty';
import { MznEmpty } from './empty.component';
import { EmptyType } from './typings';

@Component({
  standalone: true,
  imports: [MznEmpty],
  template: `
    <mzn-empty
      [title]="title"
      [type]="type"
      [size]="size"
      [description]="description"
    >
      <button actions>Action</button>
    </mzn-empty>
  `,
})
class TestHostComponent {
  description?: string;
  size: EmptySize = 'main';
  title = '尚無資料';
  type: EmptyType = 'initial-data';
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
    getEl: (): HTMLElement => fixture.nativeElement.querySelector('mzn-empty')!,
  };
}

describe('MznEmpty', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
  });

  it('should create', () => {
    const { getEl } = createFixture();

    expect(getEl()).toBeTruthy();
  });

  it('should apply host class and size class', () => {
    const { getEl } = createFixture();
    const el = getEl();

    expect(el.classList.contains('mzn-empty')).toBe(true);
    expect(el.classList.contains('mzn-empty--main')).toBe(true);
  });

  it('should render title', () => {
    const { getEl } = createFixture();

    expect(getEl().querySelector('.mzn-empty__title')?.textContent).toContain(
      '尚無資料',
    );
  });

  it('should render main SVG icon for non-custom type at main size', () => {
    const { getEl } = createFixture({ type: 'initial-data', size: 'main' });

    expect(
      getEl().querySelector('mzn-empty-main-initial-data-icon'),
    ).toBeTruthy();
    expect(getEl().querySelector('i[mznIcon]')).toBeNull();
  });

  it('should render mzn-icon for non-custom type at sub size', () => {
    const { getEl } = createFixture({ type: 'initial-data', size: 'sub' });

    expect(getEl().querySelector('i[mznIcon]')).toBeTruthy();
    expect(
      getEl().querySelector('mzn-empty-main-initial-data-icon'),
    ).toBeNull();
  });

  it('should render main result SVG icon at main size', () => {
    const { getEl } = createFixture({ type: 'result', size: 'main' });

    expect(getEl().querySelector('mzn-empty-main-result-icon')).toBeTruthy();
  });

  it('should render main system SVG icon at main size', () => {
    const { getEl } = createFixture({ type: 'system', size: 'main' });

    expect(getEl().querySelector('mzn-empty-main-system-icon')).toBeTruthy();
  });

  it('should render main notification SVG icon at main size', () => {
    const { getEl } = createFixture({ type: 'notification', size: 'main' });

    expect(
      getEl().querySelector('mzn-empty-main-notification-icon'),
    ).toBeTruthy();
  });

  it('should render description when provided', () => {
    const { getEl } = createFixture({ description: '請先建立資料' });

    expect(
      getEl().querySelector('.mzn-empty__description')?.textContent,
    ).toContain('請先建立資料');
  });

  it('should not render description when not provided', () => {
    const { getEl } = createFixture();

    expect(getEl().querySelector('.mzn-empty__description')).toBeNull();
  });

  it('should apply sub size class', () => {
    const { getEl } = createFixture({ size: 'sub' });

    expect(getEl().classList.contains('mzn-empty--sub')).toBe(true);
  });

  it('should render projected action content', () => {
    const { getEl } = createFixture();
    const actionsArea = getEl().querySelector('.mzn-empty__actions');

    expect(actionsArea?.querySelector('button')?.textContent).toContain(
      'Action',
    );
  });

  it('should not render actions area for minor size', () => {
    const { getEl } = createFixture({ size: 'minor' });

    expect(getEl().querySelector('.mzn-empty__actions')).toBeNull();
  });

  it('should not render icon for custom type', () => {
    const { getEl } = createFixture({ type: 'custom' });

    expect(getEl().querySelector('i[mznIcon]')).toBeNull();
    expect(
      getEl().querySelector('mzn-empty-main-initial-data-icon'),
    ).toBeNull();
  });
});
