import { Dispatch } from 'react';
import {
  AuthAction, AuthActionType, AuthLoginGuest, AuthLoginUser, AuthResponse,
} from '@/types';
import axiosClient from '@/config/axios';

async function login(dispatch: Dispatch<AuthAction>, credentials: AuthLoginUser) {
  dispatch({ type: AuthActionType.SET_LOADING, payload: true });
  try {
    const { data } = await axiosClient.post<AuthResponse>('/user/login', {
      email: credentials.email,
      password: credentials.password,
    });

    dispatch({
      type: AuthActionType.LOGIN,
      payload: data.data,
    });
  } catch (error: any) {
    throw new Error(error.response.data.message);
  } finally {
    dispatch({ type: AuthActionType.SET_LOADING, payload: false });
  }
}

async function loginGuest(dispatch: Dispatch<AuthAction>, credentials: AuthLoginGuest) {
  dispatch({ type: AuthActionType.SET_LOADING, payload: true });
  try {
    const { data } = await axiosClient.post<AuthResponse>('/user/guest', {
      username: credentials.username,
    });

    dispatch({
      type: AuthActionType.LOGIN_GUEST,
      payload: data.data,
    });
  } catch (error: any) {
    throw new Error(error.response.data.message);
  } finally {
    dispatch({ type: AuthActionType.SET_LOADING, payload: false });
  }
}

async function logout(dispatch: Dispatch<AuthAction>) {
  dispatch({ type: AuthActionType.SET_LOADING, payload: true });
  try {
    await axiosClient.post('/user/logout');

    dispatch({
      type: AuthActionType.LOGOUT,
    });
  } catch (error: any) {
    throw new Error(error.response.data.message);
  } finally {
    dispatch({ type: AuthActionType.SET_LOADING, payload: false });
  }
}

async function checkAuth(dispatch: Dispatch<AuthAction>) {
  dispatch({ type: AuthActionType.SET_LOADING, payload: true });
  try {
    const { data } = await axiosClient.get<AuthResponse>('/user/');

    dispatch({
      type: AuthActionType.LOGIN,
      payload: data.data,
    });
  } catch (error: any) {
    throw new Error(error.response.data.message);
  } finally {
    dispatch({ type: AuthActionType.SET_LOADING, payload: false });
  }
}

export {
  login,
  loginGuest,
  logout,
  checkAuth,
};
