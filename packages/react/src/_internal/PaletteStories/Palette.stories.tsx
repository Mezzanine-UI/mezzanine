import { useState } from 'react';
import {
  Select,
  Option,
} from '../..';
import { Variants as ButtonVariants } from '../../Button/Button.stories';
import { Colors as IconColors } from '../../Icon/Icon.stories';
import { Colors as TypographyColors } from '../../Typography/Typography.stories';
import { Playground as AppBar } from '../../AppBar/AppBar.stories';
import { Playground as Drawer } from '../../Drawer/Drawer.stories';
import { Basic as Dropdown } from '../../Dropdown/Dropdown.stories';
import { WithDivider as Menu } from '../../Menu/Menu.stories';
import { Playground as Navigation } from '../../Navigation/Navigation.stories';
import { Basic as PageFooter } from '../../PageFooter/PageFooter.stories';
import { WithJumper as Pagination } from '../../Pagination/Pagination.stories';
import { Basic as Stepper } from '../../Stepper/Stepper.stories';
import { Basic as Tabs } from '../../Tabs/Tabs.stories';
import { Group as Checkbox } from '../../Checkbox/Checkbox.stories';
import { Basic as DatePicker } from '../../DatePicker/DatePicker.stories';
import { Basic as DateRangePicker } from '../../DateRangePicker/DateRangePicker.stories';
import { Playground as Form } from '../../Form/Form.stories';
import { Basic as Input } from '../../Input/Input.stories';
import { Group as Radio } from '../../Radio/Radio.stories';
import { Basic as AutoComplete } from '../../Select/AutoComplete.stories';
import { Single as Slider } from '../../Slider/Slider.stories';
import { All as Switch } from '../../Switch/Switch.stories';
import { Basic as Textarea } from '../../Textarea/Textarea.stories';
import { Single as Upload } from '../../Upload/UploadPictureWall.stories';
import { Basic as Accordion } from '../../Accordion/Accordion.stories';
import { Common as Badge } from '../../Badge/Badge.stories';
import { Basic as Card } from '../../Card/Card.stories';
import { Playgroud as Empty } from '../../Empty/Empty.stories';
import { Basic as Table } from '../../Table/Table.stories';
import { Common as Tag } from '../../Tag/Tag.stories';
import { Playground as Alert } from '../../Alert/Alert.stories';
import { Playground as ConfirmActions } from '../../ConfirmActions/ConfirmActions.stories';
import { Basic as Loading } from '../../Loading/Loading.stories';
import { Basic as Message } from '../../Message/Message.stories';
import { Layers as Modal } from '../../Modal/Modal.stories';
import { Severity as Notification } from '../../Notification/Notification.stories';
import { Playground as Popconfirm } from '../../Popconfirm/Popconfirm.stories';
import { Line as Progress } from '../../Progress/Progress.stories';
import { Basic as Skeleton } from '../../Skeleton/Skeleton.stories';
import { Basic as Tooltip } from '../../Tooltip/Tooltip.stories';

