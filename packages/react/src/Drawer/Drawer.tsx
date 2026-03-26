import {
  ButtonIconType,
  ButtonSize,
  ButtonVariant,
} from '@mezzanine-ui/core/button';
import {
  drawerClasses as classes,
  DrawerSize,
} from '@mezzanine-ui/core/drawer';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { DotHorizontalIcon, IconDefinition } from '@mezzanine-ui/icons';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import {
  forwardRef,
  useEffect,
  useMemo,
  useState,
  type ChangeEventHandler,
} from 'react';
import Backdrop, { BackdropProps } from '../Backdrop';
import Button from '../Button';
import ClearActions from '../ClearActions';
import Dropdown from '../Dropdown';
import Radio from '../Radio/Radio';
import RadioGroup from '../Radio/RadioGroup';
import { Slide } from '../Transition';
import { useDocumentEscapeKeyDown } from '../hooks/useDocumentEscapeKeyDown';
import useTopStack from '../hooks/useTopStack';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';


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
   * The label of the all radio in filter area.
   */
  filterAreaAllRadioLabel?: string;
  /**
   * The label of the custom button in filter area.
   */
  filterAreaCustomButtonLabel?: string;
  /**
   * The default value of the radio group in filter area.
   */
  filterAreaDefaultValue?: string;
  /**
   * Whether the filter area content is empty (for disabling custom button).
   */
  filterAreaIsEmpty?: boolean;
  /**
   * The callback function when the custom button is clicked in filter area.
   */
  filterAreaOnCustomButtonClick?: VoidFunction;
  /**
   * The callback function when the radio group value changes in filter area.
   */
  filterAreaOnRadioChange?: ChangeEventHandler<HTMLInputElement>;
  /**
   * The label of the read radio in filter area.
   */
  filterAreaReadRadioLabel?: string;
  /**
   * Controls whether to display the filter area.
   * @default false
   */
  filterAreaShow?: boolean;
  /**
   * Controls whether to display the unread button in filter area.
   * @default false
   */
  filterAreaShowUnreadButton?: boolean;
  /**
   * The label of the unread radio in filter area.
   */
  filterAreaUnreadRadioLabel?: string;
  /**
   * The value of the radio group in filter area.
   */
  filterAreaValue?: string;
  /**
   * Options for the filter bar dropdown.
   * When non-empty, the right-side filter area button is replaced by a Dropdown
   * triggered by a `DotHorizontalIcon` icon button.
   */
  filterAreaOptions?: DropdownOption[];
  /**
   * Callback fired when a filter bar dropdown option is selected.
   * Only used when `filterAreaOptions` is non-empty.
   */
  filterAreaOnSelect?: (option: DropdownOption) => void;
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
   * Controls the width of the drawer.
   * @default 'medium'
   */
  size?: DrawerSize;
}

