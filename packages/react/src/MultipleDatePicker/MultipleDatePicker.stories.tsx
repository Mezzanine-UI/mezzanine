import { Meta, StoryObj } from '@storybook/react-webpack5';
import { DateType } from '@mezzanine-ui/core/calendar';
import { useState } from 'react';
import MultipleDatePicker from './MultipleDatePicker';
import Typography from '../Typography';
import { CalendarConfigProviderMoment } from '../Calendar';

const meta: Meta<typeof MultipleDatePicker> = {
  title: 'Data Entry/MultipleDatePicker',
  component: MultipleDatePicker,
};

export default meta;

type Story = StoryObj<typeof MultipleDatePicker>;

export const Playground: Story = {
  args: {
    clearable: true,
    disabled: false,
    error: false,
    fullWidth: false,
    overflowStrategy: 'counter',
    placeholder: 'Select dates',
    readOnly: false,
    size: 'main',
  },
  argTypes: {
    overflowStrategy: {
      control: {
        type: 'radio',
      },
      options: ['counter', 'wrap'],
    },
    size: {
      control: {
        type: 'radio',
      },
      options: ['main', 'sub'],
    },
  },
  render: function Render(args) {
    const [value, setValue] = useState<DateType[]>([]);

    return (
      <CalendarConfigProviderMoment>
        <Typography style={{ margin: '0 0 12px 0' }} variant="h3">
          {`Selected: ${value.length} date(s)`}
        </Typography>
        <Typography style={{ margin: '0 0 12px 0' }} variant="body">
          {value.length > 0 ? value.join(', ') : 'No dates selected'}
        </Typography>
        <MultipleDatePicker {...args} onChange={setValue} value={value} />
      </CalendarConfigProviderMoment>
    );
  },
};

export const Basic: Story = {
  render: function Render() {
    const containerStyle = { margin: '0 0 24px 0' };
    const typoStyle = { margin: '0 0 12px 0' };
    const [value, setValue] = useState<DateType[]>([]);

    return (
      <CalendarConfigProviderMoment>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Basic Multiple Date Picker
          </Typography>
          <Typography style={typoStyle} variant="body">
            Click on dates to select/deselect. Click Confirm to apply changes.
          </Typography>
          <MultipleDatePicker
            onChange={setValue}
            placeholder="Select multiple dates"
            value={value}
          />
        </div>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Selected dates:
          </Typography>
          {value.length > 0 ? (
            <ul>
              {value.map((date, index) => (
                <li key={index}>{String(date)}</li>
              ))}
            </ul>
          ) : (
            <Typography style={typoStyle} variant="caption">
              No dates selected
            </Typography>
          )}
        </div>
      </CalendarConfigProviderMoment>
    );
  },
};

export const MaxSelections: Story = {
  render: function Render() {
    const containerStyle = { margin: '0 0 24px 0' };
    const typoStyle = { margin: '0 0 12px 0' };
    const [value, setValue] = useState<DateType[]>([]);

    return (
      <CalendarConfigProviderMoment>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Max 3 Selections
          </Typography>
          <Typography style={typoStyle} variant="body">
            You can only select up to 3 dates. Once reached, other dates become
            disabled.
          </Typography>
          <MultipleDatePicker
            maxSelections={3}
            onChange={setValue}
            placeholder="Select up to 3 dates"
            value={value}
          />
        </div>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Selected: {value.length}/3
          </Typography>
        </div>
      </CalendarConfigProviderMoment>
    );
  },
};

export const OverflowStrategies: Story = {
  render: function Render() {
    const containerStyle = { margin: '0 0 24px 0' };
    const typoStyle = { margin: '0 0 12px 0' };
    const [counterValue, setCounterValue] = useState<DateType[]>([
      '2025-01-01',
      '2025-01-05',
      '2025-01-10',
      '2025-01-15',
      '2025-01-20',
    ]);
    const [wrapValue, setWrapValue] = useState<DateType[]>([
      '2025-01-01',
      '2025-01-05',
      '2025-01-10',
      '2025-01-15',
      '2025-01-20',
    ]);

    return (
      <CalendarConfigProviderMoment>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Overflow Strategy: counter (default)
          </Typography>
          <Typography style={typoStyle} variant="body">
            Shows visible tags with a counter for hidden ones.
          </Typography>
          <div style={{ maxWidth: 300 }}>
            <MultipleDatePicker
              onChange={setCounterValue}
              overflowStrategy="counter"
              value={counterValue}
            />
          </div>
        </div>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Overflow Strategy: wrap
          </Typography>
          <Typography style={typoStyle} variant="body">
            Wraps tags to multiple lines.
          </Typography>
          <div style={{ maxWidth: 300 }}>
            <MultipleDatePicker
              onChange={setWrapValue}
              overflowStrategy="wrap"
              value={wrapValue}
            />
          </div>
        </div>
      </CalendarConfigProviderMoment>
    );
  },
};

export const States: Story = {
  render: function Render() {
    const containerStyle = { margin: '0 0 24px 0' };
    const typoStyle = { margin: '0 0 12px 0' };
    const sampleValue: DateType[] = ['2025-01-01', '2025-01-15'];

    return (
      <CalendarConfigProviderMoment>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Disabled
          </Typography>
          <MultipleDatePicker
            disabled
            onChange={() => {}}
            value={sampleValue}
          />
        </div>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Read Only
          </Typography>
          <MultipleDatePicker
            onChange={() => {}}
            readOnly
            value={sampleValue}
          />
        </div>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Error
          </Typography>
          <MultipleDatePicker error onChange={() => {}} value={sampleValue} />
        </div>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Full Width
          </Typography>
          <MultipleDatePicker
            fullWidth
            onChange={() => {}}
            value={sampleValue}
          />
        </div>
      </CalendarConfigProviderMoment>
    );
  },
};

export const CustomActions: Story = {
  render: function Render() {
    const containerStyle = { margin: '0 0 24px 0' };
    const typoStyle = { margin: '0 0 12px 0' };
    const [value, setValue] = useState<DateType[]>([]);

    return (
      <CalendarConfigProviderMoment>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Custom Action Button Text
          </Typography>
          <Typography style={typoStyle} variant="body">
            Override confirm/cancel button text via actions prop.
          </Typography>
          <MultipleDatePicker
            actions={{
              primaryButtonProps: {
                children: '確認',
              },
              secondaryButtonProps: {
                children: '取消',
              },
            }}
            onChange={setValue}
            placeholder="選擇日期"
            value={value}
          />
        </div>
      </CalendarConfigProviderMoment>
    );
  },
};

export const DisabledDates: Story = {
  render: function Render() {
    const containerStyle = { margin: '0 0 24px 0' };
    const typoStyle = { margin: '0 0 12px 0' };
    const [value, setValue] = useState<DateType[]>([]);

    // Disable weekends
    const isDateDisabled = (date: DateType) => {
      const day = new Date(date as string).getDay();

      return day === 0 || day === 6;
    };

    return (
      <CalendarConfigProviderMoment>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Disabled Dates (Weekends)
          </Typography>
          <Typography style={typoStyle} variant="body">
            Weekends (Saturday and Sunday) are disabled.
          </Typography>
          <MultipleDatePicker
            isDateDisabled={isDateDisabled}
            onChange={setValue}
            placeholder="Select weekdays only"
            value={value}
          />
        </div>
      </CalendarConfigProviderMoment>
    );
  },
};
