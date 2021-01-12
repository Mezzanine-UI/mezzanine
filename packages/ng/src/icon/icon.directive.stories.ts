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
  IconDefinition,
} from '@mezzanine-ui/icons';
import { IconColor } from '@mezzanine-ui/core/icon';
import { MznIconDirective, MznIconModule } from '.';

export default {
  title: 'Basic/Icon',
  component: MznIconDirective,
  decorators: [
    moduleMetadata({
      imports: [MznIconModule],
    }),
  ],
} as Meta;

interface AllStoryArgs {
  icons: IconDefinition[];
  search: string;
  spin: boolean;
}

export const All: Story<AllStoryArgs> = ({ icons, search, ...args }) => ({
  component: MznIconDirective,
  props: {
    ...args,
    icons: icons.filter((icon) => !search || icon.name.includes(search)),
    search,
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
});

All.args = {
  icons: [
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
  ],
  search: '',
  spin: false,
};

interface ColorsStoryArgs {
  colors: IconColor[];
}

export const Colors: Story<ColorsStoryArgs> = (args) => ({
  component: MznIconDirective,
  props: {
    ...args,
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

Colors.args = {
  colors: [
    'inherit',
    'primary',
    'secondary',
    'error',
    'warning',
    'success',
    'disabled',
  ],
};
