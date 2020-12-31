import { boolean, text } from '@storybook/addon-knobs';
import React from 'react';
import {
  CheckIcon,
  CheckCircleFilledIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ExclamationCircleFilledIcon,
  EyeIcon,
  EyeSlashIcon,
  InfoCircleFilledIcon,
  PlusIcon,
  SearchIcon,
  SpinnerIcon,
  TimesIcon,
  TimesCircleFilledIcon,
} from '@mezzanine-ui/icons';
import { IconColor } from '@mezzanine-ui/core/icon';
import Icon from '.';

export default { title: 'Basic/Icon' };

export const All = () => {
  const search = text('search', '');
  const spin = boolean('spin', false);
  const icons = [
    CheckIcon,
    CheckCircleFilledIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    ExclamationCircleFilledIcon,
    EyeIcon,
    EyeSlashIcon,
    InfoCircleFilledIcon,
    PlusIcon,
    SearchIcon,
    SpinnerIcon,
    TimesIcon,
    TimesCircleFilledIcon,
  ].filter((icon) => !search || icon.name.includes(search));

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        rowGap: '16px',
        color: 'var(--mzn-color-action-inactive)',
        fontSize: 48,
        textAlign: 'center',
      }}
    >
      {icons.map((icon) => (
        <div key={icon.name}>
          <Icon icon={icon} spin={spin} />
          <div style={{ fontSize: 20 }}>{icon.name}</div>
        </div>
      ))}
    </div>
  );
};

export const Colors = () => {
  const colors: IconColor[] = [
    'inherit',
    'primary',
    'secondary',
    'error',
    'warning',
    'success',
    'disabled',
  ];

  return (
    <div
      style={{
        color: 'var(--mzn-color-action-inactive)',
        fontSize: 48,
      }}
    >
      {colors.map((color) => (
        <Icon
          key={color}
          icon={CheckIcon}
          color={color}
        />
      ))}
    </div>
  );
};
