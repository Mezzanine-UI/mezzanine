import { SelectionDirection, SelectionImageObjectFit, SelectionType } from '@mezzanine-ui/core/selection';
import { Meta, StoryObj } from '@storybook/react-webpack5';
import { ReactNode, useState } from 'react';
import Selection, { SelectionProps } from '.';
import Tag from '../Tag';
import Typography from '../Typography';
import SelectionGroup from './SelectionGroup';

export default {
  title: 'Data Entry/Selection',
  component: Selection,
} satisfies Meta<typeof Selection>;

type Story = StoryObj<SelectionProps>;

const selectorTypes: SelectionType[] = ['radio', 'checkbox'];
const directions: SelectionDirection[] = ['horizontal', 'vertical'];
const imageObjectFits: SelectionImageObjectFit[] = ['contain', 'cover', 'fill', 'none', 'scale-down'];

type PlaygroundArgs = SelectionProps;

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    checked: undefined,
    defaultChecked: false,
    className: '',
    direction: 'horizontal',
    disabled: false,
    id: undefined,
    image: undefined,
    imageObjectFit: 'cover',
    name: undefined,
    readonly: false,
    selector: 'radio',
    supportingText: 'Supporting text',
    text: 'Selection',
    value: undefined,
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the selection is checked (controlled mode)',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Whether the selection is checked by default (uncontrolled mode)',
    },
    className: {
      control: 'text',
    },
    direction: {
      control: 'inline-radio',
      options: directions,
    },
    disabled: {
      control: 'boolean',
    },
    id: {
      control: 'text',
      description: 'The id of the input element',
    },
    image: {
      control: 'text',
      description: 'The image URL of selection',
    },
    imageObjectFit: {
      control: 'select',
      options: imageObjectFits,
      description: 'The object fit of selection image',
    },
    name: {
      control: 'text',
      description: 'The name attribute for form submission',
    },
    onChange: {
      action: 'changed',
      description: 'Invoked by input change event',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback when the selection is clicked',
    },
    readonly: {
      control: 'boolean',
    },
    selector: {
      control: 'inline-radio',
      options: selectorTypes,
    },
    supportingText: {
      control: 'text',
    },
    text: {
      control: 'text',
      description: 'The accessible text of selection (required)',
    },
    value: {
      control: 'text',
      description: 'The value of selection for form submission',
    },
  },
};

const Section = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      marginBottom: 48,
    }}
  >
    <Typography variant="h2">{title}</Typography>
    {children}
  </div>
);

const SectionItem = ({
  children,
  label,
  direction = 'row',
}: {
  children: ReactNode;
  label?: string;
  direction?: 'column' | 'row';
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      width: '33%',
      height: 'auto',
      backgroundColor: '#F3F4F6',
      padding: 32,
    }}
  >
    <Tag label={label ?? ''} size="main" type="static" />
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: direction,
      }}
    >
      {children}
    </div>
  </div>
);

const ItemList = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', gap: '36px', alignItems: 'flex-start' }}>
    {children}
  </div>
);

