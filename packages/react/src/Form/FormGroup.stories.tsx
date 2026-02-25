import { Meta, StoryObj } from '@storybook/react-webpack5';
import { FormFieldLayout } from '@mezzanine-ui/core/form';
import Input from '../Input';
import { FormField, FormGroup } from '.';

export default {
  title: 'Data Entry/Form/FormGroup',
} as Meta;

export const Basic: StoryObj = {
  render: function Render() {
    return (
      <FormGroup title="Group Title">
        <FormField
          label="Label"
          layout={FormFieldLayout.HORIZONTAL}
          name="field1"
        >
          <Input placeholder="Placeholder" />
        </FormField>
        <FormField
          label="Label"
          layout={FormFieldLayout.HORIZONTAL}
          name="field2"
        >
          <Input placeholder="Placeholder" />
        </FormField>
        <FormField
          label="Label"
          layout={FormFieldLayout.HORIZONTAL}
          name="field3"
        >
          <Input placeholder="Placeholder" />
        </FormField>
      </FormGroup>
    );
  },
};

export const MultipleGroups: StoryObj = {
  render: function Render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <FormGroup title="Group Title">
          <FormField
            label="Label"
            layout={FormFieldLayout.HORIZONTAL}
            name="group1-field1"
          >
            <Input placeholder="Placeholder" />
          </FormField>
          <FormField
            label="Label"
            layout={FormFieldLayout.HORIZONTAL}
            name="group1-field2"
          >
            <Input placeholder="Placeholder" />
          </FormField>
          <FormField
            label="Label"
            layout={FormFieldLayout.HORIZONTAL}
            name="group1-field3"
          >
            <Input placeholder="Placeholder" />
          </FormField>
        </FormGroup>

        <FormGroup title="Group Title">
          <FormField
            label="Label"
            layout={FormFieldLayout.HORIZONTAL}
            name="group2-field1"
          >
            <Input placeholder="Placeholder" />
          </FormField>
          <FormField
            label="Label"
            layout={FormFieldLayout.HORIZONTAL}
            name="group2-field2"
          >
            <Input placeholder="Placeholder" />
          </FormField>
        </FormGroup>
      </div>
    );
  },
};

export const CustomFieldsContainerClassName: StoryObj = {
  render: function Render() {
    return (
      <FormGroup
        fieldsContainerClassName="custom-gap"
        title="Group Title with Custom Gap"
      >
        <FormField
          label="Label"
          layout={FormFieldLayout.HORIZONTAL}
          name="field1"
        >
          <Input placeholder="Placeholder" />
        </FormField>
        <FormField
          label="Label"
          layout={FormFieldLayout.HORIZONTAL}
          name="field2"
        >
          <Input placeholder="Placeholder" />
        </FormField>
      </FormGroup>
    );
  },
};
