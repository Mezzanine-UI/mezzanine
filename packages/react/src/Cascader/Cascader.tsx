'use client';

import { cascaderClasses as classes } from '@mezzanine-ui/core/cascader';
import { offset } from '@floating-ui/react-dom';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import {
  forwardRef,
  MouseEventHandler,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TransitionGroup } from 'react-transition-group';
import { FormControlContext } from '../Form';
import { useControlValueState } from '../Form/useControlValueState';
import { useDocumentEvents } from '../hooks/useDocumentEvents';
import Popper from '../Popper';
import SelectTrigger from '../Select/SelectTrigger';
import { SelectValue } from '../Select';
import Translate from '../Transition/Translate';
import { cx } from '../utils/cx';
import CascaderPanel from './CascaderPanel';
import { CascaderOption, CascaderProps } from './typings';

/**
 * Walks the options tree using ids from `value` and returns a new activePath
 * whose items carry proper `children` references from the tree.
 * Items in `value` may omit `children`, so we cannot rely on them directly
 * for panel expansion.
 */
function resolveActivePath(
  options: CascaderOption[],
  value: CascaderOption[],
): CascaderOption[] {
  const result: CascaderOption[] = [];
  let currentOptions = options;

  for (const selectedItem of value) {
    const found = currentOptions.find((o) => o.id === selectedItem.id);

    if (!found) break;

    result.push(found);

    if (found.children && found.children.length > 0) {
      currentOptions = found.children;
    } else {
      break;
    }
  }

  return result;
}

