'use client';

import { cardClasses as classes } from '@mezzanine-ui/core/card';
import { Children, forwardRef, isValidElement, ReactNode } from 'react';
import { cx } from '../utils/cx';
import BaseCard from './BaseCard';

export interface CardGroupProps {
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Card components to render in the group.
   * Only accepts BaseCard (and future card variants) as children.
   */
  children?: ReactNode;
}

// List of allowed child component types
const ALLOWED_CARD_TYPES = [BaseCard];

/**
 * Get display name of a component for error messages
 */
function getComponentDisplayName(child: React.ReactElement): string {
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
 * CardGroup is a container for card components.
 * It uses CSS Grid to layout cards in a horizontal row with consistent spacing.
 */
const CardGroup = forwardRef<HTMLDivElement, CardGroupProps>(
  function CardGroup(props, ref) {
    const { className, children } = props;

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
            'CardGroup only accepts Card components (BaseCard) as children.',
        );

        return null;
      }

      return child;
    });

    return (
      <div ref={ref} className={cx(classes.group, className)}>
        {validChildren}
      </div>
    );
  },
);

CardGroup.displayName = 'CardGroup';

export default CardGroup;
