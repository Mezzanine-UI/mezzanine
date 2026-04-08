// Phase 5: public API aligned to React's Navigation index.ts. Internal DI
// tokens (MZN_NAVIGATION_ACTIVATED, MZN_NAVIGATION_OPTION_LEVEL) and their
// value interfaces (NavigationActivatedState, NavigationOptionLevel) are
// Angular-only plumbing — React uses hidden Context for the same job.
// The declarative items-input config types (NavigationCategoryConfig,
// NavigationItemConfig, NavigationOptionConfig) are NG-only convenience
// shapes without a React counterpart and also stay internal.
export { MznNavigation } from './navigation.component';
export { MznNavigationFooter } from './navigation-footer.component';
export { MznNavigationHeader } from './navigation-header.component';
export { MznNavigationIconButton } from './navigation-icon-button.component';
export { MznNavigationOption } from './navigation-option.component';
export { MznNavigationOptionCategory } from './navigation-option-category.component';
export { MznNavigationUserMenu } from './navigation-user-menu.component';
