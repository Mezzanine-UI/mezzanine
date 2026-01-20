'use client';

import { useEffect, useState } from 'react';
import { anchorClasses as classes } from '@mezzanine-ui/core/anchor';
import { cx } from '../utils/cx';
import Typography from '../Typography';

export interface AnchorItemData {
  autoScrollTo?: boolean;
  children?: AnchorItemData[];
  disabled?: boolean;
  href: string;
  id: string;
  name: string;
  onClick?: VoidFunction;
  title?: string;
}

export interface AnchorItemProps {
  autoScrollTo?: boolean;
  className?: string;
  disabled?: boolean;
  href: string;
  id: string;
  level?: number;
  name: string;
  onClick?: VoidFunction;
  parentAutoScrollTo?: boolean;
  parentDisabled?: boolean;
  subAnchors?: AnchorItemData[];
  title?: string;
}

const MAX_CHILDREN_PER_LEVEL = 3;

/**
 * Custom hook to track window.location.hash changes
 */
function useHash() {
  const [hash, setHash] = useState(() =>
    typeof window !== 'undefined' ? window.location.hash : '',
  );

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return hash;
}

/**
 * Individual anchor link with hash tracking and smooth scrolling.
 * Tracks active state from URL hash and inherits disabled state from parent.
 */
function AnchorItem({
  autoScrollTo,
  className,
  disabled,
  href,
  id: _id,
  level = 1,
  name,
  onClick,
  parentAutoScrollTo = false,
  parentDisabled = false,
  subAnchors,
  title,
}: AnchorItemProps) {
  const renderableChildren =
    subAnchors && subAnchors.length > 0 && level < MAX_CHILDREN_PER_LEVEL
      ? subAnchors.slice(0, MAX_CHILDREN_PER_LEVEL)
      : undefined;

  const currentHash = useHash();
  const hashIndex = href.indexOf('#');
  const itemHash = hashIndex !== -1 ? href.slice(hashIndex) : '';
  const isActive = itemHash && currentHash === itemHash;
  const isAutoScrollTo = parentAutoScrollTo || autoScrollTo;
  const isDisabled = parentDisabled || disabled;

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }

    // If href contains a hash, handle navigation manually to ensure hashchange event fires
    if (itemHash && typeof window !== 'undefined') {
      event.preventDefault();

      // Update the hash in the URL only if it's different
      if (window.location.hash !== itemHash) {
        window.history.pushState(null, '', itemHash);
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      }

      // Scroll to the target element if it exists and autoScrollTo is enabled
      if (isAutoScrollTo) {
        const targetElement = document.querySelector(itemHash);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }

    onClick?.();
  };

  return (
    <>
      <a
        aria-disabled={isDisabled}
        className={cx(
          classes.anchorItem,
          isActive && classes.anchorItemActive,
          isDisabled && classes.anchorItemDisabled,
          className,
        )}
        href={href}
        onClick={handleClick}
        tabIndex={isDisabled ? -1 : undefined}
        title={title}
      >
        <Typography color="inherit" variant="label-primary">
          {name}
        </Typography>
      </a>
      {renderableChildren && (
        <div className={classes.nested}>
          {renderableChildren.map((child: AnchorItemData) => (
            <AnchorItem
              autoScrollTo={child.autoScrollTo}
              className={cx(
                level === 1 && classes.nestedLevel1,
                level === 2 && classes.nestedLevel2,
              )}
              disabled={child.disabled}
              href={child.href}
              id={child.id}
              key={child.id}
              level={level + 1}
              name={child.name}
              onClick={child.onClick}
              parentAutoScrollTo={isAutoScrollTo}
              parentDisabled={isDisabled}
              subAnchors={child.children}
              title={child.title}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default AnchorItem;
