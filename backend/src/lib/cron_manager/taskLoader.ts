import CronTask from '@/src/database/models/cronTask';
import CronJob from '@/src/database/models/cronJobs';
import { Job, scheduleCronTask } from './taskScheduler';

async function loadCronTasks() {
  try {
    const tasks = await CronTask.findAll({
      where: {
        isFinished: false,
      },
      include: [
        {
          model: CronJob,
          as: 'cronJobs',
        },
      ],
    });

    tasks.forEach((task) => {
      const {
        cronExpression,
        timeZone,
        endDate,
        cronJobs,
      } = task;

      if (!cronJobs) {
        throw new Error('No jobs associated to provided task');
      }

      scheduleCronTask({
        cronExpression,
        timezone: timeZone,
        endDate,
        taskId: task.id,
        jobs: cronJobs as unknown as Job[],
      });
    });
  } catch (error) {
    throw new Error('Error loading cron tasks');
  }
}

export default loadCronTasks;