const ItemContent = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      width: '100%',
      marginBottom: 16,
    }}
  >
    {children}
  </div>
);
export const Horizontal: Story = {
  render: () => (
    <>
      <Section title="State:">
        <ItemList>
          <SectionItem label="Text Only:">
            <ItemContent>
              <Typography>Radio:</Typography>
              <Selection
                selector="radio"
                text="Radio Selection"
                supportingText="This is a radio button"
                name="basic-radio"
                value="radio-1"
              />
              <Typography>Checked:</Typography>
              <Selection
                selector="radio"
                text="Radio Selection"
                supportingText="This is a radio button"
                name="basic-radio"
                value="radio-1"
                checked={true}
              />
              <Typography>Disabled:</Typography>
              <Selection
                selector="radio"
                text="Radio Selection"
                supportingText="This is a radio button"
                name="basic-radio"
                value="radio-1"
                disabled={true}
              />
              <Typography>Readonly:</Typography>
              <Selection
                selector="radio"
                text="Radio Selection"
                supportingText="This is a radio button"
                name="basic-radio"
                value="radio-1"
                readonly={true}
              />
            </ItemContent>
            <ItemContent>
              <Typography>Unchecked:</Typography>
              <Selection
                selector="checkbox"
                text="Checkbox Selection"
                supportingText="This is a checkbox"
                name="basic-radio"
                value="radio-1"
              />
              <Typography>Checked:</Typography>
              <Selection
                selector="checkbox"
                text="Checkbox Selection"
                supportingText="This is a checkbox"
                name="basic-checkbox"
                value="checkbox-1"
                checked={true}
              />
              <Typography>Disabled:</Typography>
              <Selection
                selector="checkbox"
                text="Checkbox Selection"
                supportingText="This is a checkbox"
                name="basic-checkbox"
                value="checkbox-1"
                disabled={true}
              />
              <Typography>Readonly:</Typography>
              <Selection
                selector="checkbox"
                text="Checkbox Selection"
                supportingText="This is a checkbox"
                name="basic-checkbox"
                value="checkbox-1"
                readonly={true}
              />
            </ItemContent>
          </SectionItem>
        </ItemList>
      </Section>
      <Section title="With Image:">
        <ItemList>
          <SectionItem label="Text Only:">
            <ItemContent>
              <Typography>Radio:</Typography>
              <Selection
                selector="radio"
                text="Radio Selection"
                supportingText="This is a radio button"
                image="https://rytass.com/logo.png"
                name="basic-radio"
                value="radio-1"
              />
              <Typography>Checked:</Typography>
              <Selection
                selector="radio"
                text="Radio Selection"
                supportingText="This is a radio button"
                image="https://rytass.com/logo.png"
                name="basic-radio"
                value="radio-1"
                checked={true}
              />
              <Typography>Disabled:</Typography>
              <Selection
                selector="radio"
                text="Radio Selection"
                supportingText="This is a radio button"
                image="https://rytass.com/logo.png"
                name="basic-radio"
                value="radio-1"
                disabled={true}
              />
              <Typography>Readonly:</Typography>
              <Selection
                selector="radio"
                text="Radio Selection"
                supportingText="This is a radio button"
                image="https://rytass.com/logo.png"
                name="basic-radio"
                value="radio-1"
                readonly={true}
              />
            </ItemContent>
            <ItemContent>
              <Typography>Unchecked:</Typography>
              <Selection
                selector="checkbox"
                text="Checkbox Selection"
                image="https://rytass.com/logo.png"
                supportingText="This is a checkbox"
                name="basic-radio"
                value="radio-1"
              />
              <Typography>Checked:</Typography>
              <Selection
                selector="checkbox"
                text="Checkbox Selection"
                supportingText="This is a checkbox"
                image="https://rytass.com/logo.png"
                name="basic-checkbox"
                value="checkbox-1"
                checked={true}
              />
              <Typography>Disabled:</Typography>
              <Selection
                selector="checkbox"
                text="Checkbox Selection"
                image="https://rytass.com/logo.png"
                supportingText="This is a checkbox"
                name="basic-checkbox"
                value="checkbox-1"
                disabled={true}
              />
              <Typography>Readonly:</Typography>
              <Selection
                selector="checkbox"
                image="https://rytass.com/logo.png"
                text="Checkbox Selection"
                supportingText="This is a checkbox"
                name="basic-checkbox"
                value="checkbox-1"
                readonly={true}
              />
            </ItemContent>
          </SectionItem>
        </ItemList>
      </Section>
      <Section title="Multiple Items:">
        <form onSubmit={(event) => event.preventDefault()}>
          <ItemList>
            <SectionItem direction="column" label="Radios:">
              <ItemContent>
                <Typography>Multiple Radios:</Typography>
                <Selection
                  defaultChecked
                  name="multiple-radio-three"
                  selector="radio"
                  supportingText="First option"
                  text="Radio Option 1"
                  value="radio-1"
                />
                <Selection
                  name="multiple-radio-three"
                  selector="radio"
                  supportingText="Second option"
                  text="Radio Option 2"
                  value="radio-2"
                />
                <Selection
                  name="multiple-radio-three"
                  selector="radio"
                  supportingText="Third option"
                  text="Radio Option 3"
                  value="radio-3"
                />
              </ItemContent>
            </SectionItem>
            <SectionItem direction="column" label="Checkboxes:">
              <ItemContent>
                <Typography>Multiple Checkboxes:</Typography>
                <Selection
                  defaultChecked
                  name="multiple-checkbox-three"
                  selector="checkbox"
                  supportingText="First checkbox"
                  text="Checkbox Option 1"
                  value="checkbox-1"
                />
                <Selection
                  name="multiple-checkbox-three"
                  selector="checkbox"
                  supportingText="Second checkbox"
                  text="Checkbox Option 2"
                  value="checkbox-2"
                />
                <Selection
                  name="multiple-checkbox-three"
                  selector="checkbox"
                  supportingText="Third checkbox"
                  text="Checkbox Option 3"
                  value="checkbox-3"
                />
              </ItemContent>
            </SectionItem>
          </ItemList>
        </form>
      </Section>
    </>
  ),
};