const components = [
  {
    id: 'BUTTON',
    name: 'Button',
  },
  {
    id: 'ICON',
    name: 'Icon',
  },
  {
    id: 'TYPOGRAPHY',
    name: 'Typography',
  },
  {
    id: 'APP_BAR',
    name: 'App Bar',
  },
  {
    id: 'DRAWER',
    name: 'Drawer',
  },
  {
    id: 'DROPDOWN',
    name: 'Dropdown',
  },
  {
    id: 'MENU',
    name: 'Menu',
  },
  {
    id: 'NAVIGATION',
    name: 'Navigation',
  },
  {
    id: 'PAGE_FOOTER',
    name: 'Page Footer',
  },
  {
    id: 'PAGINATION',
    name: 'Pagination',
  },
  {
    id: 'STEPPER',
    name: 'Stepper',
  },
  {
    id: 'TABS',
    name: 'Tabs',
  },
  {
    id: 'CHECKBOX',
    name: 'Checkbox',
  },
  {
    id: 'DATE_PICKER',
    name: 'Date Picker',
  },
  {
    id: 'DATE_RANGE_PICKER',
    name: 'Date Range Picker',
  },
  // {
  //   id: 'DATE_TIME_PICKER',
  //   name: 'Date Time Picker',
  // },
  {
    id: 'FORM',
    name: 'Form',
  },
  {
    id: 'INPUT',
    name: 'Input',
  },
  {
    id: 'RADIO',
    name: 'Radio',
  },
  {
    id: 'AUTO_COMPLETE',
    name: 'Auto Complete',
  },
  // {
  //   id: 'SELECT',
  //   name: 'Select',
  // },
  {
    id: 'SLIDER',
    name: 'Slider',
  },
  {
    id: 'SWITCH',
    name: 'Switch',
  },
  {
    id: 'TEXTAREA',
    name: 'Textarea',
  },
  // {
  //   id: 'TIME_PICKER',
  //   name: 'Time Picker',
  // },
  {
    id: 'UPLOAD',
    name: 'Upload',
  },
  {
    id: 'ACCORDION',
    name: 'Accordion',
  },
  {
    id: 'BADGE',
    name: 'Badge',
  },
  {
    id: 'CARD',
    name: 'Card',
  },
  {
    id: 'EMPTY',
    name: 'Empty',
  },
  {
    id: 'TABLE',
    name: 'Table',
  },
  {
    id: 'TAG',
    name: 'Tag',
  },
  // {
  //   id: 'TREE',
  //   name: 'Tree',
  // },
  {
    id: 'ALERT',
    name: 'Alert',
  },
  {
    id: 'CONFIRM_ACTIONS',
    name: 'Confirm Actions',
  },
  {
    id: 'LOADING',
    name: 'Loading',
  },
  {
    id: 'MESSAGE',
    name: 'Message',
  },
  {
    id: 'MODAL',
    name: 'Modal',
  },
  {
    id: 'NOTIFICATION',
    name: 'Notification',
  },
  {
    id: 'POP_CONFIRM',
    name: 'Pop Confirm',
  },
  {
    id: 'PROGRESS',
    name: 'Progress',
  },
  {
    id: 'SKELETON',
    name: 'Skeleton',
  },
  {
    id: 'TOOLTIP',
    name: 'Tooltip',
  },
];

export default {
  title: 'System/Palette',
};

