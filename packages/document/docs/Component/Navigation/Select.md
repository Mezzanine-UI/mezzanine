# Select
Select enables users to choose one or more options from a predefined or dynamically loaded list, ideal for scenarios requiring explicit selection from a limited set.



# Playground
![Image](../img/Select-Playground.svg)



## Usage Guide
The Select component is designed to help users efficiently choose from a limited set of options. It supports single and multiple selection, option grouping, and dynamic data loading. Suitable for forms, filters, and configuration settings, it provides various sizes and states, including error feedback and clear actions to enhance usability.

### Best Practices
- **Keep option labels concise**: Avoid overly long text and ensure clarity of each choice.
- **Use grouping for long lists**: Group options when dealing with large sets to improve scannability.
- **Provide contextual placeholder**: Use placeholder text to guide users when no option is selected.
- **Match size to layout needs**: Select the appropriate size (L / M / S) based on interface constraints and priority.
- **Enable clearable for flexibility**: Allow users to clear selections in editable fields to improve control.
- **Ensure consistent click targets**: When customizing option content, preserve predictable interaction areas.
    

### When Not to Use
- **When the option list is very large and needs filtering**: If there are more than 100 items, and users cannot easily scan all choices, consider searchable alternatives like AutoComplete to reduce cognitive load.
- **When users are unfamiliar with the options**: If each option requires explanation to be understood, a simple dropdown may not provide sufficient context. Use descriptive lists or custom panels instead.
- **When high-frequency switching is needed**: Select is suitable for occasional use. For frequent changes (e.g., filter toggles), consider using Radio Groups or Toggle Buttons for quicker interactions.
- **When all options need to be visible for comparison**: In scenarios where users must compare options side-by-side, like preference settings, tables or card-based layouts are often more effective.
- **When used for display only**: If the field is only showing selected data and not meant for interaction, use non-interactive components like Text, Tags, or ReadOnly Input to avoid confusion.
    

### Usage Patterns
- **Open the menu**: Clicking on the input triggers a dropdown menu with a grow transition animation.
- **Clear selected value**: In a populated state, a clear icon (X) appears for removing the current selection.
- **Multi-selection display**: Selected items appear as tags inside the input; overflow content wraps or truncates as needed.
- **Option grouping**: Grouped options are separated by labeled sections to enhance readability.
- **Load more options on scroll**: In dynamic fetching mode, scrolling to the bottom of the menu triggers a loading state to append more options.
- **Error and disabled states**: Invalid or inactive fields will reflect visual feedback (e.g., error, disabled) and block interaction.
	




## Modes
### 1. Basic Selection
Allows users to select a single option. Commonly used in forms and filters, it supports placeholder text, error states, and a clearable icon.

![Image](../img/Select-Mode-Basic.svg)

### 2. Multiple Selection
Enables users to select multiple items. Selected options appear as tags within the input. If items exceed the field width, they collapse into a concise format. Suitable for tag management or multi-category selection.

![Image](../img/Select-Mode-Multiple.svg)

### 3. Option Group
Organizes options into logical groups to enhance readability and navigation. Commonly used for structured datasets such as departments or locations.

![Image](../img/Select-Mode-Group.svg)

### 4. Tree Select
Supports hierarchical data with expandable tree nodes. Users can navigate and select nested items, making it ideal for structures like file systems or organizational charts. Dynamic expansion and level control are supported.

![Image](../img/Select-Mode-Tree.svg)

### 5. Dynamic Fetching
Dynamically loads option data via asynchronous calls, often triggered by user input. This is useful for large datasets or typeahead experiences, with optional debounce for performance optimization.

![Image](../img/Select-Mode-DynamicFetching.svg)

**💡 Note:**  `Full Control` and `On Modal` are special integration contexts handled in the <a href="#integration">**Integration**</a> section to avoid ambiguity in mode classification.





