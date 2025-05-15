# Icon
<!--Icons visually represent actions, states, or content, enhancing comprehension and usability across the interface.-->
Icons provide visual cues for actions, states, and content, improving clarity and aiding recognition across the interface.


## Playground
![圖片](../img/Icon-Playground.svg)



## Usage Guide
Icons can serve purely decorative purposes (such as a checkmark to indicate selection), or be interactive (like a clear button that resets an input field). They are often embedded within other components—such as input fields, tables, or dialogs—to enhance functionality and visual clarity.
    ### Best Practices
    - **Use icons that clearly reflect their intended function:** Select icons that convey clear meaning (e.g., a checkmark for confirmation, a cross for clearing), and avoid ambiguous or misleading symbols.
	- **Ensure consistency and recognizability:** Prioritize icons from your design system and maintain consistent styling (e.g., stroke weight, shape, fill).
	- **Provide tooltips or accessible labels for interactive icons:** When an icon triggers an action, enhance clarity with a title or tooltip for better usability and accessibility.
	- **Choose appropriate sizes:** Match icon size to its container to preserve layout balance and avoid crowding.
	- **Use animations purposefully:** Spinning or animated icons (e.g., during loading) should reinforce feedback, not distract users.

    ### When Not to Use
    - **When no clear function or message is conveyed:** Avoid using icons solely for decoration, as this can confuse or distract users.
	- **When the meaning is already fully covered by text:** If an icon simply repeats nearby text, consider removing it to reduce visual noise.
	- **For interactive icons without clarification:** Avoid icons with click actions that lack supporting labels or feedback, which may lead to misunderstanding or missed interactions.

    ### Action Flow
	- When used interactively (e.g., a clear or edit icon), clicking the icon triggers a defined event—such as resetting an input field or enabling an editable state.
	- Icons may be accompanied by loading or disabled states to manage feedback and prevent duplicate actions.
	- Static icons (e.g., for success or warning) don’t have interaction, but should use color or shape to reinforce their semantic meaning—like a green checkmark or a warning icon inside a colored circle.
	- When embedded in other components (like a drag icon in a table), ensure interactive areas are clearly defined and distinguishable from static ones to prevent misclicks.




## Modes
    ### UI Indicator 
        - Non-interactive icons that support the UI by visually representing selection, direction, hierarchy, or toggled states.
        - Typically styled with neutral or design-specific colors (e.g., grayscale, black), without conveying semantic meaning.
        - Examples: checkmark (selected), star (rating), arrow (directional indicator).

    ### Actionable Icon
        - Clickable icons that trigger clear, defined actions such as clearing input, editing content, or opening settings.
        - Must include a title attribute, hover/pressed visual states, and clear documentation of event support (e.g., onClick).
        - Examples: input field “×” clear button, edit icon in tables.

    ### Embedded Function
        - Functionally embedded within other components to assist with interaction.
        - Similar to Actionable Icons, but only functional in the context of the hosting component.
        - Examples: drag handle in table columns, icon-triggered unlock for input fields.

    ### Status Indicator 
        - Icons that visually convey the outcome of an action or system status, typically using semantic colors (green, red, yellow, blue).
        - Usually static and paired with system feedback components such as toasts, dialogs, or form validation messages.
        - Examples: success, error, warning, info, and help icons after form submission.

    ### Loading
        - Icons that represent ongoing operations, such as data submission or processing.
        -Currently supported via the spin: true prop, with potential for future expansion into staged progress representations.
        - Examples: rotating loading spinner, segmented progress icons (25%, 50%, 75%, 100%) as shown in design specs.
        
    ### ⭐️ Comparison Table
    | Mode Type | Description | Interactive | Color/Status |
    |-------|-------|-------|-------|
    | **UI Indicator** | Used to assist the UI, without any interactive behavior. | No | Subject to design specifications. |
    | **Actionable Icon** | Triggers an action upon being clicked. | Yes | Requires hover and active state design. |
    | **Embedded Function** | Operates in conjunction with other components. | Depends | Dependent on the accompanying component. |
    | **Status Indicator** | Displays status messages. | No | Colors such as success and error. |
    | **Loading** | Indicates loading progress. | No | Supports animation or icon transitions. |
        


