import { Ordinals, WeekDays } from './common';
import { OccurrenceType } from './recurrence';

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
