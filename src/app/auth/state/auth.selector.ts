import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./auth.state";

export const AUTH_STATE_NAME = 'auth';

const getAuthState = createFeatureSelector<AuthState>(AUTH_STATE_NAME);

export const isAuthenticated = createSelector(getAuthState, (state) => {
    return !!state.user;
});

export const getAuthToken = createSelector(getAuthState, (state) => {
    return state.user ? state.user.token : null;
});

export const getAuthErrorMessage = createSelector(getAuthState, (state) => {
    return state.errorMessage;
});

// export const getAuthSuccessMessage = createSelector(getAuthState, (state) => {
//     return state.successMessage;
// });

// export const getAuthStatusCode = createSelector(getAuthState, (state) => {
//     return state.statusCode;
// });

export const getAuthMessage = createSelector(getAuthState, (state) => ({
    message: state.statusCode && state.statusCode >= 200 && state.statusCode < 300
        ? state.successMessage
        : state.errorMessage,
    statusCode: state.statusCode
}));