import {
  computed,
  onBeforeUnmount,
  shallowRef,
  watch,
  watchPostEffect,
} from 'vue';
import type { ComputedRef, ShallowRef } from 'vue';
import { getCSSVariableValue } from '../_internal/css-variable';
import { useDocumentEvents } from '../_internal/use-document-events';
import {
  calculateInitialCropArea as calculateInitialCropAreaUtil,
  constrainImagePosition as constrainImagePositionUtil,
  getBaseDisplaySize as getBaseDisplaySizeUtil,
  getBaseScale as getBaseScaleUtil,
  isCropAreaSimilar as isCropAreaSimilarUtil,
  isImagePositionSimilar as isImagePositionSimilarUtil,
} from './cropper-calculations';
import type { ImagePosition } from './cropper-calculations';
import type { CropArea } from './cropper.types';

interface CropHandle {
  type: 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w' | 'move';
  x: number;
  y: number;
}

// Constants
export const DEFAULT_MIN_WIDTH = 50;
export const DEFAULT_MIN_HEIGHT = 50;
export const MIN_SCALE = 1;
export const MAX_SCALE = 2;
export const SCALE_STEP = 0.01;
const BORDER_WIDTH = 2;
const TAG_INSET_PX = 10;
const CROP_AREA_SIMILARITY_THRESHOLD = 0.5;
const IMAGE_POSITION_SIMILARITY_THRESHOLD = 0.1;

export interface UseCropperElementProps {
  /**
   * Aspect ratio for the crop area (width / height).
   */
  aspectRatio: () => number | undefined;
  /**
   * The image source to crop.
   */
  imageSrc: () => string | File | Blob | undefined;
  /**
   * Initial crop area. When given, the crop area is never recomputed from the
   * canvas' measurements.
   */
  initialCropArea: () => CropArea | undefined;
  /**
   * Minimum crop area height in pixels.
   */
  minHeight: () => number;
  /**
   * Minimum crop area width in pixels.
   */
  minWidth: () => number;
  /**
   * Callback fired when the crop area changes, in image pixel space.
   */
  onCropChange: () => ((cropArea: CropArea) => void) | undefined;
  /**
   * Callback fired when crop area drag ends.
   */
  onCropDragEnd: () => ((cropArea: CropArea) => void) | undefined;
  /**
   * Callback fired when image drag ends.
   */
  onImageDragEnd: () => (() => void) | undefined;
  /**
   * Callback fired when image fails to load.
   */
  onImageError: () => ((error: Error) => void) | undefined;
  /**
   * Callback fired when image loads successfully.
   */
  onImageLoad: () => (() => void) | undefined;
  /**
   * Callback fired when scale (zoom) changes.
   */
  onScaleChange: () => ((scale: number) => void) | undefined;
}

export interface UseCropperElementReturn {
  /**
   * The canvas the image is drawn on.
   */
  canvasRef: ShallowRef<HTMLCanvasElement | null>;
  /**
   * The crop rectangle in canvas coordinates.
   */
  cropArea: ShallowRef<CropArea | null>;
  /**
   * The cursor the canvas draws.
   */
  cursorStyle: ComputedRef<string>;
  /**
   * The wrapper the tag is positioned against.
   */
  elementRef: ShallowRef<HTMLElement | null>;
  /**
   * Starts an image drag when the press lands on the image.
   */
  handleMouseDown: (event: MouseEvent) => void;
  /**
   * Applies a zoom level coming from the slider.
   */
  handleSliderChange: (value: number) => void;
  /**
   * The current zoom level, between `MIN_SCALE` and `MAX_SCALE`.
   */
  scale: ShallowRef<number>;
  /**
   * Template ref setter for the canvas.
   */
  setCanvas: (element: unknown) => void;
  /**
   * Template ref setter for the wrapper.
   */
  setElement: (element: unknown) => void;
  /**
   * The crop rectangle the tag reports, in image pixel space.
   */
  tagCropArea: ShallowRef<CropArea | null>;
  /**
   * Where the tag sits inside the wrapper, or `null` while it has nothing to
   * report.
   */
  tagPosition: ShallowRef<{ left: number; top: number } | null>;
}

