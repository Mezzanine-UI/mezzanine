import { EyeIcon, MoreVerticalIcon } from '@mezzanine-ui/icons';
import Icon from '../Icon';
import {
  cleanup,
  render,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { CardActions } from '.';

describe('<CardActions />', () => {
  afterEach(cleanup);

  const otherActions = (
    <div>
      <Icon
        style={{
          padding: '4px',
          fontSize: '24px',
        }}
        icon={MoreVerticalIcon}
      />
      <Icon
        style={{
          padding: '4px',
          fontSize: '24px',
        }}
        icon={EyeIcon}
      />
    </div>
  );

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<CardActions ref={ref} otherActions={otherActions} />),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(
      <CardActions
        className={className}
        confirmText="OK"
        cancelText="Cancel"
        otherActions={otherActions}
      />,
    ),
  );
});
