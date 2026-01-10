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
  modalHeaderShowModalStatusTypeIcon?: boolean;
  /**
   * Layout of the status type icon relative to title.
   * - 'vertical': Icon above title
   * - 'horizontal': Icon to the left of title
   * @default 'vertical'
   */
  modalHeaderStatusTypeIconLayout?: 'vertical' | 'horizontal';
  /**
   * Supporting text displayed below the title.
   */
  modalHeaderSupportingText?: string;
  /**
   * Alignment of the supporting text.
   * @default 'left'
   */
  modalHeaderSupportingTextAlign?: 'left' | 'center';
  /**
   * The title text of the modal header.
   */
  modalHeaderTitle: string;
  /**
   * Alignment of the title.
   * @default 'left'
   */
  modalHeaderTitleAlign?: 'left' | 'center';
}

/**
 * The React component for `mezzanine` modal header.
 */
const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  function ModalHeader(props, ref) {
    const {
      children,
      modalHeaderShowModalStatusTypeIcon = false,
      modalHeaderStatusTypeIconLayout = 'vertical',
      modalHeaderSupportingText,
      modalHeaderSupportingTextAlign,
      modalHeaderTitle,
      modalHeaderTitleAlign,
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
              modalHeaderStatusTypeIconLayout === 'horizontal',
            [classes.modalHeader + '--vertical']:
              modalHeaderStatusTypeIconLayout === 'vertical',
            [classes.modalHeader + '--title-align-left']:
              modalHeaderTitleAlign === 'left',
            [classes.modalHeader + '--title-align-center']:
              modalHeaderTitleAlign === 'center',
            [classes.modalHeader + '--show-modal-status-type-icon']:
              modalHeaderShowModalStatusTypeIcon,
          },
        )}
      >
        {modalHeaderShowModalStatusTypeIcon && (
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
            title={typeof children === 'string' ? children : undefined}
          >
            {modalHeaderTitle}
          </Typography>
          <Typography
            variant="body"
            color="text-neutral-strong"
            className={cx(classes.modalHeaderSupportingText, {
              [classes.modalHeaderSupportingText + '--align-left']:
                modalHeaderSupportingTextAlign === 'left',
              [classes.modalHeaderSupportingText + '--align-center']:
                modalHeaderSupportingTextAlign === 'center',
            })}
          >
            {modalHeaderSupportingText}
          </Typography>
        </div>
      </div>
    );
  },
);

export default ModalHeader;
