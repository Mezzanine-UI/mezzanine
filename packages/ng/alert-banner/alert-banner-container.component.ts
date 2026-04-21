import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from '@angular/core';
import {
  alertBannerGroupClasses,
  AlertBannerSeverity,
} from '@mezzanine-ui/core/alert-banner';
import { IconDefinition } from '@mezzanine-ui/icons';
import { MznPortal } from '@mezzanine-ui/ng/portal';
import { MznAlertBanner, AlertBannerAction } from './alert-banner.component';
import { MznAlertBannerService } from './alert-banner.service';
import {
  MznNotifierService,
  type NotifierData,
} from '@mezzanine-ui/ng/notifier';

/** Shape of a notifier entry emitted by {@link MznAlertBannerService}. */
interface AlertBannerNotifierEntry extends NotifierData {
  readonly severity: AlertBannerSeverity;
  readonly message: string;
  readonly actions?: ReadonlyArray<AlertBannerAction>;
  readonly closable?: boolean;
  readonly icon?: IconDefinition;
  readonly onClose?: () => void;
  readonly createdAt?: number;
}

/**
 * 橫幅通知渲染容器。對應 React `createNotifier().renderContainer` 的
 * `<Portal layer="alert"><div class="mzn-alert-banner__group">` wrapper —
 * 讀取 `MznNotifierService.displayed()` 並為每一筆資料渲染一個
 * `<div mznAlertBanner disablePortal>`，所有 banner 共享同一個 portal
 * 節點。
 *
 * 只要在需要顯示浮動 banner 的地方放一次（例如 root component 或
 * Storybook demo）即可；`MznAlertBannerService.info()/warning()/error()`
 * 的呼叫就會經由 notifier signal 反映到這裡。
 *
 * @example
 * ```html
 * <mzn-alert-banner-container />
 * ```
 */
@Component({
  selector: 'mzn-alert-banner-container',
  standalone: true,
  imports: [MznAlertBanner, MznPortal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (banners().length > 0) {
      <div mznPortal layer="alert">
        <div [class]="groupClass">
          @for (banner of banners(); track banner.key) {
            <div
              mznAlertBanner
              [severity]="banner.severity"
              [message]="banner.message"
              [actions]="banner.actions ?? []"
              [closable]="banner.closable ?? true"
              [icon]="banner.icon"
              [reference]="banner.key"
              [disablePortal]="true"
              (closed)="onBannerClosed(banner)"
            ></div>
          }
        </div>
      </div>
    }
  `,
})
export class MznAlertBannerContainer {
  private readonly notifier = inject(MznNotifierService);
  private readonly alertBannerService = inject(MznAlertBannerService);

  protected readonly groupClass = alertBannerGroupClasses.host;

  protected readonly banners = computed(() =>
    this.notifier
      .displayed()
      .filter(
        (n): n is AlertBannerNotifierEntry =>
          typeof (n as AlertBannerNotifierEntry).severity === 'string',
      ),
  );

  constructor() {
    // Mirror React's sort order (`sortAlertNotifiers`): non-info
    // severities first, then newest createdAt first for ties.
    effect(() => {
      this.notifier.setSortBeforeUpdate((items) => {
        const priority = (severity: string): number =>
          severity === 'info' ? 1 : 0;

        return [...items].sort((a, b) => {
          const aSev = (a as AlertBannerNotifierEntry).severity ?? 'info';
          const bSev = (b as AlertBannerNotifierEntry).severity ?? 'info';
          const pd = priority(aSev) - priority(bSev);

          if (pd !== 0) return pd;

          const aT = (a['createdAt'] as number | undefined) ?? 0;
          const bT = (b['createdAt'] as number | undefined) ?? 0;

          return bT - aT;
        });
      });
    });
  }

  protected onBannerClosed(banner: AlertBannerNotifierEntry): void {
    banner.onClose?.();
    this.alertBannerService.remove(banner.key);
  }
}
