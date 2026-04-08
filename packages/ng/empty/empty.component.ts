import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  TemplateRef,
} from '@angular/core';
import { EmptySize, emptyClasses as classes } from '@mezzanine-ui/core/empty';
import {
  BoxIcon,
  FolderOpenIcon,
  IconDefinition,
  NotificationIcon,
  SystemIcon,
} from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznButtonGroup } from '@mezzanine-ui/ng/button';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { NgTemplateOutlet } from '@angular/common';
import { EmptyType } from './typings';
import { MznEmptyMainInitialDataIcon } from './icons/empty-main-initial-data-icon.component';
import { MznEmptyMainNotificationIcon } from './icons/empty-main-notification-icon.component';
import { MznEmptyMainResultIcon } from './icons/empty-main-result-icon.component';
import { MznEmptyMainSystemIcon } from './icons/empty-main-system-icon.component';

const iconMap: Record<Exclude<EmptyType, 'custom'>, IconDefinition> = {
  'initial-data': BoxIcon,
  notification: NotificationIcon,
  result: FolderOpenIcon,
  system: SystemIcon,
};

/**
 * 空狀態元件，用於資料為空時的佔位提示。
 *
 * 透過 `type` 自動選擇對應的預設圖示，搭配 `title` 及 `description` 傳遞訊息。
 * 使用 `<ng-content>` 投射自訂圖示或操作按鈕。
 * 透過 `pictogram` 傳入自訂圖形 TemplateRef 取代預設圖示。
 * 在 `size="main"` 時顯示大型 SVG 圖示；在 `size="sub"` 或 `size="minor"` 時顯示小型圖示。
 *
 * @example
 * ```html
 * import { MznEmpty } from '@mezzanine-ui/ng/empty';
 *
 * <div mznEmpty type="initial-data" title="尚無資料" description="請先建立第一筆資料" ></div>
 *
 * <div mznEmpty type="result" title="搜尋無結果" size="sub">
 *   <button mznButton variant="base-secondary" actions>重新搜尋</button>
 * </div>
 *
 * <!-- 自訂 pictogram -->
 * <ng-template #customPic><img src="..." alt="" /></ng-template>
 * <div mznEmpty [pictogram]="customPic" title="自訂圖示" ></div>
 * ```
 */
@Component({
  selector: '[mznEmpty]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MznButtonGroup,
    MznIcon,
    NgTemplateOutlet,
    MznEmptyMainInitialDataIcon,
    MznEmptyMainNotificationIcon,
    MznEmptyMainResultIcon,
    MznEmptyMainSystemIcon,
  ],
  host: {
    '[class]': 'hostClasses()',
    '[attr.title]': 'null',
    '[attr.type]': 'null',
    '[attr.size]': 'null',
    '[attr.description]': 'null',
  },
  template: `
    <div [class]="classes.container">
      @if (pictogram()) {
        <div [class]="classes.icon">
          <ng-container [ngTemplateOutlet]="pictogram()!" />
        </div>
      } @else if (type() !== 'custom') {
        @if (size() === 'main') {
          @switch (type()) {
            @case ('initial-data') {
              <mzn-empty-main-initial-data-icon [class]="classes.icon" />
            }
            @case ('result') {
              <mzn-empty-main-result-icon [class]="classes.icon" />
            }
            @case ('system') {
              <mzn-empty-main-system-icon [class]="classes.icon" />
            }
            @case ('notification') {
              <mzn-empty-main-notification-icon [class]="classes.icon" />
            }
          }
        } @else {
          <i mznIcon [class]="classes.icon" [icon]="iconDef()!"></i>
        }
      }

      <p [class]="classes.title">{{ title() }}</p>

      @if (description()) {
        <p [class]="classes.description">{{ description() }}</p>
      }

      @if (size() !== 'minor') {
        <mzn-button-group [class]="classes.actions">
          <ng-content select="[actions]" />
        </mzn-button-group>
      }
    </div>
  `,
})
export class MznEmpty {
  protected readonly classes = classes;

  /** 空狀態的標題文字。 */
  readonly title = input.required<string>();

  /**
   * 空狀態類型，決定預設圖示。
   * @default 'initial-data'
   */
  readonly type = input<EmptyType>('initial-data');

  /**
   * 元件尺寸。
   * @default 'main'
   */
  readonly size = input<EmptySize>('main');

  /** 描述文字，顯示在標題下方。 */
  readonly description = input<string>();

  /**
   * 自訂圖形 TemplateRef，取代預設的 icon。設定後 type 的 icon 不會顯示。
   */
  readonly pictogram = input<TemplateRef<unknown> | undefined>(undefined);

  protected readonly iconDef = computed((): IconDefinition | null => {
    const type = this.type();

    if (type === 'custom') return null;

    return iconMap[type] ?? null;
  });

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, classes.size(this.size())),
  );
}
