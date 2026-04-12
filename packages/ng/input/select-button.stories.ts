import { Component } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { MznInputSelectButton } from './select-button.component';

const options: ReadonlyArray<DropdownOption> = [
  { id: 'https://', name: 'https://' },
  { id: 'http://', name: 'http://' },
  { id: 'ftp://', name: 'ftp://' },
];

@Component({
  selector: 'story-select-button-playground',
  standalone: true,
  imports: [MznInputSelectButton],
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div>
        <h3 style="margin-bottom: 12px;">Size: main (Normal)</h3>
        <div style="display: flex; gap: 12px;">
          <div
            mznInputSelectButton
            size="main"
            [options]="options"
            [value]="selectedValue"
            (selected)="selectedValue = $event.id"
          ></div>
        </div>
      </div>
      <div>
        <h3 style="margin-bottom: 12px;">Size: sub (Normal)</h3>
        <div style="display: flex; gap: 12px;">
          <div
            mznInputSelectButton
            size="sub"
            [options]="options"
            [value]="selectedValue"
            (selected)="selectedValue = $event.id"
          ></div>
        </div>
      </div>
      <div>
        <h3 style="margin-bottom: 12px;">Disabled State</h3>
        <div style="display: flex; gap: 12px;">
          <div
            mznInputSelectButton
            [disabled]="true"
            [options]="options"
            value="www."
          ></div>
        </div>
      </div>
    </div>
  `,
})
class StorySelectButtonPlayground {
  readonly options = options;
  selectedValue = 'https://';
}

export default {
  title: 'Data Entry/Input/SelectButton',
  decorators: [
    moduleMetadata({
      imports: [StorySelectButtonPlayground],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `<story-select-button-playground />`,
  }),
};
