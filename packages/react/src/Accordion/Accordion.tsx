import React, {
  forwardRef,
  useState,
  useCallback,
  useMemo,
  ReactElement,
  cloneElement,
} from 'react';
import { accordionClasses as classes } from '@mezzanine-ui/core/accordion';
import { AccordionControlContext } from './AccordionControlContext';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import { Fade } from '../Transition';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import AccordionTitle, { AccordionTitleProps } from './AccordionTitle';
import { flattenChildren } from '../utils/flatten-children';
import AccordionContent, { AccordionContentProps } from './AccordionContent';

export interface AccordionProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'onChange'> {
  /**
   * The content of the component. <br />
   * The first child will be treated as the title of the accordion, and the rest will be treated as the content of the accordion.
   * You can also use `title` prop to set the title of the accordion, then all children will be treated as the content of the accordion.
   */
  children: React.ReactNode;
  /**
   * If true, expands the accordion by default.
   * @default false
   */
  defaultExpanded?: boolean;
  /**
   * If true, the accordion will be displayed in a disabled state.
   * @default false
   */
  disabled?: boolean;
  /**
   * If true, expands the accordion, otherwise collapse it. Setting this prop enables control over the accordion.
   */
  expanded?: boolean;
  /**
   * Callback fired when the expand/collapse state is changed.
   */
  onChange?(e: boolean): void;
  /**
   * The size of accordion.
   * @default 'main'
   */
  size?: 'main' | 'sub';
  /**
   * The title of accordion.
   */
  title?: string;
  /**
   * The actions displayed on the right side of the accordion title. <br />
   * Only `Button` or `Dropdown` is allowed.
   */
  actions?: AccordionTitleProps['actions'];
}

const resolveChildren = (
  children: React.ReactNode,
): {
  title: ReactElement<AccordionTitleProps> | null;
  content: ReactElement<AccordionContentProps> | null;
} => {
  let title: ReactElement<AccordionTitleProps> | null = null;
  let content: ReactElement<AccordionContentProps> | null = null;
  const restContentChildren: React.ReactNode[] = [];

  flattenChildren(children).forEach((child) => {
    if (React.isValidElement(child) && child.type === AccordionTitle) {
      if (title) {
        console.warn(
          '[Mezzanine][Accordion] Only one AccordionTitle is allowed as children of Accordion.',
        );
      }

      title = child as ReactElement<AccordionTitleProps>;
    } else if (React.isValidElement(child) && child.type === AccordionContent) {
      if (content) {
        console.warn(
          '[Mezzanine][Accordion] Only one AccordionContent is allowed as children of Accordion.',
        );
      }

      content = child as ReactElement<AccordionContentProps>;
    } else {
      restContentChildren.push(child);
    }
  });

  if (restContentChildren.length > 0) {
    if (content || title) {
      console.warn(
        '[Mezzanine][Accordion] When <AccordionTitle> or <AccordionContent> is used as children. Please wrap other children with AccordionContent.',
      );
    }

    if (!content) {
      content = <AccordionContent />;
    }

    content = cloneElement(content, {
      children: [content.props.children, ...restContentChildren],
    });
  }

  return {
    title,
    content,
  };
};

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  function Accordion(props, ref) {
    const {
      actions,
      children: childrenProp,
      className,
      defaultExpanded = false,
      disabled = false,
      expanded: expandedProp,
      onChange,
      size = 'main',
      title,
      ...rest
    } = props;

    const [expanded, toggleExpanded] = useState<boolean>(
      defaultExpanded ?? false,
    );

    const onToggleExpanded = useCallback(
      (newStatus: boolean) => {
        if (typeof onChange === 'function') {
          onChange(newStatus);
        } else {
          toggleExpanded(newStatus);
        }
      },
      [onChange],
    );

    const { title: resolvedTitle, content: resolvedContent } = useMemo(
      () => resolveChildren(childrenProp),
      [childrenProp],
    );

    const contextValue = useMemo(
      () => ({
        contentId:
          resolvedTitle && (resolvedTitle as ReactElement<any>)?.props?.id
            ? `${(resolvedTitle as ReactElement<any>).props.id}-content`
            : undefined,
        disabled,
        expanded: expandedProp ?? expanded,
        titleId:
          (resolvedTitle && (resolvedTitle as ReactElement<any>)?.props?.id) ??
          undefined,
        toggleExpanded: onToggleExpanded,
      }),
      [disabled, expandedProp, expanded, onToggleExpanded, resolvedTitle],
    );

    return (
      <div
        {...rest}
        ref={ref}
        className={cx(classes.host, classes.size(size), className)}
      >
        <AccordionControlContext.Provider value={contextValue}>
          {title ? (
            <AccordionTitle actions={actions}>{title}</AccordionTitle>
          ) : (
            resolvedTitle
          )}

          <Fade
            duration={{
              enter: MOTION_DURATION.moderate,
              exit: MOTION_DURATION.moderate,
            }}
            easing={{
              enter: MOTION_EASING.entrance,
              exit: MOTION_EASING.exit,
            }}
            in={expandedProp ?? expanded}
          >
            <div>{resolvedContent}</div>
          </Fade>
        </AccordionControlContext.Provider>
      </div>
    );
  },
);

export default Accordion;
