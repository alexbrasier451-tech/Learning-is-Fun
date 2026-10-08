import type { LocalDate, WeekKey } from './contracts';
import type { ReconcileCompetitionWeek } from './contracts';
import { closeWeek, validateCompetitionState } from './standings';

export type CalendarErrorCode = 'invalid-date' | 'unsupported-zone';
export class CalendarError extends Error {
  readonly code: CalendarErrorCode;

  constructor(code: CalendarErrorCode, message: string) {
    super(message);
    this.name = 'CalendarError';
    this.code = code;
  }
}

function invalidDate(message: string): never {
  throw new CalendarError('invalid-date', message);
}

/** UTC is a neutral civil-date carrier, never the instant of London midnight.
 * setUTCFullYear also avoids Date.UTC's special handling of years 0–99. */
function dateCarrier(date: LocalDate): Date {
  if (typeof date !== 'string' || date.length !== 10 || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return invalidDate('Expected a Gregorian YYYY-MM-DD date');
  }
  const year = Number(date.slice(0, 4));
  const month = Number(date.slice(5, 7));
  const day = Number(date.slice(8, 10));
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31) {
    return invalidDate('Date is outside the supported Gregorian range');
  }
  const carrier = new Date(0);
  carrier.setUTCFullYear(year, month - 1, day);
  carrier.setUTCHours(0, 0, 0, 0);
  if (carrier.getUTCFullYear() !== year || carrier.getUTCMonth() !== month - 1
    || carrier.getUTCDate() !== day) {
    return invalidDate('Date does not exist in the Gregorian calendar');
  }
  return carrier;
}

function dateFromCarrier(carrier: Date): LocalDate {
  const year = carrier.getUTCFullYear();
  if (!Number.isFinite(carrier.getTime()) || year < 1 || year > 9999) {
    return invalidDate('Date is outside years 0001–9999');
  }
  return `${String(year).padStart(4, '0')}-${String(carrier.getUTCMonth() + 1).padStart(2, '0')}-${String(carrier.getUTCDate()).padStart(2, '0')}`;
}

/** Extract numeric parts under explicit London rules, independent of host zone.
 * Era prevents a BCE instant being misread as the same positive civil year. */
export function localDateAt(epochMs: number): LocalDate {
  if (typeof epochMs !== 'number' || !Number.isFinite(epochMs)
    || !Number.isFinite(new Date(epochMs).getTime())) {
    return invalidDate('Expected a finite, supported epoch in milliseconds');
  }
  let formatter: Intl.DateTimeFormat;
  try {
    formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London', calendar: 'gregory', numberingSystem: 'latn',
      year: 'numeric', month: '2-digit', day: '2-digit', era: 'short',
    });
    const resolved = formatter.resolvedOptions();
    if (resolved.timeZone !== 'Europe/London' || resolved.calendar !== 'gregory'
      || resolved.numberingSystem !== 'latn') {
      throw new Error('Required explicit London calendar is unavailable');
    }
  } catch {
    throw new CalendarError('unsupported-zone', 'Europe/London Gregorian date formatting is unavailable');
  }
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = formatter.formatToParts(epochMs);
  } catch {
    throw new CalendarError('unsupported-zone', 'Europe/London numeric date parts are unavailable');
  }
  const part = (type: Intl.DateTimeFormatPartTypes): string | undefined =>
    parts.find(value => value.type === type)?.value;
  const year = part('year');
  const month = part('month');
  const day = part('day');
  if (part('era') !== 'AD' || year === undefined || !/^\d{1,4}$/.test(year)
    || month === undefined || day === undefined) {
    return invalidDate('London date is outside the supported Gregorian range');
  }
  return dateFromCarrier(dateCarrier(`${year.padStart(4, '0')}-${month}-${day}`));
}

/** Monday's local civil date, including weeks spanning calendar years. */
export function weekKeyFor(date: LocalDate): WeekKey {
  const carrier = dateCarrier(date);
  carrier.setUTCDate(carrier.getUTCDate() - (carrier.getUTCDay() + 6) % 7);
  return dateFromCarrier(carrier);
}

/** Adds civil days, rather than elapsed London hours, through either DST change. */
export function addCalendarDays(date: LocalDate, days: number): LocalDate {
  const carrier = dateCarrier(date);
  if (!Number.isSafeInteger(days)) return invalidDate('Calendar-day offset must be a safe integer');
  carrier.setUTCDate(carrier.getUTCDate() + days);
  return dateFromCarrier(carrier);
}

/** One explicit observation governs closure and learning/reward adapters. The
 * returned competition and profile records must be committed atomically by WP04.
 * No skipped inactive week is fabricated; rollback never reopens a closed week. */
export const reconcileCompetitionWeek: ReconcileCompetitionWeek = (input, nowEpochMs) => {
  const observedLocalDate = localDateAt(nowEpochMs);
  const observedWeek = weekKeyFor(observedLocalDate);
  const { competition, profiles } = input;
  const issues = validateCompetitionState(competition, profiles);
  if (issues.length > 0) throw new RangeError(`Invalid competition: ${issues[0].path}: ${issues[0].message}`);
  const latest = competition.latestOpenedWeek;
  const personalRecords = Object.fromEntries(profiles.map(profile => [profile.profileId, profile.personalRecords]));
  if (latest !== null && observedWeek <= latest) {
    return {
      nextCompetition: competition, nextPersonalRecordsByProfile: personalRecords,
      context: { observedLocalDate, activeWeek: latest, clockRollback: observedWeek < latest },
      closedWeekChanges: [],
    };
  }
  const closure = closeWeek(input);
  const result = closure.result;
  return {
    nextCompetition: {
      ...competition, latestOpenedWeek: observedWeek, currentScores: {}, currentSlots: {},
      archives: result === null ? competition.archives : [...competition.archives, result].slice(-52),
    },
    nextPersonalRecordsByProfile: closure.nextPersonalRecordsByProfile,
    context: { observedLocalDate, activeWeek: observedWeek, clockRollback: false },
    closedWeekChanges: result === null ? [] : [{ week: result.week, result }],
  };
};
