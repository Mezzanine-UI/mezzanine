'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { cropperClasses as classes } from '@mezzanine-ui/core/cropper';
import { MinusIcon, PlusIcon } from '@mezzanine-ui/icons';

import { useDocumentEvents } from '../hooks/useDocumentEvents';
import Slider from '../Slider';
import Typography from '../Typography';
import { cx } from '../utils/cx';
import { getCSSVariableValue } from '../utils/get-css-variable-value';
import { ComponentOverridableForwardRefComponentPropsFactory } from '../utils/jsx-types';
import {
  CropArea,
  CropperElementComponent,
  CropperPropsBase,
} from './typings';
import {
  calculateInitialCropArea as calculateInitialCropAreaUtil,
  constrainImagePosition as constrainImagePositionUtil,
  getBaseDisplaySize as getBaseDisplaySizeUtil,
  getBaseScale as getBaseScaleUtil,
  isCropAreaSimilar as isCropAreaSimilarUtil,
  isImagePositionSimilar as isImagePositionSimilarUtil,
  type ImagePosition,
} from './utils/cropper-calculations';

export type CropperElementProps<C extends CropperElementComponent = 'canvas'> =
  ComponentOverridableForwardRefComponentPropsFactory<
    CropperElementComponent,
    C,
    CropperPropsBase
  >;

interface CropHandle {
  x: number;
  y: number;
  type: 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w' | 'move';
}

// Constants
const DEFAULT_MIN_WIDTH = 50;
const DEFAULT_MIN_HEIGHT = 50;
const MIN_SCALE = 1;
const MAX_SCALE = 2;
const SCALE_STEP = 0.01;
const BORDER_WIDTH = 2;
const TAG_INSET_PX = 10;
const CROP_AREA_SIMILARITY_THRESHOLD = 0.5;
const IMAGE_POSITION_SIMILARITY_THRESHOLD = 0.1;

/**
 * The react component for `mezzanine` cropper element (canvas).
 */
