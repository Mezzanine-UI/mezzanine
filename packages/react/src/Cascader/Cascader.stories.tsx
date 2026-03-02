import { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import Cascader from '.';
import { CascaderOption } from './typings';
import Typography from '../Typography';

export default {
  title: 'Data Entry/Cascader',
  component: Cascader,
} satisfies Meta<typeof Cascader>;

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

export const Playground: StoryObj<typeof Cascader> = {
  argTypes: {
    clearable: { control: { type: 'boolean' } },
    defaultValue: { control: false },
    disabled: { control: { type: 'boolean' } },
    dropdownZIndex: { control: { type: 'number' } },
    error: { control: { type: 'boolean' } },
    fullWidth: { control: { type: 'boolean' } },
    menuMaxHeight: { control: { type: 'number' } },
    onChange: { control: false },
    options: { control: false },
    placeholder: { control: { type: 'text' } },
    readOnly: { control: { type: 'boolean' } },
    size: {
      control: { type: 'select' },
      options: ['main', 'sub'],
    },
    value: { control: false },
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
  render: function PlaygroundStory(args) {
    const [value, setValue] = useState<CascaderOption[]>([]);

    return (
      <div style={{ maxWidth: '400px' }}>
        <Cascader
          {...args}
          options={taiwanOptions}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

const BasicComponent = () => {
  const [value, setValue] = useState<CascaderOption[]>([]);

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
        <Typography variant="body" style={{ marginBottom: '8px' }}>
          三層選項（國家 / 城市 / 區域）
        </Typography>
        <Cascader
          fullWidth
          options={taiwanOptions}
          placeholder="國家 / 城市 / 區域"
          value={value}
          onChange={setValue}
        />
      </div>
      {value.length > 0 && (
        <div
          style={{
            padding: '8px 12px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
          }}
        >
          <Typography variant="body" style={{ marginBottom: '4px' }}>
            已選取：
          </Typography>
          <Typography variant="body">
            {value.map((v) => v.name).join(' / ')}
          </Typography>
        </div>
      )}
    </div>
  );
};

export const Basic: StoryObj<typeof Cascader> = {
  render: () => <BasicComponent />,
};

const TwoLevelComponent = () => {
  const [value, setValue] = useState<CascaderOption[]>([]);

  return (
    <div style={{ maxWidth: '320px' }}>
      <Typography variant="body" style={{ marginBottom: '8px' }}>
        兩層選項（區域 / 縣市）
      </Typography>
      <Cascader
        fullWidth
        options={twoLevelOptions}
        placeholder="台灣 / 縣市"
        value={value}
        onChange={setValue}
      />
    </div>
  );
};

export const TwoLevel: StoryObj<typeof Cascader> = {
  render: () => <TwoLevelComponent />,
};

const StatesComponent = () => {
  const preselectedValue: CascaderOption[] = [
    { id: 'taiwan', name: '台灣' },
    { id: 'taipei', name: '台北市' },
    { id: 'daan', name: '大安區' },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 280px)',
        gap: '24px',
        alignItems: 'start',
      }}
    >
      <div>
        <Typography variant="body" style={{ marginBottom: '8px' }}>
          預設（Default）
        </Typography>
        <Cascader
          fullWidth
          options={taiwanOptions}
          placeholder="國家 / 城市 / 區域"
        />
      </div>
      <div>
        <Typography variant="body" style={{ marginBottom: '8px' }}>
          已選取（Selected）
        </Typography>
        <Cascader
          fullWidth
          options={taiwanOptions}
          defaultValue={preselectedValue}
          placeholder="國家 / 城市 / 區域"
        />
      </div>
      <div>
        <Typography variant="body" style={{ marginBottom: '8px' }}>
          錯誤（Error）
        </Typography>
        <Cascader
          error
          fullWidth
          options={taiwanOptions}
          placeholder="國家 / 城市 / 區域"
        />
      </div>
      <div>
        <Typography variant="body" style={{ marginBottom: '8px' }}>
          停用（Disabled）
        </Typography>
        <Cascader
          disabled
          fullWidth
          options={taiwanOptions}
          defaultValue={preselectedValue}
          placeholder="國家 / 城市 / 區域"
        />
      </div>
      <div>
        <Typography variant="body" style={{ marginBottom: '8px' }}>
          唯讀（Read Only）
        </Typography>
        <Cascader
          readOnly
          fullWidth
          options={taiwanOptions}
          defaultValue={preselectedValue}
          placeholder="國家 / 城市 / 區域"
        />
      </div>
      <div>
        <Typography variant="body" style={{ marginBottom: '8px' }}>
          錯誤已選取（Error + Selected）
        </Typography>
        <Cascader
          error
          fullWidth
          options={taiwanOptions}
          defaultValue={preselectedValue}
          placeholder="國家 / 城市 / 區域"
        />
      </div>
    </div>
  );
};

export const States: StoryObj<typeof Cascader> = {
  render: () => <StatesComponent />,
};

const SizesComponent = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      maxWidth: '320px',
    }}
  >
    <div>
      <Typography variant="body" style={{ marginBottom: '8px' }}>
        主要（Main）
      </Typography>
      <Cascader
        fullWidth
        options={taiwanOptions}
        placeholder="國家 / 城市 / 區域"
        size="main"
      />
    </div>
    <div>
      <Typography variant="body" style={{ marginBottom: '8px' }}>
        次要（Sub）
      </Typography>
      <Cascader
        fullWidth
        options={taiwanOptions}
        placeholder="國家 / 城市 / 區域"
        size="sub"
      />
    </div>
  </div>
);

export const Sizes: StoryObj<typeof Cascader> = {
  render: () => <SizesComponent />,
};

