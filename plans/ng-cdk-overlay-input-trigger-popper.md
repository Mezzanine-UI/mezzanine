# Angular CDK Overlay — MznInputTriggerPopper 重構設計

> 狀態：設計草稿（尚未動任何原始碼）
> 目標：將 `MznInputTriggerPopper` 從 `MznPopper` + `MznPortal`（floating-ui）改為
> Angular CDK `Overlay`，讓浮層真正 portal 到 `cdk-overlay-container`（body），
> consumer 的 DOM 子樹內不再殘留 `mzn-input-trigger-popper` host。

---

## 一、背景與問題

### 現況

```
consumer host
  └─ <div mznInputTriggerPopper>           ← host 仍在 consumer DOM
       └─ <div mznPortal ...>              ← 如 globalPortal=true 則搬到 #mzn-portal-container
            └─ <div mznPopper ...>         ← floating-ui 計算 position
                 └─ <ng-content />         ← consumer 的 dropdown 內容
```

- `mznPortal` 實作：建立 EmbeddedView 後把 rootNodes 直接 `appendChild` 到
  `#mzn-portal-container`。不是 Angular 正規 `PortalOutlet`，不走 CDK。
- `mznPopper`：floating-ui `computePosition` + `autoUpdate`，`position: absolute`，
  全域遞增 z-index（`--mzn-z-index-popover + popperOpenSequence`）。

### 問題

1. `mzn-input-trigger-popper` host element（含 `(click).stopPropagation` 等 host bindings）
   仍殘留在 consumer DOM 子樹，可能與 `overflow: hidden` / stacking context 互動。
2. React 的 `portal` 行為是把 popup 直接掛到 body，CDK Overlay 才等效。
3. 未來 ` OverlayContainer` 可以統一管理 z-index 疊加順序；floating-ui 的
   全域計數器是手工維護，與 CDK Overlay 的 `_attachedOverlays` 機制獨立。

---

## 二、Content Projection 問題與方案

### 問題核心

CDK Overlay 把內容裝進 `TemplatePortal`（`new TemplatePortal(tplRef, viewContainerRef)`），
然後呼叫 `overlayRef.attach(templatePortal)`。這要求拿到一個 `TemplateRef`。

目前 consumer 直接在 `mznInputTriggerPopper` host 的 **innerHTML** 寫 content：

```html
<!-- select.component.ts -->
<div #triggerPopper mznInputTriggerPopper ...>
  <div mznTranslate [in]="isOpen()" from="top">
    <ul [id]="listboxId" ...
      >...</ul
    >
  </div>
</div>
```

`ng-content` 是 view-projection，不是 `TemplateRef`，無法直接傳給 `TemplatePortal`。

### 方案比較

| 方案                                   | 破壞程度 | 可行性 | 說明                                                                                                                                                            |
| -------------------------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A. 包裝 ng-template：consumer 不變** | 無       | 高     | InputTriggerPopper 內部以 `<ng-template #content><ng-content /></ng-template>` 先捕獲，再用 `ViewChild` 拿 `TemplateRef`，建立 `TemplatePortal` 傳給 OverlayRef |
| B. Consumer 改傳 `TemplateRef` input   | 大       | 低     | Select/Cascader 都要改 template；breaking change                                                                                                                |
| C. `@ContentChild(TemplateRef)`        | 中       | 中     | Consumer 要改為 `<ng-template>` 包裝；breaking change                                                                                                           |

**採用方案 A**。關鍵：ng-content 投影到一個 `<ng-template>` 後，Angular 仍會追蹤
change detection（因為 EmbeddedView 掛在同一個 ViewContainerRef）。唯一注意點：
`TemplatePortal` 建立時需要 `ViewContainerRef`，使用元件自身的 `ViewContainerRef` 即可。

#### 方案 A 實作骨架

```typescript
// input-trigger-popper.component.ts (概念)
@Component({
  selector: '[mznInputTriggerPopper]',
  standalone: true,
  imports: [OverlayModule], // 只需 OverlayModule
  template: `<ng-template #content><ng-content /></ng-template>`,
})
export class MznInputTriggerPopper {
  @ViewChild('content', { static: true })
  private readonly contentTpl!: TemplateRef<unknown>;

  private readonly overlay = inject(Overlay);
  private readonly vcr = inject(ViewContainerRef);

