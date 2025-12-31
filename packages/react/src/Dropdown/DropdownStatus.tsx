'use client';

import { useMemo } from "react";

import {
  dropdownClasses as classes,
  dropdownStatus,
} from "@mezzanine-ui/core/dropdown/dropdown";
import {
  FolderOpenIcon,
  IconDefinition,
  SpinnerIcon,
} from "@mezzanine-ui/icons";

import Icon from "../Icon";
import Typography from "../Typography";

export interface DropdownStatusProps {
  /**
   * The status of the dropdown.
   * @default 'loading'
   */
  status: dropdownStatus;
  /**
   * The text of the dropdown loading status.
   */
  loadingText?: string;
  /**
   * The text of the dropdown empty status.
   */
  emptyText?: string;
  /**
   * The icon of the dropdown empty status.
   */
  emptyIcon?: IconDefinition;
}

export default function DropdownStatus(props: DropdownStatusProps) {
  const { status, loadingText, emptyText, emptyIcon } = props;

  const defaultStatusText = useMemo(() => {
    if (status === 'loading') {
      return loadingText ?? 'Loading...';
    }

    if (status === 'empty') {
      return emptyText ?? 'No matching options.';
    }

    return ''
  }, [status, loadingText, emptyText]);

  const IconElement = useMemo(() => {
    if (status === 'loading') {
      return <Icon icon={SpinnerIcon} size={16} spin color="brand" />;
    }

    return <Icon icon={emptyIcon ?? FolderOpenIcon} size={16} />;
  }, [status, emptyIcon]);

  return (
    <div className={classes.status}>
      {IconElement}
      <Typography className={classes.statusText}>
        {defaultStatusText}
      </Typography>
    </div>
  )
}