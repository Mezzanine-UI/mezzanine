import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { progressClasses } from '@mezzanine-ui/core/progress';
import { EditIcon, EyeIcon } from '@mezzanine-ui/icons';
import MznProgress from './progress.vue';

describe('<MznProgress />', () => {
  it('should render the bar at the given percent', () => {
    const wrapper = mount(MznProgress, { props: { percent: 40 } });

    expect(wrapper.get(`.${progressClasses.lineBg}`).attributes('style')).toBe(
      'width: 40%;',
    );
    expect(wrapper.get(`.${progressClasses.host}`).classes()).toContain(
      progressClasses.type('progress'),
    );
  });

  it('should clamp the percent to 0…100', () => {
    const under = mount(MznProgress, { props: { percent: -20 } });
    const over = mount(MznProgress, { props: { percent: 140 } });

    expect(
      under.get(`.${progressClasses.lineBg}`).attributes('style'),
    ).toContain('0%');
    expect(
      over.get(`.${progressClasses.lineBg}`).attributes('style'),
    ).toContain('100%');
  });

  describe('status', () => {
    it('should stay enabled below 100 and turn successful at 100', () => {
      const partial = mount(MznProgress, { props: { percent: 99 } });
      const complete = mount(MznProgress, { props: { percent: 100 } });

      expect(partial.get(`.${progressClasses.host}`).classes()).not.toContain(
        progressClasses.success,
      );
      expect(complete.get(`.${progressClasses.host}`).classes()).toContain(
        progressClasses.success,
      );
    });

    it('should let an explicit status win', () => {
      const wrapper = mount(MznProgress, {
        props: { percent: 100, status: 'error' },
      });

      expect(wrapper.get(`.${progressClasses.host}`).classes()).toContain(
        progressClasses.error,
      );
      expect(wrapper.get(`.${progressClasses.host}`).classes()).not.toContain(
        progressClasses.success,
      );
    });
  });

  describe('type', () => {
    it('should print the percent for `percent`', () => {
      const wrapper = mount(MznProgress, {
        props: { percent: 45, type: 'percent' },
      });

      expect(wrapper.get(`.${progressClasses.infoPercent}`).text()).toBe('45%');
    });

    it('should show the status icon only for `icon`', () => {
      const asBar = mount(MznProgress, {
        props: { percent: 100, status: 'success' },
      });
      const asIcon = mount(MznProgress, {
        props: { percent: 100, status: 'success', type: 'icon' },
      });

      expect(asBar.find(`.${progressClasses.infoIcon}`).exists()).toBe(false);
      expect(
        asIcon.get(`.${progressClasses.infoIcon}`).attributes('data-icon-name'),
      ).toBe('checked-filled');
    });

    it('should show the error icon for a failed progress', () => {
      const wrapper = mount(MznProgress, {
        props: { percent: 60, status: 'error', type: 'icon' },
      });

      expect(
        wrapper
          .get(`.${progressClasses.infoIcon}`)
          .attributes('data-icon-name'),
      ).toBe('dangerous-filled');
    });

    it('should take the icons it is given', () => {
      const success = mount(MznProgress, {
        props: {
          icons: { error: EditIcon, success: EyeIcon },
          percent: 100,
          status: 'success',
          type: 'icon',
        },
      });
      const error = mount(MznProgress, {
        props: {
          icons: { error: EditIcon, success: EyeIcon },
          percent: 10,
          status: 'error',
          type: 'icon',
        },
      });

      expect(
        success
          .get(`.${progressClasses.infoIcon}`)
          .attributes('data-icon-name'),
      ).toBe('eye');
      expect(
        error.get(`.${progressClasses.infoIcon}`).attributes('data-icon-name'),
      ).toBe('edit');
    });
  });

  describe('tick', () => {
    it('should render a tick only between 0 and 100', async () => {
      const inside = mount(MznProgress, {
        attachTo: document.body,
        props: { percent: 40, tick: 20 },
      });
      const atEnd = mount(MznProgress, {
        attachTo: document.body,
        props: { percent: 40, tick: 100 },
      });
      const atStart = mount(MznProgress, {
        attachTo: document.body,
        props: { percent: 40, tick: 0 },
      });

      await nextTick();

      expect(inside.find(`.${progressClasses.tick}`).exists()).toBe(true);
      expect(atEnd.find(`.${progressClasses.tick}`).exists()).toBe(false);
      expect(atStart.find(`.${progressClasses.tick}`).exists()).toBe(false);
    });

    it('should place the tick with a custom property', async () => {
      const wrapper = mount(MznProgress, {
        attachTo: document.body,
        props: { percent: 40, tick: 20 },
      });

      await nextTick();

      expect(
        wrapper.get(`.${progressClasses.tick}`).attributes('style'),
      ).toContain('--tick-position');
    });

    it('should drop the tick when it leaves the range', async () => {
      const wrapper = mount(MznProgress, {
        attachTo: document.body,
        props: { percent: 40, tick: 20 },
      });

      await nextTick();
      expect(wrapper.find(`.${progressClasses.tick}`).exists()).toBe(true);

      await wrapper.setProps({ tick: undefined });
      await nextTick();

      expect(wrapper.find(`.${progressClasses.tick}`).exists()).toBe(false);
    });
  });
});