const CropperElement = forwardRef<HTMLCanvasElement, CropperElementProps>(
  function CropperElement(props, ref) {
    const {
      children,
      className,
      component: Component = 'canvas',
      size = 'main',
      imageSrc,
      onCropChange,
      initialCropArea,
      aspectRatio,
      minWidth = DEFAULT_MIN_WIDTH,
      minHeight = DEFAULT_MIN_HEIGHT,
      ...rest
    } = props;

    // Refs
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const elementRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const imageLoadIdRef = useRef(0);

    // State - Core
    const [cropArea, setCropArea] = useState<CropArea | null>(
      initialCropArea || null,
    );
    const [imageLoaded, setImageLoaded] = useState(false);
    const [initReady, setInitReady] = useState(false);
    const [scale, setScale] = useState(1);
    const [imagePosition, setImagePosition] = useState<ImagePosition>({
      offsetX: 0,
      offsetY: 0,
    });

    // State - UI
    const [tagPosition, setTagPosition] = useState<{
      left: number;
      top: number;
    } | null>(null);
    const [tagCropArea, setTagCropArea] = useState<CropArea | null>(null);

    // State - Interactions
    const [isDragging, setIsDragging] = useState(false);
    const [isDraggingImage, setIsDraggingImage] = useState(false);
    const [dragHandle, setDragHandle] = useState<CropHandle | null>(null);
    const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
      null,
    );
    const [imageDragStart, setImageDragStart] = useState<{
      x: number;
      y: number;
      offsetX: number;
      offsetY: number;
    } | null>(null);

    // Refs - Cache for optimization
    const baseDisplaySizeRef = useRef<{ width: number; height: number } | null>(
      null,
    );
    const lastCanvasSizeRef = useRef<{ height: number; width: number } | null>(
      null,
    );
    const lastMeasuredSizeRef = useRef<{ height: number; width: number } | null>(
      null,
    );
    const lastTagPositionRef = useRef<{ left: number; top: number } | null>(
      null,
    );
    const lastCropAreaRef = useRef<CropArea | null>(null);
    const lastImagePositionRef = useRef<ImagePosition | null>(null);
    const lastDrawTriggerRef = useRef<{
      cropArea: CropArea | null;
      imagePosition: ImagePosition;
      scale: number;
    } | null>(null);

    // Refs - Animation & Control
    const rafIdRef = useRef<number | null>(null);
    const skipDrawRef = useRef(false);
    const resizeRafIdRef = useRef<number | null>(null);
    const dragRafIdRef = useRef<number | null>(null);

    const composedRef = useCallback(
      (node: HTMLCanvasElement | null) => {
        canvasRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    // State management with debouncing
    const setCropAreaIfChanged = useCallback(
      (nextCropArea: CropArea | null) => {
        if (
          !isCropAreaSimilarUtil(
            lastCropAreaRef.current,
            nextCropArea,
            CROP_AREA_SIMILARITY_THRESHOLD,
          )
        ) {
          lastCropAreaRef.current = nextCropArea;
          setCropArea(nextCropArea);
        }
      },
      [],
    );

    const setImagePositionIfChanged = useCallback(
      (nextImagePosition: ImagePosition) => {
        if (
          !isImagePositionSimilarUtil(
            lastImagePositionRef.current,
            nextImagePosition,
            IMAGE_POSITION_SIMILARITY_THRESHOLD,
          )
        ) {
          lastImagePositionRef.current = nextImagePosition;
          setImagePosition(nextImagePosition);
        }
      },
      [],
    );

    // Calculation helpers
    const calculateInitialCropArea = useCallback(
      (img: HTMLImageElement, rect: DOMRect) => {
        return calculateInitialCropAreaUtil(img, rect, aspectRatio);
      },
      [aspectRatio],
    );

    const updateTagPosition = useCallback(() => {
      if (!cropArea || !canvasRef.current || !elementRef.current) {
        if (lastTagPositionRef.current) {
          lastTagPositionRef.current = null;
          setTagPosition(null);
        }
        return;
      }
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const elementRect = elementRef.current.getBoundingClientRect();

      const nextPosition = {
        left:
          canvasRect.left -
          elementRect.left +
          cropArea.x +
          cropArea.width -
          TAG_INSET_PX -
          BORDER_WIDTH,
        top:
          canvasRect.top -
          elementRect.top +
          cropArea.y +
          cropArea.height -
          TAG_INSET_PX -
          BORDER_WIDTH,
      };

      const prevPosition = lastTagPositionRef.current;
      if (
        !prevPosition ||
        prevPosition.left !== nextPosition.left ||
        prevPosition.top !== nextPosition.top
      ) {
        lastTagPositionRef.current = nextPosition;
        setTagPosition(nextPosition);
      }
    }, [cropArea]);

    // Load image
    useEffect(() => {
      const loadId = imageLoadIdRef.current + 1;
      imageLoadIdRef.current = loadId;
      setInitReady(false);

      if (!imageSrc) {
        setImageLoaded(false);
        imageRef.current = null;
        return undefined;
      }

      setImageLoaded(false);
      imageRef.current = null;

      let objectUrl: string | null = null;
      const img = new Image();
      img.crossOrigin = 'anonymous';

      const loadImage = async () => {
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

          if (imageLoadIdRef.current !== loadId) {
            return;
          }

          imageRef.current = img;
          setImageLoaded(true);

          // Initialize crop area if not provided
          if (!initialCropArea && canvasRef.current) {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const {
              baseDisplayHeight,
              baseDisplayWidth,
              cropArea: nextCropArea,
              imagePosition: nextImagePosition,
            } = calculateInitialCropArea(img, rect);

            baseDisplaySizeRef.current = {
              height: baseDisplayHeight,
              width: baseDisplayWidth,
            };

            setCropAreaIfChanged(nextCropArea);
            setImagePosition(nextImagePosition);
          }
        } catch (error) {
          if (imageLoadIdRef.current !== loadId) {
            return;
          }
          console.error('Failed to load image:', error);
          setImageLoaded(false);
        }
      };

      loadImage();

      return () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      };
    }, [imageSrc, initialCropArea, aspectRatio, calculateInitialCropArea, setCropAreaIfChanged]);

    useLayoutEffect(() => {
      updateTagPosition();
    }, [updateTagPosition]);

    // Calculate base display size
    const getBaseDisplaySize = useCallback(() => {
      if (!canvasRef.current || !imageRef.current) return null;

      const rect = canvasRef.current.getBoundingClientRect();
      return getBaseDisplaySizeUtil(rect, imageRef.current);
    }, []);


    // Draw canvas
    const drawCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      const img = imageRef.current;
      const crop = cropArea;

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

      if (!baseDisplaySizeRef.current) {
        baseDisplaySizeRef.current = {
          width: baseDisplayWidth,
          height: baseDisplayHeight,
        };
      }

      const displayWidth = baseDisplayWidth * scale;
      const displayHeight = baseDisplayHeight * scale;

      // Constrain image position
      const constrainedPosition = constrainImagePositionUtil(
        imagePosition.offsetX,
        imagePosition.offsetY,
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

    }, [cropArea, scale, imagePosition]);

    const scheduleDraw = useCallback(() => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = window.requestAnimationFrame(() => {
        rafIdRef.current = null;
        drawCanvas();
      });
    }, [drawCanvas]);

    useEffect(() => {
      return () => {
        if (rafIdRef.current !== null) {
          window.cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      };
    }, []);

    useEffect(() => {
      if (!elementRef.current || !canvasRef.current) return undefined;

      const resizeObserver = new ResizeObserver(() => {
        if (resizeRafIdRef.current !== null) return;
        resizeRafIdRef.current = window.requestAnimationFrame(() => {
          resizeRafIdRef.current = null;
          if (imageLoaded) {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect || !rect.height) return;
            const isSizeChanged =
              !lastMeasuredSizeRef.current ||
              rect.height !== lastMeasuredSizeRef.current.height;

            let shouldSkipDraw = false;
            if (isSizeChanged) {
              lastMeasuredSizeRef.current = {
                height: rect.height,
                width: rect.width,
              };
              lastCanvasSizeRef.current = {
                height: rect.height,
                width: rect.width,
              };
              setInitReady(false);
              const baseSize = getBaseDisplaySize();
              if (baseSize) {
                baseDisplaySizeRef.current = baseSize;
              }
              if (!initialCropArea && canvasRef.current && imageRef.current) {
                shouldSkipDraw = true;
                skipDrawRef.current = true;
                const {
                  cropArea: nextCropArea,
                  imagePosition: nextImagePosition,
                } = calculateInitialCropArea(imageRef.current, rect);
                setCropAreaIfChanged(nextCropArea);
                setImagePosition(nextImagePosition);
              }
            }
            if (!shouldSkipDraw) {
              scheduleDraw();
            }
          }
        });
      });

      resizeObserver.observe(elementRef.current);
      resizeObserver.observe(canvasRef.current);
      window.addEventListener('resize', updateTagPosition);

      return () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', updateTagPosition);
        if (resizeRafIdRef.current !== null) {
          window.cancelAnimationFrame(resizeRafIdRef.current);
          resizeRafIdRef.current = null;
        }
      };
    }, [
      calculateInitialCropArea,
      getBaseDisplaySize,
      imageLoaded,
      initialCropArea,
      scheduleDraw,
      updateTagPosition,
      setCropAreaIfChanged,
    ]);

    useEffect(() => {
      if (imageLoaded) {
        const baseSize = getBaseDisplaySize();
        if (baseSize) {
          baseDisplaySizeRef.current = baseSize;
        }
      }
    }, [imageLoaded, getBaseDisplaySize]);

    useEffect(() => {
      if (!cropArea || !imageLoaded || !canvasRef.current || !imageRef.current)
        return;

      const rect = canvasRef.current.getBoundingClientRect();
      const baseSize = getBaseDisplaySizeUtil(rect, imageRef.current);
      if (!baseSize) return;

      const displayWidth = baseSize.width * scale;
      const displayHeight = baseSize.height * scale;
      const constrainedPosition = constrainImagePositionUtil(
        imagePosition.offsetX,
        imagePosition.offsetY,
        displayWidth,
        displayHeight,
        cropArea,
      );

      if (
        constrainedPosition.offsetX !== imagePosition.offsetX ||
        constrainedPosition.offsetY !== imagePosition.offsetY
      ) {
        skipDrawRef.current = true;
        setImagePositionIfChanged(constrainedPosition);
      } else {
        skipDrawRef.current = false;
      }
    }, [
      cropArea,
      imageLoaded,
      imagePosition,
      scale,
      setImagePositionIfChanged,
    ]);

    useEffect(() => {
      if (cropArea) {
        lastCropAreaRef.current = cropArea;
      }
    }, [cropArea]);

    useEffect(() => {
      lastImagePositionRef.current = imagePosition;
    }, [imagePosition]);

    useEffect(() => {
      if (!imageLoaded || !cropArea) return;
      if (!lastCanvasSizeRef.current) return;
      setInitReady(true);
    }, [cropArea, imageLoaded]);

    useEffect(() => {
      if (!imageLoaded || !initReady) return;
      if (skipDrawRef.current) {
        skipDrawRef.current = false;
        return;
      }

      const lastTrigger = lastDrawTriggerRef.current;
      const hasChanged =
        !lastTrigger ||
        !cropArea ||
        !isCropAreaSimilarUtil(
          lastTrigger.cropArea,
          cropArea,
          CROP_AREA_SIMILARITY_THRESHOLD,
        ) ||
        !isImagePositionSimilarUtil(
          lastTrigger.imagePosition,
          imagePosition,
          IMAGE_POSITION_SIMILARITY_THRESHOLD,
        ) ||
        lastTrigger.scale !== scale;

      if (!hasChanged) {
        return;
      }

      lastDrawTriggerRef.current = {
        cropArea,
        imagePosition,
        scale,
      };

      // Skip tag position update during drag for better performance
      if (!isDraggingImage && !isDragging) {
        updateTagPosition();
      }
      scheduleDraw();
    }, [
      cropArea,
      imageLoaded,
      initReady,
      imagePosition,
      scale,
      updateTagPosition,
      scheduleDraw,
      isDraggingImage,
      isDragging,
    ]);

    const emitCropChange = useCallback(
      (nextCropArea: CropArea) => {
        if (!onCropChange) return;

        if (!canvasRef.current || !imageRef.current) {
          onCropChange(nextCropArea);
          setTagCropArea(nextCropArea);
          return;
        }

        const rect = canvasRef.current.getBoundingClientRect();
        const img = imageRef.current;
        const baseScale = getBaseScaleUtil(rect, img);
        const imageScale = baseScale / scale;
        const rawWidth = nextCropArea.width * imageScale;
        const rawHeight = nextCropArea.height * imageScale;
        const rawX = (nextCropArea.x - imagePosition.offsetX) * imageScale;
        const rawY = (nextCropArea.y - imagePosition.offsetY) * imageScale;
        const clampedWidth = Math.min(img.width, Math.max(0, rawWidth));
        const clampedHeight = Math.min(img.height, Math.max(0, rawHeight));
        const clampedX = Math.min(
          img.width - clampedWidth,
          Math.max(0, rawX),
        );
        const clampedY = Math.min(
          img.height - clampedHeight,
          Math.max(0, rawY),
        );

        const emittedCropArea = {
          height: clampedHeight,
          width: clampedWidth,
          x: clampedX,
          y: clampedY,
        };

        onCropChange(emittedCropArea);
        setTagCropArea(emittedCropArea);
      },
      [imagePosition.offsetX, imagePosition.offsetY, onCropChange, scale],
    );

    // Update crop area based on drag
    const updateCropArea = useCallback(
      (handle: CropHandle, deltaX: number, deltaY: number) => {
        if (!cropArea) return;

        let x = cropArea.x;
        let y = cropArea.y;
        let width = cropArea.width;
        let height = cropArea.height;

        switch (handle.type) {
          case 'move':
            x = Math.max(0, cropArea.x + deltaX);
            y = Math.max(0, cropArea.y + deltaY);
            if (canvasRef.current) {
              const rect = canvasRef.current.getBoundingClientRect();
              x = Math.min(x, rect.width - width);
              y = Math.min(y, rect.height - height);
            }
            break;

          case 'nw':
            width = cropArea.width - deltaX;
            height = cropArea.height - deltaY;
            x = cropArea.x + deltaX;
            y = cropArea.y + deltaY;
            break;

          case 'ne':
            width = cropArea.width + deltaX;
            height = cropArea.height - deltaY;
            y = cropArea.y + deltaY;
            break;

          case 'sw':
            width = cropArea.width - deltaX;
            height = cropArea.height + deltaY;
            x = cropArea.x + deltaX;
            break;

          case 'se':
            width = cropArea.width + deltaX;
            height = cropArea.height + deltaY;
            break;

          case 'n':
            height = cropArea.height - deltaY;
            y = cropArea.y + deltaY;
            break;

          case 's':
            height = cropArea.height + deltaY;
            break;

          case 'w':
            width = cropArea.width - deltaX;
            x = cropArea.x + deltaX;
            break;

          case 'e':
            width = cropArea.width + deltaX;
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
        if (canvasRef.current && imageRef.current) {
          const rect = canvasRef.current.getBoundingClientRect();
          const baseSize = getBaseDisplaySizeUtil(rect, imageRef.current);
          if (!baseSize) {
            const newCrop: CropArea = { x, y, width, height };
            setCropArea(newCrop);
            if (onCropChange) {
              emitCropChange(newCrop);
            }
            return;
          }

          const baseDisplayWidth = baseSize.width;
          const baseDisplayHeight = baseSize.height;
          const displayWidth = baseDisplayWidth * scale;
          const displayHeight = baseDisplayHeight * scale;
          const imageOffsetX = imagePosition.offsetX;
          const imageOffsetY = imagePosition.offsetY;

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
        } else if (canvasRef.current) {
          // Fallback if image not loaded
          const rect = canvasRef.current.getBoundingClientRect();
          width = Math.max(minWidth, Math.min(width, rect.width - x));
          height = Math.max(minHeight, Math.min(height, rect.height - y));
          x = Math.max(0, Math.min(x, rect.width - width));
          y = Math.max(0, Math.min(y, rect.height - height));
        }

        const newCrop: CropArea = { x, y, width, height };
        setCropArea(newCrop);

        if (onCropChange) {
          emitCropChange(newCrop);
        }
      },
      [
        cropArea,
        aspectRatio,
        minWidth,
        minHeight,
        imagePosition.offsetX,
        imagePosition.offsetY,
        scale,
        emitCropChange,
        onCropChange,
      ],
    );

    useEffect(() => {
      if (!cropArea || !imageLoaded) return;
      // Skip emitting during drag to avoid performance issues
      if (isDraggingImage || isDragging) return;
      emitCropChange(cropArea);
    }, [cropArea, emitCropChange, imageLoaded, isDraggingImage, isDragging]);

    // Check if point is on image
    const isPointOnImage = useCallback(
      (x: number, y: number): boolean => {
        if (!cropArea || !canvasRef.current || !imageRef.current) return false;

        const rect = canvasRef.current.getBoundingClientRect();
        const baseSize = getBaseDisplaySizeUtil(rect, imageRef.current);
        if (!baseSize) return false;

        const displayWidth = baseSize.width * scale;
        const displayHeight = baseSize.height * scale;

        return (
          x >= imagePosition.offsetX &&
          x <= imagePosition.offsetX + displayWidth &&
          y >= imagePosition.offsetY &&
          y <= imagePosition.offsetY + displayHeight
        );
      },
      [cropArea, scale, imagePosition],
    );

    // Mouse down handler
    const handleMouseDown = useCallback(
      (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!cropArea || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if clicking on image (for dragging image)
        if (isPointOnImage(x, y)) {
          setIsDraggingImage(true);
          setImageDragStart({
            x: e.clientX,
            y: e.clientY,
            offsetX: imagePosition.offsetX,
            offsetY: imagePosition.offsetY,
          });
          return;
        }

        // Crop area is fixed; no resize or move handlers.
      },
      [cropArea, isPointOnImage, imagePosition],
    );

    // Mouse move handler for crop area
    const handleMouseMove = useCallback(
      (e: MouseEvent) => {
        if (!isDragging || !dragHandle || !dragStart || !cropArea) return;

        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        updateCropArea(dragHandle, deltaX, deltaY);
        setDragStart({ x: e.clientX, y: e.clientY });
      },
      [isDragging, dragHandle, dragStart, cropArea, updateCropArea],
    );

    // Mouse move handler for image dragging
    const handleImageMouseMove = useCallback(
      (e: MouseEvent) => {
        if (
          !isDraggingImage ||
          !imageDragStart ||
          !canvasRef.current ||
          !imageRef.current ||
          !cropArea
        )
          return;

        // Cancel previous RAF if exists
        if (dragRafIdRef.current !== null) {
          window.cancelAnimationFrame(dragRafIdRef.current);
        }

        dragRafIdRef.current = window.requestAnimationFrame(() => {
          dragRafIdRef.current = null;

          const rect = canvasRef.current?.getBoundingClientRect();
          const img = imageRef.current;
          if (!rect || !img) return;

          const deltaX = e.clientX - imageDragStart.x;
          const deltaY = e.clientY - imageDragStart.y;

          const newOffsetX = imageDragStart.offsetX + deltaX;
          const newOffsetY = imageDragStart.offsetY + deltaY;

          // Calculate display size
          const baseSize = getBaseDisplaySizeUtil(rect, img);
          if (!baseSize) return;

          const displayWidth = baseSize.width * scale;
          const displayHeight = baseSize.height * scale;

          // Constrain position
          const constrained = constrainImagePositionUtil(
            newOffsetX,
            newOffsetY,
            displayWidth,
            displayHeight,
            cropArea,
          );

          // Check if position actually changed (avoid updates when at boundary)
          // Use ref to get latest position value to avoid closure issues
          const currentPosition = lastImagePositionRef.current || imagePosition;
          if (
            !isImagePositionSimilarUtil(
              currentPosition,
              constrained,
              IMAGE_POSITION_SIMILARITY_THRESHOLD,
            )
          ) {
            setImagePosition(constrained);
            scheduleDraw();
          }
        });
      },
      [
        isDraggingImage,
        imageDragStart,
        scale,
        cropArea,
        scheduleDraw,
        imagePosition,
      ],
    );

    // Mouse up handler
    const handleMouseUp = useCallback(() => {
      // Cancel any pending drag RAF
      if (dragRafIdRef.current !== null) {
        window.cancelAnimationFrame(dragRafIdRef.current);
        dragRafIdRef.current = null;
      }

      const wasDragging = isDragging || isDraggingImage;

      setIsDragging(false);
      setDragHandle(null);
      setDragStart(null);
      setIsDraggingImage(false);
      setImageDragStart(null);

      // Update tag position and emit crop change after drag ends
      if (wasDragging) {
        updateTagPosition();
        if (cropArea && imageLoaded) {
          emitCropChange(cropArea);
        }
      }
    }, [
      isDragging,
      isDraggingImage,
      cropArea,
      imageLoaded,
      emitCropChange,
      updateTagPosition,
    ]);

    // Document events for dragging
    useDocumentEvents(
      () => {
        if (isDragging) {
          return {
            mousemove: handleMouseMove,
            mouseup: handleMouseUp,
          };
        }
        if (isDraggingImage) {
          return {
            mousemove: handleImageMouseMove,
            mouseup: handleMouseUp,
          };
        }
        return undefined;
      },
      [isDragging, isDraggingImage, handleMouseMove, handleImageMouseMove, handleMouseUp],
    );

    // Handle scale change with center point preservation
    const handleScaleChange = useCallback(
      (newScale: number) => {
        if (!canvasRef.current || !imageRef.current || !cropArea) {
          setScale(newScale);
          return;
        }

        const rect = canvasRef.current.getBoundingClientRect();
        const baseSize = getBaseDisplaySizeUtil(rect, imageRef.current);
        if (!baseSize) {
          setScale(newScale);
          return;
        }

        // Calculate center point of crop area in canvas coordinates
        const centerX = cropArea.x + cropArea.width / 2;
        const centerY = cropArea.y + cropArea.height / 2;

        // Calculate current image position relative to center
        const currentDisplayWidth = baseSize.width * scale;
        const currentDisplayHeight = baseSize.height * scale;
        const currentCenterOffsetX =
          centerX - (imagePosition.offsetX + currentDisplayWidth / 2);
        const currentCenterOffsetY =
          centerY - (imagePosition.offsetY + currentDisplayHeight / 2);

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
          cropArea,
        );

        setScale(newScale);
        setImagePosition(constrained);
      },
      [cropArea, imagePosition, scale],
    );

    // Handle slider change
    const handleSliderChange = useCallback(
      (value: number) => {
        handleScaleChange(value);
      },
      [handleScaleChange],
    );

    // Handle wheel (trackpad) zoom
    const handleWheel = useCallback(
      (e: WheelEvent) => {
        if (!cropArea) return;

        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        const newScale = Math.max(
          MIN_SCALE,
          Math.min(MAX_SCALE, scale + delta),
        );
        handleScaleChange(newScale);
      },
      [scale, cropArea, handleScaleChange],
    );

    // Add wheel event listener with passive: false to allow preventDefault
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.addEventListener('wheel', handleWheel, { passive: false });

      return () => {
        canvas.removeEventListener('wheel', handleWheel);
      };
    }, [handleWheel]);

    // Update cursor style
    const cursorStyle = useMemo(() => {
      if (!cropArea) return 'default';
      if (isDragging || isDraggingImage) return 'grabbing';

      return 'default';
    }, [cropArea, isDragging, isDraggingImage]);

    return (
      <div className={classes.element} ref={elementRef}>
        <Component
          {...rest}
          className={cx(classes.host, classes.size(size), className)}
          onMouseDown={handleMouseDown}
          ref={composedRef}
          style={{ cursor: cursorStyle, width: '100%', ...rest.style }}
        >
          {children}
        </Component>
        {cropArea && tagPosition && (
          <Typography
            className={classes.tag}
            color="text-fixed-light"
            style={{
              left: tagPosition.left,
              top: tagPosition.top,
            }}
          >
            {Math.round((tagCropArea || cropArea).width)} ×{' '}
            {Math.round((tagCropArea || cropArea).height)} px
          </Typography>
        )}
        {/* Zoom Controls */}
        <div className={classes.controls}>
          <Slider
            min={MIN_SCALE}
            max={MAX_SCALE}
            step={SCALE_STEP}
            value={scale}
            onChange={handleSliderChange}
            suffixIcon={PlusIcon}
            prefixIcon={MinusIcon}
          />
        </div>
      </div>
    );
  },
);

export default CropperElement;

