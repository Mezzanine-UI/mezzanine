import { SelectionDirection, SelectionImageObjectFit, SelectionType } from '@mezzanine-ui/core/selection';
import { Meta, StoryObj } from '@storybook/react-webpack5';
import { ReactNode } from 'react';
import Selection, { SelectionProps } from '.';
import Tag from '../Tag';
import Typography from '../Typography';

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