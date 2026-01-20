import { FC, useRef, useState } from 'react';
import { NavigationChild } from './Navigation';
import { navigationClasses as classes } from '@mezzanine-ui/core/navigation';
import Popper from '../Popper';
import NavigationIconButton from './NavigationIconButton';
import { DotHorizontalIcon } from '@mezzanine-ui/icons';

export interface CollapsedMenuProps {
  items: NavigationChild[];
}
export const CollapsedMenu: FC<CollapsedMenuProps> = ({ items }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const targetRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <NavigationIconButton
        ref={targetRef}
        icon={DotHorizontalIcon}
        onClick={() => setMenuOpen(!menuOpen)}
      />
      <Popper
        anchor={targetRef.current}
        open={menuOpen}
        options={{
          placement: 'right-end',
        }}
      >
        <div className={classes.collapsedMenu}>
          <ul>{items}</ul>
        </div>
      </Popper>
    </>
  );
};
