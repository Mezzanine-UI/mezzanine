import Select, { Option, OptionGroup } from '.';
import Modal, { ModalHeader, ModalBody } from '../Modal';

export default {
  title: 'Data Entry/Select',
};

export const Basic = () => (
  <div
    style={{
      display: 'inline-grid',
      gridTemplateColumns: 'repeat(2, 300px)',
      gap: '16px',
      alignItems: 'center',
    }}
  >
    <Select
      clearable
      fullWidth
      required
      placeholder="預設文字"
    >
      <Option value="1">item1 has very long description</Option>
      <Option value="2">item2</Option>
      <Option value="3">item3</Option>
    </Select>
    <Select
      disabled
      fullWidth
      placeholder="預設文字"
    >
      <Option value="1">item1</Option>
      <Option value="2">item2</Option>
      <Option value="3">item3</Option>
    </Select>
    <Select
      error
      fullWidth
      placeholder="預設文字"
    >
      <Option value="1">item1</Option>
      <Option value="2">item2</Option>
      <Option value="3">item3</Option>
    </Select>
    <Select
      clearable
      defaultValue={[{
        id: '1',
        name: 'item123',
      }, {
        id: '2',
        name: 'item26666',
      }]}
      fullWidth
      mode="multiple"
      placeholder="我是多選"
    >
      <Option value="1">item123</Option>
      <Option value="2">item26666</Option>
      <Option value="3">item3</Option>
    </Select>
    <Select
      clearable
      defaultValue={[{
        id: '1',
        name: 'item123',
      }, {
        id: '2',
        name: 'item26666',
      }]}
      disabled
      fullWidth
      mode="multiple"
      placeholder="我是多選"
    >
      <Option value="1">item123</Option>
      <Option value="2">item26666</Option>
      <Option value="3">item3</Option>
    </Select>
    <Select
      clearable
      fullWidth
      onSearch={() => {}}
      placeholder="我可搜尋"
    >
      <Option value="1">item123</Option>
      <Option value="2">item26666</Option>
      <Option value="3">item3</Option>
    </Select>
    <Select
      clearable
      fullWidth
      // eslint-disable-next-line no-console
      onSearch={(searchText) => { console.log('searchText you typed: ', searchText); }}
      placeholder="我可搜尋(custom render)"
      renderValue={(value) => value.map((v) => v.id).join('、')}
    >
      <Option value="1">item123</Option>
      <Option value="2">item26666</Option>
      <Option value="3">item3</Option>
    </Select>
    <Select
      clearable
      disabled
      fullWidth
      onSearch={() => {}}
      placeholder="我可搜尋"
    >
      <Option value="1">item123</Option>
      <Option value="2">item26666</Option>
      <Option value="3">item3</Option>
    </Select>
  </div>
);

export const Group = () => (
  <div style={{
    display: 'inline-grid',
    gridTemplateColumns: 'repeat(3, 160px)',
    gap: 60,
  }}
  >
    <Select
      fullWidth
      menuSize="large"
      placeholder="預設"
      size="large"
    >
      <OptionGroup label="Group A">
        <Option value="1">item 1</Option>
        <Option value="2">item 2</Option>
      </OptionGroup>
      <OptionGroup label="Group B">
        <Option value="3">item 1</Option>
        <Option value="4">item 2</Option>
      </OptionGroup>
    </Select>
    <Select
      fullWidth
      menuSize="medium"
      placeholder="預設"
      size="medium"
    >
      <OptionGroup label="Group A">
        <Option value="1">item 1</Option>
        <Option value="2">item 2</Option>
      </OptionGroup>
      <OptionGroup label="Group B">
        <Option value="3">item 1</Option>
        <Option value="4">item 2</Option>
      </OptionGroup>
    </Select>
    <Select
      fullWidth
      menuSize="small"
      placeholder="預設"
      size="small"
    >
      <OptionGroup label="Group A">
        <Option value="1">item 1</Option>
        <Option value="2">item 2</Option>
      </OptionGroup>
      <OptionGroup label="Group B">
        <Option value="3">item 1</Option>
        <Option value="4">item 2</Option>
      </OptionGroup>
    </Select>
    <Select
      fullWidth
      placeholder="預設"
    >
      <OptionGroup label="Group A">
        <Option value="1">item 1</Option>
        <Option value="2">item 2</Option>
      </OptionGroup>
      <OptionGroup label="Group B">
        <Option value="3">item 1</Option>
        <Option value="4">item 2</Option>
      </OptionGroup>
    </Select>
    <Select
      defaultValue={[{
        id: '1',
        name: 'item 1',
      }]}
      fullWidth
      placeholder="預設"
    >
      <OptionGroup label="Group A">
        <Option value="1">item 1</Option>
        <Option value="2">item 2</Option>
      </OptionGroup>
      <OptionGroup label="Group B">
        <Option value="3">item 1</Option>
        <Option value="4">item 2</Option>
      </OptionGroup>
    </Select>
    <Select
      disabled
      defaultValue={[{
        id: '1',
        name: 'item 1',
      }]}
      fullWidth
      placeholder="預設"
    >
      <OptionGroup label="Group A">
        <Option value="1">item 1</Option>
        <Option value="2">item 2</Option>
      </OptionGroup>
      <OptionGroup label="Group B">
        <Option value="3">item 1</Option>
        <Option value="4">item 2</Option>
      </OptionGroup>
    </Select>
  </div>
);

export const OnModal = () => (
  <Modal
    fullScreen
    open
  >
    <ModalHeader>
      Hi
    </ModalHeader>
    <ModalBody>
      <Select
        clearable
        required
        placeholder="預設文字"
      >
        <Option value="1">item1</Option>
        <Option value="2">item2</Option>
        <Option value="3">item3</Option>
      </Select>
    </ModalBody>
  </Modal>
);
