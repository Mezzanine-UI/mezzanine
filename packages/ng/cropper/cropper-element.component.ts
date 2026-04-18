import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import {
  cropperClasses as classes,
  CropperSize,
} from '@mezzanine-ui/core/cropper';
import { MinusIcon, PlusIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznSlider } from '@mezzanine-ui/ng/slider';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import {
  calculateInitialCropArea,
  constrainImagePosition,
  getBaseDisplaySize,
  getBaseScale,
  ImagePosition,
  isCropAreaSimilar,
  isImagePositionSimilar,
} from './cropper-calculations';

const DEFAULT_MIN_WIDTH = 50;
const DEFAULT_MIN_HEIGHT = 50;
const MIN_SCALE = 1;
const MAX_SCALE = 2;
const SCALE_STEP = 0.01;
const BORDER_WIDTH = 2;
const TAG_INSET_PX = 10;
const CROP_AREA_SIMILARITY_THRESHOLD = 0.5;
const IMAGE_POSITION_SIMILARITY_THRESHOLD = 0.1;

/** 裁切區域座標與尺寸（canvas 座標或 image pixel 座標）。 */
export interface CropArea {
  readonly height: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

/**
 * 圖片裁切元件本體，以 `<canvas>` 繪製圖片與裁切遮罩。
 *
 * 對應 React `<CropperElement>`。支援透過 `imageSrc` 載入圖片（URL、File、Blob），
 * 使用者可拖曳平移（pan）圖片並透過 Slider 或滑鼠滾輪縮放。
 * 裁切區域本身位置/尺寸固定，不支援使用者 resize 或 move —
 * 初始值由 `aspectRatio`/`initialCropArea` 決定。
 *
 * `cropChange` 回傳的 `CropArea` 使用 image pixel 座標，可直接餵給
 * `cropToBlob`/`cropToDataURL`。
 *
 * @example
 * ```html
 * import { MznCropperElement } from '@mezzanine-ui/ng/cropper';
 *
 * <div mznCropperElement
 *   imageSrc="https://example.com/photo.jpg"
 *   [aspectRatio]="4 / 3"
 *   (cropChange)="onCrop($event)"
 * ></div>
 * ```
 *
 * @see MznCropper
 * @see MznCropperModal
 */
@Component({
  selector: '[mznCropperElement]',
  standalone: true,
  imports: [MznSlider, MznTypography],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'elementClass',
    '[attr.aspectRatio]': 'null',
    '[attr.imageSrc]': 'null',
    '[attr.initialCropArea]': 'null',
    '[attr.minHeight]': 'null',
    '[attr.minWidth]': 'null',
    '[attr.size]': 'null',
  },
  template: `
    <canvas
      #canvasRef
      [class]="canvasClasses()"
      [style.cursor]="cursorStyle()"
      [style.display]="'block'"
      [style.width.%]="100"
      (mousedown)="onCanvasMouseDown($event)"
    ></canvas>

    @if (showTag()) {
      <span
        mznTypography
        variant="label-secondary"
        color="text-fixed-light"
        [class]="tagClass"
        [style.left.px]="tagPosition()!.left"
        [style.top.px]="tagPosition()!.top"
        >{{ tagText() }}</span
      >
    }

    <div [class]="controlsClass">
      <div
        mznSlider
        [min]="minScale"
        [max]="maxScale"
        [step]="scaleStep"
        [value]="scaleSignal()"
        [prefixIcon]="minusIcon"
        [suffixIcon]="plusIcon"
        (valueChange)="onSliderChange($event)"
      ></div>
    </div>
  `,
})
export class MznCropperElement {
  protected readonly minusIcon = MinusIcon;
  protected readonly plusIcon = PlusIcon;
  protected readonly minScale = MIN_SCALE;
  protected readonly maxScale = MAX_SCALE;
  protected readonly scaleStep = SCALE_STEP;

  protected readonly elementClass = classes.element;
  protected readonly tagClass = classes.tag;
  protected readonly controlsClass = classes.controls;

