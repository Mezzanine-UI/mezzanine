import { useGlobals } from '@storybook/api';
import { useEffect } from 'react';
import { createPreview } from '../../../.storybook/preview';

const decorateTheme =(Story, context) => {
  const { theme } = context.globals;

  useEffect(() => {
    const root = document.querySelector('.sb-show-main');
    const className = `theme-${theme}`;

    root.classList.add(className);

    return () => {
      root.classList.remove(className);
    };
  }, [theme]);
  
  return (
    <Story {...context} />
  );
};

export const {
  decorators,
  parameters,
  globalTypes,
} = createPreview({
  decorateTheme,
});
