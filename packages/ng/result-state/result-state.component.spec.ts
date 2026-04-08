import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ResultStateSize,
  ResultStateType,
} from '@mezzanine-ui/core/result-state';
import { MznResultState } from './result-state.component';

@Component({
  standalone: true,
  imports: [MznResultState],
  template: `
    <mzn-result-state
      [description]="description"
      [size]="size"
      [title]="title"
      [type]="type"
    >
      <button actions>Action</button>
    </mzn-result-state>
  `,
})
class TestHostComponent {
  description?: string;
  size: ResultStateSize = 'main';
  title = '操作成功';
  type: ResultStateType = 'information';
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
      fixture.nativeElement.querySelector('mzn-result-state')!,
  };
}

describe('MznResultState', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
  });

  it('should create', () => {
    const { getEl } = createFixture();

    expect(getEl()).toBeTruthy();
  });

  it('should apply host, type, and size classes', () => {
    const { getEl } = createFixture();
    const el = getEl();

    expect(el.classList.contains('mzn-result-state')).toBe(true);
    expect(el.classList.contains('mzn-result-state--information')).toBe(true);
    expect(el.classList.contains('mzn-result-state--main')).toBe(true);
  });

  it('should render title', () => {
    const { getEl } = createFixture();

    expect(
      getEl().querySelector('.mzn-result-state__title')?.textContent,
    ).toContain('操作成功');
  });

  it('should render icon', () => {
    const { getEl } = createFixture();

    expect(getEl().querySelector('i[mznIcon]')).toBeTruthy();
  });

  it('should render description when provided', () => {
    const { getEl } = createFixture({ description: '已完成處理' });

    expect(
      getEl().querySelector('.mzn-result-state__description')?.textContent,
    ).toContain('已完成處理');
  });

  it('should not render description when not provided', () => {
    const { getEl } = createFixture();

    expect(getEl().querySelector('.mzn-result-state__description')).toBeNull();
  });

  it('should render projected action content', () => {
    const { getEl } = createFixture();
    const actionsArea = getEl().querySelector('.mzn-result-state__actions');

    expect(actionsArea?.querySelector('button')?.textContent).toContain(
      'Action',
    );
  });

  it('should apply sub size class', () => {
    const { getEl } = createFixture({ size: 'sub' });

    expect(getEl().classList.contains('mzn-result-state--sub')).toBe(true);
  });

  it('should apply success type class', () => {
    const { getEl } = createFixture({ type: 'success' });

    expect(getEl().classList.contains('mzn-result-state--success')).toBe(true);
  });

  it('should apply error type class', () => {
    const { getEl } = createFixture({ type: 'error' });

    expect(getEl().classList.contains('mzn-result-state--error')).toBe(true);
  });

  it('should apply warning type class', () => {
    const { getEl } = createFixture({ type: 'warning' });

    expect(getEl().classList.contains('mzn-result-state--warning')).toBe(true);
  });
});