## Appearance
### Anatomy
1. **Input Field**: The main interactive field showing selected value, placeholder, or typed content.
2. **Dropdown Menu**: A list that displays options. The format may vary (list, group, tree) based on mode.
3. **Clear Icon**: Appears when there’s input or a selection, allowing users to clear the value.
4. **Tags (Multiple Mode)**: In multiple selection mode, selected items appear as removable tags.
5. **Suffix Icon / Action**: Custom actions or indicators on the right side (e.g., dropdown arrow, external button).


### States
#### 1. Basic Item
- **Basic**: `inactive`, `hover`, `disabled`, `error`
- **Activated**: `activated`, `activated-hover`, `activated-populated`
- **Populated**: `populated-inactive`, `populated-hover`, `populated-activated`

![Image](../img/Select-State-BasicItem.svg)


> 💡 When typing or hovering a pre-filled field, a clear icon (X) appears to allow clearing the content.

#### 2. Option Group
- **Activated Variants**: `activated`, `activated-hover`, `activated-populated`, `activated-populated-hover`

![Image](../img/Select-State-OptionGroup.svg)

#### 3. Multiple Selection
- **Selected**: `single selected`, `multiple selected (overflow)`, `selected-hover`
- **Activated**: `selected-activated`, `selected-activated-multiple (overflow)`

![Image](../img/Select-State-MultipleSelection.svg)

> 💬 When unselected, the visual behavior matches the Basic Item states.


### Sizes
Supports three sizes:
- `Large`: Increased height and font size.
- `Medium`: Default size for general use.
- `Small`: Compact layout for dense UI areas.

![Image](../img/Select-Appearance-Size.svg)


### Transition Animation
- **Grow**: When the menu opens, it fades and expands downward for a smooth appearance.
- **Collapse**: On close, the menu fades out and resets hover states.


### Clear Icon Behavior
- The clear icon appears when:
  - There’s input or selected value
  - The field is hovered or focused
- Clicking the icon resets the value and triggers the clear event (e.g., `onClear`)

> 📌 Behavior differs by mode. In multiple selection, all selected tags will be cleared.



---



## Custom Disable
<!-- 控制使用者在什麼條件下不能使用 -->
The Select and TreeSelect components offer multiple levels of disable control to help restrict user interactions under specific conditions. This section outlines available disable behaviors and implementation guidance.

### Basic Disable
- Use the `disabled` prop to disable the entire field or individual options:
  - `Select` and `TreeSelect` support global field disabling
  - `Option` supports disabling single items

### TreeSelect Only: Disable Nested Options
TreeSelect includes a disabledValues prop that allows disabling multiple nodes by value. It supports the following automatic behaviors:
- If all children are disabled, their parent will automatically be disabled
- If a parent node is disabled, all its descendants will also be disabled

> 💡 Consider using renderValue or treeProps to provide visual cues or helper messages for disabled states.

### Limitations
- Select (non-TreeSelect) does not support disabling options in batch via a value array
- Conditional disable logic (e.g., based on other field values) is not built-in

If conditional disabling is needed, we recommend implementing the logic externally via preprocessing or wrapper components.




## Validation / Restrictions
To ensure consistent interaction and user experience with the **Select** component, proper validation and restriction logic should be applied.\
Select is commonly used for input selection, dynamic data loading, and multi-selection control, making validation of options, access conditions, and value states particularly important.\

The table below outlines key validation items for **Select**, along with responsibilities for designers and developers:

