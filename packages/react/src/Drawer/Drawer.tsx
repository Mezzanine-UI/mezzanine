import React, {
  forwardRef,
  useMemo,
  useState,
  type ChangeEventHandler,
} from 'react';
import {
  drawerClasses as classes,
  DrawerSize,
} from '@mezzanine-ui/core/drawer';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Backdrop, { BackdropProps } from '../Backdrop';
import { Slide } from '../Transition';
import { useDocumentEscapeKeyDown } from '../hooks/useDocumentEscapeKeyDown';
import useTopStack from '../_internal/SlideFadeOverlay/useTopStack';
import ClearActions from '../ClearActions';
import Button from '../Button';
import Radio from '../Radio/Radio';
import RadioGroup from '../Radio/RadioGroup';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';

export interface DrawerProps
  extends NativeElementPropsWithoutKeyAndRef<'div'>,
    Pick<
      BackdropProps,
      | 'container'
      | 'disableCloseOnBackdropClick'
      | 'disablePortal'
      | 'onBackdropClick'
      | 'onClose'
      | 'open'
    > {
  /**
   * Text for the ghost action button in the bottom action area.
   */
  bottomGhostActionText?: string;
  /**
   * Click handler for the ghost action button in the bottom action area.
   */
  bottomOnGhostActionClick?: VoidFunction;
  /**
   * Click handler for the primary action button in the bottom action area.
   */
  bottomOnPrimaryActionClick?: VoidFunction;
  /**
   * Click handler for the secondary action button in the bottom action area.
   */
  bottomOnSecondaryActionClick?: VoidFunction;
  /**
   * Text for the primary action button in the bottom action area.
   */
  bottomPrimaryActionText?: string;
  /**
   * Text for the secondary action button in the bottom action area.
   */
  bottomSecondaryActionText?: string;
  /**
   * The label of the all radio in control bar.
   */
  controlBarAllRadioLabel?: string;
  /**
   * The label of the custom button in control bar.
   */
  controlBarCustomButtonLabel?: string;
  /**
   * The default value of the radio group in control bar.
   */
  controlBarDefaultValue?: string;
  /**
   * Whether the control bar content is empty (for disabling custom button).
   */
  controlBarIsEmpty?: boolean;
  /**
   * The callback function when the custom button is clicked in control bar.
   */
  controlBarOnCustomButtonClick?: VoidFunction;
  /**
   * The callback function when the radio group value changes in control bar.
   */
  controlBarOnRadioChange?: ChangeEventHandler<HTMLInputElement>;
  /**
   * The label of the read radio in control bar.
   */
  controlBarReadRadioLabel?: string;
  /**
   * Controls whether to display the control bar.
   * @default false
   */
  controlBarShow?: boolean;
  /**
   * Controls whether to display the unread button in control bar.
   * @default false
   */
  controlBarShowUnreadButton?: boolean;
  /**
   * The label of the unread radio in control bar.
   */
  controlBarUnreadRadioLabel?: string;
  /**
   * The value of the radio group in control bar.
   */
  controlBarValue?: string;
  /**
   * Controls whether to disable closing drawer while escape key down.
   * @default false
   */
  disableCloseOnEscapeKeyDown?: boolean;
  /**
   * Title text displayed in the drawer header.
   */
  headerTitle?: string;
  /**
   * Controls whether to display the bottom action area.
   */
  isBottomDisplay?: boolean;
  /**
   * Controls whether to display the header area.
   */
  isHeaderDisplay?: boolean;
  /**
   * Custom render function for the control bar area.
   * The control bar will be rendered between the header and content areas.
   * If provided, this will override the default control bar rendering and control bar-related props.
   * @returns ReactNode - The custom control bar element
   */
  renderControlBar?: () => React.ReactNode;
  /**
   * Controls the width of the drawer.
   * @default 'medium'
   */
  size?: DrawerSize;
}

