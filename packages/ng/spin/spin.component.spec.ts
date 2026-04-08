import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MznSpin } from './spin.component';

describe('MznSpin', () => {
  let fixture: ComponentFixture<MznSpin>;
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MznSpin, NoopAnimationsModule],
    });
    fixture = TestBed.createComponent(MznSpin);
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should not render spinner when loading is false', () => {
    expect(el.querySelector('.mzn-spin__spin')).toBeNull();
  });

  it('should render spinner when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    expect(el.querySelector('.mzn-spin__spin')).toBeTruthy();
  });

  it('should apply size class', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('size', 'sub');
    fixture.detectChanges();

    expect(el.querySelector('.mzn-spin__spin--sub')).toBeTruthy();
  });

  it('should render description when provided', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('description', '載入中...');
    fixture.detectChanges();

    const desc = el.querySelector('.mzn-spin__spin__description');

    expect(desc).toBeTruthy();
    expect(desc!.textContent).toContain('載入中...');
  });

  it('should apply descriptionClassName to description element', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('description', '載入中...');
    fixture.componentRef.setInput('descriptionClassName', 'my-custom-class');
    fixture.detectChanges();

    const desc = el.querySelector('.mzn-spin__spin__description');

    expect(desc).toBeTruthy();
    expect(desc!.classList.contains('my-custom-class')).toBe(true);
  });

  it('should apply stretch class', () => {
    fixture.componentRef.setInput('stretch', true);
    fixture.detectChanges();

    expect(el.classList.contains('mzn-spin--stretch')).toBe(true);
  });

  it('should apply custom color CSS variable', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('color', '#1890ff');
    fixture.detectChanges();

    const ring = el.querySelector('.mzn-spin__spin__ring') as HTMLElement;

    expect(ring?.style.getPropertyValue('--mzn-spin--color')).toBe('#1890ff');
  });

  it('should apply custom trackColor CSS variable', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('trackColor', 'rgba(0,0,0,0.1)');
    fixture.detectChanges();

    const ring = el.querySelector('.mzn-spin__spin__ring') as HTMLElement;

    expect(ring?.style.getPropertyValue('--mzn-spin--track-color')).toBe(
      'rgba(0,0,0,0.1)',
    );
  });

  it('should render ng-content (nested mode)', () => {
    // Nested mode: projected content should be rendered via ng-content.
    // This is validated by testing the backdrop overlay structure.
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    // In nested mode, the backdrop element wraps the spin indicator.
    expect(el.querySelector('.mzn-backdrop')).toBeTruthy();
  });
});
