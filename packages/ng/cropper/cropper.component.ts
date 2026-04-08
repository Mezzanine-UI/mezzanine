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
  viewChild,
} from '@angular/core';
import { cropperClasses as classes } from '@mezzanine-ui/core/cropper';
import { MinusIcon, PlusIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import {
  calculateInitialCropArea,
  constrainImagePosition,
  getBaseDisplaySize,
  getBaseScale,
  ImagePosition,
  isCropAreaSimilar,
  isImagePositionSimilar,
} from './cropper-calculations';

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_MIN_WIDTH = 50;
const DEFAULT_MIN_HEIGHT = 50;
const DEFAULT_MIN_SCALE = 1;
const DEFAULT_MAX_SCALE = 2;
const SCALE_STEP = 0.01;
const BORDER_WIDTH = 2;
const TAG_INSET_PX = 10;
const CROP_AREA_SIMILARITY_THRESHOLD = 0.5;
const IMAGE_POSITION_SIMILARITY_THRESHOLD = 0.1;

// ─── Types ────────────────────────────────────────────────────────────────────

/** Crop area coordinates and dimensions. */
export interface CropArea {
  readonly height: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

type CropperSize = 'main' | 'sub';

type CropHandleType =
  | 'e'
  | 'move'
  | 'n'
  | 'ne'
  | 'nw'
  | 's'
  | 'se'
  | 'sw'
  | 'w';

interface CropHandle {
  readonly type: CropHandleType;
  readonly x: number;
  readonly y: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * 圖片裁切元件，提供 canvas 渲染、拖曳縮放與裁切功能。
 *
 * 透過 `imageSrc` 載入圖片（支援 URL、File、Blob），
 * 使用 canvas 繪製遮罩、裁切邊框與格線，
 * 支援 8 方向 handle 拖曳調整裁切範圍及圖片平移。
 * `aspectRatio` 鎖定裁切比例，`disabled` 禁用所有操作。
 *
 * @example
 * ```html
 * import { MznCropper } from '@mezzanine-ui/ng/cropper';
 *
 * <div mznCropper
 *   imageSrc="https://example.com/photo.jpg"
 *   [aspectRatio]="4/3"
 *   (cropChange)="onCrop($event)"
 * ></div>
 * ```
 *
 * @see MznIcon
 */
@Component({
  selector: '[mznCropper]',
  standalone: true,
  imports: [MznIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.aspectRatio]': 'null',
    '[attr.disabled]': 'null',
    '[attr.imageSrc]': 'null',
    '[attr.initialCropArea]': 'null',
    '[attr.minHeight]': 'null',
    '[attr.minWidth]': 'null',
    '[attr.maxScale]': 'null',
    '[attr.minScale]': 'null',
    '[attr.size]': 'null',
  },
  template: `
    <div [class]="elementClass" #elementRef>
      <canvas
        #canvasRef
        [style.width.%]="100"
        [style.display]="'block'"
        [style.cursor]="cursorStyle()"
        (mousedown)="onCanvasMouseDown($event)"
      ></canvas>

      @if (showTag()) {
        <span
          [class]="tagClass"
          [style.left.px]="tagPosition()!.left"
          [style.top.px]="tagPosition()!.top"
        >
          {{ tagText() }}
        </span>
      }
    </div>

    <!-- Zoom Controls -->
    <div [class]="controlsClass">
      <button
        [class]="zoomBtnClass"
        type="button"
        [disabled]="disabled() || isAtMinScale()"
        (click)="zoomOut()"
        aria-label="Zoom out"
      >
        <i mznIcon [icon]="minusIcon"></i>
      </button>
      <span [class]="scaleLabelClass">{{ scalePercent() }}%</span>
      <button
        [class]="zoomBtnClass"
        type="button"
        [disabled]="disabled() || isAtMaxScale()"
        (click)="zoomIn()"
        aria-label="Zoom in"
      >
        <i mznIcon [icon]="plusIcon"></i>
      </button>
    </div>
  `,
})
export class MznCropper {
  // ── Icons ──────────────────────────────────────────────────────────────────
  protected readonly minusIcon = MinusIcon;
  protected readonly plusIcon = PlusIcon;

  // ── CSS class constants ────────────────────────────────────────────────────
  protected readonly elementClass = classes.element;
  protected readonly tagClass = classes.tag;
  protected readonly controlsClass = classes.controls;
  protected readonly zoomBtnClass = `${classes.host}__zoom-btn`;
  protected readonly scaleLabelClass = `${classes.host}__scale-display`;

  // ── Inputs ─────────────────────────────────────────────────────────────────

  /** 限制裁切區域的長寬比。 */
  readonly aspectRatio = input<number>();

  /**
   * 是否禁用裁切元件。
   * @default false
   */
  readonly disabled = input(false);

  /** 要裁切的圖片來源（URL、File、Blob）。 */
  readonly imageSrc = input<string | File | Blob>();

  /** 初始裁切區域設定。 */
  readonly initialCropArea = input<CropArea>();

  /**
   * 裁切區域最小高度（px）。
   * @default 50
   */
  readonly minHeight = input(DEFAULT_MIN_HEIGHT);

  /**
   * 裁切區域最小寬度（px）。
   * @default 50
   */
  readonly minWidth = input(DEFAULT_MIN_WIDTH);

  /**
   * 最大縮放倍率。
   * @default 2
   */
  readonly maxScale = input(DEFAULT_MAX_SCALE);

  /**
   * 最小縮放倍率。
   * @default 1
   */
  readonly minScale = input(DEFAULT_MIN_SCALE);

  /**
   * 元件尺寸。
   * @default 'main'
   */
  readonly size = input<CropperSize>('main');

  // ── Outputs ────────────────────────────────────────────────────────────────

  /** 裁切區域變更事件（image-pixel 座標空間）。 */
  readonly cropChange = output<CropArea>();

  /** 裁切區域拖曳結束事件。 */
  readonly cropDragEnd = output<CropArea>();

  /** 圖片拖曳結束事件。 */
  readonly imageDragEnd = output<void>();

  /** 圖片載入失敗事件。 */
  readonly imageError = output<Error>();

  /** 圖片載入完成事件。 */
  readonly imageLoad = output<void>();

  /** 縮放倍率變更事件。 */
  readonly scaleChange = output<number>();

  // ── ViewChild refs ─────────────────────────────────────────────────────────
  private readonly canvasRef =
    viewChild.required<ElementRef<HTMLCanvasElement>>('canvasRef');
  private readonly elementRef =
    viewChild.required<ElementRef<HTMLDivElement>>('elementRef');

  // ── Internal image state ───────────────────────────────────────────────────
  private image: HTMLImageElement | null = null;
  private imageLoadId = 0;
  private baseDisplaySize: { height: number; width: number } | null = null;

  // ── Signals: core state ────────────────────────────────────────────────────
  private readonly scaleSignal = signal(1);
  private readonly cropAreaSignal = signal<CropArea | null>(null);
  private readonly imagePositionSignal = signal<ImagePosition>({
    offsetX: 0,
    offsetY: 0,
  });
  private readonly imageLoadedSignal = signal(false);
  private readonly initReadySignal = signal(false);

  // Exposed publicly for consumer access
  readonly scale = this.scaleSignal.asReadonly();
  readonly cropArea = this.cropAreaSignal.asReadonly();

  // ── Signals: drag state ────────────────────────────────────────────────────
  private readonly isDraggingSignal = signal(false);
  private readonly isDraggingImageSignal = signal(false);
  private readonly dragHandleSignal = signal<CropHandle | null>(null);
  private readonly dragStartSignal = signal<{ x: number; y: number } | null>(
    null,
  );
  private readonly imageDragStartSignal = signal<{
    readonly offsetX: number;
    readonly offsetY: number;
    readonly x: number;
    readonly y: number;
  } | null>(null);

  // ── Signals: tag ──────────────────────────────────────────────────────────
  private readonly tagPositionSignal = signal<{
    left: number;
    top: number;
  } | null>(null);
  private readonly tagCropAreaSignal = signal<CropArea | null>(null);

  // ── RAF handles ───────────────────────────────────────────────────────────
  private rafId: number | null = null;
  private dragRafId: number | null = null;
  private resizeRafId: number | null = null;

  // ── Change-tracking refs ───────────────────────────────────────────────────
  private lastCropArea: CropArea | null = null;
  private lastImagePosition: ImagePosition | null = null;
  private lastDrawTrigger: {
    cropArea: CropArea | null;
    imagePosition: ImagePosition;
    scale: number;
  } | null = null;
  private skipNextDraw = false;

  // ── Document event cleanup ─────────────────────────────────────────────────
  private boundMouseMove: ((e: MouseEvent) => void) | null = null;
  private boundImageMouseMove: ((e: MouseEvent) => void) | null = null;
  private boundMouseUp: (() => void) | null = null;

  // ── ResizeObserver ─────────────────────────────────────────────────────────
  private resizeObserver: ResizeObserver | null = null;
  private wheelListener: ((e: WheelEvent) => void) | null = null;

  // ── Derived ───────────────────────────────────────────────────────────────

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, classes.size(this.size()), {
      [`${classes.host}--disabled`]: this.disabled(),
    }),
  );

  protected readonly scalePercent = computed((): number =>
    Math.round(this.scaleSignal() * 100),
  );

  protected readonly isAtMinScale = computed(
    (): boolean => this.scaleSignal() <= this.minScale(),
  );

  protected readonly isAtMaxScale = computed(
    (): boolean => this.scaleSignal() >= this.maxScale(),
  );

  protected readonly cursorStyle = computed((): string => {
    if (this.isDraggingSignal() || this.isDraggingImageSignal())
      return 'grabbing';
    return 'default';
  });

  protected readonly showTag = computed((): boolean => {
    return this.cropAreaSignal() !== null && this.tagPositionSignal() !== null;
  });

  protected readonly tagPosition = this.tagPositionSignal.asReadonly();

  protected readonly tagText = computed((): string => {
    const area = this.tagCropAreaSignal() ?? this.cropAreaSignal();
    if (!area) return '';
    return `${Math.round(area.width)} × ${Math.round(area.height)} px`;
  });

  // ── DI ────────────────────────────────────────────────────────────────────
  private readonly destroyRef = inject(DestroyRef);

  // ── Constructor / lifecycle ────────────────────────────────────────────────

  constructor() {
    // After the view initialises, wire up ResizeObserver and wheel listener
    afterNextRender(() => {
      this.setupResizeObserver();
      this.setupWheelListener();
    });

    // React to imageSrc changes
    effect(() => {
      const src = this.imageSrc();
      this.loadImageSrc(src);
    });

    // Trigger draw when visual state changes
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

      if (!this.isDraggingImageSignal() && !this.isDraggingSignal()) {
        this.updateTagPosition();
      }
      this.scheduleDraw();
    });

    // Constrain image position when crop area or scale changes
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

    this.destroyRef.onDestroy(() => {
      this.cleanup();
    });
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /** Increase zoom by one SCALE_STEP, clamped to maxScale. */
  zoomIn(): void {
    if (this.disabled()) return;
    const newScale = Math.min(
      this.maxScale(),
      this.scaleSignal() + SCALE_STEP * 10,
    );
    this.handleScaleChange(Math.round(newScale * 100) / 100);
  }

  /** Decrease zoom by one SCALE_STEP, clamped to minScale. */
  zoomOut(): void {
    if (this.disabled()) return;
    const newScale = Math.max(
      this.minScale(),
      this.scaleSignal() - SCALE_STEP * 10,
    );
    this.handleScaleChange(Math.round(newScale * 100) / 100);
  }

  // ── Image loading ──────────────────────────────────────────────────────────

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

        if (!initial) {
          this.setCropAreaIfChanged(cropArea);
          this.setImagePositionIfChanged(imagePosition);
        } else {
          this.setCropAreaIfChanged(initial);
          this.setImagePositionIfChanged(imagePosition);
        }

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

  // ── ResizeObserver ─────────────────────────────────────────────────────────

  private setupResizeObserver(): void {
    const element = this.elementRef()?.nativeElement;
    const canvas = this.canvasRef()?.nativeElement;
    if (!element || !canvas) return;

    this.resizeObserver = new ResizeObserver(() => {
      if (this.resizeRafId !== null) return;
      this.resizeRafId = requestAnimationFrame(() => {
        this.resizeRafId = null;
        if (!this.imageLoadedSignal()) return;

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
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;

    this.wheelListener = (e: WheelEvent): void => {
      this.onWheel(e);
    };
    canvas.addEventListener('wheel', this.wheelListener, { passive: false });
  }

  // ── Drawing ────────────────────────────────────────────────────────────────

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

    const finalOffsetX = constrained.offsetX;
    const finalOffsetY = constrained.offsetY;

    // Clear
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw image
    ctx.drawImage(img, finalOffsetX, finalOffsetY, displayWidth, displayHeight);

    // Draw overlay (darken outside crop area using even-odd clip)
    ctx.save();
    const clipPath = new Path2D();
    clipPath.rect(0, 0, rect.width, rect.height);
    clipPath.rect(crop.x, crop.y, crop.width, crop.height);
    ctx.clip(clipPath, 'evenodd');

    const overlayColor =
      this.getCssVar('--mzn-color-overlay-strong') || 'rgba(0,0,0,0.60)';
    ctx.fillStyle = overlayColor;
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.restore();

    // Draw crop border
    const borderColor = this.getCssVar('--mzn-color-border-brand') || '#5D74E9';
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = BORDER_WIDTH;
    ctx.strokeRect(crop.x, crop.y, crop.width, crop.height);

    // Draw 3×3 grid lines inside crop area
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1;
    const gridColW = crop.width / 3;
    const gridRowH = crop.height / 3;
    ctx.beginPath();
    for (let i = 1; i < 3; i++) {
      const gx = crop.x + gridColW * i;
      const gy = crop.y + gridRowH * i;
      ctx.moveTo(gx, crop.y);
      ctx.lineTo(gx, crop.y + crop.height);
      ctx.moveTo(crop.x, gy);
      ctx.lineTo(crop.x + crop.width, gy);
    }
    ctx.stroke();

    // Draw handles (small squares at corners + midpoints)
    this.drawHandles(ctx, crop);
  }

  private drawHandles(ctx: CanvasRenderingContext2D, crop: CropArea): void {
    const handleSize = 8;
    const handles = this.getCropHandles(crop);
    const borderColor = this.getCssVar('--mzn-color-border-brand') || '#5D74E9';

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = BORDER_WIDTH;

    for (const handle of handles) {
      if (handle.type === 'move') continue;
      ctx.fillRect(
        handle.x - handleSize / 2,
        handle.y - handleSize / 2,
        handleSize,
        handleSize,
      );
      ctx.strokeRect(
        handle.x - handleSize / 2,
        handle.y - handleSize / 2,
        handleSize,
        handleSize,
      );
    }
  }

  // ── Handle definitions ─────────────────────────────────────────────────────

  private getCropHandles(crop: CropArea): readonly CropHandle[] {
    const { height, width, x, y } = crop;
    const mx = x + width / 2;
    const my = y + height / 2;
    const r = x + width;
    const b = y + height;
    return [
      { type: 'nw', x, y },
      { type: 'n', x: mx, y },
      { type: 'ne', x: r, y },
      { type: 'e', x: r, y: my },
      { type: 'se', x: r, y: b },
      { type: 's', x: mx, y: b },
      { type: 'sw', x, y: b },
      { type: 'w', x, y: my },
      { type: 'move', x: mx, y: my },
    ] as const;
  }

  // ── Tag position ───────────────────────────────────────────────────────────

  private updateTagPosition(): void {
    const crop = this.cropAreaSignal();
    const canvas = this.canvasRef()?.nativeElement;
    const element = this.elementRef()?.nativeElement;

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

  // ── Mouse events ───────────────────────────────────────────────────────────

  protected onCanvasMouseDown(e: MouseEvent): void {
    if (this.disabled()) return;

    const crop = this.cropAreaSignal();
    const canvas = this.canvasRef()?.nativeElement;
    if (!crop || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Hit-test handles first
    const handleHit = this.hitTestHandle(x, y, crop);
    if (handleHit) {
      this.isDraggingSignal.set(true);
      this.dragHandleSignal.set(handleHit);
      this.dragStartSignal.set({ x: e.clientX, y: e.clientY });
      this.attachDocumentDragListeners();
      return;
    }

    // Hit-test inside crop area (move)
    if (this.isPointInCropArea(x, y, crop)) {
      const moveHandle: CropHandle = { type: 'move', x, y };
      this.isDraggingSignal.set(true);
      this.dragHandleSignal.set(moveHandle);
      this.dragStartSignal.set({ x: e.clientX, y: e.clientY });
      this.attachDocumentDragListeners();
      return;
    }

    // Hit image area (image pan)
    if (this.isPointOnImage(x, y)) {
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
  }

  private onMouseMove(e: MouseEvent): void {
    const isDragging = this.isDraggingSignal();
    const dragHandle = this.dragHandleSignal();
    const dragStart = this.dragStartSignal();
    const crop = this.cropAreaSignal();

    if (!isDragging || !dragHandle || !dragStart || !crop) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    this.updateCropArea(dragHandle, deltaX, deltaY);
    this.dragStartSignal.set({ x: e.clientX, y: e.clientY });
  }

  private onImageMouseMove(e: MouseEvent): void {
    const isDraggingImage = this.isDraggingImageSignal();
    const imageDragStart = this.imageDragStartSignal();
    const crop = this.cropAreaSignal();
    const canvas = this.canvasRef()?.nativeElement;
    const img = this.image;

    if (!isDraggingImage || !imageDragStart || !canvas || !img || !crop) return;

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
        this.cropAreaSignal()!,
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

    const wasDraggingCrop = this.isDraggingSignal();
    const wasDraggingImage = this.isDraggingImageSignal();

    this.isDraggingSignal.set(false);
    this.dragHandleSignal.set(null);
    this.dragStartSignal.set(null);
    this.isDraggingImageSignal.set(false);
    this.imageDragStartSignal.set(null);

    this.removeDocumentListeners();

    if (wasDraggingCrop || wasDraggingImage) {
      this.updateTagPosition();
      const crop = this.cropAreaSignal();
      if (crop && this.imageLoadedSignal()) {
        this.emitCropChange(crop);
      }
    }

    if (wasDraggingCrop) {
      const crop = this.cropAreaSignal();
      if (crop) this.cropDragEnd.emit(crop);
    }

    if (wasDraggingImage) {
      this.imageDragEnd.emit();
    }
  }

  private onWheel(e: WheelEvent): void {
    if (!this.cropAreaSignal()) return;
    e.preventDefault();

    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    const newScale = Math.max(
      this.minScale(),
      Math.min(this.maxScale(), this.scaleSignal() + delta),
    );
    this.handleScaleChange(newScale);
  }

  // ── Drag document listeners ────────────────────────────────────────────────

  private attachDocumentDragListeners(): void {
    this.removeDocumentListeners();
    this.boundMouseMove = (e: MouseEvent): void => this.onMouseMove(e);
    this.boundMouseUp = (): void => this.onMouseUp();
    document.addEventListener('mousemove', this.boundMouseMove);
    document.addEventListener('mouseup', this.boundMouseUp);
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
    if (this.boundMouseMove) {
      document.removeEventListener('mousemove', this.boundMouseMove);
      this.boundMouseMove = null;
    }
    if (this.boundImageMouseMove) {
      document.removeEventListener('mousemove', this.boundImageMouseMove);
      this.boundImageMouseMove = null;
    }
    if (this.boundMouseUp) {
      document.removeEventListener('mouseup', this.boundMouseUp);
      this.boundMouseUp = null;
    }
  }

  // ── Scale change ───────────────────────────────────────────────────────────

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

    // Keep crop area center fixed during zoom
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

  // ── Crop area update (resize/move) ─────────────────────────────────────────

  private updateCropArea(
    handle: CropHandle,
    deltaX: number,
    deltaY: number,
  ): void {
    const crop = this.cropAreaSignal();
    if (!crop) return;

    let x = crop.x;
    let y = crop.y;
    let width = crop.width;
    let height = crop.height;

    switch (handle.type) {
      case 'move':
        x = Math.max(0, crop.x + deltaX);
        y = Math.max(0, crop.y + deltaY);
        {
          const canvas = this.canvasRef()?.nativeElement;
          if (canvas) {
            const rect = canvas.getBoundingClientRect();
            x = Math.min(x, rect.width - width);
            y = Math.min(y, rect.height - height);
          }
        }
        break;

      case 'nw':
        width = crop.width - deltaX;
        height = crop.height - deltaY;
        x = crop.x + deltaX;
        y = crop.y + deltaY;
        break;

      case 'ne':
        width = crop.width + deltaX;
        height = crop.height - deltaY;
        y = crop.y + deltaY;
        break;

      case 'sw':
        width = crop.width - deltaX;
        height = crop.height + deltaY;
        x = crop.x + deltaX;
        break;

      case 'se':
        width = crop.width + deltaX;
        height = crop.height + deltaY;
        break;

      case 'n':
        height = crop.height - deltaY;
        y = crop.y + deltaY;
        break;

      case 's':
        height = crop.height + deltaY;
        break;

      case 'w':
        width = crop.width - deltaX;
        x = crop.x + deltaX;
        break;

      case 'e':
        width = crop.width + deltaX;
        break;
    }

    const anchor = {
      bottom: y + height,
      centerX: x + width / 2,
      centerY: y + height / 2,
      left: x,
      right: x + width,
      top: y,
    };

    // Maintain aspect ratio
    const aspectRatio = this.aspectRatio();
    if (aspectRatio && handle.type !== 'move') {
      const currentAspect = width / height;
      if (Math.abs(currentAspect - aspectRatio) > 0.01) {
        if (handle.type.includes('w') || handle.type.includes('e')) {
          height = width / aspectRatio;
        } else {
          width = height * aspectRatio;
        }
      }

      switch (handle.type) {
        case 'nw':
          x = anchor.right - width;
          y = anchor.bottom - height;
          break;
        case 'ne':
          x = anchor.left;
          y = anchor.bottom - height;
          break;
        case 'sw':
          x = anchor.right - width;
          y = anchor.top;
          break;
        case 'se':
          x = anchor.left;
          y = anchor.top;
          break;
        case 'n':
          x = anchor.centerX - width / 2;
          y = anchor.bottom - height;
          break;
        case 's':
          x = anchor.centerX - width / 2;
          y = anchor.top;
          break;
        case 'w':
          x = anchor.right - width;
          y = anchor.centerY - height / 2;
          break;
        case 'e':
          x = anchor.left;
          y = anchor.centerY - height / 2;
          break;
      }
    }

    // Apply constraints
    const canvas = this.canvasRef()?.nativeElement;
    const img = this.image;
    const minWidth = this.minWidth();
    const minHeight = this.minHeight();
    const currentScale = this.scaleSignal();
    const imagePos = this.imagePositionSignal();

    if (canvas && img) {
      const rect = canvas.getBoundingClientRect();
      const baseSize = getBaseDisplaySize(rect, img);
      const displayWidth = baseSize.width * currentScale;
      const displayHeight = baseSize.height * currentScale;

      const imageLeft = imagePos.offsetX;
      const imageRight = imagePos.offsetX + displayWidth;
      const imageTop = imagePos.offsetY;
      const imageBottom = imagePos.offsetY + displayHeight;

      if (aspectRatio) {
        const maxWidthFromImage = Math.min(
          imageRight - Math.max(x, imageLeft),
          Math.max(x + width, imageRight) - imageLeft,
        );
        const maxHeightFromImage = Math.min(
          imageBottom - Math.max(y, imageTop),
          Math.max(y + height, imageBottom) - imageTop,
        );

        const maxWidthByAspect = maxHeightFromImage * aspectRatio;
        const maxHeightByAspect = maxWidthFromImage / aspectRatio;

        if (maxWidthByAspect <= maxWidthFromImage) {
          width = Math.max(minWidth, Math.min(width, maxWidthByAspect));
          height = width / aspectRatio;
        } else {
          height = Math.max(minHeight, Math.min(height, maxHeightByAspect));
          width = height * aspectRatio;
        }

        if (x < imageLeft) {
          x = imageLeft;
        } else if (x + width > imageRight) {
          x = imageRight - width;
        }
        if (y < imageTop) {
          y = imageTop;
        } else if (y + height > imageBottom) {
          y = imageBottom - height;
        }

        x = Math.max(0, Math.min(x, rect.width - width));
        y = Math.max(0, Math.min(y, rect.height - height));
      } else {
        const maxWidth = Math.min(
          rect.width - x,
          imageRight - Math.max(x, imageLeft),
        );
        const maxHeight = Math.min(
          rect.height - y,
          imageBottom - Math.max(y, imageTop),
        );

        width = Math.max(minWidth, Math.min(width, maxWidth));
        height = Math.max(minHeight, Math.min(height, maxHeight));

        if (x < imageLeft) {
          x = imageLeft;
        } else if (x + width > imageRight) {
          x = imageRight - width;
        }
        if (y < imageTop) {
          y = imageTop;
        } else if (y + height > imageBottom) {
          y = imageBottom - height;
        }

        x = Math.max(0, Math.min(x, rect.width - width));
        y = Math.max(0, Math.min(y, rect.height - height));
      }
    } else if (canvas) {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(minWidth, Math.min(width, rect.width - x));
      height = Math.max(minHeight, Math.min(height, rect.height - y));
      x = Math.max(0, Math.min(x, rect.width - width));
      y = Math.max(0, Math.min(y, rect.height - height));
    }

    const newCrop: CropArea = { height, width, x, y };
    this.cropAreaSignal.set(newCrop);
    this.lastCropArea = newCrop;
    this.emitCropChange(newCrop);
    this.scheduleDraw();
  }

  // ── Emit crop change ───────────────────────────────────────────────────────

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

  // ── Hit testing ────────────────────────────────────────────────────────────

  private hitTestHandle(
    mouseX: number,
    mouseY: number,
    crop: CropArea,
  ): CropHandle | null {
    const handleSize = 12; // slightly larger hit area
    const handles = this.getCropHandles(crop);

    for (const handle of handles) {
      if (handle.type === 'move') continue;
      if (
        mouseX >= handle.x - handleSize / 2 &&
        mouseX <= handle.x + handleSize / 2 &&
        mouseY >= handle.y - handleSize / 2 &&
        mouseY <= handle.y + handleSize / 2
      ) {
        return handle;
      }
    }
    return null;
  }

  private isPointInCropArea(x: number, y: number, crop: CropArea): boolean {
    return (
      x >= crop.x &&
      x <= crop.x + crop.width &&
      y >= crop.y &&
      y <= crop.y + crop.height
    );
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

  // ── State helpers ──────────────────────────────────────────────────────────

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

  // ── CSS variable helper ────────────────────────────────────────────────────

  private getCssVar(name: string): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  }

  // ── Cleanup ────────────────────────────────────────────────────────────────

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

    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    const canvas = this.canvasRef()?.nativeElement;
    if (canvas && this.wheelListener) {
      canvas.removeEventListener('wheel', this.wheelListener);
      this.wheelListener = null;
    }

    this.removeDocumentListeners();
  }
}