export const Vertical: Story = {
  render: () => (
    <>
      <Section title="State:">
        <ItemList>
          <SectionItem label="Text Only:">
            <ItemContent>
              <Typography>Radio:</Typography>
              <Selection
                direction="vertical"
                selector="radio"
                text="Radio Selection"
                supportingText="This is a radio button"
                name="vertical-basic-radio"
                value="radio-1"
              />
              <Typography>Checked:</Typography>
              <Selection
                checked={true}
                direction="vertical"
                selector="radio"
                text="Radio Selection"
                supportingText="This is a radio button"
                name="vertical-basic-radio"
                value="radio-1"
              />
              <Typography>Disabled:</Typography>
              <Selection
                direction="vertical"
                disabled={true}
                selector="radio"
                text="Radio Selection"
                supportingText="This is a radio button"
                name="vertical-basic-radio"
                value="radio-1"
              />
              <Typography>Readonly:</Typography>
              <Selection
                direction="vertical"
                readonly={true}
                selector="radio"
                text="Radio Selection"
                supportingText="This is a radio button"
                name="vertical-basic-radio"
                value="radio-1"
              />
            </ItemContent>
            <ItemContent>
              <Typography>Unchecked:</Typography>
              <Selection
                direction="vertical"
                selector="checkbox"
                text="Checkbox Selection"
                supportingText="This is a checkbox"
                name="vertical-basic-checkbox"
                value="checkbox-1"
              />
              <Typography>Checked:</Typography>
              <Selection
                checked={true}
                direction="vertical"
                selector="checkbox"
                text="Checkbox Selection"
                supportingText="This is a checkbox"
                name="vertical-basic-checkbox"
                value="checkbox-1"
              />
              <Typography>Disabled:</Typography>
              <Selection
                direction="vertical"
                disabled={true}
                selector="checkbox"
                text="Checkbox Selection"
                supportingText="This is a checkbox"
                name="vertical-basic-checkbox"
                value="checkbox-1"
              />
              <Typography>Readonly:</Typography>
              <Selection
                direction="vertical"
                readonly={true}
                selector="checkbox"
                text="Checkbox Selection"
                supportingText="This is a checkbox"
                name="vertical-basic-checkbox"
                value="checkbox-1"
              />
            </ItemContent>
          </SectionItem>
        </ItemList>
      </Section>
      <Section title="With Image:">
        <ItemList>
          <SectionItem label="Text Only:">
            <ItemContent>
              <Typography>Radio:</Typography>
              <Selection
                direction="vertical"
                image="https://rytass.com/logo.png"
                selector="radio"
                text="Radio Selection"
                supportingText="This is a radio button"
                name="vertical-image-radio"
                value="radio-1"
              />
              <Typography>Checked:</Typography>
              <Selection
                checked={true}
                direction="vertical"
                image="https://rytass.com/logo.png"
                selector="radio"
                text="Radio Selection"
                supportingText="This is a radio button"
                name="vertical-image-radio"
                value="radio-1"
              />
              <Typography>Disabled:</Typography>
              <Selection
                direction="vertical"
                disabled={true}
                image="https://rytass.com/logo.png"
                selector="radio"
                text="Radio Selection"
                supportingText="This is a radio button"
                name="vertical-image-radio"
                value="radio-1"
              />
              <Typography>Readonly:</Typography>
              <Selection
                direction="vertical"
                image="https://rytass.com/logo.png"
                readonly={true}
                selector="radio"
                text="Radio Selection"
                supportingText="This is a radio button"
                name="vertical-image-radio"
                value="radio-1"
              />
            </ItemContent>
            <ItemContent>
              <Typography>Unchecked:</Typography>
              <Selection
                direction="vertical"
                image="https://rytass.com/logo.png"
                selector="checkbox"
                text="Checkbox Selection"
                supportingText="This is a checkbox"
                name="vertical-image-checkbox"
                value="checkbox-1"
              />
              <Typography>Checked:</Typography>
              <Selection
                checked={true}
                direction="vertical"
                image="https://rytass.com/logo.png"
                selector="checkbox"
                text="Checkbox Selection"
                supportingText="This is a checkbox"
                name="vertical-image-checkbox"
                value="checkbox-1"
              />
              <Typography>Disabled:</Typography>
              <Selection
                direction="vertical"
                disabled={true}
                image="https://rytass.com/logo.png"
                selector="checkbox"
                text="Checkbox Selection"
                supportingText="This is a checkbox"
                name="vertical-image-checkbox"
                value="checkbox-1"
              />
              <Typography>Readonly:</Typography>
              <Selection
                direction="vertical"
                image="https://rytass.com/logo.png"
                readonly={true}
                selector="checkbox"
                text="Checkbox Selection"
                supportingText="This is a checkbox"
                name="vertical-image-checkbox"
                value="checkbox-1"
              />
            </ItemContent>
          </SectionItem>
        </ItemList>
      </Section>
      <Section title="Multiple Items:">
        <form onSubmit={(event) => event.preventDefault()}>
          <ItemList>
            <SectionItem direction="column" label="Radios:">
              <ItemContent>
                <Typography>Multiple Radios:</Typography>
                <Selection
                  defaultChecked
                  direction="vertical"
                  name="vertical-multiple-radio-three"
                  selector="radio"
                  supportingText="First option"
                  text="Radio Option 1"
                  value="radio-1"
                />
                <Selection
                  direction="vertical"
                  name="vertical-multiple-radio-three"
                  selector="radio"
                  supportingText="Second option"
                  text="Radio Option 2"
                  value="radio-2"
                />
                <Selection
                  direction="vertical"
                  name="vertical-multiple-radio-three"
                  selector="radio"
                  supportingText="Third option"
                  text="Radio Option 3"
                  value="radio-3"
                />
              </ItemContent>
            </SectionItem>
            <SectionItem direction="column" label="Checkboxes:">
              <ItemContent>
                <Typography>Multiple Checkboxes:</Typography>
                <Selection
                  defaultChecked
                  direction="vertical"
                  name="vertical-multiple-checkbox-three"
                  selector="checkbox"
                  supportingText="First checkbox"
                  text="Checkbox Option 1"
                  value="checkbox-1"
                />
                <Selection
                  direction="vertical"
                  name="vertical-multiple-checkbox-three"
                  selector="checkbox"
                  supportingText="Second checkbox"
                  text="Checkbox Option 2"
                  value="checkbox-2"
                />
                <Selection
                  direction="vertical"
                  name="vertical-multiple-checkbox-three"
                  selector="checkbox"
                  supportingText="Third checkbox"
                  text="Checkbox Option 3"
                  value="checkbox-3"
                />
              </ItemContent>
            </SectionItem>
          </ItemList>
        </form>
      </Section>
    </>
  ),
};

