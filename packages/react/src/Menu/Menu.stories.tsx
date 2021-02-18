import { Meta } from '@storybook/react';
import Menu, { MenuDivider, MenuItem, MenuItemGroup } from '.';

export default {
  title: 'Navigation/Menu',
} as Meta;

export const Sizes = () => (
  <div style={{
    display: 'inline-grid',
    gridTemplateColumns: 'repeat(3, 160px)',
    gap: 60,
  }}
  >
    <Menu size="large">
      <MenuItem>item 1</MenuItem>
      <MenuItem active>item 2</MenuItem>
      <MenuItem disabled>item 3</MenuItem>
      <MenuItem>item 4</MenuItem>
    </Menu>
    <Menu size="medium">
      <MenuItem>item 1</MenuItem>
      <MenuItem active>item 2</MenuItem>
      <MenuItem disabled>item 3</MenuItem>
      <MenuItem>item 4</MenuItem>
    </Menu>
    <Menu size="small">
      <MenuItem>item 1</MenuItem>
      <MenuItem active>item 2</MenuItem>
      <MenuItem disabled>item 3</MenuItem>
      <MenuItem>item 4</MenuItem>
    </Menu>
  </div>
);

export const WithDivider = () => (
  <Menu
    maxHeight={139}
    style={{ width: 160 }}
  >
    <MenuItem>item 1</MenuItem>
    <MenuItem>item 2</MenuItem>
    <MenuItem>item 3</MenuItem>
    <MenuDivider />
    <MenuItem>item 4</MenuItem>
  </Menu>
);

export const Group = () => (
  <div style={{
    display: 'inline-grid',
    gridTemplateColumns: 'repeat(3, 160px)',
    gap: 60,
  }}
  >
    <Menu size="large">
      <MenuItemGroup label="Group A">
        <MenuItem>item 1</MenuItem>
        <MenuItem>item 2</MenuItem>
      </MenuItemGroup>
      <MenuItemGroup label="Group B">
        <MenuItem>item 1</MenuItem>
        <MenuItem>item 2</MenuItem>
      </MenuItemGroup>
    </Menu>
    <Menu size="medium">
      <MenuItemGroup label="Group A">
        <MenuItem>item 1</MenuItem>
        <MenuItem>item 2</MenuItem>
      </MenuItemGroup>
      <MenuItemGroup label="Group B">
        <MenuItem>item 1</MenuItem>
        <MenuItem>item 2</MenuItem>
      </MenuItemGroup>
    </Menu>
    <Menu size="small">
      <MenuItemGroup label="Group A">
        <MenuItem>item 1</MenuItem>
        <MenuItem>item 2</MenuItem>
      </MenuItemGroup>
      <MenuItemGroup label="Group B">
        <MenuItem>item 1</MenuItem>
        <MenuItem>item 2</MenuItem>
      </MenuItemGroup>
    </Menu>
  </div>
);
