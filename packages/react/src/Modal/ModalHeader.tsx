'use client';

import { forwardRef, useContext } from 'react';
import {
  modalClasses as classes,
  ModalStatusType,
  modalStatusTypeIcons,
} from '@mezzanine-ui/core/modal';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Icon from '../Icon';
import { ModalControlContext } from './ModalControl';
import Typography from '../Typography';

export interface ModalHeaderProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * Whether to show status type icon.
   * @default false
   */
  showStatusTypeIcon?: boolean;
  /**
   * Layout of the status type icon relative to title.
   * - 'vertical': Icon above title
   * - 'horizontal': Icon to the left of title
   * @default 'vertical'
   */
  statusTypeIconLayout?: 'vertical' | 'horizontal';
  /**
   * Supporting text displayed below the title.
   */
  supportingText?: string;
  /**
   * Alignment of the supporting text.
   * @default 'left'
   */
  supportingTextAlign?: 'left' | 'center';
  /**
   * The title text of the modal header.
   */
  title: string;
  /**
   * Alignment of the title.
   * @default 'left'
   */
  titleAlign?: 'left' | 'center';
}

/**
 * The React component for `mezzanine` modal header.
 */
const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  function ModalHeader(props, ref) {
    const {
      className,
      showStatusTypeIcon = false,
      statusTypeIconLayout = 'vertical',
      supportingText,
      supportingTextAlign = 'left',
      title,
      titleAlign = 'left',
      ...rest
    } = props;
    const { modalStatusType } = useContext(ModalControlContext);

    const iconColor = (type: ModalStatusType) => {
      switch (type) {
        case 'success':
          return 'success-strong';
        case 'warning':
          return 'warning';
        case 'error':
          return 'error-solid';
        case 'info':
          return 'info-strong';
        case 'email':
          return 'info-strong';
        case 'delete':
          return 'error-solid';
        default:
          return 'neutral';
      }
    };

    return (
      <div
        {...rest}
        ref={ref}
        className={cx(
          classes.modalHeader,
          {
            [classes.modalHeader + '--horizontal']:
              statusTypeIconLayout === 'horizontal',
            [classes.modalHeader + '--vertical']:
              statusTypeIconLayout === 'vertical',
            [classes.modalHeader + '--title-align-left']: titleAlign === 'left',
            [classes.modalHeader + '--title-align-center']:
              titleAlign === 'center',
            [classes.modalHeader + '--show-modal-status-type-icon']:
              showStatusTypeIcon,
          },
          className,
        )}
      >
        {showStatusTypeIcon && (
          <div className={cx(classes.modalHeaderStatusTypeIcon)}>
            <Icon
              icon={modalStatusTypeIcons[modalStatusType]}
              color={iconColor(modalStatusType)}
              size={20}
            />
          </div>
        )}
        <div className={cx(classes.modalHeaderTitleAndSupportingTextContainer)}>
          <Typography
            variant="h3"
            color="text-neutral-solid"
            className={cx(classes.modalHeaderTitle)}
            title={typeof title === 'string' ? title : undefined}
          >
            {title}
          </Typography>
          <Typography
            variant="body"
            color="text-neutral-strong"
            className={cx(classes.modalHeaderSupportingText, {
              [classes.modalHeaderSupportingText + '--align-left']:
                supportingTextAlign === 'left',
              [classes.modalHeaderSupportingText + '--align-center']:
                supportingTextAlign === 'center',
            })}
          >
            {supportingText}
          </Typography>
        </div>
      </div>
    );
  },
);

export default ModalHeader;