## Appearance
    ### Anatomy
    Although icons are structurally simple compared to other components like Buttons, it’s still helpful to understand their basic building blocks:
    1. Icon glyph: The visual symbol itself, sourced from the internal “Mezzanine” icon library.
	2. Color inheritance: By default, icons inherit the text color from their parent container. Semantic colors (e.g., success, error, disabled) can be applied via the color prop.
	3. Size control: Icons can be resized using the `size` prop (unit: px).
	4. Accessibility label: The `title` prop can be used to provide an accessible label for screen readers.

    ### Color Variants
    Icons support semantic color variants to visually represent different UI states or meanings. These are commonly used in conjunction with status messages, form feedback, or system alerts:
	- success – Green (e.g., task completed)
	- error – Red (e.g., validation failure)
	- warning – Yellow (e.g., caution)
	- info – Blue (e.g., neutral information)
	- disabled – Grey (e.g., unavailable state)
	- inherit – Inherits the text color from the parent element

    **📌 Note:**  Colors may be automatically adapted for light and dark modes according to design specifications, but this behavior may not yet be implemented in code.

    <!-- 補充？-->

        #### Color Guidelines by Usage
        Icons serve different roles across the interface—from indicating semantic meaning to supporting user interaction or enhancing visual structure. To ensure consistent and intentional color usage, the following table outlines which color variants are appropriate for each usage context:

        | Usage Context | Applicable Colors | Description |
        |-------|-------|-------|
        | **Semantic Icons** | `success`, `warning`, `error`, `info` | Used to convey system status or feedback messages (e.g., success alerts, error messages). These icons typically have fixed colors and should not be customized to preserve consistent meaning. |
        | **UI Status Icons** | `disabled`, `inherit` | Represent interface states like selected, expanded, or disabled. Colors are often neutral or inherited from parent text to maintain UI consistency. |
        | **Clickable Icons** | `primary`, `secondary`, or custom palette  | Represent interactive actions (e.g., edit, delete). These icons support hover and active states, and their color should ensure both brand alignment and sufficient visibility. |
        | **Decorative Icons** | `inherit` | Non-functional icons used for visual balance or content support. Avoid using semantic colors, as they may confuse users or misrepresent intent. |
    
        **💡 Tip:** Use inherit when the icon should match the surrounding text or element color, especially in text-heavy contexts.

    ### Sizes
        Icons can be sized freely to align with layout needs or component pairings (e.g., inside a Button or Input).
	    - Commonly Recommended Sizes: 16px, 20px, 24px, and 32px.
	    - Choose consistent sizing across a view to avoid visual imbalance.
	    - Avoid mixing significantly different icon sizes on the same screen.


    ### Spin (Animated State)
        For icons used in loading or in-progress states, you can enable rotation with the `spin` prop.
	    - Commonly used in loading indicators or submission progress cues.
	    - Helps signal that a background operation is occurring.
	    - Avoid overusing spinning effects in non-functional scenarios to prevent confusion.
    


---



## Custom Disable
    <!-- 控制使用者在什麼條件下不能使用 -->
    Icon does not support custom disabling logic; interactivity is typically managed by removing event handlers and applying the `color="disabled"` style to indicate the inactive state.
    - **Semantic Indication of Disabled State**
        - Even if the icon itself is not interactive, you can visually indicate its state using `color="disabled"`.
        - Recommended use case: Signaling that a function is currently unavailable (e.g., a greyed-out “Delete” icon indicating lack of permission).
    - **Disabled Effect When Paired with Interactive Components**\
        When the icon is embedded within interactive components like buttons or input fields, the disabled state is typically managed by the parent element (e.g., a disabled input field includes a clear icon that appears but does not respond to clicks).
    - **Custom Interaction Blocking**\
        For clickable icons, developers can manually prevent interaction by conditioning the onClick logic and visually reflecting the disabled state through color changes.

