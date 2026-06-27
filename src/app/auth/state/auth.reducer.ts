import { Action, createReducer, on } from "@ngrx/store";
import { AuthState, initialState } from "./auth.state";
import { User } from "../models/user.interface";
import { loginFail, loginStart, loginSuccess, logout, sessionExpired, refreshSuccess, refreshFail, googleLoginStart, googleLoginSuccess, googleLoginFail } from "./auth.action";


const _authReducer = createReducer(
    initialState,
    on(loginStart, (state) => ({ ...state, isLoading: true, errorMessage: null, successMessage: null, statusCode: null })),
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
    on(logout, sessionExpired, () => initialState),

    on(refreshSuccess, (state, action) => {
        const updatedUser: User = {
            accessToken: action.accessToken,
            //refreshToken: action.refreshToken ?? state.user?.refreshToken
        };
        return { ...state, user: updatedUser, successMessage: null, errorMessage: null };
    }),

    on(refreshFail, (state) => ({ ...state, errorMessage: null, successMessage: null })),

    on(googleLoginStart, (state) => ({ ...state, isLoading: true, errorMessage: null, successMessage: null, statusCode: null })),

    on(googleLoginSuccess, (state, action) => ({
        ...state,
        user: action.user,
        successMessage: 'Google login successful!',
        errorMessage: null,
        statusCode: action.statusCode,
        isLoading: false
    })),

    on(googleLoginFail, (state, action) => ({
        ...state,
        errorMessage: action.error,
        successMessage: null,
        statusCode: action.statusCode,
        isLoading: false
    }))

);

export function authReducer(state: AuthState | undefined, action: Action) {
    return _authReducer(state, action);
}