/**
 * 從螢幕右側滑入的抽屜面板元件。
 *
 * 使用 `Backdrop` 作為遮罩層，並以 `Slide` 動畫過渡效果呈現開關狀態。
 * 支援標題列、篩選區域（含分頁 Radio）、底部操作按鈕區域，以及按下 Escape 鍵關閉。
 * 當多個 Drawer 同時開啟時，Escape 鍵只會關閉最上層的 Drawer。
 *
 * @example
 * ```tsx
 * import Drawer from '@mezzanine-ui/react/Drawer';
 *
 * // 基本用法
 * <Drawer open={open} onClose={() => setOpen(false)} isHeaderDisplay headerTitle="詳細資料">
 *   <p>抽屜內容</p>
 * </Drawer>
 *
 * // 帶有底部操作按鈕
 * <Drawer
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   isHeaderDisplay
 *   headerTitle="編輯"
 *   isBottomDisplay
 *   bottomPrimaryActionText="確認"
 *   bottomOnPrimaryActionClick={handleSubmit}
 *   bottomSecondaryActionText="取消"
 *   bottomOnSecondaryActionClick={() => setOpen(false)}
 * >
 *   <form>表單內容</form>
 * </Drawer>
 *
 * // 使用 contentKey 強制重新掛載內容
 * <Drawer open={open} onClose={() => setOpen(false)} contentKey={recordId}>
 *   <RecordDetail id={recordId} />
 * </Drawer>
 * ```
 *
 * @see {@link Modal} 對話框元件
 * @see {@link Backdrop} 遮罩層元件
 */
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
    filterAreaOnSelect,
    filterAreaOptions = [],
    children,
    className,
    container,
    contentKey,
    filterAreaAllRadioLabel,
    filterAreaCustomButtonLabel = '全部已讀',
    filterAreaDefaultValue,
    filterAreaIsEmpty = false,
    filterAreaOnCustomButtonClick,
    filterAreaOnRadioChange,
    filterAreaReadRadioLabel,
    filterAreaShow = false,
    filterAreaShowUnreadButton = false,
    filterAreaUnreadRadioLabel,
    filterAreaValue,
    disableCloseOnBackdropClick = false,
    disableCloseOnEscapeKeyDown = false,
    disablePortal,
    headerTitle,
    isBottomDisplay,
    isHeaderDisplay,
    onBackdropClick,
    onClose,
    open,
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

  const renderFilterArea = useMemo(() => {
    if (!filterAreaShow) {
      return undefined;
    }

    return () => {
      const radios = [];

      if (filterAreaAllRadioLabel) {
        radios.push(
          <Radio key="all" type="segment" value="all">
            {filterAreaAllRadioLabel}
          </Radio>,
        );
      }

      if (filterAreaReadRadioLabel) {
        radios.push(
          <Radio key="read" type="segment" value="read">
            {filterAreaReadRadioLabel}
          </Radio>,
        );
      }

      if (filterAreaUnreadRadioLabel && filterAreaShowUnreadButton) {
        radios.push(
          <Radio key="unread" type="segment" value="unread">
            {filterAreaUnreadRadioLabel}
          </Radio>,
        );
      }

      const hasRadios = radios.length > 0;
      const hasButton =
        filterAreaOptions.length > 0 || filterAreaOnCustomButtonClick !== undefined;

      // Don't render if neither radios nor button are provided
      if (!hasRadios && !hasButton) {
        return null;
      }

      return (
        <div
          className={cx(
            classes.filterArea,
            !hasRadios && hasButton && classes.filterAreaButtonOnly,
          )}
        >
          {hasRadios && (
            <RadioGroup
              defaultValue={filterAreaDefaultValue ?? 'all'}
              onChange={filterAreaOnRadioChange}
              size="minor"
              type="segment"
              value={filterAreaValue}
            >
              {radios}
            </RadioGroup>
          )}
          {hasButton && (
            filterAreaOptions.length > 0 ? (
              <Dropdown
                onSelect={filterAreaOnSelect}
                options={filterAreaOptions}
                placement="bottom-end"
              >
                <Button
                  icon={DotHorizontalIcon}
                  iconType="icon-only"
                  size="minor"
                  type="button"
                  variant="base-ghost"
                />
              </Dropdown>
            ) : (
              <Button
                disabled={filterAreaIsEmpty}
                onClick={filterAreaOnCustomButtonClick}
                size="minor"
                type="button"
                variant="base-ghost"
              >
                {filterAreaCustomButtonLabel}
              </Button>
            )
          )}
        </div>
      );
    };
  }, [
    filterAreaAllRadioLabel,
    filterAreaCustomButtonLabel,
    filterAreaDefaultValue,
    filterAreaIsEmpty,
    filterAreaOnCustomButtonClick,
    filterAreaOnRadioChange,
    filterAreaReadRadioLabel,
    filterAreaShow,
    filterAreaShowUnreadButton,
    filterAreaUnreadRadioLabel,
    filterAreaValue,
    filterAreaOnSelect,
    filterAreaOptions,
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

          {renderFilterArea?.()}

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
