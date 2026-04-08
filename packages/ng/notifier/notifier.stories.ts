import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { Component, inject } from '@angular/core';
import { MznNotifierService, NotifierData } from './notifier.service';

// ---------------------------------------------------------------------------
// Basic demo
// ---------------------------------------------------------------------------

@Component({
  selector: 'mzn-notifier-demo',
  standalone: true,
  template: `
    <div style="display: flex; gap: 8px; margin-bottom: 16px;">
      <button (click)="addNotification()">Add Notification</button>
      <button (click)="destroyAll()">Destroy All</button>
    </div>
    <div style="display: flex; flex-direction: column; gap: 4px;">
      <p>Displayed ({{ notifier.displayed().length }}):</p>
      @for (n of notifier.displayed(); track n.key) {
        <div
          style="padding: 8px; border: 1px solid #ccc; display: flex; justify-content: space-between;"
        >
          <span>{{ n.message }} (key: {{ n.key }})</span>
          <button (click)="notifier.remove(n.key)">×</button>
        </div>
      }
      <p>Queued ({{ notifier.queued().length }}):</p>
      @for (n of notifier.queued(); track n.key) {
        <div style="padding: 8px; border: 1px dashed #999;">
          {{ n.message }} (key: {{ n.key }})
        </div>
      }
    </div>
  `,
})
class NotifierDemoComponent {
  protected readonly notifier = inject(MznNotifierService);
  private count = 0;

  constructor() {
    this.notifier.config({ maxCount: 3 });
  }

  addNotification(): void {
    this.notifier.add({ message: `Notification #${++this.count}` });
  }

  destroyAll(): void {
    this.notifier.destroy();
  }
}

// ---------------------------------------------------------------------------
// sortBeforeUpdate demo
// ---------------------------------------------------------------------------

type SeverityLevel = 'error' | 'warning' | 'info';

interface SeverityNotifierData extends NotifierData {
  readonly severity: SeverityLevel;
}

function getSeverityPriority(severity: SeverityLevel): number {
  const priorities: Record<SeverityLevel, number> = {
    error: 0,
    warning: 1,
    info: 2,
  };

  return priorities[severity];
}

@Component({
  selector: 'mzn-notifier-sort-demo',
  standalone: true,
  template: `
    <p style="margin-bottom: 8px;">
      Notifications are sorted: <strong>error → warning → info</strong> (within
      maxCount: 4).
    </p>
    <div style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
      <button (click)="add('error')">Add Error</button>
      <button (click)="add('warning')">Add Warning</button>
      <button (click)="add('info')">Add Info</button>
      <button (click)="notifier.destroy()">Destroy All</button>
    </div>
    <div style="display: flex; flex-direction: column; gap: 4px;">
      <p>Displayed ({{ notifier.displayed().length }}):</p>
      @for (n of displayed(); track n.key) {
        <div
          [style.border-color]="borderColor(n.severity)"
          style="padding: 8px; border: 2px solid; display: flex; justify-content: space-between;"
        >
          <span>[{{ n.severity }}] {{ n.message }}</span>
          <button (click)="notifier.remove(n.key)">×</button>
        </div>
      }
      <p>Queued ({{ notifier.queued().length }}):</p>
      @for (n of queued(); track n.key) {
        <div style="padding: 8px; border: 1px dashed #999;">
          [{{ n.severity }}] {{ n.message }}
        </div>
      }
    </div>
  `,
})
class NotifierSortDemoComponent {
  protected readonly notifier = inject(MznNotifierService);
  private count = 0;

  constructor() {
    this.notifier.config({ maxCount: 4 });
    this.notifier.setSortBeforeUpdate(
      (items: ReadonlyArray<NotifierData>): ReadonlyArray<NotifierData> => {
        const typed = items as ReadonlyArray<SeverityNotifierData>;

        return [...typed].sort(
          (a, b) =>
            getSeverityPriority(a.severity) - getSeverityPriority(b.severity),
        );
      },
    );
  }

  protected displayed(): ReadonlyArray<SeverityNotifierData> {
    return this.notifier.displayed() as ReadonlyArray<SeverityNotifierData>;
  }

  protected queued(): ReadonlyArray<SeverityNotifierData> {
    return this.notifier.queued() as ReadonlyArray<SeverityNotifierData>;
  }

  protected borderColor(severity: SeverityLevel): string {
    const colors: Record<SeverityLevel, string> = {
      error: '#d32f2f',
      warning: '#f57c00',
      info: '#1976d2',
    };

    return colors[severity];
  }

  add(severity: SeverityLevel): void {
    this.notifier.add({
      message: `${severity} #${++this.count}`,
      severity,
    });
  }
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

export default {
  title: 'Internal/Notifier',
  decorators: [
    moduleMetadata({
      imports: [NotifierDemoComponent, NotifierSortDemoComponent],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Common: Story = {
  render: () => ({
    template: `<mzn-notifier-demo />`,
  }),
};

/**
 * Demonstrates `setSortBeforeUpdate` — notifiers are re-ordered by severity
 * (error → warning → info) every time the list changes, mirroring the React
 * `sortBeforeUpdate` prop used by `AlertBanner`.
 */
export const WithSortBeforeUpdate: Story = {
  render: () => ({
    template: `<mzn-notifier-sort-demo />`,
  }),
};