  private overlayRef: OverlayRef | null = null;
  private portal: TemplatePortal | null = null;

  // ...inputs/effects...
}
```

注意：`<ng-template #content>` 本身不會渲染任何 DOM；`<ng-content>` 在 ng-template
內依然接受 consumer 的投影內容。這是 Angular Material、CDK 等官方元件的標準作法。

---

## 三、定位對應（floating-ui → CDK）

### 現況 floating-ui 行為

| 屬性            | 值                                          | 說明                                           |
| --------------- | ------------------------------------------- | ---------------------------------------------- |
| placement       | `bottom-start`                              | 固定（見 `protected readonly placement` 欄位） |
| offset mainAxis | 4                                           | anchor 到 floating 的垂直間距                  |
| flip            | 啟用（MznPopper 預設，`disableFlip=false`） | 空間不足時翻到 `top-start`                     |
| sameWidth       | 選用                                        | `size` middleware 設 `minWidth = anchor.width` |
| strategy        | `absolute`（MznPopper 預設）                | floating-ui strategy                           |
| hide            | 啟用                                        | anchor 被遮住時 `visibility: hidden`           |

### CDK FlexibleConnectedPositionStrategy 對應

#### 基礎定位（`bottom-start` + fallback `top-start`）

```typescript
const positionStrategy = createFlexibleConnectedPositionStrategy(injector, anchorEl)
  .withPositions([
    // 主 position：底部左齊（等同 bottom-start）
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 4, // mainAxis: 4
    },
    // flip fallback：頂部左齊（等同 top-start）
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -4,
    },
  ])
  .withFlexibleDimensions(false)
  .withPush(false); // 不 push，讓 fallback 位置自然接管
```

說明：

- CDK `withPositions` 陣列順序即優先順序，CDK 自動試第一個放不下就試第二個，
  等效於 floating-ui `flip` middleware。
- `offsetY: 4` 在 `originY: 'bottom'` + `overlayY: 'top'` 時為正值（往下偏移），
  在 `originY: 'top'` + `overlayY: 'bottom'` 時 offsetY 應為 `-4`（往上偏移）。
- 不需要 `withFlexibleDimensions(true)`，因為 overlay 寬度由 `sameWidth` 機制控制。

#### sameWidth 對應

floating-ui 用 `size` middleware 在 `apply` callback 設 `minWidth`；
CDK 沒有等效 middleware，改用兩種方式（擇一）：

**方式一（推薦）**：在 `OverlayConfig` 設 `minWidth`，每次 open 時同步計算：

```typescript
const anchorWidth = anchorEl.getBoundingClientRect().width;
overlayRef.updateSize({ minWidth: anchorWidth });
```

或在建立 `OverlayConfig` 時直接傳入：

```typescript
new OverlayConfig({
  minWidth: anchorEl.getBoundingClientRect().width,
  // ...
});
```

**方式二**：訂閱 `positionStrategy.positionChanges`，在每次 re-position 後
呼叫 `overlayRef.updateSize`（確保 resize 後 minWidth 同步更新）。

推薦方式一（簡單），因為 anchor 寬度通常在 open 時才需要同步一次；
若 anchor 本身也在 resize，可加 ResizeObserver 在 open 期間監聽並呼叫 `updateSize`。

#### hide middleware 對應

floating-ui `hide` 在 anchor 被遮住時將 floating 設 `visibility: hidden`。
CDK 無直接等效，可以：

- 省略（大多數 dropdown 用例不需要）
- 或訂閱 `positionStrategy.positionChanges`，判斷 `scrollableViewProperties.isOriginOutsideView`
  並自行設定 `overlayRef.overlayElement.style.visibility`。

**建議：先省略 hide，後續確有需求再補。**

#### scroll strategy

```typescript
new OverlayConfig({
  scrollStrategy: overlay.scrollStrategies.reposition(),
  // ...
});
```

`reposition` scroll strategy：scroll 時重新計算 overlay 位置，等效於 floating-ui `autoUpdate`。

---

## 四、open/close 生命週期 + z-index

### attach/detach 流程

```
open() → true
  └─ overlayRef 不存在 → 建立 overlayRef（createOverlay）
  └─ !overlayRef.hasAttached() → overlayRef.attach(templatePortal)
  └─ 同步 sameWidth（updateSize）
  └─ 遞增 z-index（見下）

open() → false
  └─ overlayRef?.hasAttached() → overlayRef.detach()
  （不 dispose，讓下次 open 複用同一個 overlayRef）

ngOnDestroy
  └─ overlayRef?.dispose()
```

