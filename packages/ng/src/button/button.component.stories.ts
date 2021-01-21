import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { IconDefinition, PlusIcon, SearchIcon } from '@mezzanine-ui/icons';
import { MznIconModule } from '../icon';
import { MznButtonModule } from '.';

export default {
  title: 'Basic/Button',
  decorators: [
    moduleMetadata({
      imports: [MznButtonModule, MznIconModule],
    }),
  ],
} as Meta;

export const Variants: Story = (args) => ({
  props: args,
  template: `
    <div
      [ngStyle]="{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(4, min-content)',
        gap: '16px'
      }"
    >
      <button mzn-button="contained">primary</button>
      <button mzn-button="contained" [color]="secondary">secondary</button>
      <button mzn-button="contained" error>error</button>
      <button mzn-button="contained" disabled>disabled</button>
      <button mzn-button="outlined">primary</button>
      <button mzn-button="outlined" [color]="secondary">secondary</button>
      <button mzn-button="outlined" error>error</button>
      <button mzn-button="outlined" disabled>disabled</button>
      <button mzn-button>primary</button>
      <button mzn-button [color]="secondary">secondary</button>
      <button mzn-button error>error</button>
      <button mzn-button disabled>disabled</button>
    </div>
  `,
});

export const Sizes: Story = (args) => ({
  props: args,
  template: `
    <div
      [ngStyle]="{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(3, min-content)',
        gap: '16px',
        alignItems: 'center'
      }"
    >
      <button mzn-button size="small">ok</button>
      <button mzn-button>ok</button>
      <button mzn-button size="large">ok</button>
      <button mzn-button="outlined" size="small">ok</button>
      <button mzn-button="outlined">ok</button>
      <button mzn-button="outlined" size="large">ok</button>
      <button mzn-button="contained" size="small">ok</button>
      <button mzn-button="contained">ok</button>
      <button mzn-button="contained" size="large">ok</button>
    </div>
  `,
});

interface WithIconsStoryArgs {
  plusIcon: IconDefinition;
  searchIcon: IconDefinition;
}

export const WithIcons: Story<WithIconsStoryArgs> = (args) => ({
  props: args,
  template: `
    <div
      [ngStyle]="{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(3, min-content)',
        gap: '16px',
        alignItems: 'center'
      }"
    >
      <button
        mzn-button="contained"
        color="secondary"
      >
        <i [mzn-icon]="plusIcon"></i>
        plus
      </button>
      <button
        mzn-button="contained"
        iconOnEnd
      >
        <i [mzn-icon]="searchIcon"></i>
        search
      </button>
      <button
        mzn-button="contained"
        disabled
        iconOnEnd
      >
        <i [mzn-icon]="searchIcon"></i>
        search
      </button>
      <button
        mzn-button="contained"
        size="small"
        iconOnEnd
      >
        <i [mzn-icon]="searchIcon"></i>
        search
      </button>
      <button
        mzn-button="contained"
        size="large"
        iconOnEnd
      >
        <i [mzn-icon]="searchIcon"></i>
        search
      </button>
    </div>
  `,
});

WithIcons.args = {
  plusIcon: PlusIcon,
  searchIcon: SearchIcon,
};

interface LoadingStoryArgs {
  loading: boolean;
  plusIcon: IconDefinition;
}

export const Loading: Story<LoadingStoryArgs> = (args) => ({
  props: args,
  template: `
    <button mzn-button="contained" [loading]="loading">ok</button>
    &nbsp;
    <button mzn-button="contained" [loading]="loading"><i [mzn-icon]="plusIcon"></i>ok</button>
  `,
});

Loading.args = {
  loading: true,
  plusIcon: PlusIcon,
};
