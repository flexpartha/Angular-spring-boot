import { createAction, props } from "@ngrx/store";
import { User } from "../models/user.interface";

export const LOGIN_ACTION_START = '[auth page], Login start';
export const LOGIN_ACTION_SUCCESS = '[auth page], Login success';
export const LOGIN_ACTION_FAIL = '[auth page], Login fail';
export const LOGOUT_ACTION = '[auth page], Logout';

export const loginStart = createAction(
    LOGIN_ACTION_START,
    props<{ username: string; email: string }>()
);
export const loginSuccess = createAction(
    LOGIN_ACTION_SUCCESS,
    props<{ user: User, redirect: boolean, statusCode: number }>()
);

export const loginFail = createAction(
    LOGIN_ACTION_FAIL,
    props<{ error: string, statusCode: number }>()
);

export const logout = createAction(LOGOUT_ACTION);