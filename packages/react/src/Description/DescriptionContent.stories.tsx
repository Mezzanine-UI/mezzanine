import { Meta, StoryObj } from '@storybook/react-webpack5';
import { CopyIcon } from '@mezzanine-ui/icons';
import Badge from '../Badge';
import Button from '../Button';
import Progress from '../Progress';
import Tag from '../Tag';
import TagGroup from '../Tag/TagGroup';
import Typography from '../Typography';
import DescriptionContent from './DescriptionContent';

export default {
  title: 'Data Display/Description/DescriptionContent',
} as Meta;

type ContentStory = StoryObj<typeof DescriptionContent>;

/** 主要尺寸（Main Size）— 所有 Content Cell 類型 */
export const Playground: ContentStory = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: 160,
      }}
    >
      <div>
        <Typography variant="h3">Text Only</Typography>
        <DescriptionContent>rytass.com</DescriptionContent>
      </div>
      <div>
        <Typography variant="h3">Text with Icon</Typography>
        <DescriptionContent
          variant="with-icon"
          icon={CopyIcon}
          onClickIcon={() => {
            // eslint-disable-next-line no-console
            console.log('click icon');
          }}
        >
          rytass.com
        </DescriptionContent>
      </div>
      <div>
        <Typography variant="h3">Text Link Button</Typography>
        <Button variant="base-text-link" size="sub">
          rytass.com
        </Button>
      </div>
      <div>
        <Typography variant="h3">Trend-Up</Typography>
        <DescriptionContent variant="trend-up">88%</DescriptionContent>
      </div>
      <div>
        <Typography variant="h3">Trend-Down</Typography>
        <DescriptionContent variant="trend-down">88%</DescriptionContent>
      </div>
      <div>
        <Typography variant="h3">State</Typography>
        <Badge variant="dot-success" text="已審核" />
      </div>
      <div>
        <Typography variant="h3">Statistic</Typography>
        <DescriptionContent variant="statistic">98,888</DescriptionContent>
      </div>
      <div>
        <Typography variant="h3">Progress</Typography>
        <Progress percent={70} type="percent" />
      </div>
      <div>
        <Typography variant="h3">Tag</Typography>
        <TagGroup>
          <Tag label="Tag" />
          <Tag label="Tag" />
          <Tag label="Tag" />
          <Tag label="Tag" />
          <Tag label="Tag" />
        </TagGroup>
      </div>
    </div>
  ),
};

/** 尺寸對照 — Main（主要）與 Sub（次要）各 7 種 Content Cell 類型 */
export const Sizes: ContentStory = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: 160,
      }}
    >
      <div>
        <Typography variant="h3" style={{ marginBottom: 8 }}>
          Text Only
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <DescriptionContent size="main">Main Content</DescriptionContent>
          <DescriptionContent size="sub">Sub Content</DescriptionContent>
        </div>
      </div>

      <div>
        <Typography variant="h3" style={{ marginBottom: 8 }}>
          Text with Icon
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <DescriptionContent size="main" variant="with-icon" icon={CopyIcon}>
            Main Content
          </DescriptionContent>
          <DescriptionContent size="sub" variant="with-icon" icon={CopyIcon}>
            Sub Content
          </DescriptionContent>
        </div>
      </div>

      <div>
        <Typography variant="h3" style={{ marginBottom: 8 }}>
          Text Link Button
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Button variant="base-text-link" size="main">
            Main Link
          </Button>
          <Button variant="base-text-link" size="sub">
            Sub Link
          </Button>
        </div>
      </div>

      <div>
        <Typography variant="h3" style={{ marginBottom: 8 }}>
          Trend-Up
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <DescriptionContent size="main" variant="trend-up">
            12.5%
          </DescriptionContent>
          <DescriptionContent size="sub" variant="trend-up">
            12.5%
          </DescriptionContent>
        </div>
      </div>

      <div>
        <Typography variant="h3" style={{ marginBottom: 8 }}>
          Trend-Down
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <DescriptionContent size="main" variant="trend-down">
            8.3%
          </DescriptionContent>
          <DescriptionContent size="sub" variant="trend-down">
            8.3%
          </DescriptionContent>
        </div>
      </div>

      <div>
        <Typography variant="h3" style={{ marginBottom: 8 }}>
          State
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Badge variant="dot-success" text="已審核（main）" />
          <Badge variant="dot-success" text="已審核（sub）" />
        </div>
      </div>

      <div>
        <Typography variant="h3" style={{ marginBottom: 8 }}>
          Statistic
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <DescriptionContent size="main" variant="statistic">
            99,000
          </DescriptionContent>
          <DescriptionContent size="sub" variant="statistic">
            99,000
          </DescriptionContent>
        </div>
      </div>
    </div>
  ),
};
