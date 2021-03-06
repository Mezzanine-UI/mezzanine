import { addons } from '@storybook/addons';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'dark',
  brandTitle: 'Mezzanine',
  brandUrl: 'https://github.com/Mezzanine-UI/mezzanine'
});

addons.setConfig({
  theme,
  panelPosition: 'bottom',
  sidebar: {
    showRoots: true,
  },
});
