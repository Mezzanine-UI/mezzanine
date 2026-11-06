import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DateType } from '@mezzanine-ui/core/calendar';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import dayjs from 'dayjs';
import {
  createCalendarConfig,
  MZN_CALENDAR_CONFIG,
} from '../calendar/calendar-config';
import type { MznCalendarFooterActionsProps } from '../calendar/range-calendar.component';
import { MznDateRangePicker } from './date-range-picker.component';

@Component({
  standalone: true,
  imports: [FormsModule, MznDateRangePicker],
  template: `
    <div
      mznDateRangePicker
      [(ngModel)]="range"
      [actions]="actions()"
      [confirmMode]="confirmMode()"
      [referenceDate]="'2024-06-15'"
    ></div>
  `,
})
class TestHost {
  readonly actions = signal<MznCalendarFooterActionsProps | undefined>(
    undefined,
  );
  readonly confirmMode = signal<'immediate' | 'manual'>('manual');
  readonly picker = viewChild.required(MznDateRangePicker);
  range: [DateType, DateType] | undefined;
}

describe('MznDateRangePicker actions', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  const footerButtons = (): HTMLButtonElement[] =>
    Array.from(
      document.querySelectorAll<HTMLButtonElement>(
        '[mznCalendarFooterActions] button',
      ),
    );

  const clickDay = async (day: string): Promise<void> => {
    const cell = Array.from(
      document.querySelectorAll<HTMLButtonElement>('[mznCalendarDays] button'),
    ).find((button) => button.textContent?.trim() === day && !button.disabled);

    cell?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

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
          useValue: createCalendarConfig(CalendarMethodsDayjs),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should default to Cancel and Confirm in manual mode', async () => {
    await open();

    expect(footerButtons().map((b) => b.textContent?.trim())).toEqual([
      'Cancel',
      'Confirm',
    ]);
  });

  it('should keep the confirm button disabled until the range completes', async () => {
    await open();

    expect(footerButtons()[1].disabled).toBe(true);

    await clickDay('10');
    await clickDay('12');

    expect(footerButtons()[1].disabled).toBe(false);
  });

  it('should relabel the buttons through the bundle', async () => {
    host.actions.set({
      primaryButtonProps: { children: '確認' },
      secondaryButtonProps: { children: '取消' },
    });
    await open();

    expect(footerButtons().map((b) => b.textContent?.trim())).toEqual([
      '取消',
      '確認',
    ]);
  });

  it('should commit the staged range on confirm', async () => {
    await open();
    await clickDay('10');
    await clickDay('12');

    footerButtons()[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(dayjs(host.range?.[0]).format('YYYY-MM-DD')).toBe('2024-06-10');
  });

  it('should let the bundle replace the confirm handler', async () => {
    const onClick = jest.fn();

    host.actions.set({ primaryButtonProps: { onClick } });
    await open();
    await clickDay('10');
    await clickDay('12');

    footerButtons()[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(host.range).toBeUndefined();
  });

  it('should not render actions in immediate mode without a bundle', async () => {
    host.confirmMode.set('immediate');
    await open();

    expect(footerButtons()).toHaveLength(0);
  });

  it('should render actions and not auto-commit in immediate mode with a bundle', async () => {
    host.actions.set({
      primaryButtonProps: { children: '確認' },
      secondaryButtonProps: { children: '取消' },
    });
    host.confirmMode.set('immediate');
    await open();

    expect(footerButtons().map((b) => b.textContent?.trim())).toEqual([
      '取消',
      '確認',
    ]);

    await clickDay('10');
    await clickDay('12');

    expect(host.range).toBeUndefined();
    expect(host.picker().isOpen()).toBe(true);
  });
});