export const SelectionGroupBasic: Story = {
  render: () => (
    <>
      <Section title="Radio Group:">
        <ItemList>
          <SectionItem direction="column" label="Basic Radio Group:">
            <ItemContent>
              <SelectionGroup>
                <Selection
                  defaultChecked
                  name="plan-selection"
                  selector="radio"
                  supportingText="適合A方案"
                  text="A方案"
                  value="Aplan"
                />
                <Selection
                  name="plan-selection"
                  selector="radio"
                  supportingText="適合B方案"
                  text="B方案"
                  value="Bplan"
                />
                <Selection
                  name="plan-selection"
                  selector="radio"
                  supportingText="適合C方案"
                  text="C方案"
                  value="Cplan"
                />
                <Selection
                  name="plan-selection"
                  selector="radio"
                  supportingText="適合D方案"
                  text="D方案"
                  value="Dplan"
                />
                <Selection
                  name="plan-selection"
                  selector="radio"
                  supportingText="適合E方案"
                  text="E方案"
                  value="Eplan"
                />
                <Selection
                  name="plan-selection"
                  selector="radio"
                  supportingText="適合F方案"
                  text="F方案"
                  value="Fplan"
                />
                <Selection
                  name="plan-selection"
                  selector="radio"
                  supportingText="適合G方案"
                  text="G方案"
                  value="Gplan"
                />
              </SelectionGroup>
            </ItemContent>
          </SectionItem>
          <SectionItem direction="column" label="Checkbox Group:">
            <ItemContent>
              <SelectionGroup>
                <Selection
                  defaultChecked
                  name="interest-selection"
                  selector="checkbox"
                  supportingText="適合A方案"
                  text="A方案"
                  value="Aplan"
                />
                <Selection
                  name="interest-selection"
                  selector="checkbox"
                  supportingText="適合B方案"
                  text="B方案"
                  value="Bplan"
                />
                <Selection
                  name="interest-selection"
                  selector="checkbox"
                  supportingText="適合C方案"
                  text="C方案"
                  value="Cplan"
                />
                <Selection
                  name="interest-selection"
                  selector="checkbox"
                  supportingText="適合D方案"
                  text="D方案"
                  value="Eplan"
                />
                <Selection
                  name="interest-selection"
                  selector="checkbox"
                  supportingText="適合E方案"
                  text="E方案"
                  value="Fplan"
                />
                <Selection
                  name="interest-selection"
                  selector="checkbox"
                  supportingText="適合F方案"
                  text="F方案"
                  value="Gplan"
                />
                <Selection
                  name="interest-selection"
                  selector="checkbox"
                  supportingText="適合G方案"
                  text="G方案"
                  value="Hplan"
                />
              </SelectionGroup>
            </ItemContent>
          </SectionItem>
        </ItemList>
      </Section>
      <Section title="With Image:">
        <ItemList>
          <SectionItem direction="column" label="Radio Group with Image:">
            <ItemContent>
              <SelectionGroup>
                <Selection
                  defaultChecked
                  image="https://rytass.com/logo.png"
                  name="plan-selection-image"
                  selector="radio"
                  supportingText="適合A方案"
                  text="A方案"
                  value="Aplan"
                />
                <Selection
                  image="https://rytass.com/logo.png"
                  name="plan-selection-image"
                  selector="radio"
                  supportingText="適合B方案"
                  text="B方案"
                  value="Bplan"
                />
                <Selection
                  image="https://rytass.com/logo.png"
                  name="plan-selection-image"
                  selector="radio"
                  supportingText="適合C方案"
                  text="C方案"
                  value="Cplan"
                />
                <Selection
                  image="https://rytass.com/logo.png"
                  name="plan-selection-image"
                  selector="radio"
                  supportingText="適合D方案"
                  text="D方案"
                  value="Dplan"
                />
                <Selection
                  image="https://rytass.com/logo.png"
                  name="plan-selection-image"
                  selector="radio"
                  supportingText="適合E方案"
                  text="E方案"
                  value="Eplan"
                />
                <Selection
                  image="https://rytass.com/logo.png"
                  name="plan-selection-image"
                  selector="radio"
                  supportingText="適合F方案"
                  text="F方案"
                  value="Fplan"
                />
                <Selection
                  image="https://rytass.com/logo.png"
                  name="plan-selection-image"
                  selector="radio"
                  supportingText="適合G方案"
                  text="G方案"
                  value="Gplan"
                />
              </SelectionGroup>
            </ItemContent>
          </SectionItem>
        </ItemList>
      </Section>
      <Section title="States:">
        <ItemList>
          <SectionItem direction="column" label="Required:">
            <ItemContent>
              <SelectionGroup>
                <Selection
                  name="required-selection"
                  selector="radio"
                  supportingText="適合A方案"
                  text="A方案"
                  value="Aplan"
                />
                <Selection
                  name="required-selection"
                  selector="radio"
                  supportingText="適合B方案"
                  text="B方案"
                  value="Bplan"
                />
              </SelectionGroup>
            </ItemContent>
          </SectionItem>
          <SectionItem direction="column" label="Disabled:">
            <ItemContent>
              <SelectionGroup>
                <Selection
                  name="disabled-selection"
                  selector="radio"
                  supportingText="適合A方案"
                  text="選項 1"
                  value="Aplan"
                />
                <Selection
                  name="disabled-selection"
                  selector="radio"
                  supportingText="適合B方案"
                  text="B方案"
                  value="Bplan"
                />
                <Selection
                  name="disabled-selection"
                  selector="radio"
                  supportingText="適合C方案"
                  text="C方案"
                  value="Cplan"
                />
                <Selection
                  name="disabled-selection"
                  selector="radio"
                  supportingText="適合D方案"
                  text="D方案"
                  value="Dplan"
                />
                <Selection
                  name="disabled-selection"
                  selector="radio"
                  supportingText="適合E方案"
                  text="E方案"
                  value="Eplan"
                />
                <Selection
                  name="disabled-selection"
                  selector="radio"
                  supportingText="適合F方案"
                  text="F方案"
                  value="Fplan"
                />
                <Selection
                  name="disabled-selection"
                  selector="radio"
                  supportingText="適合G方案"
                  text="G方案"
                  value="Gplan"
                />
              </SelectionGroup>
            </ItemContent>
          </SectionItem>
        </ItemList>
      </Section>
      <Section title="Different Sizes:">
        <ItemList>
          <SectionItem direction="column" label="Horizontal Base:">
            <ItemContent>
              <SelectionGroup>
                <Selection
                  name="horizontal-base-selection"
                  selector="radio"
                  supportingText="適合A方案"
                  text="A方案"
                  value="Aplan"
                />
                <Selection
                  name="horizontal-base-selection"
                  selector="radio"
                  supportingText="適合B方案"
                  text="B方案"
                  value="Bplan"
                />
                <Selection
                  name="horizontal-base-selection"
                  selector="radio"
                  supportingText="適合C方案"
                  text="C方案"
                  value="Cplan"
                />
                <Selection
                  name="horizontal-base-selection"
                  selector="radio"
                  supportingText="適合D方案"
                  text="D方案"
                  value="Dplan"
                />
                <Selection
                  name="horizontal-base-selection"
                  selector="radio"
                  supportingText="適合E方案"
                  text="E方案"
                  value="Eplan"
                />
                <Selection
                  name="horizontal-base-selection"
                  selector="radio"
                  supportingText="適合F方案"
                  text="F方案"
                  value="Fplan"
                />
                <Selection
                  name="horizontal-base-selection"
                  selector="radio"
                  supportingText="適合G方案"
                  text="G方案"
                  value="Gplan"
                />
              </SelectionGroup>
            </ItemContent>
          </SectionItem>
          <SectionItem direction="column" label="Vertical:">
            <ItemContent>
              <SelectionGroup>
                <Selection
                  name="vertical-selection"
                  selector="radio"
                  supportingText="適合A方案"
                  text="A方案"
                  value="Aplan"
                />
                <Selection
                  name="vertical-selection"
                  selector="radio"
                  supportingText="適合B方案"
                  text="B方案"
                  value="Bplan"
                />
                <Selection
                  name="vertical-selection"
                  selector="radio"
                  supportingText="適合C方案"
                  text="C方案"
                  value="Cplan"
                />
                <Selection
                  name="vertical-selection"
                  selector="radio"
                  supportingText="適合D方案"
                  text="D方案"
                  value="Dplan"
                />
                <Selection
                  name="vertical-selection"
                  selector="radio"
                  supportingText="適合E方案"
                  text="E方案"
                  value="Eplan"
                />
                <Selection
                  name="vertical-selection"
                  selector="radio"
                  supportingText="適合F方案"
                  text="F方案"
                  value="Fplan"
                />
                <Selection
                  name="vertical-selection"
                  selector="radio"
                  supportingText="適合G方案"
                  text="G方案"
                  value="Gplan"
                />
              </SelectionGroup>
            </ItemContent>
          </SectionItem>
        </ItemList>
      </Section>
    </>
  ),
};