/**
 * 驅動裁切畫布的 composable：載入圖片、量測畫布、維護裁切框與縮放，並負責重繪。
 *
 * 裁切框固定，拖曳移動的是底下的圖片；圖片一律被限制在裁切框之下，不會露出空白。
 * `initialCropArea` 有給時完全交由使用端決定，沒給時每次畫布尺寸改變都會依
 * `aspectRatio` 重新置中計算。所有回報給外部的座標都換算回原圖的像素空間。
 *
 * @example
 * ```ts
 * const { cropArea, handleMouseDown, scale, setCanvas } = useCropperElement({
 *   aspectRatio: () => props.aspectRatio,
 *   imageSrc: () => props.imageSrc,
 *   // …其餘 props
 * });
 * ```
 *
 * @see MznCropperElement 搭配的元件
 */
export function useCropperElement(
  props: UseCropperElementProps,
): UseCropperElementReturn {
  // Refs
  const canvasRef = shallowRef<HTMLCanvasElement | null>(null);
  const elementRef = shallowRef<HTMLElement | null>(null);
  let image: HTMLImageElement | null = null;
  let imageLoadId = 0;

  // State - Core
  const cropArea = shallowRef<CropArea | null>(props.initialCropArea() || null);
  const imageLoaded = shallowRef(false);
  const initReady = shallowRef(false);
  const scale = shallowRef(1);
  const imagePosition = shallowRef<ImagePosition>({ offsetX: 0, offsetY: 0 });

  // State - UI
  const tagPosition = shallowRef<{ left: number; top: number } | null>(null);
  const tagCropArea = shallowRef<CropArea | null>(null);

  // State - Interactions
  const isDragging = shallowRef(false);
  const isDraggingImage = shallowRef(false);
  const dragHandle = shallowRef<CropHandle | null>(null);
  const dragStart = shallowRef<{ x: number; y: number } | null>(null);
  const imageDragStart = shallowRef<{
    offsetX: number;
    offsetY: number;
    x: number;
    y: number;
  } | null>(null);

  /**
   * React keeps these in `useRef`, so writing one never re-renders. Plain
   * bindings are the Vue equivalent: making them reactive would feed the
   * effects below their own output.
   */
  let baseDisplaySize: { height: number; width: number } | null = null;
  let lastCanvasSize: { height: number; width: number } | null = null;
  let lastMeasuredSize: { height: number; width: number } | null = null;
  let lastTagPosition: { left: number; top: number } | null = null;
  let lastCropArea: CropArea | null = null;
  let lastImagePosition: ImagePosition | null = null;
  let lastDrawTrigger: {
    cropArea: CropArea | null;
    imagePosition: ImagePosition;
    scale: number;
  } | null = null;

  // Refs - Animation & Control
  let rafId: number | null = null;
  let skipDraw = false;
  let resizeRafId: number | null = null;
  let dragRafId: number | null = null;

  const setCanvas = (element: unknown): void => {
    canvasRef.value = (element as HTMLCanvasElement | null) ?? null;
  };

  const setElement = (element: unknown): void => {
    elementRef.value = (element as HTMLElement | null) ?? null;
  };

  // State management with debouncing
  function setCropAreaIfChanged(nextCropArea: CropArea | null): void {
    if (
      !isCropAreaSimilarUtil(
        lastCropArea,
        nextCropArea,
        CROP_AREA_SIMILARITY_THRESHOLD,
      )
    ) {
      lastCropArea = nextCropArea;
      cropArea.value = nextCropArea;
    }
  }

  function setImagePositionIfChanged(nextImagePosition: ImagePosition): void {
    if (
      !isImagePositionSimilarUtil(
        lastImagePosition,
        nextImagePosition,
        IMAGE_POSITION_SIMILARITY_THRESHOLD,
      )
    ) {
      lastImagePosition = nextImagePosition;
      imagePosition.value = nextImagePosition;
    }
  }

  // Calculation helpers
  const calculateInitialCropArea = (img: HTMLImageElement, rect: DOMRect) =>
    calculateInitialCropAreaUtil(img, rect, props.aspectRatio());

  function updateTagPosition(): void {
    if (!cropArea.value || !canvasRef.value || !elementRef.value) {
      if (lastTagPosition) {
        lastTagPosition = null;
        tagPosition.value = null;
      }

      return;
    }

    const canvasRect = canvasRef.value.getBoundingClientRect();
    const elementRect = elementRef.value.getBoundingClientRect();

    const nextPosition = {
      left:
        canvasRect.left -
        elementRect.left +
        cropArea.value.x +
        cropArea.value.width -
        TAG_INSET_PX -
        BORDER_WIDTH,
      top:
        canvasRect.top -
        elementRect.top +
        cropArea.value.y +
        cropArea.value.height -
        TAG_INSET_PX -
        BORDER_WIDTH,
    };

    const prevPosition = lastTagPosition;

    if (
      !prevPosition ||
      prevPosition.left !== nextPosition.left ||
      prevPosition.top !== nextPosition.top
    ) {
      lastTagPosition = nextPosition;
      tagPosition.value = nextPosition;
    }
  }

  // Load image
  watchPostEffect((onCleanup) => {
    const imageSrc = props.imageSrc();
    const initialCropArea = props.initialCropArea();

    // Tracked so a ratio change recomputes the crop area, as React's dep list does.
    void props.aspectRatio();

    const loadId = imageLoadId + 1;

    imageLoadId = loadId;
    initReady.value = false;

    if (!imageSrc) {
      imageLoaded.value = false;
      image = null;

      return;
    }

    imageLoaded.value = false;
    image = null;

    let objectUrl: string | null = null;
    const img = new Image();

    img.crossOrigin = 'anonymous';

    const loadImage = async (): Promise<void> => {
      try {
        if (typeof imageSrc === 'string') {
          img.src = imageSrc;
        } else {
          objectUrl = URL.createObjectURL(imageSrc);
          img.src = objectUrl;
        }

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        if (imageLoadId !== loadId) {
          return;
        }

        image = img;
        imageLoaded.value = true;
        props.onImageLoad()?.();

        // Initialize crop area if not provided
        if (!initialCropArea && canvasRef.value) {
          const canvas = canvasRef.value;
          const rect = canvas.getBoundingClientRect();
          const {
            baseDisplayHeight,
            baseDisplayWidth,
            cropArea: nextCropArea,
            imagePosition: nextImagePosition,
          } = calculateInitialCropArea(img, rect);

          baseDisplaySize = {
            height: baseDisplayHeight,
            width: baseDisplayWidth,
          };

          setCropAreaIfChanged(nextCropArea);
          imagePosition.value = nextImagePosition;
        }
      } catch (error) {
        if (imageLoadId !== loadId) {
          return;
        }

        console.error('Failed to load image:', error);
        imageLoaded.value = false;
        props.onImageError()?.(
          error instanceof Error ? error : new Error(String(error)),
        );
      }
    };

    void loadImage();

    onCleanup(() => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    });
  });

  watchPostEffect(() => {
    updateTagPosition();
  });

  // Calculate base display size
  function getBaseDisplaySize(): { height: number; width: number } | null {
    if (!canvasRef.value || !image) return null;

    const rect = canvasRef.value.getBoundingClientRect();

    return getBaseDisplaySizeUtil(rect, image);
  }

  // Draw canvas
  function drawCanvas(): void {
    const canvas = canvasRef.value;
    const img = image;
    const crop = cropArea.value;

    if (!canvas || !img || !crop) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Calculate display size with zoom
    const baseSize = getBaseDisplaySizeUtil(rect, img);

    if (!baseSize) return;

    const baseDisplayWidth = baseSize.width;
    const baseDisplayHeight = baseSize.height;

    if (!baseDisplaySize) {
      baseDisplaySize = {
        width: baseDisplayWidth,
        height: baseDisplayHeight,
      };
    }

    const displayWidth = baseDisplayWidth * scale.value;
    const displayHeight = baseDisplayHeight * scale.value;

    // Constrain image position
    const constrainedPosition = constrainImagePositionUtil(
      imagePosition.value.offsetX,
      imagePosition.value.offsetY,
      displayWidth,
      displayHeight,
      crop,
    );

    const finalOffsetX = constrainedPosition.offsetX;
    const finalOffsetY = constrainedPosition.offsetY;

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw image
    ctx.drawImage(img, finalOffsetX, finalOffsetY, displayWidth, displayHeight);

    // Draw overlay (darken outside crop area only)
    // Use clip to exclude crop area from overlay
    ctx.save();

    // Create a path that covers the entire canvas except the crop area
    // Using even-odd rule to create a hole
    const path = new Path2D();

    path.rect(0, 0, rect.width, rect.height);
    path.rect(crop.x, crop.y, crop.width, crop.height);
    ctx.clip(path, 'evenodd');

    // Get overlay color from CSS variable with fallback
    const overlayColor =
      getCSSVariableValue('--mzn-color-overlay-strong') ||
      'rgba(0, 0, 0, 0.60)';

    ctx.fillStyle = overlayColor;
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.restore();

    // Draw crop border
    ctx.strokeStyle =
      getCSSVariableValue('--mzn-color-border-brand') || '#5D74E9';
    ctx.lineWidth = BORDER_WIDTH;
    ctx.strokeRect(crop.x, crop.y, crop.width, crop.height);
  }

  function scheduleDraw(): void {
    if (rafId !== null) return;

    rafId = window.requestAnimationFrame(() => {
      rafId = null;
      drawCanvas();
    });
  }

  onBeforeUnmount(() => {
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  });

  /**
   * React re-subscribes whenever its dep list changes; the callback here reads
   * the reactive state at call time, so it only has to be re-created when the
   * observed elements themselves change.
   */
  watch(
    [elementRef, canvasRef],
    ([element, canvas], _previous, onCleanup) => {
      if (!element || !canvas) return;

      const resizeObserver = new ResizeObserver(() => {
        if (resizeRafId !== null) return;

        resizeRafId = window.requestAnimationFrame(() => {
          resizeRafId = null;

          if (!imageLoaded.value) return;

          const rect = canvasRef.value?.getBoundingClientRect();

          if (!rect || !rect.height) return;

          const isSizeChanged =
            !lastMeasuredSize || rect.height !== lastMeasuredSize.height;

          let shouldSkipDraw = false;

          if (isSizeChanged) {
            lastMeasuredSize = { height: rect.height, width: rect.width };
            lastCanvasSize = { height: rect.height, width: rect.width };
            initReady.value = false;

            const baseSize = getBaseDisplaySize();

            if (baseSize) {
              baseDisplaySize = baseSize;
            }

            if (!props.initialCropArea() && canvasRef.value && image) {
              shouldSkipDraw = true;
              skipDraw = true;

              const {
                cropArea: nextCropArea,
                imagePosition: nextImagePosition,
              } = calculateInitialCropArea(image, rect);

              setCropAreaIfChanged(nextCropArea);
              imagePosition.value = nextImagePosition;
            }
          }

          if (!shouldSkipDraw) {
            scheduleDraw();
          }
        });
      });

      resizeObserver.observe(element);
      resizeObserver.observe(canvas);
      window.addEventListener('resize', updateTagPosition);

      onCleanup(() => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', updateTagPosition);

        if (resizeRafId !== null) {
          window.cancelAnimationFrame(resizeRafId);
          resizeRafId = null;
        }
      });
    },
    { flush: 'post', immediate: true },
  );

  watch(
    imageLoaded,
    () => {
      if (imageLoaded.value) {
        const baseSize = getBaseDisplaySize();

        if (baseSize) {
          baseDisplaySize = baseSize;
        }
      }
    },
    { flush: 'post' },
  );

  watch(
    [cropArea, imageLoaded, imagePosition, scale],
    () => {
      if (!cropArea.value || !imageLoaded.value || !canvasRef.value || !image)
        return;

      const rect = canvasRef.value.getBoundingClientRect();
      const baseSize = getBaseDisplaySizeUtil(rect, image);

      if (!baseSize) return;

      const displayWidth = baseSize.width * scale.value;
      const displayHeight = baseSize.height * scale.value;
      const constrainedPosition = constrainImagePositionUtil(
        imagePosition.value.offsetX,
        imagePosition.value.offsetY,
        displayWidth,
        displayHeight,
        cropArea.value,
      );

      if (
        constrainedPosition.offsetX !== imagePosition.value.offsetX ||
        constrainedPosition.offsetY !== imagePosition.value.offsetY
      ) {
        skipDraw = true;
        setImagePositionIfChanged(constrainedPosition);
      } else {
        skipDraw = false;
      }
    },
    { flush: 'post' },
  );

  watch(
    cropArea,
    () => {
      if (cropArea.value) {
        lastCropArea = cropArea.value;
      }
    },
    { flush: 'post' },
  );

  watch(
    imagePosition,
    () => {
      lastImagePosition = imagePosition.value;
    },
    { flush: 'post' },
  );

  watch(
    [cropArea, imageLoaded],
    () => {
      if (!imageLoaded.value || !cropArea.value) return;
      if (!lastCanvasSize) return;

      initReady.value = true;
    },
    { flush: 'post' },
  );

  watch(
    [
      cropArea,
      imageLoaded,
      initReady,
      imagePosition,
      scale,
      isDraggingImage,
      isDragging,
    ],
    () => {
      if (!imageLoaded.value || !initReady.value) return;

      if (skipDraw) {
        skipDraw = false;

        return;
      }

      const lastTrigger = lastDrawTrigger;
      const hasChanged =
        !lastTrigger ||
        !cropArea.value ||
        !isCropAreaSimilarUtil(
          lastTrigger.cropArea,
          cropArea.value,
          CROP_AREA_SIMILARITY_THRESHOLD,
        ) ||
        !isImagePositionSimilarUtil(
          lastTrigger.imagePosition,
          imagePosition.value,
          IMAGE_POSITION_SIMILARITY_THRESHOLD,
        ) ||
        lastTrigger.scale !== scale.value;

      if (!hasChanged) {
        return;
      }

      lastDrawTrigger = {
        cropArea: cropArea.value,
        imagePosition: imagePosition.value,
        scale: scale.value,
      };

      // Skip tag position update during drag for better performance
      if (!isDraggingImage.value && !isDragging.value) {
        updateTagPosition();
      }

      scheduleDraw();
    },
    { flush: 'post' },
  );

  function emitCropChange(nextCropArea: CropArea): void {
    const onCropChange = props.onCropChange();

    if (!onCropChange) return;

    if (!canvasRef.value || !image) {
      onCropChange(nextCropArea);
      tagCropArea.value = nextCropArea;

      return;
    }

    const rect = canvasRef.value.getBoundingClientRect();
    const img = image;
    const baseScale = getBaseScaleUtil(rect, img);
    const imageScale = baseScale / scale.value;
    const rawWidth = nextCropArea.width * imageScale;
    const rawHeight = nextCropArea.height * imageScale;
    const rawX = (nextCropArea.x - imagePosition.value.offsetX) * imageScale;
    const rawY = (nextCropArea.y - imagePosition.value.offsetY) * imageScale;
    const clampedWidth = Math.min(img.width, Math.max(0, rawWidth));
    const clampedHeight = Math.min(img.height, Math.max(0, rawHeight));
    const clampedX = Math.min(img.width - clampedWidth, Math.max(0, rawX));
    const clampedY = Math.min(img.height - clampedHeight, Math.max(0, rawY));

    const emittedCropArea = {
      height: clampedHeight,
      width: clampedWidth,
      x: clampedX,
      y: clampedY,
    };

    onCropChange(emittedCropArea);
    tagCropArea.value = emittedCropArea;
  }

  // Update crop area based on drag
  function updateCropArea(
    handle: CropHandle,
    deltaX: number,
    deltaY: number,
  ): void {
    if (!cropArea.value) return;

    const current = cropArea.value;
    const aspectRatio = props.aspectRatio();
    const minWidth = props.minWidth();
    const minHeight = props.minHeight();
    let x = current.x;
    let y = current.y;
    let width = current.width;
    let height = current.height;

    switch (handle.type) {
      case 'move':
        x = Math.max(0, current.x + deltaX);
        y = Math.max(0, current.y + deltaY);

        if (canvasRef.value) {
          const rect = canvasRef.value.getBoundingClientRect();

          x = Math.min(x, rect.width - width);
          y = Math.min(y, rect.height - height);
        }

        break;

      case 'nw':
        width = current.width - deltaX;
        height = current.height - deltaY;
        x = current.x + deltaX;
        y = current.y + deltaY;
        break;

      case 'ne':
        width = current.width + deltaX;
        height = current.height - deltaY;
        y = current.y + deltaY;
        break;

      case 'sw':
        width = current.width - deltaX;
        height = current.height + deltaY;
        x = current.x + deltaX;
        break;

      case 'se':
        width = current.width + deltaX;
        height = current.height + deltaY;
        break;

      case 'n':
        height = current.height - deltaY;
        y = current.y + deltaY;
        break;

      case 's':
        height = current.height + deltaY;
        break;

      case 'w':
        width = current.width - deltaX;
        x = current.x + deltaX;
        break;

      case 'e':
        width = current.width + deltaX;
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

    // Apply aspect ratio if provided
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

    // Apply constraints - allow crop area to extend to image bounds
    if (canvasRef.value && image) {
      const rect = canvasRef.value.getBoundingClientRect();
      const baseSize = getBaseDisplaySizeUtil(rect, image);

      if (!baseSize) {
        const newCrop: CropArea = { x, y, width, height };

        cropArea.value = newCrop;

        if (props.onCropChange()) {
          emitCropChange(newCrop);
        }

        return;
      }

      const baseDisplayWidth = baseSize.width;
      const baseDisplayHeight = baseSize.height;
      const displayWidth = baseDisplayWidth * scale.value;
      const displayHeight = baseDisplayHeight * scale.value;
      const imageOffsetX = imagePosition.value.offsetX;
      const imageOffsetY = imagePosition.value.offsetY;

      // Image display bounds
      const imageLeft = imageOffsetX;
      const imageRight = imageOffsetX + displayWidth;
      const imageTop = imageOffsetY;
      const imageBottom = imageOffsetY + displayHeight;

      if (aspectRatio) {
        // For aspect ratio, calculate maximum size within image bounds
        // First, calculate max dimensions based on image bounds
        const maxWidthFromImage = Math.min(
          imageRight - Math.max(x, imageLeft),
          Math.max(x + width, imageRight) - imageLeft,
        );
        const maxHeightFromImage = Math.min(
          imageBottom - Math.max(y, imageTop),
          Math.max(y + height, imageBottom) - imageTop,
        );

        // Calculate which dimension limits the size
        const maxWidthByAspect = maxHeightFromImage * aspectRatio;
        const maxHeightByAspect = maxWidthFromImage / aspectRatio;

        if (maxWidthByAspect <= maxWidthFromImage) {
          // Height is the limiting factor
          width = Math.max(minWidth, Math.min(width, maxWidthByAspect));
          height = width / aspectRatio;
        } else {
          // Width is the limiting factor
          height = Math.max(minHeight, Math.min(height, maxHeightByAspect));
          width = height * aspectRatio;
        }

        // Ensure crop area stays within image bounds
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

        // Also ensure crop area doesn't go outside canvas bounds
        x = Math.max(0, Math.min(x, rect.width - width));
        y = Math.max(0, Math.min(y, rect.height - height));
      } else {
        // No aspect ratio - constrain to both image and canvas bounds
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

        // Ensure crop area is within image bounds
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

        // Also ensure crop area doesn't go outside canvas bounds
        x = Math.max(0, Math.min(x, rect.width - width));
        y = Math.max(0, Math.min(y, rect.height - height));
      }
    } else if (canvasRef.value) {
      // Fallback if image not loaded
      const rect = canvasRef.value.getBoundingClientRect();

      width = Math.max(minWidth, Math.min(width, rect.width - x));
      height = Math.max(minHeight, Math.min(height, rect.height - y));
      x = Math.max(0, Math.min(x, rect.width - width));
      y = Math.max(0, Math.min(y, rect.height - height));
    }

    const newCrop: CropArea = { x, y, width, height };

    cropArea.value = newCrop;

    if (props.onCropChange()) {
      emitCropChange(newCrop);
    }
  }

  watch(
    [cropArea, imagePosition, scale, imageLoaded, isDraggingImage, isDragging],
    () => {
      if (!cropArea.value || !imageLoaded.value) return;
      // Skip emitting during drag to avoid performance issues
      if (isDraggingImage.value || isDragging.value) return;

      emitCropChange(cropArea.value);
    },
    { flush: 'post' },
  );

  // Check if point is on image
  function isPointOnImage(x: number, y: number): boolean {
    if (!cropArea.value || !canvasRef.value || !image) return false;

    const rect = canvasRef.value.getBoundingClientRect();
    const baseSize = getBaseDisplaySizeUtil(rect, image);

    if (!baseSize) return false;

    const displayWidth = baseSize.width * scale.value;
    const displayHeight = baseSize.height * scale.value;

    return (
      x >= imagePosition.value.offsetX &&
      x <= imagePosition.value.offsetX + displayWidth &&
      y >= imagePosition.value.offsetY &&
      y <= imagePosition.value.offsetY + displayHeight
    );
  }

  // Mouse down handler
  function handleMouseDown(event: MouseEvent): void {
    if (!cropArea.value || !canvasRef.value) return;

    const rect = canvasRef.value.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if clicking on image (for dragging image)
    if (isPointOnImage(x, y)) {
      isDraggingImage.value = true;
      imageDragStart.value = {
        offsetX: imagePosition.value.offsetX,
        offsetY: imagePosition.value.offsetY,
        x: event.clientX,
        y: event.clientY,
      };
    }

    // Crop area is fixed; no resize or move handlers.
  }

  // Mouse move handler for crop area
  function handleMouseMove(event: MouseEvent): void {
    if (
      !isDragging.value ||
      !dragHandle.value ||
      !dragStart.value ||
      !cropArea.value
    )
      return;

    const deltaX = event.clientX - dragStart.value.x;
    const deltaY = event.clientY - dragStart.value.y;

    updateCropArea(dragHandle.value, deltaX, deltaY);
    dragStart.value = { x: event.clientX, y: event.clientY };
  }

  // Mouse move handler for image dragging
  function handleImageMouseMove(event: MouseEvent): void {
    const start = imageDragStart.value;

    if (
      !isDraggingImage.value ||
      !start ||
      !canvasRef.value ||
      !image ||
      !cropArea.value
    )
      return;

    // Cancel previous RAF if exists
    if (dragRafId !== null) {
      window.cancelAnimationFrame(dragRafId);
    }

    dragRafId = window.requestAnimationFrame(() => {
      dragRafId = null;

      const rect = canvasRef.value?.getBoundingClientRect();
      const img = image;
      const crop = cropArea.value;

      if (!rect || !img || !crop) return;

      const deltaX = event.clientX - start.x;
      const deltaY = event.clientY - start.y;

      const newOffsetX = start.offsetX + deltaX;
      const newOffsetY = start.offsetY + deltaY;

      // Calculate display size
      const baseSize = getBaseDisplaySizeUtil(rect, img);

      if (!baseSize) return;

      const displayWidth = baseSize.width * scale.value;
      const displayHeight = baseSize.height * scale.value;

      // Constrain position
      const constrained = constrainImagePositionUtil(
        newOffsetX,
        newOffsetY,
        displayWidth,
        displayHeight,
        crop,
      );

      // Check if position actually changed (avoid updates when at boundary)
      // Use the last written position to avoid a stale closure.
      const currentPosition = lastImagePosition || imagePosition.value;

      if (
        !isImagePositionSimilarUtil(
          currentPosition,
          constrained,
          IMAGE_POSITION_SIMILARITY_THRESHOLD,
        )
      ) {
        imagePosition.value = constrained;
        scheduleDraw();
      }
    });
  }

  // Mouse up handler
  function handleMouseUp(): void {
    // Cancel any pending drag RAF
    if (dragRafId !== null) {
      window.cancelAnimationFrame(dragRafId);
      dragRafId = null;
    }

    const wasDraggingCrop = isDragging.value;
    const wasDraggingImage = isDraggingImage.value;

    isDragging.value = false;
    dragHandle.value = null;
    dragStart.value = null;
    isDraggingImage.value = false;
    imageDragStart.value = null;

    // Update tag position and emit crop change after drag ends
    if (wasDraggingCrop || wasDraggingImage) {
      updateTagPosition();

      if (cropArea.value && imageLoaded.value) {
        emitCropChange(cropArea.value);
      }
    }

    // Call drag end callbacks
    if (wasDraggingCrop && cropArea.value) {
      props.onCropDragEnd()?.(cropArea.value);
    }

    if (wasDraggingImage) {
      props.onImageDragEnd()?.();
    }
  }

  // Document events for dragging
  useDocumentEvents(() => {
    if (isDragging.value) {
      return {
        mousemove: handleMouseMove,
        mouseup: handleMouseUp,
      };
    }

    if (isDraggingImage.value) {
      return {
        mousemove: handleImageMouseMove,
        mouseup: handleMouseUp,
      };
    }

    return undefined;
  });

  // Handle scale change with center point preservation
  function handleScaleChange(newScale: number): void {
    const crop = cropArea.value;

    if (!canvasRef.value || !image || !crop) {
      scale.value = newScale;
      props.onScaleChange()?.(newScale);

      return;
    }

    const rect = canvasRef.value.getBoundingClientRect();
    const baseSize = getBaseDisplaySizeUtil(rect, image);

    if (!baseSize) {
      scale.value = newScale;
      props.onScaleChange()?.(newScale);

      return;
    }

    // Calculate center point of crop area in canvas coordinates
    const centerX = crop.x + crop.width / 2;
    const centerY = crop.y + crop.height / 2;

    // Calculate current image position relative to center
    const currentDisplayWidth = baseSize.width * scale.value;
    const currentDisplayHeight = baseSize.height * scale.value;
    const currentCenterOffsetX =
      centerX - (imagePosition.value.offsetX + currentDisplayWidth / 2);
    const currentCenterOffsetY =
      centerY - (imagePosition.value.offsetY + currentDisplayHeight / 2);

    // Calculate new display size
    const newDisplayWidth = baseSize.width * newScale;
    const newDisplayHeight = baseSize.height * newScale;

    // Calculate new position to keep center point
    const newOffsetX = centerX - newDisplayWidth / 2 - currentCenterOffsetX;
    const newOffsetY = centerY - newDisplayHeight / 2 - currentCenterOffsetY;

    // Constrain new position
    const constrained = constrainImagePositionUtil(
      newOffsetX,
      newOffsetY,
      newDisplayWidth,
      newDisplayHeight,
      crop,
    );

    scale.value = newScale;
    imagePosition.value = constrained;
    props.onScaleChange()?.(newScale);
  }

  // Handle slider change
  function handleSliderChange(value: number): void {
    handleScaleChange(value);
  }

  // Handle wheel (trackpad) zoom
  function handleWheel(event: WheelEvent): void {
    if (!cropArea.value) return;

    event.preventDefault();

    const delta = event.deltaY > 0 ? -0.05 : 0.05;
    const newScale = Math.max(
      MIN_SCALE,
      Math.min(MAX_SCALE, scale.value + delta),
    );

    handleScaleChange(newScale);
  }

  // Add wheel event listener with passive: false to allow preventDefault
  watch(
    canvasRef,
    (canvas, _previous, onCleanup) => {
      if (!canvas) return;

      canvas.addEventListener('wheel', handleWheel, { passive: false });

      onCleanup(() => {
        canvas.removeEventListener('wheel', handleWheel);
      });
    },
    { flush: 'post', immediate: true },
  );

  // Update cursor style
  const cursorStyle = computed((): string => {
    if (!cropArea.value) return 'default';
    if (isDragging.value || isDraggingImage.value) return 'grabbing';

    return 'default';
  });

  return {
    canvasRef,
    cropArea,
    cursorStyle,
    elementRef,
    handleMouseDown,
    handleSliderChange,
    scale,
    setCanvas,
    setElement,
    tagCropArea,
    tagPosition,
  };
}
