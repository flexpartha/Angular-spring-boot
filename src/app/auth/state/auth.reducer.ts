import { Action, createReducer, on } from "@ngrx/store";
import { AuthState, initialState } from "./auth.state";
import { loginFail, loginSuccess, logout } from "./auth.action";


const _authReducer = createReducer(
    initialState,
    on(loginSuccess, (state, action) => ({
        ...state,
        user: action.user,
        successMessage: 'Login successful!',
        errorMessage: null,
        statusCode: action.statusCode
    })),
    on(loginFail, (state, action) => ({
        ...state,
        errorMessage: action.error,
        successMessage: null,
        statusCode: action.statusCode
    })),
    on(logout, () => initialState)

);

export function authReducer(state: AuthState | undefined, action: Action) {
    return _authReducer(state, action);
}