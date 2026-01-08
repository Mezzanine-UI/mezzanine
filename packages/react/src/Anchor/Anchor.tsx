import { Children, forwardRef, isValidElement, ReactNode } from 'react';
import { anchorClasses as classes } from '@mezzanine-ui/core/anchor';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import AnchorItem, { AnchorItemData } from './AnchorItem';

export interface AnchorPropsWithAnchors
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'children' | 'onClick'> {
  /**
   * Anchor data array (supports nested structure).
   */
  anchors: AnchorItemData[];
  children?: never;
  /**
   * Trigger when user click on any anchor.
   */
  onClick?: VoidFunction;
}

export interface AnchorPropsWithChildren
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'children' | 'onClick'> {
  anchors?: never;
  /**
   * Anchor children (JSX format, supports nested Anchor components).
   */
  children: ReactNode;
  /**
   * Whether the anchor is disabled.
   */
  disabled?: boolean;
  /**
   * The href attribute for the anchor link (required when used as child component).
   */
  href?: string;
  /**
   * Trigger when user click on any anchor.
   */
  onClick?: VoidFunction;
}

export type AnchorProps = AnchorPropsWithAnchors | AnchorPropsWithChildren;

/**
 * Parse children to extract anchor data
 */
function parseChildren(children: ReactNode): AnchorItemData[] {
  const items: AnchorItemData[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement<AnchorProps>(child) && child.type === Anchor) {
      const { children: nestedChildren, ...childProps } = child.props;

      let id: string;
      let name: string;
      let href: string | undefined;
      let nestedItems: AnchorItemData[] = [];

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
        children: nestedItems.length > 0 ? nestedItems : undefined,
        disabled: childProps.disabled,
        href,
        id,
        name,
        onClick: childProps.onClick,
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
      onClick,
      className,
      ...rest
    } = props;

    const divProps = Object.keys(rest).reduce((acc, key) => {
      if (key !== 'anchors' && key !== 'children' && key !== 'disabled' && key !== 'href') {
        (acc as any)[key] = (rest as any)[key];
      }
      return acc;
    }, {} as Omit<typeof rest, 'anchors' | 'children' | 'disabled' | 'href'>);

    const anchorItems: AnchorItemData[] =
      'anchors' in props && props.anchors
        ? props.anchors
        : 'children' in props && props.children
          ? parseChildren(props.children)
          : [];

    return (
      <div
        ref={ref}
        className={cx(classes.host, className)}
        {...divProps}
      >
        {anchorItems.map((anchorItem) => (
          <AnchorItem
            key={anchorItem.id}
            onClick={onClick}
            item={anchorItem}
          />
        ))}
      </div>
    );
  },
);

export default Anchor;
