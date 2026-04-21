import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MznBadge } from './badge.component';

describe('MznBadge', () => {
  let fixture: ComponentFixture<MznBadge>;
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MznBadge],
    });
    fixture = TestBed.createComponent(MznBadge);
    fixture.componentRef.setInput('variant', 'count-alert');
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should apply variant class', () => {
    const badge = el.querySelector('.mzn-badge');

    expect(badge?.classList.contains('mzn-badge--count-alert')).toBe(true);
  });

  it('should display count for count variant', () => {
    fixture.componentRef.setInput('count', 5);
    fixture.detectChanges();

    const badge = el.querySelector('.mzn-badge');

    expect(badge?.textContent?.trim()).toBe('5');
  });

  it('should display overflow count with plus', () => {
    fixture.componentRef.setInput('count', 120);
    fixture.componentRef.setInput('overflowCount', 99);
    fixture.detectChanges();

    const badge = el.querySelector('.mzn-badge');

    expect(badge?.textContent?.trim()).toBe('99+');
  });

  it('should hide count badge when count is 0', () => {
    fixture.componentRef.setInput('count', 0);
    fixture.detectChanges();

    const badge = el.querySelector('.mzn-badge');

    expect(badge?.classList.contains('mzn-badge--hide')).toBe(true);
  });

  it('should display text for text variant', () => {
    fixture.componentRef.setInput('variant', 'text-brand');
    fixture.componentRef.setInput('text', 'NEW');
    fixture.detectChanges();

    const badge = el.querySelector('.mzn-badge');

    expect(badge?.textContent?.trim()).toBe('NEW');
  });

  it('should apply dot variant class', () => {
    fixture.componentRef.setInput('variant', 'dot-error');
    fixture.detectChanges();

    const badge = el.querySelector('.mzn-badge');

    expect(badge?.classList.contains('mzn-badge--dot-error')).toBe(true);
  });

  it('should apply size class for text variant', () => {
    fixture.componentRef.setInput('variant', 'text-success');
    fixture.componentRef.setInput('size', 'sub');
    fixture.detectChanges();

    const badge = el.querySelector('.mzn-badge');

    expect(badge?.classList.contains('mzn-badge--sub')).toBe(true);
  });
});
