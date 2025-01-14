import Concurrence from '@/src/database/models/concurrence';
import { User } from '@/src/database/models';
import {
  type Concurrence as ConcurrenceType,
} from '../types';
import parseConcurrenceObj from './parseConcurrenceObj';

interface CreationParams {
  concurrence: ConcurrenceType,
  user: User
}

async function createConcurrence({ concurrence, user }: CreationParams) {
  try {
    const parsedConcurrenceObject = parseConcurrenceObj(concurrence);

    const newConcurrence = await Concurrence.create({
      ...parsedConcurrenceObject,
      userId: user.id,
    });

    return newConcurrence;
  } catch (error) {
    throw new Error('Error occurred while creating new Concurrence');
  }
}

export default createConcurrence;
