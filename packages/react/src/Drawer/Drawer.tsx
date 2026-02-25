import React, {
  forwardRef,
  useEffect,
  useMemo,
  useState,
  type ChangeEventHandler,
} from 'react';
import {
  drawerClasses as classes,
  DrawerSize,
} from '@mezzanine-ui/core/drawer';
import { IconDefinition } from '@mezzanine-ui/icons';
import {
  ButtonIconType,
  ButtonSize,
  ButtonVariant,
} from '@mezzanine-ui/core/button';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Backdrop, { BackdropProps } from '../Backdrop';
import { Slide } from '../Transition';
import { useDocumentEscapeKeyDown } from '../hooks/useDocumentEscapeKeyDown';
import useTopStack from '../hooks/useTopStack';
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
   * Key prop for forcing content remount when data changes.
   * Use this to prevent DOM residue when list items decrease (e.g., records.length).
   * If not provided, content will auto-remount when drawer reopens.
   * @example
   * // Force remount when filtered list changes
   * <Drawer contentKey={filteredCars.length}>
   *   <VehicleList cars={filteredCars} />
   * </Drawer>
   */
  contentKey?: string | number;
  /**
   * Disabled state for the ghost action button.
   */
  bottomGhostActionDisabled?: boolean;
  /**
   * Icon for the ghost action button.
   */
  bottomGhostActionIcon?: IconDefinition;
  /**
   * Icon type for the ghost action button.
   */
  bottomGhostActionIconType?: ButtonIconType;
  /**
   * Loading state for the ghost action button.
   */
  bottomGhostActionLoading?: boolean;
  /**
   * Size for the ghost action button.
   */
  bottomGhostActionSize?: ButtonSize;
  /**
   * Text for the ghost action button in the bottom action area.
   */
  bottomGhostActionText?: string;
  /**
   * Variant for the ghost action button.
   * @default 'base-ghost'
   */
  bottomGhostActionVariant?: ButtonVariant;
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
   * Disabled state for the primary action button.
   */
  bottomPrimaryActionDisabled?: boolean;
  /**
   * Icon for the primary action button.
   */
  bottomPrimaryActionIcon?: IconDefinition;
  /**
   * Icon type for the primary action button.
   */
  bottomPrimaryActionIconType?: ButtonIconType;
  /**
   * Loading state for the primary action button.
   */
  bottomPrimaryActionLoading?: boolean;
  /**
   * Size for the primary action button.
   */
  bottomPrimaryActionSize?: ButtonSize;
  /**
   * Text for the primary action button in the bottom action area.
   */
  bottomPrimaryActionText?: string;
  /**
   * Variant for the primary action button.
   * @default 'base-primary'
   */
  bottomPrimaryActionVariant?: ButtonVariant;
  /**
   * Disabled state for the secondary action button.
   */
  bottomSecondaryActionDisabled?: boolean;
  /**
   * Icon for the secondary action button.
   */
  bottomSecondaryActionIcon?: IconDefinition;
  /**
   * Icon type for the secondary action button.
   */
  bottomSecondaryActionIconType?: ButtonIconType;
  /**
   * Loading state for the secondary action button.
   */
  bottomSecondaryActionLoading?: boolean;
  /**
   * Size for the secondary action button.
   */
  bottomSecondaryActionSize?: ButtonSize;
  /**
   * Text for the secondary action button in the bottom action area.
   */
  bottomSecondaryActionText?: string;
  /**
   * Variant for the secondary action button.
   * @default 'base-secondary'
   */
  bottomSecondaryActionVariant?: ButtonVariant;
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
    bottomGhostActionDisabled,
    bottomGhostActionIcon,
    bottomGhostActionIconType,
    bottomGhostActionLoading,
    bottomGhostActionSize,
    bottomGhostActionText,
    bottomGhostActionVariant = 'base-ghost',
    bottomOnGhostActionClick,
    bottomOnPrimaryActionClick,
    bottomOnSecondaryActionClick,
    bottomPrimaryActionDisabled,
    bottomPrimaryActionIcon,
    bottomPrimaryActionIconType,
    bottomPrimaryActionLoading,
    bottomPrimaryActionSize,
    bottomPrimaryActionText,
    bottomPrimaryActionVariant = 'base-primary',
    bottomSecondaryActionDisabled,
    bottomSecondaryActionIcon,
    bottomSecondaryActionIconType,
    bottomSecondaryActionLoading,
    bottomSecondaryActionSize,
    bottomSecondaryActionText,
    bottomSecondaryActionVariant = 'base-secondary',
    children,
    className,
    container,
    contentKey,
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
  const [openCount, setOpenCount] = useState(0);

  // Track open state changes to auto-remount content when drawer reopens
  // This provides automatic content cleanup when contentKey is not provided
  useEffect(() => {
    if (open) {
      setOpenCount((count) => count + 1);
    }
  }, [open]);

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

      const hasRadios = radios.length > 0;
      const hasButton = controlBarOnCustomButtonClick !== undefined;

      // Don't render if neither radios nor button are provided
      if (!hasRadios && !hasButton) {
        return null;
      }

      return (
        <div
          className={cx(
            classes.controlBar,
            !hasRadios && hasButton && classes.controlBarButtonOnly,
          )}
        >
          {hasRadios && (
            <RadioGroup
              defaultValue={controlBarDefaultValue ?? 'all'}
              onChange={controlBarOnRadioChange}
              size="minor"
              type="segment"
              value={controlBarValue}
            >
              {radios}
            </RadioGroup>
          )}
          {hasButton && (
            <Button
              disabled={controlBarIsEmpty}
              onClick={controlBarOnCustomButtonClick}
              size="minor"
              type="button"
              variant="base-ghost"
            >
              {controlBarCustomButtonLabel}
            </Button>
          )}
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

          <div
            key={contentKey !== undefined ? contentKey : openCount}
            className={classes.content}
          >
            {children}
          </div>

          {isBottomDisplay && (
            <div className={classes.bottom}>
              <div>
                {bottomGhostActionText && bottomOnGhostActionClick && (
                  <Button
                    disabled={bottomGhostActionDisabled}
                    icon={bottomGhostActionIcon}
                    iconType={bottomGhostActionIconType}
                    loading={bottomGhostActionLoading}
                    onClick={bottomOnGhostActionClick}
                    size={bottomGhostActionSize}
                    type="button"
                    variant={bottomGhostActionVariant}
                  >
                    {bottomGhostActionText}
                  </Button>
                )}
              </div>
              <div className={classes['bottom__actions']}>
                {bottomSecondaryActionText && bottomOnSecondaryActionClick && (
                  <Button
                    disabled={bottomSecondaryActionDisabled}
                    icon={bottomSecondaryActionIcon}
                    iconType={bottomSecondaryActionIconType}
                    loading={bottomSecondaryActionLoading}
                    onClick={bottomOnSecondaryActionClick}
                    size={bottomSecondaryActionSize}
                    type="button"
                    variant={bottomSecondaryActionVariant}
                  >
                    {bottomSecondaryActionText}
                  </Button>
                )}
                {bottomPrimaryActionText && bottomOnPrimaryActionClick && (
                  <Button
                    disabled={bottomPrimaryActionDisabled}
                    icon={bottomPrimaryActionIcon}
                    iconType={bottomPrimaryActionIconType}
                    loading={bottomPrimaryActionLoading}
                    onClick={bottomOnPrimaryActionClick}
                    size={bottomPrimaryActionSize}
                    type="button"
                    variant={bottomPrimaryActionVariant}
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
