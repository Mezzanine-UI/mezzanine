import { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';
import { Meta, StoryObj } from '@storybook/react-webpack5';
import { useCallback, useMemo, useState } from 'react';

import { DotVerticalIcon } from '@mezzanine-ui/icons';

import Dropdown from '.';
import AutoComplete from '../AutoComplete';
import Button from '../Button';
import Icon from '../Icon';
import { SelectValue } from '../Select/typings';
import Tag from '../Tag';
import TextField from '../TextField';

export default {
  title: 'Internal/Dropdown',
  component: Dropdown,
} satisfies Meta<typeof Dropdown>;

type Story = StoryObj<typeof Dropdown>;

const simpleOptions: DropdownOption[] = [
  { name: '選項 1', id: 'option-1' },
  { name: '選項 2', id: 'option-2' },
  { name: '選項 3', id: 'option-3' },
];

const usStatesOptions: DropdownOption[] = [
  { id: 'al', name: 'Alabama' },
  { id: 'ak', name: 'Alaska' },
  { id: 'as', name: 'American Samoa' },
  { id: 'az', name: 'Arizona' },
  { id: 'ar', name: 'Arkansas' },
  { id: 'ca', name: 'California' },
  { id: 'co', name: 'Colorado' },
  { id: 'ct', name: 'Connecticut' },
  { id: 'de', name: 'Delaware' },
  { id: 'dc', name: 'District of Columbia' },
  { id: 'fl', name: 'Florida' },
  { id: 'ga', name: 'Georgia' },
  { id: 'gm', name: 'Guam' },
  { id: 'hi', name: 'Hawaii' },
  { id: 'id', name: 'Idaho' },
  { id: 'il', name: 'Illinois' },
  { id: 'in', name: 'Indiana' },
  { id: 'ia', name: 'Iowa' },
  { id: 'ks', name: 'Kansas' },
  { id: 'ky', name: 'Kentucky' },
  { id: 'la', name: 'Louisiana' },
  { id: 'me', name: 'Maine' },
  { id: 'md', name: 'Maryland' },
  { id: 'ma', name: 'Massachusetts' },
  { id: 'mi', name: 'Michigan' },
  { id: 'mn', name: 'Minnesota' },
  { id: 'ms', name: 'Mississippi' },
  { id: 'mo', name: 'Missouri' },
  { id: 'mt', name: 'Montana' },
  { id: 'ne', name: 'Nebraska' },
  { id: 'nv', name: 'Nevada' },
  { id: 'nh', name: 'New Hampshire' },
  { id: 'nj', name: 'New Jersey' },
  { id: 'nm', name: 'New Mexico' },
  { id: 'ny', name: 'New York' },
  { id: 'nc', name: 'North Carolina' },
  { id: 'nd', name: 'North Dakota' },
  { id: 'mp', name: 'Northern Marianas Islands' },
  { id: 'oh', name: 'Ohio' },
  { id: 'ok', name: 'Oklahoma' },
  { id: 'or', name: 'Oregon' },
  { id: 'pa', name: 'Pennsylvania' },
  { id: 'pr', name: 'Puerto Rico' },
  { id: 'ri', name: 'Rhode Island' },
  { id: 'sc', name: 'South Carolina' },
  { id: 'sd', name: 'South Dakota' },
  { id: 'tn', name: 'Tennessee' },
  { id: 'tx', name: 'Texas' },
  { id: 'ut', name: 'Utah' },
  { id: 'vt', name: 'Vermont' },
  { id: 'va', name: 'Virginia' },
  { id: 'vi', name: 'Virgin Islands' },
  { id: 'wa', name: 'Washington' },
  { id: 'wv', name: 'West Virginia' },
  { id: 'wi', name: 'Wisconsin' },
  { id: 'wy', name: 'Wyoming' },
];

export const Playground: Story = {
  argTypes: {
    showDropdownActions: {
      control: 'boolean',
      defaultValue: false,
    },
    type: {
      control: 'select',
      options: ['default', 'checkbox', 'tree'],
    },
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right', 'top-start', 'bottom-start', 'left-start', 'right-start', 'top-end', 'bottom-end', 'left-end', 'right-end', 'auto', 'auto-start', 'auto-end'],
    }
  },
  args: {
    disabled: false,
    options: simpleOptions,
    placement: 'bottom',
    showDropdownActions: false,
    type: 'default',
  },
  render: (args) => {
    const PlaygroundComponent = () => {
      const [value, setValue] = useState<string | undefined>(undefined);
      const selectedLabel = useMemo(() => {
        const matched = simpleOptions.find((option) => option.id === value);
        return matched?.name ?? '請選擇';
      }, [value]);

      return (
        <Dropdown
          {...args}
          value={value}
          onSelect={(option) => {
            setValue(option.id);
          }}
        >
          <Button variant="base-primary">{selectedLabel}</Button>
        </Dropdown>
      );
    };

    return <PlaygroundComponent />;
  },
};

