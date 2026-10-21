import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import moment from 'moment';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { RangePickerValue } from '@mezzanine-ui/core/picker';
import {
  MZN_CALENDAR_CONFIG,
  createCalendarConfig,
} from '@mezzanine-ui/ng/calendar';
import { MznTimeRangePicker } from './time-range-picker.component';

@Component({
  standalone: true,
  imports: [MznTimeRangePicker],
  template: `
    <div
      mznTimeRangePicker
      [value]="value()"
      (panelToggled)="toggles.push($event)"
      (rangeChanged)="changes.push($event)"
    ></div>
    <button id="outside" type="button">outside</button>
  `,
})
class HostComponent {
  readonly value = signal<RangePickerValue | undefined>([
    moment('2026-08-01 09:00').toISOString(),
    moment('2026-08-01 18:00').toISOString(),
  ]);
  readonly changes: RangePickerValue[] = [];
  readonly toggles: boolean[] = [];
}

const nextFrame = (): Promise<void> =>
  new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });

describe('MznTimeRangePicker click-away', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should close the panel without committing when clicking outside', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        {
          provide: MZN_CALENDAR_CONFIG,
          useValue: createCalendarConfig(CalendarMethodsMoment),
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);

    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    await nextFrame();

    const input = fixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;

    input.focus();
    fixture.detectChanges();
    await nextFrame();

    expect(
      fixture.nativeElement.querySelector('.mzn-time-panel'),
    ).not.toBeNull();

    (fixture.nativeElement.querySelector('#outside') as HTMLElement).click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.mzn-time-panel')).toBeNull();
    expect(fixture.componentInstance.toggles).toEqual([true, false]);
    expect(fixture.componentInstance.changes).toEqual([]);

    fixture.nativeElement.remove();
  });
});
