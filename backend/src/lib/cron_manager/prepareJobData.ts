import { User } from '@/src/database/models';
import { Concurrence } from '../types';
import parseConcurrence from '../utils/concurrence/formatConcurrence';
import generateCronExpression from './generateCronExpression';
import generateNextExecutionDate from './generateNextExecutionDate';

function prepareJobData(user: User, concurrence: Concurrence, startDate: Date) {
  if (!concurrence) return null;

  const userTimezone = user?.dataValues.timezone || 'UTC';
  const parsedConcurrence = parseConcurrence(concurrence, startDate, userTimezone);
  const {
    time,
    endDate,
    weekDay,
  } = parsedConcurrence;

  const { minute, hour, timezone } = time;
  const { steps, type } = concurrence;

  const cronExpression = generateCronExpression({
    recurrence: {
      type,
      steps,
    },
    startDate,
    time: {
      minute,
      hour,
      timezone,
    },
    weekDay,
  });

  const nextExecutionDate = generateNextExecutionDate(cronExpression, { tz: timezone });

  return {
    cronExpression,
    concurrenceEndDate: endDate,
    nextExecutionDate,
    timezone,
  };
}

export default prepareJobData;
