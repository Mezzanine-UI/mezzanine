import { Component, Input, OnChanges } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import type {
  MotionDurationType,
  MotionEasingType,
} from '@mezzanine-ui/system/motion';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import { ChevronUpIcon } from '@mezzanine-ui/icons';
import { FormsModule } from '@angular/forms';
import { MznToggle } from '../toggle/toggle.component';
import { MznButton } from '../button/button.directive';
import { MznIcon } from '../icon/icon.component';
import { MznCollapse } from './collapse.directive';
import { MznFade } from './fade.directive';
import { MznRotate } from './rotate.directive';
import { MznScale } from './scale.directive';
import { MznSlide } from './slide.directive';
import { MznTranslate } from './translate.directive';

const durations: MotionDurationType[] = [
  'fast',
  'moderate',
  'slow',
  'loop',
  'pauseShort',
  'pauseLong',
];

const easings: MotionEasingType[] = ['entrance', 'exit', 'standard'];

const defaultArgs = {
  durationEnter: 'moderate' as MotionDurationType,
  durationExit: 'moderate' as MotionDurationType,
  easingEnter: 'standard' as MotionEasingType,
  easingExit: 'standard' as MotionEasingType,
};

const defaultArgTypes = {
  durationEnter: {
    options: durations,
    control: { type: 'select' as const },
    description: 'Duration of the enter transition.',
    table: { defaultValue: { summary: 'moderate' } },
  },
  durationExit: {
    options: durations,
    control: { type: 'select' as const },
    description: 'Duration of the exit transition.',
    table: { defaultValue: { summary: 'moderate' } },
  },
  easingEnter: {
    options: easings,
    control: { type: 'select' as const },
    description: 'Easing of the enter transition.',
    table: { defaultValue: { summary: 'standard' } },
  },
  easingExit: {
    options: easings,
    control: { type: 'select' as const },
    description: 'Easing of the exit transition.',
    table: { defaultValue: { summary: 'standard' } },
  },
};

// ─── Fade ─────────────────────────────────────────

@Component({
  selector: 'story-fade',
  standalone: true,
  imports: [FormsModule, MznToggle, MznFade],
  template: `
    <div mznToggle [(ngModel)]="checked" size="main"></div>
    <div
      mznFade
      [in]="checked"
      [duration]="{ enter: enterDuration, exit: exitDuration }"
      [easing]="{ enter: enterEasing, exit: exitEasing }"
    >
      <div
        style="width: 200px; height: 200px; background: var(--mzn-color-background-brand);"
      ></div>
    </div>
  `,
})
class FadeStoryComponent implements OnChanges {
  @Input() durationEnter: MotionDurationType = 'moderate';
  @Input() durationExit: MotionDurationType = 'moderate';
  @Input() easingEnter: MotionEasingType = 'standard';
  @Input() easingExit: MotionEasingType = 'standard';

  checked = false;
  enterDuration: number = MOTION_DURATION.moderate;
  exitDuration: number = MOTION_DURATION.moderate;
  enterEasing: string = MOTION_EASING.standard;
  exitEasing: string = MOTION_EASING.standard;

  ngOnChanges(): void {
    this.enterDuration = MOTION_DURATION[this.durationEnter];
    this.exitDuration = MOTION_DURATION[this.durationExit];
    this.enterEasing = MOTION_EASING[this.easingEnter];
    this.exitEasing = MOTION_EASING[this.easingExit];
  }
}

// ─── Scale ────────────────────────────────────────

@Component({
  selector: 'story-scale',
  standalone: true,
  imports: [FormsModule, MznToggle, MznScale],
  template: `
    <div mznToggle [(ngModel)]="checked" size="main"></div>
    <div
      mznScale
      [in]="checked"
      [duration]="{ enter: enterDuration, exit: exitDuration }"
      [easing]="{ enter: enterEasing, exit: exitEasing }"
      [transformOrigin]="transformOrigin"
      [keepMount]="true"
    >
      <div
        style="width: 200px; height: 200px; background: var(--mzn-color-background-brand);"
      ></div>
    </div>
  `,
})
class ScaleStoryComponent implements OnChanges {
  @Input() durationEnter: MotionDurationType = 'moderate';
  @Input() durationExit: MotionDurationType = 'moderate';
  @Input() easingEnter: MotionEasingType = 'standard';
  @Input() easingExit: MotionEasingType = 'standard';
  @Input() transformOrigin: string = 'initial';

