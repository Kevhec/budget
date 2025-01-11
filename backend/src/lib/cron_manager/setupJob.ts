import CronJob from '@/src/database/models/cronJobs';
import { User } from '@/src/database/models';
import CronTask from '@/src/database/models/cronTask';
import parseConcurrence from '../utils/concurrence/formatConcurrence';
import getDateTimeDifference from '../utils/time/getDateTimeDifference';
import generateCronExpression from './generateCronExpression';
import generateNextExecutionDate from './generateNextExecutionDate';
import { Job, scheduleCronTask } from './taskScheduler';
import { Concurrence, JobTypes } from '../types';

interface Params<T> {
  user: User
  concurrence: Concurrence
  startDate: Date
  particularJobArgs: T
  startDateOnly?: boolean
}

async function setupJob<T>({
  user,
  concurrence,
  startDate,
  startDateOnly,
  particularJobArgs,
}: Params<T>) {
  const userTimezone = user?.dataValues.timezone || 'UTC';

  const parsedConcurrence = parseConcurrence(concurrence, startDate, userTimezone);
  const {
    time,
    endDate: parsedEndDate,
    weekDay,
  } = parsedConcurrence;

  const { minute, hour, timezone } = time;
  const { steps, type } = concurrence;

  const concurrenceEndDate = parsedEndDate || undefined;

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

  // When recurring the end date for each budget is calculated automatically, not by the user
  const nextExecutionDate = generateNextExecutionDate(cronExpression, { tz: timezone });

  const intervalMilliseconds = getDateTimeDifference(startDate, nextExecutionDate);

  const newTask = await CronTask.create({
    cronExpression,
    endDate: concurrenceEndDate || null,
    timezone,
    userId: user?.id,
  });

  const job = await CronJob.create({
    jobName: JobTypes.CREATE_BUDGET,
    jobArgs: {
      ...particularJobArgs,
      intervalMilliseconds: startDateOnly ? null : intervalMilliseconds,
      userId: user?.id || '',
      cronTaskId: newTask.id,
    },
    cronTaskId: newTask.id,
    userId: user?.id,
  });

  const typedJob = job as unknown as Job;

  const taskId = newTask.dataValues.id;

  scheduleCronTask({
    cronExpression,
    endDate: concurrenceEndDate,
    timezone,
    taskId,
    jobs: [typedJob],
  });

  return {
    nextExecutionDate,
    taskId: taskId.toString(),
  };
}

export default setupJob;
