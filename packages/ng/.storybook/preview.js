import { setCompodocJson } from '@storybook/addon-docs/angular';
import { createPreview } from '../../../.storybook/preview';
import docJson from '../documentation.json';

setCompodocJson(docJson);

let prevTheme;
const decorateTheme = (storyFunc, context) => {
  const story = storyFunc();
  const { theme } = context.globals;

  if (prevTheme !== theme) {
    const root = document.querySelector('.sb-show-main');

    if (prevTheme) {
      root.classList.remove(`theme-${prevTheme}`);
    }

    root.classList.add(`theme-${theme}`);

    prevTheme = theme;
  }

  return story;
};

export const {
  decorators,
  parameters,
  globalTypes,
} = createPreview({
  decorateTheme, 
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
  },
});
