import { Meta } from '@storybook/react-webpack5';
import { InfoFilledIcon } from '@mezzanine-ui/icons';
import Button from '../Button';
import Tooltip from '.';
import Icon from '../Icon';
import { PopperPlacement } from '../Popper';

export default {
  title: 'Utility/Tooltip',
} as Meta;

export const Basic = () => (
  <div
    style={{
      width: '100%',
      padding: '48px 24px 0',
      display: 'grid',
      alignItems: 'center',
      gridTemplateColumns: 'repeat(3, 68px)',
      gridGap: 30,
      fontSize: 48,
    }}
  >
    <Tooltip
      title="海豹科動物俗稱海豹，是食肉目鰭足類的一科。"
      options={{
        placement: 'top-start',
      }}
    >
      {({ onMouseEnter, onMouseLeave }) => (
        <Icon
          color="neutral"
          icon={InfoFilledIcon}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      )}
    </Tooltip>
    <Tooltip
      title={
        <div style={{ display: 'flex', flexFlow: 'column' }}>
          <span>Custom Element</span>
          <Icon icon={InfoFilledIcon} size={16} />
        </div>
      }
      options={{
        placement: 'top-start',
      }}
    >
      {({ onMouseEnter, onMouseLeave }) => (
        <Icon
          color="neutral"
          icon={InfoFilledIcon}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      )}
    </Tooltip>
    <Tooltip
      title="預設文字"
      options={{
        placement: 'bottom-start',
      }}
    >
      {({ onMouseEnter, onMouseLeave }) => (
        <Button
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          variant="base-primary"
        >
          按鈕
        </Button>
      )}
    </Tooltip>
  </div>
);

export const Placement = () => {
  const renderButtonWithTooltip = (placement: PopperPlacement) => (
    <Tooltip
      title="Content"
      options={{
        placement,
      }}
    >
      {({ onMouseEnter, onMouseLeave }) => (
        <Button
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          variant="base-primary"
        >
          {placement}
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
      {renderButtonWithTooltip('left-start')}
      <div />
      <div />
      <div />
      {renderButtonWithTooltip('right-start')}
      {renderButtonWithTooltip('left')}
      <div />
      <div />
      <div />
      {renderButtonWithTooltip('right')}
      {renderButtonWithTooltip('left-end')}
      <div />
      <div />
      <div />
      {renderButtonWithTooltip('right-end')}
      <div />
      {renderButtonWithTooltip('bottom-start')}
      {renderButtonWithTooltip('bottom')}
      {renderButtonWithTooltip('bottom-end')}
      <div />
    </div>
  );
};
