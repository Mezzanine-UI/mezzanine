import { forwardRef, useContext } from 'react';
import {
  modalClasses as classes,
} from '@mezzanine-ui/core/modal';
import {
  InfoCircleFilledIcon,
  MinusCircleFilledIcon,
} from '@mezzanine-ui/icons';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Icon from '../Icon';
import { ModalControlContext } from './ModalControl';

export interface ModalHeaderProps extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * Whether to show title icon.
   * @default false
   */
  showTitleIcon?: boolean;
  /**
   * Controlls the title styles.
   * Use large title if the modal body has section/block titles.
   * @default false
   */
  titleLarge?: boolean;
}

/**
 * The react component for `mezzanine` modal header.
 */
const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(function ModalHeader(props, ref) {
  const {
    children,
    className,
    showTitleIcon = false,
    titleLarge = false,
    ...rest
  } = props;
  const {
    danger,
  } = useContext(ModalControlContext);

  return (
    <div
      {...rest}
      ref={ref}
      className={cx(
        classes.header,
        className,
      )}
    >
      {showTitleIcon && (
        <Icon
          className={classes.titleIcon}
          icon={danger ? MinusCircleFilledIcon : InfoCircleFilledIcon}
        />
      )}
      <h3
        className={cx(
          classes.title,
          {
            [classes.titleLarge]: titleLarge,
          },
        )}
        title={typeof children === 'string' ? children : undefined}
      >
        {children}
      </h3>
    </div>
  );
});

export default ModalHeader;
