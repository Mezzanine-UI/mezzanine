import { addons } from '@storybook/addons';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'light',
  brandTitle: 'Mezzanine',
  brandUrl: 'https://github.com/Mezzanine-UI/mezzanine'
});

addons.setConfig({
  theme,
  panelPosition: 'right',
  showRoots: true
});
