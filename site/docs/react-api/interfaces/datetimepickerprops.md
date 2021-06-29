[@mezzanine-ui/react - v0.5.2](../README.md) / [Exports](../modules.md) / DateTimePickerProps

# Interface: DateTimePickerProps

## Hierarchy

- `Omit`<[`DateTimePickerPanelProps`](datetimepickerpanelprops.md), ``"onConfirm"`` \| ``"referenceDate"``\>

- `Omit`<[`PickerTriggerProps`](pickertriggerprops.md), ``"anchor"`` \| ``"defaultValue"`` \| ``"inputRef"`` \| ``"onChange"`` \| ``"onClear"`` \| ``"onClick"`` \| ``"onIconClick"`` \| ``"onKeyDown"`` \| ``"open"`` \| ``"suffixActionIcon"`` \| ``"value"``\>

  ↳ **`DateTimePickerProps`**

## Table of contents

### Properties

- [anchor](datetimepickerprops.md#anchor)
- [calendarProps](datetimepickerprops.md#calendarprops)
- [clearable](datetimepickerprops.md#clearable)
- [confirmText](datetimepickerprops.md#confirmtext)
- [defaultValue](datetimepickerprops.md#defaultvalue)
- [disableOnNext](datetimepickerprops.md#disableonnext)
- [disableOnPrev](datetimepickerprops.md#disableonprev)
- [disabled](datetimepickerprops.md#disabled)
- [displayMonthLocale](datetimepickerprops.md#displaymonthlocale)
- [error](datetimepickerprops.md#error)
- [fadeProps](datetimepickerprops.md#fadeprops)
- [format](datetimepickerprops.md#format)
- [fullWidth](datetimepickerprops.md#fullwidth)
- [hideHour](datetimepickerprops.md#hidehour)
- [hideMinute](datetimepickerprops.md#hideminute)
- [hideSecond](datetimepickerprops.md#hidesecond)
- [hourPrefix](datetimepickerprops.md#hourprefix)
- [hourStep](datetimepickerprops.md#hourstep)
- [inputProps](datetimepickerprops.md#inputprops)
- [isDateDisabled](datetimepickerprops.md#isdatedisabled)
- [isMonthDisabled](datetimepickerprops.md#ismonthdisabled)
- [isYearDisabled](datetimepickerprops.md#isyeardisabled)
- [minutePrefix](datetimepickerprops.md#minuteprefix)
- [minuteStep](datetimepickerprops.md#minutestep)
- [onChange](datetimepickerprops.md#onchange)
- [onPanelToggle](datetimepickerprops.md#onpaneltoggle)
- [open](datetimepickerprops.md#open)
- [placeholder](datetimepickerprops.md#placeholder)
- [popperProps](datetimepickerprops.md#popperprops)
- [prefix](datetimepickerprops.md#prefix)
- [readOnly](datetimepickerprops.md#readonly)
- [referenceDate](datetimepickerprops.md#referencedate)
- [required](datetimepickerprops.md#required)
- [secondPrefix](datetimepickerprops.md#secondprefix)
- [secondStep](datetimepickerprops.md#secondstep)
- [size](datetimepickerprops.md#size)
- [value](datetimepickerprops.md#value)

## Properties

### anchor

• `Optional` **anchor**: ``null`` \| `HTMLElement` \| () => `HTMLElement` \| `RefObject`<``null`` \| `HTMLElement`\>

The ref of trigger Element.

#### Inherited from

Omit.anchor

#### Defined in

[packages/react/src/Popper/Popper.tsx:29](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/Popper/Popper.tsx#L29)

___

### calendarProps

• `Optional` **calendarProps**: `Pick`<[`CalendarProps`](calendarprops.md), ``"slot"`` \| ``"style"`` \| ``"title"`` \| ``"color"`` \| ``"prefix"`` \| ``"defaultChecked"`` \| ``"defaultValue"`` \| ``"suppressContentEditableWarning"`` \| ``"suppressHydrationWarning"`` \| ``"accessKey"`` \| ``"className"`` \| ``"contentEditable"`` \| ``"contextMenu"`` \| ``"dir"`` \| ``"draggable"`` \| ``"hidden"`` \| ``"id"`` \| ``"lang"`` \| ``"placeholder"`` \| ``"spellCheck"`` \| ``"tabIndex"`` \| ``"translate"`` \| ``"radioGroup"`` \| ``"role"`` \| ``"about"`` \| ``"datatype"`` \| ``"inlist"`` \| ``"property"`` \| ``"resource"`` \| ``"typeof"`` \| ``"vocab"`` \| ``"autoCapitalize"`` \| ``"autoCorrect"`` \| ``"autoSave"`` \| ``"itemProp"`` \| ``"itemScope"`` \| ``"itemType"`` \| ``"itemID"`` \| ``"itemRef"`` \| ``"results"`` \| ``"security"`` \| ``"unselectable"`` \| ``"inputMode"`` \| ``"is"`` \| ``"aria-activedescendant"`` \| ``"aria-atomic"`` \| ``"aria-autocomplete"`` \| ``"aria-busy"`` \| ``"aria-checked"`` \| ``"aria-colcount"`` \| ``"aria-colindex"`` \| ``"aria-colspan"`` \| ``"aria-controls"`` \| ``"aria-current"`` \| ``"aria-describedby"`` \| ``"aria-details"`` \| ``"aria-disabled"`` \| ``"aria-dropeffect"`` \| ``"aria-errormessage"`` \| ``"aria-expanded"`` \| ``"aria-flowto"`` \| ``"aria-grabbed"`` \| ``"aria-haspopup"`` \| ``"aria-hidden"`` \| ``"aria-invalid"`` \| ``"aria-keyshortcuts"`` \| ``"aria-label"`` \| ``"aria-labelledby"`` \| ``"aria-level"`` \| ``"aria-live"`` \| ``"aria-modal"`` \| ``"aria-multiline"`` \| ``"aria-multiselectable"`` \| ``"aria-orientation"`` \| ``"aria-owns"`` \| ``"aria-placeholder"`` \| ``"aria-posinset"`` \| ``"aria-pressed"`` \| ``"aria-readonly"`` \| ``"aria-relevant"`` \| ``"aria-required"`` \| ``"aria-roledescription"`` \| ``"aria-rowcount"`` \| ``"aria-rowindex"`` \| ``"aria-rowspan"`` \| ``"aria-selected"`` \| ``"aria-setsize"`` \| ``"aria-sort"`` \| ``"aria-valuemax"`` \| ``"aria-valuemin"`` \| ``"aria-valuenow"`` \| ``"aria-valuetext"`` \| ``"dangerouslySetInnerHTML"`` \| ``"onCopy"`` \| ``"onCopyCapture"`` \| ``"onCut"`` \| ``"onCutCapture"`` \| ``"onPaste"`` \| ``"onPasteCapture"`` \| ``"onCompositionEnd"`` \| ``"onCompositionEndCapture"`` \| ``"onCompositionStart"`` \| ``"onCompositionStartCapture"`` \| ``"onCompositionUpdate"`` \| ``"onCompositionUpdateCapture"`` \| ``"onFocus"`` \| ``"onFocusCapture"`` \| ``"onBlur"`` \| ``"onBlurCapture"`` \| ``"onChangeCapture"`` \| ``"onBeforeInput"`` \| ``"onBeforeInputCapture"`` \| ``"onInput"`` \| ``"onInputCapture"`` \| ``"onReset"`` \| ``"onResetCapture"`` \| ``"onSubmit"`` \| ``"onSubmitCapture"`` \| ``"onInvalid"`` \| ``"onInvalidCapture"`` \| ``"onLoad"`` \| ``"onLoadCapture"`` \| ``"onError"`` \| ``"onErrorCapture"`` \| ``"onKeyDown"`` \| ``"onKeyDownCapture"`` \| ``"onKeyPress"`` \| ``"onKeyPressCapture"`` \| ``"onKeyUp"`` \| ``"onKeyUpCapture"`` \| ``"onAbort"`` \| ``"onAbortCapture"`` \| ``"onCanPlay"`` \| ``"onCanPlayCapture"`` \| ``"onCanPlayThrough"`` \| ``"onCanPlayThroughCapture"`` \| ``"onDurationChange"`` \| ``"onDurationChangeCapture"`` \| ``"onEmptied"`` \| ``"onEmptiedCapture"`` \| ``"onEncrypted"`` \| ``"onEncryptedCapture"`` \| ``"onEnded"`` \| ``"onEndedCapture"`` \| ``"onLoadedData"`` \| ``"onLoadedDataCapture"`` \| ``"onLoadedMetadata"`` \| ``"onLoadedMetadataCapture"`` \| ``"onLoadStart"`` \| ``"onLoadStartCapture"`` \| ``"onPause"`` \| ``"onPauseCapture"`` \| ``"onPlay"`` \| ``"onPlayCapture"`` \| ``"onPlaying"`` \| ``"onPlayingCapture"`` \| ``"onProgress"`` \| ``"onProgressCapture"`` \| ``"onRateChange"`` \| ``"onRateChangeCapture"`` \| ``"onSeeked"`` \| ``"onSeekedCapture"`` \| ``"onSeeking"`` \| ``"onSeekingCapture"`` \| ``"onStalled"`` \| ``"onStalledCapture"`` \| ``"onSuspend"`` \| ``"onSuspendCapture"`` \| ``"onTimeUpdate"`` \| ``"onTimeUpdateCapture"`` \| ``"onVolumeChange"`` \| ``"onVolumeChangeCapture"`` \| ``"onWaiting"`` \| ``"onWaitingCapture"`` \| ``"onAuxClick"`` \| ``"onAuxClickCapture"`` \| ``"onClick"`` \| ``"onClickCapture"`` \| ``"onContextMenu"`` \| ``"onContextMenuCapture"`` \| ``"onDoubleClick"`` \| ``"onDoubleClickCapture"`` \| ``"onDrag"`` \| ``"onDragCapture"`` \| ``"onDragEnd"`` \| ``"onDragEndCapture"`` \| ``"onDragEnter"`` \| ``"onDragEnterCapture"`` \| ``"onDragExit"`` \| ``"onDragExitCapture"`` \| ``"onDragLeave"`` \| ``"onDragLeaveCapture"`` \| ``"onDragOver"`` \| ``"onDragOverCapture"`` \| ``"onDragStart"`` \| ``"onDragStartCapture"`` \| ``"onDrop"`` \| ``"onDropCapture"`` \| ``"onMouseDown"`` \| ``"onMouseDownCapture"`` \| ``"onMouseEnter"`` \| ``"onMouseLeave"`` \| ``"onMouseMove"`` \| ``"onMouseMoveCapture"`` \| ``"onMouseOut"`` \| ``"onMouseOutCapture"`` \| ``"onMouseOver"`` \| ``"onMouseOverCapture"`` \| ``"onMouseUp"`` \| ``"onMouseUpCapture"`` \| ``"onSelect"`` \| ``"onSelectCapture"`` \| ``"onTouchCancel"`` \| ``"onTouchCancelCapture"`` \| ``"onTouchEnd"`` \| ``"onTouchEndCapture"`` \| ``"onTouchMove"`` \| ``"onTouchMoveCapture"`` \| ``"onTouchStart"`` \| ``"onTouchStartCapture"`` \| ``"onPointerDown"`` \| ``"onPointerDownCapture"`` \| ``"onPointerMove"`` \| ``"onPointerMoveCapture"`` \| ``"onPointerUp"`` \| ``"onPointerUpCapture"`` \| ``"onPointerCancel"`` \| ``"onPointerCancelCapture"`` \| ``"onPointerEnter"`` \| ``"onPointerEnterCapture"`` \| ``"onPointerLeave"`` \| ``"onPointerLeaveCapture"`` \| ``"onPointerOver"`` \| ``"onPointerOverCapture"`` \| ``"onPointerOut"`` \| ``"onPointerOutCapture"`` \| ``"onGotPointerCapture"`` \| ``"onGotPointerCaptureCapture"`` \| ``"onLostPointerCapture"`` \| ``"onLostPointerCaptureCapture"`` \| ``"onScroll"`` \| ``"onScrollCapture"`` \| ``"onWheel"`` \| ``"onWheelCapture"`` \| ``"onAnimationStart"`` \| ``"onAnimationStartCapture"`` \| ``"onAnimationEnd"`` \| ``"onAnimationEndCapture"`` \| ``"onAnimationIteration"`` \| ``"onAnimationIterationCapture"`` \| ``"onTransitionEnd"`` \| ``"onTransitionEndCapture"`` \| ``"css"`` \| ``"isDateInRange"`` \| ``"onDateHover"`` \| ``"displayWeekDayLocale"`` \| ``"isMonthInRange"`` \| ``"onMonthHover"`` \| ``"isWeekDisabled"`` \| ``"isWeekInRange"`` \| ``"onWeekHover"`` \| ``"isYearInRange"`` \| ``"onYearHover"`` \| ``"calendarDaysProps"`` \| ``"calendarMonthsProps"`` \| ``"calendarWeeksProps"`` \| ``"calendarYearsProps"``\>

Other calendar props you may provide to `Calendar`.

#### Inherited from

Omit.calendarProps

#### Defined in

[packages/react/src/DateTimePicker/DateTimePickerPanel.tsx:37](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/DateTimePicker/DateTimePickerPanel.tsx#L37)

___

### clearable

• `Optional` **clearable**: `boolean`

Whether to show the clear button.

**`default`** false

#### Inherited from

Omit.clearable

#### Defined in

[packages/react/src/TextField/TextField.tsx:31](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/TextField/TextField.tsx#L31)

___

### confirmText

• `Optional` **confirmText**: `ReactNode`

Display name of the confirm button.

**`default`** 'OK'

#### Inherited from

Omit.confirmText

#### Defined in

[packages/react/src/TimePanel/TimePanelAction.tsx:14](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/TimePanel/TimePanelAction.tsx#L14)

___

### defaultValue

• `Optional` **defaultValue**: `Moment`

Default value for time picker.

#### Defined in

[packages/react/src/DateTimePicker/DateTimePicker.tsx:49](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/DateTimePicker/DateTimePicker.tsx#L49)

___

### disableOnNext

• `Optional` **disableOnNext**: `boolean`

Disable the next controller if true.

#### Inherited from

Omit.disableOnNext

#### Defined in

[packages/react/src/Calendar/CalendarControls.tsx:16](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/Calendar/CalendarControls.tsx#L16)

___

### disableOnPrev

• `Optional` **disableOnPrev**: `boolean`

Disable the prev controller if true.

#### Inherited from

Omit.disableOnPrev

#### Defined in

[packages/react/src/Calendar/CalendarControls.tsx:20](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/Calendar/CalendarControls.tsx#L20)

___

### disabled

• `Optional` **disabled**: `boolean`

Whether the field is disabled.

**`default`** false

#### Inherited from

Omit.disabled

#### Defined in

[packages/react/src/TextField/TextField.tsx:36](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/TextField/TextField.tsx#L36)

___

### displayMonthLocale

• `Optional` **displayMonthLocale**: `string`

The locale you want to use when rendering the names of month.
If none provided, it will use the `displayMonthLocale` from calendar context.

#### Inherited from

Omit.displayMonthLocale

#### Defined in

[packages/react/src/Calendar/CalendarMonths.tsx:17](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/Calendar/CalendarMonths.tsx#L17)

___

### error

• `Optional` **error**: `boolean`

Whether the field is error.

**`default`** false

#### Inherited from

Omit.error

#### Defined in

[packages/react/src/TextField/TextField.tsx:41](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/TextField/TextField.tsx#L41)

___

### fadeProps

• `Optional` **fadeProps**: `Pick`<`TransitionImplementationProps`, ``"appear"`` \| ``"duration"`` \| ``"keepMount"`` \| ``"lazyMount"`` \| ``"onEnter"`` \| ``"onEntering"`` \| ``"onEntered"`` \| ``"onExit"`` \| ``"onExiting"`` \| ``"onExited"`` \| ``"delay"`` \| ``"easing"``\>

Other fade props you may provide to `Fade`.

#### Inherited from

Omit.fadeProps

#### Defined in

[packages/react/src/_internal/InputTriggerPopper/InputTriggerPopper.tsx:12](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/_internal/InputTriggerPopper/InputTriggerPopper.tsx#L12)

___

### format

• `Optional` **format**: `string`

The format for displaying time.

#### Defined in

[packages/react/src/DateTimePicker/DateTimePicker.tsx:53](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/DateTimePicker/DateTimePicker.tsx#L53)

___

### fullWidth

• `Optional` **fullWidth**: `boolean`

If `true`, set width: 100%.

**`default`** false

#### Inherited from

Omit.fullWidth

#### Defined in

[packages/react/src/TextField/TextField.tsx:46](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/TextField/TextField.tsx#L46)

___

### hideHour

• `Optional` **hideHour**: `boolean`

Controls whether or not to hide hours column.

#### Inherited from

Omit.hideHour

#### Defined in

[packages/react/src/TimePanel/TimePanel.tsx:29](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/TimePanel/TimePanel.tsx#L29)

___

### hideMinute

• `Optional` **hideMinute**: `boolean`

Controls whether or not to hide minutes column.

#### Inherited from

Omit.hideMinute

#### Defined in

[packages/react/src/TimePanel/TimePanel.tsx:33](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/TimePanel/TimePanel.tsx#L33)

___

### hideSecond

• `Optional` **hideSecond**: `boolean`

Controls whether or not to hide seconds column.

#### Inherited from

Omit.hideSecond

#### Defined in

[packages/react/src/TimePanel/TimePanel.tsx:37](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/TimePanel/TimePanel.tsx#L37)

___

### hourPrefix

• `Optional` **hourPrefix**: `ReactNode`

The hours column prefix.

**`default`** 'Hrs''

#### Inherited from

Omit.hourPrefix

#### Defined in

[packages/react/src/TimePanel/TimePanel.tsx:42](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/TimePanel/TimePanel.tsx#L42)

___

### hourStep

• `Optional` **hourStep**: `number`

The steps of hour.

**`default`** 1

#### Inherited from

Omit.hourStep

#### Defined in

[packages/react/src/TimePanel/TimePanel.tsx:47](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/TimePanel/TimePanel.tsx#L47)

___

### inputProps

• `Optional` **inputProps**: `Pick`<`Pick`<`DetailedHTMLProps`<`InputHTMLAttributes`<`HTMLInputElement`\>, `HTMLInputElement`\>, ``"form"`` \| ``"slot"`` \| ``"style"`` \| ``"title"`` \| ``"pattern"`` \| ``"children"`` \| ``"color"`` \| ``"disabled"`` \| ``"prefix"`` \| ``"size"`` \| ``"autoFocus"`` \| ``"formAction"`` \| ``"formEncType"`` \| ``"formMethod"`` \| ``"formNoValidate"`` \| ``"formTarget"`` \| ``"name"`` \| ``"type"`` \| ``"value"`` \| ``"defaultChecked"`` \| ``"defaultValue"`` \| ``"suppressContentEditableWarning"`` \| ``"suppressHydrationWarning"`` \| ``"accessKey"`` \| ``"className"`` \| ``"contentEditable"`` \| ``"contextMenu"`` \| ``"dir"`` \| ``"draggable"`` \| ``"hidden"`` \| ``"id"`` \| ``"lang"`` \| ``"placeholder"`` \| ``"spellCheck"`` \| ``"tabIndex"`` \| ``"translate"`` \| ``"radioGroup"`` \| ``"role"`` \| ``"about"`` \| ``"datatype"`` \| ``"inlist"`` \| ``"property"`` \| ``"resource"`` \| ``"typeof"`` \| ``"vocab"`` \| ``"autoCapitalize"`` \| ``"autoCorrect"`` \| ``"autoSave"`` \| ``"itemProp"`` \| ``"itemScope"`` \| ``"itemType"`` \| ``"itemID"`` \| ``"itemRef"`` \| ``"results"`` \| ``"security"`` \| ``"unselectable"`` \| ``"inputMode"`` \| ``"is"`` \| ``"aria-activedescendant"`` \| ``"aria-atomic"`` \| ``"aria-autocomplete"`` \| ``"aria-busy"`` \| ``"aria-checked"`` \| ``"aria-colcount"`` \| ``"aria-colindex"`` \| ``"aria-colspan"`` \| ``"aria-controls"`` \| ``"aria-current"`` \| ``"aria-describedby"`` \| ``"aria-details"`` \| ``"aria-disabled"`` \| ``"aria-dropeffect"`` \| ``"aria-errormessage"`` \| ``"aria-expanded"`` \| ``"aria-flowto"`` \| ``"aria-grabbed"`` \| ``"aria-haspopup"`` \| ``"aria-hidden"`` \| ``"aria-invalid"`` \| ``"aria-keyshortcuts"`` \| ``"aria-label"`` \| ``"aria-labelledby"`` \| ``"aria-level"`` \| ``"aria-live"`` \| ``"aria-modal"`` \| ``"aria-multiline"`` \| ``"aria-multiselectable"`` \| ``"aria-orientation"`` \| ``"aria-owns"`` \| ``"aria-placeholder"`` \| ``"aria-posinset"`` \| ``"aria-pressed"`` \| ``"aria-readonly"`` \| ``"aria-relevant"`` \| ``"aria-required"`` \| ``"aria-roledescription"`` \| ``"aria-rowcount"`` \| ``"aria-rowindex"`` \| ``"aria-rowspan"`` \| ``"aria-selected"`` \| ``"aria-setsize"`` \| ``"aria-sort"`` \| ``"aria-valuemax"`` \| ``"aria-valuemin"`` \| ``"aria-valuenow"`` \| ``"aria-valuetext"`` \| ``"dangerouslySetInnerHTML"`` \| ``"onCopy"`` \| ``"onCopyCapture"`` \| ``"onCut"`` \| ``"onCutCapture"`` \| ``"onPaste"`` \| ``"onPasteCapture"`` \| ``"onCompositionEnd"`` \| ``"onCompositionEndCapture"`` \| ``"onCompositionStart"`` \| ``"onCompositionStartCapture"`` \| ``"onCompositionUpdate"`` \| ``"onCompositionUpdateCapture"`` \| ``"onFocus"`` \| ``"onFocusCapture"`` \| ``"onBlur"`` \| ``"onBlurCapture"`` \| ``"onChange"`` \| ``"onChangeCapture"`` \| ``"onBeforeInput"`` \| ``"onBeforeInputCapture"`` \| ``"onInput"`` \| ``"onInputCapture"`` \| ``"onReset"`` \| ``"onResetCapture"`` \| ``"onSubmit"`` \| ``"onSubmitCapture"`` \| ``"onInvalid"`` \| ``"onInvalidCapture"`` \| ``"onLoad"`` \| ``"onLoadCapture"`` \| ``"onError"`` \| ``"onErrorCapture"`` \| ``"onKeyDown"`` \| ``"onKeyDownCapture"`` \| ``"onKeyPress"`` \| ``"onKeyPressCapture"`` \| ``"onKeyUp"`` \| ``"onKeyUpCapture"`` \| ``"onAbort"`` \| ``"onAbortCapture"`` \| ``"onCanPlay"`` \| ``"onCanPlayCapture"`` \| ``"onCanPlayThrough"`` \| ``"onCanPlayThroughCapture"`` \| ``"onDurationChange"`` \| ``"onDurationChangeCapture"`` \| ``"onEmptied"`` \| ``"onEmptiedCapture"`` \| ``"onEncrypted"`` \| ``"onEncryptedCapture"`` \| ``"onEnded"`` \| ``"onEndedCapture"`` \| ``"onLoadedData"`` \| ``"onLoadedDataCapture"`` \| ``"onLoadedMetadata"`` \| ``"onLoadedMetadataCapture"`` \| ``"onLoadStart"`` \| ``"onLoadStartCapture"`` \| ``"onPause"`` \| ``"onPauseCapture"`` \| ``"onPlay"`` \| ``"onPlayCapture"`` \| ``"onPlaying"`` \| ``"onPlayingCapture"`` \| ``"onProgress"`` \| ``"onProgressCapture"`` \| ``"onRateChange"`` \| ``"onRateChangeCapture"`` \| ``"onSeeked"`` \| ``"onSeekedCapture"`` \| ``"onSeeking"`` \| ``"onSeekingCapture"`` \| ``"onStalled"`` \| ``"onStalledCapture"`` \| ``"onSuspend"`` \| ``"onSuspendCapture"`` \| ``"onTimeUpdate"`` \| ``"onTimeUpdateCapture"`` \| ``"onVolumeChange"`` \| ``"onVolumeChangeCapture"`` \| ``"onWaiting"`` \| ``"onWaitingCapture"`` \| ``"onAuxClick"`` \| ``"onAuxClickCapture"`` \| ``"onClick"`` \| ``"onClickCapture"`` \| ``"onContextMenu"`` \| ``"onContextMenuCapture"`` \| ``"onDoubleClick"`` \| ``"onDoubleClickCapture"`` \| ``"onDrag"`` \| ``"onDragCapture"`` \| ``"onDragEnd"`` \| ``"onDragEndCapture"`` \| ``"onDragEnter"`` \| ``"onDragEnterCapture"`` \| ``"onDragExit"`` \| ``"onDragExitCapture"`` \| ``"onDragLeave"`` \| ``"onDragLeaveCapture"`` \| ``"onDragOver"`` \| ``"onDragOverCapture"`` \| ``"onDragStart"`` \| ``"onDragStartCapture"`` \| ``"onDrop"`` \| ``"onDropCapture"`` \| ``"onMouseDown"`` \| ``"onMouseDownCapture"`` \| ``"onMouseEnter"`` \| ``"onMouseLeave"`` \| ``"onMouseMove"`` \| ``"onMouseMoveCapture"`` \| ``"onMouseOut"`` \| ``"onMouseOutCapture"`` \| ``"onMouseOver"`` \| ``"onMouseOverCapture"`` \| ``"onMouseUp"`` \| ``"onMouseUpCapture"`` \| ``"onSelect"`` \| ``"onSelectCapture"`` \| ``"onTouchCancel"`` \| ``"onTouchCancelCapture"`` \| ``"onTouchEnd"`` \| ``"onTouchEndCapture"`` \| ``"onTouchMove"`` \| ``"onTouchMoveCapture"`` \| ``"onTouchStart"`` \| ``"onTouchStartCapture"`` \| ``"onPointerDown"`` \| ``"onPointerDownCapture"`` \| ``"onPointerMove"`` \| ``"onPointerMoveCapture"`` \| ``"onPointerUp"`` \| ``"onPointerUpCapture"`` \| ``"onPointerCancel"`` \| ``"onPointerCancelCapture"`` \| ``"onPointerEnter"`` \| ``"onPointerEnterCapture"`` \| ``"onPointerLeave"`` \| ``"onPointerLeaveCapture"`` \| ``"onPointerOver"`` \| ``"onPointerOverCapture"`` \| ``"onPointerOut"`` \| ``"onPointerOutCapture"`` \| ``"onGotPointerCapture"`` \| ``"onGotPointerCaptureCapture"`` \| ``"onLostPointerCapture"`` \| ``"onLostPointerCaptureCapture"`` \| ``"onScroll"`` \| ``"onScrollCapture"`` \| ``"onWheel"`` \| ``"onWheelCapture"`` \| ``"onAnimationStart"`` \| ``"onAnimationStartCapture"`` \| ``"onAnimationEnd"`` \| ``"onAnimationEndCapture"`` \| ``"onAnimationIteration"`` \| ``"onAnimationIterationCapture"`` \| ``"onTransitionEnd"`` \| ``"onTransitionEndCapture"`` \| ``"css"`` \| ``"multiple"`` \| ``"accept"`` \| ``"alt"`` \| ``"autoComplete"`` \| ``"capture"`` \| ``"checked"`` \| ``"crossOrigin"`` \| ``"enterKeyHint"`` \| ``"height"`` \| ``"list"`` \| ``"max"`` \| ``"maxLength"`` \| ``"min"`` \| ``"minLength"`` \| ``"readOnly"`` \| ``"required"`` \| ``"src"`` \| ``"step"`` \| ``"width"``\>, ``"form"`` \| ``"slot"`` \| ``"style"`` \| ``"title"`` \| ``"pattern"`` \| ``"children"`` \| ``"color"`` \| ``"prefix"`` \| ``"size"`` \| ``"autoFocus"`` \| ``"formAction"`` \| ``"formEncType"`` \| ``"formMethod"`` \| ``"formNoValidate"`` \| ``"formTarget"`` \| ``"name"`` \| ``"type"`` \| ``"defaultChecked"`` \| ``"suppressContentEditableWarning"`` \| ``"suppressHydrationWarning"`` \| ``"accessKey"`` \| ``"className"`` \| ``"contentEditable"`` \| ``"contextMenu"`` \| ``"dir"`` \| ``"draggable"`` \| ``"hidden"`` \| ``"id"`` \| ``"lang"`` \| ``"spellCheck"`` \| ``"tabIndex"`` \| ``"translate"`` \| ``"radioGroup"`` \| ``"role"`` \| ``"about"`` \| ``"datatype"`` \| ``"inlist"`` \| ``"property"`` \| ``"resource"`` \| ``"typeof"`` \| ``"vocab"`` \| ``"autoCapitalize"`` \| ``"autoCorrect"`` \| ``"autoSave"`` \| ``"itemProp"`` \| ``"itemScope"`` \| ``"itemType"`` \| ``"itemID"`` \| ``"itemRef"`` \| ``"results"`` \| ``"security"`` \| ``"unselectable"`` \| ``"inputMode"`` \| ``"is"`` \| ``"aria-activedescendant"`` \| ``"aria-atomic"`` \| ``"aria-autocomplete"`` \| ``"aria-busy"`` \| ``"aria-checked"`` \| ``"aria-colcount"`` \| ``"aria-colindex"`` \| ``"aria-colspan"`` \| ``"aria-controls"`` \| ``"aria-current"`` \| ``"aria-describedby"`` \| ``"aria-details"`` \| ``"aria-dropeffect"`` \| ``"aria-errormessage"`` \| ``"aria-expanded"`` \| ``"aria-flowto"`` \| ``"aria-grabbed"`` \| ``"aria-haspopup"`` \| ``"aria-hidden"`` \| ``"aria-invalid"`` \| ``"aria-keyshortcuts"`` \| ``"aria-label"`` \| ``"aria-labelledby"`` \| ``"aria-level"`` \| ``"aria-live"`` \| ``"aria-modal"`` \| ``"aria-multiselectable"`` \| ``"aria-orientation"`` \| ``"aria-owns"`` \| ``"aria-placeholder"`` \| ``"aria-posinset"`` \| ``"aria-pressed"`` \| ``"aria-relevant"`` \| ``"aria-roledescription"`` \| ``"aria-rowcount"`` \| ``"aria-rowindex"`` \| ``"aria-rowspan"`` \| ``"aria-selected"`` \| ``"aria-setsize"`` \| ``"aria-sort"`` \| ``"aria-valuemax"`` \| ``"aria-valuemin"`` \| ``"aria-valuenow"`` \| ``"aria-valuetext"`` \| ``"dangerouslySetInnerHTML"`` \| ``"onCopy"`` \| ``"onCopyCapture"`` \| ``"onCut"`` \| ``"onCutCapture"`` \| ``"onPaste"`` \| ``"onPasteCapture"`` \| ``"onCompositionEnd"`` \| ``"onCompositionEndCapture"`` \| ``"onCompositionStart"`` \| ``"onCompositionStartCapture"`` \| ``"onCompositionUpdate"`` \| ``"onCompositionUpdateCapture"`` \| ``"onFocus"`` \| ``"onFocusCapture"`` \| ``"onBlur"`` \| ``"onBlurCapture"`` \| ``"onChangeCapture"`` \| ``"onBeforeInput"`` \| ``"onBeforeInputCapture"`` \| ``"onInput"`` \| ``"onInputCapture"`` \| ``"onReset"`` \| ``"onResetCapture"`` \| ``"onSubmit"`` \| ``"onSubmitCapture"`` \| ``"onInvalid"`` \| ``"onInvalidCapture"`` \| ``"onLoad"`` \| ``"onLoadCapture"`` \| ``"onError"`` \| ``"onErrorCapture"`` \| ``"onKeyDown"`` \| ``"onKeyDownCapture"`` \| ``"onKeyPress"`` \| ``"onKeyPressCapture"`` \| ``"onKeyUp"`` \| ``"onKeyUpCapture"`` \| ``"onAbort"`` \| ``"onAbortCapture"`` \| ``"onCanPlay"`` \| ``"onCanPlayCapture"`` \| ``"onCanPlayThrough"`` \| ``"onCanPlayThroughCapture"`` \| ``"onDurationChange"`` \| ``"onDurationChangeCapture"`` \| ``"onEmptied"`` \| ``"onEmptiedCapture"`` \| ``"onEncrypted"`` \| ``"onEncryptedCapture"`` \| ``"onEnded"`` \| ``"onEndedCapture"`` \| ``"onLoadedData"`` \| ``"onLoadedDataCapture"`` \| ``"onLoadedMetadata"`` \| ``"onLoadedMetadataCapture"`` \| ``"onLoadStart"`` \| ``"onLoadStartCapture"`` \| ``"onPause"`` \| ``"onPauseCapture"`` \| ``"onPlay"`` \| ``"onPlayCapture"`` \| ``"onPlaying"`` \| ``"onPlayingCapture"`` \| ``"onProgress"`` \| ``"onProgressCapture"`` \| ``"onRateChange"`` \| ``"onRateChangeCapture"`` \| ``"onSeeked"`` \| ``"onSeekedCapture"`` \| ``"onSeeking"`` \| ``"onSeekingCapture"`` \| ``"onStalled"`` \| ``"onStalledCapture"`` \| ``"onSuspend"`` \| ``"onSuspendCapture"`` \| ``"onTimeUpdate"`` \| ``"onTimeUpdateCapture"`` \| ``"onVolumeChange"`` \| ``"onVolumeChangeCapture"`` \| ``"onWaiting"`` \| ``"onWaitingCapture"`` \| ``"onAuxClick"`` \| ``"onAuxClickCapture"`` \| ``"onClick"`` \| ``"onClickCapture"`` \| ``"onContextMenu"`` \| ``"onContextMenuCapture"`` \| ``"onDoubleClick"`` \| ``"onDoubleClickCapture"`` \| ``"onDrag"`` \| ``"onDragCapture"`` \| ``"onDragEnd"`` \| ``"onDragEndCapture"`` \| ``"onDragEnter"`` \| ``"onDragEnterCapture"`` \| ``"onDragExit"`` \| ``"onDragExitCapture"`` \| ``"onDragLeave"`` \| ``"onDragLeaveCapture"`` \| ``"onDragOver"`` \| ``"onDragOverCapture"`` \| ``"onDragStart"`` \| ``"onDragStartCapture"`` \| ``"onDrop"`` \| ``"onDropCapture"`` \| ``"onMouseDown"`` \| ``"onMouseDownCapture"`` \| ``"onMouseEnter"`` \| ``"onMouseLeave"`` \| ``"onMouseMove"`` \| ``"onMouseMoveCapture"`` \| ``"onMouseOut"`` \| ``"onMouseOutCapture"`` \| ``"onMouseOver"`` \| ``"onMouseOverCapture"`` \| ``"onMouseUp"`` \| ``"onMouseUpCapture"`` \| ``"onSelect"`` \| ``"onSelectCapture"`` \| ``"onTouchCancel"`` \| ``"onTouchCancelCapture"`` \| ``"onTouchEnd"`` \| ``"onTouchEndCapture"`` \| ``"onTouchMove"`` \| ``"onTouchMoveCapture"`` \| ``"onTouchStart"`` \| ``"onTouchStartCapture"`` \| ``"onPointerDown"`` \| ``"onPointerDownCapture"`` \| ``"onPointerMove"`` \| ``"onPointerMoveCapture"`` \| ``"onPointerUp"`` \| ``"onPointerUpCapture"`` \| ``"onPointerCancel"`` \| ``"onPointerCancelCapture"`` \| ``"onPointerEnter"`` \| ``"onPointerEnterCapture"`` \| ``"onPointerLeave"`` \| ``"onPointerLeaveCapture"`` \| ``"onPointerOver"`` \| ``"onPointerOverCapture"`` \| ``"onPointerOut"`` \| ``"onPointerOutCapture"`` \| ``"onGotPointerCapture"`` \| ``"onGotPointerCaptureCapture"`` \| ``"onLostPointerCapture"`` \| ``"onLostPointerCaptureCapture"`` \| ``"onScroll"`` \| ``"onScrollCapture"`` \| ``"onWheel"`` \| ``"onWheelCapture"`` \| ``"onAnimationStart"`` \| ``"onAnimationStartCapture"`` \| ``"onAnimationEnd"`` \| ``"onAnimationEndCapture"`` \| ``"onAnimationIteration"`` \| ``"onAnimationIterationCapture"`` \| ``"onTransitionEnd"`` \| ``"onTransitionEndCapture"`` \| ``"css"`` \| ``"multiple"`` \| ``"accept"`` \| ``"alt"`` \| ``"autoComplete"`` \| ``"capture"`` \| ``"checked"`` \| ``"crossOrigin"`` \| ``"enterKeyHint"`` \| ``"height"`` \| ``"list"`` \| ``"max"`` \| ``"maxLength"`` \| ``"min"`` \| ``"minLength"`` \| ``"src"`` \| ``"step"`` \| ``"width"``\>

Other input props you may provide to input element.

#### Inherited from

Omit.inputProps

#### Defined in

[packages/react/src/Picker/PickerTrigger.tsx:48](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/Picker/PickerTrigger.tsx#L48)

___

### isDateDisabled

• `Optional` **isDateDisabled**: (`date`: `Moment`) => `boolean`

#### Type declaration

▸ (`date`): `boolean`

Provide if you have a custom disabling logic. The method takes the date object as its parameter.

##### Parameters

| Name | Type |
| :------ | :------ |
| `date` | `Moment` |

##### Returns

`boolean`

#### Inherited from

Omit.isDateDisabled

#### Defined in

[packages/react/src/Calendar/CalendarDays.tsx:19](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/Calendar/CalendarDays.tsx#L19)

___

### isMonthDisabled

• `Optional` **isMonthDisabled**: (`date`: `Moment`) => `boolean`

#### Type declaration

▸ (`date`): `boolean`

Provide if you have a custom disabling logic. The method takes the date object as its parameter.

##### Parameters

| Name | Type |
| :------ | :------ |
| `date` | `Moment` |

##### Returns

`boolean`

#### Inherited from

Omit.isMonthDisabled

#### Defined in

[packages/react/src/Calendar/CalendarMonths.tsx:21](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/Calendar/CalendarMonths.tsx#L21)

___

### isYearDisabled

• `Optional` **isYearDisabled**: (`date`: `Moment`) => `boolean`

#### Type declaration

▸ (`date`): `boolean`

Provide if you have a custom disabling logic.
The method takes the date object as its parameter.

##### Parameters

| Name | Type |
| :------ | :------ |
| `date` | `Moment` |

##### Returns

`boolean`

#### Inherited from

Omit.isYearDisabled

#### Defined in

[packages/react/src/Calendar/CalendarYears.tsx:19](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/Calendar/CalendarYears.tsx#L19)

___

### minutePrefix

• `Optional` **minutePrefix**: `ReactNode`

The minutes column prefix.

**`default`** 'Min''

#### Inherited from

Omit.minutePrefix

#### Defined in

[packages/react/src/TimePanel/TimePanel.tsx:52](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/TimePanel/TimePanel.tsx#L52)

___

### minuteStep

• `Optional` **minuteStep**: `number`

The steps of minute.

**`default`** 1

#### Inherited from

Omit.minuteStep

#### Defined in

[packages/react/src/TimePanel/TimePanel.tsx:57](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/TimePanel/TimePanel.tsx#L57)

___

### onChange

• `Optional` **onChange**: (`value?`: `Moment`) => `void`

#### Type declaration

▸ (`value?`): `void`

Change Handler. Receive `DateType` as props.

##### Parameters

| Name | Type |
| :------ | :------ |
| `value?` | `Moment` |

##### Returns

`void`

#### Inherited from

Omit.onChange

#### Defined in

[packages/react/src/DateTimePicker/DateTimePickerPanel.tsx:57](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/DateTimePicker/DateTimePickerPanel.tsx#L57)

___

### onPanelToggle

• `Optional` **onPanelToggle**: (`open`: `boolean`) => `void`

#### Type declaration

▸ (`open`): `void`

A function that fires when panel toggled. Receive open status in boolean format as props.

##### Parameters

| Name | Type |
| :------ | :------ |
| `open` | `boolean` |

##### Returns

`void`

#### Defined in

[packages/react/src/DateTimePicker/DateTimePicker.tsx:57](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/DateTimePicker/DateTimePicker.tsx#L57)

___

### open

• `Optional` **open**: `boolean`

The portal element will show if open=true

**`default`** false

#### Inherited from

Omit.open

#### Defined in

[packages/react/src/Popper/Popper.tsx:38](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/Popper/Popper.tsx#L38)

___

### placeholder

• `Optional` **placeholder**: `string`

Placeholder for the input element.

#### Inherited from

Omit.placeholder

#### Defined in

[packages/react/src/Picker/PickerTrigger.tsx:30](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/Picker/PickerTrigger.tsx#L30)

___

### popperProps

• `Optional` **popperProps**: `Pick`<`InputTriggerPopperProps`, ``"slot"`` \| ``"style"`` \| ``"title"`` \| ``"color"`` \| ``"prefix"`` \| ``"defaultChecked"`` \| ``"defaultValue"`` \| ``"suppressContentEditableWarning"`` \| ``"suppressHydrationWarning"`` \| ``"accessKey"`` \| ``"className"`` \| ``"contentEditable"`` \| ``"contextMenu"`` \| ``"dir"`` \| ``"draggable"`` \| ``"hidden"`` \| ``"id"`` \| ``"lang"`` \| ``"placeholder"`` \| ``"spellCheck"`` \| ``"tabIndex"`` \| ``"translate"`` \| ``"radioGroup"`` \| ``"role"`` \| ``"about"`` \| ``"datatype"`` \| ``"inlist"`` \| ``"property"`` \| ``"resource"`` \| ``"typeof"`` \| ``"vocab"`` \| ``"autoCapitalize"`` \| ``"autoCorrect"`` \| ``"autoSave"`` \| ``"itemProp"`` \| ``"itemScope"`` \| ``"itemType"`` \| ``"itemID"`` \| ``"itemRef"`` \| ``"results"`` \| ``"security"`` \| ``"unselectable"`` \| ``"inputMode"`` \| ``"is"`` \| ``"aria-activedescendant"`` \| ``"aria-atomic"`` \| ``"aria-autocomplete"`` \| ``"aria-busy"`` \| ``"aria-checked"`` \| ``"aria-colcount"`` \| ``"aria-colindex"`` \| ``"aria-colspan"`` \| ``"aria-controls"`` \| ``"aria-current"`` \| ``"aria-describedby"`` \| ``"aria-details"`` \| ``"aria-disabled"`` \| ``"aria-dropeffect"`` \| ``"aria-errormessage"`` \| ``"aria-expanded"`` \| ``"aria-flowto"`` \| ``"aria-grabbed"`` \| ``"aria-haspopup"`` \| ``"aria-hidden"`` \| ``"aria-invalid"`` \| ``"aria-keyshortcuts"`` \| ``"aria-label"`` \| ``"aria-labelledby"`` \| ``"aria-level"`` \| ``"aria-live"`` \| ``"aria-modal"`` \| ``"aria-multiline"`` \| ``"aria-multiselectable"`` \| ``"aria-orientation"`` \| ``"aria-owns"`` \| ``"aria-placeholder"`` \| ``"aria-posinset"`` \| ``"aria-pressed"`` \| ``"aria-readonly"`` \| ``"aria-relevant"`` \| ``"aria-required"`` \| ``"aria-roledescription"`` \| ``"aria-rowcount"`` \| ``"aria-rowindex"`` \| ``"aria-rowspan"`` \| ``"aria-selected"`` \| ``"aria-setsize"`` \| ``"aria-sort"`` \| ``"aria-valuemax"`` \| ``"aria-valuemin"`` \| ``"aria-valuenow"`` \| ``"aria-valuetext"`` \| ``"dangerouslySetInnerHTML"`` \| ``"onCopy"`` \| ``"onCopyCapture"`` \| ``"onCut"`` \| ``"onCutCapture"`` \| ``"onPaste"`` \| ``"onPasteCapture"`` \| ``"onCompositionEnd"`` \| ``"onCompositionEndCapture"`` \| ``"onCompositionStart"`` \| ``"onCompositionStartCapture"`` \| ``"onCompositionUpdate"`` \| ``"onCompositionUpdateCapture"`` \| ``"onFocus"`` \| ``"onFocusCapture"`` \| ``"onBlur"`` \| ``"onBlurCapture"`` \| ``"onChange"`` \| ``"onChangeCapture"`` \| ``"onBeforeInput"`` \| ``"onBeforeInputCapture"`` \| ``"onInput"`` \| ``"onInputCapture"`` \| ``"onReset"`` \| ``"onResetCapture"`` \| ``"onSubmit"`` \| ``"onSubmitCapture"`` \| ``"onInvalid"`` \| ``"onInvalidCapture"`` \| ``"onLoad"`` \| ``"onLoadCapture"`` \| ``"onError"`` \| ``"onErrorCapture"`` \| ``"onKeyDown"`` \| ``"onKeyDownCapture"`` \| ``"onKeyPress"`` \| ``"onKeyPressCapture"`` \| ``"onKeyUp"`` \| ``"onKeyUpCapture"`` \| ``"onAbort"`` \| ``"onAbortCapture"`` \| ``"onCanPlay"`` \| ``"onCanPlayCapture"`` \| ``"onCanPlayThrough"`` \| ``"onCanPlayThroughCapture"`` \| ``"onDurationChange"`` \| ``"onDurationChangeCapture"`` \| ``"onEmptied"`` \| ``"onEmptiedCapture"`` \| ``"onEncrypted"`` \| ``"onEncryptedCapture"`` \| ``"onEnded"`` \| ``"onEndedCapture"`` \| ``"onLoadedData"`` \| ``"onLoadedDataCapture"`` \| ``"onLoadedMetadata"`` \| ``"onLoadedMetadataCapture"`` \| ``"onLoadStart"`` \| ``"onLoadStartCapture"`` \| ``"onPause"`` \| ``"onPauseCapture"`` \| ``"onPlay"`` \| ``"onPlayCapture"`` \| ``"onPlaying"`` \| ``"onPlayingCapture"`` \| ``"onProgress"`` \| ``"onProgressCapture"`` \| ``"onRateChange"`` \| ``"onRateChangeCapture"`` \| ``"onSeeked"`` \| ``"onSeekedCapture"`` \| ``"onSeeking"`` \| ``"onSeekingCapture"`` \| ``"onStalled"`` \| ``"onStalledCapture"`` \| ``"onSuspend"`` \| ``"onSuspendCapture"`` \| ``"onTimeUpdate"`` \| ``"onTimeUpdateCapture"`` \| ``"onVolumeChange"`` \| ``"onVolumeChangeCapture"`` \| ``"onWaiting"`` \| ``"onWaitingCapture"`` \| ``"onAuxClick"`` \| ``"onAuxClickCapture"`` \| ``"onClick"`` \| ``"onClickCapture"`` \| ``"onContextMenu"`` \| ``"onContextMenuCapture"`` \| ``"onDoubleClick"`` \| ``"onDoubleClickCapture"`` \| ``"onDrag"`` \| ``"onDragCapture"`` \| ``"onDragEnd"`` \| ``"onDragEndCapture"`` \| ``"onDragEnter"`` \| ``"onDragEnterCapture"`` \| ``"onDragExit"`` \| ``"onDragExitCapture"`` \| ``"onDragLeave"`` \| ``"onDragLeaveCapture"`` \| ``"onDragOver"`` \| ``"onDragOverCapture"`` \| ``"onDragStart"`` \| ``"onDragStartCapture"`` \| ``"onDrop"`` \| ``"onDropCapture"`` \| ``"onMouseDown"`` \| ``"onMouseDownCapture"`` \| ``"onMouseEnter"`` \| ``"onMouseLeave"`` \| ``"onMouseMove"`` \| ``"onMouseMoveCapture"`` \| ``"onMouseOut"`` \| ``"onMouseOutCapture"`` \| ``"onMouseOver"`` \| ``"onMouseOverCapture"`` \| ``"onMouseUp"`` \| ``"onMouseUpCapture"`` \| ``"onSelect"`` \| ``"onSelectCapture"`` \| ``"onTouchCancel"`` \| ``"onTouchCancelCapture"`` \| ``"onTouchEnd"`` \| ``"onTouchEndCapture"`` \| ``"onTouchMove"`` \| ``"onTouchMoveCapture"`` \| ``"onTouchStart"`` \| ``"onTouchStartCapture"`` \| ``"onPointerDown"`` \| ``"onPointerDownCapture"`` \| ``"onPointerMove"`` \| ``"onPointerMoveCapture"`` \| ``"onPointerUp"`` \| ``"onPointerUpCapture"`` \| ``"onPointerCancel"`` \| ``"onPointerCancelCapture"`` \| ``"onPointerEnter"`` \| ``"onPointerEnterCapture"`` \| ``"onPointerLeave"`` \| ``"onPointerLeaveCapture"`` \| ``"onPointerOver"`` \| ``"onPointerOverCapture"`` \| ``"onPointerOut"`` \| ``"onPointerOutCapture"`` \| ``"onGotPointerCapture"`` \| ``"onGotPointerCaptureCapture"`` \| ``"onLostPointerCapture"`` \| ``"onLostPointerCaptureCapture"`` \| ``"onScroll"`` \| ``"onScrollCapture"`` \| ``"onWheel"`` \| ``"onWheelCapture"`` \| ``"onAnimationStart"`` \| ``"onAnimationStartCapture"`` \| ``"onAnimationEnd"`` \| ``"onAnimationEndCapture"`` \| ``"onAnimationIteration"`` \| ``"onAnimationIterationCapture"`` \| ``"onTransitionEnd"`` \| ``"onTransitionEndCapture"`` \| ``"css"`` \| ``"container"`` \| ``"disablePortal"`` \| ``"options"`` \| ``"sameWidth"`` \| ``"controllerRef"``\>

Other props you may provide to `Popper` component

#### Inherited from

Omit.popperProps

#### Defined in

[packages/react/src/DateTimePicker/DateTimePickerPanel.tsx:61](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/DateTimePicker/DateTimePickerPanel.tsx#L61)

___

### prefix

• `Optional` **prefix**: `ReactNode`

The prefix addon of the field.

#### Inherited from

Omit.prefix

#### Defined in

[packages/react/src/TextField/TextField.tsx:54](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/TextField/TextField.tsx#L54)

___

### readOnly

• `Optional` **readOnly**: `boolean`

Whether the input is readonly.

**`default`** false

#### Inherited from

Omit.readOnly

#### Defined in

[packages/react/src/Picker/PickerTrigger.tsx:35](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/Picker/PickerTrigger.tsx#L35)

___

### referenceDate

• `Optional` **referenceDate**: `Moment`

The reference date for getting calendars. Default to current time.

#### Defined in

[packages/react/src/DateTimePicker/DateTimePicker.tsx:61](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/DateTimePicker/DateTimePicker.tsx#L61)

___

### required

• `Optional` **required**: `boolean`

Whether the input is required.

**`default`** false

#### Inherited from

Omit.required

#### Defined in

[packages/react/src/Picker/PickerTrigger.tsx:40](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/Picker/PickerTrigger.tsx#L40)

___

### secondPrefix

• `Optional` **secondPrefix**: `ReactNode`

The seconds column prefix.

**`default`** 'Sec''

#### Inherited from

Omit.secondPrefix

#### Defined in

[packages/react/src/TimePanel/TimePanel.tsx:66](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/TimePanel/TimePanel.tsx#L66)

___

### secondStep

• `Optional` **secondStep**: `number`

The steps of second.

**`default`** 1

#### Inherited from

Omit.secondStep

#### Defined in

[packages/react/src/TimePanel/TimePanel.tsx:71](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/TimePanel/TimePanel.tsx#L71)

___

### size

• `Optional` **size**: ``"small"`` \| ``"medium"`` \| ``"large"``

The size of field.

**`default`** 'medium'

#### Inherited from

Omit.size

#### Defined in

[packages/react/src/TextField/TextField.tsx:59](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/TextField/TextField.tsx#L59)

___

### value

• `Optional` **value**: `Moment`

Display value of the panel.

#### Inherited from

Omit.value

#### Defined in

[packages/react/src/DateTimePicker/DateTimePickerPanel.tsx:70](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/DateTimePicker/DateTimePickerPanel.tsx#L70)