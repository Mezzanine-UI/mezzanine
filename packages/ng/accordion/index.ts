// Phase 5: public API aligned to React's Accordion index.ts.
// Internal DI tokens (MZN_ACCORDION_CONTROL, MZN_ACCORDION_GROUP) and their
// Angular-only types (AccordionControl, AccordionGroupControl) stay inside
// the package — React manages the equivalent state via hidden Context.
export { MznAccordion } from './accordion.component';
export { MznAccordionActions } from './accordion-actions.component';
export { MznAccordionContent } from './accordion-content.component';
export { MznAccordionGroup } from './accordion-group.component';
export { MznAccordionTitle } from './accordion-title.component';
