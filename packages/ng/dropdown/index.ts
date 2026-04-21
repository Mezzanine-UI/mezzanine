// Phase 5: public API aligned to React's Dropdown index.ts — only the
// top-level MznDropdown is exposed. Sub-components (MznDropdownAction,
// MznDropdownItem, MznDropdownStatus) remain internal
// building blocks used inside this package only.
export { MznDropdown, type DropdownActionConfig } from './dropdown.component';
// MznDropdownItemCard is re-exported so MznSelect can render listbox
// items with the same structure as React (which composes Dropdown → DropdownItemCard).
export { MznDropdownItemCard } from './dropdown-item-card.component';
