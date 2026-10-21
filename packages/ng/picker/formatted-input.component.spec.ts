import { Component, input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import moment from 'moment';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import {
  MZN_CALENDAR_CONFIG,
  createCalendarConfig,
} from '@mezzanine-ui/ng/calendar';
import { MznFormattedInput } from './formatted-input.component';

@Component({
  standalone: true,
  imports: [MznFormattedInput],
  template: `
    <div
      mznFormattedInput
      [format]="format()"
      [value]="value()"
      (valueChanged)="onValueChanged($event.isoValue)"
    ></div>
  `,
})
class HostComponent {
  readonly format = input('YYYY-MM');
  readonly value = signal('');
  readonly committed: string[] = [];

  onValueChanged(isoValue: string): void {
    const formatted = moment(isoValue).format(this.format());

    this.value.set(formatted);
    this.committed.push(formatted);
  }
}

async function setup(
  format: string,
  initialValue: string,
): Promise<{ fixture: ComponentFixture<HostComponent>; el: HTMLInputElement }> {
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

  fixture.componentRef.setInput('format', format);
  fixture.componentInstance.value.set(initialValue);
  fixture.detectChanges();

  const el = fixture.nativeElement.querySelector('input') as HTMLInputElement;

  return { fixture, el };
}

/** Focus the input and place the cursor (or a selection) like a user would. */
function placeCursor(
  fixture: ComponentFixture<HostComponent>,
  el: HTMLInputElement,
  start: number,
  end = start,
): void {
  el.focus();
  fixture.detectChanges();
  el.setSelectionRange(start, end);
}

/** Press each key in turn, letting the formatter restore the cursor in between. */
async function typeKeys(
  fixture: ComponentFixture<HostComponent>,
  el: HTMLInputElement,
  keys: string,
): Promise<void> {
  for (const key of keys) {
    el.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key }),
    );
    fixture.detectChanges();

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  }
}

describe('MznFormattedInput typing over an existing value', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should accept months 10-12 over a month whose second digit is above 2', async () => {
    const { fixture, el } = await setup('YYYY-MM', '2026-08');

    placeCursor(fixture, el, 0, el.value.length);
    await typeKeys(fixture, el, '2025-12');

    expect(el.value).toBe('2025-12');
    expect(fixture.componentInstance.committed).toEqual(['2025-08', '2025-12']);
  });

  it('should accept months 01-09 over a month whose second digit is 0', async () => {
    const { fixture, el } = await setup('YYYY-MM', '2026-10');

    placeCursor(fixture, el, 5);
    await typeKeys(fixture, el, '05');

    expect(el.value).toBe('2026-05');
    expect(fixture.componentInstance.committed).toEqual(['2026-05']);
  });

  it('should accept days 30-31 over a day whose second digit is above 1', async () => {
    const { fixture, el } = await setup('YYYY-MM-DD', '2026-08-15');

    placeCursor(fixture, el, 8);
    await typeKeys(fixture, el, '31');

    expect(el.value).toBe('2026-08-31');
    expect(fixture.componentInstance.committed).toEqual(['2026-08-31']);
  });

  it('should accept hours 20-23 over an hour whose second digit is above 3', async () => {
    const { fixture, el } = await setup('HH:mm', '15:30');

    placeCursor(fixture, el, 0);
    await typeKeys(fixture, el, '21');

    expect(el.value).toBe('21:30');
    expect(fixture.componentInstance.committed).toEqual(['21:30']);
  });

  it('should clear the rest of a cell when typing its first digit and not emit until the cell is complete', async () => {
    const { fixture, el } = await setup('YYYY-MM', '2026-08');

    placeCursor(fixture, el, 5);
    await typeKeys(fixture, el, '1');

    expect(el.value).toBe('2026-1M');
    expect(fixture.componentInstance.committed).toEqual([]);
  });

  it('should still block a completed cell that is out of range', async () => {
    const { fixture, el } = await setup('YYYY-MM', '2026-08');

    placeCursor(fixture, el, 5);
    await typeKeys(fixture, el, '13');

    expect(el.value).toBe('2026-1M');
    expect(fixture.componentInstance.committed).toEqual([]);
  });

  it('should still validate a digit typed into the middle of a filled cell', async () => {
    const { fixture, el } = await setup('YYYY-MM-DD', '2026-08-15');

    placeCursor(fixture, el, 9);
    await typeKeys(fixture, el, '9');

    expect(el.value).toBe('2026-08-19');
    expect(fixture.componentInstance.committed).toEqual(['2026-08-19']);
  });

  it('should pad a first digit that no in-range value starts with (month 5 → 05)', async () => {
    const { fixture, el } = await setup('YYYY-MM', '2026-08');

    placeCursor(fixture, el, 5);
    await typeKeys(fixture, el, '5');

    expect(el.value).toBe('2026-05');
    expect(fixture.componentInstance.committed).toEqual(['2026-05']);
  });

  it('should pad a first day digit above 3 and keep the rest of the value', async () => {
    const { fixture, el } = await setup('YYYY-MM-DD', '2026-08-15');

    placeCursor(fixture, el, 8);
    await typeKeys(fixture, el, '7');

    expect(el.value).toBe('2026-08-07');
    expect(fixture.componentInstance.committed).toEqual(['2026-08-07']);
  });

  it('should pad a first hour digit above 2 and move on to the minutes', async () => {
    const { fixture, el } = await setup('HH:mm', '15:30');

    placeCursor(fixture, el, 0);
    await typeKeys(fixture, el, '945');

    expect(el.value).toBe('09:45');
    expect(fixture.componentInstance.committed).toEqual(['09:30', '09:45']);
  });

  it('should block a first year digit that cannot reach the minimum', async () => {
    const { fixture, el } = await setup('YYYY-MM', '2026-08');

    placeCursor(fixture, el, 0);
    await typeKeys(fixture, el, '0');

    expect(el.value).toBe('2026-08');
    expect(fixture.componentInstance.committed).toEqual([]);
  });

  it('should still emit a pasted ISO value even when it equals the current value', async () => {
    const { fixture, el } = await setup('YYYY-MM', '2026-08');

    el.dispatchEvent(
      Object.assign(new Event('paste', { bubbles: true, cancelable: true }), {
        clipboardData: { getData: () => moment('2026-08-10').toISOString() },
      }),
    );
    fixture.detectChanges();

    expect(fixture.componentInstance.committed).toEqual(['2026-08']);
  });

  it('should not emit when the typed value equals the current value', async () => {
    const { fixture, el } = await setup('YYYY-MM', '2026-08');

    placeCursor(fixture, el, 0, el.value.length);
    await typeKeys(fixture, el, '2026-08');

    expect(el.value).toBe('2026-08');
    expect(fixture.componentInstance.committed).toEqual([]);
  });
});
