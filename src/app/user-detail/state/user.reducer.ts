import { Action, createReducer, on } from '@ngrx/store';
import { UserDetailState, initialUserState } from './user.state';
import * as UserActions from './user.action';

const _userReducer = createReducer(
    initialUserState,

    // Load Users
    on(UserActions.loadUsers, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),

    on(UserActions.loadUsersSuccess, (state, action) => ({
        ...state,
        users: action.users,
        loading: false,
        error: null,
    })),

    on(UserActions.loadUsersFail, (state, action) => ({
        ...state,
        loading: false,
        error: action.error,
    })),

    // Add User
    on(UserActions.addUser, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),

    on(UserActions.addUserSuccess, (state, action) => ({
        ...state,
        users: [...state.users, action.user],
        loading: false,
        successMessage: 'User added successfully',
        error: null,
    })),

    on(UserActions.addUserFail, (state, action) => ({
        ...state,
        loading: false,
        error: action.error,
    })),

    // Update User
    on(UserActions.updateUser, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),

    on(UserActions.updateUserSuccess, (state, action) => ({
        ...state,
        users: state.users.map((user) =>
            user.id === action.user.id ? action.user : user
        ),
        selectedUser: null,
        loading: false,
        successMessage: 'User updated successfully',
        error: null,
    })),

    on(UserActions.updateUserFail, (state, action) => ({
        ...state,
        loading: false,
        error: action.error,
    })),

    // Delete User
    on(UserActions.deleteUser, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),

    on(UserActions.deleteUserSuccess, (state, action) => ({
        ...state,
        users: state.users.filter((user) => user.id !== action.id),
        loading: false,
        successMessage: 'User deleted successfully',
        error: null,
    })),

    on(UserActions.deleteUserFail, (state, action) => ({
        ...state,
        loading: false,
        error: action.error,
    })),

    // Select User
    on(UserActions.selectUser, (state, action) => ({
        ...state,
        selectedUser: action.user,
    })),

    // Clear Selected User
    on(UserActions.clearSelectedUser, (state) => ({
        ...state,
        selectedUser: null,
    })),

    // Clear Messages
    on(UserActions.clearMessages, (state) => ({
        ...state,
        error: null,
        successMessage: null,
    }))
);

export function userReducer(
    state: UserDetailState | undefined,
    action: Action
) {
    return _userReducer(state, action);
}
