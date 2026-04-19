import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { flip, type Middleware, shift } from '@floating-ui/dom';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import { getCSSVariablePixelValue } from '@mezzanine-ui/ng/utils';
import { MznPopper, type PopperPlacement } from './popper.component';
import { MznButton } from '../button/button.directive';

export default {
  title: 'Internal/Popper',
  decorators: [
    moduleMetadata({
      imports: [MznPopper, MznButton, MznTypography],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

/**
 * 對齊 React `Popper.stories.tsx:16-31` 的 `DemoPopperContent`:
 * 白底圓角、2px 黑灰陰影、80px 寬,中央放一個 Typography 文字「Content」。
 * Angular 不支援 story 間共享 JSX fragment,改用一個獨立 @Component 讓 5 個
 * story 都能 reuse 同一份內容。
 */
@Component({
  selector: 'story-popper-demo-content',
  standalone: true,
  imports: [MznTypography],
  template: `
    <div
      style="align-items: center; background-color: white; border-radius: 5px; box-shadow: 0px 2px 4px grey; display: flex; justify-content: center; padding: 10px; width: 80px;"
    >
      <span mznTypography color="text-neutral">Content</span>
    </div>
  `,
})
class DemoPopperContentComponent {}

/**
 * 對齊 React `Popper.stories.tsx:107-115`:offset 從
 * `--mzn-spacing-gap-base` 讀,React 用 `parseFloat(rem 值) * 16` 換算成 px。
 * Angular 有同等工具 `getCSSVariablePixelValue`,可一步完成 rem / px 判讀。
 * React 預設沒有 flip middleware,Angular MznPopper 有,各 story 傳
 * `[disableFlip]="true"` 關閉以保留 React 的「placement 永遠忠於指定」行為。
 */
const OFFSET_MAIN_AXIS = getCSSVariablePixelValue('--mzn-spacing-gap-base', 8);

// ─── Basic ──────────────────────────────────────────────────────────

@Component({
  selector: 'story-popper-basic',
  standalone: true,
  imports: [MznPopper, MznButton, MznTypography, DemoPopperContentComponent],
  template: `
    <div style="display: flex; gap: 10px;">
      <div
        mznPopper
        [anchor]="hoverAnchor()"
        [open]="hoverAnchor() !== null"
        [disableFlip]="true"
      >
        <story-popper-demo-content />
      </div>
      <button
        #hoverBtn
        mznButton
        variant="base-primary"
        (mouseenter)="hoverAnchor.set(hoverBtn)"
        (mouseleave)="hoverAnchor.set(null)"
      >
        Hover me
      </button>
      <button
        #clickBtn
        mznButton
        variant="base-primary"
        (click)="
          clickAnchor() === clickBtn
            ? clickAnchor.set(null)
            : clickAnchor.set(clickBtn)
        "
      >
        Click me
      </button>
      <div
        mznPopper
        [anchor]="clickAnchor()"
        [open]="clickAnchor() !== null"
        [disableFlip]="true"
      >
        <story-popper-demo-content />
      </div>
    </div>
  `,
})
class PopperBasicComponent {
  readonly hoverAnchor = signal<HTMLElement | null>(null);
  readonly clickAnchor = signal<HTMLElement | null>(null);
}

export const Basic: Story = {
  decorators: [moduleMetadata({ imports: [PopperBasicComponent] })],
  render: () => ({
    template: `<story-popper-basic />`,
  }),
};

// ─── Placement ──────────────────────────────────────────────────────

@Component({
  selector: 'story-popper-placement',
  standalone: true,
  imports: [MznPopper, MznButton, DemoPopperContentComponent],
  template: `
    <div
      style="display: inline-grid; gap: 30px; grid-auto-rows: minmax(min-content, max-content); grid-template-columns: repeat(5, max-content); justify-content: center; margin-top: 50px; width: 100%;"
    >
      <div
        mznPopper
        [anchor]="anchor()"
        [open]="anchor() !== null"
        [placement]="placement()"
        [offsetOptions]="offsetOptions"
        [disableFlip]="true"
      >
        <story-popper-demo-content />
      </div>
      <div></div>
      <button
        #ts
        mznButton
        variant="base-primary"
        (click)="setAnchor('top-start', ts)"
        >top-start</button
      >
      <button #t mznButton variant="base-primary" (click)="setAnchor('top', t)"
        >top</button
      >
      <button
        #te
        mznButton
        variant="base-primary"
        (click)="setAnchor('top-end', te)"
        >top-end</button
      >
      <div></div>
      <button
        #ls
        mznButton
        variant="base-primary"
        (click)="setAnchor('left-start', ls)"
        >left-start</button
      >
      <div></div>
      <div></div>
      <div></div>
      <button
        #rs
        mznButton
        variant="base-primary"
        (click)="setAnchor('right-start', rs)"
        >right-start</button
      >
      <button #l mznButton variant="base-primary" (click)="setAnchor('left', l)"
        >left</button
      >
      <div></div>
      <div></div>
      <div></div>
      <button
        #r
        mznButton
        variant="base-primary"
        (click)="setAnchor('right', r)"
        >right</button
      >
      <button
        #le
        mznButton
        variant="base-primary"
        (click)="setAnchor('left-end', le)"
        >left-end</button
      >
      <div></div>
      <div></div>
      <div></div>
      <button
        #re
        mznButton
        variant="base-primary"
        (click)="setAnchor('right-end', re)"
        >right-end</button
      >
      <div></div>
      <button
        #bs
        mznButton
        variant="base-primary"
        (click)="setAnchor('bottom-start', bs)"
        >bottom-start</button
      >
      <button
        #b
        mznButton
        variant="base-primary"
        (click)="setAnchor('bottom', b)"
        >bottom</button
      >
      <button
        #be
        mznButton
        variant="base-primary"
        (click)="setAnchor('bottom-end', be)"
        >bottom-end</button
      >
      <div></div>
    </div>
  `,
})
class PopperPlacementComponent {
  readonly anchor = signal<HTMLElement | null>(null);
  readonly placement = signal<PopperPlacement>('top');
  protected readonly offsetOptions = { mainAxis: OFFSET_MAIN_AXIS };

  setAnchor(placement: PopperPlacement, el: HTMLElement): void {
    if (this.anchor() === el) {
      this.anchor.set(null);
    } else {
      this.placement.set(placement);
      this.anchor.set(el);
    }
  }
}

export const Placement: Story = {
  decorators: [moduleMetadata({ imports: [PopperPlacementComponent] })],
  render: () => ({
    template: `<story-popper-placement />`,
  }),
};

// ─── WithArrow ──────────────────────────────────────────────────────

@Component({
  selector: 'story-popper-with-arrow',
  standalone: true,
  imports: [MznPopper, MznButton, DemoPopperContentComponent],
  template: `
    <div
      style="display: inline-grid; gap: 30px; grid-auto-rows: minmax(min-content, max-content); grid-template-columns: repeat(5, max-content); justify-content: center; margin-top: 50px; width: 100%;"
    >
      <div
        mznPopper
        [anchor]="anchor()"
        [open]="anchor() !== null"
        [placement]="placement()"
        [offsetOptions]="offsetOptions"
        [arrowOptions]="arrowOptions"
        [disableFlip]="true"
      >
        <story-popper-demo-content />
      </div>
      <div></div>
      <button
        #ts
        mznButton
        variant="base-primary"
        (click)="setAnchor('top-start', ts)"
        >top-start</button
      >
      <button #t mznButton variant="base-primary" (click)="setAnchor('top', t)"
        >top</button
      >
      <button
        #te
        mznButton
        variant="base-primary"
        (click)="setAnchor('top-end', te)"
        >top-end</button
      >
      <div></div>
      <button
        #ls
        mznButton
        variant="base-primary"
        (click)="setAnchor('left-start', ls)"
        >left-start</button
      >
      <div></div>
      <div></div>
      <div></div>
      <button
        #rs
        mznButton
        variant="base-primary"
        (click)="setAnchor('right-start', rs)"
        >right-start</button
      >
      <button #l mznButton variant="base-primary" (click)="setAnchor('left', l)"
        >left</button
      >
      <div></div>
      <div></div>
      <div></div>
      <button
        #r
        mznButton
        variant="base-primary"
        (click)="setAnchor('right', r)"
        >right</button
      >
      <button
        #le
        mznButton
        variant="base-primary"
        (click)="setAnchor('left-end', le)"
        >left-end</button
      >
      <div></div>
      <div></div>
      <div></div>
      <button
        #re
        mznButton
        variant="base-primary"
        (click)="setAnchor('right-end', re)"
        >right-end</button
      >
      <div></div>
      <button
        #bs
        mznButton
        variant="base-primary"
        (click)="setAnchor('bottom-start', bs)"
        >bottom-start</button
      >
      <button
        #b
        mznButton
        variant="base-primary"
        (click)="setAnchor('bottom', b)"
        >bottom</button
      >
      <button
        #be
        mznButton
        variant="base-primary"
        (click)="setAnchor('bottom-end', be)"
        >bottom-end</button
      >
      <div></div>
    </div>
  `,
})
class PopperWithArrowComponent {
  readonly anchor = signal<HTMLElement | null>(null);
  readonly placement = signal<PopperPlacement>('top');
  protected readonly offsetOptions = { mainAxis: OFFSET_MAIN_AXIS };
  protected readonly arrowOptions = {
    enabled: true,
    className: 'foo',
    padding: 0,
  };

  setAnchor(placement: PopperPlacement, el: HTMLElement): void {
    if (this.anchor() === el) {
      this.anchor.set(null);
    } else {
      this.placement.set(placement);
      this.anchor.set(el);
    }
  }
}

export const WithArrow: Story = {
  decorators: [moduleMetadata({ imports: [PopperWithArrowComponent] })],
  render: () => ({
    template: `<story-popper-with-arrow />`,
  }),
};

// ─── WithMiddleware ─────────────────────────────────────────────────

/**
 * 對齊 React `Popper.stories.tsx:253-280`:示範 `shift` + `flip` middleware
 * 組合。這裡明確關掉 MznPopper 內建 `flip`(`disableFlip=true`),由自定
 * middleware 清單處理翻面,並加上 `fallbackAxisSideDirection: 'end'` 讓
 * 空間不足時偏向 `-end` 對齊位置。
 */
@Component({
  selector: 'story-popper-with-middleware',
  standalone: true,
  imports: [MznPopper, MznButton, MznTypography, DemoPopperContentComponent],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 20px; height: 200vh; padding-top: 50vh;"
    >
      <span mznTypography variant="body">
        Scroll to test flip and shift middleware
      </span>
      <div
        mznPopper
        [anchor]="anchor()"
        [open]="anchor() !== null"
        placement="top"
        [offsetOptions]="offsetOptions"
        [arrowOptions]="arrowOptions"
        [middleware]="middleware"
        [disableFlip]="true"
      >
        <story-popper-demo-content />
      </div>
      <button
        #btn
        mznButton
        variant="base-primary"
        (click)="anchor() === btn ? anchor.set(null) : anchor.set(btn)"
      >
        Click me (with flip &amp; shift)
      </button>
    </div>
  `,
})
class PopperWithMiddlewareComponent {
  readonly anchor = signal<HTMLElement | null>(null);
  protected readonly offsetOptions = { mainAxis: OFFSET_MAIN_AXIS };
  protected readonly arrowOptions = {
    enabled: true,
    className: 'custom-arrow',
    padding: 0,
  };
  protected readonly middleware: ReadonlyArray<Middleware> = [
    shift(),
    flip({ fallbackAxisSideDirection: 'end' }),
  ];
}

export const WithMiddleware: Story = {
  decorators: [moduleMetadata({ imports: [PopperWithMiddlewareComponent] })],
  render: () => ({
    template: `<story-popper-with-middleware />`,
  }),
};

// ─── DisablePortal ──────────────────────────────────────────────────

/**
 * MznPopper 目前沒有 portal 行為(always in-place),跟 React `disablePortal`
 * 語義等同。這個 story 仍保留以對齊 React 的 story 目錄,並示範
 * `position: relative` 父層下的就地定位。
 */
@Component({
  selector: 'story-popper-disable-portal',
  standalone: true,
  imports: [MznPopper, MznButton, DemoPopperContentComponent],
  template: `
    <div style="display: flex; gap: 10px; position: relative;">
      <div
        mznPopper
        [anchor]="anchor()"
        [open]="anchor() !== null"
        placement="bottom"
        [offsetOptions]="offsetOptions"
        [disableFlip]="true"
      >
        <story-popper-demo-content />
      </div>
      <button
        #btn
        mznButton
        variant="base-primary"
        (click)="anchor() === btn ? anchor.set(null) : anchor.set(btn)"
      >
        Click me (no portal)
      </button>
    </div>
  `,
})
class PopperDisablePortalComponent {
  readonly anchor = signal<HTMLElement | null>(null);
  protected readonly offsetOptions = { mainAxis: OFFSET_MAIN_AXIS };
}

export const DisablePortal: Story = {
  decorators: [moduleMetadata({ imports: [PopperDisablePortalComponent] })],
  render: () => ({
    template: `<story-popper-disable-portal />`,
  }),
};
