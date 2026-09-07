import { defineComponent, h } from 'vue';
import type { PropType } from 'vue';
import { createNotifier } from '../notifier/create-notifier';
import type { NotifierKey } from '../notifier/notifier.types';
import MznCropperModalComponent from './cropper-modal.vue';
import type {
  CropperModalConfirmContext,
  CropperModalOpenOptions,
  CropperModalProps,
  CropperModalResult,
} from './cropper-modal.types';

interface CropperModalNotifierData extends CropperModalOpenOptions {
  /** The key the notifier registered this instance under. */
  instanceKey?: NotifierKey;
  /** Settles the promise `open()` handed back. */
  resolve: (result: CropperModalResult | null) => void;
}

type CropperModalNotifierProps = CropperModalNotifierData & {
  notifierKey: NotifierKey;
};

/**
 * Wraps one imperatively opened modal so the promise settles exactly once,
 * whichever way the modal goes away, and takes the instance off the notifier
 * afterwards.
 */
const CropperModalNotifier = defineComponent({
  name: 'MznCropperModalNotifier',
  props: {
    notifierData: {
      required: true,
      type: Object as PropType<CropperModalNotifierProps>,
    },
  },
  setup(props) {
    let resolved = false;

    function resolveOnce(result: CropperModalResult | null): void {
      if (resolved) return;

      resolved = true;

      const { instanceKey, notifierKey, resolve } = props.notifierData;

      resolve(result);
      cropperModalNotifier.remove(instanceKey ?? notifierKey);
    }

    function handleClose(): void {
      props.notifierData.onClose?.();
      resolveOnce(null);
    }

    async function handleConfirm(
      context: CropperModalConfirmContext,
    ): Promise<void> {
      try {
        await props.notifierData.onConfirm?.(context);
        resolveOnce(context);
      } catch (error) {
        console.error('CropperModalNotifier onConfirm failed:', error);
        resolveOnce(null);
      }
    }

    return () => {
      const {
        duration: _duration,
        instanceKey: _instanceKey,
        maxCount: _maxCount,
        notifierKey: _notifierKey,
        onCancel,
        onClose: _onClose,
        onConfirm: _onConfirm,
        resolve: _resolve,
        ...rest
      } = props.notifierData as CropperModalNotifierProps & {
        duration?: unknown;
        maxCount?: unknown;
      };

      return h(MznCropperModalComponent, {
        ...rest,
        onCancel,
        onClose: handleClose,
        onConfirm: handleConfirm,
        open: true,
      } as CropperModalProps);
    };
  },
});

const cropperModalNotifier = createNotifier<CropperModalNotifierData>({
  render: (notifierProps) => {
    const { key, ...restProps } = notifierProps;

    return h(CropperModalNotifier, {
      notifierData: { ...restProps, notifierKey: key },
    });
  },
});

/**
 * 開啟一個獨立掛載的裁切對話框，並在關閉時回傳裁切結果。
 *
 * 按下確認會先等 `onConfirm` 完成，再以同一份 context 兌現 Promise；
 * 取消、關閉或 `onConfirm` 拋錯則兌現 `null`。每次呼叫都是一個新的實例，
 * 不會互相干擾。
 *
 * @example
 * ```ts
 * import { MznCropperModal, cropToDataURL } from '@mezzanine-ui/vue/cropper';
 *
 * const result = await MznCropperModal.open({
 *   cropperProps: { aspectRatio: 1, imageSrc: file },
 *   title: '裁切頁首圖片',
 * });
 *
 * if (result?.canvas && result.cropArea && result.imageSrc) {
 *   const dataUrl = await cropToDataURL({ ...result, canvas: result.canvas });
 * }
 * ```
 */
function open(
  options: CropperModalOpenOptions,
): Promise<CropperModalResult | null> {
  return new Promise<CropperModalResult | null>((resolve) => {
    cropperModalNotifier.add({
      ...options,
      resolve,
    });
  });
}

/**
 * 裁切對話框，除了當成元件使用之外也可以用 `MznCropperModal.open()` 命令式開啟。
 *
 * @see MznCropperElement 對話框內部的裁切畫布
 */
export const MznCropperModal = Object.assign(MznCropperModalComponent, {
  open,
});

export type CropperModalType = typeof MznCropperModal;
