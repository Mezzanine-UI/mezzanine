import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

import { MznCascader } from './cascader.component';
import { CascaderOption } from './cascader-option';

const treeOptions: CascaderOption[] = [
  {
    id: 'tw',
    name: '台灣',
    children: [
      {
        id: 'tw-north',
        name: '北部',
        children: [
          { id: 'tw-tp', name: '台北市' },
          { id: 'tw-ntpc', name: '新北市' },
          { id: 'tw-kl', name: '基隆市' },
        ],
      },
      {
        id: 'tw-central',
        name: '中部',
        children: [
          { id: 'tw-tc', name: '台中市' },
          { id: 'tw-ch', name: '彰化縣' },
        ],
      },
      {
        id: 'tw-south',
        name: '南部',
        children: [
          { id: 'tw-tn', name: '台南市' },
          { id: 'tw-ks', name: '高雄市' },
        ],
      },
    ],
  },
  {
    id: 'jp',
    name: '日本',
    children: [
      {
        id: 'jp-kanto',
        name: '關東',
        children: [
          { id: 'jp-tokyo', name: '東京都' },
          { id: 'jp-kanagawa', name: '神奈川縣' },
        ],
      },
      {
        id: 'jp-kansai',
        name: '關西',
        children: [
          { id: 'jp-osaka', name: '大阪府' },
          { id: 'jp-kyoto', name: '京都府' },
        ],
      },
    ],
  },
  {
    id: 'kr',
    name: '韓國',
    disabled: true,
  },
];

