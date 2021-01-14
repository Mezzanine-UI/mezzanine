import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import {
  CheckIcon,
  CheckCircleFilledIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ExclamationCircleFilledIcon,
  EyeIcon,
  EyeSlashIcon,
  InfoCircleFilledIcon,
  PlusIcon,
  SearchIcon,
  SpinnerIcon,
  TimesIcon,
  TimesCircleFilledIcon,
} from '@mezzanine-ui/icons';
import { IconColor, MznIconDirective, MznIconModule } from '.';

export default {
  title: 'Basic/Icon',
  decorators: [
    moduleMetadata({
      imports: [MznIconModule],
    }),
  ],
} as Meta;

const colors: IconColor[] = [
  'inherit',
  'primary',
  'secondary',
  'error',
  'warning',
  'success',
  'disabled',
];

export const Playgroud: Story<MznIconDirective> = (args) => ({
  props: args,
  template: `
    <i 
      [mznIcon]="icon"
      [mznIconColor]="color"
      [mznIconSpin]="spin"
    ></i>
  `,
});

Playgroud.args = {
  icon: PlusIcon,
  spin: false,
};
Playgroud.argTypes = {
  color: {
    control: {
      type: 'select',
      options: [undefined, ...colors],
    },
  },
};

interface AllStoryArgs {
  search: string;
}

export const All: Story<AllStoryArgs> = ({ search }) => {
  const icons = [
    CheckIcon,
    CheckCircleFilledIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    ExclamationCircleFilledIcon,
    EyeIcon,
    EyeSlashIcon,
    InfoCircleFilledIcon,
    PlusIcon,
    SearchIcon,
    SpinnerIcon,
    TimesIcon,
    TimesCircleFilledIcon,
  ].filter((icon) => !search || icon.name.includes(search));

  return {
    props: {
      icons,
    },
    template: `
      <div
        [ngStyle]="{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          rowGap: '16px',
          color: 'var(--mzn-color-action-inactive)',
          fontSize: '48px',
          textAlign: 'center'
        }"
      >
        <ng-container *ngFor="let icon of icons;">
          <div>
            <i [mznIcon]="icon" [mznIconSpin]="spin"></i>
            <div [style.font-size.px]="20">{{icon.name}}</div>
          </div>
        </ng-container>
      </div>
    `,
  };
};

All.args = {
  search: '',
};

export const Colors: Story = (args) => ({
  props: {
    ...args,
    colors,
    icon: CheckIcon,
  },
  template: `
    <div
      [ngStyle]="{
        color: 'var(--mzn-color-action-inactive)',
        fontSize: '48px'
      }"
    >
      <ng-container *ngFor="let color of colors;">
        <i [mznIcon]="icon" [mznIconColor]="color"></i>
      </ng-container>
    </div>
  `,
});
