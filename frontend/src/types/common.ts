import { DEFAULT_CONCURRENCES } from '@/lib/constants';
import type { CreateBudgetParams } from './budget';
import type { CreateTransactionParams } from './transaction';
import { OccurrenceType } from './recurrence';

export type Months =
'enero' |
'febrero' |
'marzo' |
'abril' |
'junio' |
'julio' |
'agosto' |
'septiembre' |
'octubre' |
'noviembre' |
'diciembre';

export enum WeekDays {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export enum Ordinals {
  FIRST = 'first',
  SECOND = 'second',
  THIRD = 'third',
  FOURTH = 'fourth',
  FIFTH = 'fifth',
}

export interface LoadingAction<T> {
  type: T
  payload: boolean
}

export interface FinishedAsyncAction<T> {
  type: T
  payload: boolean
}

export type FormProps<T> = {
  onSubmit: (data: T) => void | Promise<void>;
  formId: string
};

export type CreationParamsUnion =
  | CreateBudgetParams
  | CreateTransactionParams;

export type DefaultConcurrency = typeof DEFAULT_CONCURRENCES[number];

export interface ConcurrenceFormData {
  concurrenceDefault: DefaultConcurrency
  concurrenceType: OccurrenceType,
  concurrenceSteps: number,
  concurrenceWeekDay: WeekDays,
  concurrenceTime: Date,
  concurrenceMonthSelect: 'exact' | 'ordinal'
  concurrenceEndDate: Date
}
