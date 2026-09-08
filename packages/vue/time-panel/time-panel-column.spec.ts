import { mount } from '@vue/test-utils';
import {
  getUnits,
  timePanelClasses as classes,
} from '@mezzanine-ui/core/time-panel';
import MznTimePanelColumn from './time-panel-column.vue';

const testUnits = getUnits(0, 23, 1);

describe('<MznTimePanelColumn />', () => {
  it('should bind host class', () => {
    const wrapper = mount(MznTimePanelColumn, { props: { units: testUnits } });

    expect(wrapper.classes()).toContain(classes.column);
  });

  it('should render one button per unit', () => {
    const wrapper = mount(MznTimePanelColumn, { props: { units: testUnits } });

    expect(wrapper.findAll(`.${classes.columnButton}`)).toHaveLength(
      testUnits.length,
    );
  });

  it('should mark the active unit', () => {
    const wrapper = mount(MznTimePanelColumn, {
      props: { activeUnit: 8, units: testUnits },
    });
    const active = wrapper.findAll(`.${classes.buttonActive}`);

    expect(active).toHaveLength(1);
    expect(active[0].text()).toBe('08');
  });

  describe('emit: change', () => {
    it('should emit the clicked unit', async () => {
      const wrapper = mount(MznTimePanelColumn, {
        props: { units: testUnits },
      });
      const buttons = wrapper.findAll(`.${classes.columnButton}`);

      for (const [index, button] of buttons.entries()) {
        await button.trigger('click');

        expect(wrapper.emitted('change')?.[index][0]).toEqual(testUnits[index]);
      }

      expect(wrapper.emitted('change')).toHaveLength(testUnits.length);
    });
  });
});