  /** 要裁切的圖片來源（URL、File、Blob）。 */
  readonly imageSrc = input<string | File | Blob>();

  /** 初始裁切區域（canvas 座標空間）。 */
  readonly initialCropArea = input<CropArea>();

  /** 裁切區域長寬比（width / height）。未提供則自由比例。 */
  readonly aspectRatio = input<number>();

  /**
   * 裁切區域最小寬度（px）。
   * @default 50
   */
  readonly minWidth = input(DEFAULT_MIN_WIDTH);

  /**
   * 裁切區域最小高度（px）。
   * @default 50
   */
  readonly minHeight = input(DEFAULT_MIN_HEIGHT);

  /**
   * 元件尺寸。
   * @default 'main'
   */
  readonly size = input<CropperSize>('main');

  /** 裁切區域變更事件（image pixel 座標空間）。 */
  readonly cropChange = output<CropArea>();

  /** 裁切區域拖曳結束事件。 */
  readonly cropDragEnd = output<CropArea>();

  /** 圖片拖曳結束事件。 */
  readonly imageDragEnd = output<void>();

  /** 圖片載入成功事件。 */
  readonly imageLoad = output<void>();

  /** 圖片載入失敗事件。 */
  readonly imageError = output<Error>();

  /** 縮放倍率變更事件。 */
  readonly scaleChange = output<number>();

  private readonly canvasRef =
    viewChild.required<ElementRef<HTMLCanvasElement>>('canvasRef');

  /** 取得底層 canvas 元素（供 `cropToBlob`/`cropToDataURL` 使用）。 */
  getCanvas(): HTMLCanvasElement | null {
    return this.canvasRef()?.nativeElement ?? null;
  }

  private readonly destroyRef = inject(DestroyRef);

  private image: HTMLImageElement | null = null;
  private imageLoadId = 0;
  private baseDisplaySize: { height: number; width: number } | null = null;

  private readonly scaleSignal = signal(1);
  private readonly cropAreaSignal = signal<CropArea | null>(null);
  private readonly imagePositionSignal = signal<ImagePosition>({
    offsetX: 0,
    offsetY: 0,
  });
  private readonly imageLoadedSignal = signal(false);
  private readonly initReadySignal = signal(false);

  private readonly isDraggingImageSignal = signal(false);
  private readonly imageDragStartSignal = signal<{
    readonly offsetX: number;
    readonly offsetY: number;
    readonly x: number;
    readonly y: number;
  } | null>(null);

  private readonly tagPositionSignal = signal<{
    left: number;
    top: number;
  } | null>(null);
  private readonly tagCropAreaSignal = signal<CropArea | null>(null);

  private rafId: number | null = null;
  private dragRafId: number | null = null;
  private resizeRafId: number | null = null;
  private wheelRafId: number | null = null;
  private wheelDeltaAcc = 0;

  private lastCropArea: CropArea | null = null;
  private lastImagePosition: ImagePosition | null = null;
  private lastDrawTrigger: {
    cropArea: CropArea | null;
    imagePosition: ImagePosition;
    scale: number;
  } | null = null;
  private skipNextDraw = false;

  private boundImageMouseMove: ((e: MouseEvent) => void) | null = null;
  private boundMouseUp: (() => void) | null = null;

  private resizeObserver: ResizeObserver | null = null;
  private wheelListener: ((e: WheelEvent) => void) | null = null;
  private wheelListenerTarget: HTMLElement | null = null;

  protected readonly canvasClasses = computed((): string =>
    clsx(classes.host, classes.size(this.size())),
  );

  protected readonly cursorStyle = computed((): string =>
    this.isDraggingImageSignal() ? 'grabbing' : 'default',
  );

  protected readonly tagPosition = this.tagPositionSignal.asReadonly();

  protected readonly showTag = computed(
    (): boolean =>
      this.cropAreaSignal() !== null && this.tagPositionSignal() !== null,
  );

