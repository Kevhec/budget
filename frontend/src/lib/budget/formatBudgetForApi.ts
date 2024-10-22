import {
  ApiBudget,
  ApiRecurrence, CreateBudgetParams, OccurrenceType, Ordinals, WeekDays,
} from '@/types';
import { format } from '@formkit/tempo';
import { DEFAULT_CONCURRENCES, ENGLISH_ORDINALS } from '../constants';
import { getDayOrdinalNumber, getTimezone } from '../utils';

// TODO: Extract concurrency related code to it's own module

type DefaultConcurrency = typeof DEFAULT_CONCURRENCES[number];

function getDefaultRecurrence(
  type: Exclude<DefaultConcurrency, 'none' | 'custom'>,
  startDate: Date,
  ordinalIndex: number,
) {
  const timeDefinition = {
    hour: startDate.getHours(),
    minute: startDate.getMinutes(),
    timezone: getTimezone(),
  };

  const weekDayName = format(startDate, 'dddd', 'en').toLowerCase() as WeekDays;

  const defaultMapping: Record<Exclude<DefaultConcurrency, 'none' | 'custom'>, ApiRecurrence> = {
    daily: {
      concurrence: {
        type: OccurrenceType.DAILY,
        steps: 1,
      },
      time: timeDefinition,
    },
    weekly: {
      concurrence: {
        type: OccurrenceType.WEEKLY,
        steps: 1,
      },
      weekDay: {
        value: weekDayName,
      },
      time: timeDefinition,
    },
    monthly: {
      concurrence: {
        type: OccurrenceType.MONTHLY,
        steps: 1,
      },
      weekDay: {
        value: weekDayName,
        ordinal: ENGLISH_ORDINALS[ordinalIndex] as Ordinals,
      },
      time: timeDefinition,
    },
    yearly: {
      concurrence: {
        type: OccurrenceType.YEARLY,
        steps: 1,
      },
      time: timeDefinition,
    },
  };

  return defaultMapping[type];
}

interface ConcurrenceFormData {
  concurrenceDefault: DefaultConcurrency
  concurrenceType: OccurrenceType,
  concurrenceSteps: number,
  concurrenceWeekDay: WeekDays,
  concurrenceTime: Date,
  concurrenceMonthSelect: 'exact' | 'ordinal'
}

function formatConcurrence(
  concurrenceFormData: ConcurrenceFormData,
  startDate: Date,
  endDate?: Date,
) {
  const {
    concurrenceDefault,
    concurrenceType,
    concurrenceSteps,
    concurrenceWeekDay,
    concurrenceTime,
    concurrenceMonthSelect,
  } = concurrenceFormData;

  if (concurrenceDefault === 'none') {
    return undefined;
  }

  const weekDayOrdinalIndex = getDayOrdinalNumber(startDate.getDate()) - 1;

  if (
    concurrenceDefault !== 'custom'
  ) {
    const defaultRecurrence = getDefaultRecurrence(
      concurrenceDefault,
      startDate,
      weekDayOrdinalIndex,
    );

    return defaultRecurrence;
  }

  const [hour, minute] = format(concurrenceTime || new Date(), 'H-m')
    .split('-')
    .map(Number);

  const monthOrdinalCheck = concurrenceType === 'monthly' && concurrenceMonthSelect === 'ordinal';

  const hasWeekDay = (
    concurrenceType === 'weekly'
    || monthOrdinalCheck
  );

  const ordinal = monthOrdinalCheck
    ? ENGLISH_ORDINALS[weekDayOrdinalIndex] as Ordinals
    : undefined;

  const recurrence: ApiRecurrence = {
    concurrence: {
      type: concurrenceType as OccurrenceType,
      steps: concurrenceSteps || 1,
    },
    weekDay: {
      value: hasWeekDay ? concurrenceWeekDay as WeekDays : undefined,
      ordinal,
    },
    time: {
      hour,
      minute,
      timezone: getTimezone(),
    },
    endDate,
  };

  return recurrence;
}

function extractConcurrenceData(data: CreateBudgetParams) {
  return Object.fromEntries(
    Object.entries(data).filter(([key]) => key.startsWith('concurrence')),
  ) as unknown as ConcurrenceFormData;
}

// TODO: CHANGE NAME TO RECURRENCE ON FORMS AND EVERYTHING PLEASE PLEASE VERY PLEASE

// TODO: CHANGE NAME PROPERTY TO DESCRIPTION VERY PLEEEEASSEEEE

function formatBudgetForApi(data: CreateBudgetParams): ApiBudget | null {
  const concurrenceFormData = extractConcurrenceData(data);
  const concurrenceData = formatConcurrence(
    concurrenceFormData,
    data.startDate,
    data.endDate,
  );

  const formattedBudget: ApiBudget = {
    name: data.name,
    totalAmount: data.totalAmount,
    startDate: data.startDate,
    endDate: data.withEndDate ? data.endDate : undefined,
    recurrence: concurrenceData,
  };

  return formattedBudget;
}

export default formatBudgetForApi;
