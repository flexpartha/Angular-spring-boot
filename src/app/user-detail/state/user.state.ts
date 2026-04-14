import { User } from '../models/user-list.interface';

export const USER_LIST_FEATURE_KEY = 'UserList'; //DEFINE FEATURE KEY NAME WHEN USE NGRX STANDALONE STORE

export interface UserDetailState {
    users: User[];
    selectedUser: User | null;
    loading: boolean;
    error: string | null;
    successMessage: string | null;
}

export const initialUserState: UserDetailState = {
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
    successMessage: null,
};
