import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserDetailState } from './user.state';

export const USER_STATE_NAME = 'userDetail';

const getUserState =
    createFeatureSelector<UserDetailState>(USER_STATE_NAME);

export const getUsers = createSelector(
    getUserState,
    (state) => state.users
);

export const getSelectedUser = createSelector(
    getUserState,
    (state) => state.selectedUser
);

export const getUserLoading = createSelector(
    getUserState,
    (state) => state.loading
);

export const getUserError = createSelector(
    getUserState,
    (state) => state.error
);

export const getUserSuccessMessage = createSelector(
    getUserState,
    (state) => state.successMessage
);

export const getUserById = (id: number) =>
    createSelector(
        getUsers,
        (users) => users.find((user) => user.id === id) || null
    );

export const getUsersWithLoading = createSelector(
    getUsers,
    getUserLoading,
    (users, loading) => ({ users, loading })
);

export const getUsersWithMessages = createSelector(
    getUsers,
    getUserError,
    getUserSuccessMessage,
    getUserLoading,
    (users, error, successMessage, loading) => ({
        users,
        error,
        successMessage,
        loading,
    })
);
