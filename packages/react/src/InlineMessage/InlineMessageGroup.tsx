import {
  inlineMessageGroupClasses as classes,
  InlineMessageGroupType,
} from '@mezzanine-ui/core/inline-message';
import {
  forwardRef,
  Key,
  ReactElement,
  ReactNode,
  useMemo,
} from 'react';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import InlineMessage, { InlineMessageProps } from './InlineMessage';

export interface InlineMessageGroupItem
  extends Omit<InlineMessageProps, 'children'> {
  key: Key;
  content: ReactNode;
}

export interface InlineMessageGroupProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'children'> {
  /**
   * The inline messages within the group.
   * Ignored when `children` provided.
   */
  items?: InlineMessageGroupItem[];
  /**
   * Custom inline message nodes.
   */
  children?: ReactNode;
  /**
   * Visual density configuration for the group.
   * @default 'message'
   */
  type?: InlineMessageGroupType;
  /**
   * Callback invoked when any item triggers `onClose`.
   */
  onItemClose?: (key: Key) => void;
}

const mapItemsToMessages = (
  items: InlineMessageGroupItem[] | undefined,
  onItemClose: InlineMessageGroupProps['onItemClose'],
): ReactElement[] | undefined =>
  items?.map(({ key, content, onClose, ...restItemProps }) => (
    <InlineMessage
      key={key}
      {...restItemProps}
      onClose={() => {
        if (onClose) {
          onClose();
        }

        if (onItemClose) {
          onItemClose(key);
        }
      }}
    >
      {content}
    </InlineMessage>
  ));

const InlineMessageGroup = forwardRef<HTMLDivElement, InlineMessageGroupProps>(
  function InlineMessageGroup(props, ref) {
    const {
      children: childrenProp,
      className,
      items,
      type = 'message',
      onItemClose,
      ...rest
    } = props;

    const children = useMemo(
      () => childrenProp ?? mapItemsToMessages(items, onItemClose),
      [childrenProp, items, onItemClose],
    );

    return (
      <div
        {...rest}
        ref={ref}
        className={cx(
          classes.host,
          classes.type(type),
          className,
        )}
        aria-live="polite"
        role="region"
      >
        {children}
      </div>
    );
  },
);

export default InlineMessageGroup;

export type { InlineMessageGroupType };