export const AutoCompleteExample: Story = {
  render: () => {
    const ExampleComponent = () => {
      const [selectedOption, setSelectedOption] = useState<SelectValue | null>(
        null,
      );

      const options: SelectValue[] = usStatesOptions.map((option) => ({
        id: option.id,
        name: option.name,
      }));

      const handleChange = (newValue: SelectValue | null) => {
        setSelectedOption(newValue);
      };

      return (
        <div style={{ width: 320 }}>
          <Tag label="Combobox with AutoComplete" />
          <div style={{ marginTop: 12 }}>
            <AutoComplete
              fullWidth
              menuMaxHeight={300}
              mode="single"
              onChange={handleChange}
              options={options}
              placeholder="Type or select a state..."
              value={selectedOption}
            />
          </div>
        </div>
      );
    };

    return <ExampleComponent />;
  },
};

export const Inside: Story = {
  render: () => {
    const ExampleComponent = () => {
      const [inputValue, setInputValue] = useState('');
      const [open, setOpen] = useState(false);

      const filteredOptions = useMemo(() => {
        const keyword = inputValue.trim().toLowerCase();
        if (!keyword) return usStatesOptions;
        return usStatesOptions.filter((option) =>
          option.name.toLowerCase().includes(keyword),
        );
      }, [inputValue]);

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            maxWidth: '400px',
          }}
        >
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flexDirection: 'column' }}>
              <div style={{ flex: 1 }}>
                <Dropdown
                  inputPosition="inside"
                  isMatchInputValue
                  maxHeight={360}
                  onSelect={(option) => {
                    setInputValue(option.name);
                  }}
                  onVisibilityChange={setOpen}
                  open={open}
                  options={filteredOptions}
                  followText={inputValue}
                  sameWidth
                >
                  <TextField>
                    <input
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="請選擇或輸入..."
                      type="text"
                      value={inputValue}
                    />
                  </TextField>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      );
    };

    return <ExampleComponent />;
  },
};

export const PlacementExample: Story = {
  render: () => {
    const PlacementItem = ({
      label,
      placement,
    }: {
      label: string;
      placement: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'bottom-start' | 'left-start' | 'right-start' | 'top-end' | 'bottom-end' | 'left-end' | 'right-end';
    }) => {
      const [value, setValue] = useState<string | undefined>(undefined);
      const selectedLabel = useMemo(() => {
        const matched = simpleOptions.find((option) => option.id === value);
        return matched?.name ?? <Icon icon={DotVerticalIcon} />;
      }, [value]);

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          width: 160,
        }}>
          <Tag label={label} />
          <Dropdown
            options={simpleOptions}
            placement={placement}
            value={value}
            disablePortal={false}
            onSelect={(option) => {
              setValue(option.id);
            }}
          >
            <Button variant="base-secondary" size="minor">
              {selectedLabel}
            </Button>
          </Dropdown>
        </div>
      );
    };

    const ExampleComponent = () => {
      const placementMap: Record<string, { label: string; placement: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'bottom-start' | 'left-start' | 'right-start' | 'top-end' | 'bottom-end' | 'left-end' | 'right-end' }> = {
        'top-start': { label: 'Top Start', placement: 'top-start' },
        'top': { label: 'Top', placement: 'top' },
        'top-end': { label: 'Top End', placement: 'top-end' },
        'left-start': { label: 'Left Start', placement: 'left-start' },
        'left': { label: 'Left', placement: 'left' },
        'left-end': { label: 'Left End', placement: 'left-end' },
        'right-start': { label: 'Right Start', placement: 'right-start' },
        'right': { label: 'Right', placement: 'right' },
        'right-end': { label: 'Right End', placement: 'right-end' },
        'bottom-start': { label: 'Bottom Start', placement: 'bottom-start' },
        'bottom': { label: 'Bottom', placement: 'bottom' },
        'bottom-end': { label: 'Bottom End', placement: 'bottom-end' },
      };

      return (
        <div
          style={{
            display: 'inline-grid',
            gap: 30,
            gridAutoRows: 'minmax(min-content, max-content)',
            gridTemplateColumns: 'repeat(5, max-content)',
            justifyContent: 'center',
            marginTop: 50,
            width: '100%',
          }}
        >
          <div />
          <PlacementItem label={placementMap['top-start'].label} placement={placementMap['top-start'].placement} />
          <PlacementItem label={placementMap['top'].label} placement={placementMap['top'].placement} />
          <PlacementItem label={placementMap['top-end'].label} placement={placementMap['top-end'].placement} />
          <div />
          <PlacementItem label={placementMap['left-start'].label} placement={placementMap['left-start'].placement} />
          <div />
          <div />
          <div />
          <PlacementItem label={placementMap['right-start'].label} placement={placementMap['right-start'].placement} />
          <PlacementItem label={placementMap['left'].label} placement={placementMap['left'].placement} />
          <div />
          <div />
          <div />
          <PlacementItem label={placementMap['right'].label} placement={placementMap['right'].placement} />
          <PlacementItem label={placementMap['left-end'].label} placement={placementMap['left-end'].placement} />
          <div />
          <div />
          <div />
          <PlacementItem label={placementMap['right-end'].label} placement={placementMap['right-end'].placement} />
          <div />
          <PlacementItem label={placementMap['bottom-start'].label} placement={placementMap['bottom-start'].placement} />
          <PlacementItem label={placementMap['bottom'].label} placement={placementMap['bottom'].placement} />
          <PlacementItem label={placementMap['bottom-end'].label} placement={placementMap['bottom-end'].placement} />
          <div />
        </div>
      );
    };

    return <ExampleComponent />;
  },
};