  checked = false;
  enterDuration: number = MOTION_DURATION.moderate;
  exitDuration: number = MOTION_DURATION.moderate;
  enterEasing: string = MOTION_EASING.standard;
  exitEasing: string = MOTION_EASING.standard;

  ngOnChanges(): void {
    this.enterDuration = MOTION_DURATION[this.durationEnter];
    this.exitDuration = MOTION_DURATION[this.durationExit];
    this.enterEasing = MOTION_EASING[this.easingEnter];
    this.exitEasing = MOTION_EASING[this.easingExit];
  }
}

// ─── Collapse ────────────────────────────────────

@Component({
  selector: 'story-collapse',
  standalone: true,
  imports: [FormsModule, MznToggle, MznCollapse],
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div mznToggle [(ngModel)]="checked" size="main"></div>
      <div mznCollapse [in]="checked" [collapsedHeight]="collapsedHeight">
        <div
          style="padding: 16px; background: var(--mzn-color-background-brand); color: white;"
        >
          <p>This content can be collapsed and expanded.</p>
          <p>It measures its height automatically and animates smoothly.</p>
          <p>The duration is auto-calculated based on content height.</p>
        </div>
      </div>
    </div>
  `,
})
class CollapseStoryComponent {
  @Input() collapsedHeight: string | number = 0;

  checked = false;
}

// ─── Translate ────────────────────────────────────

@Component({
  selector: 'story-translate',
  standalone: true,
  imports: [FormsModule, MznToggle, MznTranslate],
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div mznToggle [(ngModel)]="checked" size="main"></div>
      <div
        style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; align-items: start;"
      >
        <div>
          <p style="margin-bottom: 8px; font-size: 12px; color: #666;"
            >from = top</p
          >
          <div mznTranslate [in]="checked" from="top">
            <div
              style="width: 120px; height: 120px; background: var(--mzn-color-background-brand);"
            ></div>
          </div>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-size: 12px; color: #666;"
            >from = bottom</p
          >
          <div mznTranslate [in]="checked" from="bottom">
            <div
              style="width: 120px; height: 120px; background: var(--mzn-color-background-brand);"
            ></div>
          </div>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-size: 12px; color: #666;"
            >from = left</p
          >
          <div mznTranslate [in]="checked" from="left">
            <div
              style="width: 120px; height: 120px; background: var(--mzn-color-background-brand);"
            ></div>
          </div>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-size: 12px; color: #666;"
            >from = right</p
          >
          <div mznTranslate [in]="checked" from="right">
            <div
              style="width: 120px; height: 120px; background: var(--mzn-color-background-brand);"
            ></div>
          </div>
        </div>
      </div>
    </div>
  `,
})
class TranslateStoryComponent {
  checked = false;
}

// ─── Slide ────────────────────────────────────────

