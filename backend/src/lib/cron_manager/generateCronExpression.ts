import { OccurrenceType, Ordinals, Recurrence } from '../types';
import getWeekDay from '../utils/time/getWeekDay';
/*
Cron expression anatomy

┌──────────── minute
│ ┌────────── hour
│ │ ┌──────── day of month
│ │ │ ┌────── month
│ │ │ │ ┌──── day of week
│ │ │ │ │
│ │ │ │ │
* * * * *
*/

interface Params extends Recurrence {
  startDate: Date,
}

function getOrdinalIndex(ordinal: Ordinals): number | undefined {
  switch (ordinal) {
    case Ordinals.FIRST:
      return 1;
    case Ordinals.SECOND:
      return 2;
    case Ordinals.THIRD:
      return 3;
    case Ordinals.FOURTH:
      return 4;
    case Ordinals.FIFTH:
      return 5;
    case undefined:
      return undefined;
    default:
      throw new Error(`Unknown ordinal: ${ordinal}`);
  }
}

function generateCronExpression(recurrence: Params) {
  const {
    concurrence,
    weekDay,
    time,
    startDate,
  } = recurrence;
  const { hour, minute } = time;
  const { type, steps } = concurrence;
  const { value: weekdayName, ordinal } = weekDay;

  const weekDayNumber = getWeekDay(weekdayName);
  const startDay = startDate.getDate();
  const startMonth = startDate.getMonth() + 1;

  const ordinalNumber = getOrdinalIndex(ordinal);

  // Initialize cron exp with time data
  let cronExpression = `${minute} ${hour} `;

  switch (type) {
    case OccurrenceType.DAILY:
      cronExpression += `*/${steps} * *`;
      break;
    case OccurrenceType.WEEKLY:
      cronExpression += `* * ${weekDayNumber}/${steps}`;
      break;
    case OccurrenceType.MONTHLY:
      cronExpression += `${startDay} */${steps} ${weekDayNumber || '*'}${ordinal ? `#${ordinalNumber}` : ''}`;
      break;
    case OccurrenceType.SEMESTRIAL: {
      const nextMonth = (startMonth + 6) > 12 ? (startMonth + 6) - 12 : (startMonth + 6);
      cronExpression += `${startDay} ${startMonth},${nextMonth} *`;
      break;
    }
    case OccurrenceType.YEARLY:
      cronExpression += `${startDay} ${startMonth} *`;
      break;
    default:
      throw new Error('Unsupported occurrence type');
  }

  return cronExpression.trim();
}

export default generateCronExpression;
