import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznTypography } from '@mezzanine-ui/ng/typography';

import { MznCascader } from './cascader.component';
import { CascaderOption } from './cascader-option';

const taiwanOptions: CascaderOption[] = [
  {
    id: 'taiwan',
    name: '台灣',
    children: [
      {
        id: 'taipei',
        name: '台北市',
        children: [
          { id: 'zhongzheng', name: '中正區' },
          { id: 'datong', name: '大同區' },
          { id: 'zhongshan', name: '中山區' },
          { id: 'songshan', name: '松山區' },
          { id: 'daan', name: '大安區' },
          { id: 'wanhua', name: '萬華區' },
          { id: 'xinyi', name: '信義區' },
          { id: 'nangang', name: '南港區' },
          { id: 'neihu', name: '內湖區' },
          { id: 'shilin', name: '士林區' },
          { id: 'beitou', name: '北投區' },
          { id: 'wenshan', name: '文山區' },
        ],
      },
      {
        id: 'newtaipei',
        name: '新北市',
        children: [
          { id: 'banqiao', name: '板橋區' },
          { id: 'xindian', name: '新店區' },
          { id: 'zhonghe', name: '中和區' },
          { id: 'yonghe', name: '永和區' },
          { id: 'sanchong', name: '三重區' },
          { id: 'luzhou', name: '蘆洲區' },
          { id: 'tucheng', name: '土城區' },
          { id: 'shulin', name: '樹林區' },
          { id: 'tamsui', name: '淡水區' },
        ],
      },
      {
        id: 'keelung',
        name: '基隆市',
        children: [
          { id: 'zhongjheng-kl', name: '中正區' },
          { id: 'xinyi-kl', name: '信義區' },
          { id: 'renai-kl', name: '仁愛區' },
          { id: 'zhongshan-kl', name: '中山區' },
          { id: 'anle', name: '安樂區' },
          { id: 'nuannuan', name: '暖暖區' },
          { id: 'qidu', name: '七堵區' },
        ],
      },
      {
        id: 'taoyuan',
        name: '桃園市',
        children: [
          { id: 'taoyuan-dist', name: '桃園區' },
          { id: 'zhongli', name: '中壢區' },
          { id: 'bade', name: '八德區' },
          { id: 'pingzhen', name: '平鎮區' },
          { id: 'yangmei', name: '楊梅區' },
          { id: 'luzhu', name: '蘆竹區' },
          { id: 'dayuan', name: '大園區' },
        ],
      },
      {
        id: 'hsinchu-city',
        name: '新竹市',
        children: [
          { id: 'east-hc', name: '東區' },
          { id: 'north-hc', name: '北區' },
          { id: 'xiangshan', name: '香山區' },
        ],
      },
      {
        id: 'taichung',
        name: '台中市',
        children: [
          { id: 'xitun', name: '西屯區' },
          { id: 'nantun', name: '南屯區' },
          { id: 'beitun', name: '北屯區' },
          { id: 'west-tc', name: '西區' },
          { id: 'north-tc', name: '北區' },
          { id: 'south-tc', name: '南區' },
          { id: 'east-tc', name: '東區' },
          { id: 'fengyuan', name: '豐原區' },
          { id: 'dali', name: '大里區' },
        ],
      },
      {
        id: 'tainan',
        name: '台南市',
        children: [
          { id: 'east-tn', name: '東區' },
          { id: 'north-tn', name: '北區' },
          { id: 'south-tn', name: '南區' },
          { id: 'west-tn', name: '西區' },
          { id: 'anping', name: '安平區' },
          { id: 'annan', name: '安南區' },
          { id: 'yongkang', name: '永康區' },
        ],
      },
      {
        id: 'kaohsiung',
        name: '高雄市',
        children: [
          { id: 'lingya', name: '苓雅區' },
          { id: 'sanmin', name: '三民區' },
          { id: 'zuoying', name: '左營區' },
          { id: 'gushan', name: '鼓山區' },
          { id: 'qianjin', name: '前金區' },
          { id: 'xinxing', name: '新興區' },
          { id: 'fengshan', name: '鳳山區' },
          { id: 'qianzhen', name: '前鎮區' },
        ],
      },
    ],
  },
  {
    id: 'japan',
    name: '日本',
    children: [
      {
        id: 'tokyo',
        name: '東京都',
        children: [
          { id: 'shinjuku', name: '新宿區' },
          { id: 'shibuya', name: '澀谷區' },
          { id: 'minato', name: '港區' },
          { id: 'chiyoda', name: '千代田區' },
          { id: 'chuo-tk', name: '中央區' },
          { id: 'bunkyo', name: '文京區' },
          { id: 'toshima', name: '豐島區' },
          { id: 'setagaya', name: '世田谷區' },
        ],
      },
      {
        id: 'osaka',
        name: '大阪府',
        children: [
          { id: 'osaka-city', name: '大阪市' },
          { id: 'sakai', name: '堺市' },
          { id: 'higashiosaka', name: '東大阪市' },
          { id: 'toyonaka', name: '豐中市' },
          { id: 'suita', name: '吹田市' },
        ],
      },
      {
        id: 'kyoto',
        name: '京都府',
        children: [
          { id: 'kyoto-city', name: '京都市' },
          { id: 'uji', name: '宇治市' },
          { id: 'nagaokakyo', name: '長岡京市' },
        ],
      },
      {
        id: 'fukuoka',
        name: '福岡縣',
        children: [
          { id: 'fukuoka-city', name: '福岡市' },
          { id: 'kitakyushu', name: '北九州市' },
          { id: 'kurume', name: '久留米市' },
        ],
      },
    ],
  },
  {
    id: 'korea',
    name: '韓國',
    children: [
      {
        id: 'seoul',
        name: '首爾',
        children: [
          { id: 'gangnam', name: '江南區' },
          { id: 'jongno', name: '鐘路區' },
          { id: 'mapo', name: '麻浦區' },
          { id: 'yongsan', name: '龍山區' },
          { id: 'seocho', name: '瑞草區' },
          { id: 'songpa', name: '松坡區' },
        ],
      },
      {
        id: 'busan',
        name: '釜山',
        children: [
          { id: 'haeundae', name: '海雲台區' },
          { id: 'suyeong', name: '水營區' },
          { id: 'jung-bs', name: '中區' },
          { id: 'busanjin', name: '釜山鎮區' },
        ],
      },
      {
        id: 'incheon',
        name: '仁川',
        children: [
          { id: 'namdong', name: '南洞區' },
          { id: 'bupyeong', name: '富平區' },
          { id: 'yeonsu', name: '延壽區' },
        ],
      },
    ],
  },
];