| Item | Description | 🎨 Designer | 🛠️ Developer |
|------|-------------|-------------|---------------|
| **Required Field Logic** | If the select field is required, it should be clearly marked with hints or placeholders. | Provide clear indicators (e.g., asterisk, placeholder, helper text). | Apply validation rules and check for value before submission. |
| **Conditional Menu Access** | The dropdown should be disabled when certain prerequisites are not met (e.g., dependent field is empty). | Indicate disabled state visually and explain why it's inactive. | Use `disabled` or conditional rendering to prevent opening. |
| **Async Loading State** | When loading options from remote sources, show loading, error, or empty states. | Design loading animations and empty state visuals with guidance. | Render appropriate loading/error/empty UI based on fetch state. |
| **Multi-Select Constraints** | In multi-select mode, a maximum selection limit may apply. | Show selection count and visually indicate when the limit is reached. | Enforce selection cap and disable unchecked options if needed. |
| **Validation & Error Feedback** | Clearly indicate errors when input is invalid or missing. | Define error message style and positioning. | Integrate error messages with form logic and apply styling. |



    
## Integration
<!-- 元件「如何與其他應用層、框架、資料結構或函式庫協同工作」的方式 = 怎麼接進系統 -->
### Asset / Style Source
- The visual style of the Select component follows the Mezzanine Design System, including border radius, spacing, typography, and transition animation.
- A grow animation is used when the dropdown opens; avoid overriding it with custom CSS.
- Do not override internal layout or positioning logic to prevent disruption of the dropdown behavior.


### Component Integration Contexts
Select is frequently used in the following integration scenarios:

| Use Case | Integration Purpose |
|--------|--------|
| **Basic Form Selection** | Provides single or multiple selection within forms. |
| **Dynamic Option Fetching** | Loads data from remote sources when the dropdown is opened. |
| **Hierarchical Options (Tree Select)** | Displays nested options for categories, permissions, etc. |
| **Embedded in Modal** | Works seamlessly inside modals or drawers without interaction conflicts. |
| **Full Control Mode** | Externalizes all internal state and logic (e.g., value, menu trigger). |

> ☑️ **Integration Tips:**  
> - For form use cases, prefer controlled components to sync validation and value state.  
> - When used in modals or overlays, ensure the dropdown portal does not obstruct or overlap important UI layers.


### Behavior Delegation
Select supports both controlled and uncontrolled patterns. Logic can be delegated to the parent component as needed:

| Interaction Type | Responsibility |
|--------|--------|
| **Value and onChange** | May be internally or externally controlled via props. |
| **Open/Close State** | In Full Control mode, must be managed explicitly from outside. |
| **Async Option Loading** | Trigger fetch logic in `onOpen` or externally controlled state. |
| **Validation Handling** | Should be managed by the parent or form validation wrapper. |


### Rendering / Performance Considerations
- Dropdown content is rendered only when visible, optimizing initial load performance.
- In multiple selection mode, selected tags are clipped or scrolled when exceeding the input width.
- For large datasets, consider using virtual scroll or chunked loading.


### Library / Data Dependency
- Does not rely on external data schema or third-party libraries.
- Supports asynchronous loading and mapping of custom data structures (e.g., differing `value`, `label`, `id` fields).
- Integrates well with form libraries like React Hook Form, Zod, or Yup.





## Props Overview
<!-- Appearance 控制外型、Behavior 控制互動行為、Data 資料處理、Validation 驗證相關、Events 事件回呼、Integration 整合支援 --> 
### Appearance
Manages the visual presentation and layout of the component, including size, style variants, icon placement, spacing, and visibility states. These settings ensure consistency with the design system and help maintain visual hierarchy across the interface.

| Property | Description | Type | Default |
|-------|-------|-------|-------|
| **size** (Select, TreeSelect) | The size of input. | <font color="#BD3B3B">`"small"` `"medium"` `"large"`</font> | - |
| **fullWidth** (Select, TreeSelect) | If `true`, set width: 100%. | <font color="#BD3B3B">`boolean`</font> | `false` |
| **className** (Select, TreeSelect) | Custom class name. | <font color="#BD3B3B">`string`</font> | - |
| **prefix** (Select, TreeSelect) | The prefix addon of the field. | <font color="#BD3B3B">`ReactNode`</font> | - |
| **suffixActionIcon** (Select, TreeSelect) | Icon rendered on the right side. | <font color="#BD3B3B">`ReactElement<HTMLElement, string , JSXElementConstructor<any>>`</font> | - |
| **forceHideSuffixActionIcon** (Select, TreeSelect) | Force hiding suffix icon. | <font color="#BD3B3B">`boolean`</font> | - |
| **ellipsis** (Select, TreeSelect) | Tags arg ellipsis or not. | <font color="#BD3B3B">`boolean`</font> | - |
| **placeholder** (Select, TreeSelect) | Select input placeholder. | <font color="#BD3B3B">`string`</font> | - |


