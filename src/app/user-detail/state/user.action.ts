import { createAction, props } from '@ngrx/store';
import { User } from '../models/user-list.interface';

// Load Users
export const LOAD_USERS = '[UserDetail] Load Users';
export const LOAD_USERS_SUCCESS = '[UserDetail] Load Users Success';
export const LOAD_USERS_FAIL = '[UserDetail] Load Users Fail';

export const loadUsers = createAction(LOAD_USERS);

export const loadUsersSuccess = createAction(
    LOAD_USERS_SUCCESS,
    props<{ users: User[] }>()
);

export const loadUsersFail = createAction(
    LOAD_USERS_FAIL,
    props<{ error: string }>()
);

// Add User
export const ADD_USER = '[UserDetail] Add User';
export const ADD_USER_SUCCESS = '[UserDetail] Add User Success';
export const ADD_USER_FAIL = '[UserDetail] Add User Fail';

export const addUser = createAction(
    ADD_USER,
    props<{ user: Omit<User, 'id'> }>()
);

export const addUserSuccess = createAction(
    ADD_USER_SUCCESS,
    props<{ user: User }>()
);

export const addUserFail = createAction(
    ADD_USER_FAIL,
    props<{ error: string }>()
);

// Update User
export const UPDATE_USER = '[UserDetail] Update User';
export const UPDATE_USER_SUCCESS = '[UserDetail] Update User Success';
export const UPDATE_USER_FAIL = '[UserDetail] Update User Fail';

export const updateUser = createAction(
    UPDATE_USER,
    props<{ user: User }>()
);

export const updateUserSuccess = createAction(
    UPDATE_USER_SUCCESS,
    props<{ user: User }>()
);

export const updateUserFail = createAction(
    UPDATE_USER_FAIL,
    props<{ error: string }>()
);

// Delete User
export const DELETE_USER = '[UserDetail] Delete User';
export const DELETE_USER_SUCCESS = '[UserDetail] Delete User Success';
export const DELETE_USER_FAIL = '[UserDetail] Delete User Fail';

export const deleteUser = createAction(
    DELETE_USER,
    props<{ id: number }>()
);

export const deleteUserSuccess = createAction(
    DELETE_USER_SUCCESS,
    props<{ id: number }>()
);

export const deleteUserFail = createAction(
    DELETE_USER_FAIL,
    props<{ error: string }>()
);

// Select User (for edit)
export const SELECT_USER = '[UserDetail] Select User';

export const selectUser = createAction(
    SELECT_USER,
    props<{ user: User }>()
);

// Clear Selected User
export const CLEAR_SELECTED_USER = '[UserDetail] Clear Selected User';

export const clearSelectedUser = createAction(CLEAR_SELECTED_USER);

// Clear Messages
export const CLEAR_MESSAGES = '[UserDetail] Clear Messages';

export const clearMessages = createAction(CLEAR_MESSAGES);