### z-index 機制

現況：`popperOpenSequence`（模組級全域計數器）+ CSS var `--mzn-z-index-popover`。

CDK Overlay 的 `overlayElement`（`.cdk-overlay-pane`）會被附加到
`.cdk-overlay-container`；CDK 本身不自動管理 `z-index`（由 panelClass 控制）。

保留現有全域計數器機制，改為在 `overlayRef` attach 前呼叫：

```typescript
overlayRef.getConfig().panelClass; // 僅讀
// 或
overlayRef.overlayElement.style.zIndex = `calc(var(--mzn-z-index-popover) + ${++popperOpenSequence})`;
```

注意：CDK pane 的預設 z-index 由 CDK 全域 CSS 管理（`.cdk-overlay-container` z-index 1000）；
直接在 `overlayElement` 設 `style.zIndex` 可覆蓋，行為等同現況。

---

## 五、popperElRef — consumer 取 overlay element

### 現況

`select.component.ts` 的 click-away 邏輯：

```typescript
const popperEl = this.triggerPopperRef()?.popperElRef()?.nativeElement;
this.clickAway.listen([this.hostElRef.nativeElement, popperEl], ...);
```

`popperElRef` 是 `viewChild<ElementRef<HTMLElement>>('popperEl')`，
指向 `<div mznPopper>` 元素（位於 portal 中，但 viewChild 仍能解析）。

### CDK 版暴露方式

CDK `OverlayRef.overlayElement` 屬性即 `.cdk-overlay-pane`（`<div>` 直接在 overlay container 內）。

修改 `MznInputTriggerPopper` 的 `popperElRef` 暴露：

```typescript
// 移除 @ViewChild('popperEl')
// 改為 getter：
get popperElRef(): HTMLElement | null {
  return this.overlayRef?.overlayElement ?? null;
}
```

Consumer（Select）需對應調整：

```typescript
// 原：this.triggerPopperRef()?.popperElRef()?.nativeElement
// 新：this.triggerPopperRef()?.popperElRef
const popperEl = this.triggerPopperRef()?.popperElRef;
this.clickAway.listen([this.hostElRef.nativeElement, popperEl ?? undefined], ...);
```

`ClickAwayService.listen` 接受 `(HTMLElement | null | undefined)[]`，可以直接傳 `null`，
service 內部會過濾 falsy container（`if (container && container.contains(target))`）。

---

## 六、click-away 與 CDK Overlay 配合

### 問題

overlay 內容在 body 的 `.cdk-overlay-container > .cdk-overlay-pane` 內。
`ClickAwayService` 用 `container.contains(target)` 判斷「inside」。

### 解法

和現況相同：把 `overlayRef.overlayElement`（CDK pane）加入 containers 白名單。

```typescript
this.clickAway.listen([this.hostElRef.nativeElement, this.triggerPopperRef()?.popperElRef ?? null], () => this.isOpen.set(false), this.destroyRef);
```

Consumer 也可以直接使用 CDK 的 `overlayRef.outsidePointerEvents()` Observable，
但由於現有 `ClickAwayService` 已有 `requestAnimationFrame` 延遲等細節處理，
繼續沿用 ClickAwayService + 白名單方式**更安全**，不需遷移 consumer。

---

## 七、各 Consumer 逐項改動清單

### 7.1 MznSelect

**影響程度：小**

| 項目               | 原始碼位置                    | 改動                                                                                   |
| ------------------ | ----------------------------- | -------------------------------------------------------------------------------------- |
| template           | `select.component.ts:152-162` | 不變（`<div #triggerPopper mznInputTriggerPopper ...>`）                               |
| `popperElRef` 取法 | `select.component.ts:453`     | `triggerPopperRef()?.popperElRef()?.nativeElement` → `triggerPopperRef()?.popperElRef` |
| imports            | `select.component.ts:84-91`   | 不變（只 import `MznInputTriggerPopper`）                                              |

改動量：1 行（popperElRef 取值型別調整）。

### 7.2 MznCascader

**影響程度：零**（cascader 未使用 popperElRef，且未注入 ClickAwayService）

