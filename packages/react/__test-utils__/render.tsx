/** 請參考 https://testing-library.com/docs/react-testing-library/api#renderhook-options */
export const createWrapper = (Element: any, props: any) => {
  return function CreatedWrapper({ children }: { children: any }) {
    return <Element {...props}>{children}</Element>;
  };
};
