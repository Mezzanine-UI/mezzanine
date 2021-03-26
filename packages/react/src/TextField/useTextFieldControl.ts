import {
  MouseEventHandler,
  KeyboardEventHandler,
} from 'react';

export interface UseTextFieldControlProps {
  onClick?: MouseEventHandler;
  onKeyDown?: KeyboardEventHandler;
}

export function useTextFieldControl(props: UseTextFieldControlProps) {
  const {
    onClick = undefined,
    onKeyDown = undefined,
  } = props || {};

  const getRole = () => {
    if (typeof onClick !== 'undefined') return 'button';

    return 'textbox';
  };

  return {
    role: getRole(),
    onClick,
    onKeyDown,
  };
}
