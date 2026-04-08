import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznPopper } from './popper.component';
import { MznButton } from '../button/button.directive';

export default {
  title: 'Internal/Popper',
  decorators: [
    moduleMetadata({
      imports: [MznPopper, MznButton],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

@Component({
  selector: 'story-popper-basic',
  standalone: true,
  imports: [MznPopper, MznButton],
  template: `
    <div style="display: flex; gap: 10px; padding: 40px;">
      <div mznPopper [anchor]="hoverAnchor()" [open]="hoverAnchor() !== null">
        <div
          style="align-items: center; background-color: white; border-radius: 5px; box-shadow: 0px 2px 4px grey; display: flex; justify-content: center; padding: 10px; width: 80px;"
        >
          Content
        </div>
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
      <div mznPopper [anchor]="clickAnchor()" [open]="clickAnchor() !== null">
        <div
          style="align-items: center; background-color: white; border-radius: 5px; box-shadow: 0px 2px 4px grey; display: flex; justify-content: center; padding: 10px; width: 80px;"
        >
          Content
        </div>
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

@Component({
  selector: 'story-popper-placement',
  standalone: true,
  imports: [MznPopper, MznButton],
  template: `
    <div
      style="display: inline-grid; gap: 30px; grid-auto-rows: minmax(min-content, max-content); grid-template-columns: repeat(5, max-content); justify-content: center; margin-top: 50px; width: 100%;"
    >
      <div
        mznPopper
        [anchor]="anchor()"
        [open]="anchor() !== null"
        [placement]="placement()"
        [offsetOptions]="{ mainAxis: 8 }"
      >
        <div
          style="align-items: center; background-color: white; border-radius: 5px; box-shadow: 0px 2px 4px grey; display: flex; justify-content: center; padding: 10px; width: 80px;"
        >
          Content
        </div>
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
      <div></div><div></div><div></div>
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
      <div></div><div></div><div></div>
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
      <div></div><div></div><div></div>
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
  readonly placement = signal<string>('top');

  setAnchor(placement: string, el: HTMLElement): void {
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

@Component({
  selector: 'story-popper-with-arrow',
  standalone: true,
  imports: [MznPopper, MznButton],
  template: `
    <div
      style="display: inline-grid; gap: 30px; grid-auto-rows: minmax(min-content, max-content); grid-template-columns: repeat(5, max-content); justify-content: center; margin-top: 50px; width: 100%;"
    >
      <div
        mznPopper
        [anchor]="anchor()"
        [open]="anchor() !== null"
        [placement]="placement()"
        [offsetOptions]="{ mainAxis: 8 }"
        [arrowOptions]="{ enabled: true, className: 'foo', padding: 0 }"
      >
        <div
          style="align-items: center; background-color: white; border-radius: 5px; box-shadow: 0px 2px 4px grey; display: flex; justify-content: center; padding: 10px; width: 80px;"
        >
          Content
        </div>
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
      <div></div><div></div><div></div>
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
      <div></div><div></div><div></div>
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
      <div></div><div></div><div></div>
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
  readonly placement = signal<string>('top');

  setAnchor(placement: string, el: HTMLElement): void {
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

@Component({
  selector: 'story-popper-with-middleware',
  standalone: true,
  imports: [MznPopper, MznButton],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 20px; height: 200vh; padding-top: 50vh;"
    >
      <div>Scroll to test flip and shift middleware</div>
      <div
        mznPopper
        [anchor]="anchor()"
        [open]="anchor() !== null"
        placement="top"
        [offsetOptions]="{ mainAxis: 8 }"
        [arrowOptions]="{
          enabled: true,
          className: 'custom-arrow',
          padding: 0,
        }"
      >
        <div
          style="align-items: center; background-color: white; border-radius: 5px; box-shadow: 0px 2px 4px grey; display: flex; justify-content: center; padding: 10px; width: 80px;"
        >
          Content
        </div>
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
}

export const WithMiddleware: Story = {
  decorators: [moduleMetadata({ imports: [PopperWithMiddlewareComponent] })],
  render: () => ({
    template: `<story-popper-with-middleware />`,
  }),
};

@Component({
  selector: 'story-popper-disable-portal',
  standalone: true,
  imports: [MznPopper, MznButton],
  template: `
    <div style="display: flex; gap: 10px; position: relative; padding: 40px;">
      <div
        mznPopper
        [anchor]="anchor()"
        [open]="anchor() !== null"
        placement="bottom"
        [offsetOptions]="{ mainAxis: 8 }"
        strategy="fixed"
      >
        <div
          style="align-items: center; background-color: white; border-radius: 5px; box-shadow: 0px 2px 4px grey; display: flex; justify-content: center; padding: 10px; width: 80px;"
        >
          Content
        </div>
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
}

export const DisablePortal: Story = {
  decorators: [moduleMetadata({ imports: [PopperDisablePortalComponent] })],
  render: () => ({
    template: `<story-popper-disable-portal />`,
  }),
};
