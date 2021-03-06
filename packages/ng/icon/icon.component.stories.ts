import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import {
  ArrowRightIcon,
  CalendarIcon,
  CaretRightIcon,
  CheckCircleFilledIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  DownloadIcon,
  ExclamationCircleFilledIcon,
  EyeIcon,
  EyeSlashIcon,
  FolderOpenIcon,
  InfoCircleFilledIcon,
  MinusCircleFilledIcon,
  PlusIcon,
  SearchIcon,
  SpinnerIcon,
  TimesCircleFilledIcon,
  TimesIcon,
  UploadIcon,
} from '@mezzanine-ui/icons';
import { IconColor, MznIconComponent, MznIconModule } from '.';

export default {
  title: 'General/Icon',
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

export const Playgroud: Story<MznIconComponent> = (args) => ({
  props: args,
  template: `
    <i 
      [mzn-icon]="icon"
      [color]="color"
      [spin]="spin"
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
    ArrowRightIcon,
    CaretRightIcon,
    CheckCircleFilledIcon,
    CheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ClockIcon,
    DownloadIcon,
    ExclamationCircleFilledIcon,
    EyeIcon,
    EyeSlashIcon,
    FolderOpenIcon,
    InfoCircleFilledIcon,
    MinusCircleFilledIcon,
    PlusIcon,
    SearchIcon,
    SpinnerIcon,
    TimesCircleFilledIcon,
    TimesIcon,
    UploadIcon,
    CalendarIcon,
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
            <i [mzn-icon]="icon" [spin]="spin"></i>
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
        <i [mzn-icon]="icon" [color]="color"></i>
      </ng-container>
    </div>
  `,
});
