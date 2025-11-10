import {
  inlineMessageGroupClasses as classes,
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
  extends Omit<InlineMessageProps, 'content'> {
  key: Key;
  content: string;
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
      content={content}
      onClose={() => {
        if (onClose) {
          onClose();
        }

        if (onItemClose) {
          onItemClose(key);
        }
      }}
    />
  ));

const InlineMessageGroup = forwardRef<HTMLDivElement, InlineMessageGroupProps>(
  function InlineMessageGroup(props, ref) {
    const {
      children: childrenProp,
      className,
      items,
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

