import { Meta, StoryObj } from '@storybook/react-webpack5';
import { InfoFilledIcon } from '@mezzanine-ui/icons';
import Button from '../Button';
import Tooltip from '.';
import Icon from '../Icon';
import { PopperPlacement } from '../Popper';

export default {
  title: 'Data Display/Tooltip',
  component: Tooltip,
} as Meta;

type Story = StoryObj<typeof Tooltip>;

export const Basic: Story = {
  render: () => (
    <div
      style={{
        width: '100%',
        padding: '48px 24px 0',
        display: 'grid',
        alignItems: 'center',
        gridTemplateColumns: 'repeat(3, 120px)',
        gridGap: 30,
      }}
    >
      <Tooltip
        title="Tooltip"
        options={{
          placement: 'top-start',
        }}
      >
        {({ onMouseEnter, onMouseLeave, ref }) => (
          <Icon
            ref={ref}
            color="neutral"
            icon={InfoFilledIcon}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
        )}
      </Tooltip>
      <Tooltip
        title={
          <div style={{ display: 'flex', flexFlow: 'row' }}>
            <span>Custom Element</span>
            <Icon icon={InfoFilledIcon} size={16} />
          </div>
        }
        options={{
          placement: 'top-start',
        }}
      >
        {({ onMouseEnter, onMouseLeave, ref }) => (
          <Icon
            ref={ref}
            color="neutral"
            icon={InfoFilledIcon}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
        )}
      </Tooltip>
      <Tooltip
        title="預設文字可能是很長的一段文字，但是受到最大寬度限制所以會換行"
        options={{
          placement: 'bottom-start',
        }}
      >
        {({ onMouseEnter, onMouseLeave, ref }) => (
          <Button
            ref={ref}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            variant="base-primary"
          >
            Max Width
          </Button>
        )}
      </Tooltip>
    </div>
  ),
};

export const Placement: Story = {
  render: () => {
    const renderButtonWithTooltip = (
      placement: PopperPlacement,
      arrow?: boolean,
    ) => (
      <Tooltip
        arrow={arrow}
        title={
          placement.startsWith('top')
            ? '預設文字可能是一段很長的描述文字，用來說明按鈕的功能或用途。'
            : '預設文字'
        }
        options={{
          placement,
        }}
      >
        {({ onMouseEnter, onMouseLeave, ref }) => (
          <Button
            ref={ref}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            variant="base-primary"
          >
            {arrow === false ? 'No Arrow' : placement}
          </Button>
        )}
      </Tooltip>
    );

    return (
      <div
        style={{
          width: '100%',
          marginTop: 50,
          display: 'inline-grid',
          gridTemplateColumns: 'repeat(5, max-content)',
          gridAutoRows: 'minmax(min-content, max-content)',
          gap: 30,
          justifyContent: 'center',
        }}
      >
        <div />
        {renderButtonWithTooltip('top-start')}
        {renderButtonWithTooltip('top')}
        {renderButtonWithTooltip('top-end')}
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        {renderButtonWithTooltip('left')}
        <div />
        {renderButtonWithTooltip('bottom', false)}
        <div />
        {renderButtonWithTooltip('right')}
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        {renderButtonWithTooltip('bottom-start')}
        {renderButtonWithTooltip('bottom')}
        {renderButtonWithTooltip('bottom-end')}
        <div />
      </div>
    );
  },
};

export const OverflowFlip: Story = {
  render: () => (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: '200vw',
          height: '200vh',
          padding: '80px 40px',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'flex-start',
          position: 'relative',
        }}
      >
        <Tooltip
          title="當 Tooltip 遇到視窗邊界會自動偏移/翻轉位置以避免被截斷"
          options={{
            placement: 'top',
          }}
        >
          {({ onMouseEnter, onMouseLeave, ref }) => (
            <Button
              ref={ref}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              variant="base-primary"
            >
              Scroll and Hover Me
            </Button>
          )}
        </Tooltip>
      </div>
    </div>
  ),
};
