import type { Preview } from '@storybook/react';
import { DocsPage } from '@storybook/addon-docs';
// import { lightTheme, darkTheme } from './theme';
import './global.scss';

// function hexToRgbA(hex: string, alpha: number){
//   let c: any;

//   if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
//     c = hex.substring(1).split('');

//     if (c.length === 3) {
//       c= [c[0], c[0], c[1], c[1], c[2], c[2]];
//     }

//     c = `0x${c.join('')}`;

//     return 'rgba(' + [(c>>16)&255, (c>>8)&255, c&255].join(',') + ',' + alpha + ')';
//   }

//   throw new Error('Bad Hex');
// }

// const providerFn = ({ theme, children }) => {
//   const { palette } = theme;

//   const generateMainPaletteVariables = (target) => ({
//     [`--mzn-color-${target}`]: palette.color[target].main,
//     [`--mzn-color-${target}-light`]: palette.color[target].light,
//     [`--mzn-color-${target}-dark`]: palette.color[target].dark,
//     [`--mzn-color-on-${target}`]: palette.color[target].on,
//     [`--mzn-color-${target}-hover-bg`]: hexToRgbA(palette.color[target].light, 0.15),
//     [`--mzn-color-${target}-active-bg`]: hexToRgbA(palette.color[target].main, 0.2),
//   });

//   const computedStyle = {
//     ...generateMainPaletteVariables('primary'),
//     ...generateMainPaletteVariables('secondary'),
//     ...generateMainPaletteVariables('error'),
//     ...generateMainPaletteVariables('warning'),
//     ...generateMainPaletteVariables('success'),
//     '--mzn-color-text-primary': palette.color.text.primary,
//     '--mzn-color-text-secondary': palette.color.text.secondary,
//     '--mzn-color-text-disabled': palette.color.text.disabled,
//     '--mzn-color-action-active': palette.color.action.active,
//     '--mzn-color-action-inactive': palette.color.action.inactive,
//     '--mzn-color-action-disabled': palette.color.action.disabled,
//     '--mzn-color-action-disabled-bg': palette.color.action.disabledBackground,
//     '--mzn-color-bg': palette.color.background,
//     '--mzn-color-surface': palette.color.surface,
//     '--mzn-color-border': palette.color.border,
//     '--mzn-color-divider': palette.color.divider,
//     '--mzn-color-overlay-bg': hexToRgbA(palette.color.action.active, 0.5),
//     '--mzn-color-overlay-surface-bg': hexToRgbA(palette.color.surface, 0.9),
//   };

//   Object.entries(computedStyle).forEach(([key, value]) => {
//     document.documentElement.style.setProperty(key, value);
//   });

//   return children;
// };

// const themingDecorator = withThemes(null, [lightTheme, darkTheme], { providerFn });

const preview: Preview = {
  parameters: {
    docs: { page: DocsPage },
    backgrounds: {
      disable: true,
      grid: {
        disable: false,
      },
    },
    controls: {
      sort: 'requiredFirst',
    },
    options: {
      storySort: {
        order: [
          'System',
          'General',
          'Navigation',
          'Data Entry',
          'Data Display',
          'Feedback'
        ]
      }
    },
  },
};

export default preview;
