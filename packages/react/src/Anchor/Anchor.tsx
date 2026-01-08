import { Children, forwardRef, isValidElement, ReactNode } from 'react';
import { anchorClasses as classes } from '@mezzanine-ui/core/anchor';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import AnchorItem, { AnchorItemData } from './AnchorItem';

export interface AnchorPropsWithAnchors
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'children' | 'onClick'> {
  /**
   * Each item can have nested children for hierarchical navigation. <br />
   * ```tsx
   * <Anchor
   *   anchors={[
   *     {
   *       id: 'anchor-1',
   *       name: 'Anchor 1',
   *       href: '#anchor1',
   *     },
   *     {
   *       id: 'anchor-2',
   *       name: 'Anchor 2',
   *       href: '#anchor2',
   *       children: [
   *         {
   *           id: 'anchor2-1',
   *           name: 'Anchor 2-1',
   *           href: '#anchor2-1',
   *         },
   *         {
   *           id: 'anchor2-2',
   *           name: 'Anchor 2-2',
   *           href: '#anchor2-2',
   *         },
   *       ],
   *     },
   *   ]}
   * />
   * ```
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
   * Use nested `<Anchor>` components to create hierarchical navigation. <br />
   * ```tsx
   * <Anchor>
   *   <Anchor href="#acr1">ACR 1</Anchor>
   *   <Anchor href="#acr2">
   *     anchor 2
   *     <Anchor href="#acr2-1">ACR 2-1</Anchor>
   *     <Anchor href="#acr2-2">ACR 2-2</Anchor>
   *   </Anchor>
   * </Anchor>
   * ```
   */
  children: ReactNode;
  /**
   * Whether the anchor is disabled.<br>
   * If parent anchor is disabled, all its children will be disabled too. <br />
   */
  disabled?: boolean;
  /**
   * Required when used as child component.
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
 * The `mezzanine` Anchor component provides navigation menu for page sections.
 * It supports both data-driven (via `anchors` prop) and JSX-based (via `children`) approaches,
 * with automatic hash tracking and nested structure up to 3 levels deep.
 */
const Anchor = forwardRef<HTMLDivElement, AnchorProps>(
  function Anchor(props, ref) {
    const {
      className,
      ...rest
    } = props;

    const divProps = Object.keys(rest).reduce((acc, key) => {
      if (key !== 'anchors' && key !== 'children' && key !== 'disabled' && key !== 'href' && key !== 'onClick') {
        (acc as any)[key] = (rest as any)[key];
      }
      return acc;
    }, {} as Omit<typeof rest, 'anchors' | 'children' | 'disabled' | 'href' | 'onClick'>);

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
            item={anchorItem}
          />
        ))}
      </div>
    );
  },
);

export default Anchor;
