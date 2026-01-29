'use client';

import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@mezzanine-ui/icons';
import { modalClasses as classes } from '@mezzanine-ui/core/modal';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import useModalContainer, { ModalContainerProps } from './useModalContainer';
import Icon from '../Icon';
import ClearActions from '../ClearActions';
import { Fade } from '../Transition';

export interface MediaPreviewModalProps
  extends Omit<ModalContainerProps, 'children'>,
    NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * The current index of the media being displayed (controlled mode).
   * If provided along with onNext/onPrev, the component operates in controlled mode.
   */
  currentIndex?: number;
  /**
   * The default index when the modal opens (uncontrolled mode).
   * @default 0
   */
  defaultIndex?: number;
  /**
   * Whether to disable the next navigation button.
   * @default false
   */
  disableNext?: boolean;
  /**
   * Whether to disable the previous navigation button.
   * @default false
   */
  disablePrev?: boolean;
  /**
   * Enable circular navigation (wrap around at boundaries).
   * When enabled, navigating past the last item goes to the first,
   * and navigating before the first item goes to the last.
   * @default false
   */
  enableCircularNavigation?: boolean;
  /**
   * Array of media items to display.
   * Each item should be a valid image URL or React node.
   */
  mediaItems: (string | React.ReactNode)[];
  /**
   * Callback fired when the index changes (uncontrolled mode).
   */
  onIndexChange?: (index: number) => void;
  /**
   * Callback fired when the next navigation button is clicked (controlled mode).
   * If provided, the component operates in controlled mode.
   */
  onNext?: () => void;
  /**
   * Callback fired when the previous navigation button is clicked (controlled mode).
   * If provided, the component operates in controlled mode.
   */
  onPrev?: () => void;
  /**
   * Whether to show the pagination indicator.
   * @default true
   */
  showPaginationIndicator?: boolean;
}

/**
 * The react component for `mezzanine` media preview modal.
 * Displays media items with navigation controls and a close button.
 */
