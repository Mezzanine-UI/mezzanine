'use client';

import { cardClasses as classes } from '@mezzanine-ui/core/card';
import {
  Children,
  forwardRef,
  isValidElement,
  ReactNode,
  ReactElement,
} from 'react';
import { cx } from '../utils/cx';
import BaseCard from './BaseCard';
import BaseCardSkeleton from './BaseCardSkeleton';
import FourThumbnailCard from './FourThumbnailCard';
import FourThumbnailCardSkeleton from './FourThumbnailCardSkeleton';
import QuickActionCard from './QuickActionCard';
import QuickActionCardSkeleton from './QuickActionCardSkeleton';
import SingleThumbnailCard from './SingleThumbnailCard';
import SingleThumbnailCardSkeleton from './SingleThumbnailCardSkeleton';

/**
 * Card type for loading skeleton
 */
export type CardGroupLoadingType =
  | 'base'
  | 'four-thumbnail'
  | 'quick-action'
  | 'single-thumbnail';

export interface CardGroupProps {
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Card components to render in the group.
   * Only accepts BaseCard, QuickActionCard, SingleThumbnailCard, and FourThumbnailCard as children.
   */
  children?: ReactNode;
  /**
   * Whether to show loading skeletons
   * @default false
   */
  loading?: boolean;
  /**
   * Number of skeleton items to render when loading
   * @default 3
   */
  loadingCount?: number;
  /**
   * Type of card skeleton to render when loading.
   * Required when loading is true.
   */
  loadingType?: CardGroupLoadingType;
  /**
   * Width of each thumbnail skeleton when loadingType is 'single-thumbnail' or 'four-thumbnail'.
   * @default 360
   */
  loadingThumbnailWidth?: number | string;
  /**
   * Aspect ratio of thumbnail skeletons when loadingType is 'single-thumbnail' or 'four-thumbnail'.
   * For single-thumbnail, defaults to '16/9'. For four-thumbnail, defaults to '4/3'.
   */
  loadingThumbnailAspectRatio?: string;
}

// List of allowed child component types
const ALLOWED_CARD_TYPES = [
  BaseCard,
  FourThumbnailCard,
  QuickActionCard,
  SingleThumbnailCard,
];

/**
 * Get display name of a component for error messages
 */
function getComponentDisplayName(child: ReactElement): string {
  const { type } = child;

  if (typeof type === 'string') {
    return type;
  }

  return (
    (type as { displayName?: string }).displayName ||
    (type as { name?: string }).name ||
    'Unknown'
  );
}

/**
 * Detect the first valid card type from children
 */
function getFirstCardType(
  children: ReactNode,
):
  | typeof BaseCard
  | typeof FourThumbnailCard
  | typeof QuickActionCard
  | typeof SingleThumbnailCard
  | null {
  let firstType:
    | typeof BaseCard
    | typeof FourThumbnailCard
    | typeof QuickActionCard
    | typeof SingleThumbnailCard
    | null = null;

  Children.forEach(children, (child) => {
    if (firstType !== null) return;

    if (!isValidElement(child)) return;

    if (child.type === QuickActionCard) {
      firstType = QuickActionCard;
    } else if (child.type === BaseCard) {
      firstType = BaseCard;
    } else if (child.type === SingleThumbnailCard) {
      firstType = SingleThumbnailCard;
    } else if (child.type === FourThumbnailCard) {
      firstType = FourThumbnailCard;
    }
  });

  return firstType;
}

/**
 * Get the skeleton component based on loading type
 */
function getSkeletonComponent(loadingType: CardGroupLoadingType) {
  switch (loadingType) {
    case 'base':
      return BaseCardSkeleton;

    case 'four-thumbnail':
      return FourThumbnailCardSkeleton;

    case 'quick-action':
      return QuickActionCardSkeleton;

    case 'single-thumbnail':
      return SingleThumbnailCardSkeleton;

    default:
      return BaseCardSkeleton;
  }
}

/**
 * Get the group class modifier based on loading type
 */
function getGroupClassFromLoadingType(loadingType: CardGroupLoadingType) {
  switch (loadingType) {
    case 'four-thumbnail':
      return classes.groupFourThumbnail;

    case 'quick-action':
      return classes.groupQuickAction;

    case 'single-thumbnail':
      return classes.groupSingleThumbnail;

    default:
      return undefined;
  }
}

/**
 * CardGroup is a container for card components.
 * It uses CSS Grid to layout cards in a horizontal row with consistent spacing.
 */
const CardGroup = forwardRef<HTMLDivElement, CardGroupProps>(
  function CardGroup(props, ref) {
    const {
      className,
      children,
      loading = false,
      loadingCount = 3,
      loadingThumbnailAspectRatio,
      loadingThumbnailWidth,
      loadingType,
    } = props;

    // Detect first card type to determine min-width class
    const firstCardType = getFirstCardType(children);

    // Validate children at runtime
    const validChildren = Children.map(children, (child) => {
      if (!isValidElement(child)) {
        return child;
      }

      const isAllowedType = ALLOWED_CARD_TYPES.some(
        (allowedType) => child.type === allowedType,
      );

      if (!isAllowedType) {
        const displayName = getComponentDisplayName(child);

        console.warn(
          `[CardGroup] Invalid child type: <${displayName}>. ` +
            'CardGroup only accepts Card components (BaseCard, FourThumbnailCard, QuickActionCard, SingleThumbnailCard) as children.',
        );

        return null;
      }

      return child;
    });

    // Render loading skeletons
    const renderSkeletons = () => {
      if (!loading || !loadingType) {
        return null;
      }

      const SkeletonComponent = getSkeletonComponent(loadingType);

      // Build props for thumbnail skeletons
      const thumbnailSkeletonProps:
        | { thumbnailAspectRatio?: string; thumbnailWidth?: number | string }
        | undefined =
        loadingType === 'single-thumbnail' || loadingType === 'four-thumbnail'
          ? {
              ...(loadingThumbnailAspectRatio && {
                thumbnailAspectRatio: loadingThumbnailAspectRatio,
              }),
              ...(loadingThumbnailWidth && {
                thumbnailWidth: loadingThumbnailWidth,
              }),
            }
          : undefined;

      return Array.from({ length: loadingCount }, (_, index) => (
        <SkeletonComponent
          key={`skeleton-${index}`}
          {...thumbnailSkeletonProps}
        />
      ));
    };

    // Determine group class modifier
    const groupClassModifier =
      loadingType && loading
        ? getGroupClassFromLoadingType(loadingType)
        : undefined;

    return (
      <div
        ref={ref}
        className={cx(
          classes.group,
          {
            [classes.groupFourThumbnail]:
              firstCardType === FourThumbnailCard ||
              groupClassModifier === classes.groupFourThumbnail,
            [classes.groupQuickAction]:
              firstCardType === QuickActionCard ||
              groupClassModifier === classes.groupQuickAction,
            [classes.groupSingleThumbnail]:
              firstCardType === SingleThumbnailCard ||
              groupClassModifier === classes.groupSingleThumbnail,
          },
          className,
        )}
      >
        {validChildren}
        {renderSkeletons()}
      </div>
    );
  },
);

CardGroup.displayName = 'CardGroup';

export default CardGroup;
