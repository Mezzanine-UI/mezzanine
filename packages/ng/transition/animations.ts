/* eslint-disable react-hooks/rules-of-hooks -- `useAnimation` here is Angular's
   `@angular/animations` helper, not a React hook. */
import {
  animate,
  animation,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';
import { MOTION_DURATION } from '@mezzanine-ui/system/motion/duration';
import { MOTION_EASING } from '@mezzanine-ui/system/motion/easing';

// ─── Fade ───────────────────────────────────────────────────────────

const fadeIn = animation(
  [
    style({ opacity: 0 }),
    animate('{{ duration }}ms {{ easing }}', style({ opacity: 1 })),
  ],
  {
    params: {
      duration: MOTION_DURATION.moderate,
      easing: MOTION_EASING.entrance,
    },
  },
);

const fadeOut = animation(
  [animate('{{ duration }}ms {{ easing }}', style({ opacity: 0 }))],
  {
    params: {
      duration: MOTION_DURATION.moderate,
      easing: MOTION_EASING.exit,
    },
  },
);

/**
 * 淡入/淡出動畫 trigger。
 *
 * 綁定至 `@mznFade`，於 `:enter` 時淡入、`:leave` 時淡出。
 *
 * @example
 * ```ts
 * import { mznFadeAnimation } from '@mezzanine-ui/ng/transition';
 *
 * @Component({
 *   animations: [mznFadeAnimation],
 *   template: `@if (visible) { <div @mznFade>content</div> }`,
 * })
 * ```
 */
export const mznFadeAnimation: AnimationTriggerMetadata = trigger('mznFade', [
  transition(':enter', [useAnimation(fadeIn)]),
  transition(':leave', [useAnimation(fadeOut)]),
]);

// ─── Collapse ───────────────────────────────────────────────────────

/**
 * 高度摺疊動畫 trigger。
 *
 * 綁定至 `@mznCollapse`，使用狀態 `true`/`false` 控制展開與收合。
 * 使用 `*` wildcard height 讓 Angular 自動測量。
 *
 * @example
 * ```ts
 * import { mznCollapseAnimation } from '@mezzanine-ui/ng/transition';
 *
 * @Component({
 *   animations: [mznCollapseAnimation],
 *   template: `<div [@mznCollapse]="isOpen">content</div>`,
 * })
 * ```
 */
export const mznCollapseAnimation: AnimationTriggerMetadata = trigger(
  'mznCollapse',
  [
    state('false, void', style({ height: '0', overflow: 'hidden' })),
    state('true', style({ height: '*', overflow: 'visible' })),
    transition('false <=> true', [
      style({ overflow: 'hidden' }),
      animate(`${MOTION_DURATION.moderate}ms ${MOTION_EASING.entrance}`),
    ]),
    transition(':enter', [
      style({ height: '0', overflow: 'hidden' }),
      animate(
        `${MOTION_DURATION.moderate}ms ${MOTION_EASING.entrance}`,
        style({ height: '*' }),
      ),
    ]),
    transition(':leave', [
      style({ overflow: 'hidden' }),
      animate(
        `${MOTION_DURATION.moderate}ms ${MOTION_EASING.exit}`,
        style({ height: '0' }),
      ),
    ]),
  ],
);

// ─── Scale ──────────────────────────────────────────────────────────

const scaleIn = animation(
  [
    style({ opacity: 0, transform: 'scale(0.95)' }),
    animate(
      '{{ duration }}ms {{ easing }}',
      style({ opacity: 1, transform: 'scale(1)' }),
    ),
  ],
  {
    params: {
      duration: MOTION_DURATION.moderate,
      easing: MOTION_EASING.entrance,
    },
  },
);

const scaleOut = animation(
  [
    animate(
      '{{ duration }}ms {{ easing }}',
      style({ opacity: 0, transform: 'scale(0.95)' }),
    ),
  ],
  {
    params: {
      duration: MOTION_DURATION.moderate,
      easing: MOTION_EASING.exit,
    },
  },
);

/**
 * 縮放動畫 trigger。
 *
 * 綁定至 `@mznScale`，於 `:enter` 時從 95% 放大至 100%、`:leave` 時縮回。
 *
 * @example
 * ```ts
 * import { mznScaleAnimation } from '@mezzanine-ui/ng/transition';
 *
 * @Component({
 *   animations: [mznScaleAnimation],
 *   template: `@if (visible) { <div @mznScale>content</div> }`,
 * })
 * ```
 */
export const mznScaleAnimation: AnimationTriggerMetadata = trigger('mznScale', [
  transition(':enter', [useAnimation(scaleIn)]),
  transition(':leave', [useAnimation(scaleOut)]),
]);

// ─── Slide ──────────────────────────────────────────────────────────

/**
 * 滑入/滑出動畫 trigger（從右側進場）。
 *
 * 綁定至 `@mznSlideRight`。
 *
 * @example
 * ```ts
 * import { mznSlideRightAnimation } from '@mezzanine-ui/ng/transition';
 *
 * @Component({
 *   animations: [mznSlideRightAnimation],
 *   template: `@if (visible) { <div @mznSlideRight>content</div> }`,
 * })
 * ```
 */
export const mznSlideRightAnimation: AnimationTriggerMetadata = trigger(
  'mznSlideRight',
  [
    transition(':enter', [
      style({ transform: 'translate3d(100%, 0, 0)' }),
      animate(
        `${MOTION_DURATION.slow}ms ${MOTION_EASING.standard}`,
        style({ transform: 'translate3d(0, 0, 0)' }),
      ),
    ]),
    transition(':leave', [
      animate(
        `${MOTION_DURATION.slow}ms ${MOTION_EASING.standard}`,
        style({ transform: 'translate3d(100%, 0, 0)' }),
      ),
    ]),
  ],
);

/**
 * 滑入/滑出動畫 trigger（從頂部進場）。
 *
 * 綁定至 `@mznSlideTop`。
 *
 * @example
 * ```ts
 * import { mznSlideTopAnimation } from '@mezzanine-ui/ng/transition';
 *
 * @Component({
 *   animations: [mznSlideTopAnimation],
 *   template: `@if (visible) { <div @mznSlideTop>content</div> }`,
 * })
 * ```
 */
export const mznSlideTopAnimation: AnimationTriggerMetadata = trigger(
  'mznSlideTop',
  [
    transition(':enter', [
      style({ transform: 'translate3d(0, -100%, 0)' }),
      animate(
        `${MOTION_DURATION.slow}ms ${MOTION_EASING.standard}`,
        style({ transform: 'translate3d(0, 0, 0)' }),
      ),
    ]),
    transition(':leave', [
      animate(
        `${MOTION_DURATION.slow}ms ${MOTION_EASING.standard}`,
        style({ transform: 'translate3d(0, -100%, 0)' }),
      ),
    ]),
  ],
);

// ─── Rotate ─────────────────────────────────────────────────────────

/**
 * 旋轉動畫 trigger。
 *
 * 綁定至 `@mznRotate`，使用狀態 `true`/`false` 控制旋轉角度。
 * 預設旋轉 180 度。
 *
 * @example
 * ```ts
 * import { mznRotateAnimation } from '@mezzanine-ui/ng/transition';
 *
 * @Component({
 *   animations: [mznRotateAnimation],
 *   template: `<i mznIcon [icon]="ArrowIcon" [@mznRotate]="isExpanded" ></i>`,
 * })
 * ```
 */
export const mznRotateAnimation: AnimationTriggerMetadata = trigger(
  'mznRotate',
  [
    state('false, void', style({ transform: 'rotate(0deg)' })),
    state('true', style({ transform: 'rotate(180deg)' })),
    transition('false <=> true', [
      animate(`${MOTION_DURATION.fast}ms ${MOTION_EASING.standard}`),
    ]),
  ],
);

// ─── Translate ──────────────────────────────────────────────────────

/**
 * 建立位移動畫 trigger 的工廠函式。
 *
 * @param name - trigger 名稱
 * @param translateExpr - 離場時的 translate3d 表達式
 */
function createTranslateAnimation(
  name: string,
  translateExpr: string,
): AnimationTriggerMetadata {
  return trigger(name, [
    transition(':enter', [
      style({ opacity: 0, transform: translateExpr }),
      animate(
        `${MOTION_DURATION.moderate}ms ${MOTION_EASING.standard}`,
        style({ opacity: 1, transform: 'translate3d(0, 0, 0)' }),
      ),
    ]),
    transition(':leave', [
      animate(
        `${MOTION_DURATION.moderate}ms ${MOTION_EASING.standard}`,
        style({ opacity: 0, transform: translateExpr }),
      ),
    ]),
  ]);
}

/**
 * 位移動畫 trigger（從上方偏移 4px）。
 *
 * @example
 * ```ts
 * import { mznTranslateTopAnimation } from '@mezzanine-ui/ng/transition';
 *
 * @Component({
 *   animations: [mznTranslateTopAnimation],
 *   template: `@if (visible) { <div @mznTranslateTop>dropdown</div> }`,
 * })
 * ```
 */
export const mznTranslateTopAnimation: AnimationTriggerMetadata =
  createTranslateAnimation('mznTranslateTop', 'translate3d(0, -4px, 0)');

/** 位移動畫 trigger（從下方偏移 4px）。 */
export const mznTranslateBottomAnimation: AnimationTriggerMetadata =
  createTranslateAnimation('mznTranslateBottom', 'translate3d(0, 4px, 0)');

/** 位移動畫 trigger（從左方偏移 4px）。 */
export const mznTranslateLeftAnimation: AnimationTriggerMetadata =
  createTranslateAnimation('mznTranslateLeft', 'translate3d(-4px, 0, 0)');

/** 位移動畫 trigger（從右方偏移 4px）。 */
export const mznTranslateRightAnimation: AnimationTriggerMetadata =
  createTranslateAnimation('mznTranslateRight', 'translate3d(4px, 0, 0)');