const Cascader = forwardRef<HTMLDivElement, CascaderProps>(
  function Cascader(props, ref) {
    const {
      disabled: disabledFromFormControl,
      fullWidth: fullWidthFromFormControl,
      required: requiredFromFormControl,
      severity,
    } = useContext(FormControlContext) || {};

    const {
      className,
      clearable = false,
      defaultValue,
      disabled = disabledFromFormControl || false,
      dropdownZIndex,
      error = severity === 'error' || false,
      fullWidth = fullWidthFromFormControl || false,
      globalPortal = true,
      menuMaxHeight,
      onBlur,
      onChange: onChangeProp,
      onFocus,
      options,
      placeholder = '',
      readOnly = false,
      required = requiredFromFormControl || false,
      size,
      value: valueProp,
    } = props;

    const [open, setOpen] = useState(false);
    const [activePath, setActivePath] = useState<CascaderOption[]>([]);
    const [keyboardFocusedIndex, setKeyboardFocusedIndex] = useState(-1);

    const [value, setValue] = useControlValueState<CascaderOption[]>({
      defaultValue: defaultValue ?? [],
      value: valueProp,
    });

    const anchorRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleOpen = useCallback(() => {
      if (readOnly || disabled) return;
      setActivePath(resolveActivePath(options, value));
      onFocus?.();
      setOpen(true);
    }, [disabled, onFocus, options, readOnly, value]);

    const handleClose = useCallback(() => {
      onBlur?.();
      setOpen(false);
      setKeyboardFocusedIndex(-1);
    }, [onBlur]);

    const handleClear = useCallback<MouseEventHandler>(
      (event) => {
        event.stopPropagation();
        setValue([]);
        onChangeProp?.([]);
        if (open) {
          handleClose();
        }
      },
      [handleClose, onChangeProp, open, setValue],
    );

    const handleItemSelect = useCallback(
      (panelIndex: number, option: CascaderOption, isLeaf: boolean) => {
        const newActivePath = [...activePath.slice(0, panelIndex), option];
        setActivePath(newActivePath);

        if (isLeaf) {
          setValue(newActivePath);
          onChangeProp?.(newActivePath);
          handleClose();
        } else {
          setKeyboardFocusedIndex(-1);
        }
      },
      [activePath, handleClose, onChangeProp, setValue],
    );

    const panels = useMemo<CascaderOption[][]>(() => {
      const result: CascaderOption[][] = [options];

      for (const activeOption of activePath) {
        if (activeOption.children && activeOption.children.length > 0) {
          result.push(activeOption.children);
        } else {
          break;
        }
      }

      return result;
    }, [activePath, options]);

    useDocumentEvents(() => {
      if (!open) return;

      const handleClickAway = (event: MouseEvent | TouchEvent) => {
        const target = event.target as HTMLElement | null;

        if (!target) return;

        const anchor = anchorRef.current;
        const dropdown = dropdownRef.current;

        if (anchor?.contains(target) || dropdown?.contains(target)) return;

        handleClose();
      };

      return {
        click: handleClickAway,
        touchend: handleClickAway,
      };
    }, [handleClose, open]);

    useDocumentEvents(() => {
      if (!open) return;

      const currentPanelOptions = panels[panels.length - 1];

      return {
        keydown(event: KeyboardEvent) {
          switch (event.key) {
            case 'Escape': {
              event.preventDefault();
              handleClose();
              break;
            }
            case 'ArrowDown': {
              event.preventDefault();
              let next = keyboardFocusedIndex + 1;
              while (
                next < currentPanelOptions.length &&
                currentPanelOptions[next].disabled
              ) {
                next++;
              }
              if (next < currentPanelOptions.length) {
                setKeyboardFocusedIndex(next);
              }
              break;
            }
            case 'ArrowUp': {
              event.preventDefault();
              let prev =
                keyboardFocusedIndex === -1
                  ? currentPanelOptions.length - 1
                  : keyboardFocusedIndex - 1;
              while (prev >= 0 && currentPanelOptions[prev].disabled) {
                prev--;
              }
              if (prev >= 0) {
                setKeyboardFocusedIndex(prev);
              }
              break;
            }
            case 'ArrowRight':
            case 'Enter':
            case ' ': {
              if (keyboardFocusedIndex === -1) return;
              const focusedOption = currentPanelOptions[keyboardFocusedIndex];
              if (!focusedOption || focusedOption.disabled) return;
              const isLeaf =
                !focusedOption.children || focusedOption.children.length === 0;
              if (event.key === 'ArrowRight' && isLeaf) return;
              event.preventDefault();
              handleItemSelect(panels.length - 1, focusedOption, isLeaf);
              break;
            }
            case 'ArrowLeft': {
              event.preventDefault();
              if (activePath.length === 0) return;
              const removedItem = activePath[activePath.length - 1];
              const parentPanel = panels[activePath.length - 1];
              const idx = parentPanel.findIndex((o) => o.id === removedItem.id);
              setActivePath(activePath.slice(0, -1));
              setKeyboardFocusedIndex(idx >= 0 ? idx : -1);
              break;
            }
          }
        },
      };
    }, [
      activePath,
      handleClose,
      handleItemSelect,
      keyboardFocusedIndex,
      open,
      panels,
    ]);

    const displayPath = open ? activePath : value;
    const displayString = displayPath.map((o) => o.name).join(' / ');

    const triggerValue = useMemo<SelectValue | undefined>(() => {
      if (displayPath.length === 0) return undefined;
      return { id: 'cascader-value', name: displayString };
    }, [displayPath.length, displayString]);

    const isPartial =
      open &&
      activePath.length > 0 &&
      !!activePath[activePath.length - 1]?.children?.length;

    const zIndexMiddleware = useMemo(
      () => ({
        name: 'zIndex',
        fn: ({ elements }: { elements: { floating: HTMLElement } }) => {
          const val = dropdownZIndex ?? 1;
          const num = typeof val === 'number' ? val : parseInt(val, 10) || val;
          Object.assign(elements.floating.style, { zIndex: num });
          return {};
        },
      }),
      [dropdownZIndex],
    );

    const offsetMiddleware = useMemo(() => offset({ mainAxis: 4 }), []);

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

    return (
      <div
        ref={ref}
        className={cx(classes.host, fullWidth && classes.hostFullWidth)}
      >
        <Popper
          anchor={anchorRef}
          open={open}
          disablePortal={!globalPortal}
          options={{
            placement: 'bottom-start',
            middleware: [offsetMiddleware, zIndexMiddleware],
          }}
        >
          <TransitionGroup component={null}>
            {open && (
              <Translate
                {...translateProps}
                from="bottom"
                key="cascader-dropdown"
                in
              >
                <div>
                  <div ref={dropdownRef} className={classes.dropdownPanels}>
                    {panels.map((panelOptions, panelIndex) => (
                      <CascaderPanel
                        key={panelIndex}
                        activeId={activePath[panelIndex]?.id}
                        focusedId={
                          panelIndex === panels.length - 1 &&
                          keyboardFocusedIndex >= 0
                            ? panels[panelIndex][keyboardFocusedIndex]?.id
                            : undefined
                        }
                        maxHeight={menuMaxHeight}
                        onSelect={(option, isLeaf) =>
                          handleItemSelect(panelIndex, option, isLeaf)
                        }
                        options={panelOptions}
                        selectedId={
                          value.length > 0 && panelIndex === value.length - 1
                            ? value[panelIndex]?.id
                            : undefined
                        }
                      />
                    ))}
                  </div>
                </div>
              </Translate>
            )}
          </TransitionGroup>
        </Popper>

        <SelectTrigger
          ref={anchorRef}
          active={open}
          className={cx(className, isPartial && classes.triggerPartial)}
          disabled={disabled}
          fullWidth={fullWidth}
          inputProps={{
            onKeyDown: (e) => {
              if (!open && (e.key === ' ' || e.key === 'Enter')) {
                e.preventDefault();
                handleOpen();
              }
            },
          }}
          isForceClearable={
            clearable && !disabled && !readOnly && value.length > 0
          }
          mode="single"
          onClick={open ? handleClose : handleOpen}
          onClear={handleClear}
          placeholder={placeholder}
          readOnly={readOnly}
          required={required}
          size={size}
          type={error ? 'error' : 'default'}
          value={triggerValue}
        />
      </div>
    );
  },
);

export default Cascader;
