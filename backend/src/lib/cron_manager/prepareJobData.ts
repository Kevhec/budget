import { User } from '@/src/database/models';
import { Concurrence } from '../types';
import parseConcurrence from '../utils/concurrence/formatConcurrence';
import generateCronExpression from './generateCronExpression';

function prepareJobData(user: User, concurrence: Concurrence, startDate: Date) {
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

  return {
    cronExpression,
    endDate,
    timezone,
  };
}

export default prepareJobData;
