import cron, { ScheduledTask } from 'node-cron';
import CronTask from '@/src/database/models/cronTask';
import { JobParams, JobTypes } from '../types';
import { createBudget as createBudgetJob } from '../jobs';

export interface Job {
  jobName: JobTypes
  jobArgs: JobParams<typeof jobsMapping>
}

interface Params {
  cronExpression: string
  endDate?: Date
  timezone: string
  taskId: string
  jobs: Job[]
}

const activeTasks = new Map<string, ScheduledTask>();

const jobsMapping = {
  'create-budget': createBudgetJob,
};

async function scheduleCronTask({
  cronExpression,
  timezone,
  endDate,
  taskId,
  jobs,
}: Params) {
  try {
    if (!cron.validate(cronExpression)) {
      throw new Error('Invalid cron expression');
    }

    const task = await CronTask.findByPk(taskId);
    if (!task) throw new Error(`Task with ID ${taskId} not found.`);

    const cronTask = cron.schedule(
      cronExpression,
      async () => {
        const now = new Date();

        if (endDate && endDate < now) {
          cronTask.stop();
          await task.update({
            isFinished: true,
          });
        }

        try {
          await Promise.all(
            jobs.map(async (job) => {
              const { jobArgs, jobName } = job;
              const jobFunction = jobsMapping[jobName];

              if (jobFunction) {
                await jobFunction({
                  ...jobArgs,
                  startDate: now,
                });
              } else {
                console.error(`No job function found for name: ${jobName}`);
              }
            }),
          );
        } catch (error) {
          console.error(`Error executing jobs for task ${taskId}:`, error);
        }
      },
      {
        timezone,
      },
    );

    activeTasks.set(taskId, cronTask);
  } catch (error) {
    console.error(`Error scheduling task ${taskId}:`, error);
  }
}

async function stopCronTask(taskId: string) {
  try {
    const task = await CronTask.findByPk(taskId);
    if (!task) throw new Error(`Task with ID ${taskId} not found.`);

    task.update({
      isFinished: true,
    });

    const activeTask = activeTasks.get(taskId);
    if (activeTask) {
      activeTask.stop();
      activeTasks.delete(taskId);
    }
  } catch (error) {
    console.log(`No active task found with ID: ${taskId}`);
  }
}

export {
  scheduleCronTask,
  stopCronTask,
};
