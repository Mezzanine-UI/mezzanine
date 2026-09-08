import type { IconDefinition } from '@mezzanine-ui/icons';
import type { MessageSeverity } from '@mezzanine-ui/core/message';
import type {
  NotifierConfig,
  NotifierData,
  NotifierKey,
} from '../notifier/notifier.types';
import type { TranslateFrom } from '../transition/translate.types';
import type { TransitionEasing } from '../transition/transition.types';

/**
 * The transition callbacks a message forwards to its Translate.
 *
 * React picks them off `TranslateProps`, where they are props; in Vue they are
 * emits, so the ones a message accepts as *data* are spelled out here in their
 * `onXxx` form — which is what a data object carries in either framework.
 */
export interface MessageConfigProps extends Pick<NotifierConfig, 'duration'> {
  easing?: TransitionEasing;
  from?: TranslateFrom;
  onEnter?: (node: HTMLElement, isAppearing: boolean) => void;
  onEntered?: (node: HTMLElement, isAppearing: boolean) => void;
  onEntering?: (node: HTMLElement, isAppearing: boolean) => void;
  onExit?: (node: HTMLElement) => void;
  onExited?: (node: HTMLElement) => void;
  onExiting?: (node: HTMLElement) => void;
}

export interface MessageData
  extends Omit<NotifierData, 'onClose'>,
    MessageConfigProps {
  /**
   * If given, the message will be closed after the amount of time.
   * You can use `Message.config` to overwrite.
   * @default 3000
   */
  duration?: NotifierData['duration'];
  /**
   * message icon prefix
   */
  icon?: IconDefinition;
  /**
   * The key of message.
   */
  reference?: NotifierKey;
  /**
   * The severity of the message.
   */
  severity?: MessageSeverity;
}

/**
 * Props accepted by Message severity shorthand methods such as `Message.success`.
 * Includes an optional `key` to identify the message for later updates or dismissal.
 */
export type MessageShorthandProps = Omit<
  MessageData,
  'children' | 'severity' | 'icon'
> & { key?: NotifierKey };

/**
 * Signature shared by all Message severity shorthand methods.
 */
export type MessageShorthandMethod = (
  message: MessageData['children'],
  props?: MessageShorthandProps,
) => NotifierKey;
