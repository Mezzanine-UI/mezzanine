import { defineComponent, h, nextTick } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import type { DateType } from '@mezzanine-ui/core/calendar';
import { calendarClasses } from '@mezzanine-ui/core/calendar';
import { multipleDatePickerClasses as classes } from '@mezzanine-ui/core/multiple-date-picker';
import MznCalendarConfigProviderMoment from '../calendar/calendar-config-provider-moment.vue';
import { resetPortals } from '../portal/portal-registry';
import MznMultipleDatePicker from './multiple-date-picker.vue';
import type { MultipleDatePickerProps } from './multiple-date-picker.types';

const withCalendar = (props: Partial<MultipleDatePickerProps> = {}) =>
  defineComponent({
    setup: (_, { expose }) => {
      const picker = h(MznMultipleDatePicker, {
        ...props,
        ref: 'picker',
      } as never);

      expose({});

      return () =>
        h(MznCalendarConfigProviderMoment, null, { default: () => picker });
    },
  });

async function render(props: Partial<MultipleDatePickerProps> = {}) {
  const wrapper = mount(withCalendar(props), { attachTo: document.body });

  await flushPromises();

  return wrapper;
}

const query = (selector: string): HTMLElement | null =>
  document.body.querySelector(selector);

const queryAll = (selector: string): HTMLElement[] =>
  Array.from(document.body.querySelectorAll(selector));

describe('<MznMultipleDatePicker />', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    resetPortals();
  });

  it('should show a placeholder while nothing is selected', async () => {
    const wrapper = await render({ placeholder: 'Select dates' });

    expect(wrapper.find(`.${classes.trigger}`).exists()).toBe(true);
    expect(
      wrapper.get(`.${classes.triggerInput}`).attributes('placeholder'),
    ).toBe('Select dates');
    expect(wrapper.find(`.${classes.triggerSelected}`).exists()).toBe(false);
  });

  it('should render one tag per selected date, in order', async () => {
    const wrapper = await render({
      value: ['2025-01-15', '2025-01-01'] as DateType[],
    });

    expect(
      wrapper
        .findAll(`.${classes.triggerTags} .mzn-tag__group .mzn-tag`)
        .map((tag) => tag.text()),
    ).toEqual(['2025-01-01', '2025-01-15']);
    expect(wrapper.find(`.${classes.triggerSelected}`).exists()).toBe(true);
  });

  it('should format the tags the way the format asks', async () => {
    const wrapper = await render({
      format: 'YYYY/MM/DD',
      value: ['2025-01-01'] as DateType[],
    });

    expect(
      wrapper.get(`.${classes.triggerTags} .mzn-tag__group .mzn-tag`).text(),
    ).toBe('2025/01/01');
  });

  it('should mark itself disabled and read-only', async () => {
    const disabled = await render({
      disabled: true,
      value: ['2025-01-01'] as DateType[],
    });

    expect(disabled.find(`.${classes.triggerDisabled}`).exists()).toBe(true);

    document.body.innerHTML = '';
    resetPortals();

    const readOnly = await render({
      readOnly: true,
      value: ['2025-01-01'] as DateType[],
    });

    expect(readOnly.find(`.${classes.triggerReadOnly}`).exists()).toBe(true);
    // Read-only tags cannot be dismissed. Scoped to the visible list: the
    // hidden copies the overflow measurement renders are always dismissable.
    expect(
      readOnly
        .find(`.${classes.triggerTags} .mzn-tag__group .mzn-tag__close-button`)
        .exists(),
    ).toBe(false);
  });

  it('should open the calendar on a trigger click and close it on cancel', async () => {
    const wrapper = await render({ value: ['2025-01-01'] as DateType[] });

    expect(query('.mzn-calendar')).toBeNull();

    await wrapper.get(`.${classes.trigger}`).trigger('click');
    await flushPromises();

    expect(query('.mzn-calendar')).not.toBeNull();
    const [cancel] = queryAll(`.${calendarClasses.footerActions} button`);

    cancel.click();
    await flushPromises();

    expect(query('.mzn-calendar')).toBeNull();
  });

  it('should stay shut while disabled', async () => {
    const wrapper = await render({ disabled: true });

    await wrapper.get(`.${classes.trigger}`).trigger('click');
    await flushPromises();

    expect(query('.mzn-calendar')).toBeNull();
  });

  it('should keep the confirm button off until something is selected', async () => {
    const wrapper = await render();

    await wrapper.get(`.${classes.trigger}`).trigger('click');
    await flushPromises();

    const [, confirm] = queryAll(`.${calendarClasses.footerActions} button`);

    expect(confirm.hasAttribute('disabled')).toBe(true);
  });

  it('should hand the confirmed dates over only on confirm', async () => {
    const wrapper = await render({ value: [] });
    const picker = wrapper.findComponent(MznMultipleDatePicker);

    await wrapper.get(`.${classes.trigger}`).trigger('click');
    await flushPromises();

    const [day] = queryAll(`.${calendarClasses.cell} button:not([disabled])`);

    day.click();
    await nextTick();

    // Selecting alone does not commit.
    expect(picker.emitted('change')).toBeUndefined();

    const [, confirm] = queryAll(`.${calendarClasses.footerActions} button`);

    confirm.click();
    await flushPromises();

    expect(picker.emitted('change')).toHaveLength(1);
    expect(query('.mzn-calendar')).toBeNull();
  });

  it('should stop offering new dates once the maximum is reached', async () => {
    const wrapper = await render({
      maxSelections: 1,
      referenceDate: '2025-01-10' as DateType,
      value: ['2025-01-10'] as DateType[],
    });

    await wrapper.get(`.${classes.trigger}`).trigger('click');
    await flushPromises();

    // `--disabled` on the cell marks the days outside the month; a date the
    // picker refuses is disabled on the cell's own button.
    const selectable = queryAll(
      `.${calendarClasses.cell} button:not([disabled])`,
    );

    // Only the one already selected stays clickable.
    expect(selectable).toHaveLength(1);
    expect(selectable[0].textContent).toContain('10');
  });

  it('should let a tag remove its own date', async () => {
    const wrapper = await render({
      value: ['2025-01-01', '2025-01-05'] as DateType[],
    });

    await wrapper
      .get(`.${classes.triggerTags} .mzn-tag__group .mzn-tag__close-button`)
      .trigger('click');
    await nextTick();

    expect(
      wrapper
        .findAll(`.${classes.triggerTags} .mzn-tag__group .mzn-tag`)
        .map((tag) => tag.text()),
    ).toEqual(['2025-01-05']);
  });

  it('should clear every date and report it', async () => {
    const wrapper = await render({
      value: ['2025-01-01', '2025-01-05'] as DateType[],
    });
    const picker = wrapper.findComponent(MznMultipleDatePicker);

    await wrapper.get('.mzn-text-field__clear-icon').trigger('click');
    await nextTick();

    expect(picker.emitted('change')).toEqual([[[]]]);
  });

  it('should report the calendar opening', async () => {
    const wrapper = await render();
    const picker = wrapper.findComponent(MznMultipleDatePicker);

    await wrapper.get(`.${classes.trigger}`).trigger('click');
    await flushPromises();

    expect(picker.emitted('calendarToggle')).toEqual([[true]]);
  });
});
