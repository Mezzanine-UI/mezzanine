import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressStatus, ProgressType } from '@mezzanine-ui/core/progress';
import { IconDefinition } from '@mezzanine-ui/icons';
import { MznProgress } from './progress.component';

@Component({
  standalone: true,
  imports: [MznProgress],
  template: `
    <mzn-progress
      [icons]="icons"
      [percent]="percent"
      [status]="status"
      [tick]="tick"
      [type]="type"
    />
  `,
})
class TestHostComponent {
  icons?: { error?: IconDefinition; success?: IconDefinition };
  percent = 0;
  status?: ProgressStatus;
  tick = 0;
  type: ProgressType = 'progress';
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
      fixture.nativeElement.querySelector('mzn-progress')!,
  };
}

describe('MznProgress', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
  });

  it('should create', () => {
    const { getEl } = createFixture();

    expect(getEl()).toBeTruthy();
  });

  it('should apply host and type classes', () => {
    const { getEl } = createFixture();
    const el = getEl();

    expect(el.classList.contains('mzn-progress')).toBe(true);
    expect(el.classList.contains('mzn-progress--progress')).toBe(true);
  });

  it('should render line variant with percent width', () => {
    const { getEl } = createFixture({ percent: 60 });
    const lineBg = getEl().querySelector(
      '.mzn-progress__line-bg',
    ) as HTMLElement;

    expect(lineBg).toBeTruthy();
    expect(lineBg.style.width).toBe('60%');
  });

  it('should clamp percent between 0 and 100', () => {
    const { getEl } = createFixture({ percent: 150 });
    const lineBg = getEl().querySelector(
      '.mzn-progress__line-bg',
    ) as HTMLElement;

    expect(lineBg.style.width).toBe('100%');
  });

  it('should show percent text when type is percent', () => {
    const { getEl } = createFixture({ percent: 75, type: 'percent' });
    const percentEl = getEl().querySelector('.mzn-progress__info-percent');

    expect(percentEl?.textContent).toContain('75%');
  });

  it('should not show percent text when type is progress', () => {
    const { getEl } = createFixture({ percent: 75, type: 'progress' });

    expect(getEl().querySelector('.mzn-progress__info-percent')).toBeNull();
  });

  it('should apply success class when percent is 100', () => {
    const { getEl } = createFixture({ percent: 100 });

    expect(getEl().classList.contains('mzn-progress--success')).toBe(true);
  });

  it('should apply error class when status is error', () => {
    const { getEl } = createFixture({ percent: 40, status: 'error' });

    expect(getEl().classList.contains('mzn-progress--error')).toBe(true);
  });

  it('should show icon when type is icon and status is success', () => {
    const { getEl } = createFixture({ percent: 100, type: 'icon' });

    expect(getEl().querySelector('.mzn-progress__info-icon')).toBeTruthy();
  });

  it('should show icon when type is icon and status is error', () => {
    const { getEl } = createFixture({
      percent: 40,
      status: 'error',
      type: 'icon',
    });

    expect(getEl().querySelector('.mzn-progress__info-icon')).toBeTruthy();
  });

  it('should not show icon when type is progress', () => {
    const { getEl } = createFixture({ percent: 100, type: 'progress' });

    expect(getEl().querySelector('.mzn-progress__info-icon')).toBeNull();
  });

  it('should apply percent type class', () => {
    const { getEl } = createFixture({ type: 'percent' });

    expect(getEl().classList.contains('mzn-progress--percent')).toBe(true);
  });
});
