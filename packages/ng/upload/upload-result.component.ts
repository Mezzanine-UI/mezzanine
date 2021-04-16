import {
  toUploadResultCssVars,
  uploadResultClasses as classes,
  UploadResultSize,
  UploadResultStatus,
} from '@mezzanine-ui/core/upload';
import {
  DownloadIcon,
  SpinnerIcon,
  TimesIcon,
} from '@mezzanine-ui/icons';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import {
  createCssVarsChangeEffect,
  HostBindingClass,
  HostBindingEnumClass,
  InputNumber,
  NumberInput,
  TypedSimpleChanges,
} from '@mezzanine-ui/ng/cdk';

/**
 * The ng component for `mezzanine` upload result.
 */
@Component({
  selector: 'mzn-upload-result',
  exportAs: 'mznUploadResult',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-template #actionTemplate>
      <div [class]="classes.actions">
        <ng-container *ngIf="loading">
          <i
          [mzn-icon]="loadingIcon"
          spin
          ></i>
        </ng-container>
        <ng-container *ngIf="done">
          <i
          [mzn-icon]="downloadIcon"
          (click)="onDownload($event)"
          role="button"
          ></i>
        </ng-container>
        <ng-container *ngIf="done || error">
          <i
          [mzn-icon]="closeIcon"
          (click)="onDelete($event)"
          role="button"
          ></i>
        </ng-container>
      </div>
    </ng-template>

    <span [class]="classes.name">{{name}}</span>
    <ng-template [ngTemplateOutlet]="actionTemplate"></ng-template>
  `,
})

export class MznUploadResultComponent implements OnChanges, OnInit {
  static ngAcceptInputType_percentage: NumberInput;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly render: Renderer2,
  ) {}

  @HostBindingClass(classes.host)
  readonly bindHostClass = true;

  readonly classes = classes;

  readonly loadingIcon = SpinnerIcon;

  readonly downloadIcon = DownloadIcon;

  readonly closeIcon = TimesIcon;

  private readonly changeHostCssVars = createCssVarsChangeEffect(
    this.elementRef,
    this.render,
    () => toUploadResultCssVars({
      percentage: this.percentage,
    }),
  );

  /**
   * The name of upload result
   */
  @Input()
  name: string;

  /**
   * The percentage of the upload process
   */
  @Input()
  @InputNumber()
  percentage?: number;

  /**
   * The size of upload result
   */
  @HostBindingEnumClass(classes.size, [
    'small',
    'medium',
    'large',
  ])
  @Input()
  size?: UploadResultSize = 'medium';

  /**
   * The status of upload result
   */
  @Input()
  status: UploadResultStatus;

  get done() {
    return (this.status === 'done');
  }

  @HostBindingClass(classes.error)
  get error() {
    return (this.status === 'error');
  }

  @HostBindingClass(classes.loading)
  get loading() {
    return this.status === 'loading';
  }

  /**
   * Fired on close icon clicked.
   */
  @Output()
  readonly delete = new EventEmitter<MouseEvent>();

  /**
   * Fired on download icon clicked.
   */
  @Output()
  readonly download = new EventEmitter<MouseEvent>();

  onDelete(event: MouseEvent) {
    if (this.done || this.error) {
      this.delete.emit(event);
    }
  }

  onDownload(event: MouseEvent) {
    if (this.done) {
      this.download.emit(event);
    }
  }

  ngOnChanges(changes: TypedSimpleChanges<MznUploadResultComponent>) {
    const {
      percentage,
    } = changes;

    if (percentage) {
      this.changeHostCssVars();
    }
  }

  ngOnInit() {
    this.changeHostCssVars();
  }
}
