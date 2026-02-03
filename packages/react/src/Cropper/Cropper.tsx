'use client';

import { cropperClasses as classes } from '@mezzanine-ui/core/cropper';
import type { ReactElement } from 'react';
import { Key, forwardRef, useCallback, useRef, useState } from 'react';
import type { ModalProps } from '../Modal';
import Modal from '../Modal';
import { createNotifier } from '../Notifier';
import { cx } from '../utils/cx';
import { ComponentOverridableForwardRefComponentPropsFactory } from '../utils/jsx-types';
import CropperElement from './CropperElement';
import { CropArea, CropperComponent, CropperPropsBase } from './typings';

export type CropperModalProps = Omit<
  ModalProps,
  | 'children'
  | 'modalType'
  | 'extendedSplitLeftSideContent'
  | 'extendedSplitRightSideContent'
  | 'onCancel'
  | 'onConfirm'
  | 'showCancelButton'
  | 'showModalFooter'
  | 'showModalHeader'
  | 'confirmText'
  | 'title'
> & {
  /**
   * The text for the cancel button.
   */
  cancelText?: ModalProps['cancelText'];
  /**
   * The text for the confirm button.
   * @default '確認'
   */
  confirmText?: string;
  /**
   * Additional className for the cropper content wrapper.
   */
  cropperContentClassName?: string;
  /**
   * Props for the CropperElement component.
   */
  cropperProps?: CropperPropsBase;
  /**
   * Callback fired when the cancel button is clicked.
   */
  onCancel?: () => void;
  /**
   * Callback fired when the confirm button is clicked.
   * Receives the cropping context with canvas, cropArea, and imageSrc.
   */
  onConfirm?: (context: CropperModalConfirmContext) => void | Promise<void>;
  /**
   * Whether to show the modal footer with confirm and cancel buttons.
   * @default true
   */
  showModalFooter?: boolean;
  /**
   * Whether to show the modal header.
   * @default true
   */
  showModalHeader?: boolean;
  /**
   * The title of the modal header.
   * @default '圖片裁切'
   */
  title?: string;
};

export interface CropperModalConfirmContext {
  canvas: HTMLCanvasElement | null;
  cropArea: CropArea | null;
  imageSrc?: string | File | Blob;
}

export type CropperModalResult = CropperModalConfirmContext;

export type CropperModalOpenOptions = Omit<CropperModalProps, 'open'>;

export type CropperProps<C extends CropperComponent = 'div'> =
  ComponentOverridableForwardRefComponentPropsFactory<
    CropperComponent,
    C,
    CropperPropsBase
  >;

/**
 * The react component for `mezzanine` cropper.
 */
const Cropper = forwardRef<HTMLDivElement, CropperProps>(
  function Cropper(props, ref) {
    const {
      children,
      className,
      component: Component = 'div',
      size = 'main',
      ...rest
    } = props;

    return (
      <Component
        {...rest}
        ref={ref}
        className={cx(
          classes.host,
          classes.size(size),
          className,
        )}
      >
        {children}
      </Component>
    );
  },
);

/**
 * The react component for `mezzanine` cropper with modal wrapper.
 */
const CropperModalComponent = forwardRef<HTMLDivElement, CropperModalProps>(
  function CropperModal(props, ref) {
    const {
      cropperProps,
      onConfirm,
      onClose,
      showModalFooter = true,
      showModalHeader = true,
      title = '圖片裁切',
      size = 'wide',
      confirmText = '確認',
      cancelText = '取消',
      onCancel,
      open = false,
      cropperContentClassName,
      ...restModalProps
    } = props;
    const {
      aspectRatio,
      imageSrc,
      initialCropArea,
      minHeight,
      minWidth,
      onCropChange,
      size: cropperSize = 'main',
    } = cropperProps ?? {};
    const [currentCropArea, setCurrentCropArea] = useState<CropArea | null>(
      initialCropArea ?? null,
    );
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const handleCropChange = useCallback(
      (area: CropArea) => {
        setCurrentCropArea(area);
        onCropChange?.(area);
      },
      [onCropChange],
    );

    const handleCancel = useCallback(() => {
      onCancel?.();
      onClose?.();
    }, [onCancel, onClose]);

    const handleConfirm = useCallback(async () => {
      await onConfirm?.({
        canvas: canvasRef.current,
        cropArea: currentCropArea,
        imageSrc,
      });
      onClose?.();
    }, [currentCropArea, imageSrc, onClose, onConfirm]);

    const modalFooterProps = showModalFooter
      ? {
        showModalFooter: true as const,
        confirmText,
        showCancelButton: true,
        cancelText,
        onCancel: handleCancel,
        onConfirm: handleConfirm,
      }
      : {
        showModalFooter: false as const,
      };

    const modalHeaderProps = showModalHeader
      ? {
        showModalHeader: true as const,
        title: title ?? '圖片裁切',
      }
      : {
        showModalHeader: false as const,
      };

    return (
      <Modal
        modalType="standard"
        onClose={onClose}
        open={open}
        ref={ref}
        size={size}
        {...restModalProps}
        {...modalHeaderProps}
        {...modalFooterProps}
      >
        <CropperElement
          className={cx(classes.content, cropperContentClassName)}
          aspectRatio={aspectRatio}
          imageSrc={imageSrc}
          initialCropArea={initialCropArea}
          minHeight={minHeight}
          minWidth={minWidth}
          onCropChange={handleCropChange}
          ref={canvasRef}
          size={cropperSize}
        />
      </Modal>
    );
  },
);

export type CropperModalType = ((props: CropperModalProps) => ReactElement | null) & {
  open: (options: CropperModalOpenOptions) => Promise<CropperModalResult | null>;
};

export const CropperModal = CropperModalComponent as unknown as CropperModalType;

interface CropperModalNotifierData extends CropperModalOpenOptions {
  instanceKey?: Key;
  resolve: (result: CropperModalResult | null) => void;
}

type CropperModalNotifierProps = CropperModalNotifierData & {
  notifierKey: Key;
};

const CropperModalNotifier = (props: CropperModalNotifierProps) => {
  const {
    instanceKey,
    notifierKey,
    onCancel,
    onClose,
    onConfirm,
    resolve,
    ...rest
  } = props;
  const resolvedRef = useRef(false);

  const resolveOnce = useCallback(
    (result: CropperModalResult | null) => {
      if (resolvedRef.current) return;
      resolvedRef.current = true;
      resolve(result);
      cropperModalNotifier.remove(instanceKey ?? notifierKey);
    },
    [instanceKey, notifierKey, resolve],
  );

  const handleClose = useCallback(() => {
    onClose?.();
    resolveOnce(null);
  }, [onClose, resolveOnce]);

  const handleConfirm = useCallback(
    async (context: CropperModalConfirmContext) => {
      await onConfirm?.(context);
      resolveOnce(context);
    },
    [onConfirm, resolveOnce],
  );

  const mergedModalProps = {
    ...rest,
    onCancel,
    onClose: handleClose,
    onConfirm: handleConfirm,
    open: true,
  };

  return (
    <CropperModal {...mergedModalProps} />
  );
};

const cropperModalNotifier = createNotifier<CropperModalNotifierData>({
  render: (notifierProps) => (
    <CropperModalNotifier
      {...notifierProps}
      notifierKey={notifierProps.key}
    />
  ),
});

CropperModal.open = (options: CropperModalOpenOptions) =>
  new Promise<CropperModalResult | null>((resolve) => {
    cropperModalNotifier.add({
      ...options,
      resolve,
    });
  });

export default Cropper;

