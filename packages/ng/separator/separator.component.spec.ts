import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MznSeparator } from './separator.component';

describe('MznSeparator', () => {
  let fixture: ComponentFixture<MznSeparator>;
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MznSeparator],
    });
    fixture = TestBed.createComponent(MznSeparator);
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have host class', () => {
    expect(el.classList.contains('mzn-separator')).toBe(true);
  });

  it('should default to horizontal orientation', () => {
    expect(el.classList.contains('mzn-separator--horizontal')).toBe(true);
    expect(el.getAttribute('aria-orientation')).toBeNull();
  });

  it('should apply vertical orientation', () => {
    fixture.componentRef.setInput('orientation', 'vertical');
    fixture.detectChanges();

    expect(el.classList.contains('mzn-separator--vertical')).toBe(true);
    expect(el.classList.contains('mzn-separator--horizontal')).toBe(false);
    expect(el.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('should have separator role', () => {
    expect(el.getAttribute('role')).toBe('separator');
  });
});
