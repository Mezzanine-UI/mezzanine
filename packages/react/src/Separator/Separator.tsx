import {
  SeparatorOrientation,
  separatorClasses as classes,
} from '@mezzanine-ui/core/separator';
import { forwardRef } from 'react';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface SeparatorProps
  extends NativeElementPropsWithoutKeyAndRef<'hr'> {
  /**
   * The orientation of the separator.
   * @default 'horizontal'
   */
  orientation?: SeparatorOrientation;
}

/**
 * 水平或垂直分隔線元件。
 *
 * 以 `<hr>` 元素為基礎，透過 `orientation` prop 切換水平與垂直方向。
 * 垂直方向時會自動設置 `aria-orientation="vertical"` 以符合無障礙規範。
 *
 * @example
 * ```tsx
 * import Separator from '@mezzanine-ui/react/Separator';
 *
 * // 水平分隔線（預設）
 * <Separator />
 *
 * // 垂直分隔線
 * <div style={{ display: 'flex', alignItems: 'center' }}>
 *   <span>左側內容</span>
 *   <Separator orientation="vertical" />
 *   <span>右側內容</span>
 * </div>
 * ```
 */
const Separator = forwardRef<HTMLHRElement, SeparatorProps>(
  function Separator(props, ref) {
    const { className, orientation = 'horizontal', ...rest } = props;

    return (
      <hr
        {...rest}
        aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
        ref={ref}
        className={cx(
          classes.host,
          {
            [classes.horizontal]: orientation === 'horizontal',
            [classes.vertical]: orientation === 'vertical',
          },
          className,
        )}
      />
    );
  },
);

export default Separator;
