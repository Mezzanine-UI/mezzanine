'use client';

import cx from 'clsx';
import { ChangeEventHandler, ReactNode, useMemo, useState } from 'react';

import {
  dropdownClasses as classes,
  DropdownCheckPosition,
  DropdownItemLevel,
  DropdownItemValidate,
  DropdownMode,
} from '@mezzanine-ui/core/dropdown/dropdown';
import { type IconDefinition, CheckedIcon } from '@mezzanine-ui/icons';

import Checkbox from '../Checkbox';
import Icon, { IconColor } from '../Icon';
import Separator from '../Separator';
import Typography from '../Typography';
import { HighlightSegment, highlightText } from './highlightText';

export interface DropdownItemCardProps {
  /**
   * Whether the option is currently active (highlighted by keyboard navigation).
   * This controls the aria-selected attribute according to W3C ARIA spec.
   * When an option is referenced by aria-activedescendant, it should have aria-selected="true".
   */
  active?: boolean;
  /**
   * The icon to append.
   */
  appendIcon?: IconDefinition;
  /**
   * The content to append.
   */
  appendContent?: string;
  /**
   * The position of the checkbox.
   */
  checkSite?: DropdownCheckPosition;
  /**
   * Controlled: Whether the option is selected/checked.
   * Controls checkbox state in multiple mode.
   * When provided, the state is controlled externally.
   */
  checked?: boolean;
  /**
   * Whether the checkbox is in indeterminate state.
   * Used in tree mode when some but not all children are selected.
   */
  indeterminate?: boolean;
  /**
   * Additional className for the list item.
   */
  className?: string;
  /**
   * Uncontrolled: Default checked/selected state.
   * Only used when `checked` is not provided.
   */
  defaultChecked?: boolean;
  /**
   * Whether the dropdown item card is disabled.
   */
  disabled?: boolean;
  /**
   * The text to follow.
   */
  followText?: string;
  /**
   * DOM id for the option, useful for aria-activedescendant.
   */
  id?: string;
  /**
   * The label of the dropdown item card.
   */
  label?: string;
  /**
   * The level of the dropdown item card.
   */
  level?: DropdownItemLevel;
  /**
   * The mode of the dropdown item card.
   */
  mode: DropdownMode;
  /**
   * The accessible name / label for the option.
   * Falls back to label if not provided.
   */
  name?: string;
  /**
   * Callback fired when the checked/selected state changes.
   */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * Click handler when the list item is activated.
   */
  onClick?: () => void;
  /**
   * Mouse enter handler.
   */
  onMouseEnter?: () => void;
  /**
   * The icon to prepend.
   */
  prependIcon?: IconDefinition;
  /**
   * Whether to show the underline.
   * @default false
   */
  showUnderline?: boolean;
  /**
   * The subtitle of the dropdown item card.
   */
  subTitle?: string;
  /**
   * Whether clicking the list item should toggle checked state in multiple mode.
   * Used in tree mode when clicking a parent node should toggle the checked state of all its children.
   * @default true
   */
  toggleCheckedOnClick?: boolean;
  /**
   * The validation of the dropdown item card.
   */
  validate?: DropdownItemValidate;
}

