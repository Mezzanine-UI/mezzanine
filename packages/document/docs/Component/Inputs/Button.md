# Button
Buttons enable users to initiate an action or event upon being clicked.



## Playground
![圖片](../img/Button-Playground.svg)



## Usage Guide
Buttons are primarily used to trigger actions, submit forms, or toggle between states. Depending on the specific context and user needs, buttons can appear in various modes—such as icon-only or split buttons—with different styles, including solid, outlined, or text-only, and states like active, disabled, or destructive, all to clearly communicate the intended interaction.
    ### Best Practices
	- **Choose styles based on action priority:** use Primary for main actions, Secondary for secondary options, and Tertiary for less prominent or lightweight interactions.
	- **Select the appropriate mode based on content:** utilize Icon Only, Leading Icon, Trailing Icon, or Split Button to improve clarity and flexibility.
	- **Keep label text concise and action-oriented:** start with a verb and focus on the intended task (e.g., “Save,” “Delete,” “Add”).
	- **Provide clear state feedback:** ensure consistent and intuitive visual cues for hover, focus, and disabled states.
	- **Maintain size consistency:** choose Small, Medium, or Large based on layout density to preserve visual harmony across the interface.

    ### When Not to Use
	- **For purely informational content:** use a Label or Text component instead of a button.
	- **When no real action is performed:** avoid using buttons merely for visual purposes to prevent misleading users.
	- **When combining multiple actions without distinction:** if both primary and secondary actions are needed, use a Split Button or pair with a Dropdown to clearly differentiate them.

    ### Action Flow
	1. When a user clicks the button, it triggers the associated logic—such as submitting a form, navigating to another page, expanding a menu, or opening a dialog. The button’s style (e.g., Primary or Danger) helps convey the nature of the action.
	2. After the interaction, the button may transition into different states (such as Loading or Disabled) and offer visual feedback like a press animation or color shift.
	3. For **Split Buttons**, the main button executes the primary action, while the arrow on the right reveals a dropdown menu for selecting additional options.
	4. If the button is in a **Disabled** state, clicking it has no effect. In such cases, consider providing supplementary guidance—such as a tooltip explaining why the action is unavailable.




## Modes
    ### Basic
        In scenarios where the purpose of the action is singular and clearly communicated, a text-only button offers the most straightforward solution. Commonly used for form submissions, confirmation actions, or navigation switches, this style helps maintain a clean interface and reduces cognitive load on the user.

        ![圖片](../img/Button-Mode-Basic.svg)

    ### Icon
        When visual cues are necessary to reinforce the intent of an action, buttons with icons can enhance recognition. Typical configurations include:
        - **Leading Icon:** Positioned to the left of the label, ideal for emphasizing action type (e.g., Add, Download).
	    - **Trailing Icon:** Placed on the right, often used for secondary hints (e.g., Dropdown, More options).
	    - **Icon Only:** Displays only the icon, frequently seen in toolbars, mobile interfaces, or repeated actions to conserve space.

        **Note:** Icon-only buttons should always be paired with a tooltip to ensure clear affordance and accessibility.

        ![圖片](../img/Button-Mode-Icon.svg)

    ### Composite
        For complex actions requiring multiple behaviors or grouped presentation, the following button types are recommended:
	    - **Split Button:** Combines a primary action with a dropdown for alternate options—ideal when a default action is available, but flexibility is also needed.
	    - **Button Group:** Aligns multiple buttons side-by-side, often used for view toggles (e.g., table/grid), filters, or multi-step actions.

        ![圖片](../img/Button-Mode-Composite.svg)