const ControlledComponent = () => {
  const [value, setValue] = useState<CascaderOption[]>([
    { id: 'taiwan', name: '台灣' },
    { id: 'taipei', name: '台北市' },
    { id: 'daan', name: '大安區' },
  ]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        maxWidth: '400px',
      }}
    >
      <Cascader
        fullWidth
        options={taiwanOptions}
        placeholder="國家 / 城市 / 區域"
        value={value}
        onChange={setValue}
      />
      <div
        style={{
          padding: '12px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
        }}
      >
        <Typography variant="body" style={{ marginBottom: '4px' }}>
          受控值（Controlled Value）：
        </Typography>
        {value.length > 0 ? (
          value.map((v, i) => (
            <Typography key={v.id} variant="body" style={{ fontSize: '12px' }}>
              [{i}] id: {v.id} / name: {v.name}
            </Typography>
          ))
        ) : (
          <Typography
            variant="body"
            style={{ fontSize: '12px', color: '#999' }}
          >
            尚未選取
          </Typography>
        )}
      </div>
      <button
        type="button"
        onClick={() => setValue([])}
        style={{ width: 'fit-content', padding: '4px 12px', cursor: 'pointer' }}
      >
        清除選取
      </button>
    </div>
  );
};

export const Controlled: StoryObj<typeof Cascader> = {
  render: () => <ControlledComponent />,
};

const UncontrolledComponent = () => (
  <div style={{ maxWidth: '320px' }}>
    <Typography variant="body" style={{ marginBottom: '8px' }}>
      非受控（Uncontrolled），預設值為台灣 / 台北市 / 中山區
    </Typography>
    <Cascader
      fullWidth
      options={taiwanOptions}
      placeholder="國家 / 城市 / 區域"
      defaultValue={[
        { id: 'taiwan', name: '台灣' },
        { id: 'taipei', name: '台北市' },
        { id: 'zhongshan', name: '中山區' },
      ]}
    />
  </div>
);

export const Uncontrolled: StoryObj<typeof Cascader> = {
  render: () => <UncontrolledComponent />,
};

const WithDisabledOptionsComponent = () => {
  const optionsWithDisabled: CascaderOption[] = [
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
  ];

  const [value, setValue] = useState<CascaderOption[]>([]);

  return (
    <div style={{ maxWidth: '320px' }}>
      <Typography variant="body" style={{ marginBottom: '8px' }}>
        部分選項停用（新北市、日本、信義區）
      </Typography>
      <Cascader
        fullWidth
        options={optionsWithDisabled}
        placeholder="國家 / 城市 / 區域"
        value={value}
        onChange={setValue}
      />
    </div>
  );
};

export const WithDisabledOptions: StoryObj<typeof Cascader> = {
  render: () => <WithDisabledOptionsComponent />,
};

const WithMenuMaxHeightComponent = () => {
  const [value, setValue] = useState<CascaderOption[]>([]);

  return (
    <div style={{ maxWidth: '320px' }}>
      <Typography variant="body" style={{ marginBottom: '8px' }}>
        設定 menuMaxHeight={200}，選項超出時可捲動
      </Typography>
      <Cascader
        fullWidth
        menuMaxHeight={200}
        options={taiwanOptions}
        placeholder="國家 / 城市 / 區域"
        value={value}
        onChange={setValue}
      />
    </div>
  );
};

export const WithMenuMaxHeight: StoryObj<typeof Cascader> = {
  render: () => <WithMenuMaxHeightComponent />,
};

const InFormComponent = () => {
  const [value, setValue] = useState<CascaderOption[]>([]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        maxWidth: '400px',
        padding: '24px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
      }}
    >
      <Typography variant="h3">商品資料</Typography>
      <div>
        <Typography variant="body" style={{ marginBottom: '4px' }}>
          倉庫地區：
        </Typography>
        <Cascader
          fullWidth
          options={taiwanOptions}
          placeholder="縣市 / 區域 / 街道"
          value={value}
          onChange={setValue}
        />
      </div>
      <div>
        <Typography variant="body" style={{ marginBottom: '4px' }}>
          品牌（已停用）：
        </Typography>
        <Cascader
          disabled
          fullWidth
          options={taiwanOptions}
          placeholder="請選擇品牌"
        />
      </div>
    </div>
  );
};

export const InForm: StoryObj<typeof Cascader> = {
  render: () => <InFormComponent />,
};

const ClearableComponent = () => {
  const [value, setValue] = useState<CascaderOption[]>([
    { id: 'taiwan', name: '台灣' },
    { id: 'taipei', name: '台北市' },
    { id: 'daan', name: '大安區' },
  ]);

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
        <Typography variant="body" style={{ marginBottom: '8px' }}>
          可清除（Clearable）— 滑鼠移入時顯示清除按鈕
        </Typography>
        <Cascader
          clearable
          fullWidth
          options={taiwanOptions}
          placeholder="國家 / 城市 / 區域"
          value={value}
          onChange={setValue}
        />
      </div>
      <div>
        <Typography variant="body" style={{ marginBottom: '8px' }}>
          停用時不顯示清除按鈕（Clearable + Disabled）
        </Typography>
        <Cascader
          clearable
          disabled
          fullWidth
          options={taiwanOptions}
          placeholder="國家 / 城市 / 區域"
          value={value}
          onChange={setValue}
        />
      </div>
      <div>
        <Typography variant="body" style={{ marginBottom: '8px' }}>
          唯讀時不顯示清除按鈕（Clearable + ReadOnly）
        </Typography>
        <Cascader
          clearable
          readOnly
          fullWidth
          options={taiwanOptions}
          placeholder="國家 / 城市 / 區域"
          value={value}
          onChange={setValue}
        />
      </div>
    </div>
  );
};

export const Clearable: StoryObj<typeof Cascader> = {
  render: () => <ClearableComponent />,
};