const twoLevelOptions: CascaderOption[] = [
  {
    id: 'north',
    name: '北部',
    children: [
      { id: 'taipei-2', name: '台北市' },
      { id: 'newtaipei-2', name: '新北市' },
      { id: 'keelung-2', name: '基隆市' },
      { id: 'taoyuan-2', name: '桃園市' },
      { id: 'hsinchu-2', name: '新竹市' },
    ],
  },
  {
    id: 'central',
    name: '中部',
    children: [
      { id: 'miaoli', name: '苗栗縣' },
      { id: 'taichung', name: '台中市' },
      { id: 'changhua', name: '彰化縣' },
      { id: 'nantou', name: '南投縣' },
    ],
  },
  {
    id: 'south',
    name: '南部',
    children: [
      { id: 'yunlin', name: '雲林縣' },
      { id: 'chiayi', name: '嘉義市' },
      { id: 'tainan', name: '台南市' },
      { id: 'kaohsiung', name: '高雄市' },
    ],
  },
  {
    id: 'east',
    name: '東部',
    children: [
      { id: 'yilan', name: '宜蘭縣' },
      { id: 'hualien', name: '花蓮縣' },
      { id: 'taitung', name: '台東縣' },
    ],
  },
  {
    id: 'islands',
    name: '外島',
    children: [
      { id: 'penghu', name: '澎湖縣' },
      { id: 'kinmen', name: '金門縣' },
      { id: 'lienchiang', name: '連江縣' },
    ],
  },
];

