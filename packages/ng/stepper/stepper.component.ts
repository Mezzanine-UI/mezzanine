import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { stepperClasses as classes } from '@mezzanine-ui/core/stepper';
import { stepClasses } from '@mezzanine-ui/core/stepper';
import clsx from 'clsx';
import { StepOrientation, StepType } from './step.component';
import { MZN_STEPPER_CONTEXT, StepperContext } from './stepper-context';

/**
 * 步驟進度指示器元件，以線性流程呈現多個步驟的完成狀態。
 *
 * 子元件必須為 `<div mznStep>`；`currentStep` 控制當前進行中的步驟（零基索引），
 * 之前的步驟自動標記為已完成，之後的步驟為待處理。支援水平與垂直排列，
 * 以及數字與圓點兩種指示器樣式。
 *
 * @example
 * ```html
 * import { MznStepper, MznStep } from '@mezzanine-ui/ng/stepper';
 *
 * <div mznStepper [currentStep]="1">
 *   <div mznStep title="填寫資料" description="請輸入基本資訊" ></div>
 *   <div mznStep title="確認內容" ></div>
 *   <div mznStep title="完成送出" ></div>
 * </div>
 * ```
 */
@Component({
  selector: '[mznStepper]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MZN_STEPPER_CONTEXT,
      useFactory: (stepper: MznStepper): StepperContext => ({
        currentStep: stepper.currentStep,
        orientation: stepper.orientation,
        type: stepper.type,
        register(step: unknown): ReturnType<StepperContext['register']> {
          stepper.registeredSteps.update((list) => [...list, step]);

          return computed(() => stepper.registeredSteps().indexOf(step));
        },
        unregister(step: unknown): void {
          stepper.registeredSteps.update((list) =>
            list.filter((s) => s !== step),
          );
        },
      }),
      deps: [MznStepper],
    },
  ],
  host: {
    '[class]': 'hostClasses()',
    '[attr.currentStep]': 'null',
    '[attr.orientation]': 'null',
    '[attr.type]': 'null',
  },
  template: `<ng-content />`,
})
export class MznStepper implements AfterViewInit {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private resizeObserver: ResizeObserver | null = null;

  /** @internal 註冊的子 Step 列表，用於計算索引。 */
  readonly registeredSteps = signal<readonly unknown[]>([]);

  /**
   * 當前進行中的步驟索引（零基）。
   * @default 0
   */
  readonly currentStep = input(0);

  /** 步驟變化回呼。 */
  readonly stepChange = output<number>();

  /**
   * 排列方向。
   * @default 'horizontal'
   */
  readonly orientation = input<StepOrientation>('horizontal');

  /**
   * 指示器樣式。
   * @default 'number'
   */
  readonly type = input<StepType>('number');

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, {
      [classes.horizontal]: this.orientation() === 'horizontal',
      [classes.vertical]: this.orientation() === 'vertical',
      [classes.dot]: this.type() === 'dot',
      [classes.number]: this.type() === 'number',
    }),
  );

  constructor() {
    effect(() => {
      const step = this.currentStep();

      this.stepChange.emit(step);
    });

    effect(() => {
      this.orientation();
      this.type();
      this.currentStep();
      this.registeredSteps();

      queueMicrotask(() => this.calculateDistances());
    });
  }

  ngAfterViewInit(): void {
    this.calculateDistances();

    this.resizeObserver = new ResizeObserver(() => this.calculateDistances());
    this.resizeObserver.observe(this.elementRef.nativeElement);

    this.destroyRef.onDestroy(() => {
      this.resizeObserver?.disconnect();
      this.resizeObserver = null;
    });
  }

  private calculateDistances(): void {
    const hostEl = this.elementRef.nativeElement as HTMLElement;
    const stepElements: HTMLElement[] = Array.from(
      hostEl.querySelectorAll(':scope > [mznstep]'),
    );
    const orientation = this.orientation();
    const type = this.type();
    const hostRect = hostEl.getBoundingClientRect();

    for (let i = 0; i < stepElements.length - 1; i += 1) {
      const current = stepElements[i];
      const next = stepElements[i + 1];
      let distance = 0;

      if (orientation === 'horizontal' && type === 'number') {
        const titleLine = current.querySelector(
          `.${stepClasses.titleConnectLine}`,
        );

        if (titleLine) {
          const titleRect = titleLine.getBoundingClientRect();

          distance =
            next.getBoundingClientRect().left -
            hostRect.left -
            (titleRect.right - hostRect.left);
        }
      } else if (orientation === 'horizontal' && type === 'dot') {
        const indicator = current.querySelector(
          `.${stepClasses.statusIndicator}`,
        );

        if (indicator) {
          const indicatorRect = indicator.getBoundingClientRect();
          const nextRect = next.getBoundingClientRect();

          distance =
            nextRect.left -
            hostRect.left +
            nextRect.width / 2 -
            (indicatorRect.right - hostRect.left) -
            indicator.clientWidth / 2;
        }
      } else {
        const indicator = current.querySelector(
          `.${stepClasses.statusIndicator}`,
        );

        if (indicator) {
          const indicatorRect = indicator.getBoundingClientRect();

          distance =
            next.getBoundingClientRect().top -
            hostRect.top -
            (indicatorRect.bottom - hostRect.top);
        }
      }

      current.style.setProperty('--connect-line-distance', `${distance}px`);
    }

    const last = stepElements[stepElements.length - 1];

    if (last) {
      last.style.removeProperty('--connect-line-distance');
    }
  }
}
