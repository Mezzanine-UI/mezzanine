import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  OnInit,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { accordionClasses as classes } from '@mezzanine-ui/core/accordion';
import { MOTION_DURATION } from '@mezzanine-ui/system/motion/duration';
import { MOTION_EASING } from '@mezzanine-ui/system/motion/easing';
import clsx from 'clsx';
import { AccordionControl, MZN_ACCORDION_CONTROL } from './accordion-control';
import {
  AccordionGroupControl,
  MZN_ACCORDION_GROUP,
} from './accordion-group-context';
import { MznAccordionTitle } from './accordion-title.component';

type AnimState =
  | 'exited'
  | 'pre-enter'
  | 'entering'
  | 'entered'
  | 'pre-exit'
  | 'exiting';

const ENTER_DURATION = MOTION_DURATION.moderate;
const EXIT_DURATION = MOTION_DURATION.moderate;
const ENTER_EASING = MOTION_EASING.entrance;
const EXIT_EASING = MOTION_EASING.exit;

/**
 * 手風琴元件，提供可展開／收合的內容區塊。
 *
 * 透過 `MZN_ACCORDION_CONTROL` InjectionToken 將展開與禁用狀態向下提供給
 * `MznAccordionTitle` 與 `MznAccordionContent` 子元件。支援受控（`expanded`）
 * 與非受控（`defaultExpanded`）兩種模式。
 *
 * 內容區的 DOM 結構鏡像 React Accordion — Fade > Collapse outer > flex >
 * width-wrapper > content，並以內建狀態機驅動 Fade（opacity）+ Collapse
 * （height）兩段動畫，對齊 React `react-transition-group` 的
 * lazyMount + unmountOnExit + entered(visible) 行為。
 *
 * @example
 * ```html
 * import { MznAccordion, MznAccordionTitle, MznAccordionContent } from '@mezzanine-ui/ng/accordion';
 *
 * <div mznAccordion>
 *   <div mznAccordionTitle>常見問題</div>
 *   <div mznAccordionContent>
 *     <p>這裡是詳細說明。</p>
 *   </div>
 * </div>
 * ```
 */
