'use client';

import { ReactElement, Ref } from 'react';
import { anchorClasses as classes } from '@mezzanine-ui/core/anchor';
import Anchor from './Anchor';
import { AnchorItemData } from './AnchorItem';
import type { AnchorProps, AnchorPropsWithChildren } from './Anchor';
import { cx } from '../utils/cx';
import { parseChildren } from './utils';

type AnchorElement = ReactElement<AnchorPropsWithChildren>;
type OnlyAnchorChildren = AnchorElement | AnchorElement[];

export interface AnchorGroupPropsWithAnchors {
  anchors: AnchorProps['anchors'];
  children?: never;
}

export interface AnchorGroupPropsWithChildren {
  anchors?: never;
  children: OnlyAnchorChildren;
}

type AnchorGroupBaseProps = AnchorGroupPropsWithAnchors | AnchorGroupPropsWithChildren;

export type AnchorGroupProps = AnchorGroupBaseProps & {
  className?: string;
  ref?: Ref<HTMLDivElement>;
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

function AnchorGroup(props: AnchorGroupProps) {
  const { ref, className } = props;

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
}

export default AnchorGroup;
