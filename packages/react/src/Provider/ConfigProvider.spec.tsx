import { useContext } from 'react';
import {
  cleanup,
  render,
} from '../../__test-utils__';
import ConfigProvider, { MezzanineConfigContext, MezzanineConfig } from '.';

const defaultConfig: MezzanineConfigContext = {
  size: 'medium',
};

describe('<ConfigProvider />', () => {
  afterEach(cleanup);

  it('should assign default configurations when props not given', () => {
    const TestComponent = () => {
      const {
        size,
      } = useContext(MezzanineConfig) || {};

      return (
        <div>
          <span id="config-size">{size}</span>
        </div>
      );
    };

    render(
      <ConfigProvider>
        <TestComponent />
      </ConfigProvider>,
    );

    const element = document.getElementById('config-size');

    expect(element?.textContent).toBe(defaultConfig.size);
  });

  it('should override default configurations when new configurations given', () => {
    const config: MezzanineConfigContext = {
      size: 'large',
    };

    const TestComponent = () => {
      const {
        size,
      } = useContext(MezzanineConfig) || {};

      return (
        <div>
          <span id="config-size">{size}</span>
        </div>
      );
    };

    render(
      <ConfigProvider {...config}>
        <TestComponent />
      </ConfigProvider>,
    );

    const element = document.getElementById('config-size');

    expect(element?.textContent).toBe(config.size);
  });
});