## Validation / Restrictions
    To ensure accurate semantic expression, consistent interactions, and accessibility across the interface, it is important to define validation and restriction rules for how icons are used.\
    These checks help prevent incorrect usage, maintain a coherent user experience, and support both design and engineering alignment.\
    \
    The table below outlines common validation items for **Icon**, along with the primary responsibility of Designers and Developers:
    | Item | Description | 🎨 Designer | 🛠️ Developer |
    |-------|-------|-------|-------|
    | **Consistent Semantic Color Usage** | Icon colors should follow predefined semantic meanings (e.g., success, error, warning) and must not be arbitrarily applied to avoid user confusion. | Define color tokens and icon pairings for each semantic state (e.g., success toast with check icon). | Apply correct color props (e.g., `color="error"`), and avoid hard-coded color values. |
    | **Distinguishing Interactive vs. Static Icons** | Only interactive icons should include hover/active effects and event handling. Static (decorative) icons should not suggest clickability. | Determine whether the icon is functional or purely visual, and design accordingly. | Bind event handlers and interactive states only to clickable icons. Use appropriate cursor styles and ARIA labeling. |
    | **Accessibility Label (Title)** | Interactive icons must include descriptive labels for screen readers. | Ensure every icon is interpretable with an accessible title where needed. | Implement `title` prop to provide screen reader-friendly descriptions (equivalent to aria-label). |
    | **Consistent Icon Sizing** | Icon size should align with the visual density of its context (e.g., buttons, inputs). Avoid inconsistent or disproportionate scaling. | Define recommended icon sizes (e.g., 16px, 20px, 24px) for different components. | Allow size adjustments via the `size` prop within a constrained, consistent range. Enforce limits if needed. |
    | **Avoid Overuse of Animated Icons**| Spinning icons or other animations should only be used to indicate ongoing processes (e.g., loading), and not for decorative purposes. | Clearly define when to use animated icons and in what contexts. | Enable the `spin` prop only in appropriate scenarios such as async actions or form submissions. |

    
## Integration
    <!-- 元件「如何與其他應用層、框架、資料結構或函式庫協同工作」的方式 = 怎麼接進系統 -->
    ### Asset / Style Source
        - All icons are sourced from the Mezzanine Icon Library and can be rendered via the icon prop as React components.
	    - Avoid using non-standard or third-party icon sets unless explicitly approved by the design team for specific cases.

    ### Component Integration Contexts
        Icons are commonly paired with the following components. Please follow the parent component’s layout for size, spacing, and alignment. For interactive use cases (e.g., within buttons or input fields), states such as hover, focus, and active must be handled by the parent component.
        | Component | Purpose |
        |-------|-------|
        | **Button** | Conveys intent (e.g., delete, share) |
        | **Alert / Toast** | Delivers semantic cues (success / error / warning) |
        | **Input** | Indicates state (e.g., password visibility) or triggers actions (e.g., clear input) |
        | **Select / Dropdown** | Indicates expansion or collapse |
        | **Table / Pagination** | Enables sorting or navigation |
        | **Tooltip / Empty State** | Provides contextual guidance or no-data indicators |
        | **Modal / Dialog** | Enhances semantic clarity with header icons (e.g., warning) |
        | **Tabs** | Distinguishes categories or meanings for better recognition |
        
        #### 🔧 Integration Tips
	    - Use icon sizes defined by the parent component (e.g., 16px for Buttons, 20–24px for Toasts).
	    - Avoid vertical misalignment or inconsistent spacing with text—visual balance is essential.
	    - Icons themselves are non-interactive; click behavior and state changes must be implemented externally.



    <!-- To ensure consistent and scalable use of icons across the product, this section outlines the source of icon assets and their integration within the design system. Whether used independently or in combination with other components, proper integration helps maintain visual harmony and simplifies development workflows.

    ### Icon Source & Dependency
        Icons used in this component are sourced from the **Mezzanine icon library**, which provides a centralized and consistent collection of graphical assets across the design system. All icons are imported by name via the icon prop and rendered as React components.\
        To maintain consistency and compatibility across projects, it is recommended to standardize the icon source and avoid mixing external or custom icons unless explicitly required.

    ### Component Integration
        Icons are frequently integrated with other UI components, functioning as visual indicators that enhance both clarity and usability:
        - **Accordions:** Indicate expanded/collapsed states.
        - **Alerts / Toasts:** Communicate semantic states such as success, error, or warning.
        - **Buttons:** Used as prefix or suffix icons to represent actions.
        - **Dropdowns / Select Menus:** Use icons for expand/collapse or option prefixes (e.g., country flags, statuses).
        - **Empty States / Results:** Provide visual cues for no content or empty search results.
        - **Input:** Functioning as an action button (e.g., chlearing content, showing password) or providing status cues.
        - **Modals / Dialogs:** Enhance titles with semantic icons.
        - **Steppers / Progress Indicators:** Mark steps with progress or status icons.
        - **Tabs:** Visually differentiate categories.
        - **Tables / Pagination:** Show directional or sorting indicators.
        - **Tags / Labels:** Display category markers or dismiss actions.
        - **Tooltips:** Icons can act as triggers for displaying contextual information, typically via hover or focus interactions.
        
        To ensure visual consistency:
	    - Follow the size recommendations defined by the parent component (e.g., 16px for buttons, 20–24px for alerts).
	    - Maintain proper alignment and spacing when placing icons alongside text or other elements.
	    - When used as a clickable element, the parent component should manage interactivity and state styling (e.g., hover, focus, active).-->



