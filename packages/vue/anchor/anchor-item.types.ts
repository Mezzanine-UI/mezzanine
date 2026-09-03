export interface AnchorItemData {
  autoScrollTo?: boolean;
  children?: AnchorItemData[];
  disabled?: boolean;
  href: string;
  id: string;
  name: string;
  onClick?: VoidFunction;
  title?: string;
}

export interface AnchorItemProps {
  autoScrollTo?: boolean;
  disabled?: boolean;
  href: string;
  id: string;
  level?: number;
  name: string;
  onClick?: VoidFunction;
  parentAutoScrollTo?: boolean;
  parentDisabled?: boolean;
  subAnchors?: AnchorItemData[];
  title?: string;
}