export const ControlledVisibility: Story = {
  render: () => {
    const ExampleComponent = () => {
      const [open, setOpen] = useState(false);
      const [value, setValue] = useState<string | undefined>(undefined);

      const selectedLabel = useMemo(() => {
        const matched = simpleOptions.find((option) => option.id === value);
        return matched?.name ?? '請選擇';
      }, [value]);

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 240 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              onMouseDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                setOpen(true);
              }}
              size="minor"
              variant="base-primary"
            >
              開啟
            </Button>
            <Button
              onMouseDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                setOpen(false);
              }}
              size="minor"
              variant="base-secondary"
            >
              關閉
            </Button>
          </div>
          <Dropdown
            onSelect={(option) => {
              // Close the dropdown when an option is selected
              setValue(option.id);
              setOpen(false);
            }}
            onVisibilityChange={setOpen}
            open={open}
            options={simpleOptions}
            value={value}
          >
            <Button variant="base-primary">{selectedLabel}</Button>
          </Dropdown>
        </div>
      );
    };

    return <ExampleComponent />;
  },
};

export const LoadMoreOnReachBottom: Story = {
  render: () => {
    const ExampleComponent = () => {
      const [options, setOptions] = useState<DropdownOption[]>(() =>
        usStatesOptions.slice(0, 10)
      );
      const [value, setValue] = useState<string | undefined>(undefined);
      const [loading, setLoading] = useState(false);
      const [hasMore, setHasMore] = useState(true);
      const [hasReachedBottom, setHasReachedBottom] = useState(false);

      const selectedLabel = useMemo(() => {
        const matched = options.find((option) => option.id === value);
        return matched?.name ?? '請選擇';
      }, [value, options]);

      const loadMore = useCallback(() => {
        if (loading || !hasMore) return;

        setLoading(true);

        // 模擬異步加載數據
        setTimeout(() => {
          const currentCount = options.length;
          const nextBatch = usStatesOptions.slice(currentCount, currentCount + 10);

          if (nextBatch.length === 0) {
            setHasMore(false);
          } else {
            setOptions((prev) => [...prev, ...nextBatch]);
          }

          setLoading(false);
          setHasReachedBottom(false);
        }, 1000);
      }, [loading, hasMore, options.length]);

      const handleReachBottom = useCallback(() => {
        if (!hasReachedBottom && !loading) {
          setHasReachedBottom(true);
          loadMore();
        }
      }, [hasReachedBottom, loading, loadMore]);

      const handleLeaveBottom = useCallback(() => {
        setHasReachedBottom(false);
      }, []);

      // 在載入時，暫時清空選項以顯示 DropdownStatus 的 loading
      const displayOptions = loading ? [] : options;

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
          <Tag label={`已載入 ${options.length} / ${usStatesOptions.length} 個選項`} />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Dropdown
              maxHeight={300}
              onReachBottom={handleReachBottom}
              onLeaveBottom={handleLeaveBottom}
              onSelect={(option) => {
                setValue(option.id);
              }}
              options={displayOptions}
              status={loading ? 'loading' : undefined}
              loadingText="載入中..."
              value={value}
              placement="right-start"
            >
              <Button variant="base-primary">{selectedLabel}</Button>
            </Dropdown>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {loading && <div>正在載入更多選項...</div>}
            {!hasMore && <div>已載入所有選項</div>}
          </div>
        </div>
      );
    };

    return <ExampleComponent />;
  },
};


