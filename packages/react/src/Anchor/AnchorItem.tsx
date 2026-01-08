import { useEffect, useState } from 'react';
import { anchorClasses as classes } from '@mezzanine-ui/core/anchor';
import { cx } from '../utils/cx';
import Typography from '../Typography';

export interface AnchorItemData {
  id: string;
  name: string;
  href: string;
  disabled?: boolean;
  onClick?: VoidFunction;
  children?: AnchorItemData[];
}

export interface AnchorItemProps {
  className?: string;
  /**
   * ```ts
   * {
   *   id: string;
   *   name: string;
   *   href: string;
   *   disabled?: boolean;
   *   onClick?: VoidFunction;
   *   children?: AnchorItemData[];
   * }
   * ```
   */
  item: AnchorItemData;
  level?: number;
  onClick?: VoidFunction;
  parentDisabled?: boolean;
}

const MAX_LEVEL = 3;

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
  className,
  item,
  level = 1,
  onClick,
  parentDisabled = false,
}: AnchorItemProps) {
  const renderableChildren =
    item.children && item.children.length > 0 && level < MAX_LEVEL
      ? item.children.slice(0, MAX_LEVEL)
      : undefined;

  const currentHash = useHash();
  const itemHash = item.href.includes('#') ? '#' + item.href.split('#')[1] : '';
  const isActive = itemHash && currentHash === itemHash;
  const isDisabled = parentDisabled || item.disabled;

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }

    // If href contains a hash, update it manually to ensure hashchange event fires
    if (itemHash && typeof window !== 'undefined') {
      // Update the hash in the URL
      if (window.location.hash !== itemHash) {
        window.location.hash = itemHash;
      }

      // Scroll to the target element if it exists
      const targetElement = document.querySelector(itemHash);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    item.onClick?.();
  };

  return (
    <>
      <a
        aria-disabled={isDisabled}
        tabIndex={isDisabled ? -1 : undefined}
        href={item.href}
        onClick={handleClick}
        className={cx(
          classes.anchorItem,
          isActive && classes.anchorItemActive,
          isDisabled && classes.anchorItemDisabled,
          className,
        )}
      >
        <Typography color="inherit" variant="label-primary">
          {item.name}
        </Typography>
      </a>
      {renderableChildren && (
        <div className={classes.nested}>
          {renderableChildren.map((child) => (
            <AnchorItem
              key={child.id}
              className={cx(
                level === 1 && classes.nestedLevel1,
                level === 2 && classes.nestedLevel2,
              )}
              item={child}
              level={level + 1}
              onClick={onClick}
              parentDisabled={isDisabled}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default AnchorItem;
