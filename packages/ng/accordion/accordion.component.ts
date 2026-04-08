import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { accordionClasses as classes } from '@mezzanine-ui/core/accordion';
import clsx from 'clsx';
import { AccordionControl, MZN_ACCORDION_CONTROL } from './accordion-control';
import {
  AccordionGroupControl,
  MZN_ACCORDION_GROUP,
} from './accordion-group-context';
import { MznAccordionTitle } from './accordion-title.component';

/**
 * 手風琴元件，提供可展開／收合的內容區塊。
 *
 * 透過 `MZN_ACCORDION_CONTROL` InjectionToken 將展開與禁用狀態向下提供給
 * `MznAccordionTitle` 與 `MznAccordionContent` 子元件。支援受控（`expanded`）
 * 與非受控（`defaultExpanded`）兩種模式。
 *
 * @example
 * ```html
 * import { MznAccordion, MznAccordionTitle, MznAccordionContent } from '@mezzanine-ui/ng/accordion';
 *
 * <mzn-accordion>
 *   <mzn-accordion-title>常見問題</mzn-accordion-title>
 *   <mzn-accordion-content>
 *     <p>這裡是詳細說明。</p>
 *   </mzn-accordion-content>
 * </mzn-accordion>
 * ```
 */
@Component({
  selector: 'mzn-accordion',
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
        toggleExpanded(value: boolean): void {
          accordion.onToggle(value);
        },
      }),
      deps: [MznAccordion],
    },
  ],
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    @if (title()) {
      <mzn-accordion-title>{{ title() }}</mzn-accordion-title>
    }
    <ng-content />
  `,
})
export class MznAccordion implements OnInit {
  private readonly internalExpanded = signal(false);

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
   * 若需要客製化標題，請直接使用 `<mzn-accordion-title>` 子元件。
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

  private readonly groupControl = inject<AccordionGroupControl>(
    MZN_ACCORDION_GROUP,
    { optional: true },
  );

  ngOnInit(): void {
    // defaultExpanded is read once at init only — matches React useState(defaultValue) semantics.
    // Subsequent changes to the input do not reset state (use [expanded] for controlled mode).
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
}
