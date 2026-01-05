'use client';

import cx from 'clsx';
import {
  cloneElement,
  ReactElement,
  Ref,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  dropdownClasses,
  DropdownInputPosition,
  DropdownItemSharedProps,
  DropdownOption,
  DropdownType,
} from '@mezzanine-ui/core/dropdown/dropdown';

import { offset, size } from '@floating-ui/react-dom';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import { TransitionGroup } from 'react-transition-group';

import Button, { ButtonProps } from '../Button';
import { useDocumentEvents } from '../hooks/useDocumentEvents';
import { InputProps } from '../Input';
import Popper, { PopperPlacement } from '../Popper';
import Translate, { TranslateFrom } from '../Transition/Translate';
import { composeRefs } from '../utils/composeRefs';

import DropdownItem from './DropdownItem';

export interface DropdownProps extends DropdownItemSharedProps {
  /**
   * The text of the cancel button.
   */
  actionCancelText?: string;
  /**
   * The text of the clear button.
   */
  actionClearText?: string;
  /**
   * The text of the confirm button.
   */
  actionConfirmText?: string;
  /**
   * The custom action button props of the dropdown.
   */
  actionCustomButtonProps?: ButtonProps;
  /**
   * The text of the custom action button.
   */
  actionText?: string;
  /**
   * The active option index for hover/focus state.
   */
  activeIndex?: number | null;
  /**
   * The children of the dropdown.
   * This can be a button or an input.
   */
  children: ReactElement<ButtonProps> | ReactElement<InputProps>;
  /**
   * Whether the dropdown is disabled.
   */
  disabled?: boolean;
  /**
   * The id of the dropdown.
   */
  id?: string;
  /**
   * The position of the input.
   * @default 'outside'
   */
  inputPosition?: DropdownInputPosition;
  /**
   * Whether to match the input value.
   * @default false
   */
  isMatchInputValue?: boolean;
  /**
   * The listbox id of the dropdown.
   */
  listboxId?: string;
  /**
   * The aria-label for the listbox.
   * If not provided, a default label will be used when there are no options.
   */
  listboxLabel?: string;
  /**
   * The max height of the dropdown list.
   */
  maxHeight?: number | string;
  /**
   * Whether the dropdown is open (controlled).
   */
  open?: boolean;
  /**
   * Callback fired when the action cancel is clicked.
   */
  onActionCancel?: () => void;
  /**
   * Callback fired when the action clear is clicked.
   */
  onActionClear?: () => void;
  /**
   * Callback fired when the action confirm is clicked.
   */
  onActionConfirm?: () => void;
  /**
   * Callback fired when the action custom is clicked.
   */
  onActionCustom?: () => void;
  /**
   * Callback fired when the dropdown is closed.
   */
  onClose?: () => void;
  /**
   * Callback fired when the item is hovered.
   */
  onItemHover?: (index: number) => void;
  /**
   * Callback fired when the dropdown is opened.
   */
  onOpen?: () => void;
  /**
   * Callback fired when the dropdown visibility changes.
   */
  onVisibilityChange?: (open: boolean) => void;
  /**
   * Callback fired when the item is selected.
   */
  onSelect?: (option: DropdownOption) => void;
  /**
   * The options of the dropdown.
   */
  options: DropdownOption[];
  /**
   * The placement of the dropdown.
   */
  placement?: PopperPlacement;
  /**
   * Whether to set the same width as its anchor element.
   * @default false
   */
  sameWidth?: boolean;
  /**
   * If true, display a bar at the top of the dropdown action area.
   * @default false
   */
  showActionShowTopBar?: boolean;
  /**
   * Whether to show the actions.
   */
  showDropdownActions?: boolean;
  /**
   * The type of the dropdown.
   */
  type?: DropdownType;
}

