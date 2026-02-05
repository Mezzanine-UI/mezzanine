export interface ContentHeaderResponsiveProps {
  breakpoint:
    | 'above1080px'
    | 'above680px'
    | 'below1080px'
    | 'below680px'
    | 'between680and1080px';
  children?: React.ReactNode;
}

const ContentHeaderResponsive: React.FC<ContentHeaderResponsiveProps> = (
  props,
) => {
  const { children } = props;

  return children;
};

export default ContentHeaderResponsive;