### Behavior
Controls the interactive behavior of the component, such as handling user actions, managing component states (e.g., loading, toggling), and enabling mode switching to support different usage scenarios.
        
| Property | Description | Type | Default |
|-------|-------|-------|-------|
| **clearable** (Select, TreeSelect) | Whether to show the clear button. | <font color="#BD3B3B">`boolean`</font> | `false` |
| **disabled** (Select, TreeSelect, Option) | Whether the field is disabled. | <font color="#BD3B3B">`boolean`</font> | `false` |
| **mode** (Select, TreeSelect) | Controls the layout of trigger. | <font color="#BD3B3B">`"multiple"` `"single"`</font> | - |
| **disablePortal** (Select, TreeSelect) | Whether to disable portal. If true, it will be a normal component. | <font color="#BD3B3B">`boolean`</font> | `false` |
| **defaultExpandAll** (TreeSelect) | Controls whether to expand all at first render. | <font color="#BD3B3B">`boolean`</font> | - |
| **sameWidth** (TreeSelect) | If true, the panel will have its min-width be same as the trigger width. | <font color="#BD3B3B">`boolean`</font> | `false` |
| **active** (Option) | Whether the menu item is active. | <font color="#BD3B3B">`boolean`</font> | `false` |

        
### Data
Handles the structure, input, and display of data within the component, including content rendering, default values, and formatting. Ensures the component properly reflects and updates data as expected.

| Property | Description | Type | Default |
|-------|-------|-------|-------|
| **value** (Select, TreeSelect, Option) | The value of selection. | <font color="#BD3B3B">`SelectValue<string>, SelectValue<string>[], null`</font> | `undefined undefined` |
| **defaultValue** (Select) | Default selection value. | <font color="#BD3B3B">`SelectValue<string>, SelectValue<string>[]`</font> | - |
| **options<font color="red">*</font>** (TreeSelect) | The nested options for `TreeSelect`. | <font color="#BD3B3B">`TreeSelectOption<string>[]`</font> | - |
| **label** (OptionGroup) | The label of menu item group. | <font color="#BD3B3B">`ReactNode`</font> | - |
| **children<font color="red">*</font>** (Option) | option children (often means the option name) | <font color="#BD3B3B">`string`</font> | - |
| **depth** (TreeSelect) | TreeSelect option depth for layout. | <font color="#BD3B3B">`number`</font> | - |
| **menuProps** (TreeSelect) | Other props you may provide to `Menu`. | <font color="#BD3B3B">`Omit<MenuProps, "role", "size", "itemsInView", "maxHeight">`</font> | - |
| **treeProps** (TreeSelect) | Other props you may provide to `Tree`. | <font color="#BD3B3B">`Omit<TreeProps, "onSelect", "values", "selectable", "defaultExpandAll", "selectMethod", "onExpand", "disabledValues", "expandControllerRef", "expandedValues", "nodes">`</font> | - |


### Validation
Defines validation rules for the component, such as required fields, input constraints, or allowed ranges, to ensure data accuracy and prevent user errors.

