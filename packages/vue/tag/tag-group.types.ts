/**
 * How a tag entering or leaving the group is animated.
 * - `'fade'` — the tag fades in and out.
 * - `'none'` — the tag appears and disappears immediately.
 */
export type TagGroupTransition = 'fade' | 'none';

export interface TagGroupProps {
  /**
   * The transition played when a tag joins or leaves the group.
   * @default 'none'
   */
  transition?: TagGroupTransition;
}