export default function Dropdown(props: DropdownProps) {
  const {
    activeIndex: activeIndexProp,
    id,
    children,
    options = [],
    type = 'default',
    maxHeight,
    disabled = false,
    showDropdownActions = false,
    actionCancelText,
    actionConfirmText,
    actionText,
    actionClearText,
    actionCustomButtonProps,
    showActionShowTopBar,
    isMatchInputValue = false,
    inputPosition = 'outside',
    placement = 'bottom',
    sameWidth = false,
    listboxId: listboxIdProp,
    listboxLabel,
    onClose,
    onOpen,
    open: openProp,
    onVisibilityChange,
    onSelect,
    onActionConfirm,
    onActionCancel,
    onActionCustom,
    onActionClear,
    onItemHover,
  } = props;
  const isInline = inputPosition === 'inside';
  const inputId = useId();
  const defaultListboxId = `${inputId}-listbox`;
  const listboxId = listboxIdProp ?? defaultListboxId;
  const actionConfig = useMemo(() => {
    return {
      showActions: showDropdownActions,
      cancelText: actionCancelText,
      confirmText: actionConfirmText,
      clearText: actionClearText,
      actionText,
      customActionButtonProps: actionCustomButtonProps,
      showTopBar: showActionShowTopBar,
      onConfirm: onActionConfirm,
      onCancel: onActionCancel,
      onClick: onActionCustom,
      onClear: onActionClear,
    };
  }, [
    showDropdownActions,
    actionCancelText,
    actionConfirmText,
    actionClearText,
    actionText,
    actionCustomButtonProps,
    showActionShowTopBar,
    onActionConfirm,
    onActionCancel,
    onActionCustom,
    onActionClear,
  ]);

  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isOpenControlled = openProp !== undefined;
  const isOpen = isOpenControlled ? !!openProp : uncontrolledOpen;
  const [uncontrolledActiveIndex, setUncontrolledActiveIndex] = useState<
    number | null
  >(activeIndexProp ?? null);
  const isActiveIndexControlled = activeIndexProp !== undefined;
  const mergedActiveIndex = isActiveIndexControlled
    ? activeIndexProp
    : uncontrolledActiveIndex;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const ariaActivedescendant = useMemo(() => {
    if (mergedActiveIndex !== null && mergedActiveIndex >= 0) {
      return `${listboxId}-option-${mergedActiveIndex}`;
    }
    return undefined;
  }, [mergedActiveIndex, listboxId]);

  const translateProps = useMemo(
    () => ({
      duration: {
        enter: MOTION_DURATION.moderate,
        exit: MOTION_DURATION.moderate,
      },
      easing: {
        enter: MOTION_EASING.standard,
        exit: MOTION_EASING.standard,
      },
    }),
    [],
  );

  const followText = useMemo(() => {
    if (children.type === Button) {
      return undefined;
    }
    if (!isMatchInputValue) {
      return undefined;
    }
    // Try to get value from Input component props
    const inputValue =
      (children.props as InputProps)?.value ??
      (children.props as InputProps)?.defaultValue ??
      '';
    return inputValue;
  }, [children, isMatchInputValue]);

  const popoverPlacement: PopperPlacement = useMemo(() => {
    if (inputPosition === 'outside') {
      return placement;
    }

    return 'bottom';
  }, [inputPosition, placement]);

  const sameWidthMiddleware = useMemo(() => {
    if (!sameWidth) {
      return null;
    }

    return size({
      apply({ rects, elements }) {
        Object.assign(elements.floating.style, {
          width: `${rects.reference.width}px`,
        });
      },
    });
  }, [sameWidth]);

  const offsetMiddleware = useMemo(() => {
    return offset({ mainAxis: 4 });
  }, []);

  const prevIsOpenRef = useRef(isOpen);
  const translateFrom = useMemo<TranslateFrom>(() => {
    if (isInline) {
      return 'bottom';
    }

    const placementBase = popoverPlacement.split('-')[0];
    return placementBase === 'top' ? 'top' : 'bottom';
  }, [isInline, popoverPlacement]);

  const setOpen = useCallback(
    (next: boolean | ((prev: boolean) => boolean)) => {
      const nextValue =
        typeof next === 'function'
          ? (next as (prev: boolean) => boolean)(isOpen)
          : next;

      if (!isOpenControlled) {
        setUncontrolledOpen(nextValue);
      }

      onVisibilityChange?.(nextValue);
    },
    [isOpen, isOpenControlled, onVisibilityChange],
  );

  useEffect(() => {
    if (prevIsOpenRef.current === isOpen) return;

    if (isOpen) {
      onOpen?.();
    } else {
      onClose?.();
    }

    prevIsOpenRef.current = isOpen;
  }, [isOpen, onClose, onOpen]);

  const anchorRef = useRef<HTMLElement | null>(null);
  const popperRef = useRef<HTMLDivElement | null>(null);

  // Extract combobox props logic to avoid duplication
  const getComboboxProps = useMemo(() => {
    const childWithRef = children as ReactElement<any> & {
      ref?: Ref<HTMLElement>;
    };
    const isInput = childWithRef.type !== Button;

    if (!isInput) return {};

    return {
      role: 'combobox' as const,
      'aria-controls': listboxId,
      'aria-expanded': isOpen,
      'aria-haspopup': 'listbox' as const,
      'aria-autocomplete': isMatchInputValue ? ('list' as const) : undefined,
      'aria-activedescendant': ariaActivedescendant,
    };
  }, [children, listboxId, isOpen, isMatchInputValue, ariaActivedescendant]);

  const handleItemHover = useCallback(
    (index: number) => {
      if (!isActiveIndexControlled) {
        setUncontrolledActiveIndex(index);
      }
      onItemHover?.(index);
    },
    [isActiveIndexControlled, onItemHover],
  );

  // Extract shared DropdownItem props to avoid duplication
  const baseDropdownItemProps = useMemo(
    () => ({
      actionConfig,
      activeIndex: mergedActiveIndex,
      disabled,
      followText,
      listboxId,
      listboxLabel,
      maxHeight,
      sameWidth,
      onHover: handleItemHover,
      onSelect,
      options,
      type,
    }),
    [
      actionConfig,
      mergedActiveIndex,
      disabled,
      followText,
      listboxId,
      listboxLabel,
      maxHeight,
      sameWidth,
      handleItemHover,
      onSelect,
      options,
      type,
    ],
  );

  const triggerElement = useMemo(() => {
    const childWithRef = children as ReactElement<any> & {
      ref?: Ref<HTMLElement>;
    };
    const composedRef = composeRefs<HTMLElement>([anchorRef, childWithRef.ref]);

    return cloneElement(childWithRef, {
      ref: composedRef,
      ...getComboboxProps,
      onClick: (event: any) => {
        childWithRef.props?.onClick?.(event);
        if (event?.defaultPrevented) return;

        if (!isInline) {
          setOpen((prev) => !prev);
        }
      },
    });
  }, [children, getComboboxProps, isInline, setOpen]);

  const inlineTriggerElement = useMemo(() => {
    if (!isInline) {
      return null;
    }

    const childWithRef = children as ReactElement<any> & {
      ref?: Ref<HTMLElement>;
    };
    const composedRef = composeRefs<HTMLElement>([childWithRef.ref]);

    return cloneElement(childWithRef, {
      ref: composedRef,
      ...getComboboxProps,
      onBlur: (event: any) => {
        childWithRef.props?.onBlur?.(event);
        if (event?.defaultPrevented) return;

        const nextFocusTarget = event?.relatedTarget as HTMLElement | null;
        const container = containerRef.current;

        if (
          container &&
          nextFocusTarget &&
          container.contains(nextFocusTarget)
        ) {
          return;
        }

        setOpen(false);
      },
      onClick: (event: any) => {
        childWithRef.props?.onClick?.(event);
        if (event?.defaultPrevented) return;

        setOpen(true);
      },
      onFocus: (event: any) => {
        childWithRef.props?.onFocus?.(event);
        if (event?.defaultPrevented) return;

        setOpen(true);
      },
    });
  }, [children, getComboboxProps, isInline, setOpen]);

  useDocumentEvents(() => {
    if (!isOpen) {
      return;
    }

    const handleClickAway = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = anchorRef.current;
      const popper = popperRef.current;
      const container = containerRef.current;

      if (!target) return;

      if (isInline) {
        if (container && !container.contains(target)) {
          setOpen(false);
        }
        return;
      }

      if (
        anchor &&
        popper &&
        !anchor.contains(target) &&
        !popper.contains(target)
      ) {
        setOpen(false);
      }
    };

    return {
      click: handleClickAway,
      touchend: handleClickAway,
    };
  }, [isInline, isOpen, setOpen]);

  return (
    <div
      id={id}
      ref={containerRef}
      className={cx(
        dropdownClasses.root,
        dropdownClasses.inputPosition(inputPosition),
      )}
    >
      {isInline && (
        <TransitionGroup component={null}>
          {!isOpen && inlineTriggerElement && (
            <Translate
              {...translateProps}
              from={translateFrom}
              key="inline-trigger"
              in
            >
              <div>{inlineTriggerElement}</div>
            </Translate>
          )}
          {isOpen && (
            <Translate
              {...translateProps}
              from={translateFrom}
              key="inline-list"
              in
            >
              <div>
                <DropdownItem
                  {...baseDropdownItemProps}
                  headerContent={inlineTriggerElement}
                />
              </div>
            </Translate>
          )}
        </TransitionGroup>
      )}
      {!isInline && (
        <Popper
          ref={popperRef}
          anchor={anchorRef}
          open={isOpen}
          disablePortal
          options={{
            placement: popoverPlacement,
            middleware: [
              offsetMiddleware,
              ...(sameWidthMiddleware ? [sameWidthMiddleware] : []),
            ],
          }}
        >
          <TransitionGroup component={null}>
            {isOpen && (
              <Translate
                {...translateProps}
                from={translateFrom}
                key="popper-list"
                in
              >
                <div>
                  <DropdownItem {...baseDropdownItemProps} />
                </div>
              </Translate>
            )}
          </TransitionGroup>
        </Popper>
      )}
      {!isInline && triggerElement}
    </div>
  );
}
