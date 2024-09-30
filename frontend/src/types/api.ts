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
