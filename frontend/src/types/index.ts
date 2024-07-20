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
