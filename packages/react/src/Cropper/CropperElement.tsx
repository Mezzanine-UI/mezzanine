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

interface ImagePosition {
  offsetX: number;
  offsetY: number;
}

const DEFAULT_MIN_WIDTH = 50;
const DEFAULT_MIN_HEIGHT = 50;
const MIN_SCALE = 1;
const MAX_SCALE = 2;
const SCALE_STEP = 0.01;
const BORDER_WIDTH = 2;
const TAG_INSET_PX = 10;

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

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const elementRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [cropArea, setCropArea] = useState<CropArea | null>(
      initialCropArea || null,
    );
    const [isDragging, setIsDragging] = useState(false);
    const [dragHandle, setDragHandle] = useState<CropHandle | null>(null);
    const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
      null,
    );
    const [imageLoaded, setImageLoaded] = useState(false);
    const [scale, setScale] = useState(1);
    const [imagePosition, setImagePosition] = useState<ImagePosition>({
      offsetX: 0,
      offsetY: 0,
    });
    const [isDraggingImage, setIsDraggingImage] = useState(false);
    const [imageDragStart, setImageDragStart] = useState<{
      x: number;
      y: number;
      offsetX: number;
      offsetY: number;
    } | null>(null);
    const [hoverHandle, setHoverHandle] = useState<CropHandle | null>(null);
    const [tagPosition, setTagPosition] = useState<{
      left: number;
      top: number;
    } | null>(null);
    const baseDisplaySizeRef = useRef<{ width: number; height: number } | null>(
      null,
    );

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

    const updateTagPosition = useCallback(() => {
      if (!cropArea || !canvasRef.current || !elementRef.current) {
        setTagPosition(null);
        return;
      }
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const elementRect = elementRef.current.getBoundingClientRect();

      setTagPosition({
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
      });
    }, [cropArea]);

    // Load image
    useEffect(() => {
      if (!imageSrc) {
        setImageLoaded(false);
        imageRef.current = null;
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';

      const loadImage = async () => {
        try {
          let url: string;

          if (typeof imageSrc === 'string') {
            url = imageSrc;
          } else {
            url = URL.createObjectURL(imageSrc);
          }

          img.src = url;
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });

          imageRef.current = img;
          setImageLoaded(true);

          // Initialize crop area if not provided
          if (!initialCropArea && canvasRef.current) {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const scaleX = img.width / rect.width;
            const scaleY = img.height / rect.height;
            const baseScale = Math.min(scaleX, scaleY);

            const baseDisplayWidth = img.width / baseScale;
            const baseDisplayHeight = img.height / baseScale;
            baseDisplaySizeRef.current = {
              width: baseDisplayWidth,
              height: baseDisplayHeight,
            };

            const initialOffsetX = (rect.width - baseDisplayWidth) / 2;
            const initialOffsetY = (rect.height - baseDisplayHeight) / 2;

            let initialWidth: number;
            let initialHeight: number;
            let initialX: number;
            let initialY: number;

            if (aspectRatio) {
              // Calculate maximum size that fits within image display area
              const maxWidthByHeight = baseDisplayHeight * aspectRatio;
              const maxHeightByWidth = baseDisplayWidth / aspectRatio;

              // Choose the dimension that fits within image bounds
              if (maxWidthByHeight <= baseDisplayWidth) {
                // Height is the limiting factor
                initialWidth = maxWidthByHeight;
                initialHeight = baseDisplayHeight;
              } else {
                // Width is the limiting factor
                initialWidth = baseDisplayWidth;
                initialHeight = maxHeightByWidth;
              }

              // Center the crop area within the image display area
              initialX = initialOffsetX + (baseDisplayWidth - initialWidth) / 2;
              initialY = initialOffsetY + (baseDisplayHeight - initialHeight) / 2;
            } else {
              initialWidth = Math.min(rect.width * 0.6, baseDisplayWidth);
              initialHeight = Math.min(rect.height * 0.6, baseDisplayHeight);
              initialX = (rect.width - initialWidth) / 2;
              initialY = (rect.height - initialHeight) / 2;
            }

            setCropArea({
              x: initialX,
              y: initialY,
              width: initialWidth,
              height: initialHeight,
            });

            setImagePosition({
              offsetX: initialOffsetX,
              offsetY: initialOffsetY,
            });
          }
        } catch (error) {
          console.error('Failed to load image:', error);
          setImageLoaded(false);
        }
      };

      loadImage();

      return () => {
        if (typeof imageSrc !== 'string' && imageSrc instanceof Blob) {
          URL.revokeObjectURL(img.src);
        }
      };
    }, [imageSrc, initialCropArea, aspectRatio]);

    useLayoutEffect(() => {
      updateTagPosition();
    }, [updateTagPosition]);

    useEffect(() => {
      if (!elementRef.current || !canvasRef.current) return undefined;

      const resizeObserver = new ResizeObserver(() => {
        updateTagPosition();
      });

      resizeObserver.observe(elementRef.current);
      resizeObserver.observe(canvasRef.current);
      window.addEventListener('resize', updateTagPosition);

      return () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', updateTagPosition);
      };
    }, [updateTagPosition]);

    // Calculate base display size
    const getBaseDisplaySize = useCallback(() => {
      if (!canvasRef.current || !imageRef.current) return null;

      const canvas = canvasRef.current;
      const img = imageRef.current;
      const rect = canvas.getBoundingClientRect();

      const scaleX = img.width / rect.width;
      const scaleY = img.height / rect.height;
      const baseScale = Math.min(scaleX, scaleY);

      return {
        width: img.width / baseScale,
        height: img.height / baseScale,
      };
    }, []);

    // Constrain image position to ensure it covers crop area
    const constrainImagePosition = useCallback(
      (
        newOffsetX: number,
        newOffsetY: number,
        displayWidth: number,
        displayHeight: number,
      ): ImagePosition => {
        if (!cropArea || !canvasRef.current) {
          return { offsetX: newOffsetX, offsetY: newOffsetY };
        }

        const rect = canvasRef.current.getBoundingClientRect();
        const { x: cx, y: cy, width: cw, height: ch } = cropArea;

        // Ensure image covers crop area (no white space)
        // Left edge constraint
        const minOffsetX = Math.min(cx + cw - displayWidth, 0);
        // Right edge constraint
        const maxOffsetX = Math.max(cx, rect.width - displayWidth);
        // Top edge constraint
        const minOffsetY = Math.min(cy + ch - displayHeight, 0);
        // Bottom edge constraint
        const maxOffsetY = Math.max(cy, rect.height - displayHeight);

        return {
          offsetX: Math.max(minOffsetX, Math.min(newOffsetX, maxOffsetX)),
          offsetY: Math.max(minOffsetY, Math.min(newOffsetY, maxOffsetY)),
        };
      },
      [cropArea],
    );

    // Draw canvas
    const drawCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      const img = imageRef.current;
      const crop = cropArea;

      if (!canvas || !img || !crop) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Calculate base scale
      const scaleX = img.width / rect.width;
      const scaleY = img.height / rect.height;
      const baseScale = Math.min(scaleX, scaleY);

      // Calculate display size with zoom
      const baseDisplayWidth = img.width / baseScale;
      const baseDisplayHeight = img.height / baseScale;

      if (!baseDisplaySizeRef.current) {
        baseDisplaySizeRef.current = {
          width: baseDisplayWidth,
          height: baseDisplayHeight,
        };
      }

      const displayWidth = baseDisplayWidth * scale;
      const displayHeight = baseDisplayHeight * scale;

      // Constrain image position
      const constrainedPosition = constrainImagePosition(
        imagePosition.offsetX,
        imagePosition.offsetY,
        displayWidth,
        displayHeight,
      );

      // Update position if constrained
      if (
        constrainedPosition.offsetX !== imagePosition.offsetX ||
        constrainedPosition.offsetY !== imagePosition.offsetY
      ) {
        setImagePosition(constrainedPosition);
      }

      const finalOffsetX = constrainedPosition.offsetX;
      const finalOffsetY = constrainedPosition.offsetY;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw image
      ctx.drawImage(img, finalOffsetX, finalOffsetY, displayWidth, displayHeight);

      // Draw overlay (darken outside crop area only)
      // Use clip to exclude crop area from overlay
      ctx.save();
      // Create a path that covers the entire canvas except the crop area
      // Using even-odd rule to create a hole
      const path = new Path2D();
      path.rect(0, 0, canvas.width, canvas.height);
      path.rect(crop.x, crop.y, crop.width, crop.height);
      ctx.clip(path, 'evenodd');

      // Get overlay color from CSS variable with fallback
      const overlayColor =
        getCSSVariableValue('--mzn-color-overlay-strong') ||
        'rgba(0, 0, 0, 0.60)';
      ctx.fillStyle = overlayColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Draw crop border
      ctx.strokeStyle = getCSSVariableValue('--mzn-color-border-brand') || '#5D74E9';
      ctx.lineWidth = BORDER_WIDTH;
      ctx.strokeRect(crop.x, crop.y, crop.width, crop.height);

    }, [cropArea, scale, imagePosition, constrainImagePosition]);

    useEffect(() => {
      if (imageLoaded) {
        const baseSize = getBaseDisplaySize();
        if (baseSize) {
          baseDisplaySizeRef.current = baseSize;
        }
        drawCanvas();
      }
    }, [imageLoaded, drawCanvas, getBaseDisplaySize]);

    // Get handle type from mouse position
    const getHandleType = useCallback(
      (x: number, y: number): CropHandle | null => {
        if (!cropArea) return null;

        const handleSize = 12;
        const { x: cx, y: cy, width, height } = cropArea;

        // Check corners
        if (
          Math.abs(x - cx) < handleSize &&
          Math.abs(y - cy) < handleSize
        ) {
          return { x: cx, y: cy, type: 'nw' };
        }
        if (
          Math.abs(x - (cx + width)) < handleSize &&
          Math.abs(y - cy) < handleSize
        ) {
          return { x: cx + width, y: cy, type: 'ne' };
        }
        if (
          Math.abs(x - cx) < handleSize &&
          Math.abs(y - (cy + height)) < handleSize
        ) {
          return { x: cx, y: cy + height, type: 'sw' };
        }
        if (
          Math.abs(x - (cx + width)) < handleSize &&
          Math.abs(y - (cy + height)) < handleSize
        ) {
          return { x: cx + width, y: cy + height, type: 'se' };
        }

        // Check edges
        if (
          Math.abs(x - (cx + width / 2)) < handleSize &&
          Math.abs(y - cy) < handleSize
        ) {
          return { x: cx + width / 2, y: cy, type: 'n' };
        }
        if (
          Math.abs(x - (cx + width / 2)) < handleSize &&
          Math.abs(y - (cy + height)) < handleSize
        ) {
          return { x: cx + width / 2, y: cy + height, type: 's' };
        }
        if (
          Math.abs(x - cx) < handleSize &&
          Math.abs(y - (cy + height / 2)) < handleSize
        ) {
          return { x: cx, y: cy + height / 2, type: 'w' };
        }
        if (
          Math.abs(x - (cx + width)) < handleSize &&
          Math.abs(y - (cy + height / 2)) < handleSize
        ) {
          return { x: cx + width, y: cy + height / 2, type: 'e' };
        }

        // Check if inside crop area (for moving)
        if (x >= cx && x <= cx + width && y >= cy && y <= cy + height) {
          return { x, y, type: 'move' };
        }

        return null;
      },
      [cropArea],
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
        }

        // Apply constraints - allow crop area to extend to image bounds
        if (canvasRef.current && imageRef.current) {
          const rect = canvasRef.current.getBoundingClientRect();
          const scaleX = imageRef.current.width / rect.width;
          const scaleY = imageRef.current.height / rect.height;
          const baseScale = Math.min(scaleX, scaleY);
          const baseDisplayWidth = imageRef.current.width / baseScale;
          const baseDisplayHeight = imageRef.current.height / baseScale;
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

        if (!onCropChange) {
          return;
        }

        if (!canvasRef.current || !imageRef.current) {
          onCropChange(newCrop);
          return;
        }

        const rect = canvasRef.current.getBoundingClientRect();
        const img = imageRef.current;
        const scaleX = img.width / rect.width;
        const scaleY = img.height / rect.height;
        const baseScale = Math.min(scaleX, scaleY);
        const imageScale = baseScale / scale;
        const rawWidth = newCrop.width * imageScale;
        const rawHeight = newCrop.height * imageScale;
        const rawX = (newCrop.x - imagePosition.offsetX) * imageScale;
        const rawY = (newCrop.y - imagePosition.offsetY) * imageScale;
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

        onCropChange({
          height: clampedHeight,
          width: clampedWidth,
          x: clampedX,
          y: clampedY,
        });
      },
      [
        cropArea,
        aspectRatio,
        minWidth,
        minHeight,
        onCropChange,
        imagePosition.offsetX,
        imagePosition.offsetY,
        scale,
      ],
    );

    // Check if point is on image (not on crop handles)
    const isPointOnImage = useCallback(
      (x: number, y: number): boolean => {
        if (!cropArea || !canvasRef.current || !imageRef.current) return false;

        const handle = getHandleType(x, y);
        // If it's a crop handle, return false
        if (handle && handle.type !== 'move') return false;

        // Check if point is inside crop area (for moving crop box)
        const { x: cx, y: cy, width: cw, height: ch } = cropArea;
        if (x >= cx && x <= cx + cw && y >= cy && y <= cy + ch) {
          return false; // Inside crop area, should move crop box
        }

        // Check if point is on image
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = imageRef.current.width / rect.width;
        const scaleY = imageRef.current.height / rect.height;
        const baseScale = Math.min(scaleX, scaleY);
        const baseDisplayWidth = imageRef.current.width / baseScale;
        const baseDisplayHeight = imageRef.current.height / baseScale;
        const displayWidth = baseDisplayWidth * scale;
        const displayHeight = baseDisplayHeight * scale;

        return (
          x >= imagePosition.offsetX &&
          x <= imagePosition.offsetX + displayWidth &&
          y >= imagePosition.offsetY &&
          y <= imagePosition.offsetY + displayHeight
        );
      },
      [cropArea, scale, imagePosition, getHandleType],
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

        // Otherwise, check for crop handle
        const handle = getHandleType(x, y);
        if (handle) {
          setIsDragging(true);
          setDragHandle(handle);
          setDragStart({ x: e.clientX, y: e.clientY });
        }
      },
      [cropArea, getHandleType, isPointOnImage, imagePosition],
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
          !imageRef.current
        )
          return;

        const rect = canvasRef.current.getBoundingClientRect();
        const deltaX = e.clientX - imageDragStart.x;
        const deltaY = e.clientY - imageDragStart.y;

        const newOffsetX = imageDragStart.offsetX + deltaX;
        const newOffsetY = imageDragStart.offsetY + deltaY;

        // Calculate display size
        const scaleX = imageRef.current.width / rect.width;
        const scaleY = imageRef.current.height / rect.height;
        const baseScale = Math.min(scaleX, scaleY);
        const baseDisplayWidth = imageRef.current.width / baseScale;
        const baseDisplayHeight = imageRef.current.height / baseScale;
        const displayWidth = baseDisplayWidth * scale;
        const displayHeight = baseDisplayHeight * scale;

        // Constrain position
        const constrained = constrainImagePosition(
          newOffsetX,
          newOffsetY,
          displayWidth,
          displayHeight,
        );

        setImagePosition(constrained);
      },
      [isDraggingImage, imageDragStart, scale, constrainImagePosition],
    );

    // Mouse up handler
    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
      setDragHandle(null);
      setDragStart(null);
      setIsDraggingImage(false);
      setImageDragStart(null);
    }, []);

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
        const scaleX = imageRef.current.width / rect.width;
        const scaleY = imageRef.current.height / rect.height;
        const baseScale = Math.min(scaleX, scaleY);
        const baseDisplayWidth = imageRef.current.width / baseScale;
        const baseDisplayHeight = imageRef.current.height / baseScale;

        // Calculate center point of crop area in canvas coordinates
        const centerX = cropArea.x + cropArea.width / 2;
        const centerY = cropArea.y + cropArea.height / 2;

        // Calculate current image position relative to center
        const currentDisplayWidth = baseDisplayWidth * scale;
        const currentDisplayHeight = baseDisplayHeight * scale;
        const currentCenterOffsetX = centerX - (imagePosition.offsetX + currentDisplayWidth / 2);
        const currentCenterOffsetY = centerY - (imagePosition.offsetY + currentDisplayHeight / 2);

        // Calculate new display size
        const newDisplayWidth = baseDisplayWidth * newScale;
        const newDisplayHeight = baseDisplayHeight * newScale;

        // Calculate new position to keep center point
        const newOffsetX = centerX - newDisplayWidth / 2 - currentCenterOffsetX;
        const newOffsetY = centerY - newDisplayHeight / 2 - currentCenterOffsetY;

        // Constrain new position
        const constrained = constrainImagePosition(
          newOffsetX,
          newOffsetY,
          newDisplayWidth,
          newDisplayHeight,
        );

        setScale(newScale);
        setImagePosition(constrained);
      },
      [cropArea, imagePosition, scale, constrainImagePosition],
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
      (e: React.WheelEvent<HTMLCanvasElement>) => {
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

    // Handle mouse move for cursor update
    const handleCanvasMouseMove = useCallback(
      (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!cropArea || !canvasRef.current || isDragging || isDraggingImage)
          return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const handle = getHandleType(x, y);
        setHoverHandle(handle);
      },
      [cropArea, isDragging, isDraggingImage, getHandleType],
    );

    // Update cursor style
    const cursorStyle = useMemo(() => {
      if (!cropArea) return 'default';
      if (isDragging || isDraggingImage) return 'grabbing';
      const activeHandle = dragHandle || hoverHandle;
      if (activeHandle) {
        const cursors: Record<string, string> = {
          nw: 'nwse-resize',
          ne: 'nesw-resize',
          sw: 'nesw-resize',
          se: 'nwse-resize',
          n: 'ns-resize',
          s: 'ns-resize',
          e: 'ew-resize',
          w: 'ew-resize',
          move: 'move',
        };
        return cursors[activeHandle.type] || 'default';
      }
      return 'default';
    }, [cropArea, isDragging, isDraggingImage, dragHandle, hoverHandle]);

    return (
      <div className={classes.element} ref={elementRef}>
        <Component
          {...rest}
          ref={composedRef}
          className={cx(classes.host, classes.size(size), className)}
          onMouseDown={handleMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={() => setHoverHandle(null)}
          onWheel={handleWheel}
          style={{ cursor: cursorStyle, ...rest.style }}
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
            {Math.round(cropArea.width)} × {Math.round(cropArea.height)} px
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

