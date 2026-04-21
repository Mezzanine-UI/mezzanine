// Phase 5: public API aligned to React's FilterArea index.ts.
// MZN_FILTER_AREA_CONTEXT / FilterAreaContextValue are Angular-only DI
// wiring (React uses hidden Context) and stay unexported.
export { MznFilterArea } from './filter-area.component';
export { MznFilter } from './filter.component';
export { MznFilterLine } from './filter-line.component';
export type {
  FilterAlign,
  FilterAreaActionsAlign,
  FilterAreaRowAlign,
  FilterAreaSize,
  FilterSpan,
} from '@mezzanine-ui/core/filter-area';