export default {
  title: 'Data Entry/Cascader',
  decorators: [
    moduleMetadata({
      imports: [MznCascader],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  argTypes: {
    clearable: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    fullWidth: { control: { type: 'boolean' } },
    placeholder: { control: { type: 'text' } },
  },
  args: {
    clearable: true,
    disabled: false,
    fullWidth: false,
    placeholder: '請選擇地區',
  },
  render: (args) => ({
    props: {
      ...args,
      options: treeOptions,
      value: undefined as CascaderOption[] | undefined,
      onValueChange(path: CascaderOption[]): void {
        this['value'] = path;
      },
    },
    template: `
      <div mznCascader
        [clearable]="clearable"
        [disabled]="disabled"
        [fullWidth]="fullWidth"
        [options]="options"
        [placeholder]="placeholder"
        [value]="value"
        (valueChange)="onValueChange($event)"
      ></div>
    `,
  }),
};

export const Basic: Story = {
  render: () => ({
    props: {
      options: treeOptions,
      value: undefined as CascaderOption[] | undefined,
      onValueChange(path: CascaderOption[]): void {
        this['value'] = path;
      },
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
        <div>
          <p style="margin-bottom: 8px;">三層選項（國家 / 城市 / 區域）</p>
          <div mznCascader
            [fullWidth]="true"
            [options]="options"
            [value]="value"
            placeholder="國家 / 城市 / 區域"
            (valueChange)="onValueChange($event)"
          ></div>
        </div>
      </div>
    `,
  }),
};

export const TwoLevel: Story = {
  render: () => ({
    props: {
      options: [
        {
          id: 'north',
          name: '北部',
          children: [
            { id: 'taipei-2', name: '台北市' },
            { id: 'newtaipei-2', name: '新北市' },
            { id: 'keelung-2', name: '基隆市' },
          ],
        },
        {
          id: 'central',
          name: '中部',
          children: [
            { id: 'taichung', name: '台中市' },
            { id: 'changhua', name: '彰化縣' },
          ],
        },
        {
          id: 'south',
          name: '南部',
          children: [
            { id: 'tainan', name: '台南市' },
            { id: 'kaohsiung', name: '高雄市' },
          ],
        },
      ] as CascaderOption[],
      value: undefined as CascaderOption[] | undefined,
      onValueChange(path: CascaderOption[]): void {
        this['value'] = path;
      },
    },
    template: `
      <div style="max-width: 320px;">
        <p style="margin-bottom: 8px;">兩層選項（區域 / 縣市）</p>
        <div mznCascader
          [fullWidth]="true"
          [options]="options"
          [value]="value"
          placeholder="台灣 / 縣市"
          (valueChange)="onValueChange($event)"
        ></div>
      </div>
    `,
  }),
};

export const States: Story = {
  render: () => ({
    props: {
      options: treeOptions,
      preselectedValue: [
        { id: 'tw', name: '台灣' },
        { id: 'tw-north', name: '北部' },
        { id: 'tw-tp', name: '台北市' },
      ],
    },
    template: `
      <div style="display: grid; grid-template-columns: repeat(2, 280px); gap: 24px; align-items: start;">
        <div>
          <p style="margin-bottom: 8px;">預設（Default）</p>
          <div mznCascader [fullWidth]="true" [options]="options" placeholder="國家 / 城市 / 區域" ></div>
        </div>
        <div>
          <p style="margin-bottom: 8px;">已選取（Selected）</p>
          <div mznCascader [fullWidth]="true" [options]="options" [value]="preselectedValue" placeholder="國家 / 城市 / 區域" ></div>
        </div>
        <div>
          <p style="margin-bottom: 8px;">錯誤（Error）</p>
          <div mznCascader [fullWidth]="true" [error]="true" [options]="options" placeholder="國家 / 城市 / 區域" ></div>
        </div>
        <div>
          <p style="margin-bottom: 8px;">停用（Disabled）</p>
          <div mznCascader [fullWidth]="true" [disabled]="true" [options]="options" [value]="preselectedValue" placeholder="國家 / 城市 / 區域" ></div>
        </div>
        <div>
          <p style="margin-bottom: 8px;">唯讀（Read Only）</p>
          <div mznCascader [fullWidth]="true" [readOnly]="true" [options]="options" [value]="preselectedValue" placeholder="國家 / 城市 / 區域" ></div>
        </div>
        <div>
          <p style="margin-bottom: 8px;">錯誤已選取（Error + Selected）</p>
          <div mznCascader [fullWidth]="true" [error]="true" [options]="options" [value]="preselectedValue" placeholder="國家 / 城市 / 區域" ></div>
        </div>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    props: {
      options: treeOptions,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 320px;">
        <div>
          <p style="margin-bottom: 8px;">主要（Main）</p>
          <div mznCascader [fullWidth]="true" [options]="options" placeholder="國家 / 城市 / 區域" size="main" ></div>
        </div>
        <div>
          <p style="margin-bottom: 8px;">次要（Sub）</p>
          <div mznCascader [fullWidth]="true" [options]="options" placeholder="國家 / 城市 / 區域" size="sub" ></div>
        </div>
      </div>
    `,
  }),
};

export const Controlled: Story = {
  render: () => ({
    props: {
      options: treeOptions,
      value: [
        { id: 'tw', name: '台灣' },
        { id: 'tw-north', name: '北部' },
        { id: 'tw-tp', name: '台北市' },
      ] as CascaderOption[],
      onValueChange(path: CascaderOption[]): void {
        this['value'] = path;
      },
      onClear(): void {
        this['value'] = [];
      },
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <div mznCascader
          [fullWidth]="true"
          [options]="options"
          [value]="value"
          placeholder="國家 / 城市 / 區域"
          (valueChange)="onValueChange($event)"
        ></div>
        <div style="padding: 12px; background-color: #f5f5f5; border-radius: 4px;">
          <p style="margin-bottom: 4px;">受控值（Controlled Value）：</p>
          <p *ngFor="let v of value; let i = index" style="font-size: 12px;">[{{ i }}] id: {{ v.id }} / name: {{ v.name }}</p>
          <p *ngIf="value.length === 0" style="font-size: 12px; color: #999;">尚未選取</p>
        </div>
        <button type="button" (click)="onClear()" style="width: fit-content; padding: 4px 12px; cursor: pointer;">清除選取</button>
      </div>
    `,
  }),
};

export const Uncontrolled: Story = {
  render: () => ({
    props: {
      options: treeOptions,
      defaultValue: [
        { id: 'tw', name: '台灣' },
        { id: 'tw-north', name: '北部' },
        { id: 'tw-kl', name: '基隆市' },
      ],
    },
    template: `
      <div style="max-width: 320px;">
        <p style="margin-bottom: 8px;">非受控（Uncontrolled），預設值為台灣 / 北部 / 基隆市</p>
        <div mznCascader
          [fullWidth]="true"
          [options]="options"
          [value]="defaultValue"
          placeholder="國家 / 城市 / 區域"
        ></div>
      </div>
    `,
  }),
};

export const WithDisabledOptions: Story = {
  render: () => ({
    props: {
      options: [
        {
          id: 'tw',
          name: '台灣',
          children: [
            {
              id: 'tw-north',
              name: '北部',
              children: [
                { id: 'tw-tp', name: '台北市' },
                { id: 'tw-ntpc', name: '新北市', disabled: true },
                { id: 'tw-kl', name: '基隆市' },
              ],
            },
            {
              id: 'tw-central',
              name: '中部',
              disabled: true,
              children: [{ id: 'tw-tc', name: '台中市' }],
            },
          ],
        },
        {
          id: 'jp',
          name: '日本',
          disabled: true,
          children: [
            {
              id: 'jp-kanto',
              name: '關東',
              children: [{ id: 'jp-tokyo', name: '東京都' }],
            },
          ],
        },
      ] as CascaderOption[],
      value: undefined as CascaderOption[] | undefined,
      onValueChange(path: CascaderOption[]): void {
        this['value'] = path;
      },
    },
    template: `
      <div style="max-width: 320px;">
        <p style="margin-bottom: 8px;">部分選項停用（中部、日本、新北市）</p>
        <div mznCascader
          [fullWidth]="true"
          [options]="options"
          [value]="value"
          placeholder="國家 / 城市 / 區域"
          (valueChange)="onValueChange($event)"
        ></div>
      </div>
    `,
  }),
};

export const WithMenuMaxHeight: Story = {
  render: () => ({
    props: {
      options: treeOptions,
      value: undefined as CascaderOption[] | undefined,
      onValueChange(path: CascaderOption[]): void {
        this['value'] = path;
      },
    },
    template: `
      <div style="max-width: 320px;">
        <p style="margin-bottom: 8px;">設定 menuMaxHeight=200，選項超出時可捲動</p>
        <div mznCascader
          [fullWidth]="true"
          [menuMaxHeight]="200"
          [options]="options"
          [value]="value"
          placeholder="國家 / 城市 / 區域"
          (valueChange)="onValueChange($event)"
        ></div>
      </div>
    `,
  }),
};

export const InForm: Story = {
  render: () => ({
    props: {
      options: treeOptions,
      value: undefined as CascaderOption[] | undefined,
      onValueChange(path: CascaderOption[]): void {
        this['value'] = path;
      },
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h3>商品資料</h3>
        <div>
          <p style="margin-bottom: 4px;">倉庫地區：</p>
          <div mznCascader
            [fullWidth]="true"
            [options]="options"
            [value]="value"
            placeholder="縣市 / 區域 / 街道"
            (valueChange)="onValueChange($event)"
          ></div>
        </div>
        <div>
          <p style="margin-bottom: 4px;">品牌（已停用）：</p>
          <div mznCascader
            [disabled]="true"
            [fullWidth]="true"
            [options]="options"
            placeholder="請選擇品牌"
          ></div>
        </div>
      </div>
    `,
  }),
};

export const MixedDepth: Story = {
  render: () => ({
    props: {
      options: [
        { id: 'flash-sale', name: '限時特賣' },
        { id: 'new-arrivals', name: '新品上市' },
        {
          id: 'food',
          name: '美食',
          children: [
            { id: 'coffee', name: '咖啡' },
            { id: 'dessert', name: '甜點' },
            { id: 'fast-food', name: '速食' },
          ],
        },
        {
          id: 'electronics',
          name: '3C 數位',
          children: [
            {
              id: 'phone',
              name: '手機',
              children: [
                { id: 'iphone', name: 'iPhone' },
                { id: 'android', name: 'Android' },
              ],
            },
            { id: 'tablet', name: '平板電腦' },
          ],
        },
      ] as CascaderOption[],
      value: undefined as CascaderOption[] | undefined,
      onValueChange(path: CascaderOption[]): void {
        this['value'] = path;
      },
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <p style="margin-bottom: 4px;">混合深度（部分選項僅第一層、部分第二層、部分第三層）</p>
        <div mznCascader
          [fullWidth]="true"
          [options]="options"
          [value]="value"
          placeholder="分類 / 子分類 / 品項"
          (valueChange)="onValueChange($event)"
        ></div>
      </div>
    `,
  }),
};

export const Clearable: Story = {
  render: () => ({
    props: {
      options: treeOptions,
      value: [
        { id: 'tw', name: '台灣' },
        { id: 'tw-north', name: '北部' },
        { id: 'tw-tp', name: '台北市' },
      ] as CascaderOption[],
      onValueChange(path: CascaderOption[]): void {
        this['value'] = path;
      },
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
        <div>
          <p style="margin-bottom: 8px;">可清除（Clearable）— 滑鼠移入時顯示清除按鈕</p>
          <div mznCascader
            [clearable]="true"
            [fullWidth]="true"
            [options]="options"
            [value]="value"
            placeholder="國家 / 城市 / 區域"
            (valueChange)="onValueChange($event)"
          ></div>
        </div>
        <div>
          <p style="margin-bottom: 8px;">停用時不顯示清除按鈕（Clearable + Disabled）</p>
          <div mznCascader
            [clearable]="true"
            [disabled]="true"
            [fullWidth]="true"
            [options]="options"
            [value]="value"
            placeholder="國家 / 城市 / 區域"
          ></div>
        </div>
        <div>
          <p style="margin-bottom: 8px;">唯讀時不顯示清除按鈕（Clearable + ReadOnly）</p>
          <div mznCascader
            [clearable]="true"
            [fullWidth]="true"
            [readOnly]="true"
            [options]="options"
            [value]="value"
            placeholder="國家 / 城市 / 區域"
          ></div>
        </div>
      </div>
    `,
  }),
};

export const OverflowCollapse: Story = {
  render: () => ({
    props: {
      options: treeOptions,
      preselectedValue: [
        { id: 'tw', name: '台灣' },
        { id: 'tw-north', name: '北部' },
        { id: 'tw-tp', name: '台北市' },
      ],
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <p style="margin-bottom: 8px;">寬度不足時，中間路徑折疊為「...」，hover 顯示完整路徑 Tooltip（width: 160px）</p>
          <div style="width: 160px;">
            <div mznCascader
              [fullWidth]="true"
              [options]="options"
              [value]="preselectedValue"
              placeholder="國家 / 城市 / 區域"
            ></div>
          </div>
        </div>
        <div>
          <p style="margin-bottom: 8px;">寬度充足時不折疊，顯示完整路徑（width: 320px）</p>
          <div style="width: 320px;">
            <div mznCascader
              [fullWidth]="true"
              [options]="options"
              [value]="preselectedValue"
              placeholder="國家 / 城市 / 區域"
            ></div>
          </div>
        </div>
      </div>
    `,
  }),
};
