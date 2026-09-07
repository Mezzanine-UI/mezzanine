export interface NavigationHeaderProps {
  /**
   * Accessible name for the collapse/expand toggle.
   * The toggle renders only an icon, so this is the only thing a screen reader
   * can announce for it — translate it along with the rest of your interface.
   * @default 'Toggle navigation'
   */
  collapseToggleLabel?: string;
  /**
   * The title text displayed in the header.
   */
  title: string;
}
