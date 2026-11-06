import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarMode } from '@mezzanine-ui/core/calendar';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import { createCalendarConfig, MZN_CALENDAR_CONFIG } from './calendar-config';
import { MznCalendar, type MznCalendarBoardProps } from './calendar.component';

@Component({
  standalone: true,
  imports: [MznCalendar],
  template: `
    <div
      mznCalendar
      [calendarDaysProps]="boardProps('day')"
      [calendarHalfYearsProps]="boardProps('half-year')"
      [calendarMonthsProps]="boardProps('month')"
      [calendarQuartersProps]="boardProps('quarter')"
      [calendarWeeksProps]="boardProps('week')"
      [calendarYearsProps]="boardProps('year')"
      [mode]="mode()"
      referenceDate="2024-06-15"
    ></div>
  `,
})
class TestHost {
  readonly mode = signal<CalendarMode>('day');
  readonly targetMode = signal<CalendarMode | undefined>(undefined);

  private readonly props: MznCalendarBoardProps = {
    className: 'custom-board',
    style: { backgroundColor: 'red' },
  };

  boardProps(mode: CalendarMode): MznCalendarBoardProps | undefined {
    return this.targetMode() === mode ? this.props : undefined;
  }
}

describe('MznCalendar board bundles', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
      providers: [
        {
          provide: MZN_CALENDAR_CONFIG,
          useValue: createCalendarConfig(CalendarMethodsDayjs),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
  });

  const boards: ReadonlyArray<[CalendarMode, string]> = [
    ['day', '[mznCalendarDays]'],
    ['week', '[mznCalendarWeeks]'],
    ['month', '[mznCalendarMonths]'],
    ['year', '[mznCalendarYears]'],
    ['quarter', '[mznCalendarQuarters]'],
    ['half-year', '[mznCalendarHalfYears]'],
  ];

  it.each(boards)(
    'should apply the %s bundle to the board host',
    (mode, selector) => {
      host.mode.set(mode);
      host.targetMode.set(mode);
      fixture.detectChanges();

      const board: HTMLElement = fixture.nativeElement.querySelector(selector);

      expect(board.classList.contains('custom-board')).toBe(true);
      expect(board.classList.contains('mzn-calendar-board')).toBe(true);
      expect(board.style.backgroundColor).toBe('red');
    },
  );

  it('should ignore the bundle of another mode', () => {
    host.mode.set('day');
    host.targetMode.set('month');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.custom-board')).toBeNull();
  });

  it('should not leak the bundles as host attributes', () => {
    host.targetMode.set('day');
    fixture.detectChanges();

    const calendar: HTMLElement =
      fixture.nativeElement.querySelector('[mznCalendar]');

    expect(calendar.hasAttribute('calendardaysprops')).toBe(false);
  });
});
