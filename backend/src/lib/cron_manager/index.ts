import loadCronTasks from './taskLoader';

async function startCronManager() {
  console.log('[Server] Starting cron task manager');
  await loadCronTasks();
  console.log('[Server] Cron tasks initialized');
}

export default startCronManager;
