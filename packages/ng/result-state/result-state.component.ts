import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  resultStateClasses as classes,
  ResultStateSize,
  ResultStateType,
} from '@mezzanine-ui/core/result-state';
import {
  CheckedFilledIcon,
  DangerousFilledIcon,
  ErrorFilledIcon,
  IconDefinition,
  InfoFilledIcon,
  QuestionFilledIcon,
  WarningFilledIcon,
} from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznButtonGroup } from '@mezzanine-ui/ng/button';
import { MznIcon } from '@mezzanine-ui/ng/icon';

const iconMap: Record<ResultStateType, IconDefinition> = {
  information: InfoFilledIcon,
  success: CheckedFilledIcon,
  help: QuestionFilledIcon,
  warning: WarningFilledIcon,
  error: ErrorFilledIcon,
  failure: DangerousFilledIcon,
};

/**
 * 結果狀態元件，用於操作結果或狀態頁面的顯示。
 *
 * 根據 `type` 自動選擇對應圖示（information、success、help、warning、error、failure），
 * 搭配 `title` 及 `description` 傳遞訊息。使用 content projection 投射操作按鈕。
 *
 * @example
 * ```html
 * import { MznResultState } from '@mezzanine-ui/ng/result-state';
 *
 * <div mznResultState type="success" title="操作成功" description="您的資料已儲存" ></div>
 *
 * <div mznResultState type="error" title="操作失敗" size="sub">
 *   <button actions>重試</button>
 * </div>
 * ```
 */
@Component({
  selector: '[mznResultState]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznButtonGroup, MznIcon],
  host: {
    '[class]': 'hostClasses()',
    '[attr.description]': 'null',
    '[attr.size]': 'null',
    '[attr.title]': 'null',
    '[attr.type]': 'null',
  },
  template: `
    <div [class]="classes.container">
      <i mznIcon [class]="classes.icon" [icon]="iconDef()"></i>
      <h3 [class]="classes.title">{{ title() }}</h3>
      @if (description()) {
        <p [class]="classes.description">{{ description() }}</p>
      }
      <div mznButtonGroup [class]="classes.actions">
        <ng-content select="[actions]" />
      </div>
    </div>
  `,
})
export class MznResultState {
  protected readonly classes = classes;

  /** 描述文字，顯示在標題下方。 */
  readonly description = input<string>();

  /**
   * 元件尺寸。
   * @default 'main'
   */
  readonly size = input<ResultStateSize>('main');

  /** 結果狀態的標題文字。 */
  readonly title = input.required<string>();

  /**
   * 結果狀態類型，決定預設圖示與色彩。
   * @default 'information'
   */
  readonly type = input<ResultStateType>('information');

  protected readonly iconDef = computed(
    (): IconDefinition => iconMap[this.type()],
  );

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, classes.type(this.type()), classes.size(this.size())),
  );
}
