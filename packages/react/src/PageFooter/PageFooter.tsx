import { forwardRef } from 'react';
import { pageFooterClasses as classes } from '@mezzanine-ui/core/page-footer';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import type { ButtonProps } from '../Button';
import Button, { ButtonGroup } from '../Button';
import Typography from '../Typography';
import Dropdown, { DropdownProps } from '../Dropdown';
import { DotHorizontalIcon } from '@mezzanine-ui/icons';

/**
 * Single button configuration - only primary button is allowed
 */
type SingleButtonAction = {
  secondaryButton?: never;
  primaryButton: ButtonProps;
};

/**
 * Two buttons configuration - both secondary and primary buttons
 */
type TwoButtonsAction = {
  secondaryButton: ButtonProps;
  primaryButton: ButtonProps;
};

/**
 * Actions can be either single button or two buttons
 */
export type PageFooterActions = SingleButtonAction | TwoButtonsAction;

export type PageFooterType = 'standard' | 'overflow' | 'information';

type PageFooterBaseProps = NativeElementPropsWithoutKeyAndRef<'footer'> & {
  /**
   * Action buttons configuration for primary and secondary actions.
   * Renders buttons in the order: secondary (left), primary (right).
   */
  actions?: PageFooterActions;
  /**
   * The className of annotation wrapper.
   */
  annotationClassName?: string;
  /**
   * The warning message in the middle.
   */
  warningMessage?: string;
};

type PageFooterStandardProps = PageFooterBaseProps & {
  /**
   * The type of PageFooter annotation.
   * @default 'standard'
   */
  type?: 'standard';
  /**
   * The text/label (children) for the supporting action button in the PageFooter annotation.
   */
  supportingActionName?: ButtonProps['children'];
  /**
   * The HTML button type for the supporting action (e.g., 'button', 'submit', 'reset').
   */
  supportingActionType?: ButtonProps['type'];
  /**
   * Click handler for the supporting action button in the PageFooter annotation.
   */
  supportingActionOnClick?: ButtonProps['onClick'];
  /**
   * Visual style variant of the supporting action button in the PageFooter
   * (for example, 'base-ghost', 'base-secondary').
   * @default 'base-ghost'
   */
  supportingActionVariant?: ButtonProps['variant'];
};

type PageFooterOverflowProps = PageFooterBaseProps & {
  /**
   * The type of PageFooter annotation.
   */
  type: 'overflow';
  /**
   * Overflow type: Icon for the icon-only button.
   * @default DotHorizontalIcon
   */
  supportingActionIcon?: ButtonProps['icon'];
  /**
   * Dropdown props for the supporting action button.
   */
  dropdownProps: Partial<DropdownProps>;
};

type PageFooterInformationProps = PageFooterBaseProps & {
  /**
   * The type of PageFooter annotation.
   */
  type: 'information';
  /**
   * Information type: Plain text to display.
   */
  annotation?: string;
};

export type PageFooterProps =
  | PageFooterStandardProps
  | PageFooterOverflowProps
  | PageFooterInformationProps;

// Flat view of all possible props — used only to strip custom fields from DOM spread
type _PageFooterFlatProps = PageFooterBaseProps & {
  type?: PageFooterType;
  annotation?: string;
  dropdownProps?: Partial<DropdownProps>;
  supportingActionIcon?: ButtonProps['icon'];
  supportingActionName?: ButtonProps['children'];
  supportingActionOnClick?: ButtonProps['onClick'];
  supportingActionType?: ButtonProps['type'];
  supportingActionVariant?: ButtonProps['variant'];
};

const PageFooter = forwardRef<HTMLElement, PageFooterProps>(
  function PageFooter(props, ref) {
    const {
      actions,
      annotationClassName,
      annotation,
      className,
      dropdownProps,
      supportingActionIcon,
      supportingActionName,
      supportingActionOnClick,
      supportingActionType,
      supportingActionVariant = 'base-ghost',
      type = 'standard',
      warningMessage,
      ...rest
    } = props as _PageFooterFlatProps;

    const { children: primaryButtonText, ...restPrimaryButtonProps } =
      actions?.primaryButton ?? {};

    // Render annotation based on type
    const renderAnnotation = () => {
      switch (type) {
        case 'standard':
          return (
            <Button
              size="main"
              type={supportingActionType}
              onClick={supportingActionOnClick}
              variant={supportingActionVariant}
            >
              {supportingActionName}
            </Button>
          );

        case 'overflow':
          if (!dropdownProps) return null;

          return (
            <Dropdown
              {...dropdownProps}
              options={dropdownProps.options || []}
              placement={dropdownProps.placement || 'top'}
            >
              <Button
                type="button"
                iconType="icon-only"
                icon={supportingActionIcon || DotHorizontalIcon}
                size="main"
                variant="base-ghost"
              />
            </Dropdown>
          );

        case 'information':
          if (!annotation) return null;

          return (
            <Typography color="text-neutral" variant="caption">
              {annotation}
            </Typography>
          );

        default:
          return null;
      }
    };

    return (
      <footer ref={ref} {...rest} className={cx(classes.host, className)}>
        <div className={cx(classes.annotation, annotationClassName)}>
          {renderAnnotation()}
        </div>
        <div className={classes.message}>
          {warningMessage ? (
            <Typography variant="caption" color="text-warning" align="right">
              {warningMessage}
            </Typography>
          ) : null}
        </div>
        <ButtonGroup>
          {actions?.secondaryButton && (
            <Button
              size="main"
              variant="base-secondary"
              {...actions.secondaryButton}
            />
          )}
          <Button
            size="main"
            variant="base-primary"
            {...restPrimaryButtonProps}
          >
            {primaryButtonText || 'Button'}
          </Button>
        </ButtonGroup>
      </footer>
    );
  },
);

export default PageFooter;
