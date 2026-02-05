'use client';

import { isValidElement, ReactElement } from 'react';
import Button, {
  ButtonGroup,
  ButtonGroupChild,
  ButtonGroupProps,
  ButtonProps,
} from '../Button';
import Dropdown, { DropdownProps } from '../Dropdown';
import { flattenChildren } from '../utils/flatten-children';
import { accordionClasses } from '@mezzanine-ui/core/accordion';
import { cx } from '../utils/cx';

type AccordionActionsChild =
  | ReactElement<DropdownProps>
  | ReactElement<ButtonProps>
  | null
  | undefined
  | false;

export interface AccordionActionsProps
  extends Omit<ButtonGroupProps, 'children'> {
  /**
   * The content of the component. <br />
   * Only `Button` or `Dropdown` is allowed.
   */
  children?: AccordionActionsChild | AccordionActionsChild[];
}

const AccordionActions: React.FC<AccordionActionsProps> = ({
  children,
  className,
  ...rest
}) => {
  const filteredChildren = flattenChildren(children).map((child) => {
    if (
      isValidElement(child) &&
      child.type !== Button &&
      child.type !== Dropdown
    ) {
      console.warn(
        '[Mezzanine][Accordion] Only Button or Dropdown is allowed as the child of AccordionActions.',
      );

      return null;
    }

    return child;
  }) as ButtonGroupChild[];

  return (
    <ButtonGroup
      className={cx(accordionClasses.titleActions, className)}
      {...rest}
    >
      {filteredChildren}
    </ButtonGroup>
  );
};

export default AccordionActions;
