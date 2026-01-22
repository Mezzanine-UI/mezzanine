import {
  createElement,
  FC,
  ReactElement,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { navigationOverflowMenuClasses as classes } from '@mezzanine-ui/core/navigation';
import Popper from '../Popper';
import NavigationIconButton from './NavigationIconButton';
import { DotHorizontalIcon } from '@mezzanine-ui/icons';
import NavigationOverflowMenuOption from './NavigationOverflowMenuOption';
import { NavigationOptionProps } from './NavigationOption';
import { TransitionGroup } from 'react-transition-group';
import { Translate } from '../Transition';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import { NavigationOptionLevelContext } from './context';
import { useDocumentEvents } from '../hooks/useDocumentEvents';

export interface NavigationOverflowMenuProps {
  items: ReactElement<NavigationOptionProps>[];
}
export const NavigationOverflowMenu: FC<NavigationOverflowMenuProps> = ({
  items,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const targetRef = useRef<HTMLButtonElement | null>(null);
  const popperRef = useRef<HTMLDivElement | null>(null);

  const [level1path, setLevel1path] = useState<string[]>([]);
  const [level2path, setLevel2path] = useState<string[]>([]);
  const [level2Items, setLevel2Items] = useState<
    ReactElement<NavigationOptionProps>[]
  >([]);
  const [level3Items, setLevel3Items] = useState<
    ReactElement<NavigationOptionProps>[]
  >([]);

  const renderMenuItem = useCallback(
    (item: ReactElement<NavigationOptionProps>, currentLevel: number) =>
      createElement(NavigationOverflowMenuOption, {
        ...item.props,
        onTriggerClick: (path, currentKey, href, subItems) => {
          if (subItems && subItems.length > 0) {
            if (currentLevel === 1) {
              setLevel1path(path);
              setLevel2Items(subItems);
              setLevel3Items([]);
            } else if (currentLevel === 2) {
              setLevel2path(path);
              setLevel3Items(subItems);
            }
          } else {
            setMenuOpen(false);
          }

          item.props.onTriggerClick?.(path, currentKey, href);
        },
      }),
    [],
  );

  const renderedItems = useMemo(
    () => items.map((item) => renderMenuItem(item, 1)),
    [items, renderMenuItem],
  );
  const renderedItems2 = useMemo(
    () => level2Items.map((item) => renderMenuItem(item, 2)),
    [level2Items, renderMenuItem],
  );
  const renderedItems3 = useMemo(
    () => level3Items.map((item) => renderMenuItem(item, 3)),
    [level3Items, renderMenuItem],
  );

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

  useDocumentEvents(() => {
    if (!menuOpen) {
      return;
    }

    const handleClickAway = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = targetRef.current;
      const popper = popperRef.current;

      if (!target) return;

      if (
        anchor &&
        popper &&
        !anchor.contains(target) &&
        !popper.contains(target)
      ) {
        setMenuOpen(false);
      }
    };

    return {
      click: handleClickAway,
      touchend: handleClickAway,
    };
  }, [menuOpen]);

  return (
    <>
      <NavigationIconButton
        ref={targetRef}
        icon={DotHorizontalIcon}
        onClick={() => setMenuOpen(!menuOpen)}
      />
      <Popper
        anchor={targetRef.current}
        disablePortal
        open={menuOpen}
        options={{
          placement: 'right-end',
        }}
        ref={popperRef}
      >
        <TransitionGroup component={null}>
          {menuOpen && (
            <Translate {...translateProps} from={'bottom'} key="popper-list" in>
              <li className={classes.host}>
                <span className={classes.content}>
                  {<ul className={classes.subMenu}>{renderedItems}</ul>}
                  <NavigationOptionLevelContext.Provider
                    value={{
                      level: 1,
                      path: level1path,
                    }}
                  >
                    {level2Items.length > 0 && (
                      <ul className={classes.subMenu}>{renderedItems2}</ul>
                    )}
                  </NavigationOptionLevelContext.Provider>
                  <NavigationOptionLevelContext.Provider
                    value={{
                      level: 2,
                      path: level2path,
                    }}
                  >
                    {level3Items.length > 0 && (
                      <ul className={classes.subMenu}>{renderedItems3}</ul>
                    )}
                  </NavigationOptionLevelContext.Provider>
                </span>
              </li>
            </Translate>
          )}
        </TransitionGroup>
      </Popper>
    </>
  );
};
