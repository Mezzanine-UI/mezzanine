'use client';

import { forwardRef, ReactElement } from 'react';
import { anchorClasses as classes } from '@mezzanine-ui/core/anchor';
import Anchor from './Anchor';
import { AnchorItemData } from './AnchorItem';
import type { AnchorPropsWithAnchors, AnchorPropsWithChildren } from './Anchor';
import { cx } from '../utils/cx';
import { parseChildren } from './utils';

type AnchorElement = ReactElement<AnchorPropsWithChildren, typeof Anchor>;
type AnchorChildren = AnchorElement | AnchorElement[];

export type AnchorGroupPropsWithAnchors = AnchorPropsWithAnchors;

export interface AnchorGroupPropsWithChildren {
  anchors?: never;
  children: AnchorChildren;
}

type AnchorGroupBaseProps = AnchorGroupPropsWithAnchors | AnchorGroupPropsWithChildren;

export type AnchorGroupProps = AnchorGroupBaseProps & {
  className?: string;
};

/**
 * The `mezzanine` AnchorGroup component renders a group of anchor links,
 * configured via an `anchors` prop or parsed from `Anchor` child components.
 *
 * ```tsx
 * <AnchorGroup>
 *   <Anchor href="#section1">Section 1</Anchor>
 *   <Anchor href="#section2">Section 2</Anchor>
 * </AnchorGroup>
 * ```
 *
 * ```tsx
 * <AnchorGroup anchors={[
 *   { id: 'section1', name: 'Section 1', href: '#section1' },
 *   { id: 'section2', name: 'Section 2', href: '#section2' }
 * ]} />
 * ```
 */

const AnchorGroup = forwardRef<HTMLDivElement, AnchorGroupProps>(
  function AnchorGroup(props, ref) {
    const { className } = props;

    const anchorItems: AnchorItemData[] =
      'anchors' in props && props.anchors
        ? props.anchors
        : 'children' in props && props.children
          ? parseChildren(props.children, Anchor)
          : [];

    return (
      <div ref={ref} className={cx(classes.host, className)}>
        <Anchor anchors={anchorItems} />
      </div>
    );
  });

export default AnchorGroup;
