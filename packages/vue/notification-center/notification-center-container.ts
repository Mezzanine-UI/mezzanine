import { defineComponent, h } from 'vue';
import type { PropType, VNode, VNodeChild } from 'vue';
import { notificationClasses as classes } from '@mezzanine-ui/core/notification-center';
import MznButton from '../button/button.vue';
import type { NotificationData } from './notification-center.types';

export const DEFAULT_MAX_VISIBLE_NOTIFICATIONS = 3;

/**
 * Wraps the notifier's queue: it shows at most `maxVisibleNotifications` of
 * them and, once there are more, a button that clears the lot.
 *
 * The three settings it needs — the maximum, the view-all callback and its
 * label — are carried on the notifications themselves, so they are read off
 * the first one, exactly as React reads them off its first child.
 */
export default defineComponent({
  name: 'MznNotificationCenterContainer',
  props: {
    destroy: { required: true, type: Function as PropType<VoidFunction> },
    items: { required: true, type: Array as PropType<VNode[]> },
  },
  setup(props) {
    const firstProps = (): NotificationData | undefined =>
      (props.items[0]?.props ?? undefined) as NotificationData | undefined;

    return (): VNodeChild => {
      if (!props.items.length) return null;

      const first = firstProps();
      const maxVisibleNotifications =
        first?.maxVisibleNotifications ?? DEFAULT_MAX_VISIBLE_NOTIFICATIONS;
      const hasOverflow = props.items.length > maxVisibleNotifications;
      const visibleItems = props.items.slice(0, maxVisibleNotifications);

      if (!hasOverflow) return visibleItems;

      const onViewAll = first?.onViewAll;

      return [
        ...visibleItems,
        h('div', { class: classes.viewAllButton }, [
          h(
            MznButton,
            {
              class: classes.viewAllButtonText,
              onClick: () => {
                props.destroy();
                onViewAll?.();
              },
              size: 'main',
              variant: 'base-secondary',
            },
            () => first?.viewAllButtonText ?? '查看更多',
          ),
        ]),
      ];
    };
  },
});
