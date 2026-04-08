# Angular Attribute-Selector Refactor — Progress

_Auto-updated per batch. See `tools/parity/REFACTOR.md` for batch history and
per-batch commit hashes. This file is deleted when every component is done._

## Overall

| Metric             | Count | Percent |
| ------------------ | ----- | ------- |
| Attribute selector | 137   | 82%     |
| Element selector   | 31    | 18%     |
| **Total**          | 168   | 100%    |

Legend: ✅ done · ⬜ pending · 🚫 blocked

## By family

### Foundation / primitives

| Comp         | Status | Batch        |
| ------------ | ------ | ------------ |
| button       | ✅     | pre-existing |
| button-group | ✅     | P2-3         |
| icon         | ✅     | pre-existing |
| typography   | ✅     | pre-existing |
| separator    | ✅     | batch 1      |
| tooltip      | ✅     | pre-existing |
| portal       | ✅     | P2-2         |
| popper       | ✅     | P2-2         |
| backdrop     | ✅     | P2-2         |
| scrollbar    | ✅     | P2-2         |

### Layout

| Comp                      | Status | Batch |
| ------------------------- | ------ | ----- |
| layout                    | ✅     | 3     |
| layout-left-panel         | ✅     | P2-9  |
| layout-main               | ✅     | P2-9  |
| layout-right-panel        | ✅     | P2-9  |
| section                   | ✅     | P2-2  |
| section-group             | ✅     | P2-2  |
| page-header               | ✅     | P2-9  |
| page-footer               | ✅     | P2-9  |
| content-header            | ✅     | P2-2  |
| content-header-responsive | ✅     | P2-9  |

### Feedback / overlay

| Comp                        | Status | Batch                    |
| --------------------------- | ------ | ------------------------ |
| empty                       | ✅     | 2                        |
| alert-banner                | ✅     | P2-1                     |
| inline-message              | ✅     | P2-1                     |
| inline-message-group        | ✅     | P2-1                     |
| progress                    | ✅     | P2-1                     |
| spin                        | ✅     | P2-1                     |
| skeleton                    | ✅     | P2-1                     |
| result-state                | ✅     | P2-1                     |
| message                     | ✅     | P2-3                     |
| drawer                      | ✅     | P2-3                     |
| popconfirm                  | ✅     | P2-3                     |
| modal                       | ✅     | P2-4                     |
| modal-header                | ✅     | P2-4                     |
| modal-footer                | ✅     | P2-4                     |
| modal-body-for-verification | ✅     | P2-4                     |
| modal-body-container        | ✅     | pre-existing (directive) |
| media-preview-modal         | ✅     | P2-4                     |
| notification-center         | ✅     | P2-4                     |
| notifier (service-only)     | n/a    | —                        |
| floating-button             | ✅     | pre-existing             |
| cropper                     | ✅     | P2-12                    |

### Data entry — form atomics

| Comp                            | Status | Batch        |
| ------------------------------- | ------ | ------------ |
| input                           | ✅     | P2-5         |
| text-field                      | ✅     | P2-5         |
| textarea                        | ✅     | P2-5         |
| formatted-input                 | ✅     | P2-5         |
| autocomplete                    | ✅     | P2-5         |
| autocomplete-prefix             | ✅     | pre-existing |
| slider                          | ✅     | P2-5         |
| password-strength-indicator     | ✅     | P2-5         |
| checkbox                        | ✅     | P2-3         |
| checkbox-group                  | ✅     | P2-3         |
| check-all                       | ✅     | P2-3         |
| radio                           | ✅     | P2-3         |
| radio-group                     | ✅     | P2-3         |
| toggle                          | ✅     | P2-3         |
| input-action-button             | ✅     | P2-6         |
| input-select-button             | ✅     | P2-6         |
| input-spinner-button            | ✅     | P2-6         |
| input-check (internal)          | ✅     | P2-6         |
| input-trigger-popper (internal) | ✅     | P2-6         |

### Form structural

| Comp           | Status | Batch |
| -------------- | ------ | ----- |
| form-group     | ✅     | 3     |
| form-field     | ✅     | P2-9  |
| form-label     | ✅     | P2-9  |
| form-hint-text | ✅     | P2-9  |

### Dropdown family

| Comp               | Status | Batch |
| ------------------ | ------ | ----- |
| dropdown           | ✅     | P2-7  |
| dropdown-item      | ✅     | P2-7  |
| dropdown-item-card | ✅     | P2-7  |
| dropdown-action    | ✅     | P2-7  |
| dropdown-status    | ✅     | 3     |

### Select family

| Comp                | Status | Batch |
| ------------------- | ------ | ----- |
| select              | ✅     | P2-6  |
| select-trigger      | ✅     | P2-6  |
| select-trigger-tags | ✅     | P2-6  |

### Pagination

| Comp                 | Status | Batch |
| -------------------- | ------ | ----- |
| pagination           | ✅     | P2-7  |
| pagination-item      | ✅     | P2-7  |
| pagination-jumper    | ✅     | P2-7  |
| pagination-page-size | ✅     | P2-7  |

### Navigation family

| Comp                       | Status | Batch |
| -------------------------- | ------ | ----- |
| navigation                 | ✅     | P2-8  |
| navigation-header          | ✅     | P2-8  |
| navigation-footer          | ✅     | P2-8  |
| navigation-icon-button     | ✅     | P2-8  |
| navigation-option          | ✅     | P2-8  |
| navigation-option-category | ✅     | P2-8  |
| navigation-user-menu       | ✅     | P2-8  |

