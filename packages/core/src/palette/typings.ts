export type MainColor = 'primary' | 'secondary' | 'error' | 'warning' | 'success';

export type GradualMainColor = `${MainColor}-${'light' | 'dark'}`;

export type StatefulMainColor = `${MainColor}-${'hover-bg' | 'active-bg'}`;

export type MainContrastTextColor = `on-${MainColor}`;

export type TextColor = `text-${'primary' | 'secondary' | 'disabled'}`;

export type ActionForegroundColor = `action-${'active' | 'inactive' | 'disabled'}`;
export type ActionBackgroundColor = `action-${'disabled-bg'}`;
export type ActionColor = ActionForegroundColor | ActionBackgroundColor;

export type Color =
  | MainColor
  | GradualMainColor
  | MainContrastTextColor
  | TextColor
  | ActionColor
  | 'bg'
  | 'surface'
  | 'border'
  | 'divider';
