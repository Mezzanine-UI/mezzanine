import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  dropdownClasses as classes,
  DropdownStatus as DropdownStatusType,
} from '@mezzanine-ui/core/dropdown';
import { FolderOpenIcon, IconDefinition } from '@mezzanine-ui/icons';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznSpin } from '@mezzanine-ui/ng/spin';

/**
 * Dropdown 狀態元件，用於顯示載入中或空狀態。
 *
 * 當 `status` 為 `'loading'` 時顯示旋轉指示器，
 * 為 `'empty'` 時顯示空狀態圖示與文字。
 *
 * @example
 * ```html
 * import { MznDropdownStatus } from '@mezzanine-ui/ng/dropdown';
 *
 * <div mznDropdownStatus status="loading" ></div>
 * <div mznDropdownStatus status="empty" emptyText="找不到任何選項。" ></div>
 * ```
 *
 * @see MznDropdown
 */
@Component({
  selector: '[mznDropdownStatus]',
  host: {
    '[class]': 'statusClass',
    '[attr.emptyIcon]': 'null',
    '[attr.emptyText]': 'null',
    '[attr.loadingText]': 'null',
    '[attr.status]': 'null',
  },
  standalone: true,
  imports: [MznIcon, MznSpin],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (status() === 'loading') {
      <mzn-spin [loading]="true" size="minor" />
    } @else {
      <i mznIcon [icon]="resolvedEmptyIcon()" [size]="16"></i>
    }
    <span [class]="statusTextClass">{{ displayText() }}</span>
  `,
})
export class MznDropdownStatus {
  /** 空狀態圖示。 @default FolderOpenIcon */
  readonly emptyIcon = input<IconDefinition>();

  /** 空狀態顯示文字。 @default 'No matching options.' */
  readonly emptyText = input('No matching options.');

  /** 載入中顯示文字。 @default 'Loading...' */
  readonly loadingText = input('Loading...');

  /** 狀態類型。 */
  readonly status = input.required<DropdownStatusType>();

  protected readonly statusClass = classes.status;
  protected readonly statusTextClass = classes.statusText;

  protected readonly resolvedEmptyIcon = computed(
    (): IconDefinition => this.emptyIcon() ?? FolderOpenIcon,
  );

  protected readonly displayText = computed((): string => {
    if (this.status() === 'loading') {
      return this.loadingText();
    }

    return this.emptyText();
  });
}