  protected readonly tagText = computed((): string => {
    const area = this.tagCropAreaSignal() ?? this.cropAreaSignal();
    if (!area) return '';
    return `${Math.round(area.width)} × ${Math.round(area.height)} px`;
  });

  constructor() {
    afterNextRender(() => {
      this.setupResizeObserver();
      this.setupWheelListener();
    });

    effect(() => {
      const src = this.imageSrc();
      untracked(() => this.loadImageSrc(src));
    });

    effect(() => {
      const ar = this.aspectRatio();
      const loaded = this.imageLoadedSignal();
      const img = this.image;
      if (!loaded || !img) return;
      untracked(() => {
        if (this.initialCropArea()) return;
        const canvas = this.canvasRef()?.nativeElement;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const { cropArea, imagePosition } = calculateInitialCropArea(
          img,
          rect,
          ar,
        );
        this.setCropAreaIfChanged(cropArea);
        this.setImagePositionIfChanged(imagePosition);
      });
    });

    effect(() => {
      const cropArea = this.cropAreaSignal();
      const imagePosition = this.imagePositionSignal();
      const scale = this.scaleSignal();
      const imageLoaded = this.imageLoadedSignal();
      const initReady = this.initReadySignal();

      if (!imageLoaded || !initReady || !cropArea) return;

      const hasChanged =
        !this.lastDrawTrigger ||
        !isCropAreaSimilar(
          this.lastDrawTrigger.cropArea,
          cropArea,
          CROP_AREA_SIMILARITY_THRESHOLD,
        ) ||
        !isImagePositionSimilar(
          this.lastDrawTrigger.imagePosition,
          imagePosition,
          IMAGE_POSITION_SIMILARITY_THRESHOLD,
        ) ||
        this.lastDrawTrigger.scale !== scale;

      if (!hasChanged) return;

      if (this.skipNextDraw) {
        this.skipNextDraw = false;
        return;
      }

      this.lastDrawTrigger = { cropArea, imagePosition, scale };

      if (!this.isDraggingImageSignal()) {
        this.updateTagPosition();
      }
      this.scheduleDraw();
    });

    effect(() => {
      const cropArea = this.cropAreaSignal();
      const scale = this.scaleSignal();
      const imagePosition = this.imagePositionSignal();
      const imageLoaded = this.imageLoadedSignal();
      if (!cropArea || !imageLoaded) return;

      const canvas = this.canvasRef()?.nativeElement;
      const img = this.image;
      if (!canvas || !img) return;

      const rect = canvas.getBoundingClientRect();
      const baseSize = getBaseDisplaySize(rect, img);
      const displayWidth = baseSize.width * scale;
      const displayHeight = baseSize.height * scale;
      const constrained = constrainImagePosition(
        imagePosition.offsetX,
        imagePosition.offsetY,
        displayWidth,
        displayHeight,
        cropArea,
      );

      if (
        constrained.offsetX !== imagePosition.offsetX ||
        constrained.offsetY !== imagePosition.offsetY
      ) {
        this.skipNextDraw = true;
        this.setImagePositionIfChanged(constrained);
      }
    });

    effect(() => {
      const cropArea = this.cropAreaSignal();
      const loaded = this.imageLoadedSignal();
      if (!cropArea || !loaded) return;
      if (this.isDraggingImageSignal()) return;
      untracked(() => this.emitCropChange(cropArea));
    });

    this.destroyRef.onDestroy(() => this.cleanup());
  }