const MediaPreviewModal = forwardRef<HTMLDivElement, MediaPreviewModalProps>(
  function MediaPreviewModal(props, ref) {
    const {
      className,
      container,
      currentIndex: controlledIndex,
      defaultIndex = 0,
      disableCloseOnBackdropClick = false,
      disableCloseOnEscapeKeyDown = false,
      disableNext = false,
      disablePortal = false,
      disablePrev = false,
      enableCircularNavigation = false,
      mediaItems,
      onBackdropClick,
      onClose,
      onIndexChange,
      onNext,
      onPrev,
      open,
      showPaginationIndicator = true,
      ...rest
    } = props;

    const { Container: ModalContainer } = useModalContainer();

    // Determine if component is in controlled mode
    const isControlled = controlledIndex !== undefined;

    // Internal state for uncontrolled mode
    const [internalIndex, setInternalIndex] = useState(defaultIndex);

    // Use controlled index if provided, otherwise use internal state
    const currentIndex = isControlled ? controlledIndex : internalIndex;

    // Reset internal index when modal opens in uncontrolled mode
    useEffect(() => {
      if (open && !isControlled) {
        setInternalIndex(defaultIndex);
      }
    }, [open, isControlled, defaultIndex]);

    // Built-in navigation handlers for uncontrolled mode
    const handleNext = () => {
      if (onNext) {
        // Controlled mode: use provided callback
        onNext();
      } else {
        // Uncontrolled mode: update internal state
        let nextIndex: number;
        if (enableCircularNavigation) {
          nextIndex = (currentIndex + 1) % mediaItems.length;
        } else {
          nextIndex = Math.min(currentIndex + 1, mediaItems.length - 1);
        }
        setInternalIndex(nextIndex);
        onIndexChange?.(nextIndex);
      }
    };

    const handlePrev = () => {
      if (onPrev) {
        // Controlled mode: use provided callback
        onPrev();
      } else {
        // Uncontrolled mode: update internal state
        let prevIndex: number;
        if (enableCircularNavigation) {
          prevIndex =
            (currentIndex - 1 + mediaItems.length) % mediaItems.length;
        } else {
          prevIndex = Math.max(currentIndex - 1, 0);
        }
        setInternalIndex(prevIndex);
        onIndexChange?.(prevIndex);
      }
    };

    // Auto-calculate disable states for uncontrolled mode
    const isNextDisabled = enableCircularNavigation
      ? false
      : disableNext || currentIndex >= mediaItems.length - 1;
    const isPrevDisabled = enableCircularNavigation
      ? false
      : disablePrev || currentIndex <= 0;

    const [displayedIndices, setDisplayedIndices] = useState<number[]>([
      currentIndex,
    ]);
    const [activeIndex, setActiveIndex] = useState<number>(currentIndex);
    const preloadedUrls = useRef<Set<string>>(new Set());

    // Helper function to preload a single image
    const preloadImage = (url: string) => {
      if (preloadedUrls.current.has(url)) return;

      const img = new Image();
      img.src = url;
      preloadedUrls.current.add(url);
    };

    // Preload images: prioritize current and adjacent, then load others
    useEffect(() => {
      if (!open) return;

      // Priority 1: Current and adjacent images
      const priorityIndices = [
        currentIndex - 1,
        currentIndex,
        currentIndex + 1,
      ].filter((idx) => idx >= 0 && idx < mediaItems.length);

      priorityIndices.forEach((idx) => {
        const media = mediaItems[idx];

        if (typeof media === 'string') {
          preloadImage(media);
        }
      });

      // Priority 2: All other images (load after a short delay)
      const loadRemainingTimer = setTimeout(() => {
        mediaItems.forEach((media, idx) => {
          if (typeof media === 'string' && !priorityIndices.includes(idx)) {
            preloadImage(media);
          }
        });
      }, 500);

      return () => clearTimeout(loadRemainingTimer);
    }, [open, currentIndex, mediaItems]);

    useEffect(() => {
      if (currentIndex !== activeIndex) {
        // First, add new index to displayedIndices (will render with in=false)
        setDisplayedIndices((prev) =>
          prev.includes(currentIndex) ? prev : [...prev, currentIndex],
        );

        // Use requestAnimationFrame to ensure DOM is updated before triggering animation
        let rafId1: number | null = null;
        let rafId2: number | null = null;

        rafId1 = requestAnimationFrame(() => {
          rafId2 = requestAnimationFrame(() => {
            setActiveIndex(currentIndex);
          });
        });

        // Clean up old images after transition completes
        const cleanupTimer = setTimeout(() => {
          setDisplayedIndices([currentIndex]);
        }, MOTION_DURATION.fast + 100);

        return () => {
          clearTimeout(cleanupTimer);
          if (rafId1 !== null) {
            cancelAnimationFrame(rafId1);
          }
          if (rafId2 !== null) {
            cancelAnimationFrame(rafId2);
          }
        };
      }

      return undefined;
    }, [currentIndex, activeIndex]);

    // Memoize media elements to prevent unnecessary re-renders
    const mediaElements = useMemo(() => {
      return mediaItems.map((media, index) => {
        if (typeof media === 'string') {
          return {
            index,
            element: (
              <img
                alt={`Media ${index + 1}`}
                className={classes.mediaPreviewImage}
                src={media}
              />
            ),
          };
        }

        return {
          index,
          element: <div className={classes.mediaPreviewImage}>{media}</div>,
        };
      });
    }, [mediaItems]);

    const renderMedia = (index: number) => {
      const mediaElement = mediaElements.find((item) => item.index === index);

      if (!mediaElement) return null;

      const isCurrent = index === activeIndex;

      return (
        <Fade
          duration={{
            enter: MOTION_DURATION.fast,
            exit: MOTION_DURATION.fast,
          }}
          easing={{
            enter: MOTION_EASING.standard,
            exit: MOTION_EASING.standard,
          }}
          in={isCurrent}
          key={index}
        >
          {mediaElement.element}
        </Fade>
      );
    };

    return (
      <ModalContainer
        className={classes.overlay}
        container={container}
        disableCloseOnBackdropClick={disableCloseOnBackdropClick}
        disableCloseOnEscapeKeyDown={disableCloseOnEscapeKeyDown}
        disablePortal={disablePortal}
        onBackdropClick={onBackdropClick}
        onClose={onClose}
        open={open}
        ref={ref}
      >
        <div
          {...rest}
          className={cx(classes.host, classes.mediaPreview, className)}
          role="dialog"
        >
          <div className={classes.mediaPreviewContent}>
            <div className={classes.mediaPreviewMediaContainer}>
              {displayedIndices.map((index) => renderMedia(index))}
            </div>
          </div>
        </div>
        <ClearActions
          className={classes.mediaPreviewCloseButton}
          onClick={onClose}
          type="embedded"
          variant="contrast"
        />
        {mediaItems.length > 1 && (
          <button
            aria-disabled={isPrevDisabled}
            aria-label="Previous media"
            className={cx(
              classes.mediaPreviewNavButton,
              classes.mediaPreviewNavButtonPrev,
            )}
            disabled={isPrevDisabled}
            onClick={handlePrev}
            title="Previous"
            type="button"
          >
            <Icon icon={ChevronLeftIcon} size={16} color="fixed-light" />
          </button>
        )}
        {mediaItems.length > 1 && (
          <button
            aria-disabled={isNextDisabled}
            aria-label="Next media"
            className={cx(
              classes.mediaPreviewNavButton,
              classes.mediaPreviewNavButtonNext,
            )}
            disabled={isNextDisabled}
            onClick={handleNext}
            title="Next"
            type="button"
          >
            <Icon icon={ChevronRightIcon} size={16} color="fixed-light" />
          </button>
        )}
        {showPaginationIndicator && mediaItems.length > 1 && (
          <div
            aria-label={`Page ${currentIndex + 1} of ${mediaItems.length}`}
            className={classes.mediaPreviewPaginationIndicator}
          >
            {currentIndex + 1}/{mediaItems.length}
          </div>
        )}
      </ModalContainer>
    );
  },
);

export default MediaPreviewModal;
