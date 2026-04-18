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
import { MznButton, MznButtonGroup } from '@mezzanine-ui/ng/button';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { NgTemplateOutlet } from '@angular/common';
import { EmptyActionConfig, EmptyActions, EmptyType } from './typings';
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
 * 提供兩種 action 按鈕 API：
 * 1. `actions` input（物件設定）— 對齊 React `actions` prop，Empty 會內部渲染按鈕並統一套用 `size` 與 `variant`。
 * 2. `<ng-content select="[actions]" />`（內容投射）— Angular 原生用法，使用者需自行設定按鈕的 size/variant，否則按鈕尺寸不會跟隨 Empty（因為 content projection 的 DI 以宣告位置為準）。
 * 透過 `pictogram` 傳入自訂圖形 TemplateRef 取代預設圖示。
 * 在 `size="main"` 時顯示大型 SVG 圖示；在 `size="sub"` 或 `size="minor"` 時顯示小型圖示。
 *
 * @example
 * ```html
 * import { MznEmpty } from '@mezzanine-ui/ng/empty';
 *
 * <!-- 使用 actions input（推薦，自動套用 size） -->
 * <div mznEmpty
 *   type="initial-data"
 *   title="尚無資料"
 *   size="sub"
 *   [actions]="{ secondaryButton: { children: 'Secondary' }, primaryButton: { children: 'Primary' } }"
 * ></div>
 *
 * <!-- 使用 content projection（需自行設定 size） -->
 * <div mznEmpty type="result" title="搜尋無結果" size="sub">
 *   <button mznButton variant="base-secondary" size="sub" actions>重新搜尋</button>
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
    MznButton,
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
              <div mznEmptyMainInitialDataIcon [class]="classes.icon"></div>
            }
            @case ('result') {
              <div mznEmptyMainResultIcon [class]="classes.icon"></div>
            }
            @case ('system') {
              <div mznEmptyMainSystemIcon [class]="classes.icon"></div>
            }
            @case ('notification') {
              <div mznEmptyMainNotificationIcon [class]="classes.icon"></div>
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
        @if (actions()) {
          <div mznButtonGroup [size]="size()" [class]="classes.actions">
            @if (resolvedSecondary(); as sec) {
              <button
                mznButton
                variant="base-secondary"
                [disabled]="!!sec.disabled"
                [loading]="!!sec.loading"
                (click)="sec.onClick?.()"
              >
                {{ sec.children }}
              </button>
            }
            @if (resolvedPrimary(); as pri) {
              <button
                mznButton
                variant="base-primary"
                [disabled]="!!pri.disabled"
                [loading]="!!pri.loading"
                (click)="pri.onClick?.()"
              >
                {{ pri.children }}
              </button>
            }
          </div>
        } @else {
          <div mznButtonGroup [size]="size()" [class]="classes.actions">
            <ng-content select="[actions]" />
          </div>
        }
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

  /**
   * 動作按鈕設定。鏡像 React `actions` prop。
   *
   * - 傳入單一物件 → 視為 secondary 按鈕。
   * - 傳入 `{ primaryButton?, secondaryButton }` → 分別渲染。
   *
   * 當 `actions` 提供時，Empty 會忽略 `<ng-content select="[actions]">` 的投射內容。
   */
  readonly actions = input<EmptyActions>();

  protected readonly iconDef = computed((): IconDefinition | null => {
    const type = this.type();

    if (type === 'custom') return null;

    return iconMap[type] ?? null;
  });

  protected readonly resolvedSecondary = computed(
    (): EmptyActionConfig | undefined => {
      const a = this.actions();

      if (!a) return undefined;

      if ('secondaryButton' in a) return a.secondaryButton;

      return a;
    },
  );

  protected readonly resolvedPrimary = computed(
    (): EmptyActionConfig | undefined => {
      const a = this.actions();

      if (!a) return undefined;

      if ('secondaryButton' in a) return a.primaryButton;

      return undefined;
    },
  );

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, classes.size(this.size())),
  );
}
