import { User } from '@/src/database/models';
import Concurrence from '@/src/database/models/concurrence';
import CronTask from '@/src/database/models/cronTask';
import CronJob from '@/src/database/models/cronJobs';
import setupOrUpdateJob from './setupJob';
import {
  createConcurrence as createConcurrenceJob,
} from '../jobs';
import { JobTypes, JSONValue, type Concurrence as ConcurrenceType } from '../types';
import { stopCronTask } from './taskScheduler';
import parseConcurrenceObj from '../jobs/parseConcurrenceObj';

interface Params {
  user: User
  concurrence: ConcurrenceType
  startDate: Date
  jobName: JobTypes
  jobArgs: JSONValue
  startDateOnly?: boolean
  prevConcurrenceId?: string | null
  prevCronTaskId?: string | null
}

async function upsertConcurrence({
  user,
  jobName,
  jobArgs,
  concurrence,
  startDate,
  startDateOnly = false,
  prevConcurrenceId,
  prevCronTaskId,
}: Params) {
  try {
    // Add concurrence to existing non-concurrent transaction
    if (!prevConcurrenceId || !prevCronTaskId) {
      const newConcurrence = await createConcurrenceJob({ concurrence, user });

      const concurrenceId = String(newConcurrence.id);

      const {
        taskId,
        nextExecutionDate,
      } = await setupOrUpdateJob({
        user,
        concurrence,
        startDate,
        startDateOnly,
        jobName,
        particularJobArgs: jobArgs,
      });

      return {
        nextExecutionDate,
        concurrenceId,
        taskId,
      };
    }

    // Modify existing concurrence data
    const associatedConcurrence = await Concurrence.findByPk(prevConcurrenceId);
    const associatedTask = await CronTask.findByPk(prevCronTaskId);
    const associatedJob = await CronJob.findOne({
      where: {
        userId: user.id,
        cronTaskId: associatedTask?.id,
        jobName: JobTypes.CREATE_TRANSACTION,
      },
    });

    if (!associatedConcurrence || !associatedTask || !associatedJob) {
      return null;
    }

    const associatedTaskId = String(associatedTask.id);
    const associatedJobId = String(associatedJob.id);
    const associatedConcurrenceId = String(associatedConcurrence.id);

    // Stop currently running task to start modification
    stopCronTask(associatedTaskId);

    const concurrenceObj = parseConcurrenceObj(concurrence);

    // Update concurrence form data
    await associatedConcurrence.update(concurrenceObj);

    const { nextExecutionDate } = await setupOrUpdateJob({
      user,
      concurrence,
      startDate,
      startDateOnly: true,
      jobName: JobTypes.CREATE_TRANSACTION,
      particularJobArgs: jobArgs,
      existingTaskId: associatedTaskId,
      existingJobId: associatedJobId,
    });

    return {
      nextExecutionDate,
      concurrenceId: associatedConcurrenceId,
      taskId: associatedTaskId,
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export default upsertConcurrence;