export const SelectionGroupWithOptions: Story = {
  render: () => (
    <>
      <Section title="Using Selections Array:">
        <ItemList>
          <SectionItem direction="column" label="Radio Group with Selections:">
            <ItemContent>
              <SelectionGroup
                selections={[
                  {
                    defaultChecked: true,
                    name: 'plan-options',
                    selector: 'radio',
                    supportingText: '適合個人使用',
                    text: '基本方案',
                    value: 'basic',
                  },
                  {
                    name: 'plan-options',
                    selector: 'radio',
                    supportingText: '適合小型團隊',
                    text: '專業方案',
                    value: 'professional',
                  },
                  {
                    name: 'plan-options',
                    selector: 'radio',
                    supportingText: '適合大型企業',
                    text: '企業方案',
                    value: 'enterprise',
                  },
                  {
                    name: 'plan-options',
                    selector: 'radio',
                    supportingText: '適合超大型企業',
                    text: '旗艦方案',
                    value: 'enterprise-plus',
                  },
                ]}
              />
            </ItemContent>
          </SectionItem>
          <SectionItem direction="column" label="Checkbox Group with Selections:">
            <ItemContent>
              <SelectionGroup
                selections={[
                  {
                    defaultChecked: true,
                    name: 'interest-options',
                    selector: 'checkbox',
                    supportingText: '閱讀相關內容',
                    text: '閱讀',
                    value: 'reading',
                  },
                  {
                    name: 'interest-options',
                    selector: 'checkbox',
                    supportingText: '程式開發相關',
                    text: '程式開發',
                    value: 'coding',
                  },
                  {
                    name: 'interest-options',
                    selector: 'checkbox',
                    supportingText: '運動健身相關',
                    text: '運動',
                    value: 'sports',
                  },
                  {
                    name: 'interest-options',
                    selector: 'checkbox',
                    supportingText: '音樂相關',
                    text: '音樂',
                    value: 'music',
                  },
                ]}
              />
            </ItemContent>
          </SectionItem>
        </ItemList>
      </Section>
      <Section title="With Image:">
        <ItemList>
          <SectionItem direction="column" label="Radio Group with Image:">
            <ItemContent>
              <SelectionGroup
                selections={[
                  {
                    defaultChecked: true,
                    image: 'https://rytass.com/logo.png',
                    name: 'plan-image-options',
                    selector: 'radio',
                    supportingText: '適合個人使用',
                    text: '基本方案',
                    value: 'basic',
                  },
                  {
                    image: 'https://rytass.com/logo.png',
                    name: 'plan-image-options',
                    selector: 'radio',
                    supportingText: '適合小型團隊',
                    text: '專業方案',
                    value: 'professional',
                  },
                  {
                    image: 'https://rytass.com/logo.png',
                    name: 'plan-image-options',
                    selector: 'radio',
                    supportingText: '適合大型企業',
                    text: '企業方案',
                    value: 'enterprise',
                  },
                ]}
              />
            </ItemContent>
          </SectionItem>
        </ItemList>
      </Section>
      <Section title="With Different States:">
        <ItemList>
          <SectionItem direction="column" label="Mixed States:">
            <ItemContent>
              {(() => {
                const [value, setValue] = useState('option-1');

                return (
                  <SelectionGroup
                    selections={[
                      {
                        checked: value === 'option-1',
                        disabled: true,
                        name: 'mixed-states',
                        onChange: (e) => setValue(e.target.value),
                        selector: 'radio',
                        supportingText: '已選取但停用',
                        text: '選項 1',
                        value: 'option-1',
                      },
                      {
                        checked: value === 'option-2',
                        disabled: true,
                        name: 'mixed-states',
                        onChange: (e) => setValue(e.target.value),
                        selector: 'radio',
                        supportingText: '未選取但停用',
                        text: '選項 2',
                        value: 'option-2',
                      },
                      {
                        checked: value === 'option-3',
                        name: 'mixed-states',
                        onChange: (e) => setValue(e.target.value),
                        selector: 'radio',
                        supportingText: '可選取的選項',
                        text: '選項 3',
                        value: 'option-3',
                      },
                      {
                        checked: value === 'option-4',
                        name: 'mixed-states',
                        onChange: (e) => setValue(e.target.value),
                        selector: 'radio',
                        supportingText: '可選取的選項',
                        text: '選項 4',
                        value: 'option-4',
                      },
                    ]}
                  />
                );
              })()}
            </ItemContent>
          </SectionItem>
          <SectionItem direction="column" label="Vertical Direction:">
            <ItemContent>
              <SelectionGroup
                selections={[
                  {
                    defaultChecked: true,
                    direction: 'vertical',
                    name: 'vertical-options',
                    selector: 'radio',
                    supportingText: '垂直排列選項 1',
                    text: '選項 1',
                    value: 'option-1',
                  },
                  {
                    direction: 'vertical',
                    name: 'vertical-options',
                    selector: 'radio',
                    supportingText: '垂直排列選項 2',
                    text: '選項 2',
                    value: 'option-2',
                  },
                  {
                    direction: 'vertical',
                    name: 'vertical-options',
                    selector: 'radio',
                    supportingText: '垂直排列選項 3',
                    text: '選項 3',
                    value: 'option-3',
                  },
                ]}
              />
            </ItemContent>
          </SectionItem>
        </ItemList>
      </Section>
    </>
  ),
};