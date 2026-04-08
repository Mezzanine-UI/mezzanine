import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import {
  uploadItemClasses as classes,
  UploadItemSize,
  UploadItemStatus,
} from '@mezzanine-ui/core/upload';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import {
  CloseIcon,
  DangerousFilledIcon,
  DownloadIcon,
  FileIcon,
  IconDefinition,
  ResetIcon,
  SpinnerIcon,
  TrashIcon,
} from '@mezzanine-ui/icons';

/**
 * 單一上傳檔案的顯示元件，呈現檔案名稱、狀態圖示與操作按鈕。
 *
 * 根據 `status` 顯示不同狀態（完成、錯誤、載入中），
 * 支援縮圖預覽、錯誤訊息與移除操作。
 *
 * @example
 * ```html
 * import { MznUploadItem } from '@mezzanine-ui/ng/upload';
 *
 * <mzn-upload-item
 *   fileName="report.pdf"
 *   status="done"
 *   (remove)="onRemove()"
 * />
 *
 * <mzn-upload-item
 *   fileName="broken.csv"
 *   status="error"
 *   errorMessage="檔案格式錯誤"
 *   (remove)="onRemove()"
 * />
 * ```
 *
 * @see MznUpload
 */
@Component({
  selector: 'mzn-upload-item',
  standalone: true,
  imports: [MznIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    <div [class]="containerClass">
      @if (thumbnailUrl() || url()) {
        <img [class]="thumbnailClass" [src]="thumbnailUrl() ?? url()" alt="" />
      } @else {
        <i mznIcon [class]="iconClass" [icon]="resolvedIcon()"></i>
      }

      <div [class]="contentWrapperClass">
        <div [class]="contentClass">
          <span [class]="nameClass">{{ resolvedFileName() }}</span>
        </div>

        @if (status() === 'error' && errorMessage()) {
          <div [class]="errorMessageClass">
            <i
              mznIcon
              [class]="errorIconClass"
              [icon]="resolvedErrorIcon()"
            ></i>
            <span [class]="errorMessageTextClass">{{ errorMessage() }}</span>
          </div>
        }
      </div>

      <div [class]="actionsClass">
        @if (status() === 'loading') {
          <div [class]="loadingIconClass">
            <i mznIcon [icon]="spinnerIconDef" [spin]="true"></i>
          </div>
          <button
            type="button"
            [class]="closeIconClass"
            (click)="cancel.emit()"
          >
            <i mznIcon [icon]="closeIconDef"></i>
          </button>
        }
        @if (status() === 'done' && !disabled()) {
          <i
            mznIcon
            [class]="downloadIconClass"
            [icon]="downloadIconDef"
            [size]="16"
            (click)="download.emit()"
          ></i>
        }
        @if (status() === 'error' && !disabled()) {
          <i
            mznIcon
            [class]="resetIconClass"
            [icon]="resetIconDef"
            [size]="16"
            (click)="reload.emit()"
          ></i>
        }
      </div>
    </div>
    @if (isFinished() && !disabled()) {
      <div [class]="deleteContentClass">
        <i
          mznIcon
          [class]="deleteIconClass"
          [icon]="trashIconDef"
          [size]="16"
          color="neutral-solid"
          (click)="remove.emit()"
        ></i>
      </div>
    }
  `,
})
export class MznUploadItem {
  /**
   * 是否禁用操作按鈕。
   * @default false
   */
  readonly disabled = input(false);

  /**
   * 上傳錯誤時顯示的自訂錯誤圖示（IconDefinition）。
   * 未提供時使用預設的 DangerousFilledIcon。
   */
  readonly errorIcon = input<IconDefinition>();

  /** 錯誤訊息，僅在 status 為 'error' 時顯示。 */
  readonly errorMessage = input<string>();

  /**
   * 檔案名稱。若未提供，將嘗試從 `url` 或 `thumbnailUrl` 的路徑中提取。
   */
  readonly fileName = input<string>();

  /**
   * 自訂檔案類型圖示（IconDefinition）。
   * 未提供時使用預設的 FileIcon。
   */
  readonly icon = input<IconDefinition>();

  /** 上傳進度（0-100），僅在 status 為 'loading' 時有意義。 */
  readonly progress = input<number>();

  /**
   * 是否顯示檔案大小。
   * @default true
   */
  readonly showFileSize = input(true);

  /**
   * 上傳項目尺寸。
   * @default 'main'
   */
  readonly size = input<UploadItemSize>('main');

  /**
   * 上傳項目狀態。
   * @default 'done'
   */
  readonly status = input<UploadItemStatus>('done');

  /** 縮圖 URL，用於圖片預覽。 */
  readonly thumbnailUrl = input<string>();

  /**
   * 已上傳檔案的存取或下載 URL。
   * 當 `thumbnailUrl` 未提供時，此 URL 將用於顯示圖片預覽。
   */
  readonly url = input<string>();

  /** 使用者點擊取消按鈕時觸發（loading 狀態）。 */
  readonly cancel = output<void>();

  /** 使用者點擊下載按鈕時觸發（done 狀態）。 */
  readonly download = output<void>();

  /** 使用者點擊重新上傳按鈕時觸發（error 狀態）。 */
  readonly reload = output<void>();

  /** 使用者點擊移除按鈕時觸發。 */
  readonly remove = output<void>();

  protected readonly closeIconDef = CloseIcon;
  protected readonly downloadIconDef = DownloadIcon;
  protected readonly resetIconDef = ResetIcon;
  protected readonly spinnerIconDef = SpinnerIcon;
  protected readonly trashIconDef = TrashIcon;

  protected readonly resolvedIcon = computed(
    (): IconDefinition => this.icon() ?? FileIcon,
  );

  protected readonly resolvedErrorIcon = computed(
    (): IconDefinition => this.errorIcon() ?? DangerousFilledIcon,
  );

  /**
   * 解析後的檔案名稱。
   * - 若 `fileName` 已提供，直接使用。
   * - 否則嘗試從 `url` 或 `thumbnailUrl` 的路徑末段提取。
   * - 無法解析時回傳空字串。
   */
  protected readonly resolvedFileName = computed((): string => {
    const name = this.fileName();

    if (name) return name;

    const rawUrl = this.url() ?? this.thumbnailUrl();

    if (!rawUrl) return '';

    try {
      const parsed = new URL(rawUrl);
      return parsed.pathname.split('/').pop() ?? '';
    } catch {
      const withoutQuery = rawUrl.split('?')[0].split('#')[0];
      return withoutQuery.split('/').pop() ?? '';
    }
  });

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, classes.size(this.size()), {
      [classes.error]: this.status() === 'error',
      [classes.disabled]: this.disabled(),
    }),
  );

  protected readonly isFinished = computed((): boolean =>
    /done|error/.test(this.status()),
  );

  protected readonly containerClass = classes.container;
  protected readonly iconClass = classes.icon;
  protected readonly thumbnailClass = classes.thumbnail;
  protected readonly contentWrapperClass = classes.contentWrapper;
  protected readonly contentClass = classes.content;
  protected readonly nameClass = classes.name;
  protected readonly actionsClass = classes.actions;
  protected readonly closeIconClass = classes.closeIcon;
  protected readonly deleteContentClass = classes.deleteContent;
  protected readonly deleteIconClass = classes.deleteIcon;
  protected readonly downloadIconClass = classes.downloadIcon;
  protected readonly errorMessageClass = classes.errorMessage;
  protected readonly errorIconClass = classes.errorIcon;
  protected readonly errorMessageTextClass = classes.errorMessageText;
  protected readonly loadingIconClass = classes.loadingIcon;
  protected readonly resetIconClass = classes.resetIcon;
}
