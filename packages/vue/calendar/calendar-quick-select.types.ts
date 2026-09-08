export interface CalendarQuickSelectOption {
  /** Disables the option's button. */
  disabled?: boolean;
  /** Identifies the option; matched against `activeId`. */
  id: string;
  /** The option's label. */
  name: string;
  /** Click handler for the option's button. */
  onClick: () => void;
}

export interface CalendarQuickSelectProps {
  /**
   * The id of active quick select button.
   */
  activeId?: string;
  /**
   * The options for quick select buttons.
   */
  options: CalendarQuickSelectOption[];
}
