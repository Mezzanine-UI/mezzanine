'use client';

import {
  HtmlHTMLAttributes,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TransitionGroup } from 'react-transition-group';
import { breadcrumbClasses } from '@mezzanine-ui/core/breadcrumb';
import { DotHorizontalIcon } from '@mezzanine-ui/icons';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import { useDocumentEvents } from '../hooks/useDocumentEvents';
import Icon from '../Icon';
import Popper from '../Popper';
import { Translate } from '../Transition';
import BreadcrumbOverflowMenuItem from './BreadcrumbOverflowMenuItem';
import { BreadcrumbItemProps } from './typings';
import { cx } from '../utils/cx';

export const BreadcrumbOverflowMenu = (
  props: HtmlHTMLAttributes<HTMLButtonElement> & {
    collapsedProps: (BreadcrumbItemProps & { id: string })[];
  },
) => {
  const { onClick, className, collapsedProps, ...rest } = props;

  const [menuOpen, setMenuOpen] = useState(false);

  const targetRef = useRef<HTMLButtonElement | null>(null);
  const popperRef = useRef<HTMLDivElement | null>(null);

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

  const zIndexMiddleware = useMemo(() => {
    const zIndexValue = 1;
    return {
      name: 'zIndex',
      fn: ({ elements }: { elements: { floating: HTMLElement } }) => {
        const zIndexNum =
          typeof zIndexValue === 'number'
            ? zIndexValue
            : typeof zIndexValue === 'string'
              ? parseInt(zIndexValue, 10) || zIndexValue
              : 1;
        Object.assign(elements.floating.style, {
          zIndex: zIndexNum,
        });
        return {};
      },
    };
  }, []);

  const buttonOnClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setMenuOpen(!menuOpen);
      onClick?.(e);
    },
    [menuOpen, onClick],
  );

  return (
    <>
      <button
        aria-label={'more options'}
        type="button"
        {...rest}
        ref={targetRef}
        className={cx(breadcrumbClasses.iconButton, className)}
        onClick={buttonOnClick}
      >
        <Icon icon={DotHorizontalIcon} size={14} />
      </button>
      <Popper
        anchor={targetRef.current}
        disablePortal
        open={menuOpen}
        options={{
          middleware: [zIndexMiddleware],
          placement: 'bottom-start',
        }}
        ref={popperRef}
      >
        <TransitionGroup component={null}>
          {menuOpen && (
            <Translate {...translateProps} from={'bottom'} in key="popper-list">
              <span className={breadcrumbClasses.menu}>
                <span className={breadcrumbClasses.menuContent}>
                  {collapsedProps.map((v) => (
                    <BreadcrumbOverflowMenuItem key={v.id} {...v} />
                  ))}
                </span>
              </span>
            </Translate>
          )}
        </TransitionGroup>
      </Popper>
    </>
  );
};
