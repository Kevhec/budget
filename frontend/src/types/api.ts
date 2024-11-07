import { Ordinals, WeekDays } from './common';
import { OccurrenceType } from './recurrence';
import type { TransactionType } from './transaction';

export interface ApiResponse<T> {
  status: string
  data: T
}

export interface PaginatedApiResponse<T> {
  status?: number,
  data?: T,
  meta?: {
    totalItems: number,
    itemCount: number,
    itemsPerPage: number,
    totalPages: number,
    currentPage: number,
  },
  links?: {
    first?: string,
    previous?: string,
    next?: string,
    last?: string,
  },
}

export type LinksData = PaginatedApiResponse<any>['links'];

export type MetaData = PaginatedApiResponse<any>['meta'];

export interface ApiError {
  status: string
  error: string
}

export interface ApiMessage {
  message: string
}

export type MessageResponse = ApiResponse<ApiMessage>;

export interface ApiRecurrence {
  concurrence: {
    type: OccurrenceType
    steps: number
  }
  weekDay?: {
    value?: WeekDays
    ordinal?: Ordinals
  }
  time: {
    hour: number
    minute: number
    timezone: string
  }
  endDate?: Date
}

export interface ApiBudget {
  name: string
  totalAmount: number
  startDate: Date
  endDate?: Date
  recurrence?: ApiRecurrence
}

export interface ApiTransaction {
  description: string
  amount: number
  date: string
  type: TransactionType
  budgetId?: string
  categoryId?: string
  recurrence?: ApiRecurrence
}
