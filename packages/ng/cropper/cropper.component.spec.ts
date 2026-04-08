import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MznCropper } from './cropper.component';

@Component({
  standalone: true,
  imports: [MznCropper],
  template: `<mzn-cropper
    [imageSrc]="imageSrc"
    [disabled]="disabled"
    [minScale]="minScale"
    [maxScale]="maxScale"
    [size]="size"
    [aspectRatio]="aspectRatio"
    (cropChange)="onCropChange($event)"
    (scaleChange)="onScaleChange($event)"
  />`,
})
class TestHostComponent {
  aspectRatio?: number;
  disabled = false;
  imageSrc: string | undefined = 'https://example.com/photo.jpg';
  maxScale = 2;
  minScale = 1;
  size: 'main' | 'sub' = 'main';
  onCropChange = jest.fn();
  onScaleChange = jest.fn();
}

function createFixture(overrides: Partial<TestHostComponent> = {}): {
  fixture: ComponentFixture<TestHostComponent>;
  host: TestHostComponent;
  getCropper: () => HTMLElement;
  getCanvas: () => HTMLCanvasElement;
  getZoomInBtn: () => HTMLButtonElement;
  getZoomOutBtn: () => HTMLButtonElement;
  getScaleDisplay: () => HTMLElement;
} {
  const fixture = TestBed.createComponent(TestHostComponent);
  const host = fixture.componentInstance;

  Object.assign(host, overrides);
  fixture.detectChanges();

  return {
    fixture,
    host,
    getCropper: (): HTMLElement =>
      fixture.nativeElement.querySelector('mzn-cropper')!,
    getCanvas: (): HTMLCanvasElement =>
      fixture.nativeElement.querySelector('canvas')!,
    getZoomInBtn: (): HTMLButtonElement =>
      fixture.nativeElement.querySelectorAll(
        '.mzn-cropper__zoom-btn',
      )[1]! as HTMLButtonElement,
    getZoomOutBtn: (): HTMLButtonElement =>
      fixture.nativeElement.querySelector(
        '.mzn-cropper__zoom-btn',
      )! as HTMLButtonElement,
    getScaleDisplay: (): HTMLElement =>
      fixture.nativeElement.querySelector('.mzn-cropper__scale-display')!,
  };
}

describe('MznCropper', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
  });

  it('should create with host class', () => {
    const { getCropper } = createFixture();

    expect(getCropper().classList.contains('mzn-cropper')).toBe(true);
    expect(getCropper().classList.contains('mzn-cropper--main')).toBe(true);
  });

  it('should render a canvas element', () => {
    const { getCanvas } = createFixture();

    expect(getCanvas()).toBeTruthy();
    expect(getCanvas().tagName.toLowerCase()).toBe('canvas');
  });

  it('should initialize scale at minScale', () => {
    const { getScaleDisplay } = createFixture({ minScale: 1 });

    expect(getScaleDisplay().textContent?.trim()).toBe('100%');
  });

  it('should increment scale on zoom in', () => {
    const { fixture, getZoomInBtn, getScaleDisplay, host } = createFixture();

    getZoomInBtn().click();
    fixture.detectChanges();

    expect(getScaleDisplay().textContent?.trim()).toBe('110%');
    expect(host.onScaleChange).toHaveBeenCalledWith(1.1);
  });

  it('should decrement scale on zoom out', () => {
    const { fixture, getZoomInBtn, getZoomOutBtn, getScaleDisplay, host } =
      createFixture();

    // First zoom in to 1.2 so we can zoom out
    getZoomInBtn().click();
    fixture.detectChanges();
    getZoomInBtn().click();
    fixture.detectChanges();

    expect(getScaleDisplay().textContent?.trim()).toBe('120%');

    getZoomOutBtn().click();
    fixture.detectChanges();

    expect(getScaleDisplay().textContent?.trim()).toBe('110%');
    expect(host.onScaleChange).toHaveBeenLastCalledWith(1.1);
  });

  it('should clamp scale to maxScale', () => {
    const { fixture, getZoomInBtn, getScaleDisplay } = createFixture({
      maxScale: 1.2,
    });

    // Click zoom in 5 times — should not exceed maxScale
    for (let i = 0; i < 5; i++) {
      getZoomInBtn().click();
      fixture.detectChanges();
    }

    expect(getScaleDisplay().textContent?.trim()).toBe('120%');
  });

  it('should clamp scale to minScale', () => {
    const { fixture, getZoomOutBtn, getScaleDisplay } = createFixture({
      minScale: 1,
    });

    // Scale starts at 1 (minScale), clicking zoom out should not go below
    getZoomOutBtn().click();
    fixture.detectChanges();

    expect(getScaleDisplay().textContent?.trim()).toBe('100%');
  });

  it('should apply disabled state', () => {
    const { getCropper, getZoomInBtn, getZoomOutBtn } = createFixture({
      disabled: true,
    });

    expect(getCropper().classList.contains('mzn-cropper--disabled')).toBe(true);
    expect(getZoomInBtn().disabled).toBe(true);
    expect(getZoomOutBtn().disabled).toBe(true);
  });

  it('should apply sub size class', () => {
    const { getCropper } = createFixture({ size: 'sub' });

    expect(getCropper().classList.contains('mzn-cropper--sub')).toBe(true);
  });
});
