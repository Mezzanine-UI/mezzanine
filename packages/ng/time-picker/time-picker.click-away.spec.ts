import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import moment from 'moment';
import { DateType } from '@mezzanine-ui/core/calendar';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import {
  MZN_CALENDAR_CONFIG,
  createCalendarConfig,
} from '@mezzanine-ui/ng/calendar';
import { MznTimePicker } from './time-picker.component';

@Component({
  standalone: true,
  imports: [MznTimePicker],
  template: `
    <div
      mznTimePicker
      [value]="value()"
      (panelToggled)="toggles.push($event)"
      (timeChanged)="changes.push($event)"
    ></div>
    <button id="outside" type="button">outside</button>
  `,
})
class HostComponent {
  readonly value = signal<DateType | undefined>(
    moment('2026-08-01 15:30').toISOString(),
  );
  readonly changes: (DateType | undefined)[] = [];
  readonly toggles: boolean[] = [];
}

const nextFrame = (): Promise<void> =>
  new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });

describe('MznTimePicker click-away', () => {
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
    // The panel stays in the DOM; the popper hides it with display: none
    const popper = (): HTMLElement =>
      fixture.nativeElement.querySelector('[mznPopper]') as HTMLElement;

    input.focus();
    fixture.detectChanges();
    await nextFrame();

    expect(popper().style.display).not.toBe('none');

    (fixture.nativeElement.querySelector('#outside') as HTMLElement).click();
    fixture.detectChanges();

    expect(popper().style.display).toBe('none');
    expect(fixture.componentInstance.toggles).toEqual([true, false]);
    expect(fixture.componentInstance.changes).toEqual([]);

    fixture.nativeElement.remove();
  });
});