@Component({
  selector: '[mznAccordion]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznAccordionTitle],
  providers: [
    {
      provide: MZN_ACCORDION_CONTROL,
      useFactory: (accordion: MznAccordion): AccordionControl => ({
        get disabled(): boolean {
          return accordion.disabled();
        },
        get expanded(): boolean {
          return accordion.resolvedExpanded();
        },
        get titleId(): string | null {
          return accordion.titleId();
        },
        get contentId(): string | null {
          const id = accordion.titleId();

          return id ? `${id}-content` : null;
        },
        toggleExpanded(value: boolean): void {
          accordion.onToggle(value);
        },
        setTitleId(id: string | null): void {
          accordion.titleId.set(id);
        },
      }),
      deps: [MznAccordion],
    },
  ],
  host: {
    '[class]': 'hostClasses()',
    '[attr.defaultExpanded]': 'null',
    '[attr.disabled]': 'null',
    '[attr.expanded]': 'null',
    '[attr.size]': 'null',
    '[attr.title]': 'null',
  },
  template: `
    @if (title()) {
      <div mznAccordionTitle>{{ title() }}</div>
    } @else {
      <ng-content select="[mznAccordionTitle]" />
    }

    @if (shouldRenderContent()) {
      <div
        [style.opacity]="opacityStyle()"
        [style.transition]="opacityTransition()"
      >
        <div
          [style.min-height]="'0px'"
          [style.overflow]="overflowStyle()"
          [style.width]="'100%'"
          [style.height]="heightStyle()"
          [style.transition]="heightTransition()"
          (transitionend)="onContentTransitionEnd($event)"
        >
          <div #collapseWrapper style="display: flex; width: 100%;">
            <div style="width: 100%;">
              <ng-content select="[mznAccordionContent]" />
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class MznAccordion implements OnInit {
  private readonly internalExpanded = signal(false);

  /** @internal AccordionTitle host id 寫入用 signal。 */
  readonly titleId = signal<string | null>(null);

  /**
   * 預設是否展開（非受控模式）。
   * @default false
   */
  readonly defaultExpanded = input(false);

  /**
   * 是否停用。
   * @default false
   */
  readonly disabled = input(false);

  /**
   * 受控展開狀態。設定此值可啟用受控模式。
   */
  readonly expanded = input<boolean | undefined>(undefined);

  /**
   * 尺寸。
   * @default 'main'
   */
  readonly size = input<'main' | 'sub'>('main');

  /**
   * 標題文字的快捷屬性。提供時會在內部自動渲染 `mzn-accordion-title`。
   * 若需要客製化標題，請直接使用 `<div mznAccordionTitle>` 子元件。
   */
  readonly title = input<string>();

  /** 展開/收合狀態變更事件。 */
  readonly expandedChange = output<boolean>();

  readonly resolvedExpanded = computed((): boolean => {
    const controlled = this.expanded();

    if (controlled !== undefined) return controlled;

    return this.internalExpanded();
  });

  protected readonly resolvedSize = computed(
    (): 'main' | 'sub' => this.groupControl?.size ?? this.size(),
  );

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, classes.size(this.resolvedSize()), {
      [classes.hostDisabled]: this.disabled(),
    }),
  );

  private readonly animState = signal<AnimState>('exited');
  private readonly measuredHeight = signal<number>(0);

  protected readonly shouldRenderContent = computed(
    (): boolean => this.animState() !== 'exited',
  );

  protected readonly opacityStyle = computed((): number => {
    const s = this.animState();

    // pre-exit is a single-frame setup state that pins the height to a
    // measured pixel value before the exit transition runs — opacity must
    // stay at 1 during it so the fade-out animates from 1 to 0.
    return s === 'entering' || s === 'entered' || s === 'pre-exit' ? 1 : 0;
  });

  protected readonly heightStyle = computed((): string => {
    const s = this.animState();

    if (s === 'entered') return 'auto';
    if (s === 'entering' || s === 'pre-exit')
      return `${this.measuredHeight()}px`;

    return '0px';
  });

  protected readonly overflowStyle = computed((): string => {
    const s = this.animState();

    return s === 'entered' ? 'visible' : 'hidden';
  });

  protected readonly opacityTransition = computed((): string => {
    const s = this.animState();

    if (s === 'entering') {
      return `opacity ${ENTER_DURATION}ms ${ENTER_EASING}`;
    }

    if (s === 'exiting') {
      return `opacity ${EXIT_DURATION}ms ${EXIT_EASING}`;
    }

    return '';
  });

  protected readonly heightTransition = computed((): string => {
    const s = this.animState();

    if (s === 'entering') {
      return `height ${ENTER_DURATION}ms ${ENTER_EASING}`;
    }

    if (s === 'exiting') {
      return `height ${EXIT_DURATION}ms ${EXIT_EASING}`;
    }

    return '';
  });

  private readonly collapseWrapper =
    viewChild<ElementRef<HTMLDivElement>>('collapseWrapper');

  private readonly groupControl = inject<AccordionGroupControl>(
    MZN_ACCORDION_GROUP,
    { optional: true },
  );
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);

  private fallbackTimer = NaN;

  constructor() {
    effect(() => {
      const expanded = this.resolvedExpanded();

      // Read animState untracked — we only react to expanded() changes,
      // the state machine itself shouldn't loop on its own writes.
      const state = untracked(() => this.animState());

      if (expanded) {
        if (state === 'exited' || state === 'exiting' || state === 'pre-exit') {
          this.startEnter();
        }
      } else if (
        state === 'entered' ||
        state === 'entering' ||
        state === 'pre-enter'
      ) {
        this.startExit();
      }
    });

    this.destroyRef.onDestroy(() => {
      window.clearTimeout(this.fallbackTimer);
    });
  }

  ngOnInit(): void {
    // defaultExpanded is read once at init only — matches React useState(defaultValue) semantics.
    if (this.defaultExpanded()) {
      this.internalExpanded.set(true);
    }
  }

  /** @internal */
  onToggle(value: boolean): void {
    this.expandedChange.emit(value);

    if (this.expanded() === undefined) {
      this.internalExpanded.set(value);
    }

    if (value && this.groupControl) {
      this.groupControl.onAccordionExpand(this);
    }
  }

  protected onContentTransitionEnd(event: TransitionEvent): void {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== 'height') return;

    const state = untracked(() => this.animState());

    if (state === 'entering') {
      this.finishEnter();
    } else if (state === 'exiting') {
      this.finishExit();
    }
  }

  private startEnter(): void {
    window.clearTimeout(this.fallbackTimer);

    // Phase 1: mount at collapsed height (pre-enter). Next paint measures
    // content height and flips to 'entering' so CSS transitions can animate.
    this.animState.set('pre-enter');

    afterNextRender(
      () => {
        const height = this.collapseWrapper()?.nativeElement.clientHeight ?? 0;

        this.measuredHeight.set(height);

        // Double rAF: the first schedules a callback after the upcoming paint
        // (so the browser has registered height:0), the second flips state so
        // the new height:<measured> is rendered as a *change* and a CSS
        // transition kicks in. A single rAF batches with Angular's render in
        // some cases and skips the transition.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.animState.set('entering');

            // setTimeout fallback mirrors react-transition-group's timeout
            // arm in case transitionend never fires (nested transitions, etc.).
            this.fallbackTimer = window.setTimeout(() => {
              if (untracked(() => this.animState()) === 'entering') {
                this.finishEnter();
              }
            }, ENTER_DURATION + 50);
          });
        });
      },
      { injector: this.injector },
    );
  }

  private finishEnter(): void {
    window.clearTimeout(this.fallbackTimer);
    this.animState.set('entered');
  }

  private startExit(): void {
    window.clearTimeout(this.fallbackTimer);

    const state = untracked(() => this.animState());

    // From 'entered' (height: auto) we must first pin the wrapper to a
    // specific pixel value so the browser can animate from that to 0.
    // From 'entering' we already have measuredHeight + a concrete height,
    // so we can fall straight into 'exiting'.
    if (state === 'entered') {
      const height = this.collapseWrapper()?.nativeElement.clientHeight ?? 0;

      this.measuredHeight.set(height);
      this.animState.set('pre-exit');

      // Double rAF mirrors startEnter so the browser paints the fixed
      // measured height before we flip to height:0 and kick the transition.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.animState.set('exiting');

          this.fallbackTimer = window.setTimeout(() => {
            if (untracked(() => this.animState()) === 'exiting') {
              this.finishExit();
            }
          }, EXIT_DURATION + 50);
        });
      });
    } else {
      this.animState.set('exiting');

      this.fallbackTimer = window.setTimeout(() => {
        if (untracked(() => this.animState()) === 'exiting') {
          this.finishExit();
        }
      }, EXIT_DURATION + 50);
    }
  }

  private finishExit(): void {
    window.clearTimeout(this.fallbackTimer);
    this.animState.set('exited');
    this.measuredHeight.set(0);
  }
}
