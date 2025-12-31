import { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';
import { ChevronDownIcon } from '@mezzanine-ui/icons';
import { Meta, StoryObj } from '@storybook/react-webpack5';
import { ChangeEvent, useEffect, useId, useMemo, useRef, useState } from 'react';

import { DotVerticalIcon } from '@mezzanine-ui/icons';

import Dropdown from '.';
import Button from '../Button';
import Icon from '../Icon';
import Tag from '../Tag';
import TextField from '../TextField';
import { createDropdownKeydownHandler } from './dropdownKeydownHandler';

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
      const comboboxId = useId();
      const listboxId = `${comboboxId}-listbox`;
      const inputId = `${comboboxId}-input`;
      const [activeIndex, setActiveIndex] = useState<number | null>(null);
      const [inputValue, setInputValue] = useState('');
      const [isOpen, setIsOpen] = useState(false);
      const [_listboxHasVisualFocus, setListboxHasVisualFocus] = useState(false);
      const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
        null,
      );
      const comboboxRef = useRef<HTMLDivElement | null>(null);
      const inputRef = useRef<HTMLInputElement | null>(null);
      const isPointerDownRef = useRef(false);

      const filteredOptions = useMemo(() => {
        const keyword = inputValue.trim().toLowerCase();

        if (!keyword) {
          return usStatesOptions;
        }

        return usStatesOptions.filter((option) =>
          option.name.toLowerCase().startsWith(keyword),
        );
      }, [inputValue]);

      useEffect(() => {
        if (!filteredOptions.length) {
          setActiveIndex(null);
          return;
        }

        setActiveIndex((prev) => {
          if (prev === null) return 0;
          return Math.min(prev, filteredOptions.length - 1);
        });
      }, [filteredOptions]);

      useEffect(() => {
        if (!isOpen || activeIndex === null) return;

        requestAnimationFrame(() => {
          const activeOption = document.getElementById(
            `${listboxId}-option-${activeIndex}`,
          );

          activeOption?.scrollIntoView({ block: 'nearest' });
        });
      }, [activeIndex, isOpen, listboxId]);

      const activeDescendantId =
        activeIndex !== null && filteredOptions[activeIndex]
          ? `${listboxId}-option-${activeIndex}`
          : undefined;

      const openDropdown = () => {
        if (!isOpen) {
          comboboxRef.current?.click();
        }
      };

      const closeDropdown = () => {
        if (isOpen) {
          comboboxRef.current?.click();
        }
      };

      const toggleDropdown = () => {
        comboboxRef.current?.click();
      };

      const handleSetOpen = (open: boolean) => {
        if (open && !isOpen) {
          openDropdown();
        } else if (!open && isOpen) {
          closeDropdown();
        }
      };

      const handleSelect = (option: DropdownOption) => {
        setSelectedOption(option);
        setInputValue(option.name);
        setActiveIndex(null);
        closeDropdown();
        inputRef.current?.focus();
      };

      const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        setSelectedOption(null);
        openDropdown();
      };

      const handleInputMouseDown = () => {
        isPointerDownRef.current = true;
        requestAnimationFrame(() => {
          isPointerDownRef.current = false;
        });
      };

      const handleKeyDown = createDropdownKeydownHandler({
        activeIndex,
        onEnterSelect: handleSelect,
        onEscape: () => {
          closeDropdown();
          setActiveIndex(null);
        },
        open: isOpen,
        options: filteredOptions,
        setActiveIndex,
        setListboxHasVisualFocus,
        setOpen: handleSetOpen,
      });

      return (
        <div style={{ width: 320 }}>
          <Tag label="Combobox with AutoComplete" />
          <div style={{ marginTop: 12 }}>
            <Dropdown
              activeIndex={activeIndex}
              inputPosition="outside"
              mode="single"
              isMatchInputValue
              listboxId={listboxId}
              onClose={() => {
                setIsOpen(false);
                setActiveIndex(null);
              }}
              maxHeight={300}
              onItemHover={(index) => setActiveIndex(index)}
              onOpen={() => setIsOpen(true)}
              onSelect={handleSelect}
              options={filteredOptions}
              sameWidth
              value={selectedOption?.id}
            >
              <TextField
                active={isOpen}
                ref={comboboxRef}
                suffix={
                  <button
                    aria-controls={listboxId}
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    aria-label="States"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      toggleDropdown();
                      requestAnimationFrame(() => {
                        inputRef.current?.focus();
                      });
                    }}
                    style={{
                      alignItems: 'center',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      padding: 0,
                    }}
                    type="button"
                  >
                    <Icon
                      icon={ChevronDownIcon}
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    />
                  </button>
                }
              >
                {({ paddingClassName }) => (
                  <input
                    aria-activedescendant={activeDescendantId}
                    aria-autocomplete="list"
                    aria-controls={listboxId}
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    className={paddingClassName}
                    id={inputId}
                    onChange={handleInputChange}
                    onFocus={() => {
                      if (isPointerDownRef.current) return;
                      openDropdown();
                    }}
                    onKeyDown={handleKeyDown}
                    onMouseDown={handleInputMouseDown}
                    placeholder="Type or select a state..."
                    ref={inputRef}
                    role="combobox"
                    type="text"
                    value={inputValue}
                  />
                )}
              </TextField>
            </Dropdown>
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
      const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(null);

      const filteredOptions = useMemo(() => {
        const keyword = inputValue.trim().toLowerCase();
        if (!keyword) return usStatesOptions;
        return usStatesOptions.filter((option) =>
          option.name.toLowerCase().includes(keyword),
        );
      }, [inputValue]);

      return (
        <div style={{ maxWidth: 320 }}>
          <Dropdown
            inputPosition="inside"
            isMatchInputValue
            maxHeight={360}
            onSelect={(option) => {
              setSelectedOption(option);
              setInputValue(option.name);
            }}
            sameWidth
            options={filteredOptions}
          >
            <TextField
              suffix={
                selectedOption ? (
                  <Tag
                    color="primary"
                    label={selectedOption.name}
                    style={{ marginInlineEnd: 8 }}
                  />
                ) : null
              }
            >
              {({ paddingClassName }: { paddingClassName: string }) => (
                <input
                  className={paddingClassName}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setInputValue(event.target.value)}
                  placeholder="輸入關鍵字..."
                  value={inputValue}
                />
              )}
            </TextField>
          </Dropdown>
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