## Props Overview
     <!-- Appearance 控制外型、Behavior 控制互動行為、Data 資料處理、Validation 驗證相關、Events 事件回呼、Integration 整合支援 --> 
    ### Appearance
        Manages the visual presentation and layout of the button, including size, variant, icon placement, and color schemes. These settings ensure consistency with the design system and maintain visual hierarchy across the interface.

        | Property | Description | Type | Default |
        |-------|-------|-------|-------|
        | **color** | Color name provided by palette. | <font color="#BD3B3B">`disabled` `error` `inherit` `success` `warning` `primary` `secondary` </font>  <font color="grey"> ... 26 more  </font> | - |
        | **size** | Icon size in px | <font color="#BD3B3B">`number`</font> | - |
        | **spin** | Whether to spin the icon or not. | <font color="#BD3B3B">`boolean`</font> | `false` |
        

    ### Behavior
        Controls the interactive behavior of the button, such as handling loading states, disabling interactions, and toggling danger styles. These props define how the button responds under different user interactions and system states.
        
        | Property | Description | Type | Default |
        |-------|-------|-------|-------|
        | **spin** | Whether to spin the icon or not. | <font color="#BD3B3B">`boolean`</font> | `false` |

        
    ### Data
        Handles data structure and content within the button, including icon components or children elements. Ensures that the button displays the correct content, and aligns with functional roles such as form submission or navigation.

        | Property | Description | Type | Default |
        |-------|-------|-------|-------|
        | **icon** | The icon provided by `@mezzanine-ui/icons` package. | <font color="#BD3B3B">`IconDefinition`</font> | - |

    ### Validation
        *No specific validation-related props defined for Icon.*     


    ### Events
        *Icon does not directly expose event props like onClick. Interactivity is usually handled at the wrapper or parent level (e.g., wrapping the icon in a button or clickable element).*
    


    ### Integration
        Covers how the button connects with broader application logic—such as routing, form libraries, or asynchronous workflows. These integrations ensure the button functions seamlessly within diverse frameworks and data flows.

        | Property | Description | Type | Default |
        |-------|-------|-------|-------|
        | **title** | Icon accessible title. | <font color="#BD3B3B">`string`</font> | - |
