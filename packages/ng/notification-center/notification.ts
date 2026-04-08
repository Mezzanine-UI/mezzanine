import type { NotificationSeverity } from '@mezzanine-ui/core/notification-center';

export type { NotificationSeverity };

export interface NotificationItem {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly severity?: NotificationSeverity;
  readonly timestamp?: Date;
  readonly read?: boolean;
}