| 項目     | 原始碼位置                  | 改動                        |
| -------- | --------------------------- | --------------------------- |
| template | `cascader.component.ts:101` | 不變                        |
| TS       | `cascader.component.ts`     | 不變（無 popperElRef 使用） |

注意：cascader 有多層 panel（`visiblePanels` 動態展開），所有 panels 都在同一個
overlay pane 內（`<div mznInputTriggerPopper>` 的 `<ng-content>` 包含所有 panels），
CDK overlay 只有一個 pane，符合需求。

### 7.3 MznDropdown

**影響程度：零**

Dropdown 不使用 `MznInputTriggerPopper`，而是直接用 `MznPopper` + `MznPortal`
（`dropdown.component.ts:227-284`）。本次重構**不涉及** MznDropdown。

Dropdown 目前以 `data-mzn-dropdown-popper="true"` selector + `target.closest()`
做 click-away 判斷，無需調整。

---

## 八、與 flip PR 的衝突分析

### 現況確認

本 branch（main）的 `MznInputTriggerPopper`：

- `placement` 固定為 `'bottom-start'`（`protected readonly placement: PopperPlacement = 'bottom-start'`）
- flip 由 `MznPopper` 的 `disableFlip=false` 預設啟用（浮 flip input 尚未加到 InputTriggerPopper）

flip PR（另一 branch）計劃：在 `MznInputTriggerPopper` 加 `flip` input，
傳遞給 `MznPopper` 的 `disableFlip`。

### 衝突點

| 衝突     | 說明                                                                                                                                                                                      |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API 層級 | flip PR 新增 `flip: boolean` input 到 InputTriggerPopper，傳給 `[disableFlip]="!flip()"` 在 MznPopper。CDK 版本沒有 `disableFlip` 屬性。                                                  |
| 實作層   | flip PR 操控 floating-ui 的 `flip()` middleware；CDK 版用 `withPositions([..., fallback])` 達成等效效果。                                                                                 |
| 協調方案 | CDK 版的 `flip` input 語義可以保留（`input(true)`），只是改變 `withPositions` 陣列：`flip=true` 時帶兩個 positions（bottom-start + top-start fallback），`flip=false` 時只帶主 position。 |

**建議**：先完成本 CDK 重構（main branch），再 rebase flip PR 並把 flip 邏輯
從「傳 `disableFlip` 給 MznPopper」改為「影響 `withPositions` 陣列」。
flip PR 的 consumer API（`[flip]="true/false"` input）可以完全保留，
只有內部實作換掉。

---

## 九、OverlayModule 匯入位置

CDK 需要 `OverlayModule` 在 providers 鏈中（或透過 root injector 的 `importProvidersFrom`）。
由於 `MznInputTriggerPopper` 是 standalone component，直接在 `imports: [OverlayModule]` 即可。

或者使用 `inject(Overlay)` + `createFlexibleConnectedPositionStrategy(injector, origin)`
的 tree-shakeable standalone API，不需要 OverlayModule。

**推薦**：用 `inject(Overlay)` + `createFlexibleConnectedPositionStrategy(injector, ...)` 的方式，
不依賴 NgModule，符合 standalone 組件風格：

```typescript
import { Overlay } from '@angular/cdk/overlay';
import { createFlexibleConnectedPositionStrategy, TemplatePortal } from '@angular/cdk/overlay';
// TemplatePortal 從 @angular/cdk/portal
import { TemplatePortal } from '@angular/cdk/portal';
```

---

## 十、完整元件設計草稿

以下為新版 `MznInputTriggerPopper` 的設計骨架（供審閱，非最終程式碼）：

```typescript
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, Injector, TemplateRef, ViewChild, ViewContainerRef, effect, inject, input, signal } from '@angular/core';
import { inputTriggerPopperClasses as classes } from '@mezzanine-ui/core/_internal/input-trigger-popper';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { createFlexibleConnectedPositionStrategy } from '@angular/cdk/overlay';

let popperOpenSequence = 0;

@Component({
  selector: '[mznInputTriggerPopper]',
  standalone: true,
  imports: [], // OverlayModule 不需要 import，Overlay service 由 root injector 提供
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass',
    '[attr.anchor]': 'null',
    '[attr.globalPortal]': 'null',
    '[attr.open]': 'null',
    '[attr.sameWidth]': 'null',
  },
  template: `<ng-template #content><ng-content /></ng-template>`,
})
export class MznInputTriggerPopper {
  readonly anchor = input.required<HTMLElement | ElementRef<HTMLElement>>();
  readonly globalPortal = input(true);
  readonly open = input(false);
  readonly sameWidth = input(false);

