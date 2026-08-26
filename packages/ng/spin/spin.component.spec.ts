import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MznSpin } from './spin.component';

@Component({
  standalone: true,
  imports: [MznSpin],
  template: `<div mznSpin [loading]="loading"><p>Wrapped</p></div>`,
})
class NestedHostComponent {
  loading = false;
}

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
    // Nested mode only engages when content is actually projected, so this
    // needs a host that wraps children rather than a bare MznSpin fixture.
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [NestedHostComponent, NoopAnimationsModule],
    });

    const nested = TestBed.createComponent(NestedHostComponent);

    nested.componentInstance.loading = true;
    nested.detectChanges();

    const nestedEl: HTMLElement = nested.nativeElement;

    expect(nestedEl.querySelector('p')?.textContent).toBe('Wrapped');
    expect(nestedEl.querySelector('.mzn-backdrop')).toBeTruthy();
  });
});
