import { Temporal } from '@js-temporal/polyfill';

// Register the polyfill on globalThis so Temporal is available before
// CalendarMethodsTemporal is imported. Mirrors what apps must do at their
// own entry on runtimes that lack native Temporal (Safari, Node 22).
(globalThis as { Temporal?: unknown }).Temporal = Temporal;

import { CalendarLocale } from '@mezzanine-ui/core/calendar';
import { cleanup, render } from '../../__test-utils__';
import { CalendarConfigProviderTemporal, useCalendarContext } from './';

afterEach(cleanup);

function ContextProbe() {
  const ctx = useCalendarContext();
  return (
    <div>
      <span data-testid="locale">{ctx.locale}</span>
      <span data-testid="iso-now">{ctx.getNow()}</span>
      <span data-testid="formatted">
        {ctx.formatToString(ctx.locale, '2026-05-05T12:00:00Z', 'YYYY-MM-DD')}
      </span>
    </div>
  );
}

describe('CalendarConfigProviderTemporal', () => {
  it('injects Temporal-backed CalendarMethods into context', () => {
    const { getByTestId } = render(
      <CalendarConfigProviderTemporal locale={CalendarLocale.ZH_TW}>
        <ContextProbe />
      </CalendarConfigProviderTemporal>,
    );

    expect(getByTestId('locale').textContent).toBe('zh-tw');
    // ISO 8601 string from getNow().
    expect(getByTestId('iso-now').textContent).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
    );
    // formatToString uses the moment-style YYYY-MM-DD token.
    expect(getByTestId('formatted').textContent).toMatch(/^2026-05-/);
  });

  it('applies custom defaultDateFormat / defaultTimeFormat', () => {
    function FormatProbe() {
      const ctx = useCalendarContext();
      return (
        <>
          <span data-testid="date-fmt">{ctx.defaultDateFormat}</span>
          <span data-testid="time-fmt">{ctx.defaultTimeFormat}</span>
        </>
      );
    }

    const { getByTestId } = render(
      <CalendarConfigProviderTemporal
        defaultDateFormat="YYYY/MM/DD"
        defaultTimeFormat="HH:mm"
      >
        <FormatProbe />
      </CalendarConfigProviderTemporal>,
    );

    expect(getByTestId('date-fmt').textContent).toBe('YYYY/MM/DD');
    expect(getByTestId('time-fmt').textContent).toBe('HH:mm');
  });
});