  @ViewChild('content', { static: true })
  private readonly contentTpl!: TemplateRef<unknown>;

  private readonly overlay = inject(Overlay);
  private readonly vcr = inject(ViewContainerRef);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);

  private overlayRef: OverlayRef | null = null;
  private templatePortal: TemplatePortal<unknown> | null = null;

  protected readonly hostClass = classes.host;
  private readonly zIndex = signal('var(--mzn-z-index-popover)');

  // 暴露 overlay element 給 consumer 做 click-away 白名單
  get popperElRef(): HTMLElement | null {
    return this.overlayRef?.overlayElement ?? null;
  }

  constructor() {
    effect(() => {
      const isOpen = this.open();
      const anchorRaw = this.anchor();
      const anchorEl = anchorRaw instanceof ElementRef ? anchorRaw.nativeElement : anchorRaw;

      if (isOpen) {
        if (!this.overlayRef) {
          const positionStrategy = createFlexibleConnectedPositionStrategy(this.injector, anchorEl)
            .withPositions([
              {
                originX: 'start',
                originY: 'bottom',
                overlayX: 'start',
                overlayY: 'top',
                offsetY: 4,
              },
              {
                originX: 'start',
                originY: 'top',
                overlayX: 'start',
                overlayY: 'bottom',
                offsetY: -4,
              },
            ])
            .withFlexibleDimensions(false)
            .withPush(false);

          const config = new OverlayConfig({
            positionStrategy,
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
            ...(this.sameWidth() ? { minWidth: anchorEl.getBoundingClientRect().width } : {}),
          });

          this.overlayRef = this.overlay.create(config);
        } else if (this.sameWidth()) {
          // anchor 可能 resize，每次 open 時同步 minWidth
          this.overlayRef.updateSize({
            minWidth: anchorEl.getBoundingClientRect().width,
          });
        }

        if (!this.templatePortal) {
          this.templatePortal = new TemplatePortal(this.contentTpl, this.vcr);
        }

        if (!this.overlayRef.hasAttached()) {
          this.overlayRef.attach(this.templatePortal);
        }

        // z-index 遞增，覆蓋 CDK pane 的預設層級
        this.overlayRef.overlayElement.style.zIndex = `calc(var(--mzn-z-index-popover) + ${++popperOpenSequence})`;
      } else {
        if (this.overlayRef?.hasAttached()) {
          this.overlayRef.detach();
        }
      }
    });

    this.destroyRef.onDestroy(() => {
      this.overlayRef?.dispose();
      this.overlayRef = null;
      this.templatePortal = null;
    });
  }
}
```

---

## 十一、DOM 結構對比

### 重構前

```
<body>
  #mzn-portal-container
    <div mznPopper style="position:absolute; top:Xpx; left:Ypx; z-index:Z">
      <div mznTranslate ...>   <-- consumer 的 ng-content 內容
        <ul>...</ul>
      </div>
    </div>

  [consumer 原位]
    <div mznSelect>
      ...trigger...
      <div mznInputTriggerPopper>  <-- HOST 殘留在 consumer DOM
        <div mznPortal>            <-- 空殼，內容已被移到 portal-container
        </div>
      </div>
    </div>
```

### 重構後

```
<body>
  .cdk-overlay-container        <-- CDK 管理，由 OverlayContainer service 建立
    .cdk-overlay-pane           <-- overlayRef.overlayElement；z-index 由此設定
      <div>                     <-- ng-template #content 的投影內容
        <div mznTranslate ...>
          <ul>...</ul>
        </div>
      </div>

  [consumer 原位]
    <div mznSelect>
      ...trigger...
      <div mznInputTriggerPopper>  <-- HOST 仍在 consumer DOM（selector 是屬性）
        <!-- ng-template，不渲染任何 DOM 節點 -->
      </div>
    </div>
