import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { FormFieldLayout } from '@mezzanine-ui/core/form';
import MznInput from '../input/input.vue';
import MznFormField from './form-field.vue';
import MznFormGroup from './form-group.vue';

export default {
  title: 'Data Entry/Form/FormGroup',
} as Meta;

export const Basic: StoryObj = {
  render: () => ({
    components: { MznFormField, MznFormGroup, MznInput },
    setup: () => ({ FormFieldLayout }),
    template: `
      <MznFormGroup title="Group Title">
        <MznFormField
          label="Label"
          :layout="FormFieldLayout.HORIZONTAL"
          name="field1"
        >
          <MznInput placeholder="Placeholder" />
        </MznFormField>
        <MznFormField
          label="Label"
          :layout="FormFieldLayout.HORIZONTAL"
          name="field2"
        >
          <MznInput placeholder="Placeholder" />
        </MznFormField>
        <MznFormField
          label="Label"
          :layout="FormFieldLayout.HORIZONTAL"
          name="field3"
        >
          <MznInput placeholder="Placeholder" />
        </MznFormField>
      </MznFormGroup>
    `,
  }),
};

export const MultipleGroups: StoryObj = {
  render: () => ({
    components: { MznFormField, MznFormGroup, MznInput },
    setup: () => ({ FormFieldLayout }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px">
        <MznFormGroup title="Group Title">
          <MznFormField
            label="Label"
            :layout="FormFieldLayout.HORIZONTAL"
            name="group1-field1"
          >
            <MznInput placeholder="Placeholder" />
          </MznFormField>
          <MznFormField
            label="Label"
            :layout="FormFieldLayout.HORIZONTAL"
            name="group1-field2"
          >
            <MznInput placeholder="Placeholder" />
          </MznFormField>
          <MznFormField
            label="Label"
            :layout="FormFieldLayout.HORIZONTAL"
            name="group1-field3"
          >
            <MznInput placeholder="Placeholder" />
          </MznFormField>
        </MznFormGroup>

        <MznFormGroup title="Group Title">
          <MznFormField
            label="Label"
            :layout="FormFieldLayout.HORIZONTAL"
            name="group2-field1"
          >
            <MznInput placeholder="Placeholder" />
          </MznFormField>
          <MznFormField
            label="Label"
            :layout="FormFieldLayout.HORIZONTAL"
            name="group2-field2"
          >
            <MznInput placeholder="Placeholder" />
          </MznFormField>
        </MznFormGroup>
      </div>
    `,
  }),
};

export const CustomFieldsContainerClassName: StoryObj = {
  render: () => ({
    components: { MznFormField, MznFormGroup, MznInput },
    setup: () => ({ FormFieldLayout }),
    template: `
      <MznFormGroup
        fields-container-class-name="custom-gap"
        title="Group Title with Custom Gap"
      >
        <MznFormField
          label="Label"
          :layout="FormFieldLayout.HORIZONTAL"
          name="field1"
        >
          <MznInput placeholder="Placeholder" />
        </MznFormField>
        <MznFormField
          label="Label"
          :layout="FormFieldLayout.HORIZONTAL"
          name="field2"
        >
          <MznInput placeholder="Placeholder" />
        </MznFormField>
      </MznFormGroup>
    `,
  }),
};
