import Concurrence from '@/src/database/models/concurrence';
import { User } from '@/src/database/models';
import {
  DefaultConcurrences, MonthSelect, WeekDays, type Concurrence as ConcurrenceType,
} from '../types';

interface CreationParams {
  concurrence: ConcurrenceType,
  user: User
}

async function createConcurrence({ concurrence, user }: CreationParams) {
  try {
    const newConcurrence = await Concurrence.create({
      ...concurrence,
      defaults: concurrence.defaults as DefaultConcurrences,
      weekDay: concurrence.weekDay as WeekDays,
      monthSelect: concurrence.monthSelect as MonthSelect,
      endDate: concurrence.endDate ? new Date(concurrence.endDate) : undefined,
      time: new Date(concurrence.time),
      withEndDate: concurrence.withEndDate === 'true',
      userId: user.id,
    });

    return newConcurrence;
  } catch (error) {
    throw new Error('Error occurred while creating new Concurrence');
  }
}

export default createConcurrence;