export default function DropdownItemCard(props: DropdownItemCardProps) {
  const {
    active = false,
    appendIcon,
    appendContent,
    followText,
    id,
    label,
    level: levelProp,
    mode,
    name: _name,
    prependIcon,
    subTitle,
    toggleCheckedOnClick = true,
    validate,
    disabled,
    checked,
    defaultChecked,
    indeterminate = false,
    checkSite,
    onCheckedChange,
    onClick,
    className,
    onMouseEnter,
    showUnderline,
  } = props;

  const cardLabel = label || '';
  const cardName = _name || cardLabel;
  const level = levelProp || 0;

  // Generate ID for the label element to use with aria-labelledby
  // If no id is provided, we'll rely on the visible text content for accessibility
  const labelId = useMemo(() => {
    if (!id) return undefined;
    return `${id}-label`;
  }, [id]);

  // If name is different from label, we need to use aria-label as fallback
  // Note: aria-label on role="option" has limited support, but it's better than nothing
  const ariaLabel = useMemo(() => {
    if (cardName !== cardLabel) {
      return cardName;
    }
    return undefined;
  }, [cardName, cardLabel]);

  // Controlled/uncontrolled mode for checked/selected state
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(
    defaultChecked ?? false,
  );
  const isChecked = isControlled ? checked : internalChecked;

  const appendIconColor: IconColor = useMemo(() => {
    if (disabled) return 'neutral-light';

    if (validate === 'danger') return 'error';

    return 'brand';
  }, [disabled, validate]);

  const iconColor: IconColor = useMemo(() => {
    if (disabled) return 'neutral-light';

    return validate === 'danger' ? 'error' : 'neutral';
  }, [disabled, validate]);

  const labelParts: HighlightSegment[] = useMemo(() => {
    return followText
      ? highlightText(cardLabel, followText)
      : [
        {
          text: cardLabel,
          highlight: false,
        },
      ];
  }, [cardLabel, followText]);

  const showPrependContent = useMemo(() => {
    return prependIcon || (checkSite === 'prefix' && mode === 'multiple');
  }, [prependIcon, checkSite, mode]);

  const showAppendContent = useMemo(() => {
    return appendContent || appendIcon || (checkSite === 'suffix' && isChecked);
  }, [appendContent, appendIcon, checkSite, isChecked]);

  const subTitleParts: HighlightSegment[] = useMemo(() => {
    return followText && subTitle
      ? highlightText(subTitle, followText)
      : subTitle
        ? [
          {
            text: subTitle,
            highlight: false,
          },
        ]
        : [];
  }, [subTitle, followText]);

  const renderHighlightedText = (
    parts: HighlightSegment[],
    className: string,
    id?: string,
  ): ReactNode => {
    return (
      <Typography className={className} id={id}>
        {parts.map((part, index) => (
          <span
            key={index}
            className={
              part.highlight && validate !== 'danger'
                ? classes.cardHighlightedText
                : ''
            }
          >
            {part.text}
          </span>
        ))}
      </Typography>
    );
  };

  const toggleChecked = () => {
    if (disabled) return;

    const newChecked = !isChecked;

    if (!isControlled) {
      setInternalChecked(newChecked);
    }

    onCheckedChange?.(newChecked);
  };

  const handleClick = () => {
    if (disabled) return;

    if (mode === 'multiple' && toggleCheckedOnClick) {
      toggleChecked();
    }

    onClick?.();
  };

  const handleCheckboxChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    event.stopPropagation();
    toggleChecked();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <>
      <li
        {...(labelId ? { 'aria-labelledby': labelId } : {})}
        {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
        aria-selected={active}
        className={cx(
          classes.card,
          classes.cardLevel(level),
          {
            [classes.cardActive]: active || isChecked,
            [classes.cardDisabled]: disabled,
            [classes.cardDanger]: validate === 'danger',
          },
          className,
        )}
        id={id}
        role="option"
        tabIndex={-1}
        onMouseEnter={onMouseEnter}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <div className={classes.cardContainer}>
          {showPrependContent && (
            <div className={classes.cardPrependContent}>
              {prependIcon && <Icon icon={prependIcon} color={iconColor} />}
              {checkSite === 'prefix' && mode === 'multiple' && (
                <Checkbox
                  checked={isChecked}
                  disabled={disabled}
                  indeterminate={indeterminate}
                  onChange={handleCheckboxChange}
                  {...(onCheckedChange
                    ? {
                        onClick: (event: React.MouseEvent) =>
                          event.stopPropagation(),
                        onMouseDown: (event: React.MouseEvent) =>
                          event.stopPropagation(),
                      }
                    : {})}
                />
              )}
            </div>
          )}
          <div className={classes.cardBody}>
            {cardLabel &&
              renderHighlightedText(labelParts, classes.cardTitle, labelId)}
            {subTitleParts.length > 0 &&
              renderHighlightedText(subTitleParts, classes.cardDescription)}
          </div>
          {showAppendContent && (
            <div className={classes.cardAppendContent}>
              {appendContent && (
                <Typography color="text-neutral-light">
                  {appendContent}
                </Typography>
              )}
              {appendIcon && <Icon icon={appendIcon} color={iconColor} />}
              {checkSite === 'suffix' && isChecked && (
                <Icon icon={CheckedIcon} color={appendIconColor} size={16} />
              )}
            </div>
          )}
        </div>
      </li>
      {showUnderline && (
        <li role="presentation" aria-hidden="true">
          <Separator
            orientation="horizontal"
            className={classes.cardUnderline}
          />
        </li>
      )}
    </>
  );
}
