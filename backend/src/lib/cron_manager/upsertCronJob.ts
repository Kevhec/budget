import { User } from '@/src/database/models';
import CronJob from '@/src/database/models/cronJobs';
import { JobTypes, JSONValue } from '../types';

interface Params {
  user: User
  data: {
    jobName: JobTypes
    jobArgs: JSONValue
  }
  taskId: string
  jobId?: string
}

async function upsertCronJob({
  user,
  data,
  taskId,
  jobId,
}: Params) {
  try {
    if (jobId) {
      await CronJob.update({
        ...data,
        cronTaskId: taskId,
      }, {
        where: {
          id: taskId,
          userId: user.id,
        },
      });

      const updatedJob = await CronJob.findByPk(jobId);

      return updatedJob;
    }

    const newJob = await CronJob.create({
      ...data,
      cronTaskId: taskId,
      userId: user.id,
    });

    return newJob;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(`Error while upserting cron task: ${error.message}`);
  }
}

export default upsertCronJob;
