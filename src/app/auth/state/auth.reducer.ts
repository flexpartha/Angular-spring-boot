import { Action, createReducer, on } from "@ngrx/store";
import { AuthState, initialState } from "./auth.state";
import { loginFail, loginStart, loginSuccess, logout } from "./auth.action";


const _authReducer = createReducer(
    initialState,
    on(loginStart, (state) => ({ ...state, isLoading: true, errorMessage: null })),
    on(loginSuccess, (state, action) => ({
        ...state,
        user: action.user,
        successMessage: 'Login successful!',
        errorMessage: null,
        statusCode: action.statusCode,
        isLoading: false
    })),
    on(loginFail, (state, action) => ({
        ...state,
        errorMessage: action.error,
        successMessage: null,
        statusCode: action.statusCode,
        isLoading: false
    })),
    on(logout, () => initialState)

);

export function authReducer(state: AuthState | undefined, action: Action) {
    return _authReducer(state, action);
}