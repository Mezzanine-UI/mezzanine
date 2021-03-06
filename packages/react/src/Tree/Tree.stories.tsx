import { TreeNodeValue } from '@mezzanine-ui/core/tree';
import { Story, Meta } from '@storybook/react';
import { useRef, useState } from 'react';
import Button from '../Button';
import Typography from '../Typography';
import Tree, { TreeProps } from './Tree';
import { TreeExpandControl, TreeNodeData } from './typings';

export default {
  title: 'Data Display/Tree',
} as Meta;

const nodes: TreeNodeData[] = [{
  label: 'label 1',
  value: '1',
  nodes: [
    {
      label: 'label 1-1',
      value: '1-1',
      nodes: [
        {
          label: 'label 1-1-1',
          value: '1-1-1',
          nodes: [
            {
              label: 'label 1-1-1-1',
              value: '1-1-1-1',
            },
            {
              label: 'label 1-1-1-2',
              value: '1-1-1-2',
            },
            {
              label: 'label 1-1-1-3',
              value: '1-1-1-3',
            },
          ],
        },
        {
          label: 'label 1-1-2',
          value: '1-1-2',
        },
        {
          label: 'label 1-1-3',
          value: '1-1-3',
        },
      ],
    },
    {
      label: 'label 1-2',
      value: '1-2',
    },
  ],
},
{
  label: 'label 2',
  value: '2',
}];

export const Selectable = () => {
  const [selectedValues, setSelectedValues] = useState<TreeNodeValue[]>([]);
  const typoStyle = {
    margin: '0 0 16px 0',
  };

  return (
    <>
      <Typography style={typoStyle}>
        {
          `current selected values: ${selectedValues[0]}`
        }
      </Typography>
      <Tree
        nodes={nodes}
        values={selectedValues}
        onSelect={
          (v: TreeNodeValue[]) => { setSelectedValues(v); }
        }
        selectable
      />
    </>
  );
};

type DisabledPlaygroundArgs = {
  disabledDemoType: 'parent disabled' | 'sibling disabled',
};

export const Disabled: Story<DisabledPlaygroundArgs> = ({
  disabledDemoType,
}) => {
  const [selectedValues, setSelectedValues] = useState<TreeNodeValue[]>([]);
  const disabledValues = disabledDemoType === 'parent disabled'
    ? ['1-1']
    : ['1-1-1-1', '1-1-1-2', '1-1-1-3'];
  const typoStyle = {
    margin: '0 0 16px 0',
  };

  return (
    <>
      <Typography component="p" style={typoStyle}>
        {
          `disabled values: ${disabledValues.join(', ')}`
        }
      </Typography>
      <Typography component="p" style={typoStyle}>
        {
          `current selected values: ${selectedValues[0]}`
        }
      </Typography>
      <Tree
        nodes={nodes}
        values={selectedValues}
        onSelect={
          (v: TreeNodeValue[]) => { setSelectedValues(v); }
        }
        selectable
        disabledValues={disabledValues}
      />
    </>
  );
};

Disabled.argTypes = {
  disabledDemoType: {
    control: {
      type: 'select',
      options: ['parent disabled', 'sibling disabled'],
    },
  },
};

Disabled.args = {
  disabledDemoType: 'parent disabled',
};

export const Multiple = () => {
  const [selectedValues, setSelectedValues] = useState<TreeNodeValue[]>([]);
  const typoStyle = {
    margin: '0 0 16px 0',
  };

  return (
    <>
      <Typography style={typoStyle}>
        {
          `current selected values: ${selectedValues.reduce<string>((acc, current) => {
            if (!acc.length) return `${current}`;

            return `${acc}, ${current}`;
          }, '')}`
        }
      </Typography>
      <Tree
        nodes={nodes}
        values={selectedValues}
        onSelect={
          (v: TreeNodeValue[]) => { setSelectedValues(v); }
        }
        selectable
        multiple
      />
    </>
  );
};

type PlaygroundArgs = Pick<TreeProps,
| 'multiple'
| 'selectable'
| 'includeNodeValue'
| 'size'
| 'defaultExpandAll'
| 'selectMethod'
>;

export const Controller = () => {
  const expandControllerRef = useRef<TreeExpandControl>(null);

  const btnStyle = {
    margin: '0 0 8px 0',
  };

  return (
    <>
      <div style={{
        display: 'flex',
        width: '100%',
        flexWrap: 'wrap',
      }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          marginRight: '24px',
        }}
        >
          <Button
            variant="contained"
            onClick={() => {
              expandControllerRef.current?.collapse('1-1-1');
            }}
            style={btnStyle}
          >
            collapse 1-1-1
          </Button>
          <Button
            variant="contained"
            onClick={() => { expandControllerRef.current?.collapseAll(); }}
            style={btnStyle}
          >
            collapse all
          </Button>
          <Button
            variant="contained"
            onClick={() => { expandControllerRef.current?.collapseAllFrom('1'); }}
            style={btnStyle}
          >
            collapse all from 1
          </Button>
          <Button
            variant="contained"
            onClick={() => { expandControllerRef.current?.expand('1-1-1'); }}
            style={btnStyle}
          >
            expand 1-1-1
          </Button>
          <Button
            variant="contained"
            onClick={() => { expandControllerRef.current?.expandAll(); }}
            style={btnStyle}
          >
            expand all
          </Button>
          <Button
            variant="contained"
            onClick={() => { expandControllerRef.current?.expandAllFrom('1'); }}
            style={btnStyle}
          >
            expand all from 1
          </Button>
        </div>
        <Tree
          style={{
            flex: '1 1',
          }}
          nodes={nodes}
          expandControllerRef={expandControllerRef}
          defaultExpandAll
        />
      </div>

    </>
  );
};

export const Playground: Story<PlaygroundArgs> = ({
  multiple,
  selectMethod,
  selectable,
  includeNodeValue,
  size,
  defaultExpandAll,
}) => {
  const [selectedValues, setSelectedValues] = useState<TreeNodeValue[]>([]);
  const typoStyle = {
    margin: '0 0 16px 0',
  };

  return (
    <>
      <Typography style={typoStyle}>
        {
          `current selected values: ${selectedValues.reduce<string>((acc, current) => {
            if (!acc.length) return `${current}`;

            return `${acc}, ${current}`;
          }, '')}`
        }
      </Typography>
      <Tree
        nodes={nodes}
        values={selectedValues}
        onSelect={
          (v: TreeNodeValue[]) => { setSelectedValues(v); }
        }
        selectable={selectable}
        multiple={multiple}
        selectMethod={selectMethod}
        includeNodeValue={includeNodeValue}
        size={size}
        defaultExpandAll={defaultExpandAll}
      />
    </>
  );
};

Playground.argTypes = {
  selectMethod: {
    control: {
      type: 'select',
      options: ['target', 'toggle'],
    },
  },
  size: {
    control: {
      type: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
};

Playground.args = {
  defaultExpandAll: false,
  includeNodeValue: false,
  multiple: false,
  selectMethod: 'toggle',
  selectable: false,
  size: 'medium',
};
