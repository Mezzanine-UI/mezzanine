import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  JSX,
  ReactElement,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  navigationClasses as classes,
  NavigationOrientation,
} from '@mezzanine-ui/core/navigation';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import NavigationOption, { NavigationOptionProps } from './NavigationOption';
import NavigationHeader, { NavigationHeaderProps } from './NavigationHeader';
import NavigationFooter, { NavigationFooterProps } from './NavigationFooter';
import { flattenChildren } from '../utils/flatten-children';
import NavigationOptionCategory from './NavigationOptionCategory';
import Input, { InputProps } from '../Input';
import {
  NavigationActivatedContext,
  NavigationOptionLevelContext,
  navigationOptionLevelContextDefaultValues,
} from './context';
import { useCurrentPathname } from './useCurrentPathname';

export type NavigationChild =
  | ReactElement<
      NavigationOptionProps | NavigationHeaderProps | NavigationFooterProps
    >
  | null
  | JSX.Element[];
export type NavigationChildren = NavigationChild[];

export interface NavigationProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'ul'>, 'onClick'> {
  /**
   * Current active key.
   */
  activatedPath?: string[];
  /**
   * Strict children with `NavigationOption`, `NavigationHeader` or `NavigationFooter`.
   */
  children?: NavigationChildren;
  /**
   * Called when a navigation option is clicked.
   */
  onOptionClick?: (activePath?: string[]) => void;
  /**
   * Navigation orientation.
   * @default 'horizontal'
   */
  orientation?: NavigationOrientation;
}

const Navigation = forwardRef<HTMLUListElement, NavigationProps>(
  (props, ref) => {
    const {
      activatedPath,
      children = [],
      className,
      onOptionClick,
      ...rest
    } = props;
    const [innerActivatedPath, setInnerActivatedPath] = useState<string[]>([]);
    const combineSetActivatedPath = useCallback(
      (newActivatedPath: string[]) => {
        onOptionClick?.(newActivatedPath);
        setInnerActivatedPath(newActivatedPath);
      },
      [onOptionClick],
    );

    const currentPathname = useCurrentPathname();

    const flattenedChildren = useMemo(
      () => flattenChildren(children) as NavigationChildren,
      [children],
    );

    const { headerComponent, footerComponent, searchInput } = useMemo(() => {
      let headerComponent: ReactElement<NavigationHeaderProps> | null = null;
      let footerComponent: ReactElement<NavigationFooterProps> | null = null;
      let searchInput: ReactElement<InputProps> | null = null;

      Children.forEach(flattenedChildren, (child: NavigationChild) => {
        if (child && isValidElement(child)) {
          switch (child.type) {
            case NavigationHeader: {
              headerComponent = child as ReactElement<NavigationHeaderProps>;
              break;
            }
            case NavigationFooter: {
              footerComponent = child as ReactElement<NavigationFooterProps>;
              break;
            }
            case Input: {
              searchInput = cloneElement(child as ReactElement<InputProps>, {
                size: 'sub',
                variant: 'search',
              });
              break;
            }
          }
        }
      });

      return { headerComponent, footerComponent, searchInput };
    }, [flattenedChildren]);

    const renderItemChildren = useCallback(function renderItemChildrenImpl(
      parsedChildren: NavigationChildren,
    ): ReactNode {
      const childArray = Children.map(
        parsedChildren,
        (child: NavigationChild) => {
          if (child && isValidElement(child)) {
            switch (child.type) {
              case NavigationOptionCategory:
              case NavigationOption: {
                return child;
              }

              default:
                return null;
            }
          }

          return null;
        },
      );

      return childArray?.filter((child) => child !== null) ?? null;
    }, []);

    return (
      <nav
        {...rest}
        ref={ref}
        className={cx(classes.host, classes.vertical, className)}
      >
        {headerComponent}
        <NavigationActivatedContext.Provider
          value={{
            activatedPath: activatedPath || innerActivatedPath,
            setActivatedPath: combineSetActivatedPath,
            currentPathname,
          }}
        >
          <NavigationOptionLevelContext.Provider
            value={navigationOptionLevelContextDefaultValues}
          >
            <div className={classes.content}>
              {searchInput}
              <ul>{renderItemChildren(flattenedChildren)}</ul>
            </div>
          </NavigationOptionLevelContext.Provider>
        </NavigationActivatedContext.Provider>
        {footerComponent}
      </nav>
    );
  },
);

export default Navigation;
