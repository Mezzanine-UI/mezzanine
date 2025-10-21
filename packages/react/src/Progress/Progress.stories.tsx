import { Meta } from '@storybook/react-webpack5';
import { CSSProperties, useState } from 'react';
import { ExclamationCircleFilledIcon } from '@mezzanine-ui/icons';
import Typography from '../Typography';
import Button from '../Button';
import Progress from '.';
import ConfigProvider from '../Provider';

export default {
  title: 'Feedback/Progress',
} as Meta;

export const Line = () => {
  const [percent, setPercent] = useState(70);
  const addProgress = () => {
    setPercent((percent + 10) % 110);
  };

  return (
    <>
      <Typography>Default</Typography>
      <Progress percent={percent} />
      <Typography>Small</Typography>
      <Progress percent={percent} size="small" />
      <Typography>Large</Typography>
      <ConfigProvider size="large">
        <Progress percent={percent} />
      </ConfigProvider>
      <Typography>Error</Typography>
      <Progress percent={percent} status="error" />
      <Typography>Success</Typography>
      <Progress percent={100} />
      <Typography>Disable info</Typography>
      <Progress percent={percent} showInfo={false} />
      <br />
      <Typography>Manual Status</Typography>
      <Progress percent={100} status="normal" />
      <Progress percent={100} status="error" />
      <Progress percent={80} status="success" />
      <br />
      <Button onClick={addProgress}>add</Button>
    </>
  );
};

export const Circle = () => {
  const [percent, setPercent] = useState(20);
  const addProgress = () => {
    setPercent((percent + 10) % 110);
  };

  const style: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
  };

  return (
    <>
      <div style={style}>
        <div>
          <Typography>Default</Typography>
          <Progress percent={percent} type="circle" />
        </div>
        <div>
          <Typography>Error</Typography>
          <Progress percent={55} type="circle" status="error" />
        </div>
        <div>
          <Typography>Success</Typography>
          <Progress percent={100} type="circle" />
        </div>
      </div>
      <br />
      <div style={style}>
        <div>
          <Typography>Size: 60</Typography>
          <Progress
            percent={percent}
            type="circle"
            circleProps={{ size: 60, strokeWidth: 4 }}
          />
        </div>
        <div>
          <Typography>Variant: h4</Typography>
          <Progress
            percent={percent}
            type="circle"
            percentProps={{ variant: 'h4' }}
          />
        </div>
        <div>
          <Typography>Icon: ExclamationCircleFilled</Typography>
          <Progress
            percent={percent}
            type="circle"
            errorIconProps={{ icon: ExclamationCircleFilledIcon }}
            status="error"
          />
        </div>
      </div>
      <br />
      <Button onClick={addProgress}>add</Button>
    </>
  );
};
