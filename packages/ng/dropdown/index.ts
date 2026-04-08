// Phase 5: public API aligned to React's Dropdown index.ts — only the
// top-level MznDropdown is exposed. Sub-components (MznDropdownAction,
// MznDropdownItem, MznDropdownItemCard, MznDropdownStatus) remain internal
// building blocks used inside this package only.
export { MznDropdown, type DropdownActionConfig } from './dropdown.component';
