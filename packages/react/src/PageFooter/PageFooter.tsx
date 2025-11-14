import { forwardRef } from 'react';
import { pageFooterClasses as classes } from '@mezzanine-ui/core/page-footer';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import type { ButtonProps } from '../Button';
import Button, { ButtonGroup } from '../Button';
import Typography from '../Typography';

export type PageFooterType = 'standard' | 'overflow' | 'information';

type PageFooterBaseProps = NativeElementPropsWithoutKeyAndRef<'footer'> & {
  /**
   * Action buttons configuration for primary and secondary actions.
   * Renders buttons in the order: secondary (left), primary (right).
   */
  actions?: {
    primaryButtonProps?: ButtonProps;
    secondaryButtonProps?: ButtonProps;
  };
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
   * Standard type: A ghost button with text.
   * Children of the button.
   */
  annotation?: string;
  /**
   * Standard type: Button click handler.
   */
  onAnnotationClick?: ButtonProps['onClick'];
};

type PageFooterOverflowProps = PageFooterBaseProps & {
  /**
   * The type of PageFooter annotation.
   */
  type: 'overflow';
  /**
   * Overflow type: Icon for the icon-only button.
   * @TODO Consider Dropdown integration after Dropdown redesign.
   */
  annotation?: ButtonProps['icon'];
  /**
   * Overflow type: Button click handler.
   */
  onAnnotationClick?: ButtonProps['onClick'];
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

const PageFooter = forwardRef<HTMLElement, PageFooterProps>(
  function PageFooter(props, ref) {
    const {
      actions,
      annotation,
      annotationClassName,
      className,
      type = 'standard',
      warningMessage,
      ...rest
    } = props;

    // Filter out onAnnotationClick from rest props to avoid React warnings
    if ('onAnnotationClick' in rest) {
      delete (rest as any).onAnnotationClick;
    }

    const { children: primaryButtonText, ...restPrimaryButtonProps } =
      actions?.primaryButtonProps ?? {};

    // Render annotation based on type
    const renderAnnotation = () => {
      if (!annotation) return null;

      switch (type) {
        case 'standard': {
          return (
            <Button
              onClick={
                'onAnnotationClick' in props
                  ? props.onAnnotationClick
                  : undefined
              }
              size="main"
              variant="base-ghost"
            >
              {annotation as string}
            </Button>
          );
        }

        case 'overflow': {
          // @TODO Consider Dropdown integration after Dropdown redesign
          return (
            <Button
              icon={annotation as ButtonProps['icon']}
              onClick={
                'onAnnotationClick' in props
                  ? props.onAnnotationClick
                  : undefined
              }
              size="main"
              variant="base-ghost"
            />
          );
        }

        case 'information': {
          return (
            <Typography color="text-neutral" variant="caption">
              {annotation as string}
            </Typography>
          );
        }

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
          {actions?.secondaryButtonProps && (
            <Button
              size="main"
              variant="base-secondary"
              {...actions.secondaryButtonProps}
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