### Anchor / Breadcrumb

| Comp            | Status | Batch |
| --------------- | ------ | ----- |
| anchor-group    | ✅     | 3     |
| anchor-item     | ✅     | P2-9  |
| breadcrumb      | ✅     | P2-9  |
| breadcrumb-item | ✅     | P2-9  |

### Tab / Stepper / Accordion

| Comp              | Status | Batch |
| ----------------- | ------ | ----- |
| tabs              | ✅     | P2-10 |
| tab-item          | ✅     | P2-10 |
| stepper           | ✅     | P2-10 |
| step              | ✅     | P2-10 |
| accordion         | ✅     | P2-10 |
| accordion-title   | ✅     | P2-10 |
| accordion-content | ✅     | P2-10 |
| accordion-actions | ✅     | P2-10 |
| accordion-group   | ✅     | P2-10 |

### Description family

| Comp                | Status | Batch |
| ------------------- | ------ | ----- |
| description         | ✅     | P2-10 |
| description-title   | ✅     | P2-10 |
| description-content | ✅     | P2-10 |
| description-group   | ✅     | P2-10 |

### Filter

| Comp        | Status | Batch |
| ----------- | ------ | ----- |
| filter-area | ✅     | P2-10 |
| filter-line | ✅     | P2-10 |
| filter      | ✅     | P2-10 |

### Data display — tags / badges

| Comp                 | Status | Batch |
| -------------------- | ------ | ----- |
| tag                  | ✅     | P2-1  |
| tag-group            | ✅     | P2-3  |
| badge                | ✅     | P2-2  |
| badge-container      | ✅     | P2-2  |
| overflow-tooltip     | ✅     | P2-4  |
| overflow-counter-tag | ✅     | P2-4  |
| clear-actions        | ✅     | P2-2  |

### Card family

| Comp                           | Status | Batch |
| ------------------------------ | ------ | ----- |
| base-card                      | ✅     | P2-11 |
| base-card-skeleton             | ✅     | P2-11 |
| card-group                     | ✅     | P2-11 |
| selection-card                 | ✅     | P2-11 |
| single-thumbnail-card          | ✅     | P2-11 |
| single-thumbnail-card-skeleton | ✅     | P2-11 |
| four-thumbnail-card            | ✅     | P2-11 |
| four-thumbnail-card-skeleton   | ✅     | P2-11 |
| quick-action-card              | ✅     | P2-11 |
| quick-action-card-skeleton     | ✅     | P2-11 |
| thumbnail                      | ✅     | P2-11 |
| thumbnail-card-info            | ✅     | P2-11 |

### Cascader

| Comp           | Status | Batch |
| -------------- | ------ | ----- |
| cascader       | ✅     | P2-12 |
| cascader-panel | ✅     | P2-12 |

### Table

| Comp  | Status | Batch |
| ----- | ------ | ----- |
| table | ✅     | P2-12 |

### Upload family

| Comp                | Status | Batch |
| ------------------- | ------ | ----- |
| upload              | ✅     | P2-12 |
| uploader            | ✅     | P2-12 |
| upload-item         | ✅     | P2-12 |
| upload-picture-card | ✅     | P2-12 |

### Calendar family (largest)

| Comp                     | Status | Batch |
| ------------------------ | ------ | ----- |
| calendar                 | ⬜     |       |
| range-calendar           | ⬜     |       |
| calendar-cell            | ⬜     |       |
| calendar-config-provider | ⬜     |       |
| calendar-controls        | ⬜     |       |
| calendar-day-of-week     | ⬜     |       |
| calendar-days            | ⬜     |       |
| calendar-weeks           | ⬜     |       |
| calendar-months          | ⬜     |       |
| calendar-quarters        | ⬜     |       |
| calendar-half-years      | ⬜     |       |
| calendar-years           | ⬜     |       |
| calendar-quick-select    | ⬜     |       |
| calendar-footer-actions  | ⬜     |       |
| calendar-footer-control  | ⬜     |       |

### Date / Time picker family

| Comp                          | Status | Batch |
| ----------------------------- | ------ | ----- |
| date-picker                   | ⬜     |       |
| date-picker-calendar          | ⬜     |       |
| date-range-picker             | ⬜     |       |
| date-range-picker-calendar    | ⬜     |       |
| date-time-picker              | ⬜     |       |
| date-time-range-picker        | ⬜     |       |
| multiple-date-picker          | ⬜     |       |
| multiple-date-picker-trigger  | ⬜     |       |
| time-picker                   | ⬜     |       |
| time-picker-panel             | ⬜     |       |
| time-range-picker             | ⬜     |       |
| time-panel                    | ⬜     |       |
| time-panel-column             | ⬜     |       |
| picker-trigger                | ⬜     |       |
| picker-trigger-with-separator | ⬜     |       |
| range-picker-trigger          | ⬜     |       |

### Empty sub-icons

| Comp                         | Status | Batch |
| ---------------------------- | ------ | ----- |
| empty-main-initial-data-icon | ✅     | P2-12 |
| empty-main-notification-icon | ✅     | P2-12 |
| empty-main-result-icon       | ✅     | P2-12 |
| empty-main-system-icon       | ✅     | P2-12 |

### Transition directives

| Comp      | Status | Batch        |
| --------- | ------ | ------------ |
| rotate    | ✅     | pre-existing |
| fade      | ✅     | P2-12        |
| scale     | ✅     | P2-12        |
| slide     | ✅     | P2-12        |
| translate | ✅     | P2-12        |
| collapse  | ✅     | P2-12        |