## Appearance
    ### Anatomy
    1. **Container:** The structural frame of the button, which varies by variant. It may include a solid background, border, or transparent fill. Designed with appropriate padding, borders, and corner radius to define a clear and accessible click area.
	2. **Label:** The primary text that conveys the button’s intent. It may take the form of a verb (e.g., Submit), noun (e.g., Settings), or status (e.g., Loading…).
	3. **Icon:** An optional visual cue that can appear before (leading), after (trailing), or in place of the label (Icon Only). Icons improve recognition and help communicate action type.
	4. **Addon:** Additional UI elements for enhanced functionality in specific scenarios—such as dropdown arrows (Split Button), numeric badges, or loading spinners.


    ### Variants
    - **Primary** ( `contained` ): Designed for the most critical actions, Primary buttons carry the highest visual weight. They are ideal for submissions, confirmations, or any key operation. Typically rendered in a bold color such as blue or the brand’s primary hue.
    - **Secondary** ( `outlined` ): Used for secondary actions, these buttons are visually less prominent than Primary but still interactive. Suitable for actions like Cancel, Back, or non-critical options.
    - **Tertiary** ( `text` ): The lightest visual style—no borders or background, just text with subtle hover effects. Best used in low-disruption contexts like cards, tables, or inline actions.

    ### States
    We categorize button states into two major types: Interaction States and Visual Intents—enabling both designers and developers to maintain consistent semantics and styling.

        #### Visaul Intents 
        - `primary`(Blue tone): Signals a primary action. 
        - `secondary`(Neutral tones): Represents standard actions.
        - `danger`(Red tone): Indicates destructive or high-risk actions such as Delete, Remove, or Reset. Must be clearly distinguished to prevent accidental clicks.
        - `loading`: Denotes an in-progress state. Includes a spinner and disables interaction to prevent duplicate actions.

        #### Interaction States
        - **Enabled:** The default state—fully interactive and ready for user engagement.
        - **Hover:** Activated on mouseover, providing immediate visual feedback to improve discoverability.
        - **Focused:** Triggered when a button is focused via keyboard navigation (e.g., Tab), enhancing accessibility.
	    - `disabled` : Non-interactive and visually muted. Typically used when preconditions are unmet or permissions are restricted.

    <!--![圖片](../img/DatePicker-State.svg)-->

    ### Sizes
    To accommodate varying interface densities and interaction requirements, three button sizes are available:
	- `"small"` : Ideal for compact areas such as toolbars, data tables, or search bars. Features reduced height, smaller typography, and smaller icons.
	- `"medium"` : The default size, suited for forms, modals, and general UI actions. Balances clickability with spatial efficiency.
	- `"large"` : Best for prominent actions—such as homepage CTAs, process navigation buttons, or full-width layouts. Offers greater visual emphasis and clearer directional guidance.
    
    <!--![圖片](../img/DatePicker-Size.svg)-->
    


---



## Custom Disable
    <!-- 控制使用者在什麼條件下不能選某些日期或時間，通常牽涉到業務邏輯判斷 + callback 函式設定 -->
    



## Validation / Restrictions



    
## Integration
     <!-- 元件「如何與其他應用層、框架、資料結構或函式庫協同工作」的方式 = 怎麼接進系統 -->
    ### Date Library
        <!-- 元件底層使用哪個日期函式庫（Moment、Dayjs、Luxon 等）來處理時間格式、加減時間、判斷區間 --> 
        

    ### Formatting
        <!-- 要控制 UI 顯示格式、要把資料送出給後端／儲存在資料庫，格式需要一致、多語系（不同 locale）時會有顯示差異 -->
        

    <!-- ### Timezone Handling -->
        <!-- 如果要支援跨時區（例如伺服器是 UTC，使用者端是本地時間），需要說明怎麼處裏時差問題。 -->


    <!-- ### Locale Support -->
        <!-- 多語系支援（例如 en-US vs zh-TW），可能影響日期名稱、星期起始日（Monday or Sunday）等等。 -->



## Props Overview
     <!-- Appearance 控制外型、Behavior 控制互動行為、Data 資料處理、Validation 驗證相關、Events 事件回呼、Integration 整合支援 --> 
    ### Appearance
        


    ### Behavior
        
        

    ### Data
        


    ### Validation
        


    ### Events
        


    ### Integration