  private loadImageSrc(src: string | File | Blob | undefined): void {
    const loadId = ++this.imageLoadId;

    this.initReadySignal.set(false);
    this.imageLoadedSignal.set(false);
    this.image = null;

    if (!src) return;

    let objectUrl: string | null = null;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const doLoad = async (): Promise<void> => {
      try {
        if (typeof src === 'string') {
          img.src = src;
        } else {
          objectUrl = URL.createObjectURL(src);
          img.src = objectUrl;
        }

        await new Promise<void>((resolve, reject) => {
          img.onload = (): void => resolve();
          img.onerror = reject;
        });

        if (this.imageLoadId !== loadId) return;

        this.image = img;
        this.imageLoadedSignal.set(true);
        this.imageLoad.emit();

        const canvas = this.canvasRef()?.nativeElement;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const initial = this.initialCropArea();
        const { baseDisplayHeight, baseDisplayWidth, cropArea, imagePosition } =
          calculateInitialCropArea(img, rect, this.aspectRatio());

        this.baseDisplaySize = {
          height: baseDisplayHeight,
          width: baseDisplayWidth,
        };

        if (initial) {
          this.setCropAreaIfChanged(initial);
        } else {
          this.setCropAreaIfChanged(cropArea);
        }
        this.setImagePositionIfChanged(imagePosition);
        this.initReadySignal.set(true);
      } catch (error) {
        if (this.imageLoadId !== loadId) return;
        this.imageLoadedSignal.set(false);
        this.imageError.emit(
          error instanceof Error ? error : new Error(String(error)),
        );
      } finally {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      }
    };

    void doLoad();
  }

  private setupResizeObserver(): void {
    const element = this.canvasRef()?.nativeElement?.parentElement;
    const canvas = this.canvasRef()?.nativeElement;
    if (!element || !canvas) return;

    this.resizeObserver = new ResizeObserver(() => {
      if (this.resizeRafId !== null) return;
      this.resizeRafId = requestAnimationFrame(() => {
        this.resizeRafId = null;
        if (!this.imageLoadedSignal()) return;

        // Release the CSS lock set by drawCanvas so the canvas can
        // reflow to the parent's new size before we remeasure.
        // drawCanvas will re-lock after reading the fresh rect.
        canvas.style.width = '';
        canvas.style.height = '';

        const rect = canvas.getBoundingClientRect();
        if (!rect.height) return;

        const img = this.image;
        if (!img) return;

        this.baseDisplaySize = getBaseDisplaySize(rect, img);

        const initial = this.initialCropArea();
        if (!initial) {
          this.skipNextDraw = true;
          const { cropArea, imagePosition } = calculateInitialCropArea(
            img,
            rect,
            this.aspectRatio(),
          );
          this.setCropAreaIfChanged(cropArea);
          this.setImagePositionIfChanged(imagePosition);
        } else {
          this.scheduleDraw();
        }
      });
    });

    this.resizeObserver.observe(element);
    this.resizeObserver.observe(canvas);
  }

  private setupWheelListener(): void {
    // Match React: attach wheel listener to the canvas itself so each
    // scroll tick maps 1:1 to a scale step. passive:false lets us
    // preventDefault to block the browser's native page zoom (trackpad
    // pinch ships as wheel + ctrlKey).
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;

    this.wheelListener = (e: WheelEvent): void => this.onWheel(e);
    this.wheelListenerTarget = canvas;
    canvas.addEventListener('wheel', this.wheelListener, { passive: false });
  }