@Component({
  selector: 'story-slide',
  standalone: true,
  imports: [FormsModule, MznToggle, MznSlide],
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div mznToggle [(ngModel)]="checked" size="main"></div>
      <div
        style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; align-items: start;"
      >
        <div>
          <p style="margin-bottom: 8px; font-size: 12px; color: #666;"
            >Slide Right</p
          >
          <div style="overflow: hidden;">
            <div mznSlide [in]="checked" from="right" [keepMount]="true">
              <div
                style="width: 200px; height: 200px; background: var(--mzn-color-background-brand);"
              ></div>
            </div>
          </div>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-size: 12px; color: #666;"
            >Slide Top</p
          >
          <div style="overflow: hidden;">
            <div mznSlide [in]="checked" from="top" [keepMount]="true">
              <div
                style="width: 200px; height: 200px; background: var(--mzn-color-background-brand);"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
class SlideStoryComponent {
  checked = false;
}

// ─── Rotate ───────────────────────────────────────

@Component({
  selector: 'story-rotate',
  standalone: true,
  imports: [MznButton, MznIcon, MznRotate],
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div>
        <h3 style="margin-bottom: 16px;">Rotate Arrow Indicator</h3>
        <button mznButton variant="base-secondary" (click)="checked = !checked">
          <span>Select Options</span>
          <span mznRotate [in]="checked" style="display: inline-flex;">
            <i mznIcon [icon]="ChevronUpIcon"></i>
          </span>
        </button>
      </div>
    </div>
  `,
})
class RotateStoryComponent {
  readonly ChevronUpIcon = ChevronUpIcon;
  checked = false;
}

// ─── Stories ──────────────────────────────────────

export default {
  title: 'Motion/Transition',
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule],
    }),
  ],
  argTypes: {
    duration: {
      description:
        'The duration of the transition, in milliseconds. Can be a single number or an object with `enter` and `exit` keys.',
      table: {
        type: { summary: 'number | { enter?: number; exit?: number }' },
        defaultValue: { summary: 'MOTION_DURATION.moderate' },
      },
      control: false,
    },
    easing: {
      description:
        'The timing function of the transition. Can be a single string or an object with `enter` and `exit` keys.',
      table: {
        type: { summary: 'string | { enter?: string; exit?: string }' },
        defaultValue: { summary: 'MOTION_EASING.standard' },
      },
      control: false,
    },
    in: {
      description:
        'The flag to trigger toggling transition between `enter` and `exit` state.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
      control: false,
    },
    keepMount: {
      description: 'Whether to keep mounting the child if exited.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
      control: false,
    },
    delay: {
      description:
        'The delay of the transition, in milliseconds. Can be a single number or an object with `enter` and `exit` keys.',
      table: {
        type: { summary: 'number | { enter?: number; exit?: number }' },
        defaultValue: { summary: '0' },
      },
      control: false,
    },
  },
} satisfies Meta;

type Story = StoryObj;

export const FadeStory: Story = {
  name: 'Fade',
  decorators: [moduleMetadata({ imports: [FadeStoryComponent] })],
  args: defaultArgs,
  argTypes: defaultArgTypes,
  render: (args) => ({
    props: args,
    template: `
      <story-fade
        [durationEnter]="durationEnter"
        [durationExit]="durationExit"
        [easingEnter]="easingEnter"
        [easingExit]="easingExit"
      />
    `,
  }),
};

export const ScaleStory: Story = {
  name: 'Scale',
  decorators: [moduleMetadata({ imports: [ScaleStoryComponent] })],
  args: {
    ...defaultArgs,
    transformOrigin: 'initial',
  },
  argTypes: {
    ...defaultArgTypes,
    transformOrigin: {
      control: { type: 'text' as const },
      description:
        'The transform-origin CSS value applied to the scaled element.',
      table: { defaultValue: { summary: 'initial' } },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <story-scale
        [durationEnter]="durationEnter"
        [durationExit]="durationExit"
        [easingEnter]="easingEnter"
        [easingExit]="easingExit"
        [transformOrigin]="transformOrigin"
      />
    `,
  }),
};

export const CollapseStory: Story = {
  name: 'Collapse',
  decorators: [moduleMetadata({ imports: [CollapseStoryComponent] })],
  args: {
    collapsedHeight: 0,
  },
  argTypes: {
    collapsedHeight: {
      control: { type: 'text' as const },
      description:
        'The height of the container while collapsed. Set to a non-zero value (e.g. "48px") to keep partial content visible.',
      table: { defaultValue: { summary: '0' } },
    },
  },
  render: (args) => ({
    props: args,
    template: `<story-collapse [collapsedHeight]="collapsedHeight" />`,
  }),
};

export const TranslateStory: Story = {
  name: 'Translate',
  decorators: [moduleMetadata({ imports: [TranslateStoryComponent] })],
  args: {
    ...defaultArgs,
    from: 'top',
  },
  argTypes: {
    ...defaultArgTypes,
    from: {
      options: ['top', 'bottom', 'left', 'right'],
      control: { type: 'select' as const },
      description:
        'The position the element enters from. All four directions are shown simultaneously.',
    },
  },
  render: () => ({
    template: `<story-translate />`,
  }),
};

export const SlideStory: Story = {
  name: 'Slide',
  decorators: [moduleMetadata({ imports: [SlideStoryComponent] })],
  args: defaultArgs,
  argTypes: defaultArgTypes,
  render: () => ({
    template: `<story-slide />`,
  }),
};

export const RotateStory: Story = {
  name: 'Rotate',
  decorators: [moduleMetadata({ imports: [RotateStoryComponent] })],
  args: {
    durationEnter: 'fast' as MotionDurationType,
    easingEnter: 'standard' as MotionEasingType,
    degrees: 180,
  },
  argTypes: {
    durationEnter: {
      options: durations,
      control: { type: 'select' as const },
      description: 'Duration of the rotation transition.',
      table: { defaultValue: { summary: 'fast' } },
    },
    easingEnter: {
      options: easings,
      control: { type: 'select' as const },
      description: 'Easing function of the rotation transition.',
      table: { defaultValue: { summary: 'standard' } },
    },
    degrees: {
      control: { type: 'number' as const },
      description: 'The rotation degrees when `in` is true.',
      table: { defaultValue: { summary: '180' } },
    },
  },
  render: () => ({
    template: `<story-rotate />`,
  }),
};
