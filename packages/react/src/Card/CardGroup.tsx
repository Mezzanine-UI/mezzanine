'use client';

import { ReactElement } from 'react';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import { Children, forwardRef, isValidElement, ReactNode } from 'react';
import { cx } from '../utils/cx';
import BaseCard from './BaseCard';
import QuickActionCard from './QuickActionCard';
import SingleThumbnailCard from './SingleThumbnailCard';

export interface CardGroupProps {
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Card components to render in the group.
   * Only accepts BaseCard and QuickActionCard as children.
   */
  children?: ReactNode;
}

// List of allowed child component types
const ALLOWED_CARD_TYPES = [BaseCard, QuickActionCard, SingleThumbnailCard];

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
  | typeof QuickActionCard
  | typeof SingleThumbnailCard
  | null {
  let firstType:
    | typeof BaseCard
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
    }
  });

  return firstType;
}

/**
 * CardGroup is a container for card components.
 * It uses CSS Grid to layout cards in a horizontal row with consistent spacing.
 */
const CardGroup = forwardRef<HTMLDivElement, CardGroupProps>(
  function CardGroup(props, ref) {
    const { className, children } = props;

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
            'CardGroup only accepts Card components (BaseCard, QuickActionCard, SingleThumbnailCard) as children.',
        );

        return null;
      }

      return child;
    });

    return (
      <div
        ref={ref}
        className={cx(
          classes.group,
          {
            [classes.groupQuickAction]: firstCardType === QuickActionCard,
            [classes.groupSingleThumbnail]:
              firstCardType === SingleThumbnailCard,
          },
          className,
        )}
      >
        {validChildren}
      </div>
    );
  },
);

CardGroup.displayName = 'CardGroup';

export default CardGroup;
