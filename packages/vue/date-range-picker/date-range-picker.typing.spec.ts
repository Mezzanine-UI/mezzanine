import { h, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import type { RangePickerValue } from '@mezzanine-ui/core/picker';
import moment from 'moment';
import MznCalendarConfigProvider from '../calendar/calendar-config-provider.vue';
import { initializePortals, resetPortals } from '../portal/portal-registry';
import MznDateRangePicker from './date-range-picker.vue';

describe('<MznDateRangePicker /> typing that reorders the range', () => {
  beforeEach(() => {
    resetPortals();
    document.body.innerHTML = '';
    initializePortals();
  });

  afterEach(() => {
    resetPortals();
    document.body.innerHTML = '';
  });

  it('should keep the cursor on the next cell when the typed year swaps from and to', async () => {
    const value = ref<RangePickerValue | undefined>([
      moment('2026-08-01').toISOString(),
      moment('2027-02-28').toISOString(),
    ]);
    const wrapper = mount(MznCalendarConfigProvider, {
      attachTo: document.body,
      props: { locale: 'en-US', methods: CalendarMethodsMoment },
      slots: {
        default: () =>
          h(MznDateRangePicker, {
            onChange: (next?: RangePickerValue) => {
              value.value = next;
            },
            value: value.value,
          }),
      },
    });
    const from = wrapper.findAll('input')[0];
    const element = from.element as HTMLInputElement;

    element.focus();
    await nextTick();
    element.setSelectionRange(0, 0);

    for (const key of '2028') {
      await from.trigger('keydown', { key });
    }

    expect(element.value).toBe('2027-02-28');
    expect(element.selectionStart).toBe(5);
  });
});
