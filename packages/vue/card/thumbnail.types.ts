import type { Component } from 'vue';

/**
 * What a thumbnail may be rendered as. React's list, with Vue's `Component`
 * standing in for `JSXElementConstructor`.
 */
export type ThumbnailComponent = 'a' | 'button' | 'div' | Component;

export interface ThumbnailProps {
  /**
   * Title text shown on hover overlay
   */
  title?: string;
}
