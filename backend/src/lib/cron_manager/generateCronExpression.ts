import { OccurrenceType, Recurrence } from '../types';
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

function generateCronExpression(recurrence: Params) {
  const {
    occurrence,
    weekDay,
    time,
    startDate,
  } = recurrence;
  const { hour, minute } = time;
  const { type, steps } = occurrence;
  const { value: weekdayName, ordinal } = weekDay;

  let cronExpression = `${minute} ${hour} `;
  const weekDayNumber = getWeekDay(weekdayName);
  const startDay = startDate.getDate();
  const startMonth = startDate.getMonth() + 1;

  switch (type) {
    case OccurrenceType.DAILY:
      cronExpression += `*/${steps} * *`;
      break;
    case OccurrenceType.WEEKLY:
      cronExpression += `* * ${weekDayNumber}/${steps}`;
      break;
    case OccurrenceType.MONTHLY:
      cronExpression += `${startDay} */${steps} ${weekDayNumber || '*'}${ordinal ? `#${ordinal}` : ''}`;
      break;
    case OccurrenceType.SEMESTRIAL:
      cronExpression += `${startDay} ${startMonth}/6 *`;
      break;
    case OccurrenceType.YEARLY:
      cronExpression += `${startDay} ${startMonth} *`;
      break;
    default:
      throw new Error('Unsupported occurrence type');
  }

  return cronExpression.trim();
}

export default generateCronExpression;
