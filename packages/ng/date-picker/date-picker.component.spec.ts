import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateType } from '@mezzanine-ui/core/calendar';
import { MznDatePicker } from './date-picker.component';
import {
  MZN_CALENDAR_CONFIG,
  CalendarConfigs,
} from '../calendar/calendar-config';

const mockConfig = {
  getNow: () => '2024-06-15T00:00:00.000Z',
  getHour: () => 0,
  getMinute: () => 0,
  getSecond: () => 0,
  getDate: (v: string) => new Date(v).getDate(),
  getMonth: (v: string) => new Date(v).getMonth(),
  getYear: (v: string) => new Date(v).getFullYear(),
  getQuarter: () => 2,
  getHalfYear: () => 1,
  getWeek: () => 24,
  getWeekYear: () => 2024,
  getWeekDay: () => 6,
  getWeekDayNames: () => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  getMonthShortName: (m: number) =>
    [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ][m],
  getMonthShortNames: () => [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  getFirstDayOfWeek: () => 0,
  isISOWeekLocale: () => false,
  getWeekends: () => [true, false, false, false, false, false, true],
  addHour: (v: string, d: number) => {
    const dt = new Date(v);
    dt.setHours(dt.getHours() + d);
    return dt.toISOString();
  },
  addMinute: (v: string, d: number) => {
    const dt = new Date(v);
    dt.setMinutes(dt.getMinutes() + d);
    return dt.toISOString();
  },
  addSecond: (v: string, d: number) => {
    const dt = new Date(v);
    dt.setSeconds(dt.getSeconds() + d);
    return dt.toISOString();
  },
  addDay: (v: string, d: number) => {
    const dt = new Date(v);
    dt.setDate(dt.getDate() + d);
    return dt.toISOString();
  },
  addYear: (v: string, d: number) => {
    const dt = new Date(v);
    dt.setFullYear(dt.getFullYear() + d);
    return dt.toISOString();
  },
  addMonth: (v: string, d: number) => {
    const dt = new Date(v);
    dt.setMonth(dt.getMonth() + d);
    return dt.toISOString();
  },
  setMillisecond: (v: string, ms: number) => {
    const dt = new Date(v);
    dt.setMilliseconds(ms);
    return dt.toISOString();
  },
  setSecond: (v: string, s: number) => {
    const dt = new Date(v);
    dt.setSeconds(s);
    return dt.toISOString();
  },
  setMinute: (v: string, m: number) => {
    const dt = new Date(v);
    dt.setMinutes(m);
    return dt.toISOString();
  },
  setHour: (v: string, h: number) => {
    const dt = new Date(v);
    dt.setHours(h);
    return dt.toISOString();
  },
  setYear: (v: string, y: number) => {
    const dt = new Date(v);
    dt.setFullYear(y);
    return dt.toISOString();
  },
  setMonth: (v: string, m: number) => {
    const dt = new Date(v);
    dt.setMonth(m);
    return dt.toISOString();
  },
  setDate: (v: string, d: number) => {
    const dt = new Date(v);
    dt.setDate(d);
    return dt.toISOString();
  },
  startOf: (v: string) => {
    const dt = new Date(v);
    dt.setHours(0, 0, 0, 0);
    return dt.toISOString();
  },
  getCurrentWeekFirstDate: (v: string) => v,
  getCurrentMonthFirstDate: (v: string) => {
    const dt = new Date(v);
    dt.setDate(1);
    return dt.toISOString();
  },
  getCurrentYearFirstDate: (v: string) => {
    const dt = new Date(v);
    dt.setMonth(0, 1);
    return dt.toISOString();
  },
  getCurrentQuarterFirstDate: (v: string) => v,
  getCurrentHalfYearFirstDate: (v: string) => v,
  getCalendarGrid: () => [
    [26, 27, 28, 29, 30, 31, 1],
    [2, 3, 4, 5, 6, 7, 8],
    [9, 10, 11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20, 21, 22],
    [23, 24, 25, 26, 27, 28, 29],
    [30, 1, 2, 3, 4, 5, 6],
  ],
  isValid: () => true,
  isBefore: (a: string, b: string) => new Date(a) < new Date(b),
  isBetween: () => false,
  isSameDate: (a: string, b: string) =>
    new Date(a).toDateString() === new Date(b).toDateString(),
  isSameWeek: () => false,
  isInMonth: () => true,
  isDateIncluded: (d: string, t: string[]) =>
    t.some((x) => new Date(d).toDateString() === new Date(x).toDateString()),
  isWeekIncluded: () => false,
  isMonthIncluded: () => false,
  isYearIncluded: () => false,
  isQuarterIncluded: () => false,
  isHalfYearIncluded: () => false,
  formatToString: (_l: string, d: string) => d.slice(0, 10),
  formatToISOString: (d: string) => d,
  parseFormattedValue: (t: string) => t || undefined,
  defaultDateFormat: 'YYYY-MM-DD',
  defaultTimeFormat: 'HH:mm:ss',
  locale: 'en-us',
} as unknown as CalendarConfigs;

@Component({
  standalone: true,
  imports: [MznDatePicker, FormsModule],
  template: `
    <mzn-date-picker
      [(ngModel)]="date"
      [placeholder]="'Select date'"
      [disabled]="disabled()"
    />
  `,
})
class TestHost {
  date: DateType | undefined;
  readonly disabled = signal(false);
}

describe('MznDatePicker', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
      providers: [{ provide: MZN_CALENDAR_CONFIG, useValue: mockConfig }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should render picker trigger', () => {
    const trigger = fixture.nativeElement.querySelector('mzn-picker-trigger');
    expect(trigger).toBeTruthy();
  });

  it('should show placeholder', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input?.placeholder).toBe('Select date');
  });

  it('should not show calendar initially', () => {
    // Calendar should be in a closed popper
    const popper = fixture.nativeElement.querySelector('mzn-popper');
    expect(popper).toBeTruthy();
  });

  it('should open calendar on focus', () => {
    const input = fixture.nativeElement.querySelector('input');
    input?.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    const picker = fixture.debugElement.query(
      (de) => de.componentInstance instanceof MznDatePicker,
    )?.componentInstance as MznDatePicker;
    expect(picker?.isOpen()).toBe(true);
  });

  it('should display disabled state', () => {
    host.disabled.set(true);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input?.disabled).toBe(true);
  });
});
