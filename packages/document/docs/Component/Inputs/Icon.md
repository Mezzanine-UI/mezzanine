# Icon
Icons visually represent actions, states, or content, enhancing comprehension and usability across the interface.



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
	1. When used interactively (e.g., a clear or edit icon), clicking the icon triggers a defined event—such as resetting an input field or enabling an editable state.
	2. Icons may be accompanied by loading or disabled states to manage feedback and prevent duplicate actions.
	3. Static icons (e.g., for success or warning) don’t have interaction, but should use color or shape to reinforce their semantic meaning—like a green checkmark or a warning icon inside a colored circle.
	4. When embedded in other components (like a drag icon in a table), ensure interactive areas are clearly defined and distinguishable from static ones to prevent misclicks.




## Modes
    ### Basic
        

    

    ### Validations
        

    

    ### Loading
        

    


## Appearance
    ### Anatomy
    1. 

    ### Variants
    


    ### States
    


    ### Sizes
    
    

    


---



## Custom Disable
    <!-- 控制使用者在什麼條件下不能使用 -->
    



## Validation / Restrictions

    The table below outlines common validation items for **Icon**, along with their primary audience (Designer / Developer):
    | Item | Desctription | 🎨 Designer | 🛠️ Developer |
    |-------|-------|-------|-------|
    |  |  |  |  |

    
## Integration
     <!-- 元件「如何與其他應用層、框架、資料結構或函式庫協同工作」的方式 = 怎麼接進系統 -->
    ### 



## Props Overview
     <!-- Appearance 控制外型、Behavior 控制互動行為、Data 資料處理、Validation 驗證相關、Events 事件回呼、Integration 整合支援 --> 
    ### Appearance
        Manages the visual presentation and layout of the button, including size, variant, icon placement, and color schemes. These settings ensure consistency with the design system and maintain visual hierarchy across the interface.

        | Property | Description | Type | Default |
        |-------|-------|-------|-------|
        | **color** |  | <font color="#BD3B3B">``</font> |  |
        | **size** |  | <font color="#BD3B3B">``</font> |  |
        

    ### Behavior
        Controls the interactive behavior of the button, such as handling loading states, disabling interactions, and toggling danger styles. These props define how the button responds under different user interactions and system states.
        
        | Property | Description | Type | Default |
        |-------|-------|-------|-------|
        |  |  | <font color="#BD3B3B">``</font> |  |

        
    ### Data
        Handles data structure and content within the button, including icon components or children elements. Ensures that the button displays the correct content, and aligns with functional roles such as form submission or navigation.

        | Property | Description | Type | Default |
        |-------|-------|-------|-------|
        |  |  | <font color="#BD3B3B">``</font> |  |


    ### Validation
         


    ### Events
    


    ### Integration
        