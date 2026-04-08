import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { DateType } from '@mezzanine-ui/core/calendar';
import { MznTimePanel } from './time-panel.component';
import {
  MZN_CALENDAR_CONFIG,
  CalendarConfigs,
} from '../calendar/calendar-config';

const mockMethods = {
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
} as unknown as CalendarConfigs;

const testConfig = {
  ...mockMethods,
  defaultDateFormat: 'YYYY-MM-DD',
  defaultTimeFormat: 'HH:mm:ss',
  locale: 'en-us',
} as CalendarConfigs;

@Component({
  standalone: true,
  imports: [MznTimePanel],
  template: `
    <mzn-time-panel
      [value]="time()"
      [hideSecond]="hideSecond()"
      (timeChanged)="onTimeChange($event)"
      (confirmed)="onConfirm()"
      (cancelled)="onCancel()"
    />
  `,
})
class TestHost {
  readonly time = signal<DateType | undefined>('2024-06-15T10:30:45.000Z');
  readonly hideSecond = signal(false);
  lastChanged: DateType | undefined;
  confirmCalled = false;
  cancelCalled = false;
  onTimeChange(d: DateType): void {
    this.lastChanged = d;
  }
  onConfirm(): void {
    this.confirmCalled = true;
  }
  onCancel(): void {
    this.cancelCalled = true;
  }
}

describe('MznTimePanel', () => {
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

  it('should render three columns by default', () => {
    const columns = fixture.nativeElement.querySelectorAll(
      'mzn-time-panel-column',
    );
    expect(columns.length).toBe(3);
  });

  it('should render two columns when hideSecond is true', () => {
    host.hideSecond.set(true);
    fixture.detectChanges();
    const columns = fixture.nativeElement.querySelectorAll(
      'mzn-time-panel-column',
    );
    expect(columns.length).toBe(2);
  });

  it('should render hour units (0-23)', () => {
    const firstColumn = fixture.nativeElement.querySelector(
      'mzn-time-panel-column',
    );
    const buttons = firstColumn?.querySelectorAll('button');
    expect(buttons?.length).toBe(24);
    expect(buttons?.[0]?.textContent?.trim()).toBe('00');
    expect(buttons?.[23]?.textContent?.trim()).toBe('23');
  });

  it('should render footer actions', () => {
    const actions = fixture.nativeElement.querySelector(
      'mzn-calendar-footer-actions',
    );
    expect(actions).toBeTruthy();
  });

  it('should emit confirmed on Ok click', () => {
    const okBtn = fixture.nativeElement.querySelectorAll(
      'mzn-calendar-footer-actions button',
    )[1];
    okBtn?.click();
    fixture.detectChanges();
    expect(host.confirmCalled).toBe(true);
  });

  it('should emit cancelled on Cancel click', () => {
    const cancelBtn = fixture.nativeElement.querySelectorAll(
      'mzn-calendar-footer-actions button',
    )[0];
    cancelBtn?.click();
    fixture.detectChanges();
    expect(host.cancelCalled).toBe(true);
  });

  it('should emit timeChanged on column unit click', () => {
    const firstColumn = fixture.nativeElement.querySelector(
      'mzn-time-panel-column',
    );
    const buttons = firstColumn?.querySelectorAll('button');
    // Click hour 5
    buttons?.[5]?.click();
    fixture.detectChanges();
    expect(host.lastChanged).toBeTruthy();
  });
});
