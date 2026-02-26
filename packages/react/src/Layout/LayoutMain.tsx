export interface LayoutMainProps {
  /** The content rendered inside the main area. */
  children?: React.ReactNode;
}

export function LayoutMain({ children }: LayoutMainProps) {
  return <>{children}</>;
}

LayoutMain.displayName = 'Layout.Main';
