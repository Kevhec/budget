export interface ApiResponse<T> {
  status: string
  data: T
}

export interface ApiError {
  status: string
  error: string
}

export interface ApiMessage {
  message: string
}

export interface User {
  id: string | null
  username: string | null
  role: string | null
  confirmed: boolean
  email?: string
}

export type AuthResponse = ApiResponse<User>;
export type MessageResponse = ApiResponse<ApiMessage>;

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

export interface Category {
  id: number;
  name: string;
  color: string;
  userId: string;
  updatedAt: Date;
  createdAt: Date;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: TransactionType;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  budgetId: number;
  category: Category | null;
  hidden?: boolean
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