const mixedDepthOptions: CascaderOption[] = [
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
      {
        id: 'laptop',
        name: '筆記型電腦',
        children: [
          { id: 'windows-laptop', name: 'Windows 筆電' },
          { id: 'mac-laptop', name: 'Mac 筆電' },
        ],
      },
      { id: 'tablet', name: '平板電腦' },
    ],
  },
  {
    id: 'clothing',
    name: '服飾',
    children: [
      {
        id: 'mens',
        name: '男裝',
        children: [
          { id: 'mens-top', name: '上衣' },
          { id: 'mens-pants', name: '褲子' },
          { id: 'mens-jacket', name: '外套' },
        ],
      },
      {
        id: 'womens',
        name: '女裝',
        children: [
          { id: 'womens-top', name: '上衣' },
          { id: 'womens-skirt', name: '裙裝' },
          { id: 'womens-jacket', name: '外套' },
        ],
      },
      { id: 'kids', name: '童裝' },
    ],
  },
];

const preselectedValue: CascaderOption[] = [
  { id: 'taiwan', name: '台灣' },
  { id: 'taipei', name: '台北市' },
  { id: 'daan', name: '大安區' },
];

export default {
  title: 'Data Entry/Cascader',
  decorators: [
    moduleMetadata({
      imports: [MznCascader, MznTypography],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  argTypes: {
    clearable: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    dropdownZIndex: { control: { type: 'number' } },
    error: { control: { type: 'boolean' } },
    fullWidth: { control: { type: 'boolean' } },
    menuMaxHeight: { control: { type: 'number' } },
    placeholder: { control: { type: 'text' } },
    readOnly: { control: { type: 'boolean' } },
    size: {
      control: { type: 'select' },
      options: ['main', 'sub'],
    },
  },
  args: {
    clearable: false,
    disabled: false,
    error: false,
    fullWidth: true,
    placeholder: '國家 / 城市 / 區域',
    readOnly: false,
    size: 'main',
  },
  render: (args) => ({
    props: {
      ...args,
      options: taiwanOptions,
      value: undefined as CascaderOption[] | undefined,
      onValueChange(path: CascaderOption[]): void {
        this['value'] = path;
      },
    },
    template: `
      <div style="max-width: 400px;">
        <div mznCascader
          [clearable]="clearable"
          [disabled]="disabled"
          [error]="error"
          [fullWidth]="fullWidth"
          [menuMaxHeight]="menuMaxHeight"
          [options]="options"
          [placeholder]="placeholder"
          [readOnly]="readOnly"
          [size]="size"
          [value]="value"
          (valueChange)="onValueChange($event)"
        ></div>
      </div>
    `,
  }),
};

@Component({
  selector: 'story-cascader-basic',
  standalone: true,
  imports: [MznCascader, MznTypography],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;"
    >
      <div>
        <p mznTypography variant="body" style="margin-bottom: 8px;">
          三層選項（國家 / 城市 / 區域）
        </p>
        <div
          mznCascader
          [fullWidth]="true"
          [options]="options"
          [value]="value()"
          placeholder="國家 / 城市 / 區域"
          (valueChange)="onValueChange($event)"
        ></div>
      </div>
      @if (value().length > 0) {
        <div
          style="padding: 8px 12px; background-color: #f5f5f5; border-radius: 4px;"
        >
          <p mznTypography variant="body" style="margin-bottom: 4px;"
            >已選取：</p
          >
          <p mznTypography variant="body">{{ displayValue() }}</p>
        </div>
      }
    </div>
  `,
})
class BasicDemoComponent {
  readonly options = taiwanOptions;
  readonly value = signal<CascaderOption[]>([]);
  readonly displayValue = signal('');

  onValueChange(path: CascaderOption[]): void {
    this.value.set(path);
    this.displayValue.set(path.map((v) => v.name).join(' / '));
  }
}

export const Basic: Story = {
  decorators: [moduleMetadata({ imports: [BasicDemoComponent] })],
  render: () => ({
    template: `<story-cascader-basic />`,
  }),
};

export const TwoLevel: Story = {
  render: () => ({
    props: {
      options: twoLevelOptions,
      value: undefined as CascaderOption[] | undefined,
      onValueChange(path: CascaderOption[]): void {
        this['value'] = path;
      },
    },
    template: `
      <div style="max-width: 320px;">
        <p mznTypography variant="body" style="margin-bottom: 8px;">
          兩層選項（區域 / 縣市）
        </p>
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
      options: taiwanOptions,
      preselectedValue,
    },
    template: `
      <div style="display: grid; grid-template-columns: repeat(2, 280px); gap: 24px; align-items: start;">
        <div>
          <p mznTypography variant="body" style="margin-bottom: 8px;">預設（Default）</p>
          <div mznCascader [fullWidth]="true" [options]="options" placeholder="國家 / 城市 / 區域"></div>
        </div>
        <div>
          <p mznTypography variant="body" style="margin-bottom: 8px;">已選取（Selected）</p>
          <div mznCascader [fullWidth]="true" [options]="options" [value]="preselectedValue" placeholder="國家 / 城市 / 區域"></div>
        </div>
        <div>
          <p mznTypography variant="body" style="margin-bottom: 8px;">錯誤（Error）</p>
          <div mznCascader [fullWidth]="true" [error]="true" [options]="options" placeholder="國家 / 城市 / 區域"></div>
        </div>
        <div>
          <p mznTypography variant="body" style="margin-bottom: 8px;">停用（Disabled）</p>
          <div mznCascader [fullWidth]="true" [disabled]="true" [options]="options" [value]="preselectedValue" placeholder="國家 / 城市 / 區域"></div>
        </div>
        <div>
          <p mznTypography variant="body" style="margin-bottom: 8px;">唯讀（Read Only）</p>
          <div mznCascader [fullWidth]="true" [readOnly]="true" [options]="options" [value]="preselectedValue" placeholder="國家 / 城市 / 區域"></div>
        </div>
        <div>
          <p mznTypography variant="body" style="margin-bottom: 8px;">錯誤已選取（Error + Selected）</p>
          <div mznCascader [fullWidth]="true" [error]="true" [options]="options" [value]="preselectedValue" placeholder="國家 / 城市 / 區域"></div>
        </div>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    props: {
      options: taiwanOptions,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 320px;">
        <div>
          <p mznTypography variant="body" style="margin-bottom: 8px;">主要（Main）</p>
          <div mznCascader [fullWidth]="true" [options]="options" placeholder="國家 / 城市 / 區域" size="main"></div>
        </div>
        <div>
          <p mznTypography variant="body" style="margin-bottom: 8px;">次要（Sub）</p>
          <div mznCascader [fullWidth]="true" [options]="options" placeholder="國家 / 城市 / 區域" size="sub"></div>
        </div>
      </div>
    `,
  }),
};

@Component({
  selector: 'story-cascader-controlled',
  standalone: true,
  imports: [MznCascader, MznTypography],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;"
    >
      <div
        mznCascader
        [fullWidth]="true"
        [options]="options"
        [value]="value()"
        placeholder="國家 / 城市 / 區域"
        (valueChange)="onValueChange($event)"
      ></div>
      <div
        style="padding: 12px; background-color: #f5f5f5; border-radius: 4px;"
      >
        <p mznTypography variant="body" style="margin-bottom: 4px;">
          受控值（Controlled Value）：
        </p>
        @for (v of value(); track v.id; let i = $index) {
          <p mznTypography variant="body" style="font-size: 12px;">
            [{{ i }}] id: {{ v.id }} / name: {{ v.name }}
          </p>
        }
        @if (value().length === 0) {
          <p mznTypography variant="body" style="font-size: 12px; color: #999;">
            尚未選取
          </p>
        }
      </div>
      <button
        type="button"
        (click)="onClear()"
        style="width: fit-content; padding: 4px 12px; cursor: pointer;"
      >
        清除選取
      </button>
    </div>
  `,
})
class ControlledDemoComponent {
  readonly options = taiwanOptions;
  readonly value = signal<CascaderOption[]>([
    { id: 'taiwan', name: '台灣' },
    { id: 'taipei', name: '台北市' },
    { id: 'daan', name: '大安區' },
  ]);

  onValueChange(path: CascaderOption[]): void {
    this.value.set(path);
  }

  onClear(): void {
    this.value.set([]);
  }
}

export const Controlled: Story = {
  decorators: [moduleMetadata({ imports: [ControlledDemoComponent] })],
  render: () => ({
    template: `<story-cascader-controlled />`,
  }),
};

@Component({
  selector: 'story-cascader-uncontrolled',
  standalone: true,
  imports: [MznCascader, MznTypography],
  template: `
    <div style="max-width: 320px;">
      <p mznTypography variant="body" style="margin-bottom: 8px;">
        非受控（Uncontrolled），預設值為台灣 / 台北市 / 中山區
      </p>
      <div
        mznCascader
        [fullWidth]="true"
        [options]="options"
        [value]="value()"
        placeholder="國家 / 城市 / 區域"
        (valueChange)="value.set($event)"
      ></div>
    </div>
  `,
})
class UncontrolledDemoComponent {
  readonly options = taiwanOptions;
  readonly value = signal<CascaderOption[]>([
    { id: 'taiwan', name: '台灣' },
    { id: 'taipei', name: '台北市' },
    { id: 'zhongshan', name: '中山區' },
  ]);
}

export const Uncontrolled: Story = {
  decorators: [moduleMetadata({ imports: [UncontrolledDemoComponent] })],
  render: () => ({
    template: `<story-cascader-uncontrolled />`,
  }),
};

export const WithDisabledOptions: Story = {
  render: () => ({
    props: {
      options: [
        {
          id: 'taiwan',
          name: '台灣',
          children: [
            {
              id: 'taipei',
              name: '台北市',
              children: [
                { id: 'zhongzheng', name: '中正區' },
                { id: 'daan', name: '大安區' },
                { id: 'xinyi', name: '信義區', disabled: true },
              ],
            },
            {
              id: 'newtaipei',
              name: '新北市',
              disabled: true,
              children: [{ id: 'banqiao', name: '板橋區' }],
            },
            {
              id: 'keelung',
              name: '基隆市',
              children: [
                { id: 'zhongjheng-kl', name: '中正區' },
                { id: 'xinyi-kl', name: '信義區' },
              ],
            },
          ],
        },
        {
          id: 'japan',
          name: '日本',
          disabled: true,
          children: [
            {
              id: 'tokyo',
              name: '東京都',
              children: [{ id: 'shinjuku', name: '新宿區' }],
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
        <p mznTypography variant="body" style="margin-bottom: 8px;">
          部分選項停用（新北市、日本、信義區）
        </p>
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
      options: taiwanOptions,
      value: undefined as CascaderOption[] | undefined,
      onValueChange(path: CascaderOption[]): void {
        this['value'] = path;
      },
    },
    template: `
      <div style="max-width: 320px;">
        <p mznTypography variant="body" style="margin-bottom: 8px;">
          設定 menuMaxHeight=200，選項超出時可捲動
        </p>
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
      options: taiwanOptions,
      value: undefined as CascaderOption[] | undefined,
      onValueChange(path: CascaderOption[]): void {
        this['value'] = path;
      },
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h3 mznTypography variant="h3">商品資料</h3>
        <div>
          <p mznTypography variant="body" style="margin-bottom: 4px;">倉庫地區：</p>
          <div mznCascader
            [fullWidth]="true"
            [options]="options"
            [value]="value"
            placeholder="縣市 / 區域 / 街道"
            (valueChange)="onValueChange($event)"
          ></div>
        </div>
        <div>
          <p mznTypography variant="body" style="margin-bottom: 4px;">品牌（已停用）：</p>
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

@Component({
  selector: 'story-cascader-mixed-depth',
  standalone: true,
  imports: [MznCascader, MznTypography],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;"
    >
      <p mznTypography variant="body" style="margin-bottom: 4px;">
        混合深度（部分選項僅第一層、部分第二層、部分第三層）
      </p>
      <div
        mznCascader
        [fullWidth]="true"
        [options]="options"
        [value]="value()"
        placeholder="分類 / 子分類 / 品項"
        (valueChange)="onValueChange($event)"
      ></div>
      @if (value().length > 0) {
        <div
          style="padding: 8px 12px; background-color: #f5f5f5; border-radius: 4px;"
        >
          <p mznTypography variant="body"> 已選取：{{ displayValue() }} </p>
        </div>
      }
    </div>
  `,
})
class MixedDepthDemoComponent {
  readonly options = mixedDepthOptions;
  readonly value = signal<CascaderOption[]>([]);
  readonly displayValue = signal('');

  onValueChange(path: CascaderOption[]): void {
    this.value.set(path);
    this.displayValue.set(path.map((v) => v.name).join(' / '));
  }
}

export const MixedDepth: Story = {
  decorators: [moduleMetadata({ imports: [MixedDepthDemoComponent] })],
  render: () => ({
    template: `<story-cascader-mixed-depth />`,
  }),
};

@Component({
  selector: 'story-cascader-clearable',
  standalone: true,
  imports: [MznCascader, MznTypography],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;"
    >
      <div>
        <p mznTypography variant="body" style="margin-bottom: 8px;">
          可清除（Clearable）— 滑鼠移入時顯示清除按鈕
        </p>
        <div
          mznCascader
          [clearable]="true"
          [fullWidth]="true"
          [options]="options"
          [value]="value()"
          placeholder="國家 / 城市 / 區域"
          (valueChange)="onValueChange($event)"
        ></div>
      </div>
      <div>
        <p mznTypography variant="body" style="margin-bottom: 8px;">
          停用時不顯示清除按鈕（Clearable + Disabled）
        </p>
        <div
          mznCascader
          [clearable]="true"
          [disabled]="true"
          [fullWidth]="true"
          [options]="options"
          [value]="value()"
          placeholder="國家 / 城市 / 區域"
        ></div>
      </div>
      <div>
        <p mznTypography variant="body" style="margin-bottom: 8px;">
          唯讀時不顯示清除按鈕（Clearable + ReadOnly）
        </p>
        <div
          mznCascader
          [clearable]="true"
          [fullWidth]="true"
          [readOnly]="true"
          [options]="options"
          [value]="value()"
          placeholder="國家 / 城市 / 區域"
        ></div>
      </div>
    </div>
  `,
})
class ClearableDemoComponent {
  readonly options = taiwanOptions;
  readonly value = signal<CascaderOption[]>([
    { id: 'taiwan', name: '台灣' },
    { id: 'taipei', name: '台北市' },
    { id: 'daan', name: '大安區' },
  ]);

  onValueChange(path: CascaderOption[]): void {
    this.value.set(path);
  }
}

export const Clearable: Story = {
  decorators: [moduleMetadata({ imports: [ClearableDemoComponent] })],
  render: () => ({
    template: `<story-cascader-clearable />`,
  }),
};

export const OverflowCollapse: Story = {
  render: () => ({
    props: {
      options: taiwanOptions,
      preselectedValue: [
        { id: 'taiwan', name: '台灣' },
        { id: 'taipei', name: '台北市' },
        { id: 'zhongzheng', name: '中正區' },
      ],
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <p mznTypography variant="body" style="margin-bottom: 8px;">
            寬度不足時，中間路徑折疊為「...」，hover 顯示完整路徑 Tooltip（width: 160px）
          </p>
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
          <p mznTypography variant="body" style="margin-bottom: 8px;">
            寬度充足時不折疊，顯示完整路徑（width: 320px）
          </p>
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
