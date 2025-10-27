'use client';

import { forwardRef, useContext } from 'react';
import {
  modalClasses as classes,
  modalSeverityIcons,
} from '@mezzanine-ui/core/modal';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Icon from '../Icon';
import { ModalControlContext } from './ModalControl';

export interface ModalHeaderProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * Whether to show severity icon.
   * @default false
   */
  showSeverityIcon?: boolean;
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
const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  function ModalHeader(props, ref) {
    const {
      children,
      className,
      showSeverityIcon = false,
      titleLarge = false,
      ...rest
    } = props;
    const { severity } = useContext(ModalControlContext);

    return (
      <div {...rest} ref={ref} className={cx(classes.header, className)}>
        {showSeverityIcon && (
          <Icon
            className={classes.severityIcon}
            icon={modalSeverityIcons[severity]}
          />
        )}
        <h3
          className={cx(classes.title, {
            [classes.titleLarge]: titleLarge,
          })}
          title={typeof children === 'string' ? children : undefined}
        >
          {children}
        </h3>
      </div>
    );
  },
);

export default ModalHeader;
