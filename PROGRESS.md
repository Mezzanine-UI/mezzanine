# Angular Attribute-Selector Refactor — Progress

_Auto-updated per batch. See `tools/parity/REFACTOR.md` for batch history and
per-batch commit hashes. This file is deleted when every component is done._

## Overall

| Metric             | Count | Percent |
| ------------------ | ----- | ------- |
| Attribute selector | 65    | 39%     |
| Element selector   | 103   | 61%     |
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
| layout-left-panel         | ⬜     |       |
| layout-main               | ⬜     |       |
| layout-right-panel        | ⬜     |       |
| section                   | ✅     | P2-2  |
| section-group             | ✅     | P2-2  |
| page-header               | ⬜     |       |
| page-footer               | ⬜     |       |
| content-header            | ✅     | P2-2  |
| content-header-responsive | ⬜     |       |

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
| cropper                     | ⬜     |                          |

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
| form-field     | ⬜     |       |
| form-label     | ⬜     |       |
| form-hint-text | ⬜     |       |

### Dropdown family

| Comp               | Status | Batch |
| ------------------ | ------ | ----- |
| dropdown           | ⬜     |       |
| dropdown-item      | ⬜     |       |
| dropdown-item-card | ⬜     |       |
| dropdown-action    | ⬜     |       |
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
| pagination           | ⬜     |       |
| pagination-item      | ⬜     |       |
| pagination-jumper    | ⬜     |       |
| pagination-page-size | ⬜     |       |

### Navigation family

| Comp                       | Status | Batch |
| -------------------------- | ------ | ----- |
| navigation                 | ⬜     |       |
| navigation-header          | ⬜     |       |
| navigation-footer          | ⬜     |       |
| navigation-icon-button     | ⬜     |       |
| navigation-option          | ⬜     |       |
| navigation-option-category | ⬜     |       |
| navigation-user-menu       | ⬜     |       |

### Anchor / Breadcrumb

| Comp            | Status | Batch |
| --------------- | ------ | ----- |
| anchor-group    | ✅     | 3     |
| anchor-item     | ⬜     |       |
| breadcrumb      | ⬜     |       |
| breadcrumb-item | ⬜     |       |

### Tab / Stepper / Accordion

| Comp              | Status | Batch |
| ----------------- | ------ | ----- |
| tabs              | ⬜     |       |
| tab-item          | ⬜     |       |
| stepper           | ⬜     |       |
| step              | ⬜     |       |
| accordion         | ⬜     |       |
| accordion-title   | ⬜     |       |
| accordion-content | ⬜     |       |
| accordion-actions | ⬜     |       |
| accordion-group   | ⬜     |       |

### Description family

| Comp                | Status | Batch |
| ------------------- | ------ | ----- |
| description         | ⬜     |       |
| description-title   | ⬜     |       |
| description-content | ⬜     |       |
| description-group   | ⬜     |       |

### Filter

| Comp        | Status | Batch |
| ----------- | ------ | ----- |
| filter-area | ⬜     |       |
| filter-line | ⬜     |       |
| filter      | ⬜     |       |

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
| base-card                      | ⬜     |       |
| base-card-skeleton             | ⬜     |       |
| card-group                     | ⬜     |       |
| selection-card                 | ⬜     |       |
| single-thumbnail-card          | ⬜     |       |
| single-thumbnail-card-skeleton | ⬜     |       |
| four-thumbnail-card            | ⬜     |       |
| four-thumbnail-card-skeleton   | ⬜     |       |
| quick-action-card              | ⬜     |       |
| quick-action-card-skeleton     | ⬜     |       |
| thumbnail                      | ⬜     |       |
| thumbnail-card-info            | ⬜     |       |

### Cascader

| Comp           | Status | Batch |
| -------------- | ------ | ----- |
| cascader       | ⬜     |       |
| cascader-panel | ⬜     |       |

### Table

| Comp  | Status | Batch |
| ----- | ------ | ----- |
| table | ⬜     |       |

### Upload family

| Comp                | Status | Batch |
| ------------------- | ------ | ----- |
| upload              | ⬜     |       |
| uploader            | ⬜     |       |
| upload-item         | ⬜     |       |
| upload-picture-card | ⬜     |       |

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
| empty-main-initial-data-icon | ⬜     |       |
| empty-main-notification-icon | ⬜     |       |
| empty-main-result-icon       | ⬜     |       |
| empty-main-system-icon       | ⬜     |       |

### Transition directives

| Comp      | Status | Batch        |
| --------- | ------ | ------------ |
| rotate    | ✅     | pre-existing |
| fade      | ⬜     |              |
| scale     | ⬜     |              |
| slide     | ⬜     |              |
| translate | ⬜     |              |
| collapse  | ⬜     |              |
