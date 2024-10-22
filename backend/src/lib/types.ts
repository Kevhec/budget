import { Request } from 'express';

export interface BalanceResponse {
  year: string
  month: string
  totalIncome: number
  totalExpense: number
  balance: number
}

export interface TypedRequest<T> extends Request {
  body: T
}

export type MonthData = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

export enum OccurrenceType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  SEMESTRIAL = 'semestrial',
  YEARLY = 'yearly',
}

export interface Concurrence {
  type: OccurrenceType,
  steps: number,
}

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

export interface TimeRecurrence {
  hour: number
  minute: number
  timezone: string
}

export type YearData = Record<string, MonthData>;

export type BalanceData = Record<string, YearData>;

export interface Recurrence {
  endDate?: string
  concurrence: Concurrence
  weekDay: {
    value: WeekDays
    ordinal: Ordinals
  }
  time: TimeRecurrence
}

export interface CreateBudgetParams {
  name: string,
  totalAmount: number,
  startDate: Date,
  endDate?: Date,
  intervalMilliseconds?: number
  datesOffset?: string | number
  userId: string,
  cronTaskId: string | null,
}

export enum JobTypes {
  CREATE_BUDGET = 'create-budget',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JobParams<M extends Record<string, (...args: any) => any>> = {
  [K in keyof M]: Parameters<M[K]>[0];
}[keyof M];

export interface CreateBudgetRequestBody {
  name: string
  totalAmount: number
  startDate: string
  endDate: string
  recurrence: Recurrence
}