| Property | Description | Type | Default |
|-------|-------|-------|-------|
| **required** (Select, TreeSelect) | Whether the selection is required. | <font color="#BD3B3B">`boolean`</font> | `false` |
| **error** (Select, TreeSelect) | Whether the field is error. | <font color="#BD3B3B">`boolean`</font> | `false` |
| **disabledValues** (TreeSelect) | Disable specific tree nodes. | <font color="#BD3B3B">`TreeNodeValue[]`</font> | - |
| **role** (Option) | The role of menu item. | <font color="#BD3B3B">`string`</font> | `"'option'"` |
| **menuRole** (Select, TreeSelect) | The role of menu. | <font color="#BD3B3B">`string`</font> | `"'menu'"` |


### Events
Specifies event callbacks triggered by user interactions (e.g., onChange), allowing the component to communicate with external systems or trigger further processing logic.

| Property | Description | Type | Default |
|-------|-------|-------|-------|
| **onChange** (Select, TreeSelect) | The change event handler of input element. | <font color="#BD3B3B">`((newOptions: SelectValue<string>[]) => any), ((newOptions: SelectValue<string>) => any)`</font> | - |
| **onClear** (Select, TreeSelect) | The callback will be fired after clear icon clicked. | <font color="#BD3B3B">`MouseEventHandler`</font> | - |
| **onTagClose** (Select, TreeSelect) | The click handler for the cross icon on tags. | <font color="#BD3B3B">`((target: SelectValue<string>) => void)`</font> | - |
| **onFocus** (Select, TreeSelect) | Focus events. | <font color="#BD3B3B">`VoidFunction`</font> | - |
| **onBlur** (Select, TreeSelect) | Blur events. | <font color="#BD3B3B">`VoidFunction`</font> | - |
| **onExpand** (TreeSelect) | Tree node expansion event. | <font color="#BD3B3B">`((value: TreeNodeValue) => void)`</font> | - |
| **expandControllerRef** (TreeSelect) | Provide if access to expand control is needed. | <font color="#BD3B3B">`Ref<TreeExpandControl, null>`</font> | - |
| **onMenuScroll** (Select) | Popup menu scroll listener. | <font color="#BD3B3B">`((computed: { scrollTop: number; maxScrollTop: number; }, target: HTMLUListElement) => void)`</font> | - |
| **inputRef** (Select, TreeSelect) | The ref object for input element. | <font color="#BD3B3B">`Ref<HTMLInputElement>`</font> | - |


### Integration
Provides configuration options for integrating with external systems, utilities, or libraries, ensuring compatibility with project-specific requirements such as formatting, localization, or third-party tools.

| Property | Description | Type | Default |
|-------|-------|-------|-------|
| **renderValue** (Select, TreeSelect) | To customize rendering select input value. | <font color="#BD3B3B">`(((values: SelectValue<string>, SelectValue<string>[], null) => string) & ((values: SelectValue<string>[]) => string)), (((values: SelectValue<string>, SelectValue<...>[], null) => string) & ((values: SelectValue<...>, null) => string))`</font> | - |
| **searchText** (Select, TreeSelect) | Used for custom search behavior. | <font color="#BD3B3B">`string`</font> | - |
| **showTextInputAfterTags** (Select, TreeSelect) | Used for custom search behavior. | <font color="#BD3B3B">`boolean`</font> | - |
| **popperOptions** (Select, TreeSelect) | The options of usePopper hook of react-popper. | <font color="#BD3B3B">`PopperOptions<any>`</font> | - |
| **itemsInView** (Select, TreeSelect) | The minimum items count in scroll container. | <font color="#BD3B3B">`number`</font> | `4;` |
| **menuMaxHeight** (Select, TreeSelect) | The custom menu max height. | <font color="#BD3B3B">`number`</font> | - |
| **menuSize** (Select, TreeSelect) | The size of menu. | <font color="#BD3B3B">`"small"` `"medium"` `"large"`</font> | `"'medium'"` |
| **suffixAction** (Select, TreeSelect) | Custom component near suffix area. | <font color="#BD3B3B">`VoidFunction`</font> | - |
