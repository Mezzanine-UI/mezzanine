import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormFieldLayout } from '@mezzanine-ui/core/form';
import { MznInput } from '@mezzanine-ui/ng/input';
import { MznFormField } from './form-field.component';
import { MznFormGroup } from './form-group.component';

export default {
  title: 'Data Entry/Form/FormGroup',
  decorators: [
    moduleMetadata({
      imports: [MznFormField, MznFormGroup, MznInput],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Basic: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div mznFormGroup title="Group Title">
        <div mznFormField label="Label" layout="${FormFieldLayout.HORIZONTAL}" name="field1">
          <div mznInput placeholder="Placeholder"></div>
        </div>
        <div mznFormField label="Label" layout="${FormFieldLayout.HORIZONTAL}" name="field2">
          <div mznInput placeholder="Placeholder"></div>
        </div>
        <div mznFormField label="Label" layout="${FormFieldLayout.HORIZONTAL}" name="field3">
          <div mznInput placeholder="Placeholder"></div>
        </div>
      </div>
    `,
  }),
};

export const MultipleGroups: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px;">
        <div mznFormGroup title="Group Title">
          <div mznFormField label="Label" layout="${FormFieldLayout.HORIZONTAL}" name="group1-field1">
            <div mznInput placeholder="Placeholder"></div>
          </div>
          <div mznFormField label="Label" layout="${FormFieldLayout.HORIZONTAL}" name="group1-field2">
            <div mznInput placeholder="Placeholder"></div>
          </div>
          <div mznFormField label="Label" layout="${FormFieldLayout.HORIZONTAL}" name="group1-field3">
            <div mznInput placeholder="Placeholder"></div>
          </div>
        </div>
        <div mznFormGroup title="Group Title">
          <div mznFormField label="Label" layout="${FormFieldLayout.HORIZONTAL}" name="group2-field1">
            <div mznInput placeholder="Placeholder"></div>
          </div>
          <div mznFormField label="Label" layout="${FormFieldLayout.HORIZONTAL}" name="group2-field2">
            <div mznInput placeholder="Placeholder"></div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const CustomFieldsContainerClassName: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div mznFormGroup fieldsContainerClassName="custom-gap" title="Group Title with Custom Gap">
        <div mznFormField label="Label" layout="${FormFieldLayout.HORIZONTAL}" name="field1">
          <div mznInput placeholder="Placeholder"></div>
        </div>
        <div mznFormField label="Label" layout="${FormFieldLayout.HORIZONTAL}" name="field2">
          <div mznInput placeholder="Placeholder"></div>
        </div>
      </div>
    `,
  }),
};