const Drawer = forwardRef<HTMLDivElement, DrawerProps>((props, ref) => {
  const {
    bottomGhostActionText,
    bottomOnGhostActionClick,
    bottomOnPrimaryActionClick,
    bottomOnSecondaryActionClick,
    bottomPrimaryActionText,
    bottomSecondaryActionText,
    children,
    className,
    container,
    controlBarAllRadioLabel,
    controlBarCustomButtonLabel = '全部已讀',
    controlBarDefaultValue,
    controlBarIsEmpty = false,
    controlBarOnCustomButtonClick,
    controlBarOnRadioChange,
    controlBarReadRadioLabel,
    controlBarShow = false,
    controlBarShowUnreadButton = false,
    controlBarUnreadRadioLabel,
    controlBarValue,
    disableCloseOnBackdropClick = false,
    disableCloseOnEscapeKeyDown = false,
    disablePortal,
    headerTitle,
    isBottomDisplay,
    isHeaderDisplay,
    onBackdropClick,
    onClose,
    open,
    renderControlBar: customRenderControlBar,
    size = 'medium',
    ...rest
  } = props;

  const [exited, setExited] = useState(true);

  /**
   * Escape keydown close: escape will only close the top drawer
   */
  const checkIsOnTheTop = useTopStack(open);

  const renderControlBar = useMemo(() => {
    // If custom renderControlBar is provided, use it
    if (customRenderControlBar) {
      return customRenderControlBar;
    }

    // Default control bar implementation
    if (!controlBarShow) {
      return undefined;
    }

    return () => {
      const radios = [];

      if (controlBarAllRadioLabel) {
        radios.push(
          <Radio key="all" type="segment" value="all">
            {controlBarAllRadioLabel}
          </Radio>,
        );
      }

      if (controlBarReadRadioLabel) {
        radios.push(
          <Radio key="read" type="segment" value="read">
            {controlBarReadRadioLabel}
          </Radio>,
        );
      }

      if (controlBarUnreadRadioLabel && controlBarShowUnreadButton) {
        radios.push(
          <Radio key="unread" type="segment" value="unread">
            {controlBarUnreadRadioLabel}
          </Radio>,
        );
      }

      if (radios.length === 0) {
        return null;
      }

      return (
        <div className={classes.controlBar}>
          <RadioGroup
            defaultValue={controlBarDefaultValue ?? 'all'}
            onChange={controlBarOnRadioChange}
            size="minor"
            type="segment"
            value={controlBarValue}
          >
            {radios}
          </RadioGroup>
          <Button
            disabled={controlBarIsEmpty}
            onClick={controlBarOnCustomButtonClick}
            size="minor"
            type="button"
            variant="base-ghost"
          >
            {controlBarCustomButtonLabel}
          </Button>
        </div>
      );
    };
  }, [
    controlBarAllRadioLabel,
    controlBarCustomButtonLabel,
    controlBarDefaultValue,
    controlBarIsEmpty,
    controlBarOnCustomButtonClick,
    controlBarOnRadioChange,
    controlBarReadRadioLabel,
    controlBarShow,
    controlBarShowUnreadButton,
    controlBarUnreadRadioLabel,
    controlBarValue,
    customRenderControlBar,
  ]);

  useDocumentEscapeKeyDown(() => {
    if (!open || disableCloseOnEscapeKeyDown || !onClose) {
      return;
    }

    return (event) => {
      if (checkIsOnTheTop()) {
        event.stopPropagation();

        onClose();
      }
    };
  }, [disableCloseOnEscapeKeyDown, checkIsOnTheTop, open, onClose]);

  if (!open && exited) {
    return null;
  }

  return (
    <Backdrop
      className={classes.overlay}
      container={container}
      disableCloseOnBackdropClick={disableCloseOnBackdropClick}
      disablePortal={disablePortal}
      onBackdropClick={onBackdropClick}
      onClose={onClose}
      open={open}
      role="presentation"
    >
      <Slide
        duration={{
          enter: MOTION_DURATION.moderate,
          exit: MOTION_DURATION.moderate,
        }}
        easing={{
          enter: MOTION_EASING.entrance,
          exit: MOTION_EASING.exit,
        }}
        in={open}
        onEntered={() => setExited(false)}
        onExited={() => setExited(true)}
        ref={ref}
      >
        <div
          {...rest}
          className={cx(
            classes.host,
            classes.right,
            classes.size(size),
            className,
          )}
        >
          {isHeaderDisplay && (
            <div className={classes.header}>
              {headerTitle}
              <ClearActions onClick={onClose} />
            </div>
          )}

          {renderControlBar?.()}

          <div className={classes.content}>{children}</div>

          {isBottomDisplay && (
            <div className={classes.bottom}>
              <div>
                {bottomGhostActionText && bottomOnGhostActionClick && (
                  <Button
                    onClick={bottomOnGhostActionClick}
                    type="button"
                    variant="base-ghost"
                  >
                    {bottomGhostActionText}
                  </Button>
                )}
              </div>
              <div className={classes['bottom__actions']}>
                {bottomSecondaryActionText && bottomOnSecondaryActionClick && (
                  <Button
                    onClick={bottomOnSecondaryActionClick}
                    type="button"
                    variant="base-secondary"
                  >
                    {bottomSecondaryActionText}
                  </Button>
                )}
                {bottomPrimaryActionText && bottomOnPrimaryActionClick && (
                  <Button
                    onClick={bottomOnPrimaryActionClick}
                    type="button"
                    variant="base-primary"
                  >
                    {bottomPrimaryActionText}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Slide>
    </Backdrop>
  );
});

export default Drawer;
