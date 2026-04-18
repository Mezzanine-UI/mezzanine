// Public API aligned to React's Modal index.ts. `MznModalBodyContainer` is an
// Angular-only helper (React's Modal auto-wraps its children in the scroll-aware
// body container; Angular uses ng-content so consumers must explicitly apply
// this directive to get the same scroll-triggered separator behaviour). The
// `MZN_MODAL_CONTEXT` / `ModalContextValue` DI wiring stays inside the package.
export { MznModal } from './modal.component';
export { MznModalBodyContainer } from './modal-body-container.directive';
export { MznModalBodyForVerification } from './modal-body-for-verification.component';
export { MznModalFooter } from './modal-footer.component';
export { MznModalHeader } from './modal-header.component';
