import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateType } from '@mezzanine-ui/core/calendar';
import { MznTimePicker } from './time-picker.component';
import {
  MZN_CALENDAR_CONFIG,
  CalendarConfigs,
} from '../calendar/calendar-config';

const mockConfig = {
  getNow: () => '2024-06-15T10:30:45.000Z',
  getHour: (v: string) => new Date(v).getUTCHours(),
  getMinute: (v: string) => new Date(v).getUTCMinutes(),
  getSecond: (v: string) => new Date(v).getUTCSeconds(),
  setHour: (v: string, h: number) => {
    const d = new Date(v);
    d.setUTCHours(h);
    return d.toISOString();
  },
  setMinute: (v: string, m: number) => {
    const d = new Date(v);
    d.setUTCMinutes(m);
    return d.toISOString();
  },
  setSecond: (v: string, s: number) => {
    const d = new Date(v);
    d.setUTCSeconds(s);
    return d.toISOString();
  },
  startOf: (v: string) => {
    const d = new Date(v);
    d.setUTCHours(0, 0, 0, 0);
    return d.toISOString();
  },
  formatToString: (_l: string, d: string) => d.slice(11, 19),
  formatToISOString: (d: string) => d,
  defaultDateFormat: 'YYYY-MM-DD',
  defaultTimeFormat: 'HH:mm:ss',
  locale: 'en-us',
} as unknown as CalendarConfigs;

@Component({
  standalone: true,
  imports: [MznTimePicker, FormsModule],
  template: `<mzn-time-picker [(ngModel)]="time" placeholder="Select time" />`,
})
class TestHost {
  time: DateType | undefined;
}

describe('MznTimePicker', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
      providers: [{ provide: MZN_CALENDAR_CONFIG, useValue: mockConfig }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should render picker trigger', () => {
    expect(
      fixture.nativeElement.querySelector('mzn-picker-trigger'),
    ).toBeTruthy();
  });

  it('should show placeholder', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input?.placeholder).toBe('Select time');
  });

  it('should open panel on input focus', () => {
    const input = fixture.nativeElement.querySelector('input');
    input?.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
    const picker = fixture.debugElement.children[0]
      .componentInstance as MznTimePicker;
    expect(picker.isOpen()).toBe(true);
  });
});
