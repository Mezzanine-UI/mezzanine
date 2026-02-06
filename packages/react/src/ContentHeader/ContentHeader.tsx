import { forwardRef, ReactElement } from 'react';
import { contentHeaderClasses as classes } from '@mezzanine-ui/core/content-header';
import Button, { ButtonGroup, ButtonProps } from '../Button';
import { SearchInputProps } from '../Input';
import { SelectProps } from '../Select';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { ChevronLeftIcon, IconDefinition } from '@mezzanine-ui/icons';
import {
  renderActionsProp,
  renderFilterProp,
  renderIconButtonsProp,
  resolveContentHeaderChild,
} from './utils';
import Typography from '../Typography';
import { DropdownProps } from '../Dropdown';
import { ToggleProps } from '../Toggle';
import { CheckboxProps } from '../Checkbox';

// TODO: Replace with actual SegmentedControlProps when SegmentedControl component is complete
type SegmentedControlProps = {
  mock: 'SegmentedControlProps';
};

type ContentHeaderChild =
  | ReactElement<SearchInputProps>
  | ReactElement<SelectProps>
  | ReactElement<SegmentedControlProps>
  | ReactElement<ToggleProps>
  | ReactElement<CheckboxProps>
  | ReactElement<ButtonProps>
  | ReactElement<DropdownProps>
  | ReactElement<{ href: string }>
  | null
  | false
  | undefined;

/**
 * Props for the ContentHeader component.
 *
 * Defines a flexible header with title, description, filter, action buttons, and utility icons.
 * Commonly used in page headers for primary user actions.
 */
export type ContentHeaderProps = Omit<
  NativeElementPropsWithoutKeyAndRef<'header'>,
  'children'
> & {
  /**
   * Button configuration for actions. <br />
   * Automatically applies proper styling and order. <br />
   * When conflicting with other props, props take priority over children. <br />
   * Buttons with variants other than primary, secondary, and destructive will not be rendered. <br />
   */
  actions?: ButtonProps[];
  /**
   * Children elements: <br />
   * - Back button which Component with href prop.
   *     - example 1: `<a href="..." />` <br />
   *     - example 2: `<Link href="..." />` <br />
   *     - conflicting prop: `onBackClick` <br />
   * - Filter component (SearchInput, Select, or SegmentedControl) <br />
   * - Action buttons `<Button />` <br />
   * - Icon-only utility buttons `<Button icon="..." />` <br />
   * - Overflow icon utility dropdown `<Dropdown> <Button icon="..." /> </Dropdown>` <br />
   * <br />
   * Can mix and match the above children. <br />
   * The order of children does not matter as they will be arranged properly. <br />
   * When conflicting with other props, props take priority over children. <br />
   */
  children?: ContentHeaderChild[] | ContentHeaderChild;
  /** Optional description text displayed below the title */
  description?: string;
  /** Filter component (SearchInput, Select, or SegmentedControl) */
  filter?: {
    variant: 'search' | 'select' | 'segmentedControl' | 'toggle' | 'checkbox';
  } & (
    | SearchInputProps
    | SelectProps
    | SegmentedControlProps
    | ToggleProps
    | CheckboxProps
  );
  /** Main title text for the content header */
  title: string;
  /**
   * HTML element type for the title (defaults to 'h1' for main size and 'h2' for sub size)
   */
  titleComponent?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
  /**
   * Icon-only utility buttons `<Button icon="..." />`. <br />
   * They usually appear as smaller buttons with only an icon and no text.
   */
  utilities?: (
    | (ButtonProps & {
        icon: IconDefinition;
      })
    | DropdownProps
  )[];
} & (
    | {
        /**
         * Optional back button properties. <br />
         * When provided, a back button will be rendered on the left side of the title. <br />
         * href prop from children will be ignored if onBackClick is provided. <br />
         * */
        onBackClick?: () => void;
        /**
         * Size variant of the toolbar. <br />
         * Affects the size of buttons and filter component. <br />
         */
        size?: 'main';
      }
    | {
        onBackClick?: never;
        size?: 'sub';
      }
  );

/**
 * ContentHeader component. <br />
 * A flexible header with title, description, filter, action buttons, and utility icons. <br />
 * Commonly used in page headers for primary user actions. <br />
 *
 * @example
 * ```tsx
 *  <ContentHeader
 *    size="main"
 *    title={'ContentHeader Title'}
 *    description="description."
 *  >
 *    <a href="" title="back" />  <-- Back button
 *
 *    <Input variant="search" placeholder="Search..." />  <-- Filter component
 *    <Button variant="base-secondary">Secondary</Button>  <-- Action buttons
 *    <Button>Primary</Button>
 *
 *    <Button icon={PlusIcon} />  <-- Utility icon button
 *    <Dropdown
 *      options={[
 *        { id: '1', name: 'Option 1' },
 *        { id: '2', name: 'Option 2' },
 *      ]}
 *    >
 *      <Button icon={DotHorizontalIcon} />
 *    </Dropdown>  <-- Utility dropdown
 *  </ContentHeader>
 * ```
 */
const ContentHeader = forwardRef<HTMLElement, ContentHeaderProps>(
  function ContentHeader(props, ref) {
    const {
      actions,
      children,
      className,
      description,
      filter,
      onBackClick,
      size = 'main',
      title,
      titleComponent = size === 'main' ? 'h1' : 'h2',
      utilities,
      ...rest
    } = props;

    const renderFilter = renderFilterProp(filter, size);
    const renderActions = actions ? renderActionsProp(actions, size) : null;
    const renderUtilities = utilities
      ? renderIconButtonsProp(utilities, size)
      : null;

    const {
      backButton,
      filter: filterFromChildren,
      actions: actionsFromChildren,
      utilities: utilitiesFromChildren,
    } = resolveContentHeaderChild(children, size);

    // prop onBack takes precedence over backButtonOrLink
    const renderBackButton = onBackClick ? (
      <Button
        iconType="icon-only"
        icon={ChevronLeftIcon}
        onClick={onBackClick}
        aria-label="Back"
        type="button"
        size="sub"
        variant="base-tertiary"
      />
    ) : (
      backButton
    );

    return (
      <header
        {...rest}
        className={cx(classes.host, classes.size(size), className)}
        ref={ref}
      >
        <span className={classes.titleArea}>
          {/* title area */}
          {renderBackButton && size !== 'sub' && (
            <span className={classes.backButton}>{renderBackButton}</span>
          )}

          <span className={classes.textGroup}>
            <Typography
              component={titleComponent}
              align="left"
              color="text-neutral-solid"
              variant={size === 'main' ? 'h2' : 'h3'}
            >
              {title}
            </Typography>
            {description && (
              <Typography align="left" color="text-neutral" variant="caption">
                {description}
              </Typography>
            )}
          </span>
        </span>

        {/* actions area */}
        <span className={classes.actionArea}>
          {renderFilter || filterFromChildren}
          {(renderActions || actionsFromChildren.length > 0) && (
            <ButtonGroup>{renderActions || actionsFromChildren}</ButtonGroup>
          )}
          {(renderUtilities || utilitiesFromChildren.length > 0) && (
            <span className={classes.utilities}>
              {renderUtilities || utilitiesFromChildren}
            </span>
          )}
        </span>
      </header>
    );
  },
);

export default ContentHeader;
