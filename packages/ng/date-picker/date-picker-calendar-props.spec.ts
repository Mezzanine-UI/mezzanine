import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CalendarLocale, DateType } from '@mezzanine-ui/core/calendar';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import dayjs from 'dayjs';
import {
  createCalendarConfig,
  MZN_CALENDAR_CONFIG,
} from '../calendar/calendar-config';
import {
  MznDatePicker,
  type MznDatePickerCalendarProps,
} from './date-picker.component';

@Component({
  standalone: true,
  imports: [FormsModule, MznDatePicker],
  template: `
    <div
      mznDatePicker
      [(ngModel)]="date"
      [calendarProps]="calendarProps()"
      [isMonthDisabled]="isMonthDisabled()"
      mode="month"
    ></div>
  `,
})
class TestHost {
  readonly calendarProps = signal<MznDatePickerCalendarProps | undefined>(
    undefined,
  );
  date: DateType | undefined;
  readonly isMonthDisabled = signal<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  readonly picker = viewChild.required(MznDatePicker);
}

describe('MznDatePicker calendarProps', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  const footerButton = (): HTMLButtonElement | null =>
    document.querySelector('[mznCalendarFooterControl] button');

  const open = async (): Promise<void> => {
    fixture.detectChanges();
    host.picker().isOpen.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
      providers: [
        {
          provide: MZN_CALENDAR_CONFIG,
          useValue: createCalendarConfig(CalendarMethodsDayjs, {
            locale: CalendarLocale.ZH_TW,
          }),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should render the default footer control', async () => {
    await open();

    expect(footerButton()?.textContent?.trim()).toBe('This month');
  });

  it('should hide the footer control with disabledFooterControl', async () => {
    host.calendarProps.set({ disabledFooterControl: true });
    await open();

    expect(footerButton()).toBeNull();
  });

  it('should relabel the footer control through the bundle', async () => {
    host.calendarProps.set({
      calendarFooterControlProps: { children: { month: '本月' } },
    });
    await open();

    expect(footerButton()?.textContent?.trim()).toBe('本月');
  });

  it('should forward a board bundle to the calendar', async () => {
    host.calendarProps.set({
      calendarMonthsProps: { className: 'custom-board' },
    });
    await open();

    expect(
      document.querySelector('[mznCalendarMonths].custom-board'),
    ).not.toBeNull();
  });

  it('should not select a disabled current month', async () => {
    host.isMonthDisabled.set((date) => dayjs(date).isSame(dayjs(), 'month'));
    await open();

    expect(footerButton()?.hasAttribute('disabled')).toBe(true);

    footerButton()?.click();
    fixture.detectChanges();

    expect(host.date).toBeUndefined();
  });
});