  private scheduleDraw(): void {
    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.drawCanvas();
    });
  }

  private drawCanvas(): void {
    const canvas = this.canvasRef()?.nativeElement;
    const img = this.image;
    const crop = this.cropAreaSignal();
    if (!canvas || !img || !crop) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Lock the canvas's CSS size to its currently measured rect BEFORE
    // we touch `canvas.width`/`canvas.height`. Those attributes act as
    // presentational hints (`aspect-ratio: auto W / H`) that propagate
    // the drawing-buffer size into the element's intrinsic size. With
    // an ancestor that sizes to content (e.g. `.mzn-modal--wide` uses
    // `width: max-content`), doubling the attribute by DPR would feed
    // back into the parent layout and each redraw would double the
    // modal — exactly the "整個 modal 都放大" bug. Explicit
    // `style.width/height` keeps the rendered size decoupled from the
    // buffer resolution.
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const baseSize = getBaseDisplaySize(rect, img);
    if (!this.baseDisplaySize) {
      this.baseDisplaySize = { height: baseSize.height, width: baseSize.width };
    }

    const currentScale = this.scaleSignal();
    const displayWidth = baseSize.width * currentScale;
    const displayHeight = baseSize.height * currentScale;
    const imagePosition = this.imagePositionSignal();
    const constrained = constrainImagePosition(
      imagePosition.offsetX,
      imagePosition.offsetY,
      displayWidth,
      displayHeight,
      crop,
    );

    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.drawImage(
      img,
      constrained.offsetX,
      constrained.offsetY,
      displayWidth,
      displayHeight,
    );

    ctx.save();
    const clipPath = new Path2D();
    clipPath.rect(0, 0, rect.width, rect.height);
    clipPath.rect(crop.x, crop.y, crop.width, crop.height);
    ctx.clip(clipPath, 'evenodd');

    const overlayColor =
      this.getCssVar('--mzn-color-overlay-strong') || 'rgba(0, 0, 0, 0.60)';
    ctx.fillStyle = overlayColor;
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.restore();

    const borderColor = this.getCssVar('--mzn-color-border-brand') || '#5D74E9';
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = BORDER_WIDTH;
    ctx.strokeRect(crop.x, crop.y, crop.width, crop.height);
  }

  private updateTagPosition(): void {
    const crop = this.cropAreaSignal();
    const canvas = this.canvasRef()?.nativeElement;
    const element = canvas?.parentElement;

    if (!crop || !canvas || !element) {
      this.tagPositionSignal.set(null);
      return;
    }

    const canvasRect = canvas.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const nextPosition = {
      left:
        canvasRect.left -
        elementRect.left +
        crop.x +
        crop.width -
        TAG_INSET_PX -
        BORDER_WIDTH,
      top:
        canvasRect.top -
        elementRect.top +
        crop.y +
        crop.height -
        TAG_INSET_PX -
        BORDER_WIDTH,
    };

    const prev = this.tagPositionSignal();
    if (
      !prev ||
      prev.left !== nextPosition.left ||
      prev.top !== nextPosition.top
    ) {
      this.tagPositionSignal.set(nextPosition);
    }
  }

  private isPointOnImage(x: number, y: number): boolean {
    const canvas = this.canvasRef()?.nativeElement;
    const img = this.image;
    if (!canvas || !img) return false;

    const rect = canvas.getBoundingClientRect();
    const baseSize = getBaseDisplaySize(rect, img);
    const currentScale = this.scaleSignal();
    const displayWidth = baseSize.width * currentScale;
    const displayHeight = baseSize.height * currentScale;
    const imagePos = this.imagePositionSignal();

    return (
      x >= imagePos.offsetX &&
      x <= imagePos.offsetX + displayWidth &&
      y >= imagePos.offsetY &&
      y <= imagePos.offsetY + displayHeight
    );
  }

  protected onCanvasMouseDown(e: MouseEvent): void {
    const crop = this.cropAreaSignal();
    const canvas = this.canvasRef()?.nativeElement;
    if (!crop || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!this.isPointOnImage(x, y)) return;

    this.isDraggingImageSignal.set(true);
    const imagePos = this.imagePositionSignal();
    this.imageDragStartSignal.set({
      offsetX: imagePos.offsetX,
      offsetY: imagePos.offsetY,
      x: e.clientX,
      y: e.clientY,
    });
    this.attachDocumentImageDragListeners();
  }

  private onImageMouseMove(e: MouseEvent): void {
    const imageDragStart = this.imageDragStartSignal();
    const crop = this.cropAreaSignal();
    const canvas = this.canvasRef()?.nativeElement;
    const img = this.image;

    if (!imageDragStart || !canvas || !img || !crop) return;

    if (this.dragRafId !== null) {
      cancelAnimationFrame(this.dragRafId);
    }

    this.dragRafId = requestAnimationFrame(() => {
      this.dragRafId = null;

      const rect = canvas.getBoundingClientRect();
      const baseSize = getBaseDisplaySize(rect, img);
      const currentScale = this.scaleSignal();
      const displayWidth = baseSize.width * currentScale;
      const displayHeight = baseSize.height * currentScale;

      const deltaX = e.clientX - imageDragStart.x;
      const deltaY = e.clientY - imageDragStart.y;
      const newOffsetX = imageDragStart.offsetX + deltaX;
      const newOffsetY = imageDragStart.offsetY + deltaY;

      const constrained = constrainImagePosition(
        newOffsetX,
        newOffsetY,
        displayWidth,
        displayHeight,
        crop,
      );

      const current = this.lastImagePosition ?? this.imagePositionSignal();
      if (
        !isImagePositionSimilar(
          current,
          constrained,
          IMAGE_POSITION_SIMILARITY_THRESHOLD,
        )
      ) {
        this.imagePositionSignal.set(constrained);
        this.lastImagePosition = constrained;
        this.scheduleDraw();
      }
    });
  }

  private onMouseUp(): void {
    if (this.dragRafId !== null) {
      cancelAnimationFrame(this.dragRafId);
      this.dragRafId = null;
    }

    const wasDraggingImage = this.isDraggingImageSignal();

    this.isDraggingImageSignal.set(false);
    this.imageDragStartSignal.set(null);
    this.removeDocumentListeners();

    if (wasDraggingImage) {
      this.updateTagPosition();
      const crop = this.cropAreaSignal();
      if (crop && this.imageLoadedSignal()) {
        this.emitCropChange(crop);
      }
      this.imageDragEnd.emit();
    }
  }

  private onWheel(e: WheelEvent): void {
    if (!this.cropAreaSignal()) return;
    e.preventDefault();

    // Why RAF coalescing is required here (Angular-specific):
    // React's `setScale` is async and closure-captured — rapid trackpad
    // wheel events (100+ per swipe) all see the stale `scale` closure,
    // compute the same `newScale`, and React dedupes to one update per
    // render. Angular signals are synchronous: every event immediately
    // reads the latest value, so 50 swipe events × 0.05 = +2.5,
    // saturating MAX_SCALE in one gesture and producing the "instant
    // max zoom" bug the user reported.
    //
    // Accumulate deltaY and apply a single ±0.05 step per frame — this
    // mirrors React's effective batching rate without deviating from
    // the per-event scale logic.
    this.wheelDeltaAcc += e.deltaY;
    if (this.wheelRafId !== null) return;
    this.wheelRafId = requestAnimationFrame(() => {
      this.wheelRafId = null;
      const acc = this.wheelDeltaAcc;
      this.wheelDeltaAcc = 0;
      if (acc === 0) return;

      const delta = acc > 0 ? -0.05 : 0.05;
      const newScale = Math.max(
        MIN_SCALE,
        Math.min(MAX_SCALE, this.scaleSignal() + delta),
      );
      this.handleScaleChange(newScale);
    });
  }

  protected onSliderChange(value: number | readonly [number, number]): void {
    if (typeof value !== 'number') return;
    this.handleScaleChange(value);
  }

  private attachDocumentImageDragListeners(): void {
    this.removeDocumentListeners();
    this.boundImageMouseMove = (e: MouseEvent): void =>
      this.onImageMouseMove(e);
    this.boundMouseUp = (): void => this.onMouseUp();
    document.addEventListener('mousemove', this.boundImageMouseMove);
    document.addEventListener('mouseup', this.boundMouseUp);
  }

  private removeDocumentListeners(): void {
    if (this.boundImageMouseMove) {
      document.removeEventListener('mousemove', this.boundImageMouseMove);
      this.boundImageMouseMove = null;
    }
    if (this.boundMouseUp) {
      document.removeEventListener('mouseup', this.boundMouseUp);
      this.boundMouseUp = null;
    }
  }

  private handleScaleChange(newScale: number): void {
    const canvas = this.canvasRef()?.nativeElement;
    const img = this.image;
    const crop = this.cropAreaSignal();

    if (!canvas || !img || !crop) {
      this.scaleSignal.set(newScale);
      this.scaleChange.emit(newScale);
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const baseSize = getBaseDisplaySize(rect, img);

    const centerX = crop.x + crop.width / 2;
    const centerY = crop.y + crop.height / 2;

    const currentScale = this.scaleSignal();
    const imagePos = this.imagePositionSignal();
    const currentDisplayWidth = baseSize.width * currentScale;
    const currentDisplayHeight = baseSize.height * currentScale;

    const currentCenterOffsetX =
      centerX - (imagePos.offsetX + currentDisplayWidth / 2);
    const currentCenterOffsetY =
      centerY - (imagePos.offsetY + currentDisplayHeight / 2);

    const newDisplayWidth = baseSize.width * newScale;
    const newDisplayHeight = baseSize.height * newScale;

    const newOffsetX = centerX - newDisplayWidth / 2 - currentCenterOffsetX;
    const newOffsetY = centerY - newDisplayHeight / 2 - currentCenterOffsetY;

    const constrained = constrainImagePosition(
      newOffsetX,
      newOffsetY,
      newDisplayWidth,
      newDisplayHeight,
      crop,
    );

    this.scaleSignal.set(newScale);
    this.imagePositionSignal.set(constrained);
    this.lastImagePosition = constrained;
    this.scaleChange.emit(newScale);
  }

  private emitCropChange(nextCropArea: CropArea): void {
    const canvas = this.canvasRef()?.nativeElement;
    const img = this.image;

    if (!canvas || !img) {
      this.cropChange.emit(nextCropArea);
      this.tagCropAreaSignal.set(nextCropArea);
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const baseScale = getBaseScale(rect, img);
    const currentScale = this.scaleSignal();
    const imageScale = baseScale / currentScale;
    const imagePos = this.imagePositionSignal();

    const rawWidth = nextCropArea.width * imageScale;
    const rawHeight = nextCropArea.height * imageScale;
    const rawX = (nextCropArea.x - imagePos.offsetX) * imageScale;
    const rawY = (nextCropArea.y - imagePos.offsetY) * imageScale;

    const clampedWidth = Math.min(img.width, Math.max(0, rawWidth));
    const clampedHeight = Math.min(img.height, Math.max(0, rawHeight));
    const clampedX = Math.min(img.width - clampedWidth, Math.max(0, rawX));
    const clampedY = Math.min(img.height - clampedHeight, Math.max(0, rawY));

    const emittedCropArea: CropArea = {
      height: clampedHeight,
      width: clampedWidth,
      x: clampedX,
      y: clampedY,
    };

    this.cropChange.emit(emittedCropArea);
    this.tagCropAreaSignal.set(emittedCropArea);
  }

  private setCropAreaIfChanged(next: CropArea): void {
    if (
      !isCropAreaSimilar(
        this.lastCropArea,
        next,
        CROP_AREA_SIMILARITY_THRESHOLD,
      )
    ) {
      this.lastCropArea = next;
      this.cropAreaSignal.set(next);
    }
  }

  private setImagePositionIfChanged(next: ImagePosition): void {
    if (
      !isImagePositionSimilar(
        this.lastImagePosition,
        next,
        IMAGE_POSITION_SIMILARITY_THRESHOLD,
      )
    ) {
      this.lastImagePosition = next;
      this.imagePositionSignal.set(next);
    }
  }

  private getCssVar(name: string): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  }

  private cleanup(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.dragRafId !== null) {
      cancelAnimationFrame(this.dragRafId);
      this.dragRafId = null;
    }
    if (this.resizeRafId !== null) {
      cancelAnimationFrame(this.resizeRafId);
      this.resizeRafId = null;
    }
    if (this.wheelRafId !== null) {
      cancelAnimationFrame(this.wheelRafId);
      this.wheelRafId = null;
    }
    this.wheelDeltaAcc = 0;

    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    if (this.wheelListenerTarget && this.wheelListener) {
      this.wheelListenerTarget.removeEventListener('wheel', this.wheelListener);
    }
    this.wheelListener = null;
    this.wheelListenerTarget = null;

    this.removeDocumentListeners();
  }
}
