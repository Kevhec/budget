import { User } from '@/src/database/models';
import getDateTimeDifference from '../utils/time/getDateTimeDifference';
import generateNextExecutionDate from './generateNextExecutionDate';
import { Job, scheduleCronTask } from './taskScheduler';
import { Concurrence, JobTypes } from '../types';
import prepareJobData from './prepareJobData';
import upsertCronTask from './upsertCronTask';
import upsertCronJob from './upsertCronJob';

interface Params<T> {
  user: User
  concurrence: Concurrence
  startDate: Date
  particularJobArgs: T
  jobName: JobTypes
  startDateOnly?: boolean
  existingTaskId?: string
  existingJobId?: string
}

async function setupOrUpdateJob<T>({
  user,
  concurrence,
  startDate,
  startDateOnly,
  jobName,
  particularJobArgs,
  existingTaskId,
  existingJobId,
}: Params<T>) {
  const {
    cronExpression,
    endDate: concurrenceEndDate,
    timezone,
  } = prepareJobData(user, concurrence, startDate);

  // When recurring the end date for each budget is calculated automatically, not by the user
  const nextExecutionDate = generateNextExecutionDate(cronExpression, { tz: timezone });

  const intervalMilliseconds = getDateTimeDifference(startDate, nextExecutionDate);

  const newOrUpdatedTaskId = await upsertCronTask({
    user,
    data: {
      cronExpression,
      endDate: concurrenceEndDate,
      timezone,
    },
    taskId: existingTaskId,
  });

  const job = await upsertCronJob({
    user,
    data: {
      jobName,
      jobArgs: {
        ...particularJobArgs,
        intervalMilliseconds: startDateOnly ? null : intervalMilliseconds,
        userId: user?.id || '',
        cronTaskId: newOrUpdatedTaskId,
      },
    },
    taskId: newOrUpdatedTaskId,
    jobId: existingJobId,
  });

  const typedJob = job as unknown as Job;

  scheduleCronTask({
    cronExpression,
    endDate: concurrenceEndDate,
    timezone,
    taskId: newOrUpdatedTaskId,
    jobs: [typedJob],
  });

  return {
    nextExecutionDate,
    taskId: newOrUpdatedTaskId.toString(),
  };
}

export default setupOrUpdateJob;
