import { PlusIcon, SearchIcon } from '@mezzanine-ui/icons';
import Icon from '../Icon';
import Input from '.';
import { Message } from '..';
import Typography from '../Typography/Typography';

export default {
  title: 'Data Entry/Input',
};

export const Basic = () => (
  <div
    style={{
      display: 'inline-grid',
      gridTemplateColumns: 'repeat(2, 200px)',
      gap: '16px',
      alignItems: 'center',
    }}
  >
    <Input
      placeholder="please enter text"
    />
    <Input
      placeholder="please enter text"
      disabled
    />
    <Input
      placeholder="please enter text"
      error
    />
    <Input
      placeholder="please enter text"
      value="Example"
      readOnly
    />
  </div>
);

export const Sizes = () => (
  <div
    style={{
      display: 'inline-grid',
      gridTemplateColumns: 'repeat(3, 200px)',
      gap: '16px',
      alignItems: 'center',
    }}
  >
    <Input
      placeholder="please enter text"
      size="small"
    />
    <Input
      placeholder="please enter text"
      size="medium"
    />
    <Input
      placeholder="please enter text"
      size="large"
    />
    <Input
      placeholder="please enter text"
      size="small"
      disabled
    />
    <Input
      placeholder="please enter text"
      size="medium"
      disabled
    />
    <Input
      placeholder="please enter text"
      size="large"
      disabled
    />
    <Input
      placeholder="please enter text"
      size="small"
      error
    />
    <Input
      placeholder="please enter text"
      size="medium"
      error
    />
    <Input
      placeholder="please enter text"
      size="large"
      error
    />
  </div>
);

export const PrefixSuffix = () => (
  <div
    style={{
      display: 'inline-grid',
      gridTemplateColumns: 'repeat(3, 200px)',
      gap: '16px',
      alignItems: 'center',
    }}
  >
    <Input
      placeholder="please enter text"
      prefix={<Icon icon={PlusIcon} />}
    />
    <Input
      placeholder="please enter text"
      suffix={<Icon icon={PlusIcon} />}
    />
    <Input
      placeholder="please enter text"
      suffix={<Icon icon={PlusIcon} />}
      disabled
    />
    <Input
      placeholder="search"
      prefix={<Icon icon={SearchIcon} />}
      size="small"
      clearable
    />
    <Input
      placeholder="search"
      prefix={<Icon icon={SearchIcon} />}
      clearable
    />
    <Input
      placeholder="search"
      prefix={<Icon icon={SearchIcon} />}
      size="large"
      clearable
    />
    <Input
      placeholder="search"
      prefix={<Icon icon={SearchIcon} />}
      clearable
    />
    <Input
      placeholder="please enter text"
      prefix={<Icon icon={PlusIcon} />}
      clearable
      error
    />
  </div>
);

export const TagsMode = () => (
  <>
    <ul>
      <li>Default Max Tags Length is 3</li>
      <li>Default Input Max Length is 8</li>
      <li>
        Default Position of tags-mode-input field is
        <b> bottom</b>
      </li>
      <li>Tags will be stored in a set (unique value)</li>
    </ul>
    <div style={{ height: '20px' }} />
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(2, 320px)',
        gap: '16px',
        alignItems: 'center',
      }}
    >
      <section>
        <Typography>inputMaxLength=1</Typography>
        <Input
          fullWidth
          mode="tags"
          placeholder="inputMaxLength=1"
          inputProps={{ maxLength: 1 }}
          tagsProps={{
            onTagsChange: (newValue) => Message.info(JSON.stringify(newValue)),
          }}
        />
      </section>
      <section>
        <Typography>maxTagsLength=4, inputMaxLength=3</Typography>
        <Input
          mode="tags"
          placeholder="maxTagsLength=4; inputMaxLength=3"
          inputProps={{ maxLength: 3 }}
          tagsProps={{
            maxTagsLength: 4,
            onTagsChange: (newValue) => Message.info(JSON.stringify(newValue)),
          }}
        />
      </section>
      <section>
        <Typography>with clearable</Typography>
        <Input
          clearable
          error
          mode="tags"
          placeholder="with clearable"
          tagsProps={{
            onTagsChange: (newValue) => Message.info(JSON.stringify(newValue)),
          }}
        />
      </section>
      <section>
        <Typography>with initialTagsValue</Typography>
        <Input
          clearable
          mode="tags"
          placeholder="with initialTagsValue"
          tagsProps={{
            initialTagsValue: ['1', '2', '3', '4'],
            onTagsChange: (newValue) => Message.info(JSON.stringify(newValue)),
          }}
        />
      </section>
      <section>
        <Typography>
          initialTagsValue will be sliced, once maxTagsLength is given
          (maxTagsLength: 2)
        </Typography>
        <Input
          clearable
          mode="tags"
          placeholder="initialTagsValue will be sliced"
          tagsProps={{
            maxTagsLength: 2,
            initialTagsValue: ['1', '2', '3'],
            onTagsChange: (newValue) => Message.info(JSON.stringify(newValue)),
          }}
        />
      </section>
      <section>
        <Typography>
          Input Field on Top Position
        </Typography>
        <Input
          clearable
          mode="tags"
          placeholder="Input Field on Top Position"
          tagsProps={{
            inputPosition: 'top',
            maxTagsLength: 5,
            initialTagsValue: ['1', '2', '3', '4'],
            onTagsChange: (newValue) => Message.info(JSON.stringify(newValue)),
          }}
        />
      </section>
      <section>
        <Typography>
          With Prefix (Origin Input Prop Combination)
        </Typography>
        <Input
          clearable
          mode="tags"
          placeholder="Input Field on Top Position"
          prefix={<Icon icon={SearchIcon} />}
          tagsProps={{
            inputPosition: 'top',
            maxTagsLength: 5,
            initialTagsValue: ['With', 'Prefix', '!', '!'],
            onTagsChange: (newValue) => Message.info(JSON.stringify(newValue)),
          }}
        />
      </section>
    </div>
  </>
);
