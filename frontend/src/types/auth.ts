import { Reducer } from 'react';
import { ApiResponse } from './api';
import { LoadingAction } from './common';

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

export type AuthResponse = ApiResponse<User>;

export interface AuthContextType {
  state: AuthState
  logout: () => void
  loginGuest: (credentials: AuthLoginGuest) => void
  login: (credentials: AuthLoginUser) => void
}

export enum AuthActionType {
  LOGIN = 'LOGIN',
  LOGIN_GUEST = 'LOGIN_GUEST',
  LOGOUT = 'LOGOUT',
  SET_LOADING = 'SET_LOADING',
}

export interface LoginAction {
  type: AuthActionType.LOGIN,
  payload: User,
}

export interface LoginGuestAction {
  type: AuthActionType.LOGIN_GUEST,
  payload: User,
}

export interface LogoutAction {
  type: AuthActionType.LOGOUT
}

export type AuthAction =
  | LoginAction
  | LoginGuestAction
  | LogoutAction
  | LoadingAction<AuthActionType.SET_LOADING>;

export interface AuthState {
  user: User
  loading: boolean
}

export type AuthReducer = Reducer<AuthState, AuthAction>;
