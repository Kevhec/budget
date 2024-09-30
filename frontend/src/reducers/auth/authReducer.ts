import {
  AuthAction, AuthActionType, AuthState,
} from '@/types';

const initialAuthState: AuthState = {
  user: {
    id: null,
    username: null,
    role: null,
    confirmed: false,
  },
  loading: false,
};

function authReducer(state: AuthState, action: AuthAction) {
  switch (action.type) {
    case AuthActionType.LOGIN:
      return ({
        ...state,
        user: action.payload,
        loading: false,
      });
    case AuthActionType.LOGIN_GUEST:
      return ({
        ...state,
        user: action.payload,
        loading: false,
      });
    case AuthActionType.LOGOUT:
      return (initialAuthState);
    case AuthActionType.SET_LOADING:
      return ({
        ...state,
        loading: action.payload,
      });
    default:
      return state;
  }
}

export {
  initialAuthState,
  authReducer,
};
