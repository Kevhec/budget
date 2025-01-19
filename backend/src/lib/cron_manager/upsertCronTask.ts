import { User } from '@/src/database/models';
import CronTask from '@/src/database/models/cronTask';

interface Params {
  user: User,
  data: {
    cronExpression?: string
    endDate?: Date
    timezone?: string
  }
  taskId?: string
}

async function upsertCronTask({
  user,
  data,
  taskId,
}: Params) {
  try {
    if (taskId) {
      await CronTask.update({
        ...data,
      }, {
        where: {
          id: taskId,
          userId: user.id,
        },
      });

      return taskId;
    }

    const newTask = await CronTask.create({
      ...data,
      userId: user.id,
    });

    return newTask.id;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(`Error while upserting cron task: ${error.message}`);
  }
}

export default upsertCronTask;