export const All = () => {
  const [currentComponent, setCurrentComponent] = useState(components[0]);

  return (
    <div
      style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: '16px',
      }}
    >
      <h3 style={{ fontSize: '18px', color: '#ff4343', margin: 0 }}>
        注意事項：
      </h3>
      <ol style={{ margin: 0 }}>
        <li>
          使用左邊的 Select 可以預覽不同元件。
        </li>
        <li>
          點擊畫面下方「Theming」Tab 可以設定不同顏色，直接點擊色碼即可修改。
        </li>
        <li>
          顏色名稱對應到 Mezzanine 的 color system，比如 primary.main, primary.light..etc，請注意 hoverBackground 及 selectedBackground 為程式運算出來的結果，不可修改。
        </li>
        <li>
          若需要其他種配色的可能性，請先與工程師確認可行性。
        </li>
        <li>
          修改後「請一直留在目前頁面」且「不要重新整理網頁」，不然顏色會重置。
        </li>
      </ol>
      <Select
        mode="single"
        value={currentComponent}
        onChange={(next) => setCurrentComponent(next)}
        menuMaxHeight={200}
      >
        {components.map((component) => (
          <Option key={component.id} value={component.id}>
            {component.name}
          </Option>
        ))}
      </Select>
      <div>
        {currentComponent.id === 'BUTTON' ? <ButtonVariants /> : null}
        {currentComponent.id === 'ICON' ? <IconColors /> : null}
        {currentComponent.id === 'TYPOGRAPHY' ? <TypographyColors /> : null}
        {currentComponent.id === 'APP_BAR' ? <AppBar /> : null}
        {currentComponent.id === 'DRAWER' ? <Drawer /> : null}
        {currentComponent.id === 'DROPDOWN' ? <Dropdown /> : null}
        {currentComponent.id === 'MENU' ? <Menu /> : null}
        {currentComponent.id === 'NAVIGATION' ? <Navigation /> : null}
        {currentComponent.id === 'PAGE_FOOTER' ? <PageFooter confirmText="確認" cancelText="取消" /> : null}
        {currentComponent.id === 'PAGINATION' ? <Pagination /> : null}
        {currentComponent.id === 'STEPPER' ? <Stepper /> : null}
        {currentComponent.id === 'TABS' ? <Tabs /> : null}
        {currentComponent.id === 'CHECKBOX' ? <Checkbox /> : null}
        {currentComponent.id === 'DATE_PICKER' ? <DatePicker /> : null}
        {currentComponent.id === 'DATE_RANGE_PICKER' ? <DateRangePicker /> : null}
        {currentComponent.id === 'FORM' ? (
          <Form
            clearable
            disabled={false}
            fullWidth={false}
            label="label"
            message="message"
            remark="remark"
            required
            showRemarkIcon={false}
          />
        ) : null}
        {currentComponent.id === 'INPUT' ? <Input /> : null}
        {currentComponent.id === 'RADIO' ? <Radio /> : null}
        {currentComponent.id === 'AUTO_COMPLETE' ? <AutoComplete /> : null}
        {currentComponent.id === 'SLIDER' ? <Slider /> : null}
        {currentComponent.id === 'SWITCH' ? <Switch /> : null}
        {currentComponent.id === 'TEXTAREA' ? <Textarea /> : null}
        {currentComponent.id === 'UPLOAD' ? (
          <Upload
            accept="image/*"
            defaultValues={['https://rytass.com/logo.png']}
            defaultUploadLabel="Upload"
            defaultUploadingLabel="Uploading..."
            defaultUploadErrorLabel="Upload Failed"
            disabled={false}
            fileHost=""
            multiple={false}
            onChange={() => ''}
            onDelete={() => ''}
            onError={() => ''}
            onUploadSuccess={() => ''}
            parallel={false}
          />
        ) : null}
        {currentComponent.id === 'ACCORDION' ? <Accordion /> : null}
        {currentComponent.id === 'BADGE' ? <Badge /> : null}
        {currentComponent.id === 'CARD' ? <Card /> : null}
        {currentComponent.id === 'EMPTY' ? <Empty title="查無資料" fullHeight={false}>找不到符合條件的資料</Empty> : null}
        {currentComponent.id === 'TABLE' ? <Table /> : null}
        {currentComponent.id === 'TAG' ? <Tag onClose={() => ''} /> : null}
        {currentComponent.id === 'ALERT' ? <Alert severity="success">message</Alert> : null}
        {currentComponent.id === 'CONFIRM_ACTIONS' ? <ConfirmActions confirmText="確認" cancelText="取消" /> : null}
        {currentComponent.id === 'LOADING' ? <Loading /> : null}
        {currentComponent.id === 'MESSAGE' ? <Message /> : null}
        {currentComponent.id === 'MODAL' ? <Modal /> : null}
        {currentComponent.id === 'NOTIFICATION' ? <Notification /> : null}
        {currentComponent.id === 'POP_CONFIRM' ? <Popconfirm /> : null}
        {currentComponent.id === 'PROGRESS' ? <Progress /> : null}
        {currentComponent.id === 'SKELETON' ? <Skeleton /> : null}
        {currentComponent.id === 'TOOLTIP' ? <Tooltip /> : null}
      </div>
    </div>
  );
};
