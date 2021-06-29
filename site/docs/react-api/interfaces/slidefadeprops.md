[@mezzanine-ui/react - v0.5.2](../README.md) / [Exports](../modules.md) / SlideFadeProps

# Interface: SlideFadeProps

## Hierarchy

- `TransitionImplementationProps`

  ↳ **`SlideFadeProps`**

## Table of contents

### Properties

- [appear](slidefadeprops.md#appear)
- [children](slidefadeprops.md#children)
- [delay](slidefadeprops.md#delay)
- [direction](slidefadeprops.md#direction)
- [duration](slidefadeprops.md#duration)
- [easing](slidefadeprops.md#easing)
- [in](slidefadeprops.md#in)
- [keepMount](slidefadeprops.md#keepmount)
- [lazyMount](slidefadeprops.md#lazymount)
- [onEnter](slidefadeprops.md#onenter)
- [onEntered](slidefadeprops.md#onentered)
- [onEntering](slidefadeprops.md#onentering)
- [onExit](slidefadeprops.md#onexit)
- [onExited](slidefadeprops.md#onexited)
- [onExiting](slidefadeprops.md#onexiting)

## Properties

### appear

• `Optional` **appear**: `boolean`

Whether to perform the enter transition if `in` is true while it first mount

**`true`**

#### Inherited from

TransitionImplementationProps.appear

#### Defined in

[packages/react/src/Transition/Transition.tsx:63](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/Transition/Transition.tsx#L63)

___

### children

• `Optional` **children**: `ReactElement`<`TransitionImplementationChildProps`, ``"symbol"`` \| ``"object"`` \| ``"small"`` \| ``"a"`` \| ``"abbr"`` \| ``"address"`` \| ``"area"`` \| ``"article"`` \| ``"aside"`` \| ``"audio"`` \| ``"b"`` \| ``"base"`` \| ``"bdi"`` \| ``"bdo"`` \| ``"big"`` \| ``"blockquote"`` \| ``"body"`` \| ``"br"`` \| ``"button"`` \| ``"canvas"`` \| ``"caption"`` \| ``"cite"`` \| ``"code"`` \| ``"col"`` \| ``"colgroup"`` \| ``"data"`` \| ``"datalist"`` \| ``"dd"`` \| ``"del"`` \| ``"details"`` \| ``"dfn"`` \| ``"dialog"`` \| ``"div"`` \| ``"dl"`` \| ``"dt"`` \| ``"em"`` \| ``"embed"`` \| ``"fieldset"`` \| ``"figcaption"`` \| ``"figure"`` \| ``"footer"`` \| ``"form"`` \| ``"h1"`` \| ``"h2"`` \| ``"h3"`` \| ``"h4"`` \| ``"h5"`` \| ``"h6"`` \| ``"head"`` \| ``"header"`` \| ``"hgroup"`` \| ``"hr"`` \| ``"html"`` \| ``"i"`` \| ``"iframe"`` \| ``"img"`` \| ``"input"`` \| ``"ins"`` \| ``"kbd"`` \| ``"keygen"`` \| ``"label"`` \| ``"legend"`` \| ``"li"`` \| ``"link"`` \| ``"main"`` \| ``"map"`` \| ``"mark"`` \| ``"menu"`` \| ``"menuitem"`` \| ``"meta"`` \| ``"meter"`` \| ``"nav"`` \| ``"noindex"`` \| ``"noscript"`` \| ``"ol"`` \| ``"optgroup"`` \| ``"option"`` \| ``"output"`` \| ``"p"`` \| ``"param"`` \| ``"picture"`` \| ``"pre"`` \| ``"progress"`` \| ``"q"`` \| ``"rp"`` \| ``"rt"`` \| ``"ruby"`` \| ``"s"`` \| ``"samp"`` \| ``"slot"`` \| ``"script"`` \| ``"section"`` \| ``"select"`` \| ``"source"`` \| ``"span"`` \| ``"strong"`` \| ``"style"`` \| ``"sub"`` \| ``"summary"`` \| ``"sup"`` \| ``"table"`` \| ``"template"`` \| ``"tbody"`` \| ``"td"`` \| ``"textarea"`` \| ``"tfoot"`` \| ``"th"`` \| ``"thead"`` \| ``"time"`` \| ``"title"`` \| ``"tr"`` \| ``"track"`` \| ``"u"`` \| ``"ul"`` \| ``"var"`` \| ``"video"`` \| ``"wbr"`` \| ``"webview"`` \| ``"svg"`` \| ``"animate"`` \| ``"animateMotion"`` \| ``"animateTransform"`` \| ``"circle"`` \| ``"clipPath"`` \| ``"defs"`` \| ``"desc"`` \| ``"ellipse"`` \| ``"feBlend"`` \| ``"feColorMatrix"`` \| ``"feComponentTransfer"`` \| ``"feComposite"`` \| ``"feConvolveMatrix"`` \| ``"feDiffuseLighting"`` \| ``"feDisplacementMap"`` \| ``"feDistantLight"`` \| ``"feDropShadow"`` \| ``"feFlood"`` \| ``"feFuncA"`` \| ``"feFuncB"`` \| ``"feFuncG"`` \| ``"feFuncR"`` \| ``"feGaussianBlur"`` \| ``"feImage"`` \| ``"feMerge"`` \| ``"feMergeNode"`` \| ``"feMorphology"`` \| ``"feOffset"`` \| ``"fePointLight"`` \| ``"feSpecularLighting"`` \| ``"feSpotLight"`` \| ``"feTile"`` \| ``"feTurbulence"`` \| ``"filter"`` \| ``"foreignObject"`` \| ``"g"`` \| ``"image"`` \| ``"line"`` \| ``"linearGradient"`` \| ``"marker"`` \| ``"mask"`` \| ``"metadata"`` \| ``"mpath"`` \| ``"path"`` \| ``"pattern"`` \| ``"polygon"`` \| ``"polyline"`` \| ``"radialGradient"`` \| ``"rect"`` \| ``"stop"`` \| ``"switch"`` \| ``"text"`` \| ``"textPath"`` \| ``"tspan"`` \| ``"use"`` \| ``"view"`` \| (`props`: `TransitionImplementationChildProps`) => ``null`` \| `ReactElement`<`any`, `any`\> \| (`props`: `TransitionImplementationChildProps`) => `Component`<`TransitionImplementationChildProps`, `any`, `any`\>\>

#### Inherited from

TransitionImplementationProps.children

#### Defined in

[packages/react/src/Transition/Transition.tsx:40](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/Transition/Transition.tsx#L40)

___

### delay

• `Optional` **delay**: `number` \| { `enter`:  ; `exit`:   }

The delay of the transition, in milliseconds

#### Inherited from

TransitionImplementationProps.delay

#### Defined in

[packages/react/src/Transition/Transition.tsx:47](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/Transition/Transition.tsx#L47)

___

### direction

• `Optional` **direction**: ``"right"`` \| ``"left"`` \| ``"up"`` \| ``"down"``

The direction of child element will enter to.

**`default`** 'down'

#### Defined in

[packages/react/src/Transition/SlideFade.tsx:55](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/Transition/SlideFade.tsx#L55)

___

### duration

• `Optional` **duration**: `number` \| ``"auto"`` \| { `enter`:  ; `exit`:   }

The duration of the transition, in milliseconds

#### Inherited from

TransitionImplementationProps.duration

#### Defined in

[packages/react/src/Transition/Transition.tsx:71](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/Transition/Transition.tsx#L71)

___

### easing

• `Optional` **easing**: `string` \| { `enter`:  ; `exit`:   }

The timing function of the transition

#### Inherited from

TransitionImplementationProps.easing

#### Defined in

[packages/react/src/Transition/Transition.tsx:51](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/Transition/Transition.tsx#L51)

___

### in

• `Optional` **in**: `boolean`

The flag to trigger toggling transition between `enter` and `exit` state

**`default`** false

#### Inherited from

TransitionImplementationProps.in

#### Defined in

[packages/react/src/Transition/Transition.tsx:76](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/Transition/Transition.tsx#L76)

___

### keepMount

• `Optional` **keepMount**: `boolean`

Whether to keeping mounting the child if exited.

**`default`** false

#### Inherited from

TransitionImplementationProps.keepMount

#### Defined in

[packages/react/src/Transition/Transition.tsx:81](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/Transition/Transition.tsx#L81)

___

### lazyMount

• `Optional` **lazyMount**: `boolean`

Whether to mount the child at the first time entering.

**`default`** true

#### Inherited from

TransitionImplementationProps.lazyMount

#### Defined in

[packages/react/src/Transition/Transition.tsx:86](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/Transition/Transition.tsx#L86)

___

### onEnter

• `Optional` **onEnter**: `TransitionEnterHandler`

Callback fired before the `entering` state applied

#### Inherited from

TransitionImplementationProps.onEnter

#### Defined in

[packages/react/src/Transition/Transition.tsx:94](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/Transition/Transition.tsx#L94)

___

### onEntered

• `Optional` **onEntered**: `TransitionEnterHandler`

Callback fired after the `entered` state applied

#### Inherited from

TransitionImplementationProps.onEntered

#### Defined in

[packages/react/src/Transition/Transition.tsx:102](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/Transition/Transition.tsx#L102)

___

### onEntering

• `Optional` **onEntering**: `TransitionEnterHandler`

Callback fired after the `entering` state applied

#### Inherited from

TransitionImplementationProps.onEntering

#### Defined in

[packages/react/src/Transition/Transition.tsx:98](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/Transition/Transition.tsx#L98)

___

### onExit

• `Optional` **onExit**: `TransitionExitHandler`

Callback fired before the `exiting` state applied.

#### Inherited from

TransitionImplementationProps.onExit

#### Defined in

[packages/react/src/Transition/Transition.tsx:106](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/Transition/Transition.tsx#L106)

___

### onExited

• `Optional` **onExited**: `TransitionExitHandler`

Callback fired after the `exited` state applied.

#### Inherited from

TransitionImplementationProps.onExited

#### Defined in

[packages/react/src/Transition/Transition.tsx:114](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/Transition/Transition.tsx#L114)

___

### onExiting

• `Optional` **onExiting**: `TransitionExitHandler`

Callback fired after the `exiting` state applied.

#### Inherited from

TransitionImplementationProps.onExiting

#### Defined in

[packages/react/src/Transition/Transition.tsx:110](https://github.com/Mezzanine-UI/mezzanine/blob/83e0173/packages/react/src/Transition/Transition.tsx#L110)