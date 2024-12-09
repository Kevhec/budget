function formatConcurrence(
  concurrenceFormData: ConcurrenceFormData,
  startDate: Date,
): ApiRecurrence | null {
  const {
    concurrenceDefault,
    concurrenceType,
    concurrenceSteps,
    concurrenceWeekDay,
    concurrenceTime,
    concurrenceMonthSelect,
    concurrenceEndDate,
  } = concurrenceFormData;

  if (concurrenceDefault === 'none') {
    return null;
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
    endDate: concurrenceEndDate,
  };

  return recurrence;
}

export default formatConcurrence;