```

備註：`[mznInputTriggerPopper]` 是屬性 selector，host element 本身（`<div>`）仍在
consumer DOM 中，這是 Angular 屬性 selector 的固有行為，無法移除 host 元素本身。
但 host 內部不再有任何可見 DOM（`<ng-template>` 不生成 DOM），達到等效效果。

---

## 十二、風險與驗證點

| 風險                               | 嚴重度 | 說明                                                                                                                                                                | 驗證方式                                                                                                                                                       |
| ---------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **change detection 不觸發**        | 高     | TemplatePortal 的 EmbeddedView 在 CDK pane 內，Angular change detection 走 root→pane 路徑；OnPush 元件若 signal 更新不在 zone 內可能不觸發                          | 打開 Select 後確認選項可點擊、translate 動畫有效                                                                                                               |
| **sameWidth 不同步**               | 中     | `getBoundingClientRect()` 在 open effect 執行時 anchor 可能尚未 layout                                                                                              | 對比觸發器與 overlay 寬度，測試不同 anchor 尺寸                                                                                                                |
| **cascader 多層 panel**            | 中     | cascader visiblePanels 是動態 @for，content 全在同一個 ng-content 內，應在同一 overlay pane 顯示                                                                    | 開 cascader 逐層選取，確認 panels 同時可見                                                                                                                     |
| **click-away 白名單**              | 高     | popperElRef 從 viewChild 改為 getter，若 consumer 在 overlay attach 前讀取（overlayRef=null）會拿到 null                                                            | 在 open effect 之後（isOpen=true）consumer 才讀取 popperElRef；確認 ClickAwayService.listen 能過濾 null                                                        |
| **z-index 疊加競爭**               | 中     | InputTriggerPopper 的 popperOpenSequence 與 MznDropdown 的 mznDropdownPopperSequence 是獨立計數器，重構後改設在 overlayElement.style.zIndex，行為不變               | 測試 Select + Dropdown 同時開啟，確認後開的在前                                                                                                                |
| **OverlayContainer 需 CDK styles** | 低     | CDK overlay 需要 `@angular/cdk/overlay/index.css`，確認已在全域 styles 或 angular.json 匯入                                                                         | 開啟後確認 `.cdk-overlay-container` 存在於 body                                                                                                                |
| **SSR / Universal**                | 低     | `getBoundingClientRect` 在 SSR 回傳 0，若 sameWidth=true 可能設 minWidth:0                                                                                          | 加 `isPlatformBrowser` guard                                                                                                                                   |
| **host 的 click.stopPropagation**  | 中     | 現有 host binding `(click)/$event.stopPropagation()` 是為了防止 consumer 的 click handler 被觸發；CDK pane 內容不在 host DOM 子樹，這個 binding 對 overlay 內容失效 | 需把 stopPropagation 移到 overlay pane 上（`overlayElement.addEventListener('click', e => e.stopPropagation())`）或透過 panelClass + CSS `pointer-events` 處理 |
| **touchstart/move/end**            | 中     | 現有 host 綁 touchstart/move/end stopPropagation；CDK pane 同樣需要                                                                                                 | 同上，在 overlayRef attach 後對 overlayElement 加 touch listener                                                                                               |

---

## 十三、實作順序建議

1. 確認 `@angular/cdk/overlay` CDK styles 已被全域匯入（`angular.json` styles）
2. 實作新版 `input-trigger-popper.component.ts`（CDK Overlay，不破壞 selector / input API）
3. 調整 `popperElRef`：從 `viewChild<ElementRef>` 改為 getter 回傳 `HTMLElement | null`
4. 調整 `select.component.ts`：`popperElRef()?.nativeElement` → `popperElRef`（型別調整）
5. 確認 cascader 不需改動
6. 確認 dropdown 不需改動
7. 跑 parity 比對（`npm run parity -- select`、`npm run parity -- cascader`）
8. 手動驗證 click-away / z-index / sameWidth / touch 行為

---

## 附錄：現有元件依賴關係

```
MznInputTriggerPopper
  consumers (直接 import):
    MznSelect           select.component.ts
    MznCascader         cascader.component.ts

  NOT a consumer (自帶 MznPopper + MznPortal):
    MznDropdown         dropdown.component.ts
    MznBreadcrumbOverflowMenu  breadcrumb-overflow-menu.component.ts

  依賴的 internal:
    MznPopper           popper.component.ts         [重構後移除]
    MznPortal           portal/portal.component.ts  [重構後移除]
    @floating-ui/dom    size middleware              [重構後移除]
    @angular/cdk/overlay                            [重構後新增]
    @angular/cdk/portal TemplatePortal              [重構後新增]
```
