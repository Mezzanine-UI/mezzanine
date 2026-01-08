import { Children, forwardRef, isValidElement, ReactNode, useEffect, useState } from 'react';
import { anchorClasses as classes } from '@mezzanine-ui/core/anchor';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Typography from '../Typography';

export interface AnchorItem {
  id: string;
  name: string;
  href: string;
  disabled?: boolean;
  children?: AnchorItem[];
}

export interface AnchorPropsWithAnchors
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'children' | 'onClick'> {
  /**
   * Anchor data array (supports nested structure).
   */
  anchors: AnchorItem[];
  children?: never;
  /**
   * Trigger when user click on any anchor.
   */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface AnchorPropsWithChildren
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'children' | 'onClick'> {
  anchors?: never;
  /**
   * Anchor children (JSX format, supports nested Anchor components).
   */
  children: ReactNode;
  /**
   * The href attribute for the anchor link (required when used as child component).
   */
  href?: string;
  /**
   * Trigger when user click on any anchor.
   */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export type AnchorProps = AnchorPropsWithAnchors | AnchorPropsWithChildren;

interface AnchorItemProps {
  className?: string;
  item: AnchorItem;
  level?: number;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
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

    onClick?.(event);
  };

  return (
    <>
      <a
        aria-disabled={isDisabled}
        tabIndex={isDisabled ? -1 : undefined}
        href={item.href}
        onClick={handleClick}
        className={cx(
          classes.anchor,
          isActive && classes.anchorActive,
          isDisabled && classes.anchorDisabled,
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

/**
 * Parse children to extract anchor data
 */
function parseChildren(children: ReactNode): AnchorItem[] {
  const items: AnchorItem[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement<AnchorProps>(child) && child.type === Anchor) {
      const { children: nestedChildren, ...childProps } = child.props;

      let id: string;
      let name: string;
      let href: string | undefined;
      let nestedItems: AnchorItem[] = [];

      if ('anchors' in childProps && childProps.anchors) {
        items.push(...childProps.anchors);
        return;
      }

      // Get href from props (required)
      if ('href' in childProps) {
        href = childProps.href;
      }

      // Skip this anchor if no href is provided
      if (!href) {
        return;
      }

      if (typeof nestedChildren === 'string') {
        id = nestedChildren;
        name = nestedChildren;
      } else if (isValidElement(nestedChildren)) {
        nestedItems = parseChildren(nestedChildren);

        id = nestedItems[0]?.id || '';
        name = nestedItems[0]?.name || '';
      } else {
        const parsedNested = parseChildren(nestedChildren);

        if (parsedNested.length > 0) {
          nestedItems = parsedNested;
        }

        const textContent = extractTextContent(nestedChildren);
        id = textContent;
        name = textContent;
      }

      items.push({
        id,
        name,
        href,
        children: nestedItems.length > 0 ? nestedItems : undefined,
      });
    }
  });

  return items;
}

/**
 * Extract text content from ReactNode
 */
function extractTextContent(node: ReactNode): string {
  if (typeof node === 'string') {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map(extractTextContent).join('');
  }

  if (isValidElement(node)) {
    if (node.type === Anchor) {
      return '';
    }
    return extractTextContent((node.props as { children?: ReactNode }).children);
  }

  return '';
}

/**
 * The react component for `mezzanine` anchor.
 * This component should always be full width of its parent.
 */
const Anchor = forwardRef<HTMLDivElement, AnchorProps>(
  function Anchor(props, ref) {
    const {
      className,
      onClick,
      ...rest
    } = props;

    let anchors: AnchorItem[] = [];

    if ('anchors' in props && props.anchors) {
      anchors = props.anchors;
    } else if ('children' in props && props.children) {
      anchors = parseChildren(props.children);
    }

    return (
      <div
        ref={ref}
        className={cx(classes.host, className)}
        {...rest}
      >
        {anchors.map((item) => (
          <AnchorItem
            key={item.id}
            item={item}
            onClick={onClick}
          />
        ))}
      </div>
    );
  },
);

export default Anchor;
