import { Reducer } from 'react';
import { ApiResponse } from './api';
import { FinishedAsyncAction, LoadingAction } from './common';

export interface User {
  id: string | null
  username: string | null
  role: string | null
  confirmed: boolean
  email?: string
  createdAt: string
  updatedAt: string
}

export interface AuthLoginGuest {
  username: string
}

export interface AuthLoginUser {
  email: string
  password: string
}

export interface AuthSignUpUser {
  username: string
  email: string
  birthday: Date
  password: string
  repeatPassword: string
}

export type AuthResponse = ApiResponse<User>;

export enum AuthActionType {
  LOGIN = 'LOGIN',
  LOGIN_GUEST = 'LOGIN_GUEST',
  SIGN_UP = 'SIGN_UP',
  LOGOUT = 'LOGOUT',
  SET_ERROR = 'SET_ERROR',
  SET_LOADING = 'SET_LOADING',
  VERIFY_ACCOUNT = 'VERIFY_ACCOUNT',
  SET_MESSAGE = 'SET_MESSAGE',
  SET_FINISHED_ASYNC_ACTION = 'SET_FINISHED_ASYNC_ACTION',
}

export interface SignUpAction {
  type: AuthActionType.SIGN_UP,
}

export interface SetErrorAction {
  type: AuthActionType.SET_ERROR
  payload: string
}

export interface SetMessageAction {
  type: AuthActionType.SET_MESSAGE
  payload: string
}

export interface LoginAction {
  type: AuthActionType.LOGIN
  payload: User
}

export interface LoginGuestAction {
  type: AuthActionType.LOGIN_GUEST
  payload: User
}

export interface LogoutAction {
  type: AuthActionType.LOGOUT
}

export interface VerifyTokenAction {
  type: AuthActionType.VERIFY_ACCOUNT
}

export type AuthAction =
  | LoginAction
  | LoginGuestAction
  | SignUpAction
  | LogoutAction
  | SetErrorAction
  | SetMessageAction
  | LoadingAction<AuthActionType.SET_LOADING>
  | FinishedAsyncAction<AuthActionType.SET_FINISHED_ASYNC_ACTION>;

export interface AuthState {
  user: User
  loading: boolean
  finishedAsyncAction: boolean
  message: string
  error: string
}

export interface AuthContextType {
  state: AuthState
  logout: () => void
  signUp: (credentials: AuthSignUpUser) => void
  loginGuest: (credentials: AuthLoginGuest) => void
  login: (credentials: AuthLoginUser) => void
  verifyToken: (token: string) => void
}

export type AuthReducer = Reducer<AuthState, AuthAction>;
