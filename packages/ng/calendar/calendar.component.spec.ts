import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { CalendarMethods, DateType } from '@mezzanine-ui/core/calendar';
import { MznCalendar } from './calendar.component';
import { MZN_CALENDAR_CONFIG, createCalendarConfig } from './calendar-config';

/** Minimal mock CalendarMethods for testing. */
const mockMethods: CalendarMethods = {
  getNow: () => '2024-06-15T00:00:00.000Z',
  getSecond: () => 0,
  getMinute: () => 0,
  getHour: () => 0,
  getDate: (v: string) => new Date(v).getDate(),
  getWeek: () => 24,
  getWeekYear: () => 2024,
  getWeekDay: (v: string) => new Date(v).getDay(),
  getMonth: (v: string) => new Date(v).getMonth(),
  getYear: (v: string) => new Date(v).getFullYear(),
  getQuarter: (v: string) => Math.ceil((new Date(v).getMonth() + 1) / 3),
  getHalfYear: (v: string) => (new Date(v).getMonth() < 6 ? 1 : 2),
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
  getCurrentWeekFirstDate: (v: string) => {
    const dt = new Date(v);
    dt.setDate(dt.getDate() - dt.getDay());
    return dt.toISOString();
  },
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
  getCurrentQuarterFirstDate: (v: string) => {
    const dt = new Date(v);
    dt.setMonth(Math.floor(dt.getMonth() / 3) * 3, 1);
    return dt.toISOString();
  },
  getCurrentHalfYearFirstDate: (v: string) => {
    const dt = new Date(v);
    dt.setMonth(dt.getMonth() < 6 ? 0 : 6, 1);
    return dt.toISOString();
  },
  getCalendarGrid: () => [
    [26, 27, 28, 29, 30, 31, 1],
    [2, 3, 4, 5, 6, 7, 8],
    [9, 10, 11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20, 21, 22],
    [23, 24, 25, 26, 27, 28, 29],
    [30, 1, 2, 3, 4, 5, 6],
  ],
  isValid: (v: string) => !isNaN(new Date(v).getTime()),
  isBefore: (a: string, b: string) => new Date(a) < new Date(b),
  isBetween: (v: string, a: string, b: string) =>
    new Date(v) >= new Date(a) && new Date(v) <= new Date(b),
  isSameDate: (a: string, b: string) =>
    new Date(a).toDateString() === new Date(b).toDateString(),
  isSameWeek: () => false,
  isInMonth: (v: string, m: number) => new Date(v).getMonth() === m,
  isDateIncluded: (d: string, targets: string[]) =>
    targets.some(
      (t) => new Date(d).toDateString() === new Date(t).toDateString(),
    ),
  isWeekIncluded: () => false,
  isMonthIncluded: (d: string, targets: string[]) =>
    targets.some(
      (t) =>
        new Date(d).getMonth() === new Date(t).getMonth() &&
        new Date(d).getFullYear() === new Date(t).getFullYear(),
    ),
  isYearIncluded: (d: string, targets: string[]) =>
    targets.some(
      (t) => new Date(d).getFullYear() === new Date(t).getFullYear(),
    ),
  isQuarterIncluded: () => false,
  isHalfYearIncluded: () => false,
  formatToString: (_l: string, d: string, _f: string) => d.slice(0, 10),
  formatToISOString: (d: string) => d,
  parseFormattedValue: (t: string) => t || undefined,
};

const testConfig = createCalendarConfig(mockMethods);

@Component({
  standalone: true,
  imports: [MznCalendar],
  template: `
    <mzn-calendar
      [referenceDate]="refDate()"
      [value]="selected()"
      [mode]="mode()"
      (dateChanged)="onDateChanged($event)"
    />
  `,
})
class TestHost {
  readonly refDate = signal('2024-06-15T00:00:00.000Z');
  readonly selected = signal<DateType | undefined>(undefined);
  readonly mode = signal<string>('day');
  lastEmitted: DateType | undefined;
  onDateChanged(d: DateType): void {
    this.lastEmitted = d;
  }
}

describe('MznCalendar', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
      providers: [{ provide: MZN_CALENDAR_CONFIG, useValue: testConfig }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render in day mode by default', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('mzn-calendar')).toBeTruthy();
    expect(el.querySelector('mzn-calendar-days')).toBeTruthy();
  });

  it('should display calendar controls', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('mzn-calendar-controls')).toBeTruthy();
  });

  it('should display weekday names', () => {
    const el: HTMLElement = fixture.nativeElement;
    const dayOfWeek = el.querySelector('mzn-calendar-day-of-week');
    expect(dayOfWeek).toBeTruthy();
    expect(dayOfWeek?.textContent).toContain('Sun');
    expect(dayOfWeek?.textContent).toContain('Sat');
  });

  it('should render day buttons', () => {
    const el: HTMLElement = fixture.nativeElement;
    const buttons = el.querySelectorAll('mzn-calendar-days button');
    expect(buttons.length).toBeGreaterThan(28);
  });

  it('should emit dateChanged on day click', () => {
    const el: HTMLElement = fixture.nativeElement;
    const buttons = el.querySelectorAll('mzn-calendar-days button');
    // Find button with text "15"
    const btn15 = Array.from(buttons).find(
      (b) => b.textContent?.trim() === '15',
    );
    expect(btn15).toBeTruthy();
    (btn15 as HTMLElement)?.click();
    fixture.detectChanges();
    expect(host.lastEmitted).toBeTruthy();
  });

  it('should switch to month mode when month control is clicked', () => {
    const el: HTMLElement = fixture.nativeElement;
    // The month button is projected content inside controls-main, not an arrow button.
    // Find all buttons inside controls, then pick the one with month text (e.g. "Jun").
    const allBtns = el.querySelectorAll('mzn-calendar-controls button');
    const monthBtn = Array.from(allBtns).find(
      (b) => b.textContent?.trim() === 'Jun',
    ) as HTMLButtonElement | undefined;
    expect(monthBtn).toBeTruthy();
    monthBtn?.click();
    fixture.detectChanges();
    // Should now show months grid
    expect(el.querySelector('mzn-calendar-months')).toBeTruthy();
  });

  it('should show footer control in day mode', () => {
    const el: HTMLElement = fixture.nativeElement;
    const footer = el.querySelector('mzn-calendar-footer-control');
    expect(footer).toBeTruthy();
    expect(footer?.textContent).toContain('Today');
  });

  it('should render in month mode', () => {
    host.mode.set('month');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('mzn-calendar-months')).toBeTruthy();
  });

  it('should render in year mode', () => {
    host.mode.set('year');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('mzn-calendar-years')).toBeTruthy();
  });
});
