import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { NotificationType } from '@mezzanine-ui/core/notification-center';
import { MznNotificationCenter } from './notification-center.component';

@Component({
  standalone: true,
  imports: [MznNotificationCenter],
  template: `
    <div
      mznNotificationCenter
      [timeStamp]="timeStamp"
      [timeStampLocale]="timeStampLocale"
      [type]="type"
    ></div>
  `,
})
class TestHostComponent {
  timeStamp: number = Date.now();
  timeStampLocale = 'zh-TW';
  type: NotificationType = 'drawer';
}

function createFixture(overrides: Partial<TestHostComponent> = {}): {
  fixture: ReturnType<typeof TestBed.createComponent<TestHostComponent>>;
  getTimeStampText: () => string | undefined;
} {
  const fixture = TestBed.createComponent(TestHostComponent);

  Object.assign(fixture.componentInstance, overrides);
  fixture.detectChanges();

  return {
    fixture,
    getTimeStampText: () =>
      document
        .querySelector('.mzn-notification-center__time-stamp')
        ?.textContent?.trim(),
  };
}

describe('MznNotificationCenter', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 10, 2, 12, 0, 0));

    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('input: timeStamp', () => {
    it('should render localized text instead of hard-coded "now" within one minute', () => {
      const { getTimeStampText } = createFixture({ timeStamp: Date.now() });

      expect(getTimeStampText()).toBe('現在');
    });

    it('should follow timeStampLocale within one minute', () => {
      const { getTimeStampText } = createFixture({
        timeStamp: Date.now(),
        timeStampLocale: 'en-US',
      });

      expect(getTimeStampText()).toBe('now');
    });

    it('should refresh relative text as time passes without input changes', () => {
      const { fixture, getTimeStampText } = createFixture({
        timeStamp: Date.now(),
      });

      jest.advanceTimersByTime(3 * 60 * 1000);
      fixture.detectChanges();

      expect(getTimeStampText()).toBe('3 分鐘前');
    });

    it('should switch to date format after crossing midnight', () => {
      jest.setSystemTime(new Date(2026, 10, 2, 23, 59, 30));

      const { fixture, getTimeStampText } = createFixture({
        timeStamp: Date.now(),
      });

      jest.advanceTimersByTime(60 * 1000);
      fixture.detectChanges();

      expect(getTimeStampText()).toBe('2026-11-02');
    });

    it('should clear refresh timer on destroy', () => {
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
      const { fixture } = createFixture({ timeStamp: Date.now() });

      fixture.destroy();

      expect(clearIntervalSpy).toHaveBeenCalled();

      clearIntervalSpy.mockRestore();
    });
  });
});
