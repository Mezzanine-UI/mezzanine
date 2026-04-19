import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { MznButton, MznButtonGroup } from '@mezzanine-ui/ng/button';
import { MznNotifierService } from './notifier.service';

/**
 * 對齊 React `createNotifier.stories.tsx:Common`:
 * - 固定 top-right 的通知卡片,藍底白字,`margin-bottom: 8px` 垂直間距。
 * - 三個按鈕:Add a notification / Destroy all notifications /
 *   remove first notification(當佇列為空時不渲染)。
 * - 離開 story 時呼叫 `notifier.destroy()` 釋放殘留通知,對齊 React 的
 *   `useEffect(() => () => Notifier.destroy(), [])`。
 */
@Component({
  selector: 'story-notifier-common',
  standalone: true,
  imports: [MznButton, MznButtonGroup],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div mznButtonGroup style="margin-bottom: 16px;">
      <button mznButton variant="base-primary" (click)="addNotification()">
        Add a notification
      </button>
      <button mznButton variant="base-primary" (click)="destroyAll()">
        Destroy all notifications
      </button>
      @if (messageKeys().length > 0) {
        <button mznButton variant="base-primary" (click)="removeFirst()">
          remove first notification
        </button>
      }
    </div>
    <div
      style="position: fixed; top: 16px; right: 16px; z-index: 9999; min-width: 300px;"
    >
      @for (n of notifier.displayed(); track n.key) {
        <div
          style="padding: 12px 16px; margin-bottom: 8px; background: #1976d2; color: white; border-radius: 4px;"
        >
          {{ n.message }}
        </div>
      }
    </div>
  `,
})
class NotifierCommonComponent {
  protected readonly notifier = inject(MznNotifierService);
  protected readonly messageKeys = signal<ReadonlyArray<string>>([]);

  constructor() {
    this.notifier.config({ duration: 3000, maxCount: 4 });

    // 對齊 React `useEffect(() => () => Notifier.destroy(), [])` 卸載清理。
    inject(DestroyRef).onDestroy(() => {
      this.notifier.destroy();
    });
  }

  addNotification(): void {
    const key = this.notifier.add({ message: 'foo' });

    this.messageKeys.update((prev) => [...prev, key]);
  }

  destroyAll(): void {
    this.notifier.destroy();
    this.messageKeys.set([]);
  }

  removeFirst(): void {
    const keys = this.messageKeys();

    if (keys.length === 0) return;

    this.notifier.remove(keys[0]);
    this.messageKeys.set(keys.slice(1));
  }
}

export default {
  title: 'Internal/Notifier',
  decorators: [
    moduleMetadata({
      imports: [NotifierCommonComponent],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Common: Story = {
  render: () => ({
    template: `<story-notifier-common />`,
  }),
